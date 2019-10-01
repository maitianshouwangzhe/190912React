import React, {Component} from 'react'
import {Card, Icon, Button, Table, message,Modal} from 'antd';

import LinkButton from "../../components/link-button/link-button";
import {reqCategorys, reqUpdateCategory, reqAddCategory} from '../../api/index'
import AddForm from "./add-form";
import UpdateForm from "./update-form";

export default class Category extends Component{
    state = {
        loading: false,
        // 一级分类列表
        categorys:[],
        // 二级分类列表
        subCategorys:[],
        // 当前需要显示的分类列表的父类id
        parentId:'0',
        // 设定当前需要显示分类列表的父类名称
        // 一级列表的父类名称为空
        parentName :'',
        // 对弹出的对话框进行指定状态，
        // 0为都不显示， 1为显示添加的对话框； 2为显示更新的对话框
        showStatus: 0,
    }

    // 点击某个指定的一级分类对象显示其二级列表
    // setState不能立即获取最新的状态，因为setState属于异步状态。
    // setState属于异步方法
    showSubCategory =(category)=> {
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => {
            // 该回调函数是在状态更新且重新render()渲染界面后才执行
            // 获取二级分类列表
            // console.log('parentId', this.state.parentId)
            this.getCategorys()
        })
    }

    // 点击一级分类列表
    // 可返回一级分类列表
    // 不需要再发请求了，状态里面存了数据。
    showCategorys = () => {
        // 更新为显示一级列表的状态
        this.setState(
            {
                parentId:'0',
                parentName:'',
                subCategorys:[]
            })
        // 由于第一次默认状态就是请求了一级列表
        // 此时状态里面存了数据，所以不需要this.getCategorys()
    }


    initColumns = ()=> {
        this.columns = [
            {
                title: '分类名称',
                dataIndex: 'name',
                render: text => <span>{text}</span>,
            },
            {
                title: '操作',
                // 指定该列的宽度
                width: 300,
                render: (category) => (
                    <span>
                        <LinkButton onClick={ () => this.showUpdate(category)}>修改分类</LinkButton>
                        {/*  如何向事件回调函数传递参数 ？ */}
                        {
                            this.state.parentId==='0'? <LinkButton onClick={ () => this.showSubCategory(category)}>查看子分类</LinkButton> : null
                        }

                    </span>
                ),
            },
        ]
    }

    componentWillMount() {
        this.initColumns()
    }

    // (parentId) 如果没指定parentId，则根据状态的parentId进行发起请求，
    // 如果指定了parentId， 则根据指定的parentId进行发起请求
    getCategorys = async (parentId) => {
        // 在发请求前，显示加载符号
        this.setState({loading: true})
        // 发起异步ajax请求，得到的结果
        parentId = parentId  ||  this.state.parentId
        const result = await reqCategorys(parentId)
        // 得到结果后，不显示加载符号
        this.setState({loading: false})
        if (result.status === 0) {
            // 取出分类数组，有可能是一级或者二级
            const categorys = result.data
            if (parentId==='0'){
                // 一级
                this.setState({categorys: categorys})
            } else {
                // 二级
                this.setState({subCategorys:categorys})
            }

        } else {
            message.error('请求分类列表失败')
        }
    }

    // 发起异步ajax请求
    componentDidMount() {
        this.getCategorys()
    }

    // 点击添加, 即可显示添加的对话框
    showAdd = () => {
        this.setState({showStatus: 1})
    }

    // 添加分类
    addCategory = async () =>  {
        // 关闭或隐藏对话框
        this.setState({showStatus: 0})
        // 1、收集数据， 提交请求
        const {parentId, categoryName} = this.form.getFieldsValue()
        // 清除输入的内容，否则会保存到缓存中
        this.form.resetFields()
        const result = await reqAddCategory(parentId, categoryName)
        if (result.status===0){
            if (parentId===this.state.parentId){
                // 重新获取当前分类列表， 即：想要添加的分类就是当前页的分类
                this.getCategorys()
            } else if (parentId==='0'){
                // 需求：在二级分类列表下，添加一级分类后， 重新获取一级分类列表， 但是不需要显示一级列表
                this.getCategorys('0')
            }
        }
    }


    // 显示更新修改商品名称的对话框
    showUpdate = (category ) => {
        // 一旦点击，就保存分类的对象
        // 让其他方法使用
        this.category = category
        this.setState({
            showStatus:2
        })
    }


    // 更新分类
    updateCategory= () => {
        this.form.validateFields(async(error, values) => {
            if (!error){
                // 1、准备数据
                const categoryId = this.category._id
                // category是自己输入的数据！！！！ 怎么得到自己输入的数据？ 输入的数据只能从输入里面取
                // 由于当前组件（父组件没有form对象）， 而子组件有。需要将子组件中的form对象传递给父组件
                // 第一种写法
                // const categoryName = this.form.getFieldValue('categoryName')
                const {categoryName} = values
                // 得到数据以后，必须清除form对象中输入的数据, 如果不清除，则会将输入的值保存到缓存中
                // 同理， 取消的时候，也必须做到重置输入数据
                this.form.resetFields()
                // 2、 准备数据完毕，发起请求是为了重新显示
                const result = await reqUpdateCategory(categoryId, categoryName)
                if (result.status===0) {
                    // 重新显示列表
                    this.getCategorys()
                }
                // 隐藏或关闭对话框
                this.setState({showStatus: 0})
            }
        })

    }

    // 点击隐藏对话框
    handleCancel=() => {
        // 清除输入数据
        this.form.resetFields()
        this.setState({showStatus:0})

    }


    render() {
        // 读取状态数据
        const {categorys, subCategorys, parentId, parentName,loading, showStatus} = this.state
        //  读取指定的分类, 但是初始值是空
        const category = this.category || {}
        const title = parentId==='0' ? '一级分类列表':(
            <span>
                <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
                <Icon type="arrow-right" style={{marginRight:'5px'}} />
                <span>{parentName}</span>
            </span>)
        const extra = (
            <Button type="primary" onClick={this.showAdd}><Icon type="plus" />添加</Button>
        )

        return (
            <Card
                title={title}
                extra={extra}
                style={{ width: '100%', height: '100%'}}>
                <Table
                    columns={this.columns}
                    dataSource={parentId==='0'? categorys : subCategorys}
                    bordered={true}
                    rowKey='_id'
                    loading={loading}
                    pagination={{
                        defaultPageSize:5,  position:'bottom', showQuickJumper:true,
                    }}
                    // scroll={{ y: 200 }}
                />
                {/* 添加的对话框 */}
                <Modal
                    title="添加分类"
                    visible={showStatus===1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    <AddForm
                        categorys={categorys}
                        parentId={parentId}
                        subCategorys={subCategorys}
                        setForm={(form)=>{ this.form= form}}/>
                </Modal>

                {/* 修改的对话框 */}
                <Modal
                    title="修改分类"
                    visible={showStatus===2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                    <UpdateForm
                        categoryName={category.name}
                        setForm={ (form) => {this.form = form} }
                    />
                </Modal>
            </Card>
        )
    }
}
