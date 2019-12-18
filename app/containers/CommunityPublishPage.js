import React from 'react';
import { Link } from 'react-router-dom';
import { communityDB, searchObjects, findObjectsByIDs, PrimType, getCurrentUsername } from '../../models/client';
import { tuples2obj, obj2tuples } from '../utils/helper';
import ObjectSearchDropdown from '../components/ObjectSearchDropdown';

export default class CommunityPublishPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: {},
      spread: {},
      spreadFrom: {},
      modelName: '',
    };
  }

  componentDidMount() {

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
          <div className="six wide column">
            <h2>
              <i className="file alternate icon" />
              Publish New Model
            </h2>
          </div>
          <div className="six wide right aligned column">
          </div>
        </div>

        <div className="ui form" style={{marginTop: '16px'}}>
          <div className="field">
            <label>Model Name</label>
            <input
              type="text"
              placeholder="Model Name"
              onChange={e => this.setState({modelName: e.target.value})}
              value={this.state.modelName}
            />
          </div>
        </div>

        <div style={{marginTop: '16px'}}>
          <ObjectSearchDropdown
            fluid
            placeholder={`Find type to include in model...`}
            onChange={v => this.handleAddType(v)}
            onSearch={txt => searchObjects(PrimType.Type, txt, 0, 5)}
            value={null}
          />
        </div>

        {(Object.keys(this.state.selected).length > 0) &&
          <div className="ui segment">
            <h5>Selected Types</h5>
            <ul class="ui list">
              {Object.keys(this.state.selected).map(k => {
                return <li key={'selected_'+k}>{this.state.selected[k].name}</li>;
              })}
            </ul>
          </div>
        }

        {(Object.keys(this.state.spread).length > 0) &&
          <div className="ui segment">
            <h5>Related types</h5>
            <ul class="ui list">
              {Object.keys(this.state.spread).map(k =>
                <li key={'spread_'+k}>
                  {this.state.spread[k].name}
                  &nbsp;(
                    <i className="left arrow icon" />
                    {this.state.spreadFrom[k].map(t => t.name).join(', ')}
                  )
                  &nbsp;
                  <a onClick={() => this.handleAddType(this.state.spread[k])}>
                    Include
                  </a>
                </li>
              )}
            </ul>
          </div>
        }

        <div style={{textAlign: 'right', marginTop: '16px'}}>
          <button className="ui primary button" onClick={() => this.handlePublish()}>
            Publish
          </button>
        </div>
      </div>
    );
  }

  handleAddType(typ) {
    this.state.selected[typ._id] = typ;

    var spreadIDs = [];
    for (var k in typ) {
      if (typ[k].fieldType == 'relation' || typ[k].fieldType == 'multi_relation') {
        let sid = typ[k].objectType;
        spreadIDs.push(sid);
        if (!this.state.spreadFrom[sid]) {
          this.state.spreadFrom[sid] = [];
        }
        this.state.spreadFrom[sid].push(typ);
      }
    }
    if (typ._id in this.state.spread) {
      delete this.state.spread[typ._id];
      delete this.state.spreadFrom[typ._id];
    }
    this.setState({
      selected: this.state.selected,
      spread: this.state.spread,
      spreadFrom: this.state.spreadFrom,
    }, () => {
      findObjectsByIDs(spreadIDs).then(docs => {
        docs.forEach(doc => {this.state.spread[doc._id] = doc});
        this.setState({spread: this.state.spread});
      });
    });
  }

  handlePublish() {
    var idMap = tuples2obj(Object.keys(this.state.selected).map((k, i) => [k, 'temp_'+i]));
    var types = Object.keys(this.state.selected).map(tid => {
      var res = {_id: idMap[tid]};
      let typ = this.state.selected[tid];
      for (var k in typ) {
        if (k == '_rev' || k == '_id') {
          continue;
        }

        if (typ[k].fieldType == 'relation' || typ[k].fieldType == 'multi_relation') {
          if (typ[k].objectType in this.state.selected) {
            res[k] = {...typ[k]};
            res[k].objectType = idMap[res[k].objectType];
          }
          continue;
        }

        res[k] = typ[k];
      }
      return res;
    });

    var model = {
      name: this.state.modelName,
      type: PrimType.CommunityModel,
      createdAt: (new Date()).getTime(),
      types: types,
    };
    getCurrentUsername().then(un => {
      model['username'] = un;
      communityDB.createObject(model).then(res => {
        console.log(res);
      });
    })
  }
}
