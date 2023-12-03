import React, { useContext } from 'react';
import { withTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import CreateActivity from './views/create_activity/CreateActivity';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import LoadingPage from './views/loading/LoadingPage';
import PageWrapper from './views/PageWrapper';
import ProtectedRoute from './components/protected_route/ProtectedRoute';
import ZubhubAPI from '../src/api/api';
import { updateTheme } from './theme';
import ScrollToTop from './ScrollToTop';
import SessionExpiredModal from './components/sessionExpired/sessionExpired';

const SearchResults = React.lazy(() => import('./views/search_results/SearchResults'));
const Signup = React.lazy(() => import('./views/signup/Signup'));
const Login = React.lazy(() => import('./views/login/Login'));
const PasswordReset = React.lazy(() => import('./views/password_reset/PasswordReset'));
const PasswordResetConfirm = React.lazy(() => import('./views/password_reset_confirm/PasswordResetConfirm'));
const EmailConfirm = React.lazy(() => import('./views/email_confirm/EmailConfirm'));
const PhoneConfirm = React.lazy(() => import('./views/phone_confirm/PhoneConfirm'));
const Profile = React.lazy(() => import('./views/profile/Profile'));
const Team = React.lazy(() => import('./views/team/Team'));
const EditTeam = React.lazy(() => import('./views/edit_team/EditTeam'));
const AccounStatus = React.lazy(() => import('./views/account_status/AccountStatus'));
const EditProfile = React.lazy(() => import('./views/edit_profile/EditProfile'));
const UserProjects = React.lazy(() => import('./views/user_projects/UserProjects'));
const TeamProjects = React.lazy(() => import('./views/team_projects/TeamProjects'));
const UserDrafts = React.lazy(() => import('./views/user_drafts/UserDrafts'));
const UserFollowers = React.lazy(() => import('./views/user_followers/UserFollowers'));
const TeamFollowers = React.lazy(() => import('./views/team_followers/TeamFollowers'));
const TeamMembers = React.lazy(() => import('./views/team_members/TeamMembers'));
const UserFollowing = React.lazy(() => import('./views/user_following/UserFollowing'));
const AllTeams = React.lazy(() => import('./views/all_teams/AllTeams'));
const Teams = React.lazy(() => import('./views/teams/Teams'));
const GroupMembers = React.lazy(() => import('./views/group_members/GroupMembers'));
const AddGroupMembers = React.lazy(() => import('./views/add_group_members/AddGroupMembers'));
const GroupInviteConfirm = React.lazy(() => import('./views/group_invite_confirm/GroupInviteConfirm'));
const Projects = React.lazy(() => import('./views/projects/Projects'));
const Home = React.lazy(() => import('./views/home/Home'));
const SavedProjects = React.lazy(() => import('./views/saved_projects/SavedProjects'));
const CreateProject = React.lazy(() => import('./views/create_project/CreateProject'));
const ProjectDetails = React.lazy(() => import('./views/project_details/ProjectDetails'));
const StaffPickDetails = React.lazy(() => import('./views/staff_pick_details/StaffPickDetails'));
const Activities = React.lazy(() => import('./views/activities/activities'));
const ActivityDetails = React.lazy(() => import('./views/activity_details/ActivityDetailsV2'));
const CreateTeam = React.lazy(() => import('./views/create_team/CreateTeam'));
const LinkedProjects = React.lazy(() => import('./views/linked_projects/LinkedProjects'));
const Ambassadors = React.lazy(() => import('./views/ambassadors/Ambassadors'));
const Guidelines = React.lazy(() => import('./views/guidelines/Guidelines'));
const TermsOfUse = React.lazy(() => import('./views/terms_of_use/TermsOfUse'));
const About = React.lazy(() => import('./views/about/About'));
const Challenge = React.lazy(() => import('./views/challenge/Challenge'));
const FAQs = React.lazy(() => import('./views/faqs/FAQs'));
const NotFound = React.lazy(() => import('./views/not_found/NotFound'));
const API = new ZubhubAPI();
const Settings = React.lazy(() => import('./views/settings/Settings'));

const LazyImport = props => {
  const { LazyComponent, ...restOfProps } = props;
  return (
    <React.Suspense fallback={<LoadingPage />}>
      <LazyComponent {...restOfProps} />
    </React.Suspense>
  );
};

const ThemeContext = React.createContext();

function App(props) {
  const theme = useContext(ThemeContext);

  useEffect(() => {
    handleThemeChange();
  }, []);

  const handleThemeChange = async () => {
    try {
      const data = await API.theme();

      updateTheme(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      <Router>
        <ScrollToTop />
        <Switch>
          <Route
            exact={true}
            path="/"
            render={routeProps => (
              <PageWrapper {...routeProps} {...props}>
                <LazyImport LazyComponent={Home} {...routeProps} {...props} />
              </PageWrapper>
            )}
          />

          <Route
            exact={true}
            path="/projects"
            render={routeProps => (
              <PageWrapper {...routeProps} {...props}>
                <LazyImport LazyComponent={Projects} {...routeProps} {...props} />
              </PageWrapper>
            )}
          />

          {/* <Route
          exact={true}
          path="/projects/:id/preview"
          render={routeProps => (
            <PageWrapper {...routeProps} {...props}>
              <LazyImport LazyComponent={PreviewProject} {...routeProps} {...props} />
            </PageWrapper>
          )}
        /> */}

          <ProtectedRoute path="/settings" component={Settings} {...props} />

          <Route
            path="/activities/create"
            render={routeProps => (
              <PageWrapper {...routeProps} {...props}>
                <LazyImport LazyComponent={CreateActivity} {...routeProps} {...props} />
              </PageWrapper>
            )}
          />

          <Route
            path="/activities/:id/linkedProjects"
            render={routeProps => (
              <PageWrapper {...routeProps} {...props}>
                <LazyImport LazyComponent={LinkedProjects} {...routeProps} {...props} />
              </PageWrapper>
            )}
          />

          <Route
            path="/search"
            render={routeProps => (
              <PageWrapper {...routeProps} {...props}>
                <LazyImport LazyComponent={SearchResults} {...routeProps} {...props} />
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
                <LazyImport LazyComponent={PasswordReset} {...routeProps} {...props} />
              </PageWrapper>
            )}
          />

          <Route
            path="/password-reset-confirm"
            render={routeProps => (
              <PageWrapper {...routeProps} {...props}>
                <LazyImport LazyComponent={PasswordResetConfirm} {...routeProps} {...props} />
              </PageWrapper>
            )}
          />

          <Route
            path="/email-confirm"
            render={routeProps => (
              <PageWrapper {...routeProps} {...props}>
                <LazyImport LazyComponent={EmailConfirm} {...routeProps} {...props} />
              </PageWrapper>
            )}
          />

          <Route
            path="/phone-confirm"
            render={routeProps => (
              <PageWrapper {...routeProps} {...props}>
                <LazyImport LazyComponent={PhoneConfirm} {...routeProps} {...props} />
              </PageWrapper>
            )}
          />

          <Route
            path="/group-invite-confirm"
            render={routeProps => (
              <PageWrapper {...routeProps} {...props}>
                <LazyImport LazyComponent={GroupInviteConfirm} {...routeProps} {...props} />
              </PageWrapper>
            )}
          />

          <Route
            path="/creators/:username/projects"
            render={routeProps => (
              <PageWrapper {...routeProps} {...props}>
                <LazyImport LazyComponent={UserProjects} {...routeProps} {...props} />
              </PageWrapper>
            )}
          />

          <Route
            path="/teams/:groupname/projects"
            render={routeProps => (
              <PageWrapper {...routeProps} {...props}>
                <LazyImport LazyComponent={TeamProjects} {...routeProps} {...props} />
              </PageWrapper>
            )}
          />

          <Route
            path="/creators/:username/drafts"
            render={routeProps => (
              <PageWrapper {...routeProps} {...props}>
                <LazyImport LazyComponent={UserDrafts} {...routeProps} {...props} />
              </PageWrapper>
            )}
          />

          <Route
            path="/creators/:username/followers"
            render={routeProps => (
              <PageWrapper {...routeProps} {...props}>
                <LazyImport LazyComponent={UserFollowers} {...routeProps} {...props} />
              </PageWrapper>
            )}
          />

          <Route
            path="/teams/:groupname/followers"
            render={routeProps => (
              <PageWrapper {...routeProps} {...props}>
                <LazyImport LazyComponent={TeamFollowers} {...routeProps} {...props} />
              </PageWrapper>
            )}
          />

          <Route
            path="/teams/:groupname/members"
            render={routeProps => (
              <PageWrapper {...routeProps} {...props}>
                <LazyImport LazyComponent={TeamMembers} {...routeProps} {...props} />
              </PageWrapper>
            )}
          />

          <Route
            path="/creators/:username/following"
            render={routeProps => (
              <PageWrapper {...routeProps} {...props}>
                <LazyImport LazyComponent={UserFollowing} {...routeProps} {...props} />
              </PageWrapper>
            )}
          />

          <Route
            path="/teams/all"
            render={routeProps => (
              <PageWrapper {...routeProps} {...props}>
                <LazyImport LazyComponent={AllTeams} {...routeProps} {...props} />
              </PageWrapper>
            )}
          />

          <ProtectedRoute path="/team" component={Teams} {...props} />

          <Route
            path="/creators/:username/members"
            render={routeProps => (
              <PageWrapper {...routeProps} {...props}>
                <LazyImport LazyComponent={GroupMembers} {...routeProps} {...props} />
              </PageWrapper>
            )}
          />

          <Route
            path="/creators/:username/add-members"
            render={routeProps => (
              <PageWrapper {...routeProps} {...props}>
                <LazyImport LazyComponent={AddGroupMembers} {...routeProps} {...props} />
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
            path="/account-status"
            render={routeProps => (
              <PageWrapper {...routeProps} {...props}>
                <LazyImport LazyComponent={AccounStatus} {...routeProps} {...props} />
              </PageWrapper>
            )}
          />

          <Route
            path="/teams/:groupname"
            render={routeProps => (
              <PageWrapper {...routeProps} {...props}>
                <LazyImport LazyComponent={Team} {...routeProps} {...props} />
              </PageWrapper>
            )}
          />

          <ProtectedRoute path="/profile" component={Profile} {...props} />

          <Route
            path="/edit-profile"
            render={routeProps => (
              <PageWrapper {...routeProps} {...props}>
                <LazyImport LazyComponent={EditProfile} {...routeProps} {...props} />
              </PageWrapper>
            )}
          />

          <Route
            path="/:groupname/edit-team"
            render={routeProps => (
              <PageWrapper {...routeProps} {...props}>
                <LazyImport LazyComponent={EditTeam} {...routeProps} {...props} />
              </PageWrapper>
            )}
          />

          <Route
            path="/projects/staff-picks/:id"
            render={routeProps => (
              <PageWrapper {...routeProps} {...props}>
                <LazyImport LazyComponent={StaffPickDetails} {...routeProps} {...props} />
              </PageWrapper>
            )}
          />

          <Route
            path="/projects/create"
            render={routeProps => (
              <PageWrapper {...routeProps} {...props}>
                <LazyImport LazyComponent={CreateProject} {...routeProps} {...props} />
              </PageWrapper>
            )}
          />

          <Route
            path="/projects/saved"
            render={routeProps => (
              <PageWrapper {...routeProps} {...props}>
                <LazyImport LazyComponent={SavedProjects} {...routeProps} {...props} />
              </PageWrapper>
            )}
          />
          <Route
            path="/projects/:id/edit"
            render={routeProps => (
              <PageWrapper {...routeProps} {...props}>
                <LazyImport LazyComponent={CreateProject} {...routeProps} {...props} />
              </PageWrapper>
            )}
          />
          <Route
            path="/projects/:activity_id/create"
            render={routeProps => (
              <PageWrapper {...routeProps} {...props}>
                <LazyImport LazyComponent={CreateProject} {...routeProps} {...props} />
              </PageWrapper>
            )}
          />

          {/* <ProtectedRoute path="/profile" component={ProjectDetails} {...props} /> */}
          <Route
            path="/projects/:id"
            render={routeProps => (
              <PageWrapper {...routeProps} {...props}>
                <LazyImport LazyComponent={ProjectDetails} {...routeProps} {...props} />
              </PageWrapper>
            )}
          />

          <Route
            path="/ambassadors"
            render={routeProps => (
              <PageWrapper {...routeProps} {...props}>
                <LazyImport LazyComponent={Ambassadors} {...routeProps} {...props} />
              </PageWrapper>
            )}
          />

          <Route
            path="/privacy_policy"
            render={routeProps => (
              <PageWrapper {...routeProps} {...props}>
                <LazyImport LazyComponent={Guidelines} {...routeProps} {...props} />
              </PageWrapper>
            )}
          />

          <Route
            path="/terms_of_use"
            render={routeProps => (
              <PageWrapper {...routeProps} {...props}>
                <LazyImport LazyComponent={TermsOfUse} {...routeProps} {...props} />
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
            path="/challenge"
            render={routeProps => (
              <PageWrapper {...routeProps} {...props}>
                <LazyImport LazyComponent={Challenge} {...routeProps} {...props} />
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

          <Route
            path="/activities/:id/edit"
            render={routeProps => (
              <PageWrapper {...routeProps} {...props}>
                <LazyImport LazyComponent={CreateActivity} {...routeProps} {...props} />
              </PageWrapper>
            )}
          />

          <Route
            path="/activities/:id"
            render={routeProps => (
              <PageWrapper {...routeProps} {...props}>
                <LazyImport LazyComponent={ActivityDetails} {...routeProps} {...props} />
              </PageWrapper>
            )}
          />

          <Route
            path="/activities"
            render={routeProps => (
              <PageWrapper {...routeProps} {...props}>
                <LazyImport LazyComponent={Activities} {...routeProps} {...props} />
              </PageWrapper>
            )}
          />

          <Route
            path="/create-team"
            render={routeProps => (
              <PageWrapper {...routeProps} {...props}>
                <LazyImport LazyComponent={CreateTeam} {...routeProps} {...props} />
              </PageWrapper>
            )}
          />
          <Route
            path="/session-expired"
            render={routeProps => (
              <PageWrapper {...routeProps} {...props}>
                <LazyImport LazyComponent={SessionExpiredModal} {...routeProps} {...props} />
              </PageWrapper>
            )}
          />
          <Route
            path="*"
            render={routeProps => (
              <PageWrapper {...routeProps} {...props}>
                <LazyImport LazyComponent={NotFound} {...routeProps} />
              </PageWrapper>
            )}
          />
        </Switch>
      </Router>
    </ThemeContext.Provider>
  );
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const ConnectedApp = connect(mapStateToProps)(App);

export default withTranslation()(ConnectedApp);
