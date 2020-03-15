import React, { Component } from 'react';

import { Divider, Row, Col, Comment, Tooltip, Avatar, Card, Layout, Input, Form, Button} from 'antd';
import moment from 'moment';
import { MessageOutlined} from '@ant-design/icons';


const { Meta } = Card;
const {Content} = Layout;

const onFinish = values => {
    
    console.log('Success:', values);
  };

  const formItemLayout = {
    wrapperCol: {
        span: 24,
        }
    
};

class MyTimeline extends Component{
    constructor(){
        super();

        this.state={
            posts: [
                {
                    src: "https://media.discordapp.net/attachments/303411519738085377/683448614835585057/unknown.png?width=1194&height=672",
                    title: "Title",
                    description: "Author",
                    date: "2017",
                    comments:[
                        {
                            src: "https://cdn.discordapp.com/attachments/303411519738085377/687180087891984410/16128483_10207514720855500_495867723_n.png",
                            content: "so funny lol"
                        }
                    ]
                },
                {
                    src: "https://cdn.discordapp.com/attachments/303411519738085377/687179308611272734/16395827_10207611523715511_656645643_n.png",
                    title: "when the corona merch sells",
                    description: "zerojaw",
                    date: "2019",
                    comments:[
                        {
                            src: "https://cdn.discordapp.com/attachments/303411519738085377/687166367929073727/20517284_1384331048330396_573196050_o.png",
                            content: "yum yum"
                        }
                    ]
                },
            ]

            
        };
    }
    
    render(){
        return(
            <div className="timeline">
                {this.state.posts.map((post) =>{
                    return(
                        <Row>
                        <Col span={2}>{post.date}</Col>
                        <Col span={10}>
                        <Card
                            hoverable
                            //style={{ width: 300 }}
                            cover={<img alt="example" src={post.src}/>}
                        >
                            <Meta title={post.title} description={post.description} />
                        </Card>
                        </Col>
                        <Col span={12}>
                            <Content>
                                {post.comments.map((comment) =>{
                                    return(
                                        <Comment
                                    // actions={actions}
                                    author={<a>user</a>}
                                    avatar={
                                    <Avatar
                                        src={comment.src}
                                        alt="Han Solo"
                                    />
                                    }
                                    content={
                                    <p>
                                        {comment.content}
                                    </p>
                                    }
                                    datetime={
                                    <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                                        <span>{moment().fromNow()}</span>
                                    </Tooltip>
                                    }
                                />
                                    )
                                })}
                                <Form
                                    name="login"
                                    {...formItemLayout}
                                    onFinish={onFinish}
                                >
                                    <Form.Item name="comment">
                                        <Input.TextArea placeholder="Write a comment..."/>
                                    </Form.Item>

                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" className="comment-form-button">
                                            Submit
                                        </Button>
                                    </Form.Item>
                                    
                                </Form>
                            </Content>
                        </Col>
                        <Divider></Divider>
                        </Row>
                    ); 
                })}
            </div>
        );    
    } 
}
export default MyTimeline;