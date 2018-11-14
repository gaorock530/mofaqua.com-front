import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../redux/actions';
import Spinner from './animates/spinner';

/**
 * @param {Function} renderList custom function to render list
 * @param {Array} data Array for lazyload
 * @param {Number} num Number of item of each load
 * @param {String} tab tab name to record data
 * @param {Boolean} fresh default false - force update components
 */

class lazyLoad extends Component {
  constructor (props) {
    super(props);
    /* document.body.offsetHeight - height of the document (=0 when no scroll)
       window.innerHeight         - total window height
       window.pageYOffset         - scroll bar top position */
    
    this.tab = this.props.tab;
    // used for deciding if reRender, initially True
    this.shouldUpdate = true;
    // counter of total item has loaded
    this.count = this.props.page.lazyLoad[this.tab] && this.props.page.lazyLoad[this.tab].data?this.props.page.lazyLoad[this.tab].data.length:0;
    // initial custom num
    this.num = this.props.num || 10;
    // initial custom data
    this.data = this.props.data || [];
  }
  shouldComponentUpdate () {
    if (this.shouldUpdate || this.props.fresh === true)
    return true;
    else return false;
  }
  componentWillMount () {
    // initial fisrt load OR bypass initial load
    if (!this.props.page.lazyLoad[this.tab]) {
      this.props.set_lazyload(this.tab, 0, this.num, this.data);
      // counter up
      this.count += this.num;
    }

    // add scroll event on window, enable lazyloading
    window.addEventListener('scroll', this.listenScroll, false);
  }

  /* Clear all data when Unmount component */
  componentWillUnmount () {
    window.removeEventListener('scroll', this.listenScroll, false);
  }

  /* Lazy Loading on Scroll */
  listenScroll = async () => {
    const hasLoaded = this.props.page.lazyLoad[this.tab] && this.props.page.lazyLoad[this.tab].state === null;
    const reached= document.body.offsetHeight - window.innerHeight === window.pageYOffset;
    // condition for when to reRender
    if ((reached && !hasLoaded )|| this.props.page.lazyLoad[this.tab].state === true) this.shouldUpdate = true;
    else this.shouldUpdate = false;
    // when all the content have loaded, remove scroll listener
    if (hasLoaded) {
      this.shouldUpdate = false;
      return window.removeEventListener('scroll', this.listenScroll, false);
    }
    // actual lazy loading condition
    if (reached && this.props.page.lazyLoad[this.tab].state === false) {
      await this.props.set_lazyload(this.tab, this.count, this.num, this.data);
      this.count += this.props.num;
    }
  }
  
  render () {
    return (
      <div>
        {/* use custom function recieving data */}
        {this.props.renderList(this.props.page.lazyLoad[this.tab] && this.props.page.lazyLoad[this.tab].data?this.props.page.lazyLoad[this.tab].data:[])}
        {this.props.page.lazyLoad[this.tab] && this.props.page.lazyLoad[this.tab].state === true?<Spinner padding="30px" size="15px" Stype="style2" single={false}/>:''}
      </div>
    )
  }
}

export default connect(({page}) => ({page}), actions)(lazyLoad);