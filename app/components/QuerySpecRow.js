import React from 'react';
import { getObjectByID, searchObjects } from '../../models/client';
import { tuples2obj, obj2tuples } from '../utils/helper';
import { Dropdown } from 'semantic-ui-react';
import ObjectSearchDropdown from './ObjectSearchDropdown';

class QueryNewTypeFieldRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      field: null,
      fieldType: null,

      filterType: null,
    };
  }

  render() {
    return (
      <tr>
        <td className="six wide">
          <Dropdown
            onChange={(e, v) => this.setState({field: v.value, fieldType: this.getFieldTypeOf(v.value)}, this.updateChange.bind(this))}
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
                  onChange={(e, v) => this.setState({criteria: v.value}, this.updateChange.bind(this))}
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
                    this.setState({rightV: v.target.value}, this.updateChange.bind(this));
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
                  onChange={(e, v) => this.setState({criteria: v.value}, this.updateChange.bind(this))}
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
                    this.setState({rightV: v._id}, this.updateChange.bind(this));
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

  updateChange() {
    if (!this.props.onChange) {
      return;
    }

    if (this.state.criteria == '$eq') {
      // $eq logic are shared
      this.props.onChange(this.state.field, this.state.rightV);
      return;
    }

    if (this.state.fieldType == 'text') {
      //
    } else if (this.state.fieldType == 'relation') {
      //
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
            <th colSpan="2">
              Query Filter
            </th>
          </tr>
        </thead>
        <tbody>
          {this.state.querySpecs.map((spec, i) =>
            <QueryNewTypeFieldRow
              type={this.props.type}
              typeFields={obj2tuples(this.props.type).filter(x => !['_id', '_rev', 'type'].includes(x[0]))}
              onChange={(f, v) => {
                var s = this.state.querySpecs;
                s[i] = [f, v];
                this.setState({querySpecs: s}, this.updateChange.bind(this));
              }}
            />
          )}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan="2">
              <button
                class="ui right floated button"
                onClick={() => this.setState(
                  {querySpecs: this.state.querySpecs.concat([['', {}]])},
                  this.updateChange.bind(this),
                )}>
                Add
              </button>
            </th>
          </tr>
        </tfoot>
      </table>
    );
  }

  updateChange() {
    if (!this.props.onChange) {
      return;
    }

    // TODO: Duplicate check
    this.props.onChange(tuples2obj(this.state.querySpecs));
  }
}
