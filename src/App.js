/*
应用的根组件
* */
import React, {Component} from 'react'
//  路由器 和 路由
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Login from "./pages/login/login";
import Admin from "./pages/admin/admin";

export default class App extends Component{

    render() {
        return (
            <BrowserRouter>
                {/* 注册路由*/}
                {/* 一个路由就是一个映射关系 */}
                {/* Switch 每次只匹配一个*/}
                <Switch>
                    <Route path='/login' component={Login}></Route>
                    <Route path='/' component={Admin}></Route>
                </Switch>
            </BrowserRouter>
        )
    }
}