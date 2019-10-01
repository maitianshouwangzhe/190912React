/*
进行local(本地)数据存储管理
刷新也不会导致数据的丢失。
注：刷新会使得内存中的数据丢失
* */

// 包含 n 个操作 local storage 的工具函数的模块
import store from 'store'

const USER_KEY = 'user_key'

export default {
    // 保存user
    saveUser(user){
        store.set(USER_KEY, user)
    },


    // 读取得到user
    getUser(){
        // parse接收的是JSON格式的字符串
        // 使用parse去解析，如果有值，则解析localStorage.setItem('user_key')；如果没值，则返回为空对象
        return store.get(USER_KEY || {})
    },

    // 删除user
    removeUser () {
        store.remove(USER_KEY)
    }
}