import React, { Component } from 'react';
import 'antd/dist/antd.css';
import './home.css';
import moment from 'moment';
import { Divider, Row, Col, Comment, Tooltip, Avatar, Card, Layout, Menu, Breadcrumb } from 'antd';
import { UserOutlined} from '@ant-design/icons';


const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const { Meta } = Card;


class Home extends Component{
  render(){
   return(
          <Layout>
          <Header className="header">
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
                  <Menu.Item key="1">Friend1</Menu.Item>
                  <Menu.Item key="2">Friend2</Menu.Item>
                  <Menu.Item key="3">Friend3</Menu.Item>
                  <Menu.Item key="4">Friend4</Menu.Item>
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
                <Row>
                  <Col span={2}>2019</Col>
                  <Col span={10}>
                    <Card
                      hoverable
                      //style={{ width: 300 }}
                      cover={<img alt="example" src="https://media.discordapp.net/attachments/303411519738085377/683448614835585057/unknown.png?width=1194&height=672" />}
                    >
                      <Meta title="Title" description="Author" />
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Content>
                      <Comment
                        // actions={actions}
                        author={<a>user</a>}
                        avatar={
                          <Avatar
                            src="https://cdn.discordapp.com/attachments/303411519738085377/687180087891984410/16128483_10207514720855500_495867723_n.png"
                            alt="Han Solo"
                          />
                        }
                        content={
                          <p>
                            so funi lol
                          </p>
                        }
                        datetime={
                          <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                            <span>{moment().fromNow()}</span>
                          </Tooltip>
                        }
                      />
                    </Content>
                  </Col>
                </Row>
                <Divider></Divider>
                <Row>
                  <Col span={2}>2017</Col>
                  <Col span={10}>
                  <Card
                    hoverable
                    //style={{ width: 300 }}
                    cover={<img alt="example" src="https://cdn.discordapp.com/attachments/303411519738085377/687179308611272734/16395827_10207611523715511_656645643_n.png" />}
                  >
                    <Meta title="when the corona merch sells" description="zerojaw" />
                  </Card>
                  </Col>
                  <Col span={12}>
                    <Content>
                      <Comment
                        // actions={actions}
                        author={<a>user</a>}
                        avatar={
                          <Avatar
                            src="https://cdn.discordapp.com/attachments/303411519738085377/687166367929073727/20517284_1384331048330396_573196050_o.png"
                            alt="Han Solo"
                          />
                        }
                        content={
                          <p>
                            yummy
                          </p>
                        }
                        datetime={
                          <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                            <span>{moment().fromNow()}</span>
                          </Tooltip>
                        }
                      />
                      <Comment
                        // actions={actions}
                        author={<a>yomama6935</a>}
                        avatar={
                          <Avatar
                            src="https://cdn.discordapp.com/attachments/303411519738085377/687166367929073727/20517284_1384331048330396_573196050_o.png"
                            alt="Han Solo"
                          />
                        }
                        content={
                          <p>
                            yummy
                          </p>
                        }
                        datetime={
                          <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                            <span>{moment().fromNow()}</span>
                          </Tooltip>
                        }
                      />
                    </Content>
                  </Col>
                  </Row>
              </Content>
            </Layout>
          </Layout>
        </Layout>
   );
  }
}

export default Home;
