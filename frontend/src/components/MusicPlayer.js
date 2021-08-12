import React , {Component} from "react"
import {Grid , Card, Typography, IconButton, LinearProgress} from "@material-ui/core"
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import PauseIcon from '@material-ui/icons/Pause'
import SkipNextIcon from '@material-ui/icons/SkipNext'

export default class MusicPlayer extends Component {
    constructor(props){
        super(props);
        
    }


playSong(){
    const requestOptions = {
        method : "PUT", 
        headers : {'Content-Type': 'application/json'}
    }
    fetch('/spotify/play', requestOptions);
}

pauseSong(){
    const requestOptions = {
        method : "PUT", 
        headers : {'Content-Type': 'application/json'}
    }
    fetch('/spotify/pause', requestOptions);
}



    render(){
        const songProgress = (this.props.time/this.props.duration)*100;
            return (<Card>
            <Grid container alignItems = "center">
                <Grid item align = "center" xs={4}>
                    <img src = {this.props.image_url} height = "100%" width = "100%" />
                </Grid>
                <Grid item align = "center" xs = {8} > 
                <Typography component = "h5" variant = "h5"> {this.props.title}</Typography>
                <Typography  variant = "subtitle1" color = "textSecondary"> {this.props.artist}</Typography>
                <IconButton onClick = { ()=> {this.props.is_playing?this.pauseSong():this.playSong()}}> {this.props.is_playing? <PauseIcon /> : <PlayArrowIcon />}</IconButton>
                <IconButton> <SkipNextIcon /></IconButton>
                </Grid>
            </Grid>
            <LinearProgress variant = "determinate" value = {songProgress} />
            <Grid item align= "center">{}</Grid>
        </Card>);   
    }
}
