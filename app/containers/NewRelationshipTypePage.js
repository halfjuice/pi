import React from 'react';
import { Link } from 'react-router-dom';
import { createObject } from '../../models/client';
import { tuples2obj } from '../utils/helper';

export default class NewRelationshipTypePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      srcType: '',
      dstType: '',
    };
  }

  render() {
    return (
      <div>
        <div class="ui menu">
          <Link class="item" to="/">
            Home
          </Link>
        </div>
        <div class="ui top attached header">New Relationship Type</div>
        <div class="ui attached form segment">
          <div class="two fields">
            <div class="field">
              <b>ID</b>
            </div>
            <div class="field">&lt;Assigned&gt;</div>
          </div>
          <div class="two fields">
            <div class="field">
              <b>Type</b>
            </div>
            <div class="field">&lt;Relationship Type&gt;</div>
          </div>
          <div class="two fields">
            <div class="field">
              <b>Name</b>
            </div>
            <div class="field">
              <input
                placeholder={`Type Name`}
                value={this.state.name}
                onChange={v => this.setState({name: v.target.value})}
              />
            </div>
          </div>
          <div class="two fields">
            <div class="field">
              <b>Source Type</b>
            </div>
            <div class="field">
              <input
                placeholder={`Type Name`}
                value={this.state.typeName}
                onChange={v => this.setState({typeName: v.target.value})}
              />
              <div class="ui multiple search selection dropdown">
                <input type="hidden" name="country" />
                <i class="dropdown icon"></i>
                <div class="default text">Select Country</div>
                <div class="menu">
                  <div class="item" data-value="af"><i class="af flag"></i>Afghanistan</div>
                  <div class="item" data-value="ax"><i class="ax flag"></i>Aland Islands</div>
                  <div class="item" data-value="al"><i class="al flag"></i>Albania</div>
                  <div class="item" data-value="dz"><i class="dz flag"></i>Algeria</div>
                </div>
              </div>
            </div>
          </div>
          <button
            class="ui positive button"
            onClick={() => this.handleSubmit()}>
            Create
          </button>
        </div>
      </div>
    );
  }

  handleFieldValueChange(evt, i, j) {
    const f = this.state.fields;
    f[i][j] = evt.target.value;
    this.setState({ fields: f });
  }

  handleSubmit() {
    var obj = tuples2obj(this.state.fields);
    obj['type'] = 1;
    obj['name'] = this.state.typeName;
 	  createObject(obj).then((res, err) => {
	    alert(JSON.stringify(res));
	  });
  }
}
