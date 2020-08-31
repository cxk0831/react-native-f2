import React, { Component} from "react";
import {hot} from 'react-hot-loader';
import './App.css'
import './AppFont.less'

const name = () => {
    console.log('你大爷12')
}

name()

class App extends Component{
    componentDidMount() {
        this.textFun('hello world123')
    }

    textFun = (value: string) => {
        console.log(value)
    }

    render(){
        return(
            <div className='App'>
                <h1> 你好世界1234 ! </h1>
                <div className='font'>good night</div>
            </div>
        );
    }
}

export default hot(module)(App);
