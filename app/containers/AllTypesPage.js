import React from 'react';
import { Link } from 'react-router-dom';
import { Modal } from 'semantic-ui-react';
import ImportDataWizardView from './ImportDataWizardView';
import ViewerContext from '../components/ViewerContext';

export default class AllTypesPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      types: [],
    };
  }

  componentDidMount() {
    this.refresh();
  }

  refresh() {
    ViewerContext.db().findObjects({type: 0}).then((res, err) => {
      this.setState({types: res});
    });
  }

  render() {
    return (
      <div>
        <div className="ui menu">
          <Link className="item" to="/">
            Home
          </Link>
        </div>

        <div className="ui bottom aligned grid">
          <div className="row">
            <div className="six wide column">
              <h2>
                All Types
              </h2>
            </div>
            <div className="ten wide right aligned column">
              <div className="ui horizontal bulleted list">
                <Link
                  className="item"
                  to="/new_type"
                >
                  <i className="green plus icon" />
                  New Type
                </Link>
              </div>
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
                <td>{t['_id'].slice(0, 5)+'..'}</td>
                <td>
                  <Link className="header" to={`/view_type/${t['_id']}`}>
                    {t['name']}
                  </Link>
                </td>
                <td>
                  <div className="ui divided horizontal list">
                    <Link
                      className="item"
                      to={'/all_objects/' + t['_id']}
                    >
                      View All
                    </Link>
                    <Link
                      className="item"
                      to={'/new_object/' + t['_id']}
                    >
                      Create
                    </Link>
                    <Modal
                      trigger={
                        <a className="item">
                          Import
                        </a>
                      }>
                      <Modal.Header>Import data as {t['name']}</Modal.Header>
                      <ImportDataWizardView type={t} />
                    </Modal>
                  </div>
                </td>

                <td>
                  <div className="ui divided horizontal list">
                    <Link
                      className="item"
                      to={'/update_type/' + t['_id']}
                    >
                      Edit
                    </Link>
                    <a
                      className="item"
                      onClick={() => {
                        if (confirm('Are you sure to delete type ' + t['name'] + '?')) {
                          ViewerContext.db().deleteType({_id: t['_id'], _rev: t['_rev']}).then(res => this.refresh()).catch(err => console.error(err));
                        }
                      }}
                    >
                      Delete
                    </a>
                    <a
                      className="item"
                      onClick={() => {
                        if (confirm('Are you sure to purge all data in type ' + t['name'] + '?')) {
                          ViewerContext.db().purge({_id: t['_id'], _rev: t['_rev']}).then(res => this.refresh()).catch(err => console.error(err));
                        }
                      }}
                    >
                      Purge
                    </a>
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
