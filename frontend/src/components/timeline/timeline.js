import React, { Component } from 'react';
import './timeline.css';
import 'antd/dist/antd.css';
import { Divider, Row, Col, Comment, Tooltip, Avatar, Card, Layout, Input, Form, Button, Carousel, Spin,Modal, message} from 'antd';
import { LoadingOutlined, DeleteOutlined, CommentOutlined, ExclamationCircleOutlined  } from '@ant-design/icons';
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

class MyTimeline extends Component{
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
        this.delPostWindow = this.delPostWindow.bind(this);
        this.deletePost = this.deletePost.bind(this);

    };

    onReset = () => {
        this.formRef.current.resetFields();
    };

    handleChange = (e) =>
        this.setState({ [e.target.name]: e.target.value });

    componentDidMount() {
        this.setState({page: this.state.page});
        this.fetchData();
        // this.getPostCount();

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
        let username = cookie.load('username');
        let page;

        if (fromFirst) page = 0;
        else page = this.state.page;

        axios
            .get(process.env.REACT_APP_BASE_URL+
            '/api/posts/?username='+username+'&page='+page,
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
                        'username': res.data[i].username,
                        'index': i,
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
                    if (res.data.length == 0 && this.state.page > 0) {
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
       
    }
    
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
                message.success("Comment is Sent");
            });
        
        this.setState({
            comment: '',
        });
        this.onReset();
    }

    // getImages(postId,imageCount){
    //     for (let i=0; i<imageCount; i++){
    //         this.getSpecificImage(postId,i)
    //     }
    // }
    getSpecificImages(postId,imageCount){
        let a = []
        for (let i=0; i< imageCount; i++){
            a.push(<div>
                <img src={`${process.env.REACT_APP_BASE_URL}/api/posts/${postId}/images/${i}/`}/>
            </div>)

        }
         
        return a
    }
    fetchMoreComments = () => {
        // if (this.state.comments.length >= 3) {
        //     this.setState({ hasMoreCmt: false });
        //     return;
        // }
        // a fake async api call like which sends
        // 20 more records in 1.5 secs
        // setTimeout(() => {
        //     let comment = [{src:"https://cdn.discordapp.com/attachments/303411519738085377/687179308611272734/16395827_10207611523715511_656645643_n.png",
        //                             content:"test"}]
        //     this.setState({
        //         comments: this.state.comments.concat(JSON.parse(JSON.stringify(comment)))
        //     })
        // }, 1500);
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

    delPostWindow(e,postId,index){
        let method = this.deletePost
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
    deletePost(postId,index){
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
    
    InfiniteScroll(){
        return(
            <InfiniteScroll
                    dataLength={this.state.posts.length}
                    next={this.fetchMoreData}
                    hasMore={this.state.hasMorePost}
                    loader={<div className="loader"><Spin indicator={loadingIcon} /></div>}
                    endMessage={
                        <p className="endtext">
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
                                    extra={<Button type="primary" ><CommentOutlined />Comments</Button>}
                                    
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
                                
                            <Col span={3}>
                                <a className="delete-ref" >
                                    <DeleteOutlined className="delete-btn" onClick={(e) => this.delPostWindow(e,post.id,post.index)}/>
                                </a>
                            </Col>
                            <Divider/>
                        </Row>
                    ))}
                </InfiniteScroll>
        )
    }
   
    render(){
        let InfiniteScroll = this.InfiniteScroll()
        return(
            <div className="timeline">
                {InfiniteScroll}   
            </div>
        );    
    } 
}
export default MyTimeline;