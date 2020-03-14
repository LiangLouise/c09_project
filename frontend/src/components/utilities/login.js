import React, { Component } from 'react';

import { Form,
    Button,
    Checkbox,
    Input,
    Typography, } from 'antd';

import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Title } = Typography;
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

  const onFinish = values => {
    console.log('Success:', values);
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

class Login extends Component{
    

    constructor(){
        super();

        
    }

    
    
    render(){
        return(
            <Form
                name="login"
                {...formItemLayout}
                onFinish={onFinish}
            >
                <Form.Item {...titleLayout}>
                    <Typography>
                        <Title>Login</Title>
                    </Typography>
                </Form.Item>

                <Form.Item
                    name="username"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your Username!',
                    },
                    ]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your Password!',
                    },
                    ]}
                >
                    <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password"
                    />
                </Form.Item>
                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Remember me</Checkbox>
                    </Form.Item>


                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                    Log in
                    </Button>
                    
                </Form.Item>

                <Form.Item>
                    Or <a href="">Register</a>
                </Form.Item>
            

                
            </Form>
        );
        
    }
    
}
export default Login;