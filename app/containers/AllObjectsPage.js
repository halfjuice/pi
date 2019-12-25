import React from 'react';
import { Link } from 'react-router-dom';
import { getObjectByID, getCurrentUsername } from '../../models/client';
import { obj2tuples } from '../utils/helper';
import { Modal } from 'semantic-ui-react';
import QueryObjectTableView from '../components/QueryObjectTableView';
import ImportDataWizardView from './ImportDataWizardView';
import QuerySpecRow from '../components/QuerySpecRow';

export default class AllObjectsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,

      tempFilter: {},
      filter: {},
    };
  }

  componentDidMount() {
    getObjectByID(this.props.match.params.type_id).then(res => this.setState({type: res}));
    getCurrentUsername().then(n => n ? null : this.props.history.push('/'));
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
                All {this.state.type && (this.state.type['name'] + ' ')}Object
              </h2>
            </div>
            <div className="ten wide right aligned column">
              <div className="ui bulleted horizontal list">
                <a
                  className="item"
                  onClick={() => this.setState({editing: !this.state.editing})}
                >
                  <i className="blue edit icon" />
                  Edit
                </a>
                <Link
                  className="item"
                  to={`/new_object/${this.state.type && this.state.type._id}`}
                >
                  <i className="green plus icon" />
                  Create
                </Link>
                <Modal
                  trigger={
                    <a className="item">
                      <i className="arrow alternate circle down outline icon" />
                      Import
                    </a>
                  }>
                  <Modal.Header>Import data as {this.state.type && this.state.type.name}</Modal.Header>
                  <ImportDataWizardView type={this.state.type} />
                </Modal>
              </div>
            </div>
          </div>
        </div>

        {this.state.type &&
          <QuerySpecRow
            type={this.state.type}
            onChange={filter => {
              this.setState({tempFilter: filter});
            }}
            onApply={() => this.setState({filter: {...this.state.tempFilter}})}
          />
        }

        <QueryObjectTableView
          type={this.props.match.params.type_id}
          pageLimit={20}
          editable={this.state.editing}
          query={this.state.filter}
        />
      </div>
    );
  }
}
