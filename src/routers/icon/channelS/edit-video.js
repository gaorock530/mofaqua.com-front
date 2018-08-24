import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../redux/actions';
import Page from '../../../components/page';
import Select from '../../../components/forms/select';
import Textarea from '../../../components/forms/textarea';
import Static from '../../../components/forms/static';
import Save from '../../../components/forms/save';




/**
 * @param {Function} onSave fires when click save
 */

class EditVlog extends PureComponent {
  constructor (props) {
    super(props);
    this.data = {
      name: '',
      week: 1,
      weeks: 1,
      day: 1,
      repeat: true,
      freq: 2,
      time: 0,
      date: new Date(Date.now())
    };
    
  }
  componentWillMount () {
  }


  onSave = () => {
    if (this.data.name === '' || this.data.num < 1) return;
    if (this.props.onSave) {
      if (isNaN(this.data.num)) this.data.num = 1;
      this.props.onSave(this.data);
    }
  }

  render () {
    return (
      <Page wapper={true}>
        <Static tag="标题" text={this.props.title || ''}/>
        <Static tag="地址" text={'http://aquamofa.com/asdasdq123123'}/>
        <Select tag="所属播放列表" options={[
          {label: '无', value: 0},
          {label: '1', value: 1},
          {label: '2', value: 2},
          {label: '3', value: 3},
        ]} />
        <Textarea tag="介绍" text="测试" onBlur={(value) => {console.log(value)}}/>
        <Save tag="保存更改" onClick={this.onSave}/>
        <Save tag="删除视频" red={true} onClick={this.onSave}/>
      </Page>
    )
  }
}

export default connect(state => state, actions)(EditVlog);

