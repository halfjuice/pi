
import React from 'react';
import { logIn, signUp } from '../../models/client';

export default class LoggedOutView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLogin: true,

      error: null,
    }
  }

  render() {
    return (
      <div className="ui one column stackable center aligned page grid">
        <div className="six wide column" style={{marginTop: '36px'}}>
          <table className="ui form table">
            <thead>
              <tr>
                <td colSpan="2"><h3>{this.state.isLogin ? 'Login' : 'Sign Up'}</h3></td>
              </tr>
              {
                this.state.error
                  ? <tr>
                      <td colSpan="2">
                        <div className="ui negative message">
                          {this.state.error}
                        </div>
                      </td>
                    </tr>
                  : null
              }
            </thead>
            <tbody>
              <tr>
                <td className="six wide right aligned"><b>Username</b></td>
                <td className="ten wide"><input ref={c => {this.usernameInput = c; }}type="text" placeholder="Username" /></td>
              </tr>
              <tr>
                <td className="six wide right aligned"><b>Password</b></td>
                <td className="ten wide"><input ref={c => {this.passwordInput = c; }} type="password" placeholder="Password" /></td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th colSpan="2" className="right aligned">
                  <a href="#" onClick={() => this.setState({isLogin: !this.state.isLogin})}>
                    {this.state.isLogin ? 'Sign Up' : 'Login'}
                  </a>

                  &nbsp;&nbsp;&nbsp;

                  <button className="ui primary button" onClick={() => this.onSubmit()}>
                    {this.state.isLogin ? 'Login' : 'Sign Up'}
                  </button>
                </th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  }

  onSubmit() {
    var username = this.usernameInput.value;
    var password = this.passwordInput.value;

    var p = this.state.isLogin
      ? logIn(username, password)
      : signUp(username, password).then(() => logIn(username, password));

    p
      .then(res => this.props.onLoggedIn && this.props.onLoggedIn())
      .catch(err => {
        console.error(err);
        this.setState({error: err.message});
      });
  }
}
