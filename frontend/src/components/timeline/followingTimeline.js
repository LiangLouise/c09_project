import React, { Component } from 'react';
import './timeline.css';
import 'antd/dist/antd.css';
import { Divider, Row, Col, Comment, Tooltip, Avatar, Card, Layout, Input, Form, Button, Carousel, Spin, message, Modal} from 'antd';
import { LoadingOutlined, DeleteOutlined, CommentOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
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
                        'username': res.data[i].username,
                        'index':i,
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
    };
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

                console.log(this.state.posts, index)
            })

    }

    //option 2
    // showModal(e,postId){
    //     let temp = this.state.deleteVisible
    //     console.log(temp)
    //     temp[postId] = true
    //     this.setState({
    //         deleteVisible: temp
    //     });
    //   };
    
    //   handleOk(e,postId){
    //     let temp = this.state.deleteVisible
    //     temp[postId] = false
    //     this.setState({
    //         deleteVisible: temp
    //     });
    //   };
    
    //   handleCancel(e,postId){
    //     let temp = this.state.deleteVisible
    //     temp[postId] = false
    //     this.setState({
    //         deleteVisible: temp
    //     });
    //   };

    InfiniteScroll(){
        return(
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
                                    <DeleteOutlined onClick={(e) => this.delPostWindow(e,post.id,post.index)} style={{float:"right"}}/>
                                    {/* <DeleteOutlined onClick={(e) => this.showModal(e,post.id)} style={{float:"right"}}/>
                                    <Modal
                                    title="Basic Modal"
                                    icon={<ExclamationCircleOutlined />}
                                    visible={this.state.deleteVisible[post.id]}
                                    onOk={(e) => this.handleOk(e,post.id)}
                                    onCancel={(e) => this.handleCancel(e,post.id)}
                                    >
                                    <p>Some contents...</p>
                                    <p>Some contents...</p>
                                    <p>Some contents...</p>
                                    </Modal> */}
                                </a>
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