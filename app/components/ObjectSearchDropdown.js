import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';

export default class ObjectSearchDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      selected: [],
      raw: [],
    };
  }

  render() {
    var passedProps = {};
    [
      'fluid',
      'placeholder',
      'multiple',
      'className',
      'class',
      'style',
      'item',
      'simple',
      'floating',
      'inline',
      'name',
    ].forEach(p => {
      passedProps[p] = this.props[p];
    });

    return (
      <Dropdown
        onChange={(e, v) => {
          if (!this.props.onChange) {
            return;
          }
          let objs = this.findRaw(this.props.multiple ? [v.value] : v.value, this.state.selected);
          this.setState({selected: objs}, () => {
            this.props.onChange(objs);
          });
        }}
        onSearchChange={(e, v) => {
          if (!this.props.onSearch) {
            return;
          }

          this.props.onSearch(e.target.value).then(res => {
            this.setState({
              raw: res,
              options: this.postProcess(res),
            });
          });
        }}
        search={options => options}
        selection
        options={
          this.props.multiple
            ? this.state.options.concat(this.postProcess(this.state.selected))
            : this.state.options
          }
        {...passedProps}
      />
    );
  }

  postProcess(data) {
    return data.map(e => ({
      key: e._id,
      value: e._id,
      text: this.props.renderText ? this.props.renderText(e) : e.name,
    }));
  }

  findRaw(objIDorList, selected) {
    if (objIDorList instanceof Array) {
      return objIDorList.map(e => this.findRaw(e, selected));
    }
    for (var i=0; i<this.state.raw.length; i++) {
      if (this.state.raw[i]._id == objIDorList) {
        return this.state.raw[i];
      }
    }
    for (var i=0; i<selected.length; i++) {
      if (selected[i]._id == objIDorList) {
        return selected[i];
      }
    }
  }
}
