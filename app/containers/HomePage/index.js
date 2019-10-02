
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

export default function HomePage() {

  return (
    <article>
      <Helmet>
        <title>Hello Home Page</title>
        <meta
          name="description"
          content="A React.js Boilerplate application homepage"
        />
      </Helmet>
      <div>
      <div class="ui menu">
        <Link class="item" to="new_type">New Type</Link>
        <Link class="item" to="new_rel_type">New Relationship Type</Link>
        <Link class="item" to="all_types">All Types</Link>
        <Link class="item" to="all_rel_types">All Relation Types</Link>
      </div>
        <table class="ui celled table">
          <thead>
            <tr>
              <th>What</th>
              <th>W</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Hello</td>
              <td>World</td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>
  );
}
