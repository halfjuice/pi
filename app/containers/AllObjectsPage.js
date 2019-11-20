import React from 'react';
import { Link } from 'react-router-dom';
import { findObjects, findPagedObjects, getObjectByID } from '../../models/client';
import { obj2tuples } from '../utils/helper';
import ObjectTableView from '../components/ObjectTableView';

export default class AllObjectsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: null,
      objects: null,

      pageLimit: 10,
      page: 0,
      totalPage: 1,
    };
  }

  componentDidMount() {
    getObjectByID(this.props.match.params.type_id).then(res => {
      this.setState({type: res});
    });

    this.refetch();
  }

  refetch() {
    findPagedObjects({type: this.props.match.params.type_id}, this.state.pageLimit, this.state.page).then(res => {
      this.setState({
        objects: res.data,
        totalPage: Math.ceil(res.total / this.state.pageLimit),
      });
    });
  }

  render() {
    return (
      <div>
        <div class="ui menu">
          <Link class="item" to="/">
            Home
          </Link>
        </div>

        <div class="ui grid">
          <div class="sixteen wide column">
            <h2>
              <i class="table alternate icon" />
              All {this.state.type && (this.state.type['name'] + ' ')}Object
            </h2>
          </div>
        </div>

        <ObjectTableView
          type={this.state.type}
          objects={this.state.objects}
          totalPage={this.state.totalPage}
          page={this.state.page}
          onPageChange={page => this.setState({page: page}, this.refetch.bind(this))}
        />
      </div>
    );
  }
}
