import React from 'react';
import { Link } from 'react-router-dom';
import { findObjects } from '../../models/client';

export default class AllTypesPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      types: [],
    };
  }

  componentDidMount() {
    findObjects({type: 0}).then((res, err) => {
      console.log(res);
      this.setState({types: res});
    })
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
          <div class="ui items">
            {this.state.types.map(t =>
              <div class="item">
                <div class="content">
                  <Link class="header" to={'/view_type/'+t['_id']}>{t['name']}</Link>
                  <div class="description">
                    <p>Description for object</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
