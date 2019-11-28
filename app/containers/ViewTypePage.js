import React from 'react';
import { Link } from 'react-router-dom';
import { getObjectByID } from '../../models/client';

export default class ViewTypePage extends React.Component {
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
        <div className="ui menu">
          <Link className="item" to="/">
            Home
          </Link>
        </div>
        <div className="ui top attached header">Type Info</div>
        <div className="ui attached form segment">
          <p>{this.state.type && this.state.type.name}</p>
          <div className="ui right aligned grid">
            <div className="sixteen wide column">
              <div className="mini ui buttons">
                <Link
                  className="mini ui button"
                  to={'/all_objects/' + this.props.match.params.type_id}
                >
                  View Objects
                </Link>
                <Link
                  className="mini ui button"
                  to={'/new_object/' + this.props.match.params.type_id}
                >
                  Create Object
                </Link>
                <Link
                  className="mini ui button"
                  to={'/update_type/' + this.props.match.params.type_id}
                >
                  Update Type
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
