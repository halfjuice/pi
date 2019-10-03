import React from 'react';
import { Link } from 'react-router-dom';
import { createObject, getObjectByID, searchObjects } from '../../models/client';
import { tuples2obj, obj2tuples } from '../utils/helper';
import ObjectSearchDropdown from '../components/ObjectSearchDropdown';

export default class CreateObjectForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: null,
      value: {type: props.typeID, name: ''},
    };
  }

  componentDidMount() {
    getObjectByID(this.props.typeID).then(r => this.setState({type: r}));
  }

  render() {
    return (
      <div>
        <div className="ui top attached header">New Object</div>
        <div className="ui attached form segment">
          <div className="two fields">
            <div className="field">
              <b>ID</b>
            </div>
            <div className="field">&lt;Assigned&gt;</div>
          </div>
          {this.state.type
            ? <div className="two fields">
                <div className="field">
                  <b>Type</b>
                </div>
                <div className="field">
                  <Link to={'/view_type/' + this.state.type['_id']}>{this.state.type['name']}</Link>
                </div>
              </div>
            : null}
          <div className="two fields">
            <div className="field">
              <b>Name</b>
            </div>
            <div className="field">
              <input
                placeholder="Object Name"
                value={this.state.value.name}
                onChange={v => this.handleFieldValueChange(v.target.value, 'name')}
              />
            </div>
          </div>
          {obj2tuples(this.state.type).map((tup, i) =>
            tup[0] == '_id' || tup[0] == 'type' || tup[0] == 'name'
              ? null
              : <div key={`field_${i}`} className="two fields">
                  <div className="field">
                    {tup[0]}
                  </div>
                  <div className="field">
                    {this.renderValueInput(tup)}
                  </div>
                </div>
          )}
          <button
            className="ui positive button"
            onClick={() => this.handleSubmit()}
          >
            Create
          </button>
        </div>
      </div>
    );
  }

  renderValueInput(tup) {
    if (tup[1] == 'text') {
      return (
        <input
          placeholder={`${tup[0]} Value`}
          value={this.state.value[tup[0]] || ''}
          onChange={v => this.handleFieldValueChange(v.target.value, tup[0])}
        />
      );
    } else if (tup[1].fieldType == 'relation') {
      return (
        <ObjectSearchDropdown
          placeholder={`${tup[0]} Value (Related Object)`}
          onChange={v => this.handleFieldValueChange(v, tup[0])}
          onSearch={txt => searchObjects(tup[1].objectType, txt, 0, 5)}
          fluid
        />
      )
    } else if (tup[1].fieldType == 'multi_relation') {
      // TODO: Fix this!
      // Put selected tag in options so they don't disappear
      return (
        <ObjectSearchDropdown
          placeholder={`${tup[0]} Value (Related Objects)`}
          onChange={v => this.handleFieldValueChange(v, tup[0])}
          onSearch={txt => searchObjects(tup[1].objectType, txt, 0, 5)}
          multiple
          fluid
        />
      )
    } else {
      return <p>Unknown field {tup[1]}</p>;
    }
  }

  handleFieldValueChange(v, k) {
    const vv = this.state.value;
    vv[k] = v;
    this.setState({ value: vv });
  }

  handleSubmit() {
 	  createObject(this.state.value).then((res, err) => {
	    alert(JSON.stringify(res));
      this.setState({value: {type: this.props.typeID}});
	  });
  }
}
