
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { findObjects, searchObjects, createDummyData } from '../../../models/client';

import { Dropdown } from 'semantic-ui-react';
import ObjectSearchDropdown from '../../components/ObjectSearchDropdown';

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
          <div class="six wide column">
            <div className="ui vertical menu">
              <div className="item">
                <div className="header">App</div>
                <div className="menu">
                  {this.state.views.map((v, i) => {
                    return <Link className="item" to={`/view/${v._id}`} key={`view_button_${i}`}>{v.name}</Link>;
                  })}
                  <Link className="item" to="new_view">New View</Link>
                </div>
              </div>

              <div className="item">
                <div className="header">Admin</div>
                <div className="menu">
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
          <div class="ten wide column">
            <Dropdown
              placeholder='State'
              fluid
              multiple
              search
              selection
              onSearchChange={(e, v) => {
                searchObjects(0, e.target.value, 0, 5).then(res => {
                  this.setState({
                    options: res.map(e => ({
                      key: e._id,
                      value: e._id,
                      text: e.name,
                    })),
                  });
                });
              }}
              options={this.state.options}
            />
            <ObjectSearchDropdown
              fluid
              multiple
              onSearch={txt => searchObjects(0, txt, 0, 5)}
            />
          </div>
        </div>
      </article>
    );
  }
}
