import React, { Component } from 'react';
import 'antd/dist/antd.css';

import { Comment, Avatar, Typography, Card, Layout, Menu, Breadcrumb, Button, Row, Col, AutoComplete, Input  } from 'antd';
import { UserOutlined} from '@ant-design/icons';

const { Title } = Typography;

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
//const { Meta } = Card;


const titleLayout = {
  wrapperCol: {
      span: 14,
      offset: 9,
    },
}

class SearchResults extends Component{
  constructor(){
    super();

    this.state={
        friends: [
            {
              id: "1",
               name: "friend1",
               src: "https://cdn.discordapp.com/attachments/303411519738085377/687179308611272734/16395827_10207611523715511_656645643_n.png",
            },
            {
              id: "2",
              name: "friend2",
              src: "https://cdn.discordapp.com/attachments/303411519738085377/687179308611272734/16395827_10207611523715511_656645643_n.png",
            }
             
        ],

        availableFriends: [
          {
            id: "1",
             name: "friend1",
             src: "https://cdn.discordapp.com/attachments/303411519738085377/687179308611272734/16395827_10207611523715511_656645643_n.png",
          },
          {
            id: "2",
            name: "friend2",
            src: "https://cdn.discordapp.com/attachments/303411519738085377/687179308611272734/16395827_10207611523715511_656645643_n.png",
          },
          {
            id: "3",
             name: "friend3",
             src: "https://cdn.discordapp.com/attachments/303411519738085377/687179308611272734/16395827_10207611523715511_656645643_n.png",
          },
          {
            id: "4",
            name: "friend4",
            src: "https://cdn.discordapp.com/attachments/303411519738085377/687179308611272734/16395827_10207611523715511_656645643_n.png",
          }

        ]
 
    };


}

  render(){
   return(
          <Layout >
            <div className="site-card-wrapper">
              
              <Title level={4} {...titleLayout}>Your Friends</Title>
              
              <Row gutter={16}>
                {this.state.friends.map((friend) =>{
                  return(
                    <Col span={8}>
                      <Card  bordered={false}>
                        <Comment
                          // actions={actions}
                          avatar={
                          <Avatar
                              src={friend.src}
                          />
                          }
                          content={
                          <p>
                              {friend.name}
                          </p>
                          }
                          
                      />
                        
                      </Card>
                    </Col>
                  );
                  
                  })}
              </Row>
              

              <Title level={4} {...titleLayout}>Add Friends</Title>

              <Row gutter={16}>
                {this.state.availableFriends.map((friend) =>{
                  return(
                    <Col span={8}>
                      <Card  bordered={false}>
                        <Comment
                          // actions={actions}
                          avatar={
                          <Avatar
                              src={friend.src}
                          />
                          }
                          content={
                          <p>
                              {friend.name}
                          </p>
                          }
                          
                      />
                        
                      </Card>
                    </Col>
                  );
                  
                  })}
              </Row>
            </div>
        </Layout>
   );
  }
}

export default SearchResults;
