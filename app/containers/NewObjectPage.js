import React from 'react';
import { Link } from 'react-router-dom';
import { createObject } from '../../models/client';
import { tuples2obj } from '../utils/helper';

export default class NewObjectPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: [['', '']],
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
        <div class="ui top attached header">New Object</div>
        <div class="ui attached form segment">
          <div class="ui right aligned grid">
            <div class="sixteen wide column">
              <div class="mini ui icon buttons">
                <button
                  class="ui green button"
                  onClick={() =>
                    this.setState({
                      fields: this.state.fields.concat([['', '']]),
                    })
                  }
                >
                  <i class="plus icon" />
                </button>
              </div>
            </div>
          </div>
          <div class="two fields">
            <div class="field">
              <b>ID</b>
            </div>
            <div class="field">&lt;Assigned&gt;</div>
          </div>
          {this.state.fields.map((tup, i) => (
            <div class="two fields">
              <div class="field">
                <input
                  placeholder={`Field Name ${i + 1}`}
                  value={tup[0]}
                  onChange={v => this.handleFieldValueChange(v, i, 0)}
                />
              </div>
              <div class="field">
                <input
                  placeholder={`Field Value ${i + 2}`}
                  value={tup[1]}
                  onChange={v => this.handleFieldValueChange(v, i, 1)}
                />
              </div>
            </div>
          ))}
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

  handleFieldValueChange(evt, i, j) {
    const f = this.state.fields;
    f[i][j] = evt.target.value;
    this.setState({ fields: f });
  }

  handleSubmit() {
 	  createObject(tuples2obj(this.state.fields)).then((res, err) => {
	    alert(JSON.stringify(res));
	  });
  }
}
