import React from 'react';
import { Link } from 'react-router-dom';
import { getObjectByID, searchObjects } from '../../models/client';
import ObjectSearchDropdown from './ObjectSearchDropdown';
import { Dropdown } from 'semantic-ui-react';
import NewObjectForm from './NewObjectForm';
import { Popup, Button, Modal } from 'semantic-ui-react';
import ViewerContext from './ViewerContext';


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
            placeholder={`${this.props.fieldKey} currency...`}
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

class RelationEditableField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      obj: undefined,
    };
  }

  componentDidMount() {
    this.updateObject();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value != this.props.value) {
      this.updateObject();
    }
  }

  updateObject() {
    if (this.props.value) {
      let prom = this.props.multiple
        ? ViewerContext.db().findObjectsByIDs(this.props.value)
        : ViewerContext.db().getObjectByID(this.props.value);
      prom
        .then(obj => this.setState({obj: this.props.multiple ? obj.filter(o => o) : obj}))
        .catch(obj => this.setState({obj: undefined}));
    }
  }

  render() {
    return (
      <div>
        <ObjectSearchDropdown
          fluid
          multiple={this.props.multiple}
          placeholder={`${this.props.fieldKey} Value (Related Object)`}
          onChange={v => {
            this.props.onChange && this.props.onChange(
              this.props.multiple
                ? v.map(vv => vv && vv._id)
                : v._id
            );
          }}
          onSearch={txt => ViewerContext.db().searchObjects(this.props.fieldType.objectType, txt, 0, 5)}
          value={this.state.obj}
        />

        <Popup content='Create new object to relate to' trigger={
          <a
            onClick={() => this.setState({modalOpen: true})}>
            Link to New
          </a>
        } />

        <Modal
          open={this.state.modalOpen}
          onClose={() => this.setState({modalOpen: false})}>
          <Modal.Header>Create object</Modal.Header>
          <Modal.Content>
            <NewObjectForm typeID={this.props.fieldType.objectType} />
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

class RelationCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {obj: null, loading: true}
  }

  componentDidMount() {
    if (this.props.id) {
      ViewerContext.db().getObjectByID(this.props.id)
        .then(obj => this.setState({obj: obj, loading: false}))
        .catch(err => this.setState({obj: null, loading: false}));
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
      return <span className="item" style={{color: '#D95C5C'}}>Gone</span>;
    }

    return <Link className="item" to={`/view_object/${this.props.id}`}>{this.state.obj.name || this.props.id.slice(0, 5)+'...'}</Link>
  }
}

class MultiRelationCell extends React.Component {
  render() {
    return (
      <div className="ui divided horizontal list">
        {this.props.ids && this.props.ids.map(id => <RelationCell key={`rel_cell_${id}`} id={id} />)}
      </div>
    )
  }
}

const SPEC = {

  currency: {
    renderEditableField: (fieldType, fieldKey, value, onValueChange) => (
      <CurrencyEditableField fieldKey={fieldKey} value={value} onChange={onValueChange} />
    ),
    renderCell: (value) => ({
      usd: amt => '$' + amt,
      cny: amt => amt + '元',
    }[value.currency](value.amount)),
  },

  relation: {
    renderEditableField: (fieldType, fieldKey, value, onValueChange) => (
      <RelationEditableField fieldType={fieldType} fieldKey={fieldKey} value={value} onChange={onValueChange} />
    ),
    renderCell: (v) =>
      <RelationCell id={v} />
  },

  multi_relation: {
    renderEditableField: (fieldType, fieldKey, value, onValueChange) => (
      <RelationEditableField multiple={true} fieldType={fieldType} fieldKey={fieldKey} value={value} onChange={onValueChange} />
    ),
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
    return SPEC[fieldType.fieldType].renderEditableField(fieldType, fieldKey, value, onValueChange);
  }

  return SPEC[fieldType].renderEditableField(fieldType, fieldKey, value, onValueChange);
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
