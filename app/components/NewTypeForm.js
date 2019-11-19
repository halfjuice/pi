import React from 'react';
import { createObject, updateTypeWithChanges } from '../../models/client';
import { tuples2obj, obj2tuples } from '../utils/helper';
import NewTypeFieldRow from '../components/NewTypeFieldRow';

function isFixedKey(tup) {
  return tup.length > 2 && tup[2] == 'fixedKey';
}

export default class NewTypeForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      typeName: props.type ? props.type.name : '',
      fields: props.type
        ? obj2tuples(props.type)
          .filter(x => !['_id', 'type', 'name'].includes(x[0]))
          .map(t => t.concat(['fixedKey']))
        : [],

      removes: [],
    };
  }

  addField() {
    this.setState({
      fields: this.state.fields.concat([['', 'text']]),
    });
  }

  render() {
    return (
      <table className="ui form table">
        <tbody>
          <tr>
            <td className="six wide right aligned"><b>ID</b></td>
            <td className="ten wide" colSpan="2">&lt;Assigned&gt;</td>
          </tr>
          <tr>
            <td className="right aligned"><b>Type</b></td>
            <td colSpan="2">&lt;Type&gt;</td>
          </tr>
          <tr>
            <td className="right aligned"><b>Name</b></td>
            <td className="ten wide" colSpan="2">
              <input
                placeholder={`Type Name`}
                value={this.state.typeName}
                onChange={v => this.setState({typeName: v.target.value})}
              />
            </td>
          </tr>
          {this.state.fields.map((tup, i) => (
            <NewTypeFieldRow
              key={`field_spce_${i}`}
              index={i}
              value={tup}
              fixedKey={isFixedKey(tup)}
              onRemoveClick={() => this.setState({
                fields: this.state.fields.slice(0, i).concat(this.state.fields.slice(i+1))
              }, () => {
                if (isFixedKey(tup)) {
                  this.setState({
                    removes: this.state.removes.concat([tup[0]]),
                  })
                }
              })}
              onChange={t => {
                this.setState({
                  fields: this.state.fields.slice(0, i).concat([t.concat(tup.slice(2))]).concat(
                    this.state.fields.slice(i+1)
                  ),
                });
              }}
            />
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan="3">
              <button
                class="ui right floated positive button"
                onClick={() => this.handleSubmit()}>
                {this.props.type ? 'Update' : 'Create'}
              </button>
            </th>
          </tr>
        </tfoot>
      </table>
    );
  }

  handleSubmit() {
    var obj = tuples2obj(this.state.fields.map(e => e.slice(0, 2)));
    obj['type'] = 0;
    obj['name'] = this.state.typeName;

    if (this.props.type) {
      updateTypeWithChanges(
        this.props.type._id,
        tuples2obj(this.state.fields.filter(x => !isFixedKey(x))),
        this.state.removes,
        tuples2obj(this.state.fields.filter(x => isFixedKey(x) && x[1] != this.props.type[x[0]]).map(x => x.slice(0, 2))),
      ).then((res, err) => {
        alert(JSON.stringify(res));
      });
    } else {
      createObject(obj).then((res, err) => {
        alert(JSON.stringify(res));
      });
    }
  }
}
