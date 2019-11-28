import React from 'react';
import moment from 'moment';
import { getObjectByID, searchObjects } from '../../models/client';
import ObjectSearchDropdown from '../components/ObjectSearchDropdown';
import { Popup, Button, Modal } from 'semantic-ui-react';

export default class FieldValueInput extends React.Component {

  render() {
    if (this.props.fieldType == 'text') {
      return (
        <input
          placeholder={`${this.props.fieldKey} Value`}
          value={this.props.value || ''}
          onChange={v => this.handlefieldTypeChange(v.target.value, this.props.fieldKey)}
        />
      );
    } else if (this.props.fieldType == 'datetime') {
      return (
        <input
          type="datetime-local"
          placeholder={`${this.props.fieldKey} Value`}
          value={moment(this.props.value).format('YYYY-MM-DDTHH:mm') || 0}
          onChange={v => this.handlefieldTypeChange(new Date(v.target.value).getTime(), this.props.fieldKey)}
        />
      );
    } else if (this.props.fieldType == 'color') {
      return (
        <input
          type="color"
          value={this.props.value || ''}
          onChange={v => this.handlefieldTypeChange(v.target.value, this.props.fieldKey)}
        />
      );
    } else if (this.props.fieldType.fieldType == 'relation') {
      return (
        <div>
          <ObjectSearchDropdown
            fluid
            placeholder={`${this.props.fieldKey} Value (Related Object)`}
            onChange={v => this.handlefieldTypeChange(v, this.props.fieldKey)}
            onSearch={txt => searchObjects(this.props.fieldType.objectType, txt, 0, 5)}
          />

          <Popup content='Create new object to relate to' trigger={
            <Button
              onClick={() => this.setState({[`modalOpenFor${this.props.fieldKey}`]: true})}
              icon='add'
            />
          } />

          <Modal
            open={this.state['modalOpenFor' + this.props.fieldKey] || false}
            onClose={() => this.setState({[`modalOpenFor${this.props.fieldKey}`]: false})}>
            <Modal.Header>Create object</Modal.Header>
            <Modal.Content>
              <NewObjectForm typeID={this.props.fieldType.objectType} />
            </Modal.Content>
          </Modal>
        </div>
      )
    } else if (this.props.fieldType.fieldType == 'multi_relation') {
      return (
        <ObjectSearchDropdown
          placeholder={`${this.props.fieldKey} Value (Related Objects)`}
          onChange={v => this.handlefieldTypeChange(v, this.props.fieldKey)}
          onSearch={txt => searchObjects(this.props.fieldType.objectType, txt, 0, 5)}
          multiple
          fluid
        />
      )
    } else {
      return <p>Unknown field {this.props.fieldType}</p>;
    }
  }

  handlefieldTypeChange(v, k) {
    this.props.onChange && this.props.onChange(k, v);
  }
}
