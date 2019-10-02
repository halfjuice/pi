import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';

export default class ObjectSearchDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      raw: [],
    };
  }

  render() {
    var passedProps = {};
    ['fluid', 'placeholder'].forEach(p => {
      passedProps[p] = this.props[p];
    });

    return (
      <Dropdown
        onChange={(e, v) => {
          if (!this.props.onChange) {
            return;
          }

          this.props.onChange(this.findRaw(v.value));
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
        options={this.state.options}
        {...passedProps}
      />
    );
  }

  postProcess(data) {
    return data.map(e => ({
      key: e._id,
      value: e._id,
      text: <p>{this.props.renderText ? this.props.renderText(e) : e.name}</p>
    }));
  }

  findRaw(objID) {
    for (var i=0; i<this.state.raw.length; i++) {
      if (this.state.raw[i]._id == objID) {
        return this.state.raw[i];
      }
    }
  }
}
