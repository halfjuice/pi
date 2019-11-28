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

        <div className="ui grid">
          <div className="six wide column">
            <h2>
              <i className="cubes icon" />
              All Types
            </h2>
          </div>
          <div className="ten wide right aligned column">
            <div className="ui icon basic buttons">
              <Link
                className="ui basic button"
                to="/new_type"
              >
                <i className="green plus icon" />
                Create
              </Link>
            </div>
          </div>
        </div>

        <table className="ui celled table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Object Action</th>
              <th>Type Action</th>
            </tr>
          </thead>

          <tbody>
            {this.state.types.map((t, i) =>
              <tr key={`row-${t['_id']}`}>
                <td>{t['_id']}</td>
                <td>
                  <Link className="header" to={`/view_type/${t['_id']}`}>
                    {t['name']}
                  </Link>
                </td>
                <td>
                  <div className="mini ui icon basic buttons">
                    <Link
                      className="ui basic button"
                      to={'/all_objects/' + t['_id']}
                    >
                      <i className="eye icon" />
                      View
                    </Link>
                    <Link
                      className="ui basic button"
                      to={'/new_object/' + t['_id']}
                    >
                      <i className="plus square outline icon" />
                      Create
                    </Link>
                  </div>
                </td>

                <td>
                  <div className="mini ui icon basic buttons">
                    <Link
                      className="ui basic button"
                      to={'/update_type/' + t['_id']}
                    >
                      <i className="edit icon" />
                      Update
                    </Link>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}
