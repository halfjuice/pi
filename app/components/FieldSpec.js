import React from 'react';
import { getObjectByID, searchObjects } from '../../models/client';
import ObjectSearchDropdown from './ObjectSearchDropdown';
import { Dropdown } from 'semantic-ui-react';


class CurrencyEditableField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currency: (props.value && props.value.currency) || 'USD',
      amount: props.value && props.value.amount || 0,
    };
  }

  render() {
    return (
      <div className="ui grid">
        <div className="eight wide column">
          <Dropdown
            placeholder={`${this.props.key} currency...`}
            value={this.state.currency}
            key="value_select"
            fluid
            search={options => options}
            selection
            options={[
              {key: "usd", value: "usd", text: "USD", flag: 'us'},
              {key: "cny", value: "cny", text: "CNY", flag: 'cn'},
            ]}
            onChange={(e, v) => {
              this.setState({currency: v.value}, this.updateChange.bind(this));
            }}
          />
        </div>
        <div className="eight wide column">
          <input
            type="number"
            step="0.01"
            value={this.state.amount}
            onChange={v => this.setState({amount: v.target.value}, this.updateChange.bind(this))}
          />
        </div>
      </div>
    );
  }

  updateChange() {
    console.log(this.state);
    this.props.onChange && this.props.onChange(this.state);
  }
}


const SPEC = {

  currency: {
    renderEditableField: (fieldKey, value, onValueChange) => (
      <CurrencyEditableField key={fieldKey} value={value} onChange={onValueChange} />
    ),
    renderCell: (value) => ({
      usd: amt => '$' + amt,
      cny: amt => amt + '元',
    }[value.currency](value.amount)),
  }

}

export function canRenderEditableField(fieldType) {
  if (fieldType == undefined) {
    return false;
  }
  return SPEC[fieldType] != undefined || SPEC[fieldType.fieldType] != undefined;
}

export function canRenderCell(fieldType) {
  if (fieldType == undefined) {
    return false;
  }
  return SPEC[fieldType] != undefined || SPEC[fieldType.fieldType] != undefined;
}

export function renderEditableField(fieldType, fieldKey, value, onValueChange) {
  if (fieldType.fieldType) {
    // TODO: ...
    return;
  }

  return SPEC[fieldType].renderEditableField(fieldKey, value, onValueChange);
}

export function renderCell(fieldType, value) {
  if (fieldType.fieldType) {
    // TODO: ...
    return;
  }

  if (!value) {
    return '';
  }

  return SPEC[fieldType].renderCell(value);
}
