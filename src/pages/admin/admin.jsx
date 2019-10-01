import React, {Component} from 'react'
import {Route, Redirect, Switch} from 'react-router-dom'
// 引入layout布局组件
import { Layout } from 'antd';

import memoryUtils from "../../utils/memoryUtils";
import Header from "../../components/header/header";
import LeftNav from "../../components/left-nav/left-nav";
import Home from "../home/home";
import Product from "../product/product";
import Role from "../role/role";
import User from "../user/user";
import Category from "../category/category";
import Bar from '../charts/bar'
import Pie from '../charts/pie'
import Line from "../charts/line";

// layout里面又有很多组件
const { Footer, Sider, Content } = Layout;

// 后台管理的路由组件
export default class Admin extends Component{

    render() {
        const user = memoryUtils.user
        // 如果内存中没有user，说明当前没有登录
        if (!user || !user._id) {
            // 自动跳转到登录页面（在render（）中实现跳转，使用该方法； 而在事件回调函数中，使用history的replace或者push方法）
            return <Redirect to='/login'/>
        }
        return (
            <Layout style={{minHeight:'100%'}}>
                <Sider>
                    <LeftNav/>
                </Sider>
                <Layout>
                    <Header/>
                    <Content style={{margin:'20px', backgroundColor:"#fff"}}>
                        <Switch>
                            <Route path='/home' component={Home}/>
                            <Route path='/category' component={Category}/>
                            <Route path='/product' component={Product}/>
                            <Route path='/user' component={User}/>
                            <Route path='/role' component={Role}/>
                            <Route path='/charts/bar' component={Bar}/>
                            <Route path='/charts/line' component={Line}/>
                            <Route path='/charts/pie' component={Pie}/>
                            <Redirect to='/home'/>
                        </Switch>
                    </Content>
                    <Footer
                        style={{textAlign:'center', color:"black",
                        fontWeight:"bolder", fontSize:'20px'}}
                    >
                        React技术栈，后台管理项目
                    </Footer>
                </Layout>
            </Layout>
        )
    }
}