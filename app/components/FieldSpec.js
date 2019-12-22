import React from 'react';
import { Link } from 'react-router-dom';
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
    this.props.onChange && this.props.onChange(this.state);
  }
}

class RelationCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {obj: null, loading: true}
  }

  componentDidMount() {
    if (this.props.id) {
      getObjectByID(this.props.id).then(obj => this.setState({obj: obj, loading: false}));
    }
  }

  render() {
    if (!this.props.id) {
      return <></>;
    }

    if (this.state.loading) {
      return <span className="item">Loading</span>;
    }

    if (!this.state.obj) {
      return <span className="red item">Gone</span>;
    }

    return <Link className="item" to={`/view_object/${this.props.id}`}>{this.state.obj.name || this.props.id.slice(0, 5)+'...'}</Link>
  }
}

class MultiRelationCell extends React.Component {
  render() {
    return (
      <div class="ui celled horizontal list">
        {this.props.ids.map(id => <RelationCell id={id} />)}
      </div>
    )
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
  },

  relation: {
    renderCell: (v) =>
      <RelationCell id={v} />
  },

  multi_relation: {
    renderCell: (v) =>
      <MultiRelationCell ids={v} />
  },

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
    return SPEC[fieldType.fieldType].renderEditableField(fieldKey, value, onValueChange);
  }

  return SPEC[fieldType].renderEditableField(fieldKey, value, onValueChange);
}

export function renderCell(fieldType, value) {
  if (fieldType.fieldType) {
    return SPEC[fieldType.fieldType].renderCell(value);
  }

  if (!value) {
    return '';
  }

  return SPEC[fieldType].renderCell(value);
}
