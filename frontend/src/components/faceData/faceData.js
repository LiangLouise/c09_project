import React, { Component } from 'react';
import {Upload, Button, message, Typography, Spin, Form, Row, Col} from "antd";
import style from "./faceData.css";
import {getFullFaceDescription} from "../utilities/face";
import axios from 'axios';

const { Title, Paragraph, Text } = Typography;

const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
        onSuccess("ok");
    }, 0);
};

const profileFromLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

class FaceData extends Component {

    constructor() {
        super();
        this.state = {
            loading: false,
            findingFace: false,
            fullDesc: null,
            src: null,
            file: null,
            form: null,
            canvas: null,
            dimensions:{
                height: 0,
                width: 0
            }
        };

        this.beforeUpload = this.beforeUpload.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
        this.getFaceData = this.getFaceData.bind(this);
        this.onImgLoad = this.onImgLoad.bind(this);
    }

    onImgLoad({target:img}) {
        this.setState({
            dimensions:{
                height: img.height,
                width: img.width
            }
        });
    }

    createDrawBox(detection) {
        let _H = detection.box.height;
        let _W = detection.box.width;
        let _X = detection.box._x;
        let _Y = detection.box._y;
        return (
            <div
                style={{
                    border: 'solid',
                    borderColor: 'blue',
                    height: _H,
                    width: _W,
                    transform: `translate(${_X}px,${_Y}px)`
                }}
            >
            </div>
        );
    }

    beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        } else {
            this.setState({
                src: URL.createObjectURL(file),
            });
        }
        return isJpgOrPng;
    }

    handleUpload(info) {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            this.setState({
                loading: false,
                file: info.file,
            });
        }
        else if (info.file.status === 'error') {
            this.setState({
                loading: false,
                file: null
            });
            message.error(`${info.file.name} file added failed.`);
        }
    };

    getFaceData = async () => {
        this.setState({loading: true, findingFace: true});
        await getFullFaceDescription(this.state.src, this.state.dimensions)
            .then(fullDesc => {
                if (fullDesc) {
                    message.success("Yeah, we located your face!");
                    this.setState({
                        loading: false,
                        findingFace: false,
                        fullDesc: fullDesc,
                    });
                } else {
                    message.warning("Unable to Find Your Face, Can you try another image?");
                    this.setState({
                        src: null,
                        file: null,
                        loading: false,
                        findingFace: false
                    })
                }
            });
    };

    sendFaceData = () => {
        console.log("Start to send");
        if (this.state.fullDesc) {
            console.log("Start to send");
            let data = {
                descriptor: this.state.fullDesc.descriptor
            };
            axios.put(process.env.REACT_APP_BASE_URL+'/api/profile/facedata', data, {withCredentials: true})
                .then(res => {
                    message.success("Your Face Data is uploaded.");
                    this.setState({
                        src: null,
                        file: null,
                        fullDesc: null
                    });
                }).catch(err => {
                message.error(err.response.data.error);
            });
        }
    };

    render() {
        let find_face, upload, submit;
        if (this.state.file) {
            find_face = (<Button type="primary" onClick={this.getFaceData}>Find Face</Button>);
            upload = (<Button type="primary">Change</Button>);
        }
        else {
            find_face = (<div/>);
            upload = (<Button type="primary">Upload</Button>);
        }

        if (this.state.fullDesc) {
            submit = (<Button type="primary" onClick={this.sendFaceData}>Submit</Button>);
        } else {
            submit = (<div/>);
        }

        return (
            <div>
                <Spin spinning={this.state.findingFace} size="large" tip="Detecting..." style={style.loading}>
                    <Form {...profileFromLayout}>
                        <Form.Item>
                            <Title level={2}>Update Your Face Recognition Data</Title>
                        </Form.Item>
                        <Form.Item>
                            <Row gutter={8}>
                                <Col>
                                    <Upload
                                        name="face_data"
                                        listType="picture"
                                        className="face_data_uploader"
                                        showUploadList={false}
                                        beforeUpload={this.beforeUpload}
                                        onChange={this.handleUpload}
                                        customRequest={dummyRequest}
                                    >
                                        <div>{upload}</div>
                                    </Upload>
                                </Col>
                                <Col>
                                    {find_face}
                                </Col>
                                <Col>
                                    {submit}
                                </Col>
                            </Row>

                        </Form.Item>
                        <Form.Item>
                            <div style={style.faceDataDiv}>
                                <div style={{ position: 'absolute' }}>
                                    {this.state.file ? <img onLoad={this.onImgLoad} src={this.state.src} alt="face_data" className={style.faceDataImg} />: <div/>}
                                </div>
                                {this.state.fullDesc ? this.createDrawBox(this.state.fullDesc.detection): <div/>}
                            </div>
                        </Form.Item>

                    </Form>
                </Spin>
            </div>
        );
    }
}

export default FaceData;