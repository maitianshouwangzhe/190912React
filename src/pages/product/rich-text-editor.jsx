import React, { Component } from 'react'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import PropTypes from 'prop-types'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'

// 引入样式
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'


// 富文本编辑器组件
export default class RichTextEditor extends Component {

    static propTypes ={
        // 标签格式的字符串/文本
        detail: PropTypes.string
    }

    state = {
        //  创建一个空的编辑对象
        editorState: EditorState.createEmpty(),
    }

    // 仅仅用于修改页面的默认显示部分
    constructor(props) {
        super(props)
        const html = this.props.detail
        // 如果detail有值
        if (html){
            const contentBlock = htmlToDraft(html)
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
                const editorState = EditorState.createWithContent(contentState)
                this.state = {
                    editorState,
                }
            }
        } else {
            this.state = {
                editorState: EditorState.createEmpty()
            }
        }
    }


    // 取出输入数据对应于html格式的文本
    getDetail=()=> {
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    }

    // 输入过程中，实时调用
    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        })
    }


    uploadImageCallBack = (file) => {
        return new Promise(
            (resolve, reject) => {
                const xhr = new XMLHttpRequest()
                // 自己项目中的上传图片的接口
                xhr.open('POST', '/manage/img/upload')
                const data = new FormData()
                data.append('image', file)
                xhr.send(data)
                xhr.addEventListener('load', () => {
                    const response = JSON.parse(xhr.responseText)
                    const url = response.data.url      /*  得到图片地址 */
                    resolve({data: {link: url}})
                })
                xhr.addEventListener('error', () => {
                    const error = JSON.parse(xhr.responseText)
                    reject(error)
                })
            }
        )
    }

    render() {
        const { editorState } = this.state
        return (
            <Editor
                editorState={editorState}
                editorStyle={{border: '1px solid black', minHeight: 200, paddingLeft: 20}}
                onEditorStateChange={this.onEditorStateChange}
                toolbar={{
                    inline: { inDropdown: true },
                    list: { inDropdown: true },
                    textAlign: { inDropdown: true },
                    link: { inDropdown: true },
                    history: { inDropdown: true },
                    image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
                }}
            />
        )
    }
}