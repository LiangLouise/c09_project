import React, { Component } from 'react';
import './timeline.css';
import 'antd/dist/antd.css';
import { Divider, Row, Col, Comment, Tooltip, Avatar, Card, Layout, Input, Form, Button, Carousel} from 'antd';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll-component';
import { MessageOutlined} from '@ant-design/icons';
import Image from '../utilities/image';
import axios from 'axios';
import cookie from 'react-cookies'



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

const style = {
    height: 30,
    border: "1px solid green",
    margin: 6,
    padding: 8
  };

  let username = cookie.load('username');

class MyTimeline extends Component{
    constructor(){
        super();

        this.state={
            page: 0,
            posts: [],
            comments: [],
            items: Array.from({ length: 20 })
            
        };
    }
    fetchData = () => {
        let data = []
        let temp = {}
        axios
            .get(process.env.REACT_APP_BASE_URL+
            '/api/posts/?username='+username+'&page='+this.state.page,
            {withCredentials: true})
            .then(res =>{
                for (let i=0; i< res.data.length;i++){
                    console.log(res.data[i])
                    temp = {
                        'title': res.data[i].title,
                        'description': res.data[i].dis,
                        'pictures': res.data[i].pictures,
                        'date': Date(res.data[i].time) ,
                    }
                    data.push(temp)
                }   
                this.setState({
                    posts: this.state.posts.concat(JSON.parse(JSON.stringify(data))),
                    page: this.state.page+1
                })
            });
            
        console.log(this.state.posts)
    }
    fetchMoreData = () => {
        // a fake async api call like which sends
        // 20 more records in 1.5 secs
        setTimeout(() => {
            console.log(this.state.page)
            this.fetchData();
        }, 1500);
        console.log(this.state.posts)
    };
    
    render(){
        return(
            <div className="timeline">
                <InfiniteScroll
                    dataLength={this.state.posts.length}
                    next={this.fetchMoreData}
                    hasMore={true}
                    style={this.style}
                    loader={<h4>Loading...</h4>}
                >
                    {this.state.posts.map((post) => (
                        <Row>
                        <Col span={2}>{post.date}</Col>
                        <Col span={10}>
                            <Card
                                hoverable
                                
                                cover={<Carousel dotPosition="top">
                                <div>
                                    <img src= "https://media.discordapp.net/attachments/303411519738085377/683448614835585057/unknown.png?width=1194&height=672"/>
                                </div>
                                <div>
                                    <img src= "https://cdn.discordapp.com/attachments/303411519738085377/687179308611272734/16395827_10207611523715511_656645643_n.png"/>
                                </div>
                                <div>
                                    <img src ="https://cdn.discordapp.com/attachments/303411519738085377/687166367929073727/20517284_1384331048330396_573196050_o.png"/>
                                </div>
                            </Carousel>}
                            >
                                <Meta 
                                title={post.title}
                                avatar={<Avatar
                                    src={"https://cdn.discordapp.com/attachments/303411519738085377/687166367929073727/20517284_1384331048330396_573196050_o.png"}
                                    alt="Han Solo"
                                    />}
                                description={post.description} />
                            </Card>
                            
                        </Col>
                        <Col span={12}>
                            {/* <Content>
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
                            </Content> */}
                        </Col>
                        <Divider></Divider>
                        </Row>
                    ))}
                </InfiniteScroll>
                   
           
            </div>
        );    
    } 
}
export default MyTimeline;