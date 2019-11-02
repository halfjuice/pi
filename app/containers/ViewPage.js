import React from 'react';
import { Link } from 'react-router-dom';
import { getObjectByID, findObjects, findPagedObjects } from '../../models/client';
import NewObjectForm from '../components/NewObjectForm';
import ObjectTableView from '../components/ObjectTableView';

export default class ViewPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: null,

      type: null,

      data: null,

      pageLimit: 10,
      totalPage: 1,
      page: 0,
    };
  }

  componentDidMount() {
    getObjectByID(this.props.match.params.view_id).then(v => {
      this.setState({view: v}, () => {
        if (v.viewType == 'table') {
          this.refetchTableView();
        }
      });
      getObjectByID(v.objectType).then(ot => this.setState({type: ot}));
    });
  }

  refetchTableView() {
    var query = this.state.view.filter || {};
    query['type'] = this.state.view.objectType;
    console.log('refetch', this.state.page);
    findPagedObjects(query, this.state.pageLimit, this.state.page).then(data => {
      this.setState({
        data: data.data,
        totalPage: Math.ceil(data.total / this.state.pageLimit),
      });
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
      return <NewObjectForm typeID={v.objectType} />;
    }

    if (v.viewType == 'table') {
      return (
        <div>
          <div className="ui top attached header">{v.name}</div>
          <div className="ui attached form segment">
            <ObjectTableView
              type={this.state.type}
              objects={this.state.data}
              totalPage={this.state.totalPage}
              page={this.state.page}
              onPageChange={page => this.setState({page: page}, this.refetchTableView.bind(this))}
            />
          </div>
        </div>
      );
    }

    return <p>View Type not supported yet: {v.viewType}</p>
  }
}
