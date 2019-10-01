/*
要求：
能根据接口文档，定义接口请求函数

所有的接口请求函数，返回的都是promise对象

// http://localhost:5000/login
包含应用中所有接口请求函数的模块,

注意：每个接口函数的返回值都是promise对象
* */

import ajax from "./ajax";
// jsonp请求，用于解决浏览器的跨域数据访问的问题， 但是请求方式只能为get请求
import jsonp from 'jsonp'
import {message} from 'antd'


// 请求得到账户和密码
// 箭头函数有return功能
export const reqLogin = (username, password) => (ajax('/login',{username, password}, 'POST'))

// 添加用户登录
// export const reqAddUser = (user)=> (ajax('/manage/user/add', {user}, 'POST'))


// 异步获取一级/二级分类的列表
// 一个请求参数是key-value的形式
// 注意：此处data{}是一个对象，且传入的是参数名，即key。如果仅仅传入了一个参数名也要用{}
export const reqCategorys = (parentId) => (ajax('/manage/category/list', {parentId}, 'GET'))

// 添加分类
export const reqAddCategory = (parentId, categoryName) => (
    ajax('/manage/category/add', {parentId,categoryName}, 'POST')
)

// 更新分类名称
export const reqUpdateCategory = (categoryId, categoryName) => (
    ajax('/manage/category/update', {categoryId, categoryName}, 'POST')
)


// jsonp请求的接口请求函数
export const reqWeather = (city) => {
    return new Promise((resolve, reject) => {
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
        // 发送jsonp请求
        jsonp(url, {}, (err, data)=> {
            if (!err && data.status ==='success') {
                const {dayPictureUrl, weather} = data.results[0].weather_data[0]
                // resolve到需要的数据
                resolve({dayPictureUrl, weather})
            } else {
                message.error('获取天气信息失败')
            }
        })
    })

}


// 获取商品分页列表
export const reqProducts =(pageNum, pageSize) => (ajax('/manage/product/list', {pageNum, pageSize}, 'GET'))


// 根据选定和输入的内容，进行搜索，发起请求
// searchType为搜索的类型，searchType的值是productName或者productDesc，
// 将参数名searchType的值作为属性名，
// 即：想让一个变量的值作为属性名的时候，加上中括号[]
export const reqSearchProducts=({pageNum, pageSize, searchName, searchType})=> (ajax('/manage/product/search', {
    pageNum,
    pageSize,
    [searchType]: searchName,
}, 'GET'))


// 根据分类ID获取分类
export const reqCategory = (categoryId)=> ajax('/manage/category/info', {categoryId})


// 对商品进行上架或下架的操作
export const reqUpdateStatus = (productId, status) => ajax('/manage/product/updateStatus', {productId, status}, 'POST')


// 删除图片
export const reqDeleteImg = (name) => ajax('/manage/img/delete', {name}, 'POST')

// 增加商品
// 将传入的形参为以对象的形式传入
// 需要传入很多参数, 简单起见，传入一个对象， 如果传入的是一个对象，则因该写为ajax('/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST') 中的product就不能带有大括号， 否则添加或者修改不成功
// 合成一个请求函数
// 添加或修改商品
// 如果有id则为修改
export const reqAddOrUpdateProduct = (product) => ajax('/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST')

// 修改商品
// export const reqUpdateProduct = (product) => ajax('/manage/product/update', {product}, 'POST')


// 获取所有用户列表
export const reqUsers = () => ajax('/manage/user/list', {}, 'GET')

// 更新或添加用户
export const reqAddOrUpdateUser = (user) => ajax('/manage/user/' + (user._id ? 'update' : 'add'), user, 'POST')

// 删除用户
export const reqDeleteUser = (userId)=> ajax('/manage/user/delete', {userId}, 'POST')



//获取所有角色的列表
export const reqRoles = () =>  ajax('/manage/role/list', {}, 'GET')

//添加角色
export const reqAddRole = (roleName) =>  ajax('/manage/role/add', {roleName}, 'POST')

// 设置角色权限
export const reqUpdateRole = (role) => ajax('/manage/role/update', role, 'POST')


