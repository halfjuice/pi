
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
      <MainScreenPage
        onLoggedOut={() => this.refreshState()}
      />
    );
  }
}
