import React from 'react';
import { searchObjects } from '../../models/client';
import ObjectSearchDropdown from './ObjectSearchDropdown';

export default class FieldSpecRow extends React.Component {
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
      <select
        className="ui search dropdown"
        value={((typeof this.props.value[1]) == 'string')
          ? this.props.value[1]
          : this.props.value[1].fieldType
        }
        onChange={v => {
          this.setState({valueType: v.target.value}, this.updateChange.bind(this));
        }}>
        <option value="text">Text</option>
        <option value="relation">Relation</option>
        <option value="multi_relation">Multi Relation</option>
      </select>
    );

    return (
      <tr>
        <td className="six wide">
          <input
            placeholder={`Field Name ${this.props.index + 1}`}
            value={this.props.value[0]}
            onChange={v => {
              this.setState({keyName: v.target.value}, this.updateChange.bind(this));
            }}
          />
        </td>
        <td className="twelve wide">
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
