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
        <div class="ui menu">
          <Link class="item" to="/">
            Home
          </Link>
        </div>

        <div class="ui grid">
          <div class="four wide column">
            <h2>
              <i class="file alternate icon" />
              New Type
            </h2>
          </div>
          <div class="twelve wide right aligned column">
            <div class="ui icon basic buttons">
              <button
                class="ui basic button"
                onClick={() => this.formRef.current.addField()}
              >
                <i class="blue plus icon" />
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
