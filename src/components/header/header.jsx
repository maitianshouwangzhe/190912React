import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import { Modal} from 'antd';


import './header.less'
import {formatDate} from '../../utils/dateUtils'
// 默认暴露不需要大括号
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import {reqWeather} from "../../api";
import menuList from "../../config/menuConfig";
import LinkButton from "../link-button/link-button";

const { confirm } = Modal;

class Header extends Component{
    state = {
        // 当前时间的格式
        currentTime: formatDate(Date.now()),
        dayPictureUrl: '',
        weather: ''
    }
    getTittle = () => {
        const path = this.props.location.pathname
        let title
        // 数组遍历
        menuList.forEach((item)=> {
            if (item.key === path){
                title = item.title
            } else if (item.children) {
                // 在所有的子item中查抄符合条件的item
                const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                if (cItem) {
                    title = cItem.title
                }
            }
        })
        return title
    }

    // 退出登录
    quitLogin = ()=> {
        confirm({
            title: '你确定退出吗?',
            okText: '是',
            cancelText: '否',
            onOk: ()=> {
                // 退出登录，第一步是清除已经保存的username
                storageUtils.removeUser()
                memoryUtils.user = {}
                // 退出登录，第二步为跳转到登录页面
                this.props.history.replace('/login')
            },
        });
    }

    // 当前组件卸载之前调用
    componentWillUnmount() {
        // 清除定时器，清除定时器的最好的办法就是清除定时器id
        clearInterval(this.setIntervalId)
    }


    getTime = ()=> {
        this.setIntervalId = setInterval(()=> {
            const currentTime = formatDate(Date.now())
            this.setState({currentTime})
        }, 1000)
    }

    getWeather = async( ) => {
        // 调用接口请求函数，异步获取数据
        // 返回的是一个对象，可以进行解构
        const {dayPictureUrl, weather} = await reqWeather('西安')
        this.setState({dayPictureUrl, weather})
    }

    // 一般执行异步操作： 发起ajax请求或者启动定时器
    componentDidMount () {
        this.getTime()
        this.getWeather()
    }


    render() {
        const {currentTime, dayPictureUrl, weather} = this.state
        // 从内存中取出，user
        const username = memoryUtils.user.username
        // 取出title
        const title = this.getTittle()
        return (
            <div className='header'>
                <div className='header-top'>
                    <span>欢迎， {username}</span>
                    <LinkButton onClick={this.quitLogin}>退出</LinkButton>
                </div>
                <div className='header-bottom'>
                    <div className='header-bottom-left'>{title}</div>
                    <div className='header-bottom-right'>
                        <span>{currentTime}</span>
                        <a href='https://www.baidu.com' target='_blank' rel='noopener noreferrer'>
                            <img src={dayPictureUrl} style={{height:'18px', width:'18px'}} alt='weather'/>
                        </a>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)