/*
包含 n 个日期时间处理的工具函数模块
*/

// 获得想要日期格式

export function formatDate(time) {
    if (!time) return ''
    let date = new Date(time)
    return (
        date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
        + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
    )
}
 