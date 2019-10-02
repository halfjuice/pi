
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { findObjects } from '../../../models/client';

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      views: []
    };
  }

  componentDidMount() {
    findObjects({type: 2}).then(res => this.setState({views: res}));
  }

  render() {
    return (
      <article>
        <Helmet>
          <title>Hello Home Page</title>
          <meta
            name="description"
            content="A React.js Boilerplate application homepage"
          />
        </Helmet>
        <div>

        <div className="ui menu">
          <Link className="item" to="new_type">New Type</Link>
          <Link className="item" to="new_rel_type">New Relationship Type</Link>
          <Link className="item" to="all_types">All Types</Link>
          <Link className="item" to="all_rel_types">All Relation Types</Link>
        </div>

        <div class="ui menu">
          {this.state.views.map((v, i) => {
            return <Link className="item" to={`/view/${v._id}`} key={`view_button_${i}`}>{v.name}</Link>;
          })}
          <Link className="item" to="new_view">New View</Link>
        </div>

        </div>
      </article>
    );
  }
}
