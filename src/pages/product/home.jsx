import React, {Component} from 'react'
import {Card, Table, Icon, Button, Select, Input, message} from 'antd'
import LinkButton from "../../components/link-button/link-button";
import {reqProducts, reqSearchProducts, reqUpdateStatus} from "../../api";

import {PAGE_SIZE} from "../../utils/constants";

const { Option } = Select;
// Product的默认子路由界面
export default class ProductHome extends Component{
    state = {
        // 商品的数组
        products:[],
        total:0,
        loading: false,
        // 搜索类型， 默认按照商品名称
        searchType:'productName',
        // 输入的关键字
        searchName:'',
    }

    updateStatus = async (productId, status) => {
        const result = await reqUpdateStatus(productId, status)
        if (result.status===0){
            message.success('成功更新商品状态')
            // 商品当前处于第几页
            this.getProducts(this.pageNum)
    }}




    // 得到表格的列，在render渲染之前
    initColomns =() => {
        // 存到this里面去
        this.columns=[
            {
                title: '商品名称',
                dataIndex: 'name',
                width: 100
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
                width: 500,
            },
            {
                title: '价格',
                dataIndex: 'price',
                width: 100,
                // 由于当前指定了dataIndex属性，则只能传入price
                render:(price) => ('￥'+ price)
            },
            {
                title: '状态',
                width: 120,
                // 类比上一个，
                // （上一个）用小括号，则省略return
                //  此处用大括号，则必须有return
                render: (product) => {
                    const {status, _id} = product
                    // 更改status， 如果status是为1， 则newStatus为2
                    const newStatus =  status=== 1 ? 2 : 1
                    // debugger
                    return (
                        <span>
                            <Button
                                type="primary"
                                onClick={()=>this.updateStatus(_id, newStatus)}
                            >
                                {
                                    status === 1 ? '下架' : '上架'
                                }
                            </Button>
                            <span>
                                {
                                    status=== 1 ? '在售' : '已下架'
                                }
                            </span>
                        </span>
                    )
                }
            },
            {
                title: '操作',
                // 指定宽度
                width: 100,
                render: (product) => (
                    <div>
                        {/* 将product对象作为state传递给目标路由组件 */}
                        <LinkButton onClick={()=>this.props.history.push('/product/detail', {product})} >详情</LinkButton>
                        <LinkButton onClick={()=>this.props.history.push('/product/addupdate', product) }>修改</LinkButton>
                    </div>
                ),
            },
        ];
}


    componentWillMount(){
        this.initColomns()
    }

    // 获取指定页码的数据，并显示
    // pageNum 为页码（第几页）， PAGE_SIZE为每页数量
    getProducts = async(pageNum) => {
        // 保存页码， 让其他方法使用
        this.pageNum = pageNum
        this.setState({loading: true})
        const {searchType, searchName} =  this.state
        // 定义一个result
        let result
        if (searchName){
            result = await reqSearchProducts({pageNum, pageSize:PAGE_SIZE, searchName, searchType})
        } else {
            result = await reqProducts(pageNum, PAGE_SIZE)
        }
        this.setState({loading:false})
        if (result.status===0){
            const {total, list} = result.data
            this.setState({
                total:total,
                products:list
            })
        }
        }

    componentDidMount() {
        this.getProducts(1)
    }

    render() {
        const {products, total, loading, searchType, searchName} =this.state
        const title=(
            <span>
                <Select
                    value={searchType}
                    onChange={value => this.setState({searchType: value})}>
                    <Option value='productName'>按名称搜索</Option>
                    <Option value="productDesc">按描述搜索</Option>
                </Select>
                <Input
                    style={{ width: '15%', margin:'0px 10px' }}
                    placeholder='关键字'
                    allowClear={true}
                    value={searchName}
                    onChange={e => {this.setState({searchName: e.target.value})}}
                />
                <Button type="primary"
                        onClick={()=>this.getProducts(1)}
                >
                    搜索
                </Button>
            </span>
        )
        const extra = (
            <Button type="primary" onClick={() => this.props.history.push('/product/addupdate')}><Icon type="plus" />添加商品</Button>
        )
        return (
            <Card
                title={title}
                extra={extra}
                style={{ width: '100%', height: '100%' }}
            >
                <Table
                    rowKey='_id'
                    columns={this.columns}
                    dataSource={products}
                    bordered
                    loading={loading}
                    pagination={{
                        current: this.pageNum,
                        defaultPageSize:PAGE_SIZE,
                        showQuickJumper: true,
                        total:total,
                        onChange: this.getProducts,
                    }}
                />
            </Card>
        )
    }
}