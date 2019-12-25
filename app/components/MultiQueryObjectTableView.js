import React from 'react';
import sift from 'sift';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { updateObject, deleteObject } from '../../models/client';
import { mergeDict, obj2tuples, tuples2obj } from '../utils/helper';
import ObjectTableView from './ObjectTableView';
import QuerySpecRow from './QuerySpecRow';
import ViewerContext from './ViewerContext';

/*
{
  source: <id>,
  filter: ...,

}

 */
function runQueryWithSpec(spec, pageLimit, pageNo) {
  // TODO: Pagination

  function _filterFields(obj, fields) {
    return tuples2obj(obj2tuples(obj).filter(t => fields.includes(t[0])));
  }

  function _mergeAllDicts(objs) {
    return tuples2obj(objs.map(obj2tuples).reduce((a, b) => a.concat(b)));
  }

  function _appendKeyPrefix(obj, prefix) {
    return tuples2obj(obj2tuples(obj).map(t => [prefix+t[0], t[1]]));
  }

  function _mergeJoinResults(type, rows, joinResults, parentOn) {
    return [
      _mergeAllDicts([type].concat(
        joinResults.map(jr => _appendKeyPrefix(jr[0], parentOn))
      )),
      rows.map((r, i) =>
        _mergeAllDicts([r].concat(
          joinResults.map(jr => _appendKeyPrefix(jr[1][i], parentOn))
        ))
      ),
    ];
  }

  function _innerRunSpec(parentType, joinSpec, ids) {
    if (parentType[joinSpec.on].fieldType != 'relation') {
      throw 'Must join on a relation field';
    }

    return Promise.all([
      db.getObjectByID(parentType[joinSpec.on].objectType),
      db.findObjectsByIDs(ids),
    ]).then(([type, rows]) => {
      if (joinSpec.fields) {
        type = _filterFields(type, joinSpec.fields);
        rows = rows.map(r => _filterFields(r, joinSpec.fields));
      }
      type = _appendKeyPrefix(type, joinSpec.on);
      rows = rows.map(r => _appendKeyPrefix(r, joinSpec.on));
      if (!joinSpec.joins) {
        return [type, rows];
      }
      return Promise.all((joinSpec || []).map(j => {
        _innerRunSpec(type, j, rows.map(r => r[joinSpec.on]))
      })).then(joinResults => {
        return _mergeJoinResults(type, rows, joinResults, joinSpec.on);
      });
    });
  }

  let db = ViewerContext.db();
  return Promise.all([
    db.getObjectByID(spec.source),
    db.findPagedObjects({type: spec.source, ...(spec.filter || {})}, pageLimit, pageNo, {fields: spec.fields})
  ]).then(([type, data]) => {
    if (spec.fields) {
      type = _filterFields(type, spec.fields);
    }
    if (!spec.joins) {
      return [type, data.data, data.total];
    }
    return Promise.all(
      (spec.joins || []).map(j => _innerRunSpec(type, j, data.data.map(o => o[j.on])))
    ).then(joinResults => {
      return _mergeJoinResults(type, data.data, joinResults, '').concat([data.total]);
    });
  });
}

export default class MultiQueryObjectTableView extends React.Component {

  static propTypes = {
    spec: PropTypes.object,
    pageLimit: PropTypes.number,
  }

  constructor(props) {
    super(props);

    this.state = {
      columns: null,
      objects: [],

      page: 0,
      totalPage: 1,

      tempFilter: {},
      filter: {}
    };
  }

  componentDidMount() {
    this.refresh();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.spec != this.props.spec) {
      this.refresh();
    }
  }

  refresh() {
    if (this.props.useFilter) {
      runQueryWithSpec(this.props.spec, undefined, undefined).then(([cols, objs, total]) => {
        objs = objs.filter(sift(this.state.filter));
        this.setState({columns: cols, objects: objs, totalPage: Math.ceil(objs.length / this.props.pageLimit)});
      });
    } else {
      runQueryWithSpec(this.props.spec, this.props.pageLimit, this.state.page).then(([cols, objs, total]) => this.setState({
        columns: cols,
        objects: objs,
        totalPage: Math.ceil(total / this.props.pageLimit),
      }));
    }
  }

  render() {
    return (
      <>
        {this.props.useFilter &&
          <QuerySpecRow
            type={this.state.columns}
            onChange={filter => this.setState({tempFilter: filter})}
            onApply={() => this.setState({filter: {...this.state.tempFilter}}, this.refresh.bind(this))}
          />
        }
        <ObjectTableView
          type={this.state.columns}
          objects={
            this.props.useFilter
              ? this.state.objects.slice(this.state.page * this.props.pageLimit, (this.state.page+1)*this.props.pageLimit)
              : this.state.objects
          }
          totalPage={this.state.totalPage}
          page={this.state.page}
          onPageChange={page => {
            if (this.props.useFilter) {
              this.setState({page: page});
            } else {
              this.setState({page: page, objects: []}, this.refresh.bind(this));
            }
          }}
        />
      </>
    )
  }
}
