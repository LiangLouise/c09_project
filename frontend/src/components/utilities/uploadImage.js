import React, { Component } from 'react';
import axios from 'axios';
import { Form,
    Select,
    Switch,
    Button,
    Upload,
    Input,
    Typography,
    message, } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';




const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;
const formItemLayout = {
    labelCol: {
        span: 4,
      },
  wrapperCol: {
    span: 14,
  },
};

const buttonLayout = {
    wrapperCol: {
        span: 14,
        offset: 4,
        }
}
const titleLayout = {
    wrapperCol: {
        span: 14,
        offset: 9,
      },
}

const normFile = e => {
    console.log('Upload event:', e);
  
    if (Array.isArray(e)) {
      return e;
    }
  
    return e && e.fileList.slice(-process.env.REACT_APP_MAX_POST_PICTURE_NUMBER);
  };

const API_END_POINT = process.env.REACT_APP_BASE_URL;

// const onFinish = values => {
//     console.log('Received values of form: ', values);
//   };


class UploadImage extends React.Component{
    formRef = React.createRef();
    constructor(props){
        super(props);
        this.state = { 
            loading: false,
            title: '',
            description: '',
            fileList: [],
            file: null,
            checked: false,
            location: {
                latitude: null,
                longtitude: null,
            },
        };
        this.customSubmit = this.customSubmit.bind(this);
        this.handleSwitch = this.handleSwitch.bind(this);
        this.removeFile = this.removeFile.bind(this);
        
    }

    onReset = () => {
        this.formRef.current.resetFields();
        this.setState({
            fileList:[],
        })
    }


    handleChange = (e) =>
        this.setState({ [e.target.name]: e.target.value });


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

    handleSwitch = (e) => {
        if (this.state.checked){
            let loc = {
                latitude: null,
                longtitude: null
            };
            this.setState({
                location: loc,
                checked: !this.state.checked,
            });
        }
        this.setState({
            checked: !this.state.checked,
        });
    };
    
    customSubmit = () => {

        let data= new FormData();
        for (let i=0; i<this.state.fileList.length; i++){
            data.append('picture', this.state.fileList[i].originFileObj);
        }
        if (this.state.title.length > process.env.REACT_APP_MAX_POST_TITLE_LENGTH){
            message.error("title must be less than 30 characters");
            return;
        }else{
            data.append('title', this.state.title);
        }
        if (this.state.description.length > process.env.REACT_APP_MAX_POST_DES_LENGTH){
            message.error("description must be less than 200 characters");
            return;
        }else{
            data.append('description', this.state.description);
        }

        const config= {
            headers: {
                "content-type": "multipart/form-data",
            },
            withCredentials: true
        };
        
        axios
            .post(API_END_POINT+'/api/posts', data, config)
            .then((res) => {
                message.success("The Post is sent");
                this.props.refresh();
            }).catch((err) => {
                message.error(err.response.data);
            });
        this.onReset();
    };
    
    render(){
        return(
            <Form
                ref={this.formRef}
                name="uploadImage"
                {...formItemLayout}
                onFinish={this.customSubmit}
            >
                <Form.Item {...titleLayout}>
                    <Typography>
                        <Title>New Moment</Title>
                    </Typography>
                </Form.Item>
                

                <Form.Item label="Select to Upload">
                    <Form.Item name="Images" 
                    valuePropName="fileList" 
                    getValueFromEvent={normFile}
                    rules={[
                        {
                            required: true,
                        },
                        ]}> 
                        <Upload.Dragger 
                        name="picture"
                        onChange={this.handleUpload}
                        customRequest={dummyRequest}
                        onRemove={this.removeFile}
                        fileList={this.state.fileList}
                        withCredentials={true}
                        multiple={true}>
                        <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">It's very easy</p>
                    </Upload.Dragger>
                    </Form.Item>
                </Form.Item>

                <Form.Item 
                    name={['Title']}
                    label="Title"
                    {...formItemLayout}
                    rules={[
                    {
                        required: true,
                    },
                    ]}
                >
                    <Input 
                    name="title"
                    placeholder="Title" 
                    value={this.state.title}
                    onChange={this.handleChange}
                    />
                </Form.Item>

                <Form.Item 
                    name={['Description']}
                    label="Description"
                    {...formItemLayout}
                    rules={[
                    {
                        required: true,
                    },
                    ]}
                >
                    <TextArea 
                    name="description"
                    placeholder="Description" 
                    value={this.state.description}
                    onChange={this.handleChange}/>
                </Form.Item>

                <Form.Item 
                    name="useLocation" 
                    label="Show Location" 
                    valuePropName="checked">
                    <Switch 
                    name="Location"
                    onChange={this.handleSwitch}/>
                </Form.Item>

                <Form.Item
                    {...buttonLayout}
                >
                    <Button 
                    type="primary" 
                    htmlType="submit"
                    >
                    Submit
                    </Button>
                </Form.Item>
            </Form>
        );
        
    }
    
}
export default UploadImage;