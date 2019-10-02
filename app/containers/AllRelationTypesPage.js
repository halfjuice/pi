import React from 'react';
import { Link } from 'react-router-dom';
import { findObjects } from '../../models/client';

export default class AllRelationTypesPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      types: [],
    };
  }

  componentDidMount() {
    findObjects({type: 1}).then((res, err) => {
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
        <div class="ui top attached header">All Relation Types</div>
        <div class="ui attached form segment">
          <div class="ui items">
            {this.state.types.map(t =>
              <div class="item">
                <div class="content">
                  <p>Name: {t['name']}</p>
                  <p>Source Type: {t['srcType']}</p>
                  <p>Destination Type: {t['dstType']}</p>
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
