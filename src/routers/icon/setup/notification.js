import React, { Component } from 'react';
import { connect } from 'react-redux';

class Notice extends Component {
  render () {
    const dyOnChange = () => {

    }

    const receiveOnChange = () => {

    }
    return (
      <div>
        <div>
          <h3>邮件接收</h3>
          <p>
            <input type="radio" name="receive" ref="yes" onChange={receiveOnChange}/>
            <span>向我发送与Aquamofa动态有关的电子邮件</span>
          </p>
          <p>
            <input type="radio" name="receive" ref="no" defaultChecked onChange={receiveOnChange}/>
            <span>仅向我发送必要的服务通告电子邮件 (默认)</span>
          </p>
        </div>
        <div>
          <h3>订阅通知</h3>
          <p>对于您已开启通知功能的特定频道，通过以下方式通知我:</p>
          <p>
            <input type="radio" name="dy" ref="dy1" onChange={dyOnChange}/>
            <span>推送和电子邮件</span>
          </p>
          <p>
            <input type="radio" name="dy" ref="dy2" defaultChecked onChange={dyOnChange}/>
            <span>仅限推送（默认）</span>
          </p>
          <p>
            <input type="radio" name="dy" ref="dy3" onChange={dyOnChange}/>
            <span>仅通过电子邮件接收</span>
          </p>
          <p>
            <input type="radio" name="dy" ref="dy4" onChange={dyOnChange}/>
            <span>无</span>
          </p>
        </div>
        <div>
          <h3>自定义计划通知</h3>
          <p>
            <input type="radio" name="mo" ref="mo1" defaultChecked onChange={dyOnChange}/>
            <span>准时提醒</span>
          </p>
          <p>
            <input type="radio" name="mo" ref="mo2" onChange={dyOnChange}/>
            <span>提前
            <select>
              <option>10分钟</option> 
              <option>30分钟</option> 
              <option>1小时</option> 
              <option>2小时</option> 
              <option>5小时</option>  
              <option>10小时</option>
            </select>  
            提醒</span>
          </p>
        </div>
        <p>您的电子邮件会发送到 gaorock530@gmail.com</p>
      </div>
    )
  }
}

export default connect(state => state)(Notice);