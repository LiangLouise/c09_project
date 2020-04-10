import React, { Component } from 'react';
import './timeline.css';
import 'antd/dist/antd.css';
import { Divider, Row, Col, Tooltip, Comment, Empty, Avatar, Card, Layout, Input, Form, Button, Carousel, Spin, message, Modal, Pagination} from 'antd';
import { LoadingOutlined, CommentOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
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

const loadingIcon = <LoadingOutlined className="loadingIcon" spin />;

const MAX_POSTS_NUMBER_PER_PAGE = 10;

// function deletePost(){
//     Modal.confirm({
//         title: 'Are you sure delete this task?',
//         icon: <ExclamationCircleOutlined />,
//         content: 'Some descriptions',
//         okText: 'Yes',
//         okType: 'danger',
//         cancelText: 'No',
//         onOk() {
//           console.log('OK');
//         },
//         onCancel() {
//           console.log('Cancel');
//         },
//       });
    

// }


class FollowingTimeline extends Component{
    formRef = React.createRef();
    constructor(props){
        super(props);

        this.state={
            isLoggedIn: (cookie.load('username') !== "" && cookie.load('username') !== undefined),
            page: 0,
            cmtPage: 0,
            posts: [],
            comments:
                {"5e75ac6e6d01ef9f93a7ae2d":[
                                                {
                                                    "username":"Cheng",
                                                    "content":"Cool",
                                                    "date":"2019",
                                                    "src":"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
                                                },
                                                {
                                                    "username":"Cheng",
                                                    "content":"Cool",
                                                    "date":"2019",
                                                    "src":"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
                                                },
                                               
                                            ]
                },
        
            items: Array.from({ length: 20 }),
            hasMorePost: true,
            hasMoreCmt: true,
            postCount: 0,
            commentVisible: {},
            commentsToDis: [],
            post_highlighted : ""

        };
        this.sendComment = this.sendComment.bind(this);
        this.showComment = this.showComment.bind(this);
        this.hideComment = this.hideComment.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.delPostWindow = this.delPostWindow.bind(this);
        this.deletePost = this.deletePost.bind(this);
        this.changePage = this.changePage.bind(this);
        this.fetchComments = this.fetchComments.bind(this);

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
        let temp2 = {};
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
                    this.fetchComments(res.data[i]._id);
                    temp = {
                        'title': res.data[i].title,
                        'description': res.data[i].dis,
                        'pictures': res.data[i].pictures,
                        'date': moment(res.data[i].time).format('llll'),
                        'count': res.data[i].pictureCounts,
                        'id': res.data[i]._id,
                        'page': 0,
                        'username': res.data[i].username,
                        'index':i,
                    };
                    temp2[res.data[i]._id] = false;
                    data.push(temp);
                }
                // get comments for each post
                // axios
                //     .get(process.env.REACT_APP_BASE_URL+
                //         '/api/posts/following/?page='+page,
                //         {withCredentials: true})




                this.setState({
                    commentVisible: temp2
                })
                if (fromFirst){
                    if (data.length > 0 && data.length <= 10) {
                        this.setState({
                            posts: data.concat(this.state.posts),
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

        let content = {content:this.state.comment};
        axios
            .post(process.env.REACT_APP_BASE_URL+
                '/api/posts/'+postId
                +'/comments/',
                content,
                {withCredentials:true})
            .then(res => {
                message.success("The Comment is sent");
                this.fetchComments(postId);
            });

        this.setState({
            comment: '',
        });
        this.onReset();
    }

    showComment(e, postId){
        let commentVisible = this.state.commentVisible;
        commentVisible[postId]=true;
        this.setState({
            commentVisible: commentVisible,
            post_highlighted: postId,
            commentsToDis: this.displayComments(postId, 0)
        })
    }

    hideComment(e, postId){
        let commentVisible = this.state.commentVisible;
        commentVisible[postId]=false;
        console.log(postId);
        this.setState({
            commentVisible: commentVisible,
            cmtPage: 0,
            post_highlighted: ""
        })
    }

    getSpecificImages(postId,imageCount){
        let a = [];
        for (let i=0; i< imageCount; i++){
            a.push(<div>
                <img src={`${process.env.REACT_APP_BASE_URL}/api/posts/${postId}/images/${i}/`} alt={"avatar"}/>
            </div>)

        }

        return a
    };

    fetchComments(postId, pageNumber){
        if (pageNumber === undefined) pageNumber = 0;
        let temp = this.state.comments;
        axios
            .get(process.env.REACT_APP_BASE_URL+
                '/api/posts/'+postId
                +'/comments/?page='+pageNumber,
                {withCredentials:true})
            .then(res => {
                // temp[postId] = JSON.parse(JSON.stringify(res.data))
                temp[postId] = res.data;
                this.setState({
                    comments : temp,
                    cmtPage: pageNumber
                });
                console.log(temp[postId]);
            });
    };

    delPostWindow(e,postId,index){
        let method = this.deletePost;
        Modal.confirm({
            title: 'Are you sure delete this post?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
              method(postId,index)
            },
          });
    }
    
    //option 1:
    deletePost(postId, index){
        axios
            .delete(process.env.REACT_APP_BASE_URL+
                '/api/posts/'+postId,
                {withCredentials: true})
            .then(res =>{
                this.state.posts.splice(index,1)
                let temp = this.state.posts
                for (let i=0; i< temp.length;i++){
                    console.log("listening from 255 "+temp[i].index)
                    temp[i].index = i
                }
                this.setState({
                    posts: temp
                })
                message.success("Post is deleted")
                console.log(this.state.posts, index)
            })

    }

    displayComments(post_id)
    {


        return this.state.comments[post_id].map((comment) =>(
            <Comment
                // actions={[<span key="comment-nested-reply-to">Reply to</span>]}
                author={comment.username}
                avatar={
                    <Avatar
                        src={"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"}
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
            >
            </Comment>));
    }

    changePage(pageNumber) {

        console.log(pageNumber-1);
        this.fetchComments(this.state.post_highlighted, pageNumber-1);
        // console.log(this.state.cmtPage);
    }
    
    
    InfiniteScroll(){
        // let content = this.commentSection()
        return(
            <InfiniteScroll
                    dataLength={this.state.posts.length}
                    next={this.fetchMoreData}
                    hasMore={this.state.hasMorePost}
                    loader={<div className="loader"><Spin indicator={loadingIcon} /></div>}
                    endMessage={
                        <p className="endtext" >
                            <b>Yay! You have seen it all</b>
                        </p>
                    }
                >
                    {this.state.posts.map((post) => (
                        <Row >
                            <Col span={21}>
                                <Card
                                    hoverable
                                    cover={<Carousel
                                        dotPosition="top" autoplay>
                                        {this.getSpecificImages(post.id, post.count)}
                                    </Carousel>}
                                    title={<div>
                                            {post.username} created <TimeAgo date={post.date} formatter={formatter} />
                                            </div>
                                            }
                                    extra={<div>
                                           <Button 
                                                type="primary" 
                                                onClick={(e) => this.showComment(e,post.id)}
                                            ><CommentOutlined />Comments</Button>
                                           <Modal
                                                footer={null}
                                                title={"Comments"}
                                                width={900}
                                                centered={true}
                                                visible={this.state.commentVisible[post.id]}
                                                onCancel={(e) => this.hideComment(e,post.id)}
                                                >
                                               {this.state.commentsToDis}
                                                <Form
                                                    name="comment_form"
                                                    {...formItemLayout}
                                                    onFinish={this.sendComment.bind(this,post.id)}
                                                    ref={this.formRef}
                                                >
                                                    <Form.Item 
                                                        name="comment_input"
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
                                                        placeholder="Write a comment..."
                                                    />
                                                    </Form.Item>

                                                    <Form.Item>
                                                        <Button type="primary" 
                                                                htmlType="submit" 
                                                                className="comment-form-button">
                                                            Submit
                                                        </Button>
                                                    </Form.Item> 
                                                </Form>
                                                <Pagination
                                                    defaultCurrent={1}
                                                    total={20}
                                                    onChange={this.changePage}
                                                />
                                            
                                                

                                                </Modal>
                                                
                                           </div>
                                          }
                                    
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
                                
                            
                            <Divider/>
                        </Row>
                    ))}
                </InfiniteScroll>
        )
    }

    render(){
        let infiniteScroll = this.InfiniteScroll()
        return(
            <div className="timeline">
                {infiniteScroll}
            </div>
        );
    }
}
export default FollowingTimeline;