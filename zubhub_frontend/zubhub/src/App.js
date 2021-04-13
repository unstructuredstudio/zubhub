import React from 'react';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { withTranslation } from 'react-i18next';

import PageWrapper from './views/PageWrapper';
import Signup from './views/signup/Signup';
import Login from './views/login/Login';
import PasswordReset from './views/password_reset/PasswordReset';
import PasswordResetConfirm from './views/password_reset_confirm/PasswordResetConfirm';
import EmailConfirm from './views/email_confirm/EmailConfirm';
import PhoneConfirm from './views/phone_confirm/PhoneConfirm';
import Profile from './views/profile/Profile';
import EditProfile from './views/edit_profile/EditProfile';
import UserProjects from './views/user_projects/UserProjects';
import UserFollowers from './views/user_followers/UserFollowers';
import UserFollowing from './views/user_following/UserFollowing';
import GroupMembers from './views/group_members/GroupMembers';
import AddGroupMembers from './views/add_group_members/AddGroupMembers';
import GroupInviteConfirm from './views/group_invite_confirm/GroupInviteConfirm';
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
            <PageWrapper {...routeProps} {...props}>
              <Projects {...routeProps} {...props} />
            </PageWrapper>
          )}
        />

        <Route
          path="/signup"
          render={routeProps => (
            <PageWrapper {...routeProps} {...props}>
              <Signup {...routeProps} {...props} />
            </PageWrapper>
          )}
        />

        <Route
          path="/login"
          render={routeProps => (
            <PageWrapper {...routeProps} {...props}>
              <Login {...routeProps} {...props} />
            </PageWrapper>
          )}
        />

        <Route
          path="/password-reset"
          render={routeProps => (
            <PageWrapper {...routeProps} {...props}>
              <PasswordReset {...routeProps} {...props} />
            </PageWrapper>
          )}
        />

        <Route
          path="/password-reset-confirm"
          render={routeProps => (
            <PageWrapper {...routeProps} {...props}>
              <PasswordResetConfirm {...routeProps} {...props} />
            </PageWrapper>
          )}
        />

        <Route
          path="/email-confirm"
          render={routeProps => (
            <PageWrapper {...routeProps} {...props}>
              <EmailConfirm {...routeProps} {...props} />
            </PageWrapper>
          )}
        />

        <Route
          path="/phone-confirm"
          render={routeProps => (
            <PageWrapper {...routeProps} {...props}>
              <PhoneConfirm {...routeProps} {...props} />
            </PageWrapper>
          )}
        />

        <Route
          path="/group-invite-confirm"
          render={routeProps => (
            <PageWrapper {...routeProps} {...props}>
              <GroupInviteConfirm {...routeProps} {...props} />
            </PageWrapper>
          )}
        />

        <Route
          path="/creators/:username/projects"
          render={routeProps => (
            <PageWrapper {...routeProps} {...props}>
              <UserProjects {...routeProps} {...props} />
            </PageWrapper>
          )}
        />

        <Route
          path="/creators/:username/followers"
          render={routeProps => (
            <PageWrapper {...routeProps} {...props}>
              <UserFollowers {...routeProps} {...props} />
            </PageWrapper>
          )}
        />

        <Route
          path="/creators/:username/following"
          render={routeProps => (
            <PageWrapper {...routeProps} {...props}>
              <UserFollowing {...routeProps} {...props} />
            </PageWrapper>
          )}
        />

        <Route
          path="/creators/:username/members"
          render={routeProps => (
            <PageWrapper {...routeProps} {...props}>
              <GroupMembers {...routeProps} {...props} />
            </PageWrapper>
          )}
        />

        <Route
          path="/creators/:username/add-members"
          render={routeProps => (
            <PageWrapper {...routeProps} {...props}>
              <AddGroupMembers {...routeProps} {...props} />
            </PageWrapper>
          )}
        />

        <Route
          path="/creators/:username"
          render={routeProps => (
            <PageWrapper {...routeProps} {...props}>
              <Profile {...routeProps} {...props} />
            </PageWrapper>
          )}
        />

        <Route
          path="/profile"
          render={routeProps => (
            <PageWrapper {...routeProps} {...props}>
              <Profile {...routeProps} {...props} />
            </PageWrapper>
          )}
        />

        <Route
          path="/edit-profile"
          render={routeProps => (
            <PageWrapper {...routeProps} {...props}>
              <EditProfile {...routeProps} {...props} />
            </PageWrapper>
          )}
        />

        <Route
          path="/projects/create"
          render={routeProps => (
            <PageWrapper {...routeProps} {...props}>
              <CreateProject {...routeProps} {...props} />
            </PageWrapper>
          )}
        />

        <Route
          path="/projects/saved"
          render={routeProps => (
            <PageWrapper {...routeProps} {...props}>
              <SavedProjects {...routeProps} {...props} />
            </PageWrapper>
          )}
        />
        <Route
          path="/projects/:id/edit"
          render={routeProps => (
            <PageWrapper {...routeProps} {...props}>
              <CreateProject {...routeProps} {...props} />
            </PageWrapper>
          )}
        />

        <Route
          path="/projects/:id"
          render={routeProps => (
            <PageWrapper {...routeProps} {...props}>
              <ProjectDetails {...routeProps} {...props} />
            </PageWrapper>
          )}
        />
      </Switch>
    </Router>
  );
}

export default withTranslation()(App);
