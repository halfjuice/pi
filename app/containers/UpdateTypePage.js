import React from 'react';
import { Link } from 'react-router-dom';
import { getObjectByID } from '../../models/client';
import NewTypeForm from '../components/NewTypeForm';

export default class UpdateTypePage extends React.Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {type: null};
  }

  componentDidMount() {
    getObjectByID(this.props.match.params.type_id).then(res => this.setState({
      type: res,
    }))
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
              Update Type
            </h2>
          </div>
          <div class="twelve wide right aligned column">
            <div class="mini ui icon buttons">
              <button
                class="ui blue basic button"
                onClick={() => this.formRef.current.addField()}
              >
                <i class="plus icon" />
                New Field
              </button>
            </div>
          </div>
        </div>

      {this.state.type &&
        <NewTypeForm ref={this.formRef} type={this.state.type} />
      }

      </div>
    );
  }
}
