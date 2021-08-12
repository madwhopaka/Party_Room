import React, { Component} from "react";
import RoomJoinPage from "./RoomJoinPage"
import CreateRoom from "./CreateRoom"
import Room from "./Room"
import
    {BrowserRouter as Router,
     Switch,
     Route,
      Link, 
     Redirect}
     from 'react-router-dom';
import {Typography, ButtonGroup, Grid, Button} from "@material-ui/core" 

export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state= {
            roomCode : null,
        };
        
        this.clearRoomCode = this.clearRoomCode.bind(this)
    }

    async componentDidMount() {
        fetch('/api/user-in-room').
        then((response)=> response.json())
        .then((data)=>
        {this.setState({
            roomCode : data.code
        });
    });
    }

    renderHomePage(){
        return(<Grid container spacing = {3} >
            <Grid item xs = {12} align = "center">
                <Typography variant = "h3" component= "h3"  color="secondary" >
                    HouseParty
                </Typography>
            </Grid>
            <Grid item xs= {12} align = "center">
                <ButtonGroup disableElevation variant= "contained" color= "primary" >
                    <Button variant = "contained" to="/create" color = "primary" component = {Link} >
                            Create a Room
                    </Button>
                    <Button variant = "contained" to="/join"  color = "secondary" component = {Link} >
                            Join a Room 
                    </Button>

                </ButtonGroup>
            </Grid>
        </Grid>)
    }


    clearRoomCode(){
        this.setState({
            roomCode: null,
        });
   }



    render() {
            return(
                    <Router>
                        <Switch> 
                                <Route exact path = '/'
                                render ={()=>{
                                return this.state.roomCode ? 
                                (<Redirect to= {`/room/${this.state.roomCode}`}/>): 
                                (this.renderHomePage()
                                )}}></Route>

                                <Route path = '/join' component={RoomJoinPage} />                    
                                <Route path = '/create' component={CreateRoom} />
                                <Route path = '/room/:roomCode' 
                                               render = {(props)=>{
                                               return <Room {...props} leaveRoomCallback = {this.clearRoomCode} />;
                                               }} />

                        </Switch>
                    </Router>
            ) ;
    }


    
}   