import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Button from '../../../components/forms/button';
import Addr from '../../../components/forms/address';
import Input from '../../../components/forms/input';
import Textarea from '../../../components/forms/textarea';
import Radio from '../../../components/forms/radio';
import ErrorText from '../../../helper/errorText';
import * as actions from '../../../redux/actions';
import cuid from 'cuid';

class Address extends PureComponent {
  constructor (props) {
    super(props);
    this.fakeAddress = [
      'asdqweqpoweipoqwie',
      '卡拉斯京看到了啊善良的空间阿斯顿流泪的 上劳动课',
      '阿克苏 k askd kjk卡家是的'
    ]
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
    this.fakeAddress.push(this.addrDetail);
    this.addrCate = null;
    this.addrDetail = null;
    this.zip = null;
    this.forceUpdate()
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
          <Radio data={this.fakeAddress} onChange={(i) => console.log(i)} default={1}/>
          <Button onClick={this.addADD} text="添加地址"/>
        </div>
        {this.renderAddress()}
      </div>
    )
  }
}

export default connect(state => state, actions)(Address);