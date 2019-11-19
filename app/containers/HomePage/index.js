
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { findObjects, createDummyData } from '../../../models/client';

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      views: [],
      options: [],
    };
  }

  componentDidMount() {
    findObjects({type: 2}).then(res => this.setState({views: res}));
  }

  render() {
    return (
      <article>
        <Helmet>
          <meta
            name="description"
            content="A React.js Boilerplate application homepage"
          />
        </Helmet>

        <div className="ui grid">
          <div className="six wide column">
            <div className="ui vertical menu">
              <div className="item">
                <div className="header">App</div>
                <div className="menu">
                  {this.state.views.map((v, i) => {
                    return <Link className="item" to={`/view/${v._id}`} key={`view_button_${i}`}>{v.name}</Link>;
                  })}
                </div>
              </div>

              <div className="item">
                <div className="header">Admin</div>
                <div className="menu">
                  <Link className="item" to="new_view">New View</Link>
                  <Link className="item" to="new_type">New Type</Link>
                  <Link className="item" to="new_rel_type">New Relationship Type</Link>
                  <Link className="item" to="all_types">All Types</Link>
                  <Link className="item" to="all_rel_types">All Relation Types</Link>
                  <a className="item" onClick={() => {
                    if (confirm('Are you sure to create set of dummy data?')) {
                      createDummyData().then(() => alert('Success!'));
                    };
                  }}>
                    Create Dummy Data
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="ten wide column">
            
          </div>
        </div>
      </article>
    );
  }
}
