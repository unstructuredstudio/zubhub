import React from 'react';
import { withTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import LoadingPage from './views/loading/LoadingPage';
import PageWrapper from './views/PageWrapper';

const SearchResults = React.lazy(() =>
  import('./views/search_results/SearchResults'),
);
const Signup = React.lazy(() => import('./views/signup/Signup'));
const Login = React.lazy(() => import('./views/login/Login'));
const PasswordReset = React.lazy(() =>
  import('./views/password_reset/PasswordReset'),
);
const PasswordResetConfirm = React.lazy(() =>
  import('./views/password_reset_confirm/PasswordResetConfirm'),
);
const EmailConfirm = React.lazy(() =>
  import('./views/email_confirm/EmailConfirm'),
);
const PhoneConfirm = React.lazy(() =>
  import('./views/phone_confirm/PhoneConfirm'),
);
const Profile = React.lazy(() => import('./views/profile/Profile'));
const EditProfile = React.lazy(() =>
  import('./views/edit_profile/EditProfile'),
);
const UserProjects = React.lazy(() =>
  import('./views/user_projects/UserProjects'),
);
const UserFollowers = React.lazy(() =>
  import('./views/user_followers/UserFollowers'),
);
const UserFollowing = React.lazy(() =>
  import('./views/user_following/UserFollowing'),
);
const GroupMembers = React.lazy(() =>
  import('./views/group_members/GroupMembers'),
);
const AddGroupMembers = React.lazy(() =>
  import('./views/add_group_members/AddGroupMembers'),
);
const GroupInviteConfirm = React.lazy(() =>
  import('./views/group_invite_confirm/GroupInviteConfirm'),
);
const Projects = React.lazy(() => import('./views/projects/Projects'));
const SavedProjects = React.lazy(() =>
  import('./views/saved_projects/SavedProjects'),
);
const CreateProject = React.lazy(() =>
  import('./views/create_project/CreateProject'),
);
const ProjectDetails = React.lazy(() =>
  import('./views/project_details/ProjectDetails'),
);
const StaffPickDetails = React.lazy(() =>
  import('./views/staff_pick_details/StaffPickDetails'),
);
const Guidelines = React.lazy(() => import('./views/guidelines/Guidelines'));
const TermsOfUse = React.lazy(() => import('./views/terms_of_use/TermsOfUse'));
const About = React.lazy(() => import('./views/about/About'));
const FAQs = React.lazy(() => import('./views/faqs/FAQs'));

const LazyImport = props => {
  const { LazyComponent, ...restOfProps } = props;
  return (
    <React.Suspense fallback={<LoadingPage />}>
      <LazyComponent {...restOfProps} />
    </React.Suspense>
  );
};

function App(props) {
  return (
    <Router>
      <Switch>
        <Route
          exact={true}
          path="/"
          render={routeProps => (
            <PageWrapper {...routeProps} {...props}>
              <LazyImport LazyComponent={Projects} {...routeProps} {...props} />
            </PageWrapper>
          )}
        />

        <Route
          path="/search"
          render={routeProps => (
            <PageWrapper {...routeProps} {...props}>
              <LazyImport
                LazyComponent={SearchResults}
                {...routeProps}
                {...props}
              />
            </PageWrapper>
          )}
        />

        <Route
          path="/signup"
          render={routeProps => (
            <PageWrapper {...routeProps} {...props}>
              <LazyImport LazyComponent={Signup} {...routeProps} {...props} />
            </PageWrapper>
          )}
        />

        <Route
          path="/login"
          render={routeProps => (
            <PageWrapper {...routeProps} {...props}>
              <LazyImport LazyComponent={Login} {...routeProps} {...props} />
            </PageWrapper>
          )}
        />

        <Route
          path="/password-reset"
          render={routeProps => (
            <PageWrapper {...routeProps} {...props}>
              <LazyImport
                LazyComponent={PasswordReset}
                {...routeProps}
                {...props}
              />
            </PageWrapper>
          )}
        />

        <Route
          path="/password-reset-confirm"
          render={routeProps => (
            <PageWrapper {...routeProps} {...props}>
              <LazyImport
                LazyComponent={PasswordResetConfirm}
                {...routeProps}
                {...props}
              />
            </PageWrapper>
          )}
        />

        <Route
          path="/email-confirm"
          render={routeProps => (
            <PageWrapper {...routeProps} {...props}>
              <LazyImport
                LazyComponent={EmailConfirm}
                {...routeProps}
                {...props}
              />
            </PageWrapper>
          )}
        />

        <Route
          path="/phone-confirm"
          render={routeProps => (
            <PageWrapper {...routeProps} {...props}>
              <LazyImport
                LazyComponent={PhoneConfirm}
                {...routeProps}
                {...props}
              />
            </PageWrapper>
          )}
        />

        <Route
          path="/group-invite-confirm"
          render={routeProps => (
            <PageWrapper {...routeProps} {...props}>
              <LazyImport
                LazyComponent={GroupInviteConfirm}
                {...routeProps}
                {...props}
              />
            </PageWrapper>
          )}
        />

        <Route
          path="/creators/:username/projects"
          render={routeProps => (
            <PageWrapper {...routeProps} {...props}>
              <LazyImport
                LazyComponent={UserProjects}
                {...routeProps}
                {...props}
              />
            </PageWrapper>
          )}
        />

        <Route
          path="/creators/:username/followers"
          render={routeProps => (
            <PageWrapper {...routeProps} {...props}>
              <LazyImport
                LazyComponent={UserFollowers}
                {...routeProps}
                {...props}
              />
            </PageWrapper>
          )}
        />

        <Route
          path="/creators/:username/following"
          render={routeProps => (
            <PageWrapper {...routeProps} {...props}>
              <LazyImport
                LazyComponent={UserFollowing}
                {...routeProps}
                {...props}
              />
            </PageWrapper>
          )}
        />

        <Route
          path="/creators/:username/members"
          render={routeProps => (
            <PageWrapper {...routeProps} {...props}>
              <LazyImport
                LazyComponent={GroupMembers}
                {...routeProps}
                {...props}
              />
            </PageWrapper>
          )}
        />

        <Route
          path="/creators/:username/add-members"
          render={routeProps => (
            <PageWrapper {...routeProps} {...props}>
              <LazyImport
                LazyComponent={AddGroupMembers}
                {...routeProps}
                {...props}
              />
            </PageWrapper>
          )}
        />

        <Route
          path="/creators/:username"
          render={routeProps => (
            <PageWrapper {...routeProps} {...props}>
              <LazyImport LazyComponent={Profile} {...routeProps} {...props} />
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
              <LazyImport
                LazyComponent={EditProfile}
                {...routeProps}
                {...props}
              />
            </PageWrapper>
          )}
        />

        <Route
          path="/projects/staff-picks/:id"
          render={routeProps => (
            <PageWrapper {...routeProps} {...props}>
              <LazyImport
                LazyComponent={StaffPickDetails}
                {...routeProps}
                {...props}
              />
            </PageWrapper>
          )}
        />

        <Route
          path="/projects/create"
          render={routeProps => (
            <PageWrapper {...routeProps} {...props}>
              <LazyImport
                LazyComponent={CreateProject}
                {...routeProps}
                {...props}
              />
            </PageWrapper>
          )}
        />

        <Route
          path="/projects/saved"
          render={routeProps => (
            <PageWrapper {...routeProps} {...props}>
              <LazyImport
                LazyComponent={SavedProjects}
                {...routeProps}
                {...props}
              />
            </PageWrapper>
          )}
        />
        <Route
          path="/projects/:id/edit"
          render={routeProps => (
            <PageWrapper {...routeProps} {...props}>
              <LazyImport
                LazyComponent={CreateProject}
                {...routeProps}
                {...props}
              />
            </PageWrapper>
          )}
        />

        <Route
          path="/projects/:id"
          render={routeProps => (
            <PageWrapper {...routeProps} {...props}>
              <LazyImport
                LazyComponent={ProjectDetails}
                {...routeProps}
                {...props}
              />
            </PageWrapper>
          )}
        />

        <Route
          path="/privacy_policy"
          render={routeProps => (
            <PageWrapper {...routeProps} {...props}>
              <LazyImport
                LazyComponent={Guidelines}
                {...routeProps}
                {...props}
              />
            </PageWrapper>
          )}
        />

        <Route
          path="/terms_of_use"
          render={routeProps => (
            <PageWrapper {...routeProps} {...props}>
              <LazyImport
                LazyComponent={TermsOfUse}
                {...routeProps}
                {...props}
              />
            </PageWrapper>
          )}
        />

        <Route
          path="/about"
          render={routeProps => (
            <PageWrapper {...routeProps} {...props}>
              <LazyImport LazyComponent={About} {...routeProps} {...props} />
            </PageWrapper>
          )}
        />

        <Route
          path="/faqs"
          render={routeProps => (
            <PageWrapper {...routeProps} {...props}>
              <LazyImport LazyComponent={FAQs} {...routeProps} {...props} />
            </PageWrapper>
          )}
        />
      </Switch>
    </Router>
  );
}

export default withTranslation()(App);
