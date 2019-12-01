import React from 'react';
import { Link } from 'react-router-dom';
import { getObjectByID, upsertObject, getCurrentUsername, createDummyData, createObject } from '../../models/client';
import { Modal } from 'semantic-ui-react';
import NewViewForm from '../components/NewViewForm';

class ShortcutItem extends React.Component {
  render() {
    return (
      <div className="center aligned column" style={{paddingTop: '16px'}}>
        <i className="big icons">
          <i className={`${this.props.bigIcon} icon`}></i>
          {this.props.smallIcon && <i className={`corner ${this.props.smallIcon} icon`}></i>}
        </i>
        <p>
          <Link to={this.props.to} onClick={this.props.onClick}>{this.props.name}</Link>
        </p>
      </div>
    );
  }
}

export default class MainScreenPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false,
      sections: {_id: 'sections', sections: []},
      views: {},

      onAddViewHandler: null,
    };
  }

  componentDidMount() {
    this.refresh();
  }

  refresh() {
    getObjectByID('sections').then(doc => {
      this.setState({sections: doc});
      doc.sections.forEach(sec => sec.items.forEach(i => getObjectByID(i).then(v => {
        this.state.views[i] = v;
        this.setState({views: this.state.views});
      })));
    }).catch(err => {
      if (err.name == 'not_found') {
        // Pass
      }
    });
  }

  render() {
    return (
      <div>
        <div className="ui menu">
          <div className="header item">
            <h3>Notely</h3>
          </div>
          <div className="right menu">
            <div className="item">
              <i className="large cog icon" />
            </div>
          </div>
        </div>

        <p style={{textAlign: 'right'}}>
          <div className="ui bulleted horizontal list">
            <a className="item" onClick={() => this.setState({editing: !this.state.editing}, () => {
              if (!this.state.editing) {
                upsertObject(this.state.sections).then(() => this.refresh());
              }
            })}>
              <i className={(this.state.editing ? 'save outline' : 'edit') + ' icon'} />
              {this.state.editing ? 'Save Layout' : 'Edit Layout'}
            </a>
            {this.state.editing &&
              <a className="item" onClick={() => {
                this.state.sections.sections.push({
                  name: 'New Section',
                  items: []
                });
                this.setState({sections: this.state.sections});
              }}>
                <i className="plus icon" />
                Add Section
              </a>}
          </div>
        </p>

        {this.state.sections.sections.map((sec, i) =>
          <div className="ui segment">
            {this.state.editing
              ?
                <span className="ui teal ribbon label">
                  <div className="ui mini form">
                    <input
                      type="text"
                      placeholder="Section Title"
                      value={sec.name}
                      onChange={v => {
                        this.state.sections.sections[i].name = v.target.value;
                        this.setState({sections: this.state.sections});
                      }}
                    />
                  </div>
                </span>
              : <span className="ui teal ribbon label">{sec.name}</span>
            }

            <div className="ui grid">
              <div className="four column row">
                {sec.items.map(i => this.state.views[i]).map(v =>
                  v &&
                    <ShortcutItem
                      bigIcon={'grey ' + NewViewForm.allViewTypeSpecs()[v.viewType].icon}
                      to={`/view/${v._id}`}
                      name={v.name}
                    />
                )}

                {this.state.editing &&
                  <ShortcutItem
                    bigIcon="grey plus"
                    onClick={() => {
                      this.setState({onAddViewHandler: view => {
                        createObject(view).then(res => {
                          this.state.sections.sections[i].items.push(res.id);
                          view._id = res.id;
                          this.state.views[res.id] = view;
                          this.setState({sections: this.state.sections, views: this.state.views, onAddViewHandler: null});
                        });
                      }})
                    }}
                    name="Add View"
                  />
                  }
              </div>
            </div>

            {this.state.editing &&
              <p style={{textAlign: 'right'}}>
                <div className="ui bulleted horizontal list">
                  <a className="item" onClick={() => {
                    this.state.sections.sections = this.state.sections.sections.slice(0, i).concat(
                      this.state.sections.sections.slice(i+1)
                    );
                    this.setState({sections: this.state.sections});
                  }}>
                    <i className="delete icon" />
                    Remove Section
                  </a>
                </div>
              </p>}
          </div>
        )}

        <div className="ui segment">
          <span className="ui olive ribbon label">Admin</span>
          <div className="ui grid">
            <div className="four column row">
              <ShortcutItem bigIcon="grey eye" smallIcon="olive add" to="/new_view" name="New View" />
              <ShortcutItem bigIcon="grey cubes" smallIcon="olive add" to="/new_type" name="New Type" />
              <ShortcutItem bigIcon="grey cubes" smallIcon="olive list" to="/all_types" name="All Types" />
              <ShortcutItem
                bigIcon="grey upload"
                onClick={() => {
                  if (confirm('Are you sure to create set of dummy data?')) {
                    createDummyData().then(() => alert('Success!'));
                  };
                }}
                name="Create Dummy Data"
              />
            </div>
          </div>

        </div>

        <Modal
          open={this.state.onAddViewHandler != null}
          onClose={() => this.setState({onAddViewHandler: null})}>
          <Modal.Header>Add View</Modal.Header>
          <Modal.Content>
            <NewViewForm onSubmit={this.state.onAddViewHandler} />
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}
