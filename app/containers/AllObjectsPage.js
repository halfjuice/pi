import React from 'react';
import { Link } from 'react-router-dom';
import { findObjects, getObjectByID } from '../../models/client';
import { obj2tuples } from '../utils/helper';
import ObjectTableView from '../components/ObjectTableView';

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
    return (
      <div>
        <div class="ui menu">
          <Link class="item" to="/">
            Home
          </Link>
        </div>
        <div class="ui top attached header">All {this.state.type && (this.state.type['name'] + ' ')}Object</div>
        <div class="ui attached form segment">
          <ObjectTableView type={this.state.type} objects={this.state.objects} />
        </div>
      </div>
    );
  }
}
