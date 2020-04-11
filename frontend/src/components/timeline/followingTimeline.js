import React, { Component } from 'react';
import './timeline.css';
import 'antd/dist/antd.css';
import { Divider, Row, Col, Tooltip, Comment, Avatar, Card, Input, Form, Button, Carousel, Spin, message, Modal, Pagination} from 'antd';
import { LoadingOutlined, CommentOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import cookie from 'react-cookies'
import TimeAgo from 'react-timeago'
import englishStrings from 'react-timeago/lib/language-strings/en'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'

const { Meta } = Card;
const formatter = buildFormatter(englishStrings)
const formItemLayout = {
    wrapperCol: {
        span: 24,
    }
};
const loadingIcon = <LoadingOutlined className="loadingIcon" spin />;
class FollowingTimeline extends Component{
    formRef = React.createRef();
    constructor(props){
        super(props);
        this.state={
            isLoggedIn: (cookie.load('username') !== "" && cookie.load('username') !== undefined),
            page: 0,
            cmtPage: 0,
            posts: [],
            comments:{},
            items: Array.from({ length: 20 }),
            hasMorePost: true,
            postCount: 0,
            cmtCount: {},
            commentVisible: {},
            commentsToDis: [],
            post_highlighted : "",
            actions: [],
            comment: "",
        };
        this.sendComment = this.sendComment.bind(this);
        this.showComment = this.showComment.bind(this);
        this.hideComment = this.hideComment.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.changePage = this.changePage.bind(this);
        this.fetchComments = this.fetchComments.bind(this);
        this.getActions = this.getActions.bind(this);
        this.delCmtWindow = this.delCmtWindow.bind(this);
        this.deleteCmt = this.deleteCmt.bind(this);
    };

    onReset = () => {
        this.formRef.current.resetFields();
    };

    handleChange = (e) =>
        this.setState({ [e.target.name]: e.target.value });

    componentDidMount() {
        this.setState({page: this.state.page});
        this.fetchData();
        //this.getPostCount();
    };

    componentWillReceiveProps(props) {
        if (props.refresh) {
            this.fetchData(true);
        };
    };

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
                let newPostsNum = this.state.page * process.env.REACT_APP_MAX_POST_PER_PAGE
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
                        'username': res.data[i].username,
                        'index':i,
                    };
                    temp2[res.data[i]._id] = false;
                    data.push(temp);
                };
                this.setState({
                    commentVisible: temp2
                });
                if (fromFirst){
                    if (data.length > 0 && data.length <= process.env.REACT_APP_MAX_POST_PER_PAGE) {
                        this.setState({
                            posts: data.concat(this.state.posts),
                        });
                    } else if (data.length > process.env.REACT_APP_MAX_POST_PER_PAGE) {
                        // Need to think about
                    };
                } else {
                    if (res.data.length === 0 && this.state.page > 0) {
                        this.setState({
                            hasMorePost: false,
                            page: this.state.page-1
                        });
                    }
                    else if (res.data.length < process.env.REACT_APP_MAX_POST_PER_PAGE) {
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
                    };
                };
            });
    };


    getCmtCount(postId){
        let temp = this.state.cmtCount;
        axios
            .get(process.env.REACT_APP_BASE_URL+
                "/api/posts/"+postId+"/commentsCount",
                {withCredentials:true})
            .then(res => {
                temp[postId] = res.data.count
                this.setState({
                    cmtCount : temp,
                });
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
        if(this.state.comment.length > process.env.REACT_APP_MAX_COMMENT_LENGTH){
            message.error("comments must be less than 100 characters");
            return;
        }
        let content = {content:this.state.comment};
        axios
            .post(process.env.REACT_APP_BASE_URL+
                '/api/posts/'+postId
                +'/comments/',
                content,
                {withCredentials:true})
            .then(res => {
                message.success("The Comment is sent");
                this.fetchComments(postId, this.state.cmtPage-1);
                this.getCmtCount(postId);
            });
        this.onReset();
    };

    showComment(e, postId){
        this.fetchComments(postId);
        this.getCmtCount(postId);
        let commentVisible = this.state.commentVisible;
        commentVisible[postId]=true;
        this.setState({
            commentVisible: commentVisible,
            post_highlighted: postId,
        });
    };

    hideComment(e, postId){
        let commentVisible = this.state.commentVisible;
        commentVisible[postId]=false;
        this.setState({
            commentVisible: commentVisible,
            cmtPage: 1,
            post_highlighted: "",
        });
    };

    getSpecificImages(postId,imageCount){
        let images = [];
        for (let i=0; i< imageCount; i++){
            images.push(<div>
                <img src={`${process.env.REACT_APP_BASE_URL}/api/posts/${postId}/images/${i}/`} alt={"avatar"}/>
            </div>)
        };
        return images;
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
                temp[postId] = res.data;
                this.setState({
                    comments : temp,
                    cmtPage: pageNumber+1,
                    commentsToDis: this.displayComments(postId),
                });
            });
    };

    getActions(postOwner, cmtOwner, postId, cmtId){
        let actions;
        if (cmtOwner=== cookie.load('username')
            || postOwner === cookie.load('username')){
            actions = [<span onClick={(e) => this.delCmtWindow(e,postId,cmtId)}
                        >Delete</span>];
        }else{
            actions = [];
        };
        return actions;
    };

    delCmtWindow(e,postId, cmtId){
        let method = this.deleteCmt;
        Modal.confirm({
            title: 'Are you sure delete this comment?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                method(postId, cmtId)
            },
        });
    };

    deleteCmt(postId, cmtId){
        axios
            .delete(process.env.REACT_APP_BASE_URL+
                '/api/posts/comments/'+cmtId+'/',
                {withCredentials: true})
            .then(res =>{
                // check if this was the last comment on current page
                if (this.state.comments[postId].length === 1 && this.state.cmtPage !== 1){
                    this.fetchComments(postId,this.state.cmtPage-2);
                }else{
                    this.fetchComments(postId, this.state.cmtPage-1);
                }
                this.getCmtCount(postId);
                message.success("Post is deleted");
            });
    };

    displayComments(postId)
    {
        let postOwner = "";
        axios
            .get(process.env.REACT_APP_BASE_URL+
                '/api/posts/'+postId,
                {withCredentials:true})
            .then(res => {
                postOwner = res.data.username;
            });
        return this.state.comments[postId].map((comment) =>(
            <Comment
                actions={this.getActions(postOwner, comment.username, postId, comment._id)}
                author={comment.username}
                avatar={
                    <Avatar
                        src={process.env.REACT_APP_BASE_URL+"/api/profile/avatar?username="+cookie.load('username')}
                        alt="Han Solo"
                    />
                }
                content={
                    <p>
                        {comment.content}
                    </p>
                }
                datetime={
                    <Tooltip title={moment(comment.time).format('YYYY-MM-DD HH:mm:ss')}>
                        <span>{moment(comment.time).fromNow()}</span>
                    </Tooltip>
                }
            >
            </Comment>));
    };

    changePage(pageNumber) {
        this.setState({
            cmtPage: pageNumber,
        });
        this.fetchComments(this.state.post_highlighted, pageNumber-1);
    };

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
                                                    current={this.state.cmtPage}
                                                    pageSize={process.env.REACT_APP_MAX_COMMENT_PER_PAGE}
                                                    total={this.state.cmtCount[post.id]}
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
        );
    };

    render(){
        let infiniteScroll = this.InfiniteScroll()
        return(
            <div className="timeline">
                {infiniteScroll}
            </div>
        );
    };
};
export default FollowingTimeline;