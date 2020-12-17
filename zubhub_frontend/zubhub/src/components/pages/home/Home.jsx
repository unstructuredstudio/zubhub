import React,{Component} from 'react';
import {connect} from 'react-redux';

class Home extends Component{
  constructor(props){
    super(props);
    this.state={}
  }


  render(){
    return (
      <>
      {this.props.auth.token ? <div>Welcome to ZubHub!! 😃</div> : <div>You are not logged in, click on the login button to get started</div>}
      <div className="empty-1" style={{backgroundColor:'#242424',WebKitBoxShadow:'0px 5px 5px 0px rgba(0,0,0,0.46)',MozBoxShadow:'0px 5px 5px 0px rgba(0,0,0,0.46)',boxShadow:'0px 5px 5px 0px rgba(0,0,0,0.46)'}}></div>
      <div style={{height:"100vh",width:"100vw",position:"fixed",display:"flex",justifyContent:"center",alignItems:"center"}}>
      <div className="lds-css ng-scope">
        <div style={{width:"100%",height:"100%"}} className="lds-eclipse">
          <div></div>
      </div>
    </div>
     </div>
      <div style={{height:"50vh",width:"100vw",zIndex:"-10"}}></div>
     </>
    )
    }
  }


const mapStateToProps = state =>{
  return{
    auth:state.auth
  }
}


export default connect(
  mapStateToProps
)(Home);
