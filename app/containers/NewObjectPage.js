import React from 'react';
import { Link } from 'react-router-dom';
import { createObject } from '../../models/client';

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
        <div className="ui menu">
          <Link class="item" to="/">
            Home
          </Link>
        </div>
        <div className="ui top attached header">New Object</div>
        <div className="ui attached form segment">
          <div className="ui right aligned grid">
            <div className="sixteen wide column">
              <div className="mini ui icon buttons">
                <button
                  className="ui green button"
                  onClick={() =>
                    this.setState({
                      fields: this.state.fields.concat([['', '']]),
                    })
                  }
                >
                  <i className="plus icon" />
                </button>
              </div>
            </div>
          </div>
          <div className="two fields">
            <div className="field">
              <b>ID</b>
            </div>
            <div className="field">&lt;Assigned&gt;</div>
          </div>
          {this.state.fields.map((tup, i) => (
            <div className="two fields">
              <div className="field">
                <input
                  placeholder={`Field Name ${i + 1}`}
                  value={tup[0]}
                  onChange={v => this.handleFieldValueChange(v, i, 0)}
                />
              </div>
              <div className="field">
                <input
                  placeholder={`Field Value ${i + 2}`}
                  value={tup[1]}
                  onChange={v => this.handleFieldValueChange(v, i, 1)}
                />
              </div>
            </div>
          ))}
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

  handleFieldValueChange(evt, i, j) {
    const f = this.state.fields;
    f[i][j] = evt.target.value;
    this.setState({ fields: f });
  }

  handleSubmit() {
      createObject({ test: 'hello world' }).then((res, err) => {
	  alert(JSON.stringify(res.data));
      });
  }
}
