import React from 'react';
import { Link } from 'react-router-dom';
import { createObject } from '../../models/client';
import { tuples2obj } from '../utils/helper';
import FieldSpecRow from '../components/FieldSpecRow';

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
            <h2>
              <i class="file alternate icon" />
              New Type
            </h2>
          </div>
          <div class="twelve wide right aligned column">
            <div class="mini ui icon buttons">
              <button
                class="ui green button"
                onClick={() =>
                  this.setState({
                    fields: this.state.fields.concat([['', 'text']]),
                  })
                }
              >
                <i class="plus icon" />
                New Field
              </button>
            </div>
          </div>
        </div>

        <table className="ui form table">
          <tbody>
            <tr>
              <td className="six wide right aligned"><b>ID</b></td>
              <td className="twelve wide">&lt;Assigned&gt;</td>
            </tr>
            <tr>
              <td className="right aligned"><b>Type</b></td>
              <td>&lt;Type&gt;</td>
            </tr>
            <tr>
              <td className="right aligned"><b>Name</b></td>
              <td>
                <input
                  placeholder={`Type Name`}
                  value={this.state.typeName}
                  onChange={v => this.setState({typeName: v.target.value})}
                />
              </td>
            </tr>
            {this.state.fields.map((tup, i) => (
              <FieldSpecRow
                key={`field_spce_${i}`}
                index={i}
                value={tup}
                onChange={t => this.setState({
                  fields: this.state.fields.slice(0, i).concat([t]).concat(
                    this.state.fields.slice(i+1)
                  ),
                })}
              />
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
