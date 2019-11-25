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

        <div class="ui grid">
          <div class="sixteen wide column">
            <h2>
              <i class="cubes icon" />
              All Types
            </h2>
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
              <tr>
                <td>{t['_id']}</td>
                <td>
                  <Link className="header" to={`/view_type/${t['_id']}`}>
                    {t['name']}
                  </Link>
                </td>
                <td>
                  <div class="mini ui icon basic buttons">
                    <Link
                      class="ui basic button"
                      to={'/all_objects/' + t['_id']}
                    >
                      <i className="eye icon" />
                      View
                    </Link>
                    <Link
                      class="ui basic button"
                      to={'/new_object/' + t['_id']}
                    >
                      <i className="plus square outline icon" />
                      Create
                    </Link>
                  </div>
                </td>

                <td>
                  <div class="mini ui icon basic buttons">
                    <Link
                      class="ui basic button"
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
