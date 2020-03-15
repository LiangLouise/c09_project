import React, { Component } from 'react';
import axios from 'axios';
import { Form,
    Button,
    Checkbox,
    Input,
    Typography,
    Modal } from 'antd';

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

const API_END_POINT = "http://localhost:5000"

class Login extends Component{
    
  constructor(){
    super()
    this.state = { 
      visible: false,
      username: '',
      password: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  

  showModal = () => {
    this.setState({
        visible: true,
      });
      
    };
  
    // handleOk = e => {
    //   console.log(e);
    //   this.setState({
    //     visible: false,
    //   });
    // };

    handleChange = (e) =>
        this.setState({ [e.target.name]: e.target.value });

    handleSubmit = (e) => {
        e.preventDefault();
        let user = {
            username: this.state.username,
            password: this.state.password
        }
        axios
            .post(API_END_POINT+'/signin/', user)
            .then(res => {
                console.log(res);
            });
        this.setState({
            visible: false,
        });
    }
  
    handleCancel = e => {
      console.log(e);
      this.setState({
        visible: false,
      });
    };

    
    
    render(){
        return(
            <div>
          <Button type="default" onClick={this.showModal}>
            Log in
          </Button>
          <Modal
            visible={this.state.visible}
            // onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={null}
          >
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
                    name="username_item"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your Username!',
                    },
                    ]}
                >
                    <Input prefix={<UserOutlined 
                    className="site-form-item-icon" />} 
                    placeholder="Username" 
                    name="username"
                    value={this.state.username}
                    onChange={this.handleChange}/>
                </Form.Item>

                <Form.Item
                    name="password_item"
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
                    name="password"
                    value={this.state.password}
                    onChange={this.handleChange}
                    />
                </Form.Item>
                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Remember me</Checkbox>
                    </Form.Item>


                </Form.Item>

                <Form.Item>
                    <Button type="primary" 
                    htmlType="submit" 
                    className="login-form-button"
                    onClick={this.handleSubmit}>
                    Log in
                    </Button>
                    
                </Form.Item>

                <Form.Item>
                    Or <a href="">Register</a>
                </Form.Item>
            </Form>
            </Modal>
            </div>
        );
        
    }
    
}
export default Login;