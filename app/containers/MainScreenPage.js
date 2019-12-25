import React from 'react';
import { Link } from 'react-router-dom';
import {
  getObjectByID,
  upsertObject,
  getCurrentUsername,
  createDummyData,
  createObject,
  deleteObject,
  logOut,
} from '../../models/client';
import { Dropdown, Modal } from 'semantic-ui-react';
import NewViewForm from '../components/NewViewForm';
import MultiQueryObjectTableView from '../components/MultiQueryObjectTableView';

class ShortcutItem extends React.Component {
  render() {
    return (
      <div className="center aligned column" style={{paddingTop: '16px'}}>
        <i className="big icons">
          <i className={`${this.props.bigIcon} icon`}></i>
          {this.props.smallIcon && <i className={`corner ${this.props.smallIcon} icon`}></i>}
        </i>
        <p>
          {this.props.to
            ? <Link to={this.props.to} onClick={this.props.onClick}>{this.props.name}</Link>
            : <a onClick={this.props.onClick}>{this.props.name}</a>
          }
          {
            this.props.secondaryName &&
              [
                <br/>,
                this.props.secondaryName
              ]
          }
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
      origSections: {_id: 'sections', sections: []},
      views: {},

      onAddViewHandler: null,
    };
  }

  componentDidMount() {
    this.refresh();
  }

  refresh() {
    getObjectByID('sections').then(doc => {
      this.setState({sections: doc, origSections: JSON.parse(JSON.stringify(doc))});
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

  handleAddSection() {
    this.state.sections.sections.push({
      name: 'New Section',
      items: []
    });
    this.setState({sections: this.state.sections});
  }

  handleAddSectionView(sectionIdx) {
    this.setState({onAddViewHandler: view => {
      var vid = `temp_view_${(new Date()).getTime()}`;
      this.state.views[vid] = view;
      this.state.sections.sections[sectionIdx].items.push(vid);
      this.setState({sections: this.state.sections, views: this.state.views, onAddViewHandler: null});
    }});
  }

  handleDeleteSectionView(sectionIdx, vid) {
    var i = this.state.sections.sections[sectionIdx].items.indexOf(vid);
    if (vid >= 0) {
      this.state.sections.sections[sectionIdx].items =
        this.state.sections.sections[sectionIdx].items.slice(0, i).concat(
          this.state.sections.sections[sectionIdx].items.slice(i+1)
        );
    }
    var vv = this.state.views[vid];
    delete this.state.views[vid];
    if (!vid.startsWith('temp_view_')) {
      deleteObject(vv);
    }
    // TODO: Pending delete logic
    this.setState({sections: this.state.sections, views: this.state.views});
  }

  handleRemoveSection(idx) {
    this.state.sections.sections = this.state.sections.sections.slice(0, idx).concat(
      this.state.sections.sections.slice(idx+1)
    );
    this.setState({sections: this.state.sections});
  }

  handleSaveLayout() {
    var pending = [];
    for (var k in this.state.views) {
      if (k.startsWith('temp_view_')) {
        var obj = this.state.views[k];
        pending.push(createObject(obj).then(o => {
          this.state.views[k]._id = o.id;
        }));
      }
    }
    Promise.all(pending).then(() => {
      this.state.sections.sections = this.state.sections.sections.map(sec => ({
        ...sec,
        items: sec.items.map(k => this.state.views[k]._id),
      }))
      upsertObject(this.state.sections).then(() => this.refresh());
    });
  }

  render() {
    return (
      <div>
        <div className="ui tiny menu">
          <div className="header item">
            <h4>Notely</h4>
          </div>
          <div className="right menu">
            <Link className="item" to="/community">
              <i className="comments icon" />
              Community
            </Link>
            <Dropdown item icon="cog" simple>
              <Dropdown.Menu>
                <Dropdown.Item>
                  Settings
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => logOut().then(() => this.props.onLoggedOut && this.props.onLoggedOut())}>
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        <p style={{textAlign: 'right'}}>
          <div className="ui bulleted horizontal list">
            <a className="item" onClick={() => this.setState({editing: !this.state.editing}, () => {
              if (!this.state.editing) {
                this.handleSaveLayout();
              }
            })}>
              <i className={(this.state.editing ? 'save outline' : 'edit') + ' icon'} />
              {this.state.editing ? 'Save Layout' : 'Edit Layout'}
            </a>
            {this.state.editing &&
              <a className="item" onClick={() => this.setState({editing: false, sections: this.state.origSections})}>
                <i className="plus icon" />
                Cancel Change
              </a>}
            {this.state.editing &&
              <a className="item" onClick={this.handleAddSection.bind(this)}>
                <i className="plus icon" />
                Add Section
              </a>}
          </div>
        </p>

        {this.state.sections.sections.map((sec, i) =>
          <div key={`section_${i}`} className="ui segment">
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
                {sec.items.map(vi =>
                  this.state.views[vi] &&
                  <ShortcutItem
                    key={`view_shortcut_${vi}`}
                    bigIcon={'grey ' + NewViewForm.allViewTypeSpecs()[this.state.views[vi].viewType].icon}
                    to={`/view/${vi}`}
                    name={this.state.views[vi].name}
                    secondaryName={
                      this.state.editing &&
                        <a onClick={() => this.handleDeleteSectionView(i, vi)}>
                          <i className="delete icon" />
                          Remove
                        </a>
                    }
                  />
                )}

                {this.state.editing &&
                  <ShortcutItem
                    bigIcon="teal plus"
                    onClick={() => this.handleAddSectionView(i)}
                    name="Add View"
                  />
                  }
              </div>
            </div>

            {this.state.editing &&
              <p style={{textAlign: 'right'}}>
                <div className="ui bulleted horizontal list">
                  <a className="item" onClick={() => this.handleRemoveSection(i)}>
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
              <ShortcutItem bigIcon="grey cubes" smallIcon="olive add" to="/new_type" name="New Type" />
              <ShortcutItem bigIcon="grey cubes" smallIcon="olive list" to="/all_types" name="All Types" />
              <ShortcutItem bigIcon="grey comments" smallIcon="olive cloud upload" to="/community_publish" name="Publish Model" />
              <ShortcutItem bigIcon="grey comments" smallIcon="olive list" to="/community_my" name="My Model" />
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

        <MultiQueryObjectTableView
          useFilter={true}
          spec={{
            source: 'ef0301b8-595a-41ab-a8f0-17764ae6b27a',
            fields: '轮次|被投企业|投资机构|金额1|币种|时间'.split('|'),
            joins: [
              {
                on: '被投企业',
                fields: ['所在城市', '简介'],
              }
            ],
          }}
          pageLimit={10}
        />
      </div>
    );
  }
}
