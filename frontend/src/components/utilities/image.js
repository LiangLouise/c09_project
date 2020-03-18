import React, { Component } from 'react';

import { Divider, Row, Col, Comment, Tooltip, Avatar, Card, Layout, Input, Form, Button} from 'antd';
import moment from 'moment';
import { MessageOutlined} from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
import { loadModels, getFullFaceDescription } from '../faceapi/face';


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
        };
    }
    

    componentWillMount = async () => {
        await loadModels();
        await this.handleImage(this.state.imageURL);
      };
    
      handleImage = async (image = this.state.imageURL) => {
        await getFullFaceDescription(image).then(fullDesc => {
          if (!!fullDesc) {
            this.setState({
              fullDesc,
              detections: fullDesc.map(fd => fd.detection)
            });
          }
        });
      };
    
      






    render(){

        const imageURL = this.state.imageURL;
        const detections = this.state.detections;

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
                />
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