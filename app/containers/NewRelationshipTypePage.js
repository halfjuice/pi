import React from 'react';
import { Link } from 'react-router-dom';
import { createObject, searchObjects } from '../../models/client';
import { tuples2obj } from '../utils/helper';
import ObjectSearchDropdown from '../components/ObjectSearchDropdown';

export default class NewRelationshipTypePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      srcType: '',
      dstType: '',
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
              <ObjectSearchDropdown
                onChange={v => this.setState({srcType: v._id})}
                onSearch={txt => searchObjects(0, txt, 0, 5)}
              />
            </div>
          </div>
          <div className="two fields">
            <div className="field">
              <b>Destination Type</b>
            </div>
            <div className="field">
              <ObjectSearchDropdown
                onChange={v => this.setState({dstType: v._id})}
                onSearch={txt => searchObjects(0, txt, 0, 5)}
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
 	  createObject({type: 1, name: this.state.name, srcType: this.state.srcType, dstType: this.state.dstType}).then((res, err) => {
	    alert(JSON.stringify(res));
      this.setState({
        srcType: '',
        dstType: '',
        name: '',
      })
	  });
  }
}
