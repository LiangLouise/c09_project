import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Input, Modal, Table } from 'antd';
import axios from 'axios';

const { Search } = Input;

const data2 = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
  ];

class SearchBar extends Component{
    constructor(){
        super()
        this.state = {
            visible: false,
            query:'',
            result: [],
            action: '',
            data: [],
            columns:[
                {
                    title: 'Name',
                    dataIndex: 'name',
                    key: 'name',
                    render: text => <a>{text}</a>,
                },
                {
                    title: 'Action',
                    dataIndex: 'action',
                    key: 'action',
                    render: () => (
                      <span>
                        <a style={{ marginRight: 16 }}>{this.state.action} </a>
                      </span>
                    ),
                  },
            ]
        }
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    hideModal = () => {
        this.setState({
              visible: false,
          }); 
    };
    
    showModal = () => {
        console.log("show modal "+this.state.data)
        this.setState({
              visible: true,
          });
           
    };
    
    getUsers = () => {
        let username = this.state.query;
        axios
            .get(process.env.REACT_APP_BASE_URL+
                '/api/search/?username='+ username+'&page=0',
                {withCredentials: true})
            .then(res => {
                let data = [];
                let temp = {};
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
                                this.setState({
                                    action:"Unfriend"
                                })
                            }else{
                                this.setState({
                                    action:"Friend"
                                })
                            }
                            temp = {
                                'key': (i+1).toString(),
                                'name': this.state.result[i],
                                'action': this.state.action,
                            }
                            data.push(temp)
                            this.setState({
                                data: JSON.parse(JSON.stringify(data))
                            })
                        })
                }
                this.showModal();
            });
        this.setState({
            query: '',
        });
        
    }
    
    render() {
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
                columns={this.state.columns}
                dataSource={this.state.data}/>
            </Modal>
            </div>
        )}
   
    
}

export default SearchBar;