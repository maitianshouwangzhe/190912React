import React, {Component} from 'react'
import {
    Form,
    Icon,
    Input,
    Button,
    message
} from 'antd';
import {Redirect} from 'react-router-dom'


import './login.less'
import {reqLogin} from '../../api/index'
import logo from '../../assets/images/logo.png'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from "../../utils/storageUtils";



// 登录的路由组件
class Login extends Component{

    // 事件回调函数需要event
    handleSubmit =(e) => {
        // 由于点击登录后，会提交表单，需要阻止事件的默认行为，
        e.preventDefault()
        // this.props.form得到强大的form对象，
        // 对表单中所有的字段进行校验，
        // 获取表单项中的输入值，其中values是对象，不是数组
        // 数组里面的数据以下标为标识，而对象里面的数据以名称为标识。下面输入的数据是以username、password为名称做的标识
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                // console.log('提交登录的ajax请求 ', values);
                // 请求登录
                const {username, password} = values
                // 发起请求，得到的就是ajax文件中resolve(response.data)语句返回的response.data，将response.data赋值给result
                const result = await reqLogin(username, password)
                if (result.status === 0) {
                    // 登录成功
                    message.success('登录成功')
                    // 内存中保存user,但是一刷新就会导致用户退出
                    const user = result.data
                    console.log('打印user的输出', user)
                    memoryUtils.user = user
                    // 将user保存到local中去
                    storageUtils.saveUser(user)

                    // 跳转到管理页面（不需要回退到登录界面，则用replace）
                    this.props.history.replace('/')

                } else {
                    // 登录失败，提示错误信息
                    // msg是看api接口
                    message.error(result.msg)
                }

            } else {
                console.log('校验失败')
            }
        })
    }

    validatePwd = (rule, value, callback) => {
        if (!value){
            callback('密码必须输入')
        } else if (value.length<4){
            callback('密码长度不能小于4位')
        } else if (value.length >=12){
            callback('密码长度不能大于12位')
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)){
            callback('密码必须由英文、数字和下划线组成')
        } else {
            callback()
        }
    }

    render() {

        // 如果已经登录，则自动跳转到管理页面
        const user = memoryUtils.user
        if (user && user._id){
            return <Redirect to='/'/>
        }

        // 得到form对象
        const form = this.props.form
        // 得到getFieldDecorator
        const { getFieldDecorator } = form;
        return (
            <div className='login'>
                <header className='login-header'>
                    <img src={logo} alt='logo'/>
                    <h1>React项目：后台管理系统</h1>
                </header>
                <section className='login-content'>
                    <h2>用户登录</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {/*
                            用户名/密码的合法性要求:
                                1). 必须输入
                                2). 必须大于等于 4 位
                                3). 必须小于等于 12 位
                                4). 必须是英文、数字或下划线组成
                            */}
                            {/* getFieldDecorator是高阶函数需要接收两个参数：第一个为标识名称（将来想要获取输入的值就在这里面），第二个为配置对象； 括号里面是标签（<Input>），则getFieldDecorator是高阶函数。 */}
                            {
                                getFieldDecorator('username', {
                                rules: [
                                    { required: true, whitespace:true, message: '请输入用户名' },
                                    { min: 4, message: '用户名至少4为' },
                                    { max: 12, message: '用户名最多12位' },
                                    {pattern:/^[a-zA-Z0-9_]+$/, message:'用户名必须是英文、数字或下划线组成'}
                                    ],
                                    // initialValue:'admin'
                            })(
                                <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="用户名"
                                />,
                            )
                            }
                        </Form.Item>
                        <Form.Item>
                            {
                                getFieldDecorator('password', {
                                    rules: [
                                        {validator: this.validatePwd}
                                        ]
                                })(
                                    <Input
                                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        type="password"
                                        placeholder="密码"

                                    />,
                                )
                            }
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}

// create是高阶函数，
// Form是一个对象，create是form的一个方法，
// Form.create()返回的是一个函数，而函数执行需要接收一个组件(Login)
// 则Form.create()(Login)返回的为一个新的组件

// 包装Form组件，生成一个新的组件Form(Login)，该新的组件会向Form传递一个强大的form对象，form具有获取数据、表单验证等方法
const WrapLogin = Form.create()(Login)
export default WrapLogin
// 此时，WrapLogin为父组件，Login为子组件。父组件会向子组件传递东西，如传递了form对象

/*
表单输入的时候，需要;
1、前台的表单输入验证
2、收集表单输入的数据，发起请求提交
*/