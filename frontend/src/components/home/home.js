import React, { Component } from 'react';
import 'antd/dist/antd.css';
import './home.css';
import MyTimeline from './../timeline/timeline';
import Upload from '../utilities/uploadImage';
import Login from '../auth/login';
import Signup from '../auth/signup';
import SearchBar from '../utilities/search';
import Logout from '../auth/Logout';
import { Layout, Menu, Breadcrumb, Button, Row, Col, AutoComplete, Input, Divider } from 'antd';
import cookie from 'react-cookies'

import { UserOutlined} from '@ant-design/icons';
import Logo from './../../Logo.png';
import Icon from './../../Icon.png';


const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
//const { Meta } = Card;



class Home extends Component{
  constructor(){
    super();

    this.state={
      isLoggedIn: (cookie.load('username') !== "" && cookie.load('username') !== undefined)
    };
    this.rightButtons = this.rightButtons.bind(this);
    this.loginHandler = this.loginHandler.bind(this);
  }

  loginHandler() {
    this.setState({isLoggedIn: !this.state.isLoggedIn});
  }

  rightButtons () {
    if (!this.state.isLoggedIn) {
      return <div style={{float:"right"}}>
        <div id="signup" style={{float:"right"}}><Signup action={this.loginHandler}/></div>
        <div id="login" style={{float:"right"}}><Login action={this.loginHandler}/></div>
        <div id="searchbar" style={{float:"right"}}><SearchBar/></div>
      </div>;
    };
    
    return <div style={{float:"right"}}>
      <div id="profile" style={{float:"right"}}><Button ghost={true}>{cookie.load('username')}</Button></div>
      <div id="logout" style={{float:"right"}}><Logout action={this.loginHandler}/></div>
    </div>;  
  }


  render(){
    let buttons = this.rightButtons();

    return(
          <Layout >
          <Header className="header">
            <img className="icon" src={Icon}/>
            <img className="logo" src={Logo}/>
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={['2']}
              style={{ lineHeight: '64px' }}
            >
              <Menu.Item key="1">Home</Menu.Item>
              <Menu.Item key="2">My Timeline</Menu.Item>
              <Menu.Item key="3">Map</Menu.Item>
              <Menu.Item key="4">Upload</Menu.Item>
              
              {/* <div id="signup" style={{float:"right"}}><Signup/></div>
              <div id="login" style={{float:"right"}}><Login/></div>
              <div id="searchbar" style={{float:"right"}}><SearchBar/></div> */}
              
              {buttons}

              {/* <AutoComplete
                  dropdownClassName="certain-category-search-dropdown"
                  dropdownMatchSelectWidth={500}
                  options={{availableFriends}}
                  style={{
                    width: 250,
                  }}
                >
                  <Input.Search size="large" placeholder="input here" />
                </AutoComplete> */}
                
              
              
              
            </Menu>
          </Header>

          <Layout>
            {/* <Sider width={200} className="site-layout-background">
              <Menu
                mode="inline"
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['friends']}
                style={{ height: '100%', borderRight: 0 }}
              >
                <SubMenu
                  key="friends"
                  title={
                    <span>
                      <UserOutlined />
                      Friends
                  </span>
                  }
                >
                  {this.state.friends.map((friend) =>{
                    return(
                      <Menu.Item key={friend.id}>{friend.name}</Menu.Item>
                    );
                    })};
                </SubMenu>

              </Menu>
            </Sider> */}
            <Layout style={{ padding: '0 24px 24px' }}>
              <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>Moments</Breadcrumb.Item>
                <Breadcrumb.Item>My Moments</Breadcrumb.Item>
              </Breadcrumb>
              <Content
                className="site-layout-background"
                style={{
                  padding: 24,
                  margin: 0,
                  minHeight: 280,
                }}
              >
                <Upload/>

                <Divider></Divider>
                <MyTimeline/>
              </Content>
            </Layout>
          </Layout>
        </Layout>
   );
  }
}

export default Home;
