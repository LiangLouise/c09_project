import React, { Component } from 'react';

import { loadModels, getFullFaceDescription, createMatcher } from '../faceapi/face';

const JSON_PROFILE = require('../descriptors/bnk48.json');


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