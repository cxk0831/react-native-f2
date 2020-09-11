import React, { Component} from "react";
import {hot} from 'react-hot-loader';
import './App.css';
import './AppFont.less'
import {ChatComponent} from './ChatComponent';

class App extends Component{
    componentDidMount() {
        this.textFun('hello world123')
    }

    textFun = (value: string) => {
        console.log(value)
    }

    render(){
        return(
            <div className="App">
                <h1> 你好世界1234 ! </h1>
                <div className='font'>good night</div>
                <ChatComponent />
            </div>
        );
    }
}

export default hot(module)(App);
