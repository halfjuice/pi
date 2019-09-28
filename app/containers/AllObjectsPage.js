import React from 'react';
import { Link } from 'react-router-dom';
import { findObjects, getObjectByID } from '../../models/client';
import { obj2tuples } from '../utils/helper';

export default class AllObjectsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: null,
      objects: null,
    };
  }

  componentDidMount() {
    getObjectByID(this.props.match.params.type_id).then(res => {
      this.setState({type: res});
    });

    findObjects({type: this.props.match.params.type_id}).then(res => {
      this.setState({objects: res});
    });
  }

  render() {
    var content = null;
    if (this.state.type) {
      let typeTuples = obj2tuples(this.state.type).filter(t => ['name'].indexOf(t[0]) == -1);

      content = (
        <table class="ui celled table">
          <thead>
            <tr>
              {typeTuples.map(t => <th>{t[0]}</th>)}
            </tr>
          </thead>

          <tbody>
            {(this.state.objects || []).map(o => (
              <tr>{typeTuples.map(t => <td>{o[t[0]]}</td>)}</tr>
            ))}
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
        <div class="ui top attached header">All Objects{this.state.type ? ' of ' + this.state.type['name'] : null}</div>
        <div class="ui attached form segment">
          {content}
        </div>
      </div>
    );
  }
}
