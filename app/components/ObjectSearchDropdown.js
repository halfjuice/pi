import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import { tuples2obj, obj2tuples } from '../utils/helper';

export default class ObjectSearchDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      loadOnce: false,
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

    let valueItem =
      this.props.multiple
        ? (this.props.value ? this.postProcess(this.props.value) : [])
        : (this.props.value ? this.postProcess([this.props.value])[0] : null);

    return (
      <Dropdown
        onFocus={() => {
          if (!this.state.loadOnce) {
            this.props.onSearch && this.props.onSearch('').then(res => {
              this.setState({
                raw: res,
                options: this.postProcess(res),
                loadOnce: true,
              });
            });
          }
        }}
        onChange={(e, v) => {
          if (!this.props.onChange) {
            return;
          }
          let objs = this.findRaw(v.value, this.state.selected);
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
            ? this.dedup(this.state.options.concat(this.postProcess(this.state.selected)).concat(valueItem))
            : this.dedup(this.state.options.concat(valueItem ? [valueItem] : []))
          }
        value={
          this.props.multiple
            ? valueItem.map(e => e.value)
            : valueItem && valueItem.value}
        {...passedProps}
      />
    );
  }

  dedup(options) {
    return Object.values(tuples2obj(options.map(o => [o.value, o])));
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
    for (var i=0; i<this.props.value.length; i++) {
      if (this.props.value[i]._id == objIDorList) {
        return this.props.value[i];
      }
    }
  }
}
