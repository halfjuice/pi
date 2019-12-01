
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { findObjects, createDummyData, getCurrentUsername, logOut } from '../../../models/client';
import MainScreenPage from '../MainScreenPage';
import LoggedOutView from '../LoggedOutView';

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      views: [],

      loggedInState: null,
    };
  }

  componentDidMount() {
    this.refreshState();
  }

  refreshState() {
    getCurrentUsername().then(n => {
      this.setState({loggedInState: n ? 'login' : 'logout'}, () => {
        findObjects({type: 2}).then(res => this.setState({views: res}));
      })
    });
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

        {this.renderContentView()}
      </article>
    )
  }

  renderContentView() {
    if (this.state.loggedInState == null) {
      return <p></p>;
    } else if (this.state.loggedInState == 'logout') {
      return this.renderLoggedOutView();
    } else /* if (this.state.loggedInState == 'login') */ {
      return this.renderLoggedInView();
    }
  }

  renderLoggedOutView() {
    return (
      <LoggedOutView
        onLoggedIn={() => this.refreshState()}
      />
    );
  }

  renderLoggedInView() {
    return (
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
                <Link className="item" to="all_types">All Types</Link>
                <a className="item" onClick={() => {
                  if (confirm('Are you sure to create set of dummy data?')) {
                    createDummyData().then(() => alert('Success!'));
                  };
                }}>
                  Create Dummy Data
                </a>
              </div>
            </div>

            <div className="item">
              <div className="header">Account</div>
              <div className="menu">
                <a className="item" onClick={() => logOut().then(() => this.refreshState())}>
                  Logout
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="ten wide column">
          <MainScreenPage />
        </div>
      </div>
    );
  }
}
