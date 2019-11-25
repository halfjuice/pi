import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { createObject, getObjectByID, searchObjects, updateObject } from '../../models/client';
import { tuples2obj, obj2tuples } from '../utils/helper';
import ObjectSearchDropdown from '../components/ObjectSearchDropdown';
import FieldValueInput from '../components/FieldValueInput';
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
                    <FieldValueInput
                      fieldKey={tup[0]}
                      fieldType={tup[1]}
                      value={this.state.value[tup[0]]}
                      onChange={(k, v) => this.handleFieldValueChange(v, k)}
                    />
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
