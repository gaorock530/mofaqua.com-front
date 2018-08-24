import React, { Component } from 'react';
import { connect } from 'react-redux';

class Channel extends Component {
  render () {
    const showOnChange = () => {

    }
    return (
      <div>
        <div>
          <h3>对外公开</h3>
          <p>
            <input type="radio" name="show" value='show1' defaultChecked onChange={showOnChange}/>
            <span>所有人可见 (默认)</span>
          </p>
          <p>
            <input type="radio" name="show" value='show2' onChange={showOnChange}/>
            <span>仅朋友</span>
          </p>
          <p>
            <input type="radio" name="show" value='show3' onChange={showOnChange}/>
            <span>仅自己</span>
          </p>
        </div>
      </div>
    )
  }
}

export default connect(state => state)(Channel);