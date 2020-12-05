import React,{Component} from 'react';

import {BrowserRouter as Router,Route,Switch} from 'react-router-dom';
import PageWrapper from './components/PageWrapper';

import {withAPI} from './components/api';

import Signup from './components/pages/user_auth/Signup';
import Login from './components/pages/user_auth/Login';
import PasswordReset from './components/pages/user_auth/PasswordReset';
import PasswordResetConfirm from './components/pages/user_auth/PasswordResetConfirm';
import EmailConfirm from './components/pages/user_auth/EmailConfirm';
import Profile from './components/pages/profile/Profile';
import UserProjects from './components/pages/profile/profile_components/UserProjects';
import Projects from './components/pages/projects/Projects';
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
          <PageWrapper >
            <Projects {...props} {...this.props}/>
          </PageWrapper>
        )}/>

      <Route path="/signup"
        render={props=>(
          <PageWrapper>
            <Signup {...props} {...this.props}/>
          </PageWrapper>
        )}/>

      <Route path="/login"
        render={props=>(
        <PageWrapper>
          <Login {...props} {...this.props}/>
        </PageWrapper>
      )}/>

    <Route path="/password-reset"
        render={props=>(
        <PageWrapper>
          <PasswordReset {...props} {...this.props}/>
        </PageWrapper>
        )}/>

    <Route path="/password-reset-confirm"
        render={props=>(
        <PageWrapper>
          <PasswordResetConfirm {...props} {...this.props}/>
        </PageWrapper>
        )}/>

    <Route path="/email-confirm"
        render={props=>(
        <PageWrapper>
          <EmailConfirm {...props} {...this.props}/>
        </PageWrapper>
        )}/>

    <Route path="/profile/:username/projects"
        render={props=>(
        <PageWrapper>
          <UserProjects {...props} {...this.props}/>
        </PageWrapper>
        )}/>

    <Route path="/profile/:username"
        render={props=>(
        <PageWrapper>
          <Profile {...props} {...this.props}/>
        </PageWrapper>
        )}/>

    <Route path="/profile"
        render={props=>(
        <PageWrapper>
          <Profile {...props} {...this.props}/>
        </PageWrapper>
        )}/>

    <Route path="/projects/create"
        render={props=>(
        <PageWrapper>
          <CreateProject {...props} {...this.props}/>
        </PageWrapper>
        )}/>

    <Route path="/projects/:id"
        render={props=>(
        <PageWrapper>
          <ProjectDetails {...props} {...this.props}/>
        </PageWrapper>
        )}/>


      </Switch>

    </Router>
  );
}
}

export default withAPI(App)
