import React, { Component } from 'react';
import { connect } from 'react-redux';

class Privacy extends Component {
  render () {
    const friendOnChange = (e) => {
      console.log(e.target.value);
    }
    const talkOnChange = (e) => {
      console.log(e.target.value);
    }
    return (
      <div>
        <div>
          <h3>添加好友</h3>
          <p>
            <input type="radio" name="friend" value='friend1' defaultChecked onChange={friendOnChange}/>
            <span>任何人可以添加 (默认)</span>
          </p>
          <p>
            <input type="radio" name="friend" value='friend2' onChange={friendOnChange}/>
            <span>必须经过同意才可添加</span>
          </p>
          <p>
            <input type="radio" name="friend" value='friend3' onChange={friendOnChange}/>
            <span>禁止任何人添加</span>
          </p>
        </div>
        <div>
          <h3>聊天与对话</h3>
          <p>
            <input type="radio" name="talk" value="talk1" defaultChecked onChange={talkOnChange}/>
            <span>任何人（默认）</span>
          </p>
          <p>
            <input type="radio" name="talk" value="talk2" onChange={talkOnChange}/>
            <span>仅朋友</span>
          </p>
          <p>
            <input type="radio" name="talk" value="talk3" onChange={talkOnChange}/>
            <span>不接收任何人的消息</span>
          </p>
        </div>
      </div>
    )
  }
}

export default connect(state => state)(Privacy);