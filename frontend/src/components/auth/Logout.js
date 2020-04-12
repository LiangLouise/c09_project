import React, { Component } from 'react';
import axios from 'axios';
import { Form, Button, Modal, message } from 'antd';


class Logout extends React.Component{
    constructor(props){
        super(props)
        this.state = { 
          isLoggedIn: true
        };
        this.onClick = this.onClick.bind(this);
    }

    onClick = () => {
        axios.get(process.env.REACT_APP_BASE_URL+'/signout', {withCredentials: true})
            .then((res) => {
                message.success("See You Next Time");
                this.setState({
                    isLoggedIn: false
                });
                this.props.action();
            })
            .catch(err => {
                message.error(err.response.data.error);
            });
        
    };

    render(){
        return(
            <Button 
              type="default" 
              onClick={this.onClick}
              ghost={true}>
                Log Out
            </Button>
        );
        
    }
    
}
export default Logout;