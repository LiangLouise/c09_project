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
  
    return e && e.fileList.slice(-9);
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
        // this.handleSubmit = this.handleSubmit.bind(this);
        this.customSubmit = this.customSubmit.bind(this);
        this.handleSwitch = this.handleSwitch.bind(this);

        
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
        // Get this url from response in real world.
        // let fileList = [...info.fileList];
        // fileList = fileList.slice(-9);

        // fileList = fileList.map(file => {
        //     if (file.response) {
        //       // Component will show file.url as link
        //       file.url = file.response.url;
        //     }
        //     return file;
        //   });

        if (info.file.status === 'uploading'){
            this.setState({loading: true});
            return;
        }
        if (info.file.status === 'done'){
    
            this.state.fileList.push(info.file)
            message.success(`${info.file.name} file uploaded successfully.`);
            this.setState({
                loading: false,
                fileList: this.state.fileList,
   
            });
            console.log("fileList "+this.state.fileList)
        }
        else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    }

    handleSwitch = (e) => {
        console.log("before "+this.state.checked)
        if (this.state.checked){
            let loc = {
                latitude: null,
                longtitude: null
            }
            this.setState({
                location: loc,
                checked: !this.state.checked,
            })
        }
        this.setState({
            checked: !this.state.checked,
        })
        console.log("after "+this.state.checked)
    }

    // handleSubmit = (e) => {
    //     e.preventDefault();
    //     let image = {
    //         title: this.state.title,
    //         author: this.state.author,
    //         description: this.state.description,
    //         imageUrl: this.state.imageUrl,
    //         // location: this.state.location,
    //     }

    //     axios
    //          .post(API_END_POINT+'/api/images', image, {withCredentials: true})
    //          .then(res => {
    //              console.log(res);
    //          })

    // }
    
    customSubmit = () => {

        let data= new FormData();
        for (let i=0; i<this.state.fileList.length; i++){
            data.append('picture', this.state.fileList[i].originFileObj);
        }
        data.append('title', this.state.title);
        data.append('description', this.state.description);
        console.log("data "+data)


        const config= {
            headers: {
                "content-type": "multipart/form-data",
            },
            withCredentials: true
        }
        
        axios
            .post(API_END_POINT+'/api/posts', data, config)
            .then((res) => {
                console.log(res)
        }).catch((err) => {
            console.log(err)
        })
        this.onReset();
    }
    
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
                    {/* <Upload.Dragger name="files" action="/upload.do"> */}
                        <Upload.Dragger 
                        name="picture"
                        onChange={this.handleUpload}
                        customRequest={dummyRequest}
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