import React, { Component } from 'react';
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


class Signup extends Component {
    state = { visible: false };
  
    showModal = () => {
      this.setState({
        visible: true,
      });
    };
  
    handleOk = e => {
      console.log(e);
      this.setState({
        visible: false,
      });
    };
  
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
            title="Basic Modal"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <Form
                name="register"
                {...formItemLayout}
                onFinish={onFinish}
            >
                <Form.Item {...titleLayout}>
                    <Typography>
                        <Title>Register</Title>
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

                <Form.Item
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
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="register-form-button">
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