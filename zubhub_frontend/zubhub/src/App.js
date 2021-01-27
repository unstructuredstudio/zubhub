import React from 'react';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import PageWrapper from './views/PageWrapper';
import Signup from './views/signup/Signup';
import Login from './views/login/Login';
import PasswordReset from './views/password_reset/PasswordReset';
import PasswordResetConfirm from './views/password_reset_confirm/PasswordResetConfirm';
import EmailConfirm from './views/email_confirm/EmailConfirm';
import Profile from './views/profile/Profile';
import UserProjects from './views/user_projects/UserProjects';
import UserFollowers from './views/user_followers/UserFollowers';
import UserFollowing from './views/user_following/UserFollowing';
import Projects from './views/projects/Projects';
import SavedProjects from './views/saved_projects/SavedProjects';
import CreateProject from './views/create_project/CreateProject';
import ProjectDetails from './views/project_details/ProjectDetails';

function App(props) {
  return (
    <Router>
      <Switch>
        <Route
          exact={true}
          path="/"
          render={routeProps => (
            <PageWrapper {...routeProps}>
              <Projects {...routeProps} {...props} />
            </PageWrapper>
          )}
        />

        <Route
          path="/signup"
          render={routeProps => (
            <PageWrapper {...routeProps}>
              <Signup {...routeProps} {...props} />
            </PageWrapper>
          )}
        />

        <Route
          path="/login"
          render={routeProps => (
            <PageWrapper {...routeProps}>
              <Login {...routeProps} {...props} />
            </PageWrapper>
          )}
        />

        <Route
          path="/password-reset"
          render={routeProps => (
            <PageWrapper {...routeProps}>
              <PasswordReset {...routeProps} {...props} />
            </PageWrapper>
          )}
        />

        <Route
          path="/password-reset-confirm"
          render={routeProps => (
            <PageWrapper {...routeProps}>
              <PasswordResetConfirm {...routeProps} {...props} />
            </PageWrapper>
          )}
        />

        <Route
          path="/email-confirm"
          render={routeProps => (
            <PageWrapper {...routeProps}>
              <EmailConfirm {...routeProps} {...props} />
            </PageWrapper>
          )}
        />

        <Route
          path="/creators/:username/projects"
          render={routeProps => (
            <PageWrapper {...routeProps}>
              <UserProjects {...routeProps} {...props} />
            </PageWrapper>
          )}
        />

        <Route
          path="/creators/:username/followers"
          render={routeProps => (
            <PageWrapper {...routeProps}>
              <UserFollowers {...routeProps} {...props} />
            </PageWrapper>
          )}
        />

        <Route
          path="/creators/:username/following"
          render={routeProps => (
            <PageWrapper {...routeProps}>
              <UserFollowing {...routeProps} {...props} />
            </PageWrapper>
          )}
        />

        <Route
          path="/creators/:username"
          render={routeProps => (
            <PageWrapper {...routeProps}>
              <Profile {...routeProps} {...props} />
            </PageWrapper>
          )}
        />

        <Route
          path="/profile"
          render={routeProps => (
            <PageWrapper {...routeProps}>
              <Profile {...routeProps} {...props} />
            </PageWrapper>
          )}
        />

        <Route
          path="/projects/create"
          render={routeProps => (
            <PageWrapper {...routeProps}>
              <CreateProject {...routeProps} {...props} />
            </PageWrapper>
          )}
        />

        <Route
          path="/projects/saved"
          render={routeProps => (
            <PageWrapper {...routeProps}>
              <SavedProjects {...routeProps} {...props} />
            </PageWrapper>
          )}
        />
        <Route
          path="/projects/:id/edit"
          render={routeProps => (
            <PageWrapper {...routeProps}>
              <CreateProject {...routeProps} {...props} />
            </PageWrapper>
          )}
        />

        <Route
          path="/projects/:id"
          render={routeProps => (
            <PageWrapper {...routeProps}>
              <ProjectDetails {...routeProps} {...props} />
            </PageWrapper>
          )}
        />
      </Switch>
    </Router>
  );
}

export default App;
