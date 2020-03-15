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

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

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
  
    return e && e.fileList;
  };

const API_END_POINT = "http://localhost:5000"

const onFinish = values => {
    console.log('Received values of form: ', values);
  };


class UploadImage extends Component{
    constructor(){
        super();
        this.state = { 
            loading: false,
            title: '',
            author: '',
            description: '',
            imageUrl: '',
            // location: {
            //     latitude: null,
            //     longtitude: null,
            // },
        };
        this.handleSubmit = this.handleSubmit.bind(this);

        
    }

    handleUpload = info =>{
        if (info.file.status === 'uploading'){
            this.setState({loading: true});
            return;
        }
        if (info.file.status === 'done'){
            // Get this url from response in real world.
            message.success(`${info.file.name} file uploaded successfully.`);
            getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                imageUrl,
                loading:false,
                }),
            );
            
        }
        else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    }

    handleChange = (e) =>
        this.setState({ [e.target.name]: e.target.value });

    handleSubmit = (e) => {
        e.preventDefault();
        let image = {
            title: this.state.title,
            author: this.state.author,
            description: this.state.description,
            imageUrl: this.state.imageUrl,
            // location: this.state.location,
        }
        console.log("image "+ image.imageUrl)
        axios
             .post(API_END_POINT+'/api/images', image)
             .then(res => {
                 console.log(res);
             })

    }
    
    
    render(){
        return(
            <Form
                name="uploadImage"
                {...formItemLayout}
                onFinish={this.handleSubmit}
            >
                <Form.Item {...titleLayout}>
                    <Typography>
                        <Title>New Moment</Title>
                    </Typography>
                </Form.Item>
                

                <Form.Item label="Select to Upload">
                    <Form.Item name="dragger" valuePropName="fileList" getValueFromEvent={normFile} > 
                    {/* <Upload.Dragger name="files" action="/upload.do"> */}
                        <Upload.Dragger 
                        name="files"
                        onChange={this.handleUpload}
                        action='https://www.mocky.io/v2/5cc8019d300000980a055e76'>
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
                    name="Description"
                    placeholder="Description" 
                    value={this.state.description}
                    onChange={this.handleChange}/>
                </Form.Item>

                <Form.Item name="useLocation" label="Show Location" valuePropName="checked">
                    <Switch 
                    name="Location"/>
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                    span: 14,
                    offset: 4,
                    }}
                >
                    <Button 
                    type="primary" 
                    htmlType="submit"
                    onClick={this.handleSubmit}>
                    Submit
                    </Button>
                </Form.Item>
            </Form>
        );
        
    }
    
}
export default UploadImage;