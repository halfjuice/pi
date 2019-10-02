import React from 'react';
import { Link } from 'react-router-dom';
import { createObject, searchObjects } from '../../models/client';
import { tuples2obj } from '../utils/helper';
import { Dropdown } from 'semantic-ui-react';

export default class NewRelationshipTypePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      srcType: '',
      dstType: '',
      srcTypeOptions: [],
      dstTypeOptions: [],
    };
  }

  render() {
    return (
      <div>
        <div className="ui menu">
          <Link className="item" to="/">
            Home
          </Link>
        </div>
        <div className="ui top attached header">New Relationship Type</div>
        <div className="ui attached form segment">
          <div className="two fields">
            <div className="field">
              <b>ID</b>
            </div>
            <div className="field">&lt;Assigned&gt;</div>
          </div>
          <div className="two fields">
            <div className="field">
              <b>Type</b>
            </div>
            <div className="field">&lt;Relationship Type&gt;</div>
          </div>
          <div className="two fields">
            <div className="field">
              <b>Name</b>
            </div>
            <div className="field">
              <input
                placeholder={`Type Name`}
                value={this.state.name}
                onChange={v => this.setState({name: v.target.value})}
              />
            </div>
          </div>
          <div className="two fields">
            <div className="field">
              <b>Source Type</b>
            </div>
            <div className="field">
              <Dropdown
                onChange={(e, v) => this.setState({srcType: v.value})}
                onSearchChange={(e, v) => searchObjects(0, e.target.value, 0, 5).then(
                  res => this.setState({
                    srcTypeOptions: res.map(e => ({
                      key: e._id,
                      value: e._id,
                      text: <p>{e.name}</p>,
                    })),
                  })
                )}
                search={options => options}
                selection
                options={this.state.srcTypeOptions}
              />
            </div>
          </div>
          <div className="two fields">
            <div className="field">
              <b>Destination Type</b>
            </div>
            <div className="field">
              <Dropdown
                onChange={(e, v) => this.setState({dstType: v.value})}
                onSearchChange={(e, v) => searchObjects(0, e.target.value, 0, 5).then(
                  res => this.setState({
                    dstTypeOptions: res.map(e => ({
                      key: e._id,
                      value: e._id,
                      text: <p>{e.name}</p>,
                    })),
                  })
                )}
                search={options => options}
                selection
                options={this.state.dstTypeOptions}
              />
            </div>
          </div>
          <button
            className="ui positive button"
            onClick={() => this.handleSubmit()}>
            Create
          </button>
        </div>
      </div>
    );
  }

  handleSubmit() {
 	  createObject({type: 1, srcType: this.state.srcType, dstType: this.state.dstType}).then((res, err) => {
	    alert(JSON.stringify(res));
      this.setState({
        srcType: '',
        dstType: '',
        name: '',
      })
	  });
  }
}
