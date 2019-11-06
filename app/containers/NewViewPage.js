import React from 'react';
import { Link } from 'react-router-dom';
import { createObject, getObjectByID, searchObjects } from '../../models/client';
import { tuples2obj, obj2tuples } from '../utils/helper';
import { Dropdown } from 'semantic-ui-react';
import ObjectSearchDropdown from '../components/ObjectSearchDropdown';
import QuerySpecRow from '../components/QuerySpecRow';

const VIEW_TYPE_SPECS = {
  'single': {
    name: 'Single View',
    desc: 'Single View presents single object data based on query',
    specifyType: true,
    specifyQuery: true,
    icon: 'cube',
  },
  'table': {
    name: 'Table View',
    desc: 'Table View presents data in the form of table.',
    specifyType: true,
    specifyQuery: true,
    icon: 'table',
  },
  'create': {
    name: 'Create View',
    desc: 'Create View allows you to create object.',
    specifyType: true,
    icon: 'plus square outline',
  },
  // TODO
  'multi': {
    name: 'Multi View',
    desc: 'Multi View allows you to combine multiple views together.',
    icon: 'copy outline',
  },
  // TODO
  'tree': {
    name: 'Tree View',
    desc: 'Tree View present related object in a tree structured starting from a root object.',
    icon: 'indent',
  },
  'calendar': {
    name: 'Calendar View',
    desc: 'Calendar View present object with datetime property in calendar form.',
    specifyType: true,
    specifyQuery: true,
    icon: 'calendar alternate outline',
  },
  // TODO
  'map': {
    name: 'Map View',
    desc: 'Map View present object in geolocation form.',
    icon: 'map outline',
  },
}

export default class NewViewPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      viewType: null,
      objectType: null,
      filter: null,
      index: null,
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

        <div class="ui grid">
          <div class="sixteen wide column">
            <h2>
              <i class="table alternate icon" />
              New View
            </h2>
          </div>
          <div class="twelve wide right aligned column">
          </div>
        </div>

        <table className="ui form table">
          <tbody>
            <tr>
              <td className="six wide right aligned"><b>ID</b></td>
              <td className="twelve wide">&lt;Assigned&gt;</td>
            </tr>
            <tr>
              <td className="right aligned"><b>Type</b></td>
              <td>&lt;View&gt;</td>
            </tr>
            <tr>
              <td className="right aligned"><b>Name</b></td>
              <td>
                <input
                  placeholder={`View Name`}
                  value={this.state.name}
                  onChange={v => this.setState({name: v.target.value})}
                />
              </td>
            </tr>
            <tr>
              <td className="right aligned"><b>View Type</b></td>
              <td>
                <Dropdown
                  onChange={(e, v) => this.setState({viewType: v.value})}
                  selection
                  options={obj2tuples(VIEW_TYPE_SPECS).map(t => ({
                    key: t[0], value: t[0], text: t[1].name, icon: t[1].icon,
                  }))}
                />
                <p>{this.state.viewType && VIEW_TYPE_SPECS[this.state.viewType].desc}</p>
              </td>
            </tr>
            {viewTypeSpec && viewTypeSpec.specifyType &&
              <tr>
                <td class="right aligned">
                  <b>Object Type</b>
                </td>
                <td>
                  <ObjectSearchDropdown
                    onChange={t => this.setState({objectType: t})}
                    onSearch={txt => searchObjects(0, txt, 0, 5)}
                  />
                </td>
              </tr>}
            {viewTypeSpec && viewTypeSpec.specifyQuery && this.state.objectType &&
              <tr>
                <td colSpan="2">
                  <QuerySpecRow
                    type={this.state.objectType}
                    onChange={spec => this.setState({filter: spec})}
                  />
                </td>
              </tr>
            }
            {this.maybeRenderCalendarIndexField()}
          </tbody>
          <tfoot>
            <tr>
              <th colspan="2">
                <button
                  class="ui right floated positive button"
                  onClick={() => this.handleSubmit()}>
                  Create
                </button>
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }

  maybeRenderCalendarIndexField() {
    if (this.state.viewType != 'calendar') {
      return null;
    }

    if (!this.state.objectType) {
      return null;
    }

    var possibleFields = obj2tuples(this.state.objectType)
      .filter(fv => fv[1] == 'datetime');

    if (!possibleFields.length) {
      return (
        <tr>
          <td></td>
          <td>
            There is no datetime field in this object to create calendar view.
          </td>
        </tr>
      );
    }

    return (
      <tr>
        <td class="right aligned">
          Index Field
        </td>
        <td>
          <Dropdown
            onChange={(e, v) => this.setState({index: v.value})}
            selection
            options={possibleFields.map(fv => ({key: fv[0], value: fv[0], text: fv[0]}))}
          />
        </td>
      </tr>
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

    if (this.state.filter) {
      view['filter'] = this.state.filter;
    }
    if (this.state.index) {
      view['index'] = this.state.index;
    }

 	  createObject(view).then((res, err) => {
	    alert(JSON.stringify(res));
	  });
  }

  getViewTypeSpec() {
    return this.state.viewType && VIEW_TYPE_SPECS[this.state.viewType];
  }
}
