import React from 'react';
import { Link } from 'react-router-dom';
import { createObject, getObjectByID } from '../../models/client';
import CreateObjectForm from '../components/CreateObjectForm';

export default class ViewPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: null,
    };
  }

  componentDidMount() {
    getObjectByID(this.props.match.params.view_id).then(v => this.setState({view: v}));
  }

  render() {
    return (
      <div>
        <div class="ui menu">
          <Link class="item" to="/">
            Home
          </Link>
        </div>
        {this.renderView(this.state.view)}
      </div>
    );
  }

  renderView(v) {
    if (!v) {
      return <p>Loading...</p>
    }

    if (v.viewType == 'create') {
      return <CreateObjectForm typeID={v.objectType} />;
    }

    return <p>View Type not supported yet: {v.viewType}</p>
  }
}
