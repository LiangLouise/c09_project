import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Input, Modal, Table, Row,Button } from 'antd';
import axios from 'axios';
import cookie from 'react-cookies'

const { Search } = Input;
let username = cookie.load('username');

class SearchBar extends Component{
    constructor(){
        super()
        this.state = {
            visible: false,
            query:'',
            result: [],
            data: [],
            page: 0,
            sortOrder: null,
            // columns:[
            //     {
            //         title: 'Name',
            //         dataIndex: 'name',
            //         key: 'name',
            //         sortOrder: 'ascend',
            //         sorter: (a, b) => a.name.localeCompare(b.name),
            //         render: text => <a
            //                             data-name={text}
            //                         >
            //                             {text}
            //                         </a>,
            //     },
            //     {
            //         title: 'Action',
            //         dataIndex: 'action',
            //         key: 'action',
            //         render: (text, record) => (
            //           <span>
            //             <a 
            //                 style={{ marginRight: 16 }}
            //                 onClick={this.onRequest}
            //                 data-name={record.name}
            //                 data-action={record.action}
            //             >
            //                 {text} 
            //             </a>
            //           </span>
            //         )
            //     },
            // ],
        }
    }


    onRequest = (e) => {
        let username = e.currentTarget.dataset.name;
        let action = e.currentTarget.dataset.action;

        console.log(username, action);
        if (action === "Follow"){
            let req = {username:username};
            console.log(req)
            axios
                .post(process.env.REACT_APP_BASE_URL+
                    '/api/friend/',
                    req,
                    {withCredentials: true})
                .then(res => {
                    console.log(res.data)

                })
        }else{
            let req = {username:username};
            console.log(req)
            axios
                .delete(process.env.REACT_APP_BASE_URL+
                    '/api/friend/'+username,
                    {withCredentials: true})
                .then(res => {
                    console.log(res.data)
                    
                })   
        }
        this.constructTable();
        
    }
    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    setSortOrder = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        console.log(sorter.order)
        this.setState({
            sortedInfo:sorter
        });
      };
      
    hideModal = () => {
        this.setState({
              visible: false,
              query: '',
          }); 
    };
    
    showModal = () => {
        console.log(cookie.load('username'))
        this.setState({
              visible: true,
          });
           
    };
    constructTable = () => {
        let username = this.state.query;
        axios
            .get(process.env.REACT_APP_BASE_URL+
                '/api/search/?username='+username+'&page='+this.state.page,
                {withCredentials: true})
            .then(res => {
                let data = [];
                let temp = {};
                let action = '';
                this.setState({
                    result:res.data.users
                })
                for (let i=0; i< this.state.result.length;i++){
                    axios
                        .get(process.env.REACT_APP_BASE_URL+
                            '/api/isfriend?username='+this.state.result[i],
                            {withCredentials: true})
                        .then(res => {
                            if (res.data.isFriend){
                                action = "Unfollow"
                            }else{
                                action = "Follow"
                            }
                            temp = {
                                'key': (i+1).toString(),
                                'name': this.state.result[i],
                                'action': action,
                            }
                            data.push(temp)
                            this.setState({
                                data: JSON.parse(JSON.stringify(data))
                            })
                        })
                }
                
            });
    }
    getUsers = () => {
        this.constructTable();
        this.showModal();
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
                render: text => 
                                <a
                                    data-name={text}
                                >
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
                placeholder="input search text"
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
                />
            </Modal>
            </div>
        )}
   
    
}

export default SearchBar;