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
      this.setState({types: res});
    })
  }

  render() {
    return (
      <div>
        <div className="ui menu">
          <Link className="item" to="/">
            Home
          </Link>
        </div>
        <div className="ui top attached header">All Types</div>
        <div className="ui attached form segment">
          <div className="ui items">
            {this.state.types.map((t, i) =>
              <div key={`type_item_${i}`} className="item">
                <div className="content">
                  <Link className="header" to={'/view_type/'+t['_id']}>{t['name']}</Link>
                  <div className="description">
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
