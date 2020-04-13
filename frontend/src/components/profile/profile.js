import React from 'react';
import axios from 'axios';
import './profile.css'
import 'antd/dist/antd.css';
import {Modal, Button, Form, Avatar, Typography, message, Upload} from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import cookie from "react-cookies";

const { Title,Text } = Typography;
const formItemLayout = {
    wrapperCol: {
        span: 14,
        offset: 4,
    }
};
const titleLayout = {
    wrapperCol: {
        span: 14,
        offset: 9,
    },
}
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
        onSuccess("ok");
    }, 0);
};

const normFile = e => {
    console.log('Upload event:', e);

    if (Array.isArray(e)) {
        return e;
    }

    return e && e.fileList.slice(-1);
};


class Profile extends React.Component {
    formRef = React.createRef();
    constructor(props){
        super(props);
        this.state = {
            visible: false,
            fileList: [],
            profileHint: false,
            src: process.env.REACT_APP_BASE_URL+"/api/profile/avatar?username="+cookie.load('username'),
        };
        this.customSubmit = this.customSubmit.bind(this);
        this.removeFile = this.removeFile.bind(this);
    }


    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    onReset = () => {
        this.formRef.current.resetFields();
    }


    beforeUpload=(file)=> {
        const isJpegOrJpgOrPngOrGif = file.type === 'image/jpeg'
            || file.type === 'image/jpg'
            || file.type === 'image/png'
            || file.type === 'image/gif';
        if (!isJpegOrJpgOrPngOrGif) {
            message.error('You can only upload JPEG/JPG/PNG/GIF file!');
            file.status = 'error';
        }
        return isJpegOrJpgOrPngOrGif;

    }
    customSubmit = () => {

        let data= new FormData();
        if (this.state.fileList.length === 0){
            message.error("avatar cannot be empty");
            return;
        }else{
            data.append('avatar', this.state.fileList[0].originFileObj);
        }

        const config= {
            headers: {
                "content-type": "multipart/form-data",
            },
            withCredentials: true
        };

        axios
            .post(process.env.REACT_APP_BASE_URL+'/api/profile/avatar', data, config)
            .then((res) => {
                axios
                    .get(process.env.REACT_APP_BASE_URL+"/api/profile/avatar?username="+cookie.load('username'),
                        {withCredentials: true})
                    .then(response=>{

                        let temp = Buffer.from(response.data, 'binary').toString('base64')
                        // let temp = getBase64(response.data)
                        temp = 'data:'+response.headers['content-type']+';base64,'+temp
                        console.log(temp)
                        this.setState({
                            src:temp
                        })

                    }).catch((err) => {
                        message.error(err.response.data);
                    });
                message.success("Your avatar has been changed");
            }).catch(() => {
            message.error('change avatar failed');
        });
        this.setState({
            visible: false,
        })
        this.onReset();
    };

    handleUpload = info =>{

        if (info.file.status === 'uploading'){
            this.setState({loading: true});
            return;
        }
        if (info.file.status === 'done'){

            this.state.fileList.push(info.file)
            message.success(`${info.file.name} file is ready to upload.`);
            this.setState({
                loading: false,
                fileList: this.state.fileList,

            });
            console.log("fileList "+this.state.fileList)
        }
        else if (info.file.status === 'error') {
            message.error(`${info.file.name} file added failed.`);
        }
    }

    removeFile(file) {
        const index = this.state.fileList.indexOf(file);
        const newFileList = this.state.fileList.slice();
        newFileList.splice(index, 1);
        this.setState({fileList: newFileList});
    }

    handleCancel = e => {
        this.setState({
            visible: false,
        });
        this.onReset();
    };


    render() {
        return (
            <div>
                    <Avatar
                        className="profile-icon"
                        visible={this.state.profileHint}
                        onClick={this.showModal}
                        // onMouseEnter={this.handleMouseHover}
                        // onMouseLeave={this.handleMouseLeave}
                        src={this.state.src}
                    />
                <Modal
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    footer = {null}
                >
                    <Form
                        name="profile"
                        {...formItemLayout}
                        onFinish={this.customSubmit}
                        ref={this.formRef}
                    >
                        <Form.Item {...titleLayout}>
                            <Title  > {cookie.load('username').toUpperCase()}</Title>

                        </Form.Item>


                        <Text strong>Change Avatar: </Text>

                        <Form.Item name="Images"
                                   valuePropName="fileList"
                                   getValueFromEvent={normFile}
                                   rules={[
                                       {
                                           required: true,
                                       },
                                   ]}
                        >
                            <Upload.Dragger
                                name="picture"
                                onChange={this.handleUpload}
                                customRequest={dummyRequest}
                                onRemove={this.removeFile}
                                fileList={this.state.fileList}
                                withCredentials={true}
                                multiple={false}
                                beforeUpload={this.beforeUpload}
                            >
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">Click or drag your new avatar here</p>
                            </Upload.Dragger>
                        </Form.Item>


                        <Form.Item
                        >
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="register-form-button"
                            >
                                OK
                            </Button>

                        </Form.Item>




                    </Form>
                </Modal>
            </div>
        );
    }
}

export default Profile;