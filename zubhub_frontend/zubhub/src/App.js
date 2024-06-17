import React, { useContext, useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { Routes, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import CreateActivity from './views/create_activity/CreateActivity';
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
        <Route path="/" element={<PageWrapper {...props} Component={Home} />} />

        <Route path="/projects" element={<PageWrapper {...props} Component={Projects} />} />

        <Route path="/activities/create" element={<PageWrapper {...props} Component={CreateActivity} protected />} />

        <Route path="/activities/:id/linkedProjects" element={<PageWrapper {...props} Component={LinkedProjects} />} />

        <Route path="/search" element={<PageWrapper {...props} Component={SearchResults} />} />

        <Route path="/signup" element={<PageWrapper {...props} Component={Signup} />} />

        <Route path="/login" element={<PageWrapper {...props} Component={Login} />} />

        <Route path="/password-reset" element={<PageWrapper {...props} Component={PasswordReset} />} />

        <Route path="/password-reset-confirm" element={<PageWrapper {...props} Component={PasswordResetConfirm} />} />

        <Route path="/email-confirm" element={<PageWrapper {...props} Component={EmailConfirm} />} />

        <Route path="/phone-confirm" element={<PageWrapper {...props} Component={PhoneConfirm} />} />

        <Route path="/group-invite-confirm" element={<PageWrapper {...props} Component={GroupInviteConfirm} />} />

        <Route path="/creators/:username/projects" element={<PageWrapper {...props} Component={UserProjects} />} />

        <Route path="/settings" element={<PageWrapper {...props} Component={Settings} protected />} />

        <Route path="/profile" element={<PageWrapper {...props} Component={Profile} protected />} />

        <Route path="/team" element={<PageWrapper {...props} Component={Teams} />} />
        <Route path="/teams/:groupname/projects" element={<PageWrapper {...props} Component={TeamProjects} />} />

        <Route
          path="/creators/:username/drafts"
          element={<PageWrapper {...props} Component={UserDrafts} protected />}
        />

        <Route path="/creators/:username/followers" element={<PageWrapper {...props} Component={UserFollowers} />} />

        <Route path="/teams/:groupname/followers" element={<PageWrapper {...props} Component={TeamFollowers} />} />

        <Route path="/teams/:groupname/members" element={<PageWrapper {...props} Component={TeamMembers} />} />

        <Route path="/creators/:username/following" element={<PageWrapper {...props} Component={UserFollowing} />} />

        <Route path="/teams/all" element={<PageWrapper {...props} Component={AllTeams} />} />

        <Route path="/creators/:username/members" element={<PageWrapper {...props} Component={GroupMembers} />} />

        <Route
          path="/creators/:username/add-members"
          element={<PageWrapper {...props} Component={AddGroupMembers} protected />}
        />

        <Route path="/creators/:username" element={<PageWrapper {...props} Component={Profile} />} />

        <Route path="/account-status" element={<PageWrapper {...props} Component={AccounStatus} protected />} />

        <Route path="/teams/:groupname" element={<PageWrapper {...props} Component={Team} />} />

        <Route path="/edit-profile" element={<PageWrapper {...props} Component={EditProfile} protected />} />

        <Route path="/:groupname/edit-team" element={<PageWrapper {...props} Component={EditTeam} protected />} />

        <Route path="/projects/staff-picks/:id" element={<PageWrapper {...props} Component={StaffPickDetails} />} />

        <Route path="/projects/create" element={<PageWrapper {...props} Component={CreateProject} protected />} />

        <Route path="/projects/saved" element={<PageWrapper {...props} Component={SavedProjects} protected />} />
        <Route path="/projects/:id/edit" element={<PageWrapper {...props} Component={CreateProject} protected />} />
        <Route
          path="/projects/:activity_id/create"
          element={<PageWrapper {...props} Component={CreateProject} protected />}
        />

        <Route path="/projects/:id" element={<PageWrapper {...props} Component={ProjectDetails} />} />

        <Route path="/ambassadors" element={<PageWrapper {...props} Component={Ambassadors} />} />

        <Route path="/privacy_policy" element={<PageWrapper {...props} Component={Guidelines} />} />

        <Route path="/terms_of_use" element={<PageWrapper {...props} Component={TermsOfUse} />} />

        <Route path="/about" element={<PageWrapper {...props} Component={About} />} />

        <Route path="/challenge" element={<PageWrapper {...props} Component={Challenge} />} />

        <Route path="/faqs" element={<PageWrapper {...props} Component={FAQs} />} />

        <Route path="/activities/:id/edit" element={<PageWrapper {...props} Component={CreateActivity} protected />} />

        <Route path="/activities/:id" element={<PageWrapper {...props} Component={ActivityDetails} />} />

        <Route path="/activities" element={<PageWrapper {...props} Component={Activities} />} />

        <Route path="/create-team" element={<PageWrapper {...props} Component={CreateTeam} protected />} />

        <Route path="*" element={<PageWrapper {...props} Component={NotFound} />} />
      </Routes>
    </ThemeContext.Provider>
  );
}

const mapStateToProps = state => ({
  auth: state.auth,
});

const ConnectedApp = connect(mapStateToProps)(App);

export default withTranslation()(ConnectedApp);
