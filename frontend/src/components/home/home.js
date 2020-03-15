import React, { Component } from 'react';
import 'antd/dist/antd.css';
import './home.css';
import MyTimeline from './../timeline/timeline';
import Upload from '../utilities/uploadImage';
import Login from '../utilities/login';
import Signup from '../utilities/signup';
import SearchBar from '../utilities/search';
import SearchResults from '../utilities/searchResults';
import { Layout, Menu, Breadcrumb, Button, Row, Col, AutoComplete, Input  } from 'antd';

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
        friends: [
            {
              id: "1",
               name: "friend1",
            },
            {
              id: "2",
              name: "friend2",
            }
             
        ],

        availableFriends: [
          {
            id: "1",
             name: "friend1",
          },
          {
            id: "2",
            name: "friend2",
          },
          {
            id: "3",
             name: "friend3",
          },
          {
            id: "4",
            name: "friend4",
          }

        ]
 
    };


}

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
                  {this.state.friends.map((friend) =>{
                    return(
                      <Menu.Item key={friend.id}>{friend.name}</Menu.Item>
                    );
                    })};
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
            
                <SearchResults/>
              </Content>
            </Layout>
          </Layout>
        </Layout>
   );
  }
}

export default Home;
