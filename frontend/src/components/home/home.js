import React, { Component } from 'react';
import 'antd/dist/antd.css';
import './home.css';
import MyTimeline from './../timeline/timeline';
import Upload from '../utilities/uploadImage';
import Login from '../auth/login';
import Signup from '../auth/signup';
import Profile from '../profile/profile';
import SearchBar from '../utilities/search';
import Logout from '../auth/Logout';
import FaceData from "../faceData/faceData";
import Map from '../map/map';
import ImgEditor from "../imgeditor/imgeditor";
import { Layout, Menu, Button, Empty, Divider, message } from 'antd';
import cookie from 'react-cookies'

import { UserOutlined} from '@ant-design/icons';
import Logo from './../../Logo.png';
import Icon from './../../Icon.png';
import axios from 'axios';
import FollowingTimeline from "../timeline/followingTimeline";


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
      currentPage: "1"
    };
    this.menu = this.menu.bind(this);
    this.subMenu = this.subMenu.bind(this);
    this.content = this.content.bind(this);
    this.loginHandler = this.loginHandler.bind(this);
    this.refreshTimeLine = this.refreshTimeLine.bind(this);
    this.refreshFriend = this.refreshFriend.bind(this);
    this.updatePage = this.updatePage.bind(this);
    this.getFriendList = this.getFriendList.bind(this);
  }

  componentDidMount() {
    this.getFriendList();
  }


  updatePage(e) {
    this.setState({currentPage: e.key});
  }
  
  loginHandler() {
    this.setState({
                    isLoggedIn: !this.state.isLoggedIn,
                    });
  }

  refreshTimeLine() {
    this.setState({refreshTimeline: true});
  }

  refreshFriend() {
    this.setState({refreshFriend: true});
  }

  menu() {
    if (!this.state.isLoggedIn) {
      return(
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={['1']}
              className="menu"
            >
              <Menu.Item key="1"/>
              <Menu.Item key="2"/>
              <Menu.Item key="3"/>
              <Menu.Item key="4"/>
              <div className="menu-item" >
              <div className="menu-item" id="signup" ><Signup/></div>
              <div className="menu-item" id="login" ><Login refresh={this.refreshFriend} action={this.loginHandler}/></div>
            </div>
      </Menu>)
    }
    
    return (
      <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={['1']}
              className="menu"
            >
              <Menu.Item key="1" onClick={this.updatePage}>Following</Menu.Item>
              <Menu.Item key="2" onClick={this.updatePage}>My Timeline</Menu.Item>
              <Menu.Item key="3" onClick={this.updatePage}>Map</Menu.Item>
              <Menu.Item key="4" onClick={this.updatePage}>FaceData</Menu.Item>

              <div className="menu-item" >
              <div className="menu-item" id="profile" ><Profile/></div>
              <div className="menu-item" id="logout" ><Logout action={this.loginHandler}/></div>
              <div className="menu-item" id="searchbar" ><SearchBar refresh={this.refreshFriend}/></div>
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
  }

  subMenu () {
    if (this.state.isLoggedIn){
      if (this.state.refreshFriend) {
        this.getFriendList();
      }
      let friendList = [];
    for (let i=0; i<this.state.friends.length;i++){
      friendList.push(<Menu.Item key={(i+1).toString()}>{this.state.friends[i]}</Menu.Item>)
    }
    return (
      <Sider width={200} className="site-layout-background">
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['FriendList']}
          className="sider-menu"
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
    } return <div/>;
  }

  content (){
    if (!this.state.isLoggedIn) {
      return (
        <Content
          className="site-layout-background"
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

    if (this.state.currentPage === "2"){
      return (

          <Content
              className="site-layout-background"
          >
            <Upload refresh={this.refreshTimeLine}/>
            <Divider/>
            <MyTimeline refresh={this.state.refreshTimeline}/>
          </Content>);
      }
    if (this.state.currentPage === "1") {
      return (

          <Content
              className="site-layout-background"
          >
            <Upload refresh={this.refreshTimeLine}/>
            <Divider/>
            <FollowingTimeline refresh={this.state.refreshTimeline}/>
          </Content>);

    }

    else if (this.state.currentPage === "3") {
      message.info("You can see up to 25 markers each represents the location where your friend took the pictures!")
        return (
            <Content
                className="site-layout-background"
            >
              <Map/>
            </Content>);

    }
    else if (this.state.currentPage === "4") {
      return (
          <Content
              className="site-layout-background"
          >
            <FaceData/>
          </Content>);

    }

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

            <Layout className="layout">
            {submenu}
            {content}
            </Layout>

          <Footer className="footer">Moment ©2020 Created by Team Random Star</Footer>
        </Layout>
   );
  }
}

export default Home;
