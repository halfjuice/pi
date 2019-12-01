import React from 'react';
import { Link } from 'react-router-dom';
import NewViewForm from '../components/NewViewForm';

export default class NewViewPage extends React.Component {
  constructor(props) {
    super(props);
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
          <div class="sixteen wide column">
            <h2>
              <i class="table alternate icon" />
              New View
            </h2>
          </div>
        </div>

        <NewViewForm
          onSubmit={view => {
         	  createObject(view).then((res, err) => {
        	    alert(JSON.stringify(res));
        	  });
          }}
        />
      </div>
    );
  }
}
