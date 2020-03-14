import React, { Component } from 'react';
import 'antd/dist/antd.css';
import './home.css';
import MyTimeline from './../timeline/timeline';
import Upload from '../utilities/uploadImage';
import Login from '../utilities/login';
import Signup from '../utilities/signup';
import { Layout, Menu, Breadcrumb, Button, Row, Col  } from 'antd';
import { UserOutlined} from '@ant-design/icons';


const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
//const { Meta } = Card;


class Home extends Component{
  render(){
   return(
          <Layout >
          <Header className="header"
          style={{ }}
          >
            <div className="logo" />
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
              <Menu.Item style ={{float:"right"}}><Signup/></Menu.Item>
              <Menu.Item style ={{float:"right"}}><Login/></Menu.Item>
              
              
              
              
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
                <MyTimeline/>
                <Upload/>
                <Signup/>
              </Content>
            </Layout>
          </Layout>
        </Layout>
   );
  }
}

export default Home;
