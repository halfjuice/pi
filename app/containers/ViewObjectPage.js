import React from 'react';
import { Link } from 'react-router-dom';
import { createObject, getObjectByID, findObjectsByIDs, findObjects, searchObjects } from '../../models/client';
import { obj2tuples } from '../utils/helper';
import ObjectSearchDropdown from '../components/ObjectSearchDropdown';
import NewObjectForm from '../components/NewObjectForm';

export default class ViewObjectPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      obj: null,
      type: null,
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
        this.setState({type: typ, related: this.state.related});
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
              };
            }));
          } else {
            relSections[r.type].rels.push(r)
          }
        });
        // TODO: Use groupby concept to refactor
        Promise.all(promises).then(() => {
          let ps = [];
          for (var kk in relSections) {
            ((k) => {
              ps.push(findObjectsByIDs(relSections[k].rels.map(r => r.src == obj_id ? r.dst : r.src)).then(data => {
                relSections[k].relTargets = data;
              }));
            })(kk)
          }
          return Promise.all(ps);
        }).then(() => {
          this.setState({relSections: obj2tuples(relSections).map(tup => tup[1])});
        });
      });
    })
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
          <div className="four wide column">
            <h2>
              <i className="file alternate icon" />
              View Object
            </h2>
          </div>
          <div className="twelve wide right aligned column">
            <div className="mini ui icon buttons">
            </div>
          </div>
        </div>

        {this.state.obj && <NewObjectForm typeID={this.state.obj.type} object={this.state.obj} />}

      </div>
    );
  }

  renderRelationPart() {
    return [
      <br />,
      <ObjectSearchDropdown
        placeholder="Search Relation Type to Add Section"
        onChange={v => this.handleAddSection(v)}
        onSearch={txt => searchObjects(1, txt, 0, 5)}
        fluid
      />,
      this.state.relSections != null && this.state.relSections.map(this.renderRelationSection.bind(this)),
    ];
  }

  renderRelationSection(relSec, idx) {
    var targetType = relSec.relType.dstType == this.state.obj._id ? relSec.relType.srcType : relSec.relType.dstType;
    return [
      <div key={`relSecHeader${idx}`} className="ui top attached header">Relation - {relSec.relType.name}</div>,
      <div key={`relSecContent${idx}`} className="ui attached form segment">
        {relSec.rels.map((r, i) => {
          var inversed = r.src != this.props.match.params.obj_id;
          var target = inversed ? r.src : r.dst;
          var targetDOM = <Link to={`/view_object/${target}`}>{relSec.relTargets[i].name}</Link>;
          return (
            <p key={`viewObjectLink${i}`}>
              {inversed ? targetDOM : <i>This</i>} <i className="ui icon long arrow alternate right"/> {inversed ? <i>This</i> : targetDOM}
            </p>
          )
        })}

        <ObjectSearchDropdown
          placeholder={`Search Object to Relate as "${relSec.relType.name}"`}
          onChange={v => {
            createObject({
              _isRelation: 1,
              type: relSec.relType._id,
              src: inverse ? v._id : this.props.match.params.obj_id,
              dst: inverse ? this.props.match.params.obj_id : v._id,
            }).then(res => {
              alert(JSON.stringify(res));
            });
          }}
          onSearch={txt => searchObjects(targetType, txt, 0, 5)}
          fluid
        />
      </div>
    ];
  }

  handleAddSection(relType) {
    for (var i=0; i<this.state.relSections.length; i++) {
      if (this.state.relSections[i].relType._id == relType._id) {
        break;
      }
    }

    this.setState({relSections: this.state.relSections.concat([{
      relType: relType,
      rels: [],
      relTargets: [],
    }])});
  }
}
