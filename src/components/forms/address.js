import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions';
import axios from 'axios';
import Select from './select';

/**
 * @prop {Fuuction} list list address -> list(address, complete)
 */

class Address extends PureComponent {
  constructor (props) {
    super(props);
    this.area = [];
    this.address = {
      province: '',
      city: '',
      area: '',
    }
    this.data = {
      province: null,
      city: null,
      area: null
    }
    this.select = {
      province: 0,
      city: 0,
      area: 0
    }
    this.first = '请选择';
    this.third = true;
    this.complete = false;
  }

  async componentWillMount () {
    try {
      const data = await axios({
        method: 'get',
        url: 'https://localhost:5000/citylist',
        responseType: 'json'
      });
      this.area = data.data;
      this.forceUpdate();
    } catch(e) {
      console.log(e);
    }
  }

  renderState = () => {
    if (this.area[0]) {
      const list = [this.first];
      for (let i of this.area[0]) {
        list.push(i.fullname);
      }
      return list;
    } else {
      return [this.first];
    }
  }

  renderCity = () => {
    if (this.data.province !== null) {
      const list = [this.first];
      const s = this.data.province.cidx;
      const range = this.area[1].slice(s[0], s[1]+1);
      for (let i of range) {
        list.push(i.fullname);
      }
      return list;
    } else {
      return [this.first];
    }
  }

  renderArea = () => {
    if (this.data.city !== null) {
      const list = [this.first];
      const s = this.data.city.cidx;
      if (!s) return [this.first];
      const range = this.area[2].slice(s[0], s[1]+1);
      for (let i of range) {
        list.push(i.fullname);
      }
      return list;
    } else {
      return [this.first];
    }
  }

  stateChange = (v) => {
    this.select.province = v;
    this.select.city = 0;
    this.select.area = 0;
    this.data.city = null;
    this.data.area = null;
    if (v === 0) {
      this.data.province = null;
      this.address.province = '';
    }else {
      this.data.province = this.area[0][v-1];
      this.address.province = this.data.province.fullname;
    }
    this.address.city = '';
    this.address.area = '';
    this.complete = false; 
    if (this.props.list) this.props.list(this.address, this.complete);
    this.forceUpdate();
  }
  
  cityChange = (v) => {
    this.select.city = v;
    this.select.area = 0;
    this.data.area = null;
    if (v === 0) {
      this.data.city = null;
      this.address.city = '';
    }else {
      const s = this.data.province.cidx;
      const range = this.area[1].slice(s[0], s[1]+1);
      this.data.city = range[v-1];
      this.address.city = range[v-1].fullname;
      if (!this.data.city.cidx) {
        this.third = false;
      } else {
        this.third = true;
      }
    }
    this.address.area = '';
    if (this.third || v === 0) this.complete = false; 
    else this.complete = true;
    if (this.props.list) this.props.list(this.address, this.complete);
    this.forceUpdate();
  } 

  areaChange = (v) => {
    this.select.area = v;
    if (v === 0) {
      this.data.area = null;
      this.address.area = '';
    }else {
      const s = this.data.city.cidx;
      const range = this.area[2].slice(s[0], s[1]+1);
      this.data.area = range[v-1];
      this.address.area = range[v-1].fullname;
    }
    if (v === 0) this.complete = false; 
    else this.complete = true;
    if (this.props.list) this.props.list(this.address, this.complete);
    this.forceUpdate();
  }


  render () {
    return (
      <div className="hori-display">
        <Select options={this.renderState()} onChange={this.stateChange} default={this.select.province}/>
        <Select options={this.renderCity()} onChange={this.cityChange} default={this.select.city}/>
        <Select options={this.renderArea()} onChange={this.areaChange} default={this.select.area}/>
      </div>
    )
  }
}

export default connect(({page}) => ({page}), actions)(Address);