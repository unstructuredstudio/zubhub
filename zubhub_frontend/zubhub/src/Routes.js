import React from 'react';
import { Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ProtectedRoute, SessionExpireModal } from './components';
import PageWrapper from './wrapper/PageWrapper';
import * as Views from './views';

const routeConfig = [
  { path: '/profile', component: Views.Profile, protected: true },
  { path: '/settings', component: Views.Settings, protected: true },
  { path: '/', component: Views.Home, global: true },
  { path: '/activities/create', component: Views.CreateActivity },
  { path: '/activities/:id/linkedProjects', component: Views.LinkedProjects },
  { path: '/activities/:id/edit', component: Views.CreateActivity },
  { path: '/activities/:id', component: Views.ActivityDetailsV2 },
  { path: '/activities', component: Views.Activities },
  { path: '/search', component: Views.SearchResults },
  { path: '/signup', component: Views.Signup, global: true },
  { path: '/login', component: Views.Login, global: true },
  { path: '/password-reset', component: Views.PasswordReset, global: true },
  { path: '/password-reset-confirm', component: Views.PasswordResetConfirm, global: true },
  { path: '/email-confirm', component: Views.EmailConfirm, global: true },
  { path: '/phone-confirm', component: Views.PhoneConfirm },
  { path: '/team', component: Views.Teams },
  { path: '/edit-profile', component: Views.EditProfile },
  { path: '/:groupname/edit-team', component: Views.EditTeam },
  { path: '/teams/:groupname/followers', component: Views.TeamFollowers },
  { path: '/teams/:groupname/projects', component: Views.TeamProjects },
  { path: '/teams/:groupname/members', component: Views.GroupMembers },
  { path: 'teams/:groupname', component: Views.Team },
  { path: '/teams/all', component: Views.AllTeams },
  { path: '/team', component: Views.Teams },
  { path: 'creators/:username', component: Views.Profile, global: true },
  { path: '/creators/:username/projects', component: Views.UserProjects },
  { path: '/creators/:username/drafts', component: Views.UserDrafts },
  { path: '/creators/:username/followers', component: Views.UserFollowers },
  { path: '/creators/:username/following', component: Views.UserFollowing },
  { path: '/creators/:username/members', component: Views.GroupMembers },
  { path: '/creators/:username/add-members', component: Views.AddGroupMembers },
  { path: '/group-invite-confirm', component: Views.GroupInviteConfirm },
  { path: '/projects', component: Views.Projects },
  { path: '/projects/staff-picks/:id', component: Views.StaffPickDetails },
  { path: '/projects/create', component: Views.CreateProject },
  { path: '/projects/saved', component: Views.SavedProjects },
  { path: '/projects/:id/edit', component: Views.CreateProject },
  { path: '/projects/:activity_id/create', component: Views.CreateProject },
  { path: '/projects/:id', component: Views.ProjectDetails, global: true },
  { path: '/ambassadors', component: Views.Ambassadors, global: true },
  { path: '/privacy_policy', component: Views.Guidelines, global: true },
  { path: '/terms_of_use', component: Views.TermsOfUse, global: true },
  { path: '/about', component: Views.About, global: true },
  { path: '/challenge', component: Views.Challenge, global: true },
  { path: '/faqs', component: Views.FAQs, global: true },
  { path: '/create-team', component: Views.CreateTeam },
  { path: '/linked-projects', component: Views.LinkedProjects },
  { path: 'session-expired', component: SessionExpireModal },
  { path: '/account-status', component: Views.AccounStatus },
  { path: '*', component: Views.NotFound },
];

const Wrapper = props => {
  const { component: Component, ...rest } = props;
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
      <Component {...routeProps} {...rest} />
    </PageWrapper>
  );
};

function RoutesContainer(props) {
  return (
    <Routes>
      {routeConfig.map((route, index) => (
        <Route
          key={index}
          path={route.path}
          element={
            route?.protected ? (
              <ProtectedRoute wrapper={Wrapper} component={route.component} {...props} global={route?.global} />
            ) : (
              <Wrapper component={route.component} {...props} global={route?.global} />
            )
          }
        />
      ))}
    </Routes>
  );
}

export default RoutesContainer;
