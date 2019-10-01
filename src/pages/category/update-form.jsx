import React, {Component} from 'react'

import { Form, Input} from 'antd';
import PropTypes from "prop-types";

class UpdateForm extends Component{
    static propType = {
        categoryName: PropTypes.string.isRequired,
        setForm: PropTypes.func.isRequired
    }

    componentWillMount() {
        // 将form对象通过setForm（）函数传递给父组件
        this.props.setForm(this.props.form)
    }

    render() {
        // 得到form对象, 得到getFieldDecorator
        const { getFieldDecorator} = this.props.form
        // 这里面不仅仅传入categoryName， 还有form对象
        // 因此用结构赋值。以后可以避免出错
        const {categoryName} = this.props
        return (
            <Form >
                <Form.Item label="分类名称">
                    {
                        getFieldDecorator('categoryName', {
                            rules: [{ required: true, message: '请输入分类名称' }],
                            initialValue: categoryName,
                        })(
                            <Input
                                placeholder="请输入分类名称"
                            >
                            </Input>,
                        )}
                </Form.Item>
            </Form>
        )
    }
}

// 为了得到强大的form对象
const WrapUpdateForm = Form.create()(UpdateForm);

export default WrapUpdateForm

