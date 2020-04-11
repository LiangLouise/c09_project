import React, { Component } from 'react';
import axios from 'axios';
import Login from '../auth/login';
import 'antd/dist/antd.css';
import './signup.css';
import { Modal, Button,Form, Checkbox,Input,Typography, message } from 'antd';
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


class Signup extends React.Component {
    formRef = React.createRef();
    constructor(props){
        super(props);
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
  
    onReset = () => {
        this.formRef.current.resetFields();
    }

    handleChange = (e) =>
        this.setState({ [e.target.name]: e.target.value });

    handleSubmit = () => {
        let user = {
            username: this.state.username,
            password: this.state.password
        }
        axios
            .post(process.env.REACT_APP_BASE_URL+'/signup/', user, {withCredentials: true})
            .then(res => {
                message.success("Welcome! Please Sign In.");
                this.setState({ visible: false});
                this.onReset();
            }).catch(err => {
                message.error(err.response.data.error);
                this.onReset();
            });
        
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
                ref={this.formRef}
            >
                <Form.Item {...titleLayout}>
                    <Typography>
                        <Title>Signup</Title>
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



                <Form.Item>
                    <Button 
                    type="primary"
                    htmlType="submit" 
                    className="register-form-button"
                    >
                    Signup
                    </Button>
                    
                </Form.Item>

                <Form.Item>
                    Already an user?
                    <div className="Login" onClick={this.handleCancel}><Login/></div>
                </Form.Item>
            

                
            </Form>
          </Modal>
        </div>
      );
    }
  }
  
  export default Signup;