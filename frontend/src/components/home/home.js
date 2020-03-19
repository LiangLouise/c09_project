import React, { Component } from 'react';
import 'antd/dist/antd.css';
import './home.css';
import MyTimeline from './../timeline/timeline';
import Upload from '../utilities/uploadImage';
import Login from '../auth/login';
import Signup from '../auth/signup';
import SearchBar from '../utilities/search';
import Logout from '../auth/Logout';
import { Layout, Menu, Button, Empty, Divider } from 'antd';
import cookie from 'react-cookies'

import { UserOutlined} from '@ant-design/icons';
import Logo from './../../Logo.png';
import Icon from './../../Icon.png';
import axios from 'axios';


const { SubMenu } = Menu;
const { Header, Content, Footer, Sider, Breadcrumb } = Layout;
//const { Meta } = Card;



class Home extends Component{
  constructor(){
    super();

    this.state={
      isLoggedIn: (cookie.load('username') !== "" && cookie.load('username') !== undefined),
      refreshTimeline: false,
      refreshFriend: false,
      friends: [],
    };
    this.menu = this.menu.bind(this);
    this.subMenu = this.subMenu.bind(this);
    this.content = this.content.bind(this);
    this.loginHandler = this.loginHandler.bind(this);
    this.refreshTimeLine = this.refreshTimeLine.bind(this);
    this.refreshFriend = this.refreshFriend.bind(this);

  
  }

  componentDidMount() {
    this.getFriendList();
  }
  
  loginHandler() {
    this.setState({isLoggedIn: !this.state.isLoggedIn});
  }

  refreshTimeLine() {
    console.log('Ask to refresh timeline');
    this.setState({refreshTimeline: true});
  }

  refreshFriend() {
    console.log('Ask to refresh friend');
    this.setState({refreshFriend: true});
  }

  menu() {
    if (!this.state.isLoggedIn) {
      return(
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={['1']}
              style={{ lineHeight: '64px' }}
            >
              <Menu.Item key="1"></Menu.Item>
              <Menu.Item key="2"></Menu.Item>
              <Menu.Item key="3"></Menu.Item>
              <div style={{float:"right"}}>
              <div id="signup" style={{float:"right"}}><Signup/></div>
              <div id="login" style={{float:"right"}}><Login action={this.loginHandler}/></div>
            </div>
      </Menu>)
    };
    
    return (
      <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={['1']}
              style={{ lineHeight: '64px' }}
            >
              <Menu.Item key="1">Home</Menu.Item>
              <Menu.Item key="2">My Timeline</Menu.Item>
              <Menu.Item key="3">Map</Menu.Item>
              <div style={{float:"right"}}>
              <div id="profile" style={{float:"right"}}><Button ghost={true}>{cookie.load('username')}</Button></div>
              <div id="logout" style={{float:"right"}}><Logout action={this.loginHandler}/></div>
              <div id="searchbar" style={{float:"right"}}><SearchBar refresh={this.refreshFriend}/></div>
              </div>
      </Menu>
    );  
  }

  getFriendList () {
    if (this.state.isLoggedIn){
      axios.get(process.env.REACT_APP_BASE_URL+'/api/profile?username='+cookie.load('username'),
                {withCredentials:true})
            .then(res =>{
              this.setState({
                friends: res.data.following_ids,
                refreshFriend: false,
              })
            })
    }
    console.log("line 119 listening " +this.state.friends)
  }

  subMenu () {
    if (this.state.isLoggedIn){
      if (this.state.refreshFriend) {
        this.getFriendList();
      }
      let friendList = []
    for (let i=0; i<this.state.friends.length;i++){
      friendList.push(<Menu.Item key={(i+1).toString()}>{this.state.friends[i]}</Menu.Item>)
    }
    return (
      <Sider width={200} className="site-layout-background">
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['FriendList']}
          style={{ height: '100%', borderRight: 0 }}
        >
          <SubMenu
            key="FriendList"
            title={
              <span>
                <UserOutlined />
                Friends
              </span>
            }
          >
            {friendList}
          </SubMenu>
        </Menu>
      </Sider>
    )
    }
  }

  content (){
    if (!this.state.isLoggedIn) {
      return (
        <Content
          className="site-layout-background"
          style={{
          padding: 24,
          margin: 0,
          minHeight: 525,
          }}
        >
          <Empty 
            description="Please Login to Create & View Moments :)" 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            imageStyle={{
              height: 250
            }}
            />
        </Content>
      )
    }
    return (
      
      <Content
        className="site-layout-background"
        style={{
        padding: 24,
        margin: 0,
        // minHeight: 280,
        }}
      >
        <Upload refresh={this.refreshTimeLine}/>
        <Divider></Divider>
        <MyTimeline refresh={this.state.refreshTimeline}/>
      </Content>)
  }


  render(){
    let menu = this.menu();
    let content = this.content();
    let submenu = this.subMenu();

    return(
          <Layout >
          <Header className="header">
            <img className="icon" src={Icon}/>
            <img className="logo" src={Logo}/>
            {menu}
          </Header>

            <Layout style={{ padding: '50px 50px 0px 50px' }}>
            {submenu}
            {content}
            </Layout>

          <Footer style={{ textAlign: 'center' }}>Moment ©2020 Created by Team Random Star</Footer>
        </Layout>
   );
  }
}

export default Home;
