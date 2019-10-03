import React from 'react';
import { Link } from 'react-router-dom';
import { createObject } from '../../models/client';
import { tuples2obj } from '../utils/helper';

export default class NewTypePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      typeName: '',
      fields: [],
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

        <div class="ui grid">
          <div class="four wide column">
            <h2>New Type</h2>
          </div>
          <div class="twelve wide right aligned column">
            <div class="mini ui icon buttons">
              <button
                class="ui green button"
                onClick={() =>
                  this.setState({
                    fields: this.state.fields.concat([['', 'string']]),
                  })
                }
              >
                <i class="plus icon" />
              </button>
            </div>
          </div>
        </div>

        <table className="ui form table">
          <tbody>
            <tr>
              <td><b>ID</b></td>
              <td>&lt;Assigned&gt;</td>
            </tr>
            <tr>
              <td><b>Type</b></td>
              <td>&lt;Type&gt;</td>
            </tr>
            <tr>
              <td><b>Name</b></td>
              <td>
                <input
                  placeholder={`Type Name`}
                  value={this.state.typeName}
                  onChange={v => this.setState({typeName: v.target.value})}
                />
              </td>
            </tr>
            {this.state.fields.map((tup, i) => (
              <tr>
                <td>
                  <input
                    placeholder={`Field Name ${i + 1}`}
                    value={tup[0]}
                    onChange={v => this.handleFieldValueChange(v, i, 0)}
                  />
                </td>
                <td>
                  <select
                    class="ui search dropdown"
                    value={tup[1]}
                    onChange={v => this.handleFieldValueChange(v, i, 1)}>
                    <option value="string">String</option>
                    <option value="pointer">Pointer</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th colspan="2">
                <button
                  class="ui right floated positive button"
                  onClick={() => this.handleSubmit()}>
                  Create
                </button>
              </th>
            </tr>
          </tfoot>
        </table>


        <div class="ui top attached header">New Type</div>
        <div class="ui attached form segment">
          <div class="ui right aligned grid">
            <div class="sixteen wide column">
              <div class="mini ui icon buttons">
                <button
                  class="ui green button"
                  onClick={() =>
                    this.setState({
                      fields: this.state.fields.concat([['', 'string']]),
                    })
                  }
                >
                  <i class="plus icon" />
                </button>
              </div>
            </div>
          </div>
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
            <div class="field">&lt;Type&gt;</div>
          </div>
          <div class="two fields">
            <div class="field">
              <b>Name</b>
            </div>
            <div class="field">
              <input
                placeholder={`Type Name`}
                value={this.state.typeName}
                onChange={v => this.setState({typeName: v.target.value})}
              />
            </div>
          </div>
          {this.state.fields.map((tup, i) => (
            <div class="two fields">
              <div class="field">
                <input
                  placeholder={`Field Name ${i + 1}`}
                  value={tup[0]}
                  onChange={v => this.handleFieldValueChange(v, i, 0)}
                />
              </div>
              <div class="field">
                <select
                  class="ui search dropdown"
                  value={tup[1]}
                  onChange={v => this.handleFieldValueChange(v, i, 1)}>
                  <option value="string">String</option>
                  <option value="pointer">Pointer</option>
                </select>
              </div>
            </div>
          ))}
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
    obj['type'] = 0;
    obj['name'] = this.state.typeName;
 	  createObject(obj).then((res, err) => {
	    alert(JSON.stringify(res));
	  });
  }
}
