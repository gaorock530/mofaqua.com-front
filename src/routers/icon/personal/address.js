import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Button from '../../../components/forms/button';
import Addr from '../../../components/forms/address';
import Input from '../../../components/forms/input';
import Textarea from '../../../components/forms/textarea';
import List from '../../../components/forms/addressList';
import ErrorText from '../../../helper/errorText';
import * as actions from '../../../redux/actions';
import cuid from 'cuid';

class Address extends PureComponent {
  constructor (props) {
    super(props);
    const address = localStorage.getItem('address') || localStorage.getItem('copy');
    this.saved = true;
    if (address) this.address = JSON.parse(address);
    else this.address = this.props.user.user.address || [];
    this.props.update_address(this.address);
  }

  componentWillMount () {
    window.addEventListener('beforeunload', this.saveData, {once: true});
  }

  componentWillUnmount () {
    window.removeEventListener('beforeunload', this.saveData);
    if (!this.saved) {
      localStorage.setItem('copy', JSON.stringify(this.address));
      this.save = true;
    }
  }

  saveData = () => {
    if (!this.saved) {
      localStorage.setItem('address', JSON.stringify(this.address));
      this.save = true;
    }
  }
  
  flatAddr = (data) => {
    if (!data instanceof Array || data.length === 0) return [];
    return data.map((ad) => ad.cate.state + ad.cate.city + ad.cate.area + ad.detail);
  }

  renderAddress = () => {
    if (this.add) return (
      <div>
        <h3>地址详情</h3>
        <Addr list={this.getAddr}/>
        <Textarea placeholder="详细地址" onBlur={this.getDetail}/>
        <Input type="number" placeholder="邮编" onBlur={this.getZip} 
        condition={(v) => !(parseInt(v,10) < 0 || v.length !== 6 || v.match(/\./g))} errorText={ErrorText.zip}
        />
        <Button text="保存" onClick={this.saveAddress}/>
        <Button onClick={this.cancel} text="取消"/>
      </div>
    )
  }

  getAddr = (data, comp) => {
    if (!comp) this.addrCate = null;
    else this.addrCate = data;
  }
  getDetail = (data) => {
    if (data.length < 10 || data.length > 100) this.addrDetail = null;
    else this.addrDetail = data;
  }
  getZip = (data) => {
    if (data.length === 0 || data.length !==6 || data.match(/\./g)) this.zip = null;
    else this.zip = data;
  }

  saveAddress = () => {
    if (!this.addrCate || !this.addrDetail || !this.zip) return this.props.notification_in(cuid(), ErrorText.lackAddr);
    this.add = false;
    const data = {
      id: cuid(),
      cate: this.addrCate, 
      detail: this.addrDetail, 
      zip: this.zip,
      default: this.address.length < 1,
    }
    this.address.push(data);
    this.props.update_address(this.address);
    this.addrCate = null;
    this.addrDetail = null;
    this.zip = null;
    this.saved = false;
  }

  changeDefault = (id) => {
    this.address = this.address.map((ad) => {
      if (id === ad.id) ad.default = true;
      else ad.default = false;
      return ad;
    });
    this.props.update_address(this.address);
    this.saved = false;
  }

  onDelete = (id) => {
    let pass = false;
    this.address = this.address.filter((ad) => {
      if (id === ad.id && ad.default) pass = true;
      return id !== ad.id
    });
    if (this.address.length > 0 && pass) this.address[0].default = true;
    this.props.update_address(this.address);
    this.saved = false;
  }

  cancel = () => {
    this.addrCate = null;
    this.addrDetail = null;
    this.zip = null;
    this.add = false;
    this.forceUpdate()
  }

  addADD = () => {
    this.add = true;
    this.forceUpdate()
  }
  render () {
    const buyer = this.props.user.user.buyer;
    return (
      <div>
        <div>
          <h3>交易评估和等级</h3>
          <p>
            <label>等级</label><span>Lv.{buyer?buyer.level:''}</span>
          </p>
          <p>
            <label>经验</label><span>{buyer?buyer.exp+'/1000':''}</span>
          </p>
          <p>
            <label>信用值</label><span>{buyer?buyer.credit: ''}</span>
          </p>
        </div>
        <div>
          <h3>地址管理</h3>
          <List data={this.props.user.user.address} 
          onChange={this.changeDefault.bind(this)}
          onDelete={this.onDelete.bind(this)}/>
          <Button onClick={this.addADD} text="添加地址"/>
        </div>
        {this.renderAddress()}
      </div>
    )
  }
}

export default connect(({user}) => ({user}), actions)(Address);