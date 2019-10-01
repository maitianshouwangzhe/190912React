import React, {Component} from 'react'
import {Card, Button, Table, Modal, message} from 'antd';
import {PAGE_SIZE} from "../../utils/constants";
import {reqRoles, reqAddRole, reqUpdateRole} from "../../api";
import AddRole from "./add-role-form";
import AuthForm from "./auth-form";
import memoryUtils from "../../utils/memoryUtils";
import {formatDate} from "../../utils/dateUtils";
import storageUtils from "../../utils/storageUtils";

export default class Role extends Component{
    state = {
        roles:[],
        role:{},
        isShowAdd:false,    /* 是否显示添加角色的对话框 */
        isShowAuth: false
    }

    constructor(props){
        super(props)
        // 创建一个容器
        this.auth = React.createRef()
    }


    initColumns=()=>{
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name',
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: (create_time) => formatDate(create_time)

            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: formatDate   /* render后面需要指定一个函数，函数接收的参数就是auth_time， 返回的是一个值   */
            },
            {
                title: '授权人',
                dataIndex: 'auth_name',
            },
        ];
    }


    // 添加角色
    addRole = () => {
        // 1、进行表单验证， 只有通过验证了，才进行下一步处理
        this.form.validateFields(async (error, values) => {
            if (!error){
                // 2、收集form表单中输入的数据
                const {roleName} = values
                // 3、清空当前输入的数据
                this.form.resetFields()
                // 4、 发起添加请求
                const result = await reqAddRole(roleName)
                // 5、重新显示角色列表
                if (result.status===0){
                    message.success('添加角色成功')
                    // 第一种方法： 重新显示角色列表, 即：发起查找请求
                    // this.getRoles()
                    // 第二种方法： 重新显示角色列表， 在原本的状态的基础上进行更新。
                    // [注：setState一般传入的是对象（用小括号包住对象）， 还可以传入函数]
                    const role = result.data
                    this.setState(state => ({
                        roles:[...state.roles, role]
                    }))
                } else {
                    message.error('添加角色失败')
                }
                // 无错误的情况下，隐藏对话框
                this.setState({isShowAdd: false})
            }})
    }

    // 设置角色权限
    authRole = async () => {
        // 取出当前点击的role
        const role = this.state.role
        // 得到授权人，且授权人为当前登录的用户名
        role.auth_name = memoryUtils.user.username
        //得到授权时间
        role.auth_time = Date.now()
        // 调用子组件的方法，
        // 得到最新的menus
        const menus = this.auth.current.getMenus()
        role.menus = menus
        const result = await reqUpdateRole(role)
        if (result.status===0){
            // 如果当前更新的是自己角色的权限，则强制退出, 跳转到登录页面，重新登录
            if (role._id === memoryUtils.user.role_id) {
                // 置空当前的登录的数据
                memoryUtils.user = {}
                storageUtils.removeUser()
                this.props.history.replace('/login')
                message.success('当前用户的权限发生改变，请重新登录')
            } else {
                message.success('设置角色权限成功')
                //第一种方法： 重新显示角色列表
                // this.getRoles()
                //第二种方法： 重新显示角色列表
                this.setState({
                    roles: [...this.state.roles]
                })
            }
        }
        // 隐藏对话框
        this.setState({isShowAuth: false})
    }


    componentWillMount(){
        this.initColumns()
    }


    getRoles = async ()=> {
        const result = await reqRoles()
        if (result.status===0){
            const roles = result.data
            this.setState({roles: roles})
        }
    }
    componentDidMount(){
        this.getRoles()
    }

    // 点击行的操作
    onRow=(role)=>{
        return {
            onClick: event => {
                console.log('一行的数据', role)
                //一旦点击就更新了role的状态
                this.setState({role})
            },    // 点击行
        }
    }

    render() {
        const { roles, role, isShowAdd, isShowAuth } = this.state;
        const title =  (
            <span>
                <Button type="primary" style={{marginRight: 15}} onClick={() => this.setState({isShowAdd: true}) }>创建角色</Button>
                <Button type="primary" disabled={! role._id} onClick={ () => this.setState({isShowAuth: true}) }>设置角色权限</Button>
            </span>
        )
        return (
            <Card
                title={title}
                style={{ width: '100%' }}
            >
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={roles}
                    columns={this.columns}
                    pagination={{defaultPageSize:PAGE_SIZE}}
                    rowSelection={{
                        type:'radio',
                        selectedRowKeys:[role._id],   // 点击整行时回调
                        onSelect: (role) => {       // 点击某个radio时回调
                            this.setState({
                                role
                            })
                        }
                    }}   /*  每一行前面的选择， 根据是否有id选中该行， 则初始状态为空对象 */
                    onRow={this.onRow}   /*  设置行属性： 看接口文档，是回调函数，可以写成这种形式 */
                />
                {/* 添加的对话框 */}
                <Modal
                    title="添加角色"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={() => {
                        this.setState({isShowAdd: false})
                        this.form.resetFields()
                    }}
                >
                    <AddRole
                        setForm={(form)=> { this.form= form } }
                    />
                </Modal>

                {/* 设置权限的对话框 */}
                <Modal
                    title="设置角色权限"
                    visible={isShowAuth}
                    onOk={this.authRole}
                    onCancel={() =>{
                        this.setState({isShowAuth: false})
                    }}
                >
                    <AuthForm ref={this.auth} role={role}/>
                </Modal>
            </Card>
        )
    }
}