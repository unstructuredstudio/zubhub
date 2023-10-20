import React, { useContext } from 'react';
import { withTranslation } from 'react-i18next';
import { Routes, Route, Redirect, useLocation, useParams, useNavigate } from 'react-router-dom';
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

const Wrapper = props => {
  const { component: Component } = props;
  console.log(props, 'PROPSSSS');
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const routeProps = {
    location,
    params,
    navigate,
  };

  return (
    <PageWrapper {...routeProps} {...props}>
      <LazyImport LazyComponent={Component} {...routeProps} {...props} />
    </PageWrapper>
  );
};

function App(props) {
  console.log(props, "APPPP")
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
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Wrapper component={Home} {...props} />} />
        <Route path="/projects" element={<Wrapper component={Projects} {...props} />} />

        {/* <Route path="/projects/:id/preview" element={<Wrapper component={PreviewProject} /> */}

        <Route path="/settings" element={<Wrapper component={Settings} {...props} />} />
        <Route path="/activities/create" element={<Wrapper component={CreateActivity} {...props} />} />
        <Route path="/activities/:id/linkedProjects" element={<Wrapper component={LinkedProjects} {...props} />} />
        <Route path="/search" element={<Wrapper component={SearchResults} {...props} />} />
        <Route path="/signup" element={<Wrapper component={Signup} {...props} />} />
        <Route path="/login" element={<Wrapper component={Login} {...props} />} />
        <Route path="/password-reset" element={<Wrapper component={PasswordReset} {...props} />} />
        <Route path="/password-reset-confirm" element={<Wrapper component={PasswordResetConfirm} {...props} />} />
        <Route path="/email-confirm" element={<Wrapper component={EmailConfirm} {...props} />} />
        <Route path="/phone-confirm" element={<Wrapper component={PhoneConfirm} {...props} />} />
        <Route path="/group-invite-confirm" element={<Wrapper component={GroupInviteConfirm} {...props} />} />
        <Route path="/creators/:username/projects" element={<Wrapper component={UserProjects} {...props} />} />
        <Route path="/teams/:groupname/projects" element={<Wrapper component={TeamProjects} {...props} />} />
        <Route path="/creators/:username/drafts" element={<Wrapper component={UserDrafts} {...props} />} />
        <Route path="/creators/:username/followers" element={<Wrapper component={UserFollowers} {...props} />} />
        <Route path="/teams/:groupname/followers" element={<Wrapper component={TeamFollowers} {...props} />} />
        <Route path="/teams/:groupname/members" element={<Wrapper component={TeamMembers} {...props} />} />
        <Route path="/creators/:username/following" element={<Wrapper component={UserFollowing} {...props} />} />
        <Route path="/teams/all" element={<Wrapper component={AllTeams} {...props} />} />
        <Route path="/team" element={<Wrapper component={Teams} {...props} />} />
        <Route path="/creators/:username/members" element={<Wrapper component={GroupMembers} {...props} />} />
        <Route path="/creators/:username/add-members" element={<Wrapper component={AddGroupMembers} {...props} />} />
        <Route path="/creators/:username" element={<Wrapper component={Profile} {...props} />} />
        <Route path="/account-status" element={<Wrapper component={AccounStatus} {...props} />} />
        <Route path="/teams/:groupname" element={<Wrapper component={Team} {...props} />} />
        <Route path="/profile" element={<Wrapper component={Profile} {...props} />} />
        <Route path="/edit-profile" element={<Wrapper component={EditProfile} {...props} />} />
        <Route path="/:groupname/edit-team" element={<Wrapper component={EditTeam} {...props} />} />
        <Route path="/projects/staff-picks/:id" element={<Wrapper component={StaffPickDetails} {...props} />} />
        <Route path="/projects/create" element={<Wrapper component={CreateProject} {...props} />} />
        <Route path="/projects/saved" element={<Wrapper component={SavedProjects} {...props} />} />
        <Route path="/projects/:id/edit" element={<Wrapper component={CreateProject} {...props} />} />
        <Route path="/projects/:activity_id/create" element={<Wrapper component={CreateProject} {...props} />} />
        <Route path="/projects/:id" element={<Wrapper component={ProjectDetails} {...props} />} />
        <Route path="/ambassadors" element={<Wrapper component={Ambassadors} {...props} />} />
        <Route path="/privacy_policy" element={<Wrapper component={Guidelines} {...props} />} />
        <Route path="/terms_of_use" element={<Wrapper component={TermsOfUse} {...props} />} />
        <Route path="/about" element={<Wrapper component={About} {...props} />} />
        <Route path="/challenge" element={<Wrapper component={Challenge} {...props} />} />
        <Route path="/faqs" element={<Wrapper component={FAQs} {...props} />} />
        <Route path="/activities/:id/edit" element={<Wrapper component={CreateActivity} {...props} />} />
        <Route path="/activities/:id" element={<Wrapper component={ActivityDetails} {...props} />} />
        <Route path="/activities" element={<Wrapper component={Activities} {...props} />} />
        <Route path="/create-team" element={<Wrapper component={CreateTeam} {...props} />} />
        <Route path="*" element={<Wrapper component={NotFound} {...props} />} />
      </Routes>
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
