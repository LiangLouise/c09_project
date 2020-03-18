import React, { Component } from 'react';

import { Divider, Row, Col, Comment, Tooltip, Avatar, Card, Layout, Input, Form, Button} from 'antd';

import { loadModels, getFullFaceDescription, createMatcher } from '../faceapi/face';

const JSON_PROFILE = require('../descriptors/bnk48.json');
const { Meta } = Card;
const {Content} = Layout;


const onFinish = values => {
    
    console.log('Success:', values);
  
};

class Image extends Component{
    constructor(props){
        super(props);

        this.state={
            imageURL: this.props.src,
            fullDesc: null,
            detections: null,
            descriptors: null,
            match: null,
            faceMatcher: null
        };
    }
    

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
        let drawBox = null;
        if (!!detections) {
        drawBox = detections.map((detection, i) => {
            let _H = detection.box.height;
            let _W = detection.box.width;
            let _X = detection.box._x;
            let _Y = detection.box._y;
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
                    <p
                      style={{
                        backgroundColor: 'blue',
                        border: 'solid',
                        borderColor: 'blue',
                        width: _W,
                        marginTop: 0,
                        color: '#fff',
                        transform: `translate(-3px,${_H}px)`
                      }}
                    >
                      {match[i]._label}
                    </p>
                  ) : null}
                </div>
              </div>
            );
        });
        }

        return(
            <div className="image">

                    <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute' }}>
                        <img src={imageURL} alt="imageURL" />
                    </div>
                    {!!drawBox ? drawBox : null}
                    </div>
            </div>
            
        );    
    } 
}
export default Image;