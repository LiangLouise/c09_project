import React, { Component } from 'react';
import 'antd/dist/antd.css';
import {Input, Modal, Table, Button, message} from 'antd';
import axios from 'axios';
import cookie from 'react-cookies'

const { Search } = Input;


class SearchBar extends Component{
    constructor(props){
        super(props);
        this.state = {
            visible: false,
            query:'',
            result: [],
            data: [],
            page: 1,
            total:0,
            sortOrder: null,
        };
        this.changePage = this.changePage.bind(this);
        this.constructTable = this.constructTable.bind(this);
        this.getUserCount = this.getUserCount.bind(this);
    };


    onRequest = (e) => {
        let username = e.currentTarget.dataset.name;
        let action = e.currentTarget.dataset.action;
        if (action === "Follow"){
            let req = {username:username};
            console.log(req)
            axios
                .post(process.env.REACT_APP_BASE_URL+
                    '/api/follow/',
                    req,
                    {withCredentials: true})
                .then(res => {
                    console.log(res.data)
                    message.success("You are now following "+username+ " yay!!!");
                }).catch((err)=>{
                message.error(err.response.data.error)
            });
        }else{
            let req = {username:username};
            console.log(req)
            axios
                .delete(process.env.REACT_APP_BASE_URL+
                    '/api/follow/'+username,
                    {withCredentials: true})
                .then(res => {
                    console.log(res.data)
                    message.success("You just unfollowed "+username+ "  :(");
                }).catch((err)=>{
                message.error(err.response.data.error)
            });
        };
        this.constructTable(this.state.page);
        
    };
    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    setSortOrder = (pagination, filters, sorter) => {

        this.setState({
            sortedInfo:sorter
        });
      };
      
    hideModal = () => {
        this.setState({
              visible: false,
              query: '',
              data: [],
              page: 1,
          }); 
          this.props.refresh();
    };
    
    showModal = () => {
        console.log(cookie.load('username'))
        this.setState({
              visible: true,
          });
           
    };
    constructTable(pageNumber){
        let username = this.state.query.trim();
        axios
            .get(process.env.REACT_APP_BASE_URL+
                '/api/search/?username='+username+'&page='+(pageNumber-1),
                {withCredentials: true})
            .then(res => {
                console.log(res.data);
                let data = [];
                let temp = {};
                let action = '';
                this.setState({
                    result:res.data.users
                });
                for (let i=0; i< this.state.result.length;i++){
                    axios
                        .get(process.env.REACT_APP_BASE_URL+
                            '/api/follow/isfollowing?username='+this.state.result[i]._id,
                            {withCredentials: true})
                        .then(res => {
                            if (res.data.isFollowing){
                                action = "Unfollow"
                            }else{
                                action = "Follow"
                            };
                            temp = {
                                'key': (i+1).toString(),
                                'name': this.state.result[i]._id,
                                'action': action,
                            };
                            data.push(temp)
                            this.setState({
                                data: JSON.parse(JSON.stringify(data))
                            });
                        }).catch((err)=>{
                        message.error(err.response.data.error);
                    });
                };
                
            }).catch(()=>{
                message.error('bad input')
        });
    };
    getUsers = () => {
        if (this.state.query.length !==0){
            this.getUserCount();
            this.constructTable(this.state.page);
            this.showModal();
        }  
    };
    changePage(pageNumber){
        this.setState({
            page: pageNumber
        });
        this.constructTable(pageNumber);
    };
    getUserCount(){
        let username = this.state.query.trim();
        axios
            .get(process.env.REACT_APP_BASE_URL+
            '/api/search/count?username='+username,
            {withCredentials:true})
            .then(res=>{
                this.setState({
                    total:res.data.count
                });
            }).catch(()=>{
            message.error('cannot get user count');
        });
    }
    

    render() {
        let sortedInfo = this.state.sortedInfo;
        sortedInfo = sortedInfo || {};
        const columns =[
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
                sorter: (a, b) => a.name.localeCompare(b.name),
                render: text => <a data-name={text}>
                                    {text}
                                </a>,
            },
            {
                title: 'Action',
                dataIndex: 'action',
                key: 'action',
                sortOrder: sortedInfo.columnKey === 'action' && sortedInfo.order,
                render: (text, record) => (
                    <span>
                        <Button 
                            style={{ marginRight: 16 }}
                            onClick={this.onRequest}
                            data-name={record.name}
                            data-action={record.action}
                        >
                            {text} 
                        </Button>
                    </span>
                )
            },
        ];
        return (
            <div>
            <Search
                placeholder="Search users here"
                name="query"
                onChange={this.onChange}
                value={this.state.query}
                onSearch={this.getUsers}
                style={{ width: 350 }}
            />
            <Modal
                title="Search Result"
                visible={this.state.visible}
                onCancel={this.hideModal}
                width={700}
                footer={null}
                >
                <Table
                columns={columns}
                dataSource={this.state.data}
                onChange={this.setSortOrder}
                pagination={{ defaultCurrent:1,
                              current:this.state.page,
                              pageSize:process.env.REACT_APP_MAX_USER_PER_PAGE,
                              total:this.state.total,
                              onChange:this.changePage,
                }}
                />
            </Modal>
            </div>
        )}
   
    
}

export default SearchBar;