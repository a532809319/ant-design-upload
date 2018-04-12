import React,{ Component } from 'react'
import PropTypes from 'prop-types'
import Nav from '../../components/Layout/Nav'
import {
  connect
} from 'dva'
import {
  Input,
  Button,
  Modal,
  Table,
  Select,
  Cascader,
  message,
  Form,
  Upload, 
  Icon
} from 'antd'


import axios from 'axios';
const Dragger = Upload.Dragger
import {
  Link,
} from 'dva/router'
import {
  Helmet
} from 'react-helmet' // 可复用head

import UCWrapper from './UCWrapper'
import Cookie from '../../utils/Cookie'

const Search = Input.Search

class appAdmin extends React.Component {
  constructor(props) {
    super(props)
    this.state={
      fileList:[],
      fvalue:'',
      fAppId:'',
      fAppSrc:'',
    }
    this.file=null;
  }
  componentWillMount(){
    let {
      dispatch,
    } = this.props

    dispatch({
      type:'appAdmin/changeMode',
      payload:{
        mode:'list',
      }
    })
  }
  handleUpload= () => {
    //1、Content-Type修改为'multipart/form-data',
    //2、超时请求
    //3、检查接口是否做大小限制
    const { fileList } = this.state;

    const formData = new FormData();
    formData.append('atype', 1);
    fileList.forEach((file) => {
      formData.append('file', file);
    });

    const config ={
      headers:{
        'Content-Type':'multipart/form-data',
        'Authorization': Cookie.get('fupload'),
      },
    }
    
    const instance = axios.create();
    instance.defaults.timeout =  160000;
    instance.post('url', formData,config).then( res => {
      console.log('文件上传成功',res)
      message.success('文件上传成功')
      this.setState({
        fAppId:res.data.data.id,
        fAppSrc:res.data.data.src,
      })
    }).catch( err => message.error('文件上传失败，请重试'))

  }
  render() {
    let {
      location,
      dispatch,
      appAdmin,
      loading
    } = this.props

    let {
      info,
    } = appAdmin

    const props={
      name: 'file',
      accept:'.apk',
      action:'url',
      multiple:false,
      supportServerRender:true,
      onRemove: (file) => {
        this.setState(({ fileList }) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      }, 
      beforeUpload: (file) => {
        console.log('beforeUpload:',file)
        this.setState((state) => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      fileList: this.state.fileList,
    }
    
    return (
      <UCWrapper title="upload" curgroup="appAdmin">
        <Helmet>
          <title>upload</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0" />
          <meta name="renderer" content="webkit" />
          <meta charset="utf-8" />
          <link rel="stylesheet" type="text/css" href="/css/user/user.css" />
        </Helmet>
        <div>
          <Upload {...props} fileList={this.state.fileList}>
            <Button>
              <Icon type="upload" /> 选择文件
            </Button>
          </Upload>
          <Button
            className="upload-demo-start"
            type="primary"
            onClick={this.handleUpload}
          >
            上传
          </Button>
        </div>
      </UCWrapper>
    )
  }
}
export default connect(
  ({
    appAdmin,
    loading
  }) => ({
    appAdmin,
    loading: loading.models.appAdmin
  })
)(appAdmin)
