import React from 'react';
import { Link } from 'react-router-dom';
import { getObjectByID, findObjects } from '../../models/client';
import CreateObjectForm from '../components/CreateObjectForm';
import ObjectTableView from '../components/ObjectTableView';

export default class ViewPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: null,

      type: null,

      data: null,
    };
  }

  componentDidMount() {
    getObjectByID(this.props.match.params.view_id).then(v => {
      this.setState({view: v})
      getObjectByID(v.objectType).then(ot => this.setState({type: ot}));
      if (v.viewType == 'table') {
        findObjects({type: v.objectType}).then(data => this.setState({data: data}));
      }
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

    if (v.viewType == 'table') {
      return (
        <div>
          <div className="ui top attached header">{v.name}</div>
          <div className="ui attached form segment">
            <ObjectTableView type={this.state.type} objects={this.state.data} />
          </div>
        </div>
      );
    }

    return <p>View Type not supported yet: {v.viewType}</p>
  }
}
