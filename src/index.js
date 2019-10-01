/*
入口js文件, 一开始运行就执行
* */

import React from 'react'
import ReactDOM from 'react-dom'

import App from "./App";
import memoryUtils from "./utils/memoryUtils";
import storageUtils from "./utils/storageUtils";

// 一旦关闭浏览器，内存中user就没了。
// 读取local中保存的user，保存到内存中
const user = storageUtils.getUser()
memoryUtils.user = user


ReactDOM.render(<App/>, document.getElementById('root'))