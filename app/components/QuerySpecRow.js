import React from 'react';
import { getObjectByID, searchObjects } from '../../models/client';
import { tuples2obj, obj2tuples } from '../utils/helper';
import { Dropdown } from 'semantic-ui-react';
import ObjectSearchDropdown from './ObjectSearchDropdown';

class QueryFieldSpecRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      field: null,
      fieldType: null,

      filterType: null,
    };
  }

  render() {
    console.log(this.state.field, this.props.type, this.state.fieldType);

    return (
      <tr>
        <td className="six wide">
          <Dropdown
            onChange={(e, v) => this.setState({field: v.value, fieldType: this.getFieldTypeOf(v.value)})}
            selection
            fluid
            options={this.props.typeFields.map(t => ({
              key: t[0], value: t[0], text: t[0],
            }))}
          />
        </td>
        <td className="twelve wide">
          {this.renderFilter()}
        </td>
      </tr>
    );
  }

  getFieldTypeOf(field) {
    if (field == 'name') {
      return 'text'
    } else {
      return this.props.type[field];
    }
  }

  renderFilter() {
    if (this.state.fieldType == 'text') {
      return (
        <table style={{width: '100%'}}>
          <tbody>
            <tr>
              <td className="eight wide">
                <Dropdown
                  key="criteria-dropdown"
                  onChange={(e, v) => this.setState({criteria: v.value})}
                  selection
                  fluid
                  options={[
                    {key: '$eq', value: '$eq', text: 'equals'}
                  ]}
                />
              </td>
              <td className="eight wide">
                <input
                  key="right-value-input"
                  placeholder="Right text value"
                  value={this.state.rightV}
                  onChange={v => {
                    this.setState({rightV: v.target.value});
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>
      );
    } else if (this.state.fieldType && this.state.fieldType.fieldType == 'relation') {
      return (
        <table style={{width: '100%'}}>
          <tbody>
            <tr>
              <td className="eight wide">
                <Dropdown
                  key="criteria-dropdown"
                  onChange={(e, v) => this.setState({criteria: v.value})}
                  selection
                  fluid
                  options={[
                    {key: '$eq', value: '$eq', text: 'equals'}
                  ]}
                />
              </td>
              <td className="eight wide">
                <ObjectSearchDropdown
                  placeholder="Search object..."
                  onChange={v => {
                    this.setState({rightV: v._id});
                  }}
                  onSearch={txt => searchObjects(this.state.fieldType.objectType, txt, 0, 5)}
                  fluid
                />
              </td>
            </tr>
          </tbody>
        </table>
      );
    } else {
      return "Choose a field";
    }
  }
}

export default class QuerySpecRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      querySpecs: [
        ['', {}],
      ],
    };
  }

  render() {
    if (!this.props.type) {
      return null;
    }

    return (
      <table className="ui form table">
        <thead>
          <tr>
            <th colspan="2">
              Query Filter
            </th>
          </tr>
        </thead>
        <tbody>
          {this.state.querySpecs.map((spec, i) =>
            <QueryFieldSpecRow
              type={this.props.type}
              typeFields={obj2tuples(this.props.type).filter(x => ['_id', 'type'].indexOf(x[0]) == -1)}
              onChange={(f, v) => {
                var s = this.state.querySpecs;
                s[i] = [f, v];
                this.setState({querySpecs: s});
              }}
            />
          )}
        </tbody>
        <tfoot>
          <tr>
            <th colspan="2">
              <button
                class="ui right floated button"
                onClick={() => this.setState({querySpecs: this.state.querySpecs.concat([['', {}]])})}>
                Add
              </button>
            </th>
          </tr>
        </tfoot>
      </table>
    );
  }
}
