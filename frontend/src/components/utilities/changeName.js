import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies'
//import { geolocated } from "react-geolocated";
import { Form,
    Button,
    Input,
    Typography,
    Modal,
    message } from 'antd';


let username = cookie.load('username');
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


class ChangeName extends React.Component{
    formRef = React.createRef();
    constructor(props){
        super(props)
        this.state = { 
          visible: false,
          previousName: this.props.previousName,
          descriptors: this.props.descriptors,
          newName: null,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    showModal = () => {
        this.setState({ visible: true }); 
    };
  
    onReset = () => {
        this.formRef.current.resetFields();
    }

    handleChange = (e) =>
        this.setState({ [e.target.name]: e.target.value });

    handleSubmit = () => {
        console.log(this.state.descriptors);
        console.log(this.state.newName);
       
        
        let face = {
            "member": {
                name: this.state.newName,
                descriptors: this.state.descriptors
            }
            
        }
        /*
        axios
            .post(process.env.REACT_APP_BASE_URL+'/facedata/', face, {withCredentials: true})
            .then(res => {
                message.success("Ok");
                this.setState({
                    visible: false,
                    previousName: null,
                    descriptors: null,
                    newName: null,
                });
                this.onReset();
                this.props.action();
            })
            .catch(err => {
                message.error(err.response.data);
                this.onReset();
            });
        */
    };

  
    handleCancel = e => {
        this.setState({ visible: false });
        this.onReset();
    };

    render(){
        return(
            <div>
            <Button 
              type="default" 
              onClick={this.showModal}
              ghost={true}>
                {this.state.previousName}
            </Button>
            <Modal
                visible={this.state.visible}
                // onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={null}
            >
              <Form
                  name="change"
                  ref={this.formRef}
                  {...formItemLayout}
                  onFinish={this.handleSubmit}
              >
                  <Form.Item {...titleLayout}>
                      <Typography>
                          <Title>Change This Name</Title>
                      </Typography>
                  </Form.Item>

                  <Form.Item
                      name="name_item"
                      rules={[
                      {
                          required: true,
                          message: 'Please input the desired name!',
                      },
                      ]}
                  >
                      <Input 
                      placeholder="New name" 
                      name="newName"
                      value={this.state.newName}
                      onChange={this.handleChange}/>
                  </Form.Item>

                  <Form.Item>
                      <Button type="primary" 
                      htmlType="submit" 
                      className="change-name-button"
                      >
                      Submit
                      </Button>
                      
                  </Form.Item>
              </Form>
              </Modal>
              </div>
        );
        
    }
    
}
export default ChangeName;