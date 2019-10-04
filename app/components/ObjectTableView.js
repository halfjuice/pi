import React from 'react';
import { Link } from 'react-router-dom';
import { obj2tuples } from '../utils/helper';

export default class ObjectTableView extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {
    if (!this.props.type) {
      return null;
    }
    let typeTuples = obj2tuples(this.props.type);

    return (
      <table class="ui celled table">
        <thead>
          <tr>
            {typeTuples.map((t, i) => <th key={`hdr_col_${i}`}>{t[0]}</th>)}
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
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  renderCell(o, t) {
    let k = t[0];
    let typ = t[1];
    let v = o[k];
    if (k == '_id') {
      return <Link to={`/view_object/${v}`}>{v}</Link>;
    } else if (typ == 'color') {
      return <span style={{backgroundColor: v, padding: '4px', borderRadius: '4px',}}>{v}</span>;
    } else {
      return v;
    }
  }
}
