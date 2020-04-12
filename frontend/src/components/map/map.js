import React, { Component } from 'react';
import CurrentLocation from './curloc';
import axios from 'axios';
import { Marker, GoogleApiWrapper, InfoWindow } from 'google-maps-react';
import moment from "moment";


class MyMap extends Component {
    constructor(props) {
        super(props)
        this.state = {
            posts: [],
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {}
        }
        this.getLast25Posts = this.getLast25Posts.bind(this);
    }
    onMarkerClick = (props, marker, e) =>
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });

    componentDidMount() {
        this.getLast25Posts();
    }
    getLast25Posts(){
        let i =0;
        for (i; i<5;i++){
            let temp = {};
            let data = [];
            axios
                .get(process.env.REACT_APP_BASE_URL+
                    '/api/posts/following/?page='+i,
                    {withCredentials: true})
                .then(res=>{
                    for(let i=0; i<res.data.length;i++){
                        console.log(res.data)
                        temp = {
                            'title': res.data[i].title,
                            'description': res.data[i].dis,
                            'date': moment(res.data[i].time).format('llll'),
                            'id': res.data[i]._id,
                            'username': res.data[i].username,
                            'lat': res.data[i].latitude,
                            'lng': res.data[i].longitude,
                            'address': res.data[i].address,
                        };
                        data.push(temp);
                    }
                    console.log(data)
                    this.setState({
                        posts: this.state.posts.concat(data),
                    });
                })
        }
    }
    onClose = props => {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            });
        }
    };

    render() {
        return (
            <CurrentLocation centerAroundCurrentLocation google={this.props.google}>
                <Marker onClick={this.onMarkerClick} name={'Your Location'} />

                {this.state.posts.map((post) => (
                    <Marker
                        onClick={this.onMarkerClick}
                        name={post.username
                        +' took pictures at '+post.address
                        +' for post: \"'+post.title+'\" on '+post.date}
                        position={{lat:post.lat, lng:post.lng}}/>

                    ))}
                <InfoWindow
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}
                    onClose={this.onClose}
                >
                    <div>
                        <h4>{this.state.selectedPlace.name}</h4>
                    </div>
                </InfoWindow>
            </CurrentLocation>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyCrRoMdkyieG4zFNsTI7JSmDaUfVGp0pwA'
})(MyMap) ;