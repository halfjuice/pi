import React from 'react';
import { Link } from 'react-router-dom';
import { createObject, getObjectByID } from '../../models/client';
import { tuples2obj, obj2tuples } from '../utils/helper';

export default class NewObjectPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: null,
      value: {type: props.match.params.type_id},
    };
  }

  componentDidMount() {
    getObjectByID(this.props.match.params.type_id).then(r => this.setState({type: r}));
  }

  render() {
    return (
      <div>
        <div class="ui menu">
          <Link class="item" to="/">
            Home
          </Link>
        </div>
        <div class="ui top attached header">New Object</div>
        <div class="ui attached form segment">
          <div class="two fields">
            <div class="field">
              <b>ID</b>
            </div>
            <div class="field">&lt;Assigned&gt;</div>
          </div>
          {this.state.type
            ? <div class="two fields">
                <div class="field">
                  <b>Type</b>
                </div>
                <div class="field">
                  <Link to={'/view_type/' + this.state.type['_id']}>{this.state.type['name']}</Link>
                </div>
              </div>
            : null}
          {obj2tuples(this.state.type).map(tup =>
            tup[0] == '_id' || tup[0] == 'type' || tup[0] == 'name'
              ? null
              : <div class="two fields">
                  <div class="field">
                    {tup[0]}
                  </div>
                  <div class="field">
                    <input
                      placeholder={`${tup[0]} Value`}
                      value={this.state.value[tup[0]] || ''}
                      onChange={v => this.handleFieldValueChange(v, tup[0])}
                    />
                  </div>
                </div>
          )}
          <button
            class="ui positive button"
            onClick={() => this.handleSubmit()}
          >
            Create
          </button>
        </div>
      </div>
    );
  }

  handleFieldValueChange(evt, k) {
    const v = this.state.value;
    v[k] = evt.target.value;
    this.setState({ value: v });
  }

  handleSubmit() {
    console.log(this.state.value);
 	  createObject(this.state.value).then((res, err) => {
	    alert(JSON.stringify(res));
	  });
  }
}
