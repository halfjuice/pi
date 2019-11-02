import React from 'react';
import { Link } from 'react-router-dom';
import { createObject, getObjectByID } from '../../models/client';
import { tuples2obj, obj2tuples } from '../utils/helper';
import NewObjectForm from '../components/NewObjectForm';

export default class NewObjectPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="ui menu">
          <Link className="item" to="/">
            Home
          </Link>
        </div>
        <NewObjectForm typeID={this.props.match.params.type_id} />
      </div>
    );
  }
}
