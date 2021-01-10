import React,{Component} from 'react';

import {BrowserRouter as Router,Route,Switch} from 'react-router-dom';

import { withTranslation } from 'react-i18next';

import {withAPI} from './components/api';

import PageWrapper from './components/PageWrapper';

import Signup from './components/pages/user_auth/Signup';
import Login from './components/pages/user_auth/Login';
import PasswordReset from './components/pages/user_auth/PasswordReset';
import PasswordResetConfirm from './components/pages/user_auth/PasswordResetConfirm';
import EmailConfirm from './components/pages/user_auth/EmailConfirm';
import Profile from './components/pages/profile/Profile';
import UserProjects from './components/pages/profile/profile_components/UserProjects';
import UserFollowers from './components/pages/profile/profile_components/UserFollowers';
import Projects from './components/pages/projects/Projects';
import SavedProjects from './components/pages/projects/projects_components/SavedProjects';
import CreateProject from './components/pages/projects/projects_components/CreateProject';
import ProjectDetails from './components/pages/projects/projects_components/ProjectDetails';

class App extends Component {

render(){
return(
    <Router>
      <Switch>

      <Route
        exact={true}
        path="/"
        render={props=>(
          <PageWrapper {...props} {...this.props}>
            <Projects {...props} {...this.props}/>
          </PageWrapper>
        )}/>

      <Route path="/signup"
        render={props=>(
          <PageWrapper {...props} {...this.props}>
            <Signup {...props} {...this.props}/>
          </PageWrapper>
        )}/>

      <Route path="/login"
        render={props=>(
        <PageWrapper {...props} {...this.props}>
          <Login {...props} {...this.props}/>
        </PageWrapper>
      )}/>

    <Route path="/password-reset"
        render={props=>(
        <PageWrapper {...props} {...this.props}>
          <PasswordReset {...props} {...this.props}/>
        </PageWrapper>
        )}/>

    <Route path="/password-reset-confirm"
        render={props=>(
        <PageWrapper {...props} {...this.props}>
          <PasswordResetConfirm {...props} {...this.props}/>
        </PageWrapper>
        )}/>

    <Route path="/email-confirm"
        render={props=>(
        <PageWrapper {...props} {...this.props}>
          <EmailConfirm {...props} {...this.props}/>
        </PageWrapper>
        )}/>

    <Route path="/creators/:username/projects"
        render={props=>(
        <PageWrapper {...props} {...this.props}>
          <UserProjects {...props} {...this.props}/>
        </PageWrapper>
        )}/>

    <Route path="/creators/:username/followers"
        render={props=>(
        <PageWrapper {...props} {...this.props}>
          <UserFollowers {...props} {...this.props}/>
        </PageWrapper>
        )}/>

    <Route path="/creators/:username"
        render={props=>(
        <PageWrapper {...props} {...this.props}>
          <Profile {...props} {...this.props}/>
        </PageWrapper>
        )}/>

    <Route path="/profile"
        render={props=>(
        <PageWrapper {...props} {...this.props}>
          <Profile {...props} {...this.props}/>
        </PageWrapper>
        )}/>

    <Route path="/projects/create"
        render={props=>(
        <PageWrapper {...props} {...this.props}>
          <CreateProject {...props} {...this.props}/>
        </PageWrapper>
        )}/>

    <Route path="/projects/saved"
        render={props=>(
        <PageWrapper {...props} {...this.props}>
          <SavedProjects {...props} {...this.props}/>
        </PageWrapper>
        )}/>
    <Route path="/projects/:id"
        render={props=>(
        <PageWrapper {...props} {...this.props}>
          <ProjectDetails {...props} {...this.props}/>
        </PageWrapper>
        )}/>
      </Switch>

    </Router>
  );
}
}

export default withTranslation()(withAPI(App));
