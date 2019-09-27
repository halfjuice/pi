/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Switch, Route } from 'react-router-dom';

import HomePage from 'containers/HomePage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import NewObjectPage from 'containers/NewObjectPage';
import NewTypePage from 'containers/NewTypePage';
import AllObjectsPage from 'containers/AllObjectsPage';
import AllTypesPage from 'containers/AllTypesPage';
import ViewTypePage from 'containers/ViewTypePage';

import GlobalStyle from '../../global-styles';


const AppWrapper = styled.div`
  max-width: calc(768px + 16px * 2);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

export default function App() {
  return (
    <AppWrapper>
      <Helmet
        titleTemplate="%s - React.js Boilerplate"
        defaultTitle="React.js Boilerplate"
      >
        <link
          rel="stylesheet"
          href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
        />
        <meta name="description" content="A React.js Boilerplate application" />
      </Helmet>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/new_type" component={NewTypePage} />
        <Route path="/new_object/:type_id" component={NewObjectPage} />
        <Route path="/all_types" component={AllTypesPage} />
        <Route path="/all_objects/:type_id" component={AllObjectsPage} />
        <Route path="/view_type/:type_id" component={ViewTypePage} />
        <Route path="" component={NotFoundPage} />
      </Switch>
      <GlobalStyle />
    </AppWrapper>
  );
}
