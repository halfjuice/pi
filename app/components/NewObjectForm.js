import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { createObject, getObjectByID, searchObjects, updateObject } from '../../models/client';
import { tuples2obj, obj2tuples } from '../utils/helper';
import ObjectSearchDropdown from '../components/ObjectSearchDropdown';
import { Popup, Button, Modal } from 'semantic-ui-react';

export default class NewObjectForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: null,
      value: props.object ? props.object : {type: props.typeID, name: ''},
    };
  }

  componentDidMount() {
    getObjectByID(this.props.typeID).then(r => this.setState({type: r}));
  }

  render() {
    return (
      <table className="ui form table">
        <tbody>
          <tr>
            <td className="six wide right aligned">
              <b>ID</b>
            </td>
            <td className="twelve wide">
              {this.props.object ? this.props.object._id : '<Assigned>'}
            </td>
          </tr>
          {this.state.type
            ? <tr>
                <td className="six wide right aligned">
                  <b>Type</b>
                </td>
                <td className="twelve wide">
                  <Link to={'/view_type/' + this.state.type['_id']}>{this.state.type['name']}</Link>
                </td>
              </tr>
            : null}
          <tr>
            <td className="six wide right aligned">
              <b>Name</b>
            </td>
            <td className="twelve wide">
              <input
                placeholder="Object Name"
                value={this.state.value.name}
                onChange={v => this.handleFieldValueChange(v.target.value, 'name')}
              />
            </td>
          </tr>
          {obj2tuples(this.state.type).map((tup, i) =>
            tup[0] == '_id' || tup[0] == 'type' || tup[0] == 'name'
              ? null
              : <tr key={`field_${i}`}>
                  <td className="six wide right aligned">
                    <b>{tup[0]}</b>
                  </td>
                  <td className="twelve wide">
                    {this.renderValueInput(tup)}
                  </td>
                </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan="2">
              <button
                className="ui right floated positive button"
                onClick={() => this.handleSubmit()}
              >
                {this.props.object ? 'Update' : 'Create'}
              </button>
            </th>
          </tr>
        </tfoot>
      </table>
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
    if (this.props.object) {
      updateObject(this.props.object._id, this.state.value).then((res, err) => {
        alert(JSON.stringify(res));
      });
    } else {
   	  createObject(this.state.value).then((res, err) => {
  	    alert(JSON.stringify(res));
        this.setState({value: {type: this.props.typeID}});
  	  });
    }
  }
}
