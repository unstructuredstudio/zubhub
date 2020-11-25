import React,{Component} from 'react';
import {connect} from 'react-redux';
// import {withFirebase} from '../../api';
// import events_data from '../../../assets/mock-api/events_data';

class Home extends Component{
  constructor(props){
    super(props);
    this.state={
    eventsData:[],
    currentUser:{},
    }
  }



  // async componentDidMount() {

  //     let response  = await fetch("https://us-central1-tilllate-2cb9c.cloudfunctions.net/homePageEvents");

  //       response = await response.json();
  //       //console.log(response)

  //       this.props.firebase.get_all_categories().then(categories=>{
  //         this.setState({
  //           eventsData:response,
  //           categoryData:categories
  //         })
  //       })
  //       .catch(error=>console.log(error))
  // }


  render(){
    console.log(this.props);
    if(Object.keys(this.state.eventsData).length !== 0){

    return(
    <div>
    </div>
    )

  }
  else{
    return (
      <>
      <div>{this.props.auth && this.props.auth.username}, {this.props.auth && this.props.auth.email}</div>
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
  }


const mapStateToProps = state =>{
  return{
    auth:state.auth
  }
}


export default connect(
  mapStateToProps
)(Home);
