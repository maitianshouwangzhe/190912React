import React, {Component} from 'react'
import {Button, Card, Table, Modal, message} from 'antd'
import LinkButton from "../../components/link-button/link-button"

import UserForm from './user-form'
import {reqUsers, reqAddOrUpdateUser, reqDeleteUser} from "../../api"
import {formatDate} from "../../utils/dateUtils"



const { confirm } = Modal
export default class User extends Component{
    state = {
        // 用户列表
        users:[],
        // 所有角色列表
        roles:[],
        // 添加或修改的对话框
        isShow: false,
    }



    // 删除指定用户
    // confirm有自动关闭的功能
    showDeleteConfirm = (user) => {
        confirm({
            title: `确定删除${user.username}吗?`,
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk: async () => {
                // 发起请求
                const result = await reqDeleteUser(user._id)
                if (result.status===0){
                    message.success('删除用户成功')
                    this.getUsers()
                }
            }
        })
    }




    initColumns = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username',
            },
            {
                title: '邮箱',
                dataIndex: 'email',
            },
            {
                title: '电话',
                dataIndex: 'phone',
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render: formatDate
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                render: (role_id) => this.roleNames[role_id]
                // render: (role_id) => this.state.roles.find(role => role._id === role_id).name
            },
            {
                title: '操作',
                render: (user) => (
                    <span>
                        <LinkButton onClick={ () => this.showUpdate(user)}>修改</LinkButton>
                        <LinkButton onClick={ () => this.showDeleteConfirm(user)}>删除</LinkButton>
                    </span>
                ),
            },
        ]
    }
    componentWillMount() {
        this.initColumns()
    }


    // 根据角色列表的roles数组, 生成包含所有角色名的对象(属性名用角色id)
    // 初始值是一个空对象
    initRoleNames = (roles) => {
        const roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name
            return pre
            }, {})
        // console.log('roleNames。。。。', roleNames)
        this.roleNames = roleNames
    }


    // 获取用户列表
    getUsers = async () => {
        const result = await reqUsers()
        if (result.status===0){
            const {users, roles} = result.data
            this.initRoleNames(roles)
            this.setState({
                users,
                roles
            })
        }
    }


    // 显示添加的对话框
    showAdd = () => {
        // 去除前面保存的user，将其置空。便于添加
        this.user = null
        this.setState({isShow: true})
    }


    // 显示修改页面
    // 既需要传递数据user，还需要将对话框显示出来。（写一个方法）
    showUpdate=(user)=> {
        this.user = user
        this.setState({isShow: true})
    }


    //添加或修改用户
    addOrUpdateUser =() => {
        this.form.validateFields(async (error, values) => {
            if (!error) {
                // 1、收集输入数据
                const user = values
                // 2、清空输入的数据
                this.form.resetFields()
                // 3、如果是更新修改, 需要给user指定_id属性
                if (this.user){
                    user._id = this.user._id
                }
                console.log('收集得到的user。。。。', user)
                // 4、发起请求
                const result = await reqAddOrUpdateUser(user)
                if (result.status===0){
                    // 5、新显示列表
                    message.success(`${this.user ? '修改' : '添加'}用户成功`)
                    this.getUsers()
                }
                // 隐藏对话框
                this.setState({isShow: false})
            }
        })
    }


    componentDidMount(){
        this.getUsers()
    }


    render() {
        const title = (
            <Button type="primary" onClick={this.showAdd}>创建用户</Button>
        )
        const {users, isShow, roles} = this.state
        const user = this.user || {}


        return (
            <Card title={title} style={{ width: '100%' }}>
                <Table
                    bordered
                    rowKey='_id'
                    columns={this.columns}
                    dataSource={users}
                />
                <Modal
                    title = { user._id ? '修改用户': ' 添加用户'}
                    visible={isShow}
                    onOk={this.addOrUpdateUser}
                    onCancel= {
                         () => {
                             this.setState({isShow: false})
                             this.form.resetFields()
                         }
                    }
                >
                    <UserForm
                        getForm={ form => this.form = form }
                        user={user}
                        roles={roles}
                    />
                </Modal>
            </Card>
        )
    }
}