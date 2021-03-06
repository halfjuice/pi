import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { updateObject } from '../../models/client';
import { obj2tuples } from '../utils/helper';
import { Pagination } from 'semantic-ui-react';
import FieldValueInput from '../components/FieldValueInput';
import { canRenderCell, renderCell } from './FieldSpec';

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
      <table key={`table_page_${this.props.page}`} className="ui form celled table">
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
            <tr key={`cell_row_p${this.props.page}_${i}`}>
              {typeTuples.map((t, j) =>
                <td key={`cell_col_p${this.props.page}_${j}`}>
                  {this.innerRenderCell(o, t)}
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
                defaultActivePage={this.props.page+1}
                onPageChange={(e, {activePage}) => {
                  if (activePage-1 >= this.props.totalPage) {
                    return;
                  }
                  this.props.onPageChange && this.props.onPageChange(activePage-1)
                }}
                totalPages={this.props.totalPage}
              />
            </th>
          </tr>
        </tfoot>
      </table>
    );
  }

  innerRenderCell(o, t) {
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
      return <Link to={`/view_object/${v}`}>{v.slice(0, 5) + '..'}</Link>;
    } else if (k == 'type') {
      return <Link to={`/view_type/${this.props.type._id}`}>{this.props.type.name}</Link>;
    } else if (k == 'name') {
      return v ? v : '';
    } else if (k == '_rev') {
      return v.slice(0, 5) + '..';
    } else if (typ == 'color') {
      return <span style={{backgroundColor: v, padding: '4px', borderRadius: '4px',}}>{v}</span>;
    } else if (typ == 'datetime'){
      return moment(v).format('LLL');
    } else if (typ == 'date') {
      return v;
    } else if (canRenderCell(typ)) {
      return renderCell(typ, v);
    } else {
      return v == undefined ? '' : ''+v;
    }
  }
}
