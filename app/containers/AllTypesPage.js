import React from 'react';
import { Link } from 'react-router-dom';
import { findObjects } from '../../models/client';

export default class AllTypesPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {

  }

  render() {
    return (
      <div>
        <div class="ui menu">
          <Link class="item" to="/">
            Home
          </Link>
        </div>
        <div class="ui top attached header">All Types</div>
        <div class="ui attached form segment">

        </div>
      </div>
    );
  }
}
