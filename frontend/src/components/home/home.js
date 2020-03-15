import React, { Component } from 'react';
import 'antd/dist/antd.css';
import './home.css';
import MyTimeline from './../timeline/timeline';
import Upload from '../utilities/uploadImage';
import Login from '../utilities/login';
import Signup from '../utilities/signup';
import SearchBar from '../utilities/search';
import { Layout, Menu, Breadcrumb, Button, Row, Col, Divider  } from 'antd';
import { UserOutlined} from '@ant-design/icons';
import Logo from './../../Logo.png';
import Icon from './../../Icon.png';


const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
//const { Meta } = Card;


class Home extends Component{
  render(){
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
              
              <div className="signup" style={{float:"right"}}><Signup/></div>
              <div className="login" style={{float:"right"}}><Login/></div>
              <div className="searchbar" style={{float:"right"}}><SearchBar/></div>

              
              
              
              
            </Menu>
          </Header>

          <Layout>
            <Sider width={200} className="site-layout-background">
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
                  <Menu.Item key="friend1">Friend1</Menu.Item>
                  <Menu.Item key="friend12">Friend2</Menu.Item>
                  <Menu.Item key="friend13">Friend3</Menu.Item>
                  <Menu.Item key="friend14">Friend4</Menu.Item>
                </SubMenu>

              </Menu>
            </Sider>
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
