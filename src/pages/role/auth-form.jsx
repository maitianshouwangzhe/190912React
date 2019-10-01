import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Form, Input, Tree} from "antd"


import menuList from "../../config/menuConfig"

const { TreeNode } = Tree

export default class AuthForm extends Component{
     static propTypes = {
         role: PropTypes.object.isRequired,
     }


     constructor(props){
         super(props)

         // 根据传入的role生成menus的初始化状态
         const {menus} = this.props.role
         this.state = {
             checkedKeys:menus
         }
     }



    // 一旦点击某个node时的回调函数(虽然有默认选中)
    // checkedKeys为全部选中的数组
    onCheck = checkedKeys => {
        console.log('onCheck', checkedKeys)
        this.setState({ checkedKeys })
    }


    // 根据menuList生成
    getTreeNodes = (menuList )=> {
         return menuList.reduce((pre, item) => {
             pre.push(
                 <TreeNode title={item.title} key={item.key} >
                     {
                         item.children ? this.getTreeNodes(item.children) : null         /*  如果有子级，则不断递归调用   */
                     }
                 </TreeNode>
             )
             return pre
         }, [])
    }

     // 得到treeNodes
     componentWillMount(){
         // 传入menuList， 即：根据menuList生成treeNodes
         this.treeNodes = this.getTreeNodes(menuList)
     }

     // 没有这段代码，则上次修改选中的记录会保存到下一个点击的role的初始状态。
     // 则根据新传入的role来更新恢复原本的checkedKeys状态
     // 这个方法初始显示时，不会调用，仅仅在更新数据的时候才会调用。
     //请注意: 如果父组件导致组件重新渲染，即使 props 没有更改（例如再次点击该role或取消更改），也会调用此方法。
     componentWillReceiveProps(nextProps){
         console.log('componentWillReceiveProps(nextProps)', nextProps)
         const menus = nextProps.role.menus
         // 方法1
         this.setState({checkedKeys:menus})
         // 方法2
         // this.state.checkedKeys = menus
     }


    // 收集数据：收集到点击选中的数据
    getMenus = () => this.state.checkedKeys


    render() {
         console.log('AuthForm render()......')
         // 指定formItem的布局
         const formItemLayout = {
             labelCol: { span: 4 },
             wrapperCol: { span: 16 },
         }
         const {role} = this.props
         const {checkedKeys} = this.state
         return (
             <div>
                 <Form>
                     <Form.Item label='角色名称' {...formItemLayout}>
                         <Input value={role.name} disabled />
                     </Form.Item>
                 </Form>
                 <Tree
                     checkable   /*  前面的选择框 */
                     defaultExpandAll={true}
                     checkedKeys={checkedKeys}       /* 将menus的值与<TreeNode>中的key进行匹配， 一旦与key匹配则可以选中  */
                     onCheck={this.onCheck}
                 >
                     <TreeNode title="平台权限" key="0">
                         {
                             this.treeNodes
                         }
                     </TreeNode>
                 </Tree>
             </div>

         )
     }
}