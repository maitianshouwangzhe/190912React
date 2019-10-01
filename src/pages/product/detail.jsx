import React, {Component} from 'react'
import {Card, Icon, List} from "antd";

import {BASE_IMG_URL} from "../../utils/constants";
import {reqCategory} from "../../api";

export default class ProductDetail extends Component{

    state = {
        // 形如：电脑--->笔记本
        // 父级分类名称
        cName1:'',
        // 二级分类名称
        cName2:''
    }

    async componentDidMount() {
        // 获取当前商品的分类ID
        const {pCategoryId, categoryId} = this.props.location.state.product
        // 一级分类下的商品
        // 异步显示当前商品id所属的商品分类名称
        if (pCategoryId==='0'){
            const result = await reqCategory(pCategoryId)
            if (result.status===0){
                this.setState({cName1: result.data.name})
            }
        } else{
            //   二级分类下的商品
            //   一次需要发送多个请求， 只有请求全部成功，才处理
            //  传入的参数是一个多个promise数组， 返回的结果仍是一个数组
            const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
            const cName1 = results[0].data.name
            const cName2 = results[1].data.name
            this.setState({
                cName1,
                cName2
            })
        }
    }

    render() {
        // imgs是数组
        const {product} = this.props.location.state
        const {name, desc, price, detail, imgs} = product
        const {cName1, cName2} = this.state

        const title=(
            <span>
                <Icon
                    type="arrow-left"
                    style={{color: "#1890ff", marginRight: 20, fontSize:20}}
                    onClick={()=>this.props.history.goBack()}
                />
                <span style={{fontSize:20, fontWeight:"bold", }}>商品详情</span>
            </span>)

        return (
            <Card
                title={title}
                bordered={true}
                style={{ width: '100%' }}
                className='product-detail'
            >
                <List
                    bordered
                >
                    <List.Item>
                        <span className='left'>商品名称:</span>
                        <span>{name}</span>
                    </List.Item>
                    <List.Item>
                        <span className='left'>商品描述:</span>
                        <span>{desc}</span>
                    </List.Item>
                    <List.Item>
                        <span className='left'>价格:</span>
                        <span>{price}元</span>
                    </List.Item>
                    <List.Item>
                        <span className='left'>所属分类:</span>
                        <span>
                            {cName1} {cName2 ? '-->' + cName2 : ''}
                        </span>
                    </List.Item>
                    <List.Item>
                        <span className='left'>商品图片:</span>
                        <span>
                            {
                                imgs.map((img, index)=> (
                                    <img
                                        key={index}
                                        className='product-photo'
                                        src={ BASE_IMG_URL + '/' + img}
                                        alt='img'/>
                                    ))
                            }
                        </span>
                    </List.Item>
                    <List.Item>
                        <span className='left'>商品详情:</span>
                        <div dangerouslySetInnerHTML={{__html:detail}}></div>
                    </List.Item>

                </List>
            </Card>
        )
    }
}