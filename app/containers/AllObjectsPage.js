import React from 'react';
import { Link } from 'react-router-dom';
import { getObjectByID } from '../../models/client';
import { obj2tuples } from '../utils/helper';
import QueryObjectTableView from '../components/QueryObjectTableView';

export default class AllObjectsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
    };
  }

  componentDidMount() {
    getObjectByID(this.props.match.params.type_id).then(res => this.setState({type: res}));
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
              <i className="table alternate icon" />
              All {this.state.type && (this.state.type['name'] + ' ')}Object
            </h2>
          </div>
          <div className="ten wide right aligned column">
            <div className="ui icon basic buttons">
              <button
                className="ui basic button"
                onClick={() => this.setState({editing: !this.state.editing})}
              >
                <i className="blue edit icon" />
                Edit
              </button>
              <Link
                className="ui basic button"
                to={`/new_object/${this.state.type && this.state.type._id}`}
              >
                <i className="green plus icon" />
                Create
              </Link>
            </div>
          </div>
        </div>

        <QueryObjectTableView
          type={this.props.match.params.type_id}
          pageLimit={10}
          editable={this.state.editing}
        />
      </div>
    );
  }
}
