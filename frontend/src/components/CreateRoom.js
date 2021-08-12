import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { FormHelperText } from '@material-ui/core';
import FormControl from "@material-ui/core/FormControl";
import { Link } from "react-router-dom";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Box from "@material-ui/core/Box";
import {Collapse} from "@material-ui/core"
import {Alert} from "@material-ui/lab"



export default class CreateRoom extends Component {
    static defaultProps =   {
        votesToSkip :2,
        guestCanPause : true,
        update : false,
        roomCode : null, 
        updateCallback : ()=> {},
    };
    constructor(props) {
        
        super(props);
        this.state = {
            guestCanPause: this.props.guestCanPause,
            votesToSkip: this.props.votesToSkip,
            successMsg : "",
            errorMsg: "",
        };
        this.handleRoomButtonClicked = this.handleRoomButtonClicked.bind(this)
        this.handleUpdateButtonClicked = this.handleUpdateButtonClicked.bind(this)
        this.handleGuestPauseChange = this.handleGuestPauseChange.bind(this)
        this.handleVotesChange = this.handleVotesChange.bind(this)
        this.renderUpdateButton = this.renderUpdateButton.bind(this)
        this.renderCreateButton = this.renderCreateButton.bind(this)

    }


    handleVotesChange(e) {
        this.setState(
            { votesToSkip: e.target.value ,}
        );
    };

    handleGuestPauseChange(e) {
        this.setState(
            { guestCanPause: e.target.value === 'true' ? true : false, }
        )
    };

    handleRoomButtonClicked() {
        const requestOptions = {
            method: 'POST',
            credentials: 'same-origin',
            headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({
                votes_to_skip: this.state.votesToSkip,
                guest_can_pause: this.state.guestCanPause,

            }),
        };
        fetch("/api/create-room", requestOptions)
        .then((response) => response.json()
        ).then((data) =>this.props.history.push('/room/'+data.code));
    }

    handleUpdateButtonClicked(){
        const requestOptions = {
            method: 'PATCH',
            credentials: 'same-origin',
            headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({
                votes_to_skip: this.state.votesToSkip,
                guest_can_pause: this.state.guestCanPause,
                code : this.props.roomCode,
            }),
        };
        fetch("/api/update-room", requestOptions)
        .then((response)=>{
        if (response.ok){
            this.setState({
                successMsg: "Room Update successfully"
            })
        }
        else{this.setState({
            errorMsg : "Error updating Room :("
        })

        };
        this.props.updateCallback();
        })
    }

    renderCreateButton(){

        return (<Grid container spacing = {1}>
            <Grid item xs={12} align="center">
                <Button color="primary" variant="contained" onClick={this.handleRoomButtonClicked} >
                    Create a Room
                            </Button>
            </Grid>

            <Grid item xs={12} align="center">
                <Button color="secondary" variant="contained" to="/" component={Link}>
                    Go Back
                            </Button>
            </Grid>

        </Grid>);
    }


    renderUpdateButton(){
        return(
        <Grid item xs={12} align="center">
                <Button color="primary" variant="contained" onClick={this.handleUpdateButtonClicked} >
                    Update
                </Button>

    
            </Grid>);

    }


    render() {
        const title  = this.props.update?"Change Room Settings":"Create a Room"
        return (    
        <Grid container spacing={1} >
            <Grid item xs={12} align="center">
                <Collapse in = { this.state.errorMsg != "" || this.state.successMsg != ""}>
                {this.state.successMsg!= "" ? 
                <Alert severity ="success" onClose = {()=>{this.setState({successMsg: ""});
                }}
                >
                {this.state.successMsg}</Alert>:
                <Alert severity ="error">{this.state.errorMsg}</Alert>
                 }
                </Collapse>
            </Grid>

            <Grid item xs={12} align="center">
                <Typography  className ="apptext" color = "secondary" component="h3" variant="h3">
                    {title}
                            </Typography>
            </Grid>
            
            <Grid item xs={12} align="center">
                <FormControl component="fieldset">
                    <FormHelperText  align = "center" className = "apptext">
        
                          Guest control of Playback state
                      
                    </FormHelperText>
                    <RadioGroup row defaultValue={this.state.guestCanPause.toString()} onChange={this.handleGuestPauseChange}>
                        <FormControlLabel  className= "apptext" value="true"
                            control={<Radio color="primary" />}
                            label="Play/Pause"
                            labelPlacement="bottom"
                        />
                        <FormControlLabel   className= "apptext" value="false"
                            control={<Radio color="secondary" />}
                            label="No control"
                            labelPlacement="bottom"
                        />
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl>
                    <TextField
                        required={true}
                        type="number"
                        defaultValue={this.state.votesToSkip}
                        inputProps={{
                            min: 1,
                            style: { textAlign: "center" }
                        }}
                        onChange={this.handleVotesChange}
                    />
                    <FormHelperText align = "center" className = "apptext">
                            Votes to skip the song              
                    </FormHelperText>
                </FormControl>
            </Grid>
                {this.props.update?this.renderUpdateButton():this.renderCreateButton()}
        </Grid>);
    }
}