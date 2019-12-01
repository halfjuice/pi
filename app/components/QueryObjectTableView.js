import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { findPagedObjects, getObjectByID, updateObject, deleteObject } from '../../models/client';
import { mergeDict, obj2tuples } from '../utils/helper';
import ObjectTableView from './ObjectTableView';

export default class QueryObjectTableView extends React.Component {

  static propTypes = {
    type: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.number]),
    query: PropTypes.object,

    pageLimit: PropTypes.number,
    editable: PropTypes.bool,
  }

  constructor(props) {
    super(props);

    this.state = {
      type: null,
      objects: [],
      pendingChanges: {},

      page: 0,
      totalPage: 1,
    };
  }

  componentDidMount() {
    this.refresh();
  }

  refresh() {
    var isTypePropObject = !['string', 'number'].includes(typeof this.props.type);

    (isTypePropObject
      ? Promise.resolve(this.props.type)
      : getObjectByID(this.props.type)
    ).then(t => this.setState({type: t}));

    findPagedObjects(
      mergeDict(
        this.props.query || {},
        {type: isTypePropObject ? this.props.type._id : this.props.type},
      ),
      this.props.pageLimit,
      this.state.page
    ).then(res => {
      this.setState({
        objects: res.data,
        totalPage: Math.ceil(res.total / this.props.pageLimit),
      });
    });
  }

  render() {
    return (
      <ObjectTableView
        type={this.state.type}
        objects={this.state.objects}
        totalPage={this.state.totalPage}
        page={this.state.page}
        onPageChange={page => this.setState({page: page}, this.refresh.bind(this))}
        editable={this.props.editable}
        pendingChanges={this.state.pendingChanges}
        onFieldChange={(oid, k, v) => {
          if (!this.state.pendingChanges[oid]) {
            this.state.pendingChanges[oid] = {};
          }
          this.state.pendingChanges[oid][k] = v;
          this.setState({pendingChanges: this.state.pendingChanges});
        }}
        onUpdateClick={o => {
          updateObject(o._id, (this.state.pendingChanges || {})[o._id]).then(res => {
            delete this.state.pendingChanges[o._id];
            this.setState({pendingChanges: this.state.pendingChanges}, this.refresh.bind(this));
          });
        }}
        onDeleteClick={o => {
          deleteObject(o).then(res => {
            delete this.state.pendingChanges[o];
            this.setState({pendingChanges: this.state.pendingChanges}, this.refresh.bind(this));
          });
        }}
      />
    )
  }
}