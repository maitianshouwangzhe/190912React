import React, {Component} from 'react'
import {Card, Form, Input, Icon, Button, Cascader, message} from "antd"
import PicturesWall from "./pictures-wall";

import LinkButton from "../../components/link-button/link-button"
import {reqCategorys, reqAddOrUpdateProduct} from "../../api";
import RichTextEditor from "./rich-text-editor";

const { TextArea } = Input



class ProductAddUpdate extends Component{

    state = {
        options:[]
    }


    constructor(props){
        super(props)
        // 创建用于保存ref标识的标签对象的容器
        // 创建一个ref 来存储 pw 的DOM元素
        // 创建一个ref 来存储 editor 的DOM元素
        this.pw = React.createRef()
        this.editor = React.createRef()
    }



    // 验证价格的自定义函数
    // 看api文档，传三个参数
    // 此时，输入的value不是数值，而是数值型字符串
    // 无论是否成功，callback必须调用
    validatePrice=(rule, value, callback)=> {
        // console.log(value, typeof value)
        if ( value*1 > 0){
            callback()
        } else {
            //验证不通过
            callback('输入的价格必须大于0')
        }
    }




    // 根据categorys数组，得到options数组，用于select选择
    // 并更新状态
    initOptions = async (categorys) => {
        // 如果回调函数返回的是对象， 必须加上小括号
        const options= categorys.map((c, index) => (
            {
                value: c._id,       /* 背后收集的数据 */
                label: c.name,
                isLeaf: false,     /* 是否是叶子， 如果是页子则没有下一级别 */
            }))

        // (进入到修改页面时。。。。。。执行这段代码)
        // 如果是一个二级商品的更新修改
        const {isUpdate, product} = this
        const {pCategoryId} = product
        if (isUpdate && pCategoryId !== '0'){
            // 获取对应的二级分类列表，
            // 则传入的参数为二级列表的父分类id
            const subCategorys= await this.getCategory(pCategoryId)
            // 获取得到之后，生成二级下拉列表的options
            const childOptions = subCategorys.map((s, index) =>({
                value: s._id,
                label: s.name,
                isLeaf: true,
            }))
            // 关键要找到当前商品所对应的一级option对象
            // find方法，依次遍历查找出符合条件的
            const targetOption = options.find(option => option.value === pCategoryId)
            // 关联到对应于一级分类的option下
            targetOption.children = childOptions
        }
        // 更新options状态
        this.setState({
            options: options
        })
    }






    // 注意： async函数的返回值是一个新的promise对象，该promise的结果和值由asyns来决定
    getCategory= async (parentId)=> {
        const result = await reqCategorys(parentId)
        if (result.status===0){
            const categorys = result.data
            if (parentId==='0'){
                //根据categorys数组，得到options数组，用于select选择
                this.initOptions(categorys)
            } else {
                // 二级列表（视频73）
                return categorys           /*  返回二级列表， 就意味着当前asyns函数返回的promise就会成功，且value（请求的结果）为categorys  */
            }
        }
    }


    componentWillMount() {
        // 将product传递过来以后，在location的state里面，将其取出
        const product = this.props.location.state
        // 强制转成布尔类型的数值。 （假如product有值， 则！product就是没有值 [没有值就是false]，！！product就是对应这布尔值的true）
        // 意义：保存是否是修改更新的标识。如果点击的是修改更新，则为true，如果点击的是添加， 则为false。
        this.isUpdate = !! product
        this.product = product || {}   /*如果进入的是添加商品，则product为空。 不这么写，一旦点击添加商品则必然报错 */
    }

    componentDidMount() {
        this.getCategory('0')
    }


    // 用于加载下一级列表的回调函数
    loadData = async (selectedOptions)=> {
        // 得到选择的option对象
        const targetOption = selectedOptions[0]
        // 显示加载的旋转符号
        targetOption.loading = true
        // 根据选中的分类
        // 发起请求， 加载下一级分类的列表
        // 传入的参数为parentId，后台获取的是value
        // 则可以根据选中的分类获得其id, 其id就是下一级分类的parentId
        // 得到二级列表subCategory数组， 并根据subCategory数组生成新的option对象，
        const subCategorys = await this.getCategory(targetOption.value)
        targetOption.loading = false
        if (subCategorys && subCategorys.length > 0) {
            // 生成二级分类列表的options
            const childOptions = subCategorys.map((s, index) => ({
                value: s._id,       /* 背后收集的数据 */
                label: s.name,
                isLeaf: true,
            }))
            // 将当前的childOptions关联到当前的targetOption.children上
            targetOption.children = childOptions
        } else {
            // 当前选中的分类没有二级分类
            targetOption.isLeaf = true
        }
        // 发起请求以后，更新状态
        // 更新options状态
        this.setState({options:[...this.state.options]})
    }


