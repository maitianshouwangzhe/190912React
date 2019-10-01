import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Form, Input} from 'antd';

// 仅仅是一个Form表单，而不是Modal对话框
class AddRoleForm extends Component {

    static propTypes = {
        // 用于父组件得到强大的form对象
        setForm: PropTypes.func.isRequired
    }

    componentWillMount() {
        this.props.setForm(this.props.form)
    }

    render() {
        // 指定formItem的布局
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        }

        // 得到form对象, 得到getFieldDecorator
        const { getFieldDecorator } = this.props.form
        return (
            <Form>
                <Form.Item label='角色名称' {...formItemLayout}>
                    {
                        getFieldDecorator('roleName', {
                            rules: [{ required: true, message: '角色名称必须输入' }],
                            initialValue: ''
                        })(
                            <Input
                                placeholder="请添加角色"
                            >
                            </Input>,
                        )}
                </Form.Item>
            </Form>
        )
    }
}

export default Form.create()(AddRoleForm)

// 虽然已经对AddRole进行了包装，但是在其他组件中引入时，仍引入AddRole