/*
能发送异步的ajax请求的函数模块，函数的返回值是promise对象



axios的语法：https://github.com/axios/axios
*/

import axios from 'axios'

import {message} from "antd";


// 封装axios请求库（有post请求和get请求两种方式）
// 并对请求所存在的异常进行统一处理; 需要在外层包一个自己创建的Promise对象

export default function ajax(url, data={}, type='GET') {

    return new Promise((resolve, reject) => {
        let promise
        //    1、 执行异步ajax请求的方式
        if (type ==='GET') {
            promise =  axios.get(url, {
                // 请求参数配置
                params:data
            })
        } else {
            promise =  axios.post(url,data)
        }
        //  2、如果成功，调用resolve(value)
        promise.then( response => {
            // 异步得到的不是response, 而是response.data
            // response.data为一个对象，
            // 如： 具有嵌套结构
            // {status:0, data:{status:0, data:{}} } 或者 {status:1, data:{status:1, data:{} }
            resolve(response.data)
            // console.log('response,,,', response)
            // console.log('response.data打印输出ing', response.data)
        }).catch(error => {
            //    3、如果失败，不调用resolve，而是提示异常信息。牢记
            message.error('请求出错了:'+ error.message)
        })
    })
}

