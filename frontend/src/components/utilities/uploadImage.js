import React, { Component } from 'react';

import { Form,
    Select,
    Switch,
    Button,
    Upload,
    Input,
    Typography, } from 'antd';


import { InboxOutlined } from '@ant-design/icons';

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

  const onFinish = values => {
    console.log('Received values of form: ', values);
  };

  const validateMessages = {
    required: 'This field is required!',
    types: {
      email: 'Not a validate email!',
      number: 'Not a validate number!',
    },
    number: {
      range: 'Must be between ${min} and ${max}',
    },
  };

class UploadImage extends Component{
    constructor(){
        super();

        
    }

    
    
    render(){
        return(
            <Form
                name="uploadImage"
                {...formItemLayout}
                onFinish={onFinish}
            >
                <Form.Item {...titleLayout}>
                    <Typography>
                        <Title>Upload Image</Title>
                    </Typography>
                </Form.Item>
                

                <Form.Item label="Select to Upload">
                    <Form.Item name="dragger" valuePropName="fileList" getValueFromEvent={normFile} > 
                    <Upload.Dragger name="files" action="/upload.do">
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
                    <Input />
                </Form.Item>

                <Form.Item name="useLocation" label="Show Location" valuePropName="checked">
                    <Switch />
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                    span: 14,
                    offset: 4,
                    }}
                >
                    <Button type="primary" htmlType="submit">
                    Submit
                    </Button>
                </Form.Item>
            </Form>
        );
        
    }
    
}
export default UploadImage;