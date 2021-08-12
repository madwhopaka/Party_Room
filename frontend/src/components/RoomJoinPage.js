import React, { Component } from "react";
import {TextField, Typography, Button ,Grid, FormHelperText,Radio, RadioGroup, FormControlLabel, Box } from "@material-ui/core"
import {Link} from "react-router-dom"
import {spacing} from "@material-ui/system"

export default class RoomJoinPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomCode : "",
            error : ""
        };

        this.handleTextFieldChange =this.handleTextFieldChange.bind(this);
        this.RoomButtonClicked = this.RoomButtonClicked.bind(this);
    }

    
    render() {
           return (<Grid container spacing = {2} alignItems = "center">
                    <Grid item  xs = {12} align = "center">
                        <Typography variant = "h2" component ="h2" >
                           Aao Mehfil Mai !
                        </Typography>
                    </Grid>
                    <Grid item xs = {12} align = "center">
                        <TextField   color = "primary" label = "Code"
                            error = {this.state.error}
                            placeholder = "Koi Secret Chabi hai ?"
                            helperText = {this.state.error}
                            variant = "outlined"
                            value ={this.state.roomCode}
                            onChange ={this.handleTextFieldChange}>
                           
                        </TextField>
                    </Grid>
                    <Grid item xs= {12}  align = "center" >
                        <Button variant = "contained"  m= "2rem" color= "primary" onClick ={this.RoomButtonClicked} >
                            Enter Room
                        </Button>
                    </Grid>

                    <Grid item xs= {12}  align = "center" >
                        <Button m= {4} variant = "contained" size = "medium" color= "secondary" to="/" component={Link}>
                           Go Back 
                        </Button>
                    </Grid>
                    
           </Grid>)
    }

    handleTextFieldChange(e){
        this.setState({
            roomCode : e.target.value
        })
    };
    
    RoomButtonClicked(){
           const requestOptions = {
               method : "POST",
               headers : {'Content-Type': 'application/json'},
               body : JSON.stringify({
                   code: this.state.roomCode   })
           };
           
          fetch('/api/join-room', requestOptions)
          .then((response)=> 
          { if (response.ok){
            this.props.history.push(`/room/${this.state.roomCode}`);
          }else{
              this.setState({error : "Room Not Found"});
          }
        }).catch((error)=>{
            console.log(error);
        });
    }   

}