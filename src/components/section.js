import React, {Component} from 'react';
import { connect } from 'react-redux';
// import cuid from 'cuid';

/**
 * @param {String} height '200px'
 * @param {String} url '/pic/reef-2.jpg' 
 */

class Section extends Component {

  componentDidMount () {
    // console.log(this.props)
  }

  render () {
    const { 
      className,
      url = false,
      cover = false
    } = this.props;
    
    const style1 = {
      'backgroundColor': cover ? 'rgba(0,0,0,'+cover+')':''
    }

    const style2 = {
      'backgroundImage': url ? 'url('+url+')': ''
    }

    return (
      <section className="home-section" style={style2}>
        <div className="section-overlay" style={style1}></div>
        <div className="section-content-wapper">
          <div className={"section-content " + className}>
            {this.props.children}
          </div>
        </div>
      </section>
    )
  }
}

export default connect(state => state, null)(Section);