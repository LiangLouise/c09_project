import React, { Component } from 'react';
import './timeline.css';
import 'antd/dist/antd.css';
import { Divider, Row, Col, Comment, Tooltip, Avatar, Card, Layout, Input, Form, Button, Carousel, Spin, message} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import cookie from 'react-cookies'
import TimeAgo from 'react-timeago'
import englishStrings from 'react-timeago/lib/language-strings/en'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'

const { Meta } = Card;
const {Content} = Layout;

const formatter = buildFormatter(englishStrings)

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
const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const MAX_POSTS_NUMBER_PER_PAGE = 10;

class FollowingTimeline extends Component{
    formRef = React.createRef();
    constructor(props){
        super(props);

        this.state={
            isLoggedIn: (cookie.load('username') !== "" && cookie.load('username') !== undefined),
            comment: '',
            page: 0,
            posts: [],
            comments: [],
            items: Array.from({ length: 20 }),
            hasMorePost: true,
            hasMoreCmt: true,
            postCount: 0,

        };
        this.sendComment = this.sendComment.bind(this);
        this.fetchData = this.fetchData.bind(this);

    }

    onReset = () => {
        this.formRef.current.resetFields();
    };

    handleChange = (e) =>
        this.setState({ [e.target.name]: e.target.value });

    componentDidMount() {
        this.setState({page: this.state.page});
        this.fetchData();
        //this.getPostCount();
    }

    getPostCount = () => {
        if (this.state.isLoggedIn){
            axios
                .get(process.env.REACT_APP_BASE_URL+'/api/profile?username='+cookie.load('username'),
                    {withCredentials: true})
                .then(res =>{
                    console.log(res.data)
                })
        }

    };

    componentWillReceiveProps(props) {
        if (props.refresh) {
            this.fetchData(true);
        }
    }

    fetchData = (fromFirst) => {
        let data = [];
        let temp = {};
        let page;

        if (fromFirst) page = 0;
        else page = this.state.page;

        axios
            .get(process.env.REACT_APP_BASE_URL+
                '/api/posts/following/?page='+page,
                {withCredentials: true})
            .then(res =>{
                let newPostsNum = this.state.page * MAX_POSTS_NUMBER_PER_PAGE
                    + res.data.length
                    - this.state.posts.length;
                for (let i=0; i< newPostsNum;i++){
                    temp = {
                        'title': res.data[i].title,
                        'description': res.data[i].dis,
                        'pictures': res.data[i].pictures,
                        'date': moment(res.data[i].time).format('llll'),
                        'count': res.data[i].pictureCounts,
                        'id': res.data[i]._id,
                        'page': 0,
                        'comments': [],
                        'username': res.data[i].username
                    };
                    data.push(temp);
                }
                if (fromFirst){
                    if (data.length > 0 && data.length <= 10) {
                        this.setState({
                            posts: data.concat(this.state.posts)
                        });
                    } else if (data.length > 10) {
                        // Need to think about
                    }
                } else {
                    if (res.data.length === 0 && this.state.page > 0) {
                        this.setState({
                            hasMorePost: false,
                            page: this.state.page-1
                        });
                    }
                    else if (res.data.length < 10) {
                        this.setState({
                            hasMorePost: false,
                            posts: this.state.posts.concat(data)
                        });
                    } else {
                        this.setState({
                            hasMorePost: true,
                            posts: this.state.posts.concat(data),
                            page: this.state.page+1
                        });
                    }
                }
            });
        this.fetchMoreComments();

    };

    fetchMoreData = () => {
        // a fake async api call like which sends
        // 20 more records in 1.5 secs
        if (this.state.hasMorePost) {
            setTimeout(() => {
                this.fetchData(false);
            }, 1000);
        }
    };

    sendComment(postId){

        let content = {content:this.state.comment}
        axios
            .post(process.env.REACT_APP_BASE_URL+
                '/api/posts/'+postId
                +'/comments/',
                content,
                {withCredentials:true})
            .then(res => {
                message.success("The Comment is sent");
            });

        this.setState({
            comment: '',
        });
        this.onReset();
    }


    getSpecificImages(postId,imageCount){
        let a = [];
        for (let i=0; i< imageCount; i++){
            a.push(<div>
                <img src={`${process.env.REACT_APP_BASE_URL}/api/posts/${postId}/images/${i}/`} alt={"avatar"}/>
            </div>)

        }

        return a
    }
    fetchMoreComments = () => {
        for (let i=0; i<this.state.posts.length;i++){
            axios
                .get(process.env.REACT_APP_BASE_URL+
                    '/api/posts/'+this.state.posts[i].id
                    +'/comments/?page='+this.state.posts[i].page,
                    {withCredentials:true})
                .then(res => {
                    let data = [];
                    let temp = {};
                })
        }


    };


    render(){

        return(
            <div className="timeline">
                <InfiniteScroll
                    dataLength={this.state.posts.length}
                    next={this.fetchMoreData}
                    hasMore={this.state.hasMorePost}
                    style={this.style}
                    loader={<div style={{alignContent: 'center'}}><Spin indicator={loadingIcon} /></div>}
                    endMessage={
                        <p style={{margin: '0 0 0 360px'}}>
                            <b>Yay! You have seen it all</b>
                        </p>
                    }
                >
                    {this.state.posts.map((post) => (

                        <Row>
                            <Col span={11}>
                                <Card
                                    hoverable
                                    cover={<Carousel
                                        dotPosition="top" autoplay>
                                        {this.getSpecificImages(post.id, post.count)}
                                    </Carousel>}
                                    title={<div>
                                            {post.username} created {}     
                                            <TimeAgo date={post.date} formatter={formatter} />
                                            </div>}
                                >
                                    <Meta
                                        title={post.title}
                                        avatar={<Avatar
                                            src={process.env.REACT_APP_BASE_URL+"/api/profile/avatar?username="+cookie.load('username')}
                                            alt="Han Solo"
                                        />}
                                        description={post.description}
                                    />
                                </Card>

                            </Col>
                            <Col span={11}>
                                <Content>
                                    {/* <InfiniteScroll

                                dataLength={this.state.comments.length}
                                next={this.fetchMoreComments}
                                hasMore={this.state.hasMoreCmt}
                                style={this.style}
                                loader={<h4>Loading...</h4>}
                            >    */}
                                    <div>
                                        {this.state.comments.map((comment) =>{
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
                                    </div>
                                    {/* </InfiniteScroll> */}
                                    <Form
                                        name="login"
                                        {...formItemLayout}
                                        onFinish={this.sendComment.bind(this,post.id)}
                                        ref={this.formRef}
                                    >
                                        <Form.Item
                                            name="comment"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please input your Comment!',
                                                }]}
                                        >
                                            <Input.TextArea
                                                value={this.state.comment}
                                                name="comment"
                                                id={post.id+"comment"}
                                                onChange={this.handleChange}
                                                placeholder="Write a comment..."/>
                                        </Form.Item>

                                        <Form.Item>
                                            <Button type="primary"
                                                    htmlType="submit"
                                                    className="comment-form-button">
                                                Submit
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </Content>
                            </Col>
                            <Col span={2}>
                                <Button danger>Delete</Button>
                            </Col>
                            <Divider/>
                        </Row>
                    ))}
                </InfiniteScroll>
            </div>
        );
    }
}
export default FollowingTimeline;