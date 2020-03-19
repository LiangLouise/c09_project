import React, { Component } from 'react';

import { loadModels, getFullFaceDescription, createMatcher } from '../faceapi/face';
import axios from 'axios';
import ChangeName from "./changeName";

import { Form,
    Button,
    Checkbox,
    Input,
    Typography,
    Modal, message } from 'antd';

let JSON_PROFILE = require('../descriptors/bnk48.json');


class Image extends Component{
    constructor(props){
        super(props);

        this.state={
            imageURL: this.props.src,
            width: this.props.width,
            realwidth: this.props.realwidth,
            fullDesc: null,
            detections: null,
            descriptors: null,
            match: null,
            faceMatcher: null
        };
    }

    /*
    callDb = async () => {
        axios
            .get(process.env.REACT_APP_BASE_URL+'/facedata/', {withCredentials: true})
            .then(res => {
                JSON_PROFILE = res;
            })
            .catch(err => {
                message.error(err.response.data);
            });
    }*/
    

    componentWillMount = async () => {
        await loadModels();
        this.setState({ faceMatcher: await createMatcher(JSON_PROFILE) });
        await this.handleImage(this.state.imageURL);
      };
    
      handleImage = async (image = this.state.imageURL) => {
        await getFullFaceDescription(image).then(fullDesc => {
          if (!!fullDesc) {
            this.setState({
              fullDesc,
              detections: fullDesc.map(fd => fd.detection),
              descriptors: fullDesc.map(fd => fd.descriptor)
            });
          }
        });

        if (!!this.state.descriptors && !!this.state.faceMatcher) {
            let match = await this.state.descriptors.map(descriptor =>
              this.state.faceMatcher.findBestMatch(descriptor)
            );
            
            this.setState({ match });
          }
      };
    
      
    render(){

        const imageURL = this.state.imageURL;
        const detections = this.state.detections;
        const match = this.state.match;
        const width = this.state.width;
        const realwidth = this.state.realwidth;
        const ratio = width/realwidth;
        const descriptors = this.state.descriptors;
        //console.log("width", width, "real", realwidth);

        let drawBox = null;
        if (!!detections) {
        drawBox = detections.map((detection, i) => {
            let _H = detection.box.height*ratio;
            let _W = detection.box.width*ratio;
            let _X = detection.box._x*ratio;
            let _Y = detection.box._y*ratio;
            console.log(_H, _W, _X, _Y);
            return (
                <div key={i}>
                <div
                  style={{
                    position: 'absolute',
                    border: 'solid',
                    borderColor: 'blue',
                    height: _H,
                    width: _W,
                    transform: `translate(${_X}px,${_Y}px)`
                  }}
                >
                  {!!match && !!match[i] ? (
                    <div
                      style={{
                        transform: `translate(${_W}px,-3px)`
                      }}
                    >
                      {match[i]._label != "unknown" ? (<ChangeName previousName={match[i]._label} descriptors={descriptors[i]}/>) : (
                          <ChangeName previousName={"Change Me"} descriptors={descriptors[i]}/>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            );
        });
        }

        return(
            <div className="image">

                    <div style={{ position: 'relative', width: width }}>
                    <div style={{ position: 'absolute', width: width }}>
                        <img src={imageURL} alt="imageURL" style={{ width: width}}/>
                    </div>
                    {!!drawBox ? drawBox : null}
                    </div>
            </div>
            
        );    
    } 
}
export default Image;