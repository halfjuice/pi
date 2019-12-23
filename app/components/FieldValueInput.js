import React from 'react';
import moment from 'moment';
import { getObjectByID, searchObjects } from '../../models/client';
import ObjectSearchDropdown from '../components/ObjectSearchDropdown';
import NewObjectForm from './NewObjectForm';
import { canRenderEditableField, renderEditableField } from './FieldSpec';

export default class FieldValueInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    if (this.props.fieldType == 'text') {
      return (
        <input
          placeholder={`${this.props.fieldKey} Value`}
          value={this.props.value || ''}
          onChange={v => this.handleFieldTypeChange(v.target.value, this.props.fieldKey)}
        />
      );
    } else if (this.props.fieldType == 'datetime') {
      return (
        <input
          type="datetime-local"
          placeholder={`${this.props.fieldKey} Value`}
          value={moment(this.props.value).format('YYYY-MM-DDTHH:mm') || 0}
          onChange={v => this.handleFieldTypeChange(new Date(v.target.value).getTime(), this.props.fieldKey)}
        />
      );
    } else if (this.props.fieldType == 'date') {
      return (
        <input
          type="date"
          placeholder={`${this.props.fieldKey} Value`}
          value={moment(this.props.value).format('YYYY-MM-DD') || 0}
          onChange={v => this.handleFieldTypeChange(v.target.value, this.props.fieldKey)}
        />
      );
    } else if (this.props.fieldType == 'color') {
      return (
        <input
          type="color"
          value={this.props.value || ''}
          onChange={v => this.handleFieldTypeChange(v.target.value, this.props.fieldKey)}
        />
      );
    } else if (canRenderEditableField(this.props.fieldType)) {
      return renderEditableField(this.props.fieldType, this.props.fieldKey, this.props.value, v => this.handleFieldTypeChange(v, this.props.fieldKey))
    } else {
      return <p>Unknown field {this.props.fieldType}</p>;
    }
  }

  handleFieldTypeChange(v, k) {
    this.props.onChange && this.props.onChange(k, v);
  }
}
