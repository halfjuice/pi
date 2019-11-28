import React from 'react';
import { Link } from 'react-router-dom';
import NewTypeForm from '../components/NewTypeForm';

export default class NewTypePage extends React.Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
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
          <div className="four wide column">
            <h2>
              <i className="file alternate icon" />
              New Type
            </h2>
          </div>
          <div className="twelve wide right aligned column">
            <div className="ui icon basic buttons">
              <button
                className="ui basic button"
                onClick={() => this.formRef.current.addField()}
              >
                <i className="blue plus icon" />
                New Field
              </button>
            </div>
          </div>
        </div>

      <NewTypeForm ref={this.formRef} />

      </div>
    );
  }
}
