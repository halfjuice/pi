import React from 'react';
import { Link } from 'react-router-dom';
import { createObject, getObjectByID, findObjects, searchObjects } from '../../models/client';
import { obj2tuples } from '../utils/helper';
import { Dropdown } from 'semantic-ui-react';

export default class ViewObjectPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      obj: null,
      related: {},
      relSections: [],
      secRelTypeOptions: [],
    }
  }

  componentDidMount() {
    let obj_id = this.props.match.params.obj_id
    getObjectByID(obj_id).then(res => {
      this.setState({
        loading: false,
        obj: res,
      });
      getObjectByID(res['type']).then(typ => {
        this.state.related.type = typ
        this.setState({related: this.state.related});
      });
      findObjects({_isRelation: 1, $or: [
        {src: obj_id},
        {dst: obj_id},
      ]}).then(rels => {
        var relSections = {};
        var promises = []
        rels.forEach(r => {
          if (relSections[r.type] == undefined) {
            promises.push(getObjectByID(r.type).then(relType => {
              relSections[r.type] = {
                relType: relType,
                rels: [r],
                targetOptions: [],
              };
            }));
          } else {
            relSections[r.type].rels.push(r)
          }
        });
        Promise.all(promises).then(() => {
          this.setState({relSections: obj2tuples(relSections).map(tup => tup[1])});
        });
      });
    })
  }

  render() {
    var content = null;
    if (this.state.obj) {
      content = (
        <table className="ui celled table">
          <tbody>
            {obj2tuples(this.state.obj).map((tup, i) => {
              var val = <td>{tup[1]}</td>;
              if (tup[0] == 'type' && this.state.related.type) {
                val = <td><Link to={'/view_type/' + tup[1]}>{this.state.related.type.name}</Link></td>;
              }
              return (
                <tr key={`obj_kv_row_${i}`}>
                  <td><b>{tup[0]}</b></td>
                  {val}
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    }

    return (
      <div>
        <div className="ui menu">
          <Link className="item" to="/">
            Home
          </Link>
        </div>
        <div className="ui top attached header">Object Info</div>
        <div className="ui attached form segment">
          <p>{this.state.obj && this.state.obj.name}</p>
          {content}
        </div>

        <br />
        <Dropdown
          placeholder="Search Relation Type to Add Section"
          onChange={(e, v) => this.handleAddSection(v.value)}
          onSearchChange={(e, v) => searchObjects(1, e.target.value, 0, 5).then(
            res => this.setState({
              secRelTypeOptions: res.map(e => ({
                key: e._id,
                value: e._id,
                text: <p>{e.name}</p>,
              })),
            })
          )}
          fluid
          search={options => options}
          selection
          options={this.state.secRelTypeOptions}
        />

        {this.state.relSections != null && this.state.relSections.map(this.renderRelationSection.bind(this))}
      </div>
    );
  }

  renderRelationSection(relSec, idx) {
    var inverse = relSec.relType.srcType != this.state.obj.type;
    var targetType = inverse ? relSec.relType.dstType : relSec.relType.srcType;
    return [
      <div key={`relSecHeader${idx}`} className="ui top attached header">Relation {relSec.relType.name} {inverse && '(Inversed)'}</div>,
      <div key={`relSecContent${idx}`} className="ui attached form segment">
        {relSec.rels.map(r => {
          var target = inverse ? r.src : r.dst;
          return <p><Link to={'view_object/' + target}>{target}</Link></p>
        })}

        <Dropdown
          placeholder={`Search Object to Relate as "${relSec.relType.name}"`}
          onChange={(e, v) => {
            createObject({
              _isRelation: 1,
              type: relSec.relType._id,
              src: inverse ? v.value : this.props.match.params.obj_id,
              dst: inverse ? this.props.match.params.obj_id : v.value,
            }).then(res => {
              alert(JSON.stringify(res));
            });
          }}
          onSearchChange={(e, v) => searchObjects(targetType, e.target.value, 0, 5).then(res => {
            this.state.relSections[idx].targetOptions = res.map(elem => ({
              key: elem._id,
              value: elem._id,
              text: <p>{elem.name || elem._id}</p>
            }));
            this.setState({relSections: this.state.relSections});
          })}
          fluid
          search={options => options}
          selection
          options={this.state.relSections[idx].targetOptions}
        />
      </div>
    ];
  }

  handleAddSection(relTypeId) {
    for (var i=0; i<this.state.relSections.length; i++) {
      if (this.state.relSections[i].relType._id == relTypeId) {
        break;
      }
    }

    getObjectByID(relTypeId).then(relType => {
      this.setState({relSections: this.state.relSections.concat([{
        relType: relType,
        rels: [],
        targetOptions: [],
      }])});
    });
  }
}
