import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Input } from 'antd';

const { Search } = Input;

class SearchBar extends Component{
    render() {
        return (
            <Search
                placeholder="input search text"
                onSearch={value => console.log(value)}
                style={{ width: 350 }}
                />
        )}
   
    
}

export default SearchBar;