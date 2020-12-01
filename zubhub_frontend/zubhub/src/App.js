import React,{Component} from 'react';
import {connect} from 'react-redux';

import {BrowserRouter as Router,Route,Switch} from 'react-router-dom';
import PageWrapper from './components/PageWrapper';

// import { withAuthentication } from './components/session';
import {withAPI} from './components/api';
// import * as authActions from './store/actions/authActions';
// pages
import Home from './components/pages/home/Home';
import Signup from './components/pages/user_auth/Signup';
import Login from './components/pages/user_auth/Login';
import PasswordReset from './components/pages/user_auth/PasswordReset';
import PasswordResetConfirm from './components/pages/user_auth/PasswordResetConfirm';
import EmailConfirm from './components/pages/user_auth/EmailConfirm';
import Profile from './components/pages/profile/Profile';
import Projects from './components/pages/projects/Projects';
import CreateProject from './components/pages/projects/projects_components/CreateProject';
import ProjectDetails from './components/pages/projects/projects_components/ProjectDetails';
// import Artists from './components/pages/artists/Artists';
// import Artist from './components/pages/artists/Artist';
// import Upcoming from './components/pages/upcoming/Upcoming';
// import EventSchedules from './components/pages/event_schedules/EventSchedules';
// import Gallery from './components/pages/gallery/Gallery';
// import VideoGallery from './components/pages/gallery/VideoGallery';
// import ImageGallery from './components/pages/gallery/ImageGallery';
// import Cartegories from './components/pages/cartegories/Cartegories';
// import News from './components/pages/news/News';
// import NewsDetails from './components/pages/news/NewsDetails';
// import Cart from './components/pages/cart/Cart';

class App extends Component {

render(){
return(
    <Router>
      <Switch>
      {/* <Route path="/admin" component={Profile}/> */}

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
