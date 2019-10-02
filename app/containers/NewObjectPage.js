import React from 'react';
import { Link } from 'react-router-dom';
import { createObject, getObjectByID } from '../../models/client';
import { tuples2obj, obj2tuples } from '../utils/helper';
import CreateObjectForm from '../components/CreateObjectForm';

export default class NewObjectPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div class="ui menu">
          <Link class="item" to="/">
            Home
          </Link>
        </div>
        <CreateObjectForm typeID={this.props.match.params.type_id} />
      </div>
    );
  }
}
