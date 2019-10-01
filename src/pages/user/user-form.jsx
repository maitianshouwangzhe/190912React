import React, {Component} from 'react'
import {Form,
    Input,
    Select} from "antd"
import PropTypes from 'prop-types'


const { Option } = Select
class UserForm extends Component{

    static propTypes = {
        getForm: PropTypes.func.isRequired,
        roles: PropTypes.array.isRequired,
        user: PropTypes.object
    }

    // 将form对象传递给父组件
    componentWillMount() {
        this.props.getForm(this.props.form)
    }

    render() {
        const {user, roles} = this.props
        const {getFieldDecorator} = this.props.form
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 16 },
        }
        return (
            <Form {...formItemLayout}>
                <Form.Item label="用户名">
                    {getFieldDecorator('username', {
                        initialValue: user.username,
                        rules: [{ required: true, message: '请输入用户名' }],
                    })(
                        <Input
                            placeholder="请输入用户名"
                        />,
                    )}
                </Form.Item>
                {
                    user._id  ?  null : (
                        <Form.Item label="密码">
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: '请输入密码' }],
                        })(
                            <Input type="password" placeholder="请输入密码"/>
                        )}
                        </Form.Item>
                    )
                }
                <Form.Item label="手机号">
                    {getFieldDecorator('phone', {
                        initialValue: user.phone,
                        rules: [{ required: true, message: '请输入手机号' }],
                    })(
                        <Input
                            placeholder="请输入手机号"
                        />,
                    )}
                </Form.Item>
                <Form.Item label="邮箱">
                    {getFieldDecorator('email', {
                        initialValue: user.email,
                        rules: [
                            {
                                type: 'email',
                                message: '邮箱格式不正确',
                            },
                            {
                                required: true,
                                message: '请输入邮箱',
                            },
                        ],
                    })(<Input placeholder="请输入邮箱"/>)}
                </Form.Item>
                <Form.Item label="角色">
                    {getFieldDecorator('role_id', {
                        initialValue: user.role_id,
                        rules: [
                            { required: true, message: '请选择角色' },
                        ],
                    })(
                        <Select placeholder='请选择'>
                            <Option value='0-0' disabled>请选择</Option>
                            {
                                roles.map(role => <Option key={role._id} value={role._id}
                                >
                                    {role.name}
                                </Option>)
                            }
                        </Select>
                    )}
                </Form.Item>
            </Form>
        )
    }
}

// 得到强大的form对象
export default Form.create()(UserForm)