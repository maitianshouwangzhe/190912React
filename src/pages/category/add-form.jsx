import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Form, Select, Input} from 'antd';


const { Option } = Select
class AddForm extends Component {

    static propTypes = {
        // 一级分类的数组不需要重新获取，直接传递过来
        categorys: PropTypes.array.isRequired,
        // 父分类的Id
        // 一级分类的父分类的id为0， 二级分类的父id就是一级分类的id
        parentId: PropTypes.string.isRequired,
        setForm: PropTypes.func.isRequired
    }

    componentWillMount() {
        this.props.setForm(this.props.form)
    }

    render() {
        // 得到form对象, 得到getFieldDecorator
        const { getFieldDecorator } = this.props.form
        // 从父组件传递过来
        const {categorys,parentId } = this.props

        return (
            <Form>
                <Form.Item label="所属分类">
                    {
                        getFieldDecorator('parentId', {
                            initialValue: parentId,
                            rules: [{ required: true, message: '请选择所属分类' }],
                    })(
                        <Select>
                            <Option value="0">一级分类</Option>
                            {
                                categorys.map((c, index) => <Option value={c._id} key={index}>{c.name}</Option>)
                            }
                            </Select>,
                        )}
                </Form.Item>
                <Form.Item label="分类名称">
                    {
                        getFieldDecorator('categoryName', {
                            rules: [{ required: true, message: '请输入分类名称' }],
                            initialValue: ''
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

const WrapAddForm = Form.create()(AddForm);

export default WrapAddForm

// 虽然已经对AddForm进行了包装，但是在其他组件中引入时，仍引入AddForm