    submit=()=>{
        // 进行全部的表单验证， 并收集得到的数据
        // 如果验证通过，则才发送添加的请求
        this.props.form.validateFields(async (error, values)=>{
            if (!error){
                // <Cascader>组件中收集到是分类的id, 且第一个是一级分类id， 第二是二级分类id， 则收集到的数据是数组类型

                // 1、收集全部的数据, 并封装成product对象
                const { name, desc, price, categoryIds} = values
                let pCategoryId, categoryId
                if (categoryIds.length===1){
                    pCategoryId ='0'
                    categoryId = categoryIds[0]
                } else {
                    pCategoryId = categoryIds[0]
                    categoryId = categoryIds[1]
                }
                // 取出图片
                const imgs = this.pw.current.getImgs()
                // 取detail详情
                const detail = this.editor.current.getDetail()
                console.log('submit...', values, imgs, detail)
                // 取出全部数据完毕，封装成一个product对象
                const product = { name, desc, price, imgs, detail, pCategoryId, categoryId}
                // 如果是更新，则需要添加id
                if (this.isUpdate){
                    product._id = this.product._id
                }
                // 2、调用接口请求函数去添加或更新
                const result =  await reqAddOrUpdateProduct(product)
                // 3、根据结果提示
                if (result.status===0){
                    message.success(`${this.isUpdate ? '修改' : '增加'}商品成功！`)
                    // 添加或更新商品成功后返回到商品列表
                    this.props.history.goBack()
                } else {
                    message.error(this.isUpdate ? ' 修改商品失败 ' : ' 添加商品失败 ')
                }
            }
        })
    }


    render() {

        const {getFieldDecorator} = this.props.form
        const {isUpdate, product} = this
        // 取出商品的父分类id和该商品的id，用于修改更新页面的默认级联显示
        const {pCategoryId, categoryId, imgs, detail} = product
        // debugger
        // 用于接收级联分类ID的数组，开始为空的数组
        const categoryIds = []
        if (isUpdate){
            if (pCategoryId==='0'){
                // 商品是一级分类的的商品，则一级商品的父id为0
                // 只需要添加该商品的id
                categoryIds.push(categoryId)
            } else {
                // 商品是二级分类的的商品
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
        }

        const title=(
            <span>
                <LinkButton onClick={()=>this.props.history.goBack()}>
                    <Icon type="arrow-left" style={{marginRight:10, fontSize:20}}/>
                </LinkButton>
                <span style={{fontSize:20, fontWeight:"bolder"}}>{isUpdate ? '修改商品' : '添加商品'}</span>
            </span>
        )
        // 指定formItem的布局
        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 8 },
        }


        return (
            <Card
                title={title}
                bordered={true}
                style={{ width: '100%' }}>
                <Form {...formItemLayout}>
                    <Form.Item label="商品名称">
                        {getFieldDecorator('name', {
                            initialValue: product.name,
                            rules: [{ required: true, message: '商品名称必须输入' }],
                        })(<Input placeholder='请输入商品名称'/>)}
                    </Form.Item>
                    <Form.Item label="商品描述">
                        {getFieldDecorator('desc', {
                            initialValue: product.desc,
                            rules: [{ required: true, message: '请输入商品描述' }],
                        })(<TextArea autosize={{ minRows: 2, maxRows: 6 }}/>)}
                    </Form.Item>
                    <Form.Item label="商品价格">
                        {getFieldDecorator('price',
                            {
                                initialValue: JSON.stringify(product.price),
                                rules: [
                                    {required: true, message: '请输入商品价格' },
                                    { validator: this.validatePrice},
                                    { whitespace: true},
                                    ],
                        })(isUpdate ? <Input addonAfter='元'/> : <Input type='number' addonAfter='元'/>)}
                    </Form.Item>
                    <Form.Item label="商品分类">
                        {getFieldDecorator('categoryIds', {
                            initialValue: categoryIds,
                            rules: [{ required: true, message: '请指定商品分类' }],
                        })(
                            <Cascader
                                options={this.state.options}    /*需要显示的列表数据*/
                                loadData={this.loadData}        /*当选择某个列表项时，加载下一级列表的监听回调函数*/
                                placeholder='请选择所属的分类'
                            />
                        )}
                    </Form.Item>
                    <Form.Item label="商品图片">
                        <PicturesWall ref={this.pw} imgs={imgs}/>
                    </Form.Item>
                    <Form.Item label="商品详情" labelCol={ {span: 2 }} wrapperCol={{ span: 20}} >
                        <RichTextEditor ref={this.editor} detail={detail}/>
                    </Form.Item>
                    <Form.Item >
                        <Button type="primary" onClick={this.submit}>提交</Button>
                    </Form.Item>
                </Form>
            </Card>
        )
    }
}

// 得到强大的form对象
export default Form.create()(ProductAddUpdate)