import React from 'react';
import { Link } from 'react-router-dom';
import { createObject, getObjectByID, searchObjects } from '../../models/client';
import { tuples2obj, obj2tuples } from '../utils/helper';
import { Dropdown } from 'semantic-ui-react';
import ObjectSearchDropdown from '../components/ObjectSearchDropdown';

const VIEW_TYPE_SPECS = {
  'single': {
    name: 'Single View',
    desc: 'Single View presents single object data based on query',
    specifyType: true,
    specifyQuery: true,
  },
  'table': {
    name: 'Table View',
    desc: 'Table View presents data in the form of table.',
    specifyType: true,
    specifyQuery: true,
  },
  'create': {
    name: 'Create View',
    desc: 'Create View allows you to create object.',
    specifyType: true,
  },
  'multi': {
    name: 'Multi View',
    desc: 'Multi View allows you to combine multiple views together.',
  },
  'tree': {
    name: 'Tree View',
    desc: 'Tree View present related object in a tree structured starting from a root object.',
  },
  'calendar': {
    name: 'Calendar View',
    desc: 'Calendar View present object with datetime property in calendar form.',
  },
}

export default class NewViewPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      viewType: null,
      objectType: null,
    };
  }

  render() {
    let viewTypeSpec = this.getViewTypeSpec();

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
                options={obj2tuples(VIEW_TYPE_SPECS).map(t => ({
                  key: t[0], value: t[0], text: t[1].name,
                }))}
              />
            </div>
          </div>

          <p>{this.state.viewType && VIEW_TYPE_SPECS[this.state.viewType].desc}</p>

          {viewTypeSpec && viewTypeSpec.specifyType &&
            <div class="two fields">
              <div class="field">
                <b>Object Type</b>
              </div>
              <div class="field">
                <ObjectSearchDropdown
                  onChange={t => this.setState({objectType: t})}
                  onSearch={txt => searchObjects(0, txt, 0, 5)}
                />
              </div>
            </div>}

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
    let view = {type: 2, viewType: this.state.viewType, name: this.state.name};
    let viewTypeSpec = this.getViewTypeSpec();
    if (viewTypeSpec.specifyType) {
      if (!this.state.objectType) {
        return;
      }
      view.objectType = this.state.objectType._id;
    }
 	  createObject(view).then((res, err) => {
	    alert(JSON.stringify(res));
	  });
  }

  getViewTypeSpec() {
    return this.state.viewType && VIEW_TYPE_SPECS[this.state.viewType];
  }
}
