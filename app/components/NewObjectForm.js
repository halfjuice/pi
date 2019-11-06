import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { createObject, getObjectByID, searchObjects } from '../../models/client';
import { tuples2obj, obj2tuples } from '../utils/helper';
import ObjectSearchDropdown from '../components/ObjectSearchDropdown';
import { Popup, Button, Modal } from 'semantic-ui-react';

export default class NewObjectForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: null,
      value: {type: props.typeID, name: ''},
    };
  }

  componentDidMount() {
    getObjectByID(this.props.typeID).then(r => this.setState({type: r}));
  }

  render() {
    return (
      <div>
        <div className="ui top attached header">New Object</div>
        <div className="ui attached form segment">
          <div className="two fields">
            <div className="field">
              <b>ID</b>
            </div>
            <div className="field">&lt;Assigned&gt;</div>
          </div>
          {this.state.type
            ? <div className="two fields">
                <div className="field">
                  <b>Type</b>
                </div>
                <div className="field">
                  <Link to={'/view_type/' + this.state.type['_id']}>{this.state.type['name']}</Link>
                </div>
              </div>
            : null}
          <div className="two fields">
            <div className="field">
              <b>Name</b>
            </div>
            <div className="field">
              <input
                placeholder="Object Name"
                value={this.state.value.name}
                onChange={v => this.handleFieldValueChange(v.target.value, 'name')}
              />
            </div>
          </div>
          {obj2tuples(this.state.type).map((tup, i) =>
            tup[0] == '_id' || tup[0] == 'type' || tup[0] == 'name'
              ? null
              : <div key={`field_${i}`} className="two fields">
                  <div className="field">
                    <b>{tup[0]}</b>
                  </div>
                  <div className="field">
                    {this.renderValueInput(tup)}
                  </div>
                </div>
          )}
          <button
            className="ui positive button"
            onClick={() => this.handleSubmit()}
          >
            Create
          </button>
        </div>
      </div>
    );
  }

  renderValueInput(tup) {
    if (tup[1] == 'text') {
      return (
        <input
          placeholder={`${tup[0]} Value`}
          value={this.state.value[tup[0]] || ''}
          onChange={v => this.handleFieldValueChange(v.target.value, tup[0])}
        />
      );
    } else if (tup[1] == 'datetime') {
      console.log(this.state.value[tup[0]]);
      console.log(new Date(this.state.value[tup[0]]));
      return (
        <input
          type="datetime-local"
          placeholder={`${tup[0]} Value`}
          value={moment(this.state.value[tup[0]]).format('YYYY-MM-DDTHH:mm') || 0}
          onChange={v => this.handleFieldValueChange(new Date(v.target.value).getTime(), tup[0])}
        />
      );
    } else if (tup[1] == 'color') {
      return (
        <input
          type="color"
          value={this.state.value[tup[0]] || ''}
          onChange={v => this.handleFieldValueChange(v.target.value, tup[0])}
        />
      );
    } else if (tup[1].fieldType == 'relation') {
      return (
        <div>
          <ObjectSearchDropdown
            fluid
            placeholder={`${tup[0]} Value (Related Object)`}
            onChange={v => this.handleFieldValueChange(v, tup[0])}
            onSearch={txt => searchObjects(tup[1].objectType, txt, 0, 5)}
          />

          <Popup content='Create new object to relate to' trigger={
            <Button
              onClick={() => this.setState({[`modalOpenFor${tup[0]}`]: true})}
              icon='add'
            />
          } />

          <Modal
            open={this.state['modalOpenFor' + tup[0]] || false}
            onClose={() => this.setState({[`modalOpenFor${tup[0]}`]: false})}>
            <Modal.Header>Create object</Modal.Header>
            <Modal.Content>
              <NewObjectForm typeID={tup[1].objectType} />
            </Modal.Content>
          </Modal>
        </div>
      )
    } else if (tup[1].fieldType == 'multi_relation') {
      return (
        <ObjectSearchDropdown
          placeholder={`${tup[0]} Value (Related Objects)`}
          onChange={v => this.handleFieldValueChange(v, tup[0])}
          onSearch={txt => searchObjects(tup[1].objectType, txt, 0, 5)}
          multiple
          fluid
        />
      )
    } else {
      return <p>Unknown field {tup[1]}</p>;
    }
  }

  handleFieldValueChange(v, k) {
    const vv = this.state.value;
    vv[k] = v;
    this.setState({ value: vv });
  }

  handleSubmit() {
 	  createObject(this.state.value).then((res, err) => {
	    alert(JSON.stringify(res));
      this.setState({value: {type: this.props.typeID}});
	  });
  }
}
