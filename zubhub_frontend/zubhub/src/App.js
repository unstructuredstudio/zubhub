import React, { useContext, useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { Routes, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import CreateActivity from './views/create_activity/CreateActivity';
import LoadingPage from './views/loading/LoadingPage';
import PageWrapper from './views/PageWrapper';
import ZubhubAPI from './api/api';
import { updateTheme } from './theme';
import ScrollToTop from './ScrollToTop';

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
const Settings = React.lazy(() => import('./views/settings/Settings'));
const API = new ZubhubAPI();

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

  const handleThemeChange = async () => {
    try {
      const data = await API.theme();

      updateTheme(data);
    } catch (error) {
      console.error(error); // eslint-disable-line no-console
    }
  };

  useEffect(() => {
    handleThemeChange();
  }, []);

  return (
    <ThemeContext.Provider value={theme}>
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            <PageWrapper {...props}>
              <LazyImport LazyComponent={Home} />
            </PageWrapper>
          }
        />

        <Route
          path="/projects"
          element={
            <PageWrapper {...props}>
              <LazyImport LazyComponent={Projects} />
            </PageWrapper>
          }
        />

        <Route
          path="/activities/create"
          element={
            <PageWrapper {...props}>
              <LazyImport LazyComponent={CreateActivity} />
            </PageWrapper>
          }
        />

        <Route
          path="/activities/:id/linkedProjects"
          element={
            <PageWrapper {...props}>
              <LazyImport LazyComponent={LinkedProjects} />
            </PageWrapper>
          }
        />

        <Route
          path="/search"
          element={
            <PageWrapper {...props}>
              <LazyImport LazyComponent={SearchResults} />
            </PageWrapper>
          }
        />

        <Route
          path="/signup"
          element={
            <PageWrapper {...props}>
              <LazyImport LazyComponent={Signup} />
            </PageWrapper>
          }
        />

        <Route
          path="/login"
          element={
            <PageWrapper {...props}>
              <LazyImport LazyComponent={Login} />
            </PageWrapper>
          }
        />

        <Route
          path="/password-reset"
          element={
            <PageWrapper {...props}>
              <LazyImport LazyComponent={PasswordReset} />
            </PageWrapper>
          }
        />

        <Route
          path="/password-reset-confirm"
          element={
            <PageWrapper {...props}>
              <LazyImport LazyComponent={PasswordResetConfirm} />
            </PageWrapper>
          }
        />

        <Route
          path="/email-confirm"
          element={
            <PageWrapper {...props}>
              <LazyImport LazyComponent={EmailConfirm} />
            </PageWrapper>
          }
        />

        <Route
          path="/phone-confirm"
          element={
            <PageWrapper {...props}>
              <LazyImport LazyComponent={PhoneConfirm} />
            </PageWrapper>
          }
        />

        <Route
          path="/group-invite-confirm"
          element={
            <PageWrapper {...props}>
              <LazyImport LazyComponent={GroupInviteConfirm} />
            </PageWrapper>
          }
        />

        <Route
          path="/creators/:username/projects"
          element={
            <PageWrapper {...props}>
              <LazyImport LazyComponent={UserProjects} />
            </PageWrapper>
          }
        />

        <Route
          path="/settings"
          element={
            <PageWrapper {...props}>
              <LazyImport LazyComponent={Settings} />
            </PageWrapper>
          }
        />

        <Route
          path="/profile"
          element={
            <PageWrapper {...props}>
              <LazyImport LazyComponent={Profile} />
            </PageWrapper>
          }
        />

        <Route
          path="/team"
          element={
            <PageWrapper {...props}>
              <LazyImport LazyComponent={Teams} />
            </PageWrapper>
          }
        />
        <Route
          path="/teams/:groupname/projects"
          element={
            <PageWrapper {...props}>
              <LazyImport LazyComponent={TeamProjects} />
            </PageWrapper>
          }
        />

        <Route
          path="/creators/:username/drafts"
          element={
            <PageWrapper {...props}>
              <LazyImport LazyComponent={UserDrafts} />
            </PageWrapper>
          }
        />

        <Route
          path="/creators/:username/followers"
          element={
            <PageWrapper {...props}>
              <LazyImport LazyComponent={UserFollowers} />
            </PageWrapper>
          }
        />

        <Route
          path="/teams/:groupname/followers"
          element={
            <PageWrapper {...props}>
              <LazyImport LazyComponent={TeamFollowers} />
            </PageWrapper>
          }
        />

        <Route
          path="/teams/:groupname/members"
          element={
            <PageWrapper {...props}>
              <LazyImport LazyComponent={TeamMembers} />
            </PageWrapper>
          }
        />

        <Route
          path="/creators/:username/following"
          element={
            <PageWrapper {...props}>
              <LazyImport LazyComponent={UserFollowing} />
            </PageWrapper>
          }
        />

        <Route
          path="/teams/all"
          element={
            <PageWrapper {...props}>
              <LazyImport LazyComponent={AllTeams} />
            </PageWrapper>
          }
        />

        <Route
          path="/creators/:username/members"
          element={
            <PageWrapper {...props}>
              <LazyImport LazyComponent={GroupMembers} />
            </PageWrapper>
          }
        />

        <Route
          path="/creators/:username/add-members"
          element={
            <PageWrapper {...props}>
              <LazyImport LazyComponent={AddGroupMembers} />
            </PageWrapper>
          }
        />

        <Route
          path="/creators/:username"
          element={
            <PageWrapper {...props}>
              <LazyImport LazyComponent={Profile} />
            </PageWrapper>
          }
        />

        <Route
          path="/account-status"
          element={
            <PageWrapper {...props}>
              <LazyImport LazyComponent={AccounStatus} />
            </PageWrapper>
          }
        />

        <Route
          path="/teams/:groupname"
          element={
            <PageWrapper {...props}>
              <LazyImport LazyComponent={Team} />
            </PageWrapper>
          }
        />

        <Route
          path="/edit-profile"
          element={
            <PageWrapper {...props}>
              <LazyImport LazyComponent={EditProfile} />
            </PageWrapper>
          }
        />

        <Route
          path="/:groupname/edit-team"
          element={
            <PageWrapper {...props}>
              <LazyImport LazyComponent={EditTeam} />
            </PageWrapper>
          }
        />

        <Route
          path="/projects/staff-picks/:id"
          element={
            <PageWrapper {...props}>
              <LazyImport LazyComponent={StaffPickDetails} />
            </PageWrapper>
          }
        />

        <Route
          path="/projects/create"
          element={
            <PageWrapper {...props}>
              <LazyImport LazyComponent={CreateProject} />
            </PageWrapper>
          }
        />

        <Route
          path="/projects/saved"
          element={
            <PageWrapper {...props}>
              <LazyImport LazyComponent={SavedProjects} />
            </PageWrapper>
          }
        />
        <Route
          path="/projects/:id/edit"
          element={
            <PageWrapper {...props}>
              <LazyImport LazyComponent={CreateProject} />
            </PageWrapper>
          }
        />
        <Route
          path="/projects/:activity_id/create"
          element={
            <PageWrapper {...props}>
              <LazyImport LazyComponent={CreateProject} />
            </PageWrapper>
          }
        />

        <Route
          path="/projects/:id"
          element={
            <PageWrapper {...props}>
              <LazyImport LazyComponent={ProjectDetails} />
            </PageWrapper>
          }
        />

        <Route
          path="/ambassadors"
          element={
            <PageWrapper {...props}>
              <LazyImport LazyComponent={Ambassadors} />
            </PageWrapper>
          }
        />

        <Route
          path="/privacy_policy"
          element={
            <PageWrapper {...props}>
              <LazyImport LazyComponent={Guidelines} />
            </PageWrapper>
          }
        />

        <Route
          path="/terms_of_use"
          element={
            <PageWrapper {...props}>
              <LazyImport LazyComponent={TermsOfUse} />
            </PageWrapper>
          }
        />

        <Route
          path="/about"
          element={
            <PageWrapper {...props}>
              <LazyImport LazyComponent={About} />
            </PageWrapper>
          }
        />

        <Route
          path="/challenge"
          element={
            <PageWrapper {...props}>
              <LazyImport LazyComponent={Challenge} />
            </PageWrapper>
          }
        />

        <Route
          path="/faqs"
          element={
            <PageWrapper {...props}>
              <LazyImport LazyComponent={FAQs} />
            </PageWrapper>
          }
        />

        <Route
          path="/activities/:id/edit"
          element={
            <PageWrapper {...props}>
              <LazyImport LazyComponent={CreateActivity} />
            </PageWrapper>
          }
        />

        <Route
          path="/activities/:id"
          element={
            <PageWrapper {...props}>
              <LazyImport LazyComponent={ActivityDetails} />
            </PageWrapper>
          }
        />

        <Route
          path="/activities"
          element={
            <PageWrapper {...props}>
              <LazyImport LazyComponent={Activities} />
            </PageWrapper>
          }
        />

        <Route
          path="/create-team"
          element={
            <PageWrapper {...props}>
              <LazyImport LazyComponent={CreateTeam} />
            </PageWrapper>
          }
        />

        <Route
          path="*"
          element={
            <PageWrapper {...props}>
              <LazyImport LazyComponent={NotFound} />
            </PageWrapper>
          }
        />
      </Routes>
    </ThemeContext.Provider>
  );
}

const mapStateToProps = state => ({
  auth: state.auth,
});

const ConnectedApp = connect(mapStateToProps)(App);

export default withTranslation()(ConnectedApp);
