import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Upload, Icon, Modal, message} from 'antd'

import {reqDeleteImg} from "../../api";
import {BASE_IMG_URL} from "../../utils/constants";

// 将图片文件转成base格式
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
    })
}


// 用于上传图片的组件
// 不需要写接口请求函数， 直接再Upload组件中的action填写地址
export default class PicturesWall extends Component {

    static propTypes = {
        imgs: PropTypes.array
    }


    state = {
        // 标识是否显示大图预览的modal对话框， false就是不显示
        previewVisible: false,
        // modal对话框中大图的Url
        previewImage: '',
        // 图片image的数组（多个图片的数据）
        fileList: [
            /*{
                uid: '-1',
                name: 'image.png',
                status: 'done',
                url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            }*/
        ]
    }

    // 这段代码：仅仅用于修改页面中的默认显示部分
    // 使用constructor使用一些方法去指定状态
    constructor(props){
        super(props)
        let fileList = []
        // 如果传入有imgs传递过来
        const {imgs} = this.props
        if (imgs && imgs.length > 0){
            fileList = imgs.map((img, index) => ({
                uid: -index,
                name: img,
                status: 'done',
                url: BASE_IMG_URL + img
            }))
        }
        // 初始化状态
        this.state = {
            // 标识是否显示大图预览的modal对话框， false就是不显示
            previewVisible: false,
            // modal对话框中大图的url
            previewImage: '',
            // 所有已上传图片文件名的数组
            // 此处的语法
            fileList
        }
    }



    // 获取当前所有已上传图片的文件名
    // file.name就是文件名，返回的是一个数组
    getImgs = () => {
        return this.state.fileList.map(file => file.name)
    }



    // 点击关闭，隐藏modal对话框
    handleCancel = () => this.setState({ previewVisible: false })

    // 显示大图
    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj)
        }
        // 显示点击了指定file的大图，所以传入了file
        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        })
    }


    // 发生改变的时候调用方法
    // 对于图片的上传，这个方法一般要写大量的代码
    // 回调函数要接收的参数
    // file: 当前操作的图片文件（上传/删除）
    // fileList对象是所有已上传图片的数组
    handleChange = async ({ file, fileList}) => {
        console.log('handlechange。。。', file.status, fileList.length, file)
        // 一旦上传成功, 将当前上传的file的信息修正(修正name, 添加url)
        if (file.status==='done'){
            const result = file.response           /*  服务器返回的结果数据 ，其结构为：{status: 0, data:{} }  */
            if (result.status===0){
                message.success('上传图片成功')
                const {name, url} = result.data
                // 指定当前的操作的file，因此找到fileList的下标
                const file = fileList[fileList.length - 1]
                // 修正name和url
                file.name = name
                file.url = url
            } else {
                message.error('上传图片失败')
            }
        } else if (file.status==='remove'){      /* 删除图片，仅仅是删除了界面的图片，而没有删除服务器上的图片 */
            const result = await reqDeleteImg(file.name)
            if (result.status===0){
                message.success('删除图片成功')
            } else {
                message.error('删除图片失败')
            }
        }
        // 在操作（上传、删除）过程中，不断更新fileList的状态, 更新状态才能render渲染组件
        this.setState({ fileList })
    }

    render() {
        const { previewVisible, previewImage, fileList } = this.state
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div>上传图片</div>
            </div>
        )
        return (
            <div>
                <Upload
                    action="/manage/img/upload"        /*  上传图片的地址， 看接口文档：http://localhost:5000/manage/img/upload */
                    accept='image/*'                   /*  设定只能上传图片  */
                    listType="picture-card"            /*  上传图片后显示的样式，一种类似于卡片，一种类似于附件  */
                    name='image'                       /*  发给后台的文件参数名, 必须指定，否则后台得不到数据， 看接口文档需要指定image*/
                    fileList={fileList}                /*  所有已上传图片文件对象的数组  */
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        )
    }
}

