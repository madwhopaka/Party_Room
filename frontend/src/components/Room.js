import React ,{Component} from "react";
import {Typography, Grid , Button } from "@material-ui/core"
import {Link} from 'react-router-dom'
import CreateRoom from './CreateRoom.js'
import MusicPlayer from  './MusicPlayer.js'


export default class Room extends Component{
    
    constructor(props) {
        super(props);  
        this.state = {
            votesToSkip: 2,
            guestCanPause:false,
            isHost :false,
            showSettings : false,
            spotifyAuthenticate : false,
            song : {},

        };
        this.roomCode = this.props.match.params.roomCode;
        this.getRoomDetails();
        this.getCurrentSong();
        this.leaveButtonClicked = this.leaveButtonClicked.bind(this)
        this.updateShowSettings = this.updateShowSettings.bind(this)
        this.renderSettings = this.renderSettings.bind(this)
        this.renderSettingsButton = this.renderSettingsButton.bind(this)
        this.getRoomDetails = this.getRoomDetails.bind(this)
        this.authenticateSpotify = this.authenticateSpotify.bind(this)
        this.getCurrentSong = this.getCurrentSong.bind(this)
       
    }

    componentDidMount(){
        this.interval = setInterval(this.getCurrentSong, 1000)

    }

    componentWillMount(){
        clearInterval(this.setInterval)
    }

    getCurrentSong(){
        fetch('/spotify/current-song').then((response)=>{
            if(!response.ok){
                return {};
            }
            else{
                return response.json();
            }
        }).then((data)=>{this.setState({song:data});
            
    });
    }

    getRoomDetails() {
        fetch("/api/get-room"+ "?code=" + this.roomCode).then((response)=>
            {if (!response.ok)
            {this.props.leaveRoomCallback();
            this.props.history.push('/');
            }
            return response.json();
            })
            .then((data)=>{
            this.setState({
                votesToSkip : data.votes_to_skip,
                guestCanPause : data.guest_can_pause,
                isHost : data.is_host,
            });
            if (this.state.isHost)
            {
                this.authenticateSpotify();
            }
        });
    }

    authenticateSpotify() {
        fetch("/spotify/is-authenticated")
          .then((response) => response.json())
          .then((data) => {
            this.setState({ spotifyAuthenticated: data.status });
            console.log(data.status);
            if (!data.status) {
              fetch("/spotify/get-auth-url")
                .then((response) => response.json())
                .then((data) => {
                  window.location.replace(data.url);
                });
            }
          });
      }


    leaveButtonClicked(){
        const requestOptions={
            method : "POST",
            headers : {"Content-Type":"application/json"},
           
        };
        fetch('/api/leave-room',requestOptions)
        .then((_response)=>{
        this.props.leaveRoomCallback();
        this.props.history.push('/');
    })
    }

    updateShowSettings(value){
        this.setState( {
            showSettings:value
        });
    }

    renderSettingsButton(){
        return(<Grid item xs ={12} align ="center"> 
            <Button variant = "contained" color ="primary" onClick ={() => this.updateShowSettings(true)}>
                Settings
            </Button>
         </Grid>)
    }

    renderSettings(){
        return( <Grid container spacing ={2}>
            <Grid item xs = {12} align = "center">
                <CreateRoom update = {true}
                votesToSkip ={this.state.votesToSkip}
                guestCanPause = {this.state.guestCanPause}
                roomCode = {this.roomCode}
                updateCallback = {this.getRoomDetails}></CreateRoom>
            </Grid>
            <Grid item xs = {12} align  = "center">
            <Button 
            variant = "contained"
            color ="secondary"
            onClick ={() => this.updateShowSettings(false)}>
                Close
            </Button>
            </Grid>

        </Grid>)
    }
    render() {
        if(this.state.showSettings==true){
            return this.renderSettings();

        }
        else{
        return ( <Grid container spacing = {2}>
            <Grid item xs = {12} align ="center">
                <Typography variant = "h3" component = "h3" color = "primary">
                    Room Code :{this.roomCode.toString()}
                </Typography>
            </Grid>
            <MusicPlayer {...this.state.song}/>
            {this.state.isHost ? this.renderSettingsButton():null}
            <Grid item xs = {12} align = "center">
                <Button variant = "contained" color = "secondary"  onClick = {this.leaveButtonClicked}>
                    Leave the Room
                </Button>  
            </Grid>
        </Grid>
        )}} ;
    }


    


 
