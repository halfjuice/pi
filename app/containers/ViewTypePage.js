import React from 'react';
import { Link } from 'react-router-dom';
import { getObjectByID } from '../../models/client';

export default class NewObjectPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      type: null,
    }
  }

  componentDidMount() {
    getObjectByID(this.props.match.params.type_id).then(res => this.setState({
      loading: false,
      type: res,
    }))
  }

  render() {
    return (
      <div>
        <div class="ui menu">
          <Link class="item" to="/">
            Home
          </Link>
        </div>
        <div class="ui top attached header">Type Info</div>
        <div class="ui attached form segment">
          <p>{this.state.type && this.state.type.name}</p>
          <div class="ui right aligned grid">
            <div class="sixteen wide column">
              <div class="mini ui buttons">
                <Link
                  class="mini ui button"
                  to={'/all_objects/' + this.props.match.params.type_id}
                >
                  View Objects
                </Link>
                <Link
                  class="mini ui button"
                  to={'/create_object/' + this.props.match.params.type_id}
                >
                  Create Object
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
