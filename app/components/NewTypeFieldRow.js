import React from 'react';
import { searchObjects } from '../../models/client';
import ObjectSearchDropdown from './ObjectSearchDropdown';
import { Dropdown } from 'semantic-ui-react';
import { obj2tuples, tuples2obj } from '../utils/helper';

const TypeSpecList = [
  {key: "text", value: "text", text: "Text", icon: "font"},
  //{key: "boolean", value: "boolean", text: "Yes / No", icon: "check square outline"},
  //{key: "integer", value: "integer", text: "Integer", icon: "hashtag"},
  //{key: "number", value: "number", text: "Number", icon: "hashtag"},
  {key: "currency", value: "currency", text: "Currency", icon: "money bill alternate outline"},
  //{key: "address", value: "address", text: "Address", icon: "map marker"},
  {key: "date", value: "date", text: "Date", icon: "calendar outline"},
  //{key: "time", value: "time", text: "Time", icon: "clock outline"},
  {key: "datetime", value: "datetime", text: "Datetime", icon: "calendar alternate outline"},
  {key: "color", value: "color", text: "Color", icon: "eye dropper"},
  {key: "relation", value: "relation", text: "Relation", icon: "exchange"},
  {key: "multi_relation", value: "multi_relation", text: "Multi Relation", icon: "expand arrows alternate"},
]

export const TypeSpecs = tuples2obj(TypeSpecList.map(o => [o.value, o]));

export function getTypeSpecFromFieldSpec(fieldSpec) {
  return TypeSpecs[fieldSpec.fieldType || fieldSpec];
}

export default class NewTypeFieldRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getStateFromProps(props);
  }

  componentWillReceiveProps(props) {
    this.setState(this.getStateFromProps(props));
  }

  getStateFromProps(props) {
    return {
      keyName: props.value[0],
      valueType: typeof props.value[1] == 'string' ? props.value[1] : props.value[1].fieldType,
      objectType: typeof props.value[1] == 'string' ? null : props.value[1].objectType,
    };
  }

  render() {
    let valueSelect = (
      <Dropdown
        placeholder="Field Type..."
        value={this.state.valueType}
        key="value_select"
        fluid
        search={options => options}
        selection
        options={TypeSpecList}
        onChange={(e, v) => {
          this.setState({valueType: v.value}, this.updateChange.bind(this));
        }}
      />
    );

    return (
      <tr>
        <td className={this.props.fixedKey ? 'six wide right aligned' : 'six wide'}>
          {this.props.fixedKey
            ? <b>{this.props.value[0]}</b>
            :
              <input
                type="text"
                className="right aligned"
                placeholder={`Field Name ${this.props.index + 1}`}
                //value={this.props.value[0]}
                onChange={v => {
                  this.setState({keyName: v.target.value}, this.updateChange.bind(this));
                }}
              />
          }
        </td>
        <td className="nine wide">
          {typeof this.props.value[1] != 'string'
            ? <div className="ui grid">
                <div className="eight wide column">
                  {valueSelect}
                </div>
                <div className="eight wide column">
                  <ObjectSearchDropdown
                    placeholder="Related Type..."
                    onChange={v => {
                      this.setState({objectType: v._id}, this.updateChange.bind(this));
                    }}
                    onSearch={txt => searchObjects(0, txt, 0, 5)}
                    fluid
                  />
                </div>
              </div>
            : valueSelect
          }
        </td>
        <td className="one wide right aligned">
          <button class="ui icon basic button" onClick={() => this.props.onRemoveClick && this.props.onRemoveClick()}>
            <i class="red delete icon"></i>
          </button>
        </td>
      </tr>
    );
  }

  updateChange() {
    var tup1 = this.state.valueType;
    if (this.state.valueType == 'relation' || this.state.valueType == 'multi_relation') {
      tup1 = {
        fieldType: this.state.valueType,
        objectType: this.state.objectType,
      };
    }

    this.props.onChange && this.props.onChange([
      this.state.keyName,
      tup1
    ]);
  }
}
