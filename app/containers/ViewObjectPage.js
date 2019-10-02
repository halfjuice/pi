import React from 'react';
import { Link } from 'react-router-dom';
import { getObjectByID } from '../../models/client';
import { obj2tuples } from '../utils/helper';

export default class ViewObjectPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      obj: null,
      related: {},
    }
  }

  componentDidMount() {
    getObjectByID(this.props.match.params.obj_id).then(res => {
      this.setState({
        loading: false,
        obj: res,
      });
      getObjectByID(res['type']).then(typ => {
        this.state.related.type = typ
        this.setState({related: this.state.related});
      });
    })
  }

  render() {
    var content = null;
    if (this.state.obj) {
      content = (
        <table class="ui celled table">
          <tbody>
            {obj2tuples(this.state.obj).map(tup => {
              var val = <td>{tup[1]}</td>;
              if (tup[0] == 'type' && this.state.related.type) {
                val = <td><Link to={'/view_type/' + tup[1]}>{this.state.related.type.name}</Link></td>;
              }
              return (
                <tr>
                  <td><b>{tup[0]}</b></td>
                  {val}
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    }

    return (
      <div>
        <div class="ui menu">
          <Link class="item" to="/">
            Home
          </Link>
        </div>
        <div class="ui top attached header">Object Info</div>
        <div class="ui attached form segment">
          <p>{this.state.obj && this.state.obj.name}</p>
          {content}
        </div>
      </div>
    );
  }
}
