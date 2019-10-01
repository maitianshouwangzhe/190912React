import React from 'react'
import './link-button.less'

// 使用函数定义组件
export default function LinkButton(props) {
    return <button {...props} className='link-button'></button>
}

/*
使用：{...props}
表示LinkButton 组件具有button按钮的所有属性
* */