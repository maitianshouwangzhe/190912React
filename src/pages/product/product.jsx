import React, {Component} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'

import ProductHome from './home'
import ProductAddUpdate from './add-update'
import ProductDetail from './detail'

import './product.less'

export default class Product extends Component{

    render() {
        return (
            <Switch>
                {/*  加上exact， 表示路径完全匹配   */}
                <Route exact path='/product' component={ProductHome}/>
                <Route path='/product/addupdate' component={ProductAddUpdate}/>
                <Route path='/product/detail' component={ProductDetail}/>
                <Redirect to='/product' />
            </Switch>
        )
    }
}