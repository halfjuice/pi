import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { updateObject } from '../../models/client';
import { obj2tuples } from '../utils/helper';
import { Pagination } from 'semantic-ui-react';
import FieldValueInput from '../components/FieldValueInput';

export default class ObjectTableView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    if (!this.props.type) {
      return null;
    }
    let typeTuples = obj2tuples(this.props.type);

    return (
      <table className="ui form celled table">
        <thead>
          <tr>
            {typeTuples.map((t, i) => <th key={`hdr_col_${i}`}>{t[0]}</th>)}
            {this.props.editable &&
              <th>
                Action
              </th>
            }
          </tr>
        </thead>

        <tbody>
          {(this.props.objects || []).map((o, i) => (
            <tr key={`cell_row_${i}`}>
              {typeTuples.map((t, j) =>
                <td key={`cell_col_${j}`}>
                  {this.renderCell(o, t)}
                </td>
              )}
              {this.props.editable &&
                <td>
                  <div className="mini ui icon basic buttons">
                    <button className="ui basic button" onClick={() => this.props.onDeleteClick && this.props.onDeleteClick(o)}>
                      <i className="red delete icon" />
                      Delete
                    </button>
                    {(this.props.pendingChanges || {})[o._id] &&
                      <button className="ui basic button" onClick={() => this.props.onUpdateClick && this.props.onUpdateClick(o)}>
                        <i className="blue refresh icon" />
                        Update
                      </button>
                    }
                  </div>
                </td>
              }
            </tr>
          ))}
        </tbody>

        <tfoot>
          <tr>
            <th colSpan={this.props.editable ? typeTuples.length+1 : typeTuples.length}>
              <Pagination
                floated="right"
                defaultActivePage={this.props.page}
                onPageChange={(e, {activePage}) => {
                    if (activePage >= this.props.totalPage) {
                      return;
                    }
                    this.props.onPageChange && this.props.onPageChange(activePage)
                }}
                totalPages={this.props.totalPage}
              />
            </th>
          </tr>
        </tfoot>
      </table>
    );
  }

  renderCell(o, t) {
    let k = t[0];
    let typ = t[1];
    let v = ((this.props.pendingChanges || {})[o._id] && (this.props.pendingChanges || {})[o._id][k]) || o[k];

    if (k == 'name') {
      typ = 'text';
    }

    if (this.props.editable && !['_id', '_rev', 'type'].includes(k)) {
      return (
        <FieldValueInput
          fieldKey={k}
          fieldType={typ}
          value={v}
          onChange={(k, v) => {
            this.props.onFieldChange && this.props.onFieldChange(o._id, k, v);
          }}
        />
      );
    }

    if (k == '_id') {
      return <Link to={`/view_object/${v}`}>{v}</Link>;
    } else if (k == 'type') {
      return <Link to={`/view_type/${this.props.type._id}`}>{this.props.type.name}</Link>;
    } else if (typ == 'color') {
      return <span style={{backgroundColor: v, padding: '4px', borderRadius: '4px',}}>{v}</span>;
    } else if (typ == 'datetime'){
      return moment(v).format('LLL');
    } else if (typ == 'date'){
      return v;
    } else {
      return v;
    }
  }
}
