import React, { Component } from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Modal, Button,Form, Checkbox,Input,Typography } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';

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


class Signup extends Component {
    constructor(){
        super();
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
        // username: '',
        // password: '',
      });
    };
  
    handleChange = (e) =>
        this.setState({ [e.target.name]: e.target.value });

    handleSubmit = (e) => {
        e.preventDefault();
        let user = {
            username: this.state.username,
            password: this.state.password
        }
        axios
            .post(API_END_POINT+'/signup/', user)
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
  
    render() {
      return (
        <div>
          <Button type="primary" onClick={this.showModal}>
            Sign up
          </Button>
          <Modal
            visible={this.state.visible}
            // onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer = {null}
          >
            <Form
                name="register"
                {...formItemLayout}
                onFinish={this.handleSubmit}
            >
                <Form.Item {...titleLayout}>
                    <Typography>
                        <Title>Register</Title>
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
                    <Input
                    name="username"
                    prefix={<UserOutlined className="site-form-item-icon" />} 
                    placeholder="Username" 
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
                    name="password"
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password"
                    onChange={this.handleChange}
                    value={this.state.password}
                    />
                </Form.Item>

                {/* <Form.Item
                    name="email"
                    rules={[
                    {
                        type: 'email',
                        message: 'The input is not valid E-mail!',
                    },
                    {
                        required: true,
                        message: 'Please input your E-mail!',
                    },
                    ]}
                >
                    <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" />
                </Form.Item> */}

                <Form.Item>
                    <Button 
                    type="primary"
                    htmlType="submit" 
                    className="register-form-button"
                    onClick={this.handleSubmit}>
                    Register
                    </Button>
                    
                </Form.Item>

                <Form.Item>
                    Already an user? <a href="">Login</a>
                </Form.Item>
            

                
            </Form>
          </Modal>
        </div>
      );
    }
  }
  
  export default Signup;