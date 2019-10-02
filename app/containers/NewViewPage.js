import React from 'react';
import { Link } from 'react-router-dom';
import { createObject, getObjectByID } from '../../models/client';
import { tuples2obj, obj2tuples } from '../utils/helper';
import { Dropdown } from 'semantic-ui-react';

const VIEW_TYPES = {
  'single': {
    name: 'Single View',
    desc: 'Single View presents single object data based on query',
  },
  'table': {
    name: 'Table View',
    desc: 'Table View presents data in the form of table.',
  },
  'create': {
    name: 'Create View',
    desc: 'Create View allows you to create object.',
  },
  'multi': {
    name: 'Multi View',
    desc: 'Multi View allows you to combine multiple views together.',
  }
}

export default class NewViewPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      viewType: null,
    };
  }

  render() {
    return (
      <div>
        <div class="ui menu">
          <Link class="item" to="/">
            Home
          </Link>
        </div>
        <div class="ui top attached header">New View</div>
        <div class="ui attached form segment">
          <div class="two fields">
            <div class="field">
              <b>ID</b>
            </div>
            <div class="field">&lt;Assigned&gt;</div>
          </div>

          <div class="two fields">
            <div class="field">
              <b>Type</b>
            </div>
            <div class="field">
              &lt;View&gt;
            </div>
          </div>

          <div className="two fields">
            <div className="field">
              <b>Name</b>
            </div>
            <div className="field">
              <input
                placeholder={`View Name`}
                value={this.state.name}
                onChange={v => this.setState({name: v.target.value})}
              />
            </div>
          </div>

          <div class="two fields">
            <div class="field">
              <b>View Type</b>
            </div>
            <div class="field">
              <Dropdown
                onChange={(e, v) => this.setState({viewType: v.value})}
                selection
                options={obj2tuples(VIEW_TYPES).map(t => ({
                  key: t[0], value: t[0], text: t[1].name,
                }))}
              />
            </div>
          </div>

          <p>{this.state.viewType && VIEW_TYPES[this.state.viewType].desc}</p>



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
    if (!this.state.viewType) {
      return;
    }
 	  createObject({type: 2, viewType: this.state.viewType}).then((res, err) => {
	    alert(JSON.stringify(res));
	  });
  }
}
