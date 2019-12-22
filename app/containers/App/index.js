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
import NewRelationshipTypePage from 'containers/NewRelationshipTypePage';
import NewViewPage from 'containers/NewViewPage';
import AllObjectsPage from 'containers/AllObjectsPage';
import AllTypesPage from 'containers/AllTypesPage';
import AllRelationTypesPage from 'containers/AllRelationTypesPage';
import UpdateTypePage from 'containers/UpdateTypePage';
import ViewTypePage from 'containers/ViewTypePage';
import ViewObjectPage from 'containers/ViewObjectPage';
import ViewPage from 'containers/ViewPage';
import CommunityPublishPage from 'containers/CommunityPublishPage';
import CommunityMyPage from 'containers/CommunityMyPage';
import CommunityMainScreen from 'containers/CommunityMainScreen';

import GlobalStyle from '../../global-styles';


const AppWrapper = styled.div`
  margin: 0 16px;
  display: flex;
  flex-direction: column;
`;

export default function App() {
  return (
    <AppWrapper>
      <Helmet
        titleTemplate="%s - Notely"
        defaultTitle="Notely"
      >
        <link
          rel="stylesheet"
          href="/semantic.min.css"
        />
        <script lang="javascript" src="/shim.min.js"></script>
        <script lang="javascript" src="/xlsx.full.min.js"></script>
        <link rel="stylesheet" href="/fullcalendar/bootstrap.min.css" />
        <link rel="stylesheet" href="/fullcalendar/core.min.css" />
        <link rel="stylesheet" href="/fullcalendar/daygrid.min.css" />
        <link rel="stylesheet" href="/fullcalendar/timegrid.min.css" />
        <meta name="description" content="A React.js Boilerplate application" />
      </Helmet>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/new_type" component={NewTypePage} />
        <Route path="/new_rel_type" component={NewRelationshipTypePage} />
        <Route path="/new_object/:type_id" component={NewObjectPage} />
        <Route path="/new_view" component={NewViewPage} />
        <Route path="/all_types" component={AllTypesPage} />
        <Route path="/all_objects/:type_id" component={AllObjectsPage} />
        <Route path="/all_rel_types" component={AllRelationTypesPage} />
        <Route path="/update_type/:type_id" component={UpdateTypePage} />
        <Route path="/view_type/:type_id" component={ViewTypePage} />
        <Route path="/view_object/:obj_id" component={ViewObjectPage} />
        <Route path="/view/:view_id" component={ViewPage} />
        <Route path="/community" component={CommunityMainScreen} />
        <Route path="/community/publish" component={CommunityPublishPage} />
        <Route path="/community/my" component={CommunityMyPage} />
        <Route path="" component={NotFoundPage} />
      </Switch>
      <GlobalStyle />
    </AppWrapper>
  );
}
