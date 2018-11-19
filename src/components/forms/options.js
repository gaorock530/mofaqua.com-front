import React, {PureComponent} from 'react';

/**
 * @param {String} tag tag name of the label
 * @param {String} sup super information
 * @param {String} sub sub information
 * @param {Array} data radio options {lable: '', value: ''}
 * @param {String/Number} default default value for check
 * @param {Function} onChange
 */

export default class Options extends PureComponent {
  constructor (props) {
    super(props);
    this.tag = this.props.tag || null;
    this.sup = this.props.sup || null;
    this.sub = this.props.sub || null;
    // this.options = this.props.data || [];
  }

  componentWillUpdate (props) {
    this.options = props.data || [];
  }

  renderOps = () => {
    if (this.props.data instanceof Array && this.props.data.length > 0) {
      return this.props.data.map((op, index) => {
        let css = "fa " + (index === (this.props.default || 0)? "fa-dot-circle": "fa-circle");
        return (
          <div key={index}> 
            <a className="form-radio-option" onClick={this.onClick.bind(this, index)}>
              <i className={css}></i>
              <span>{op}</span>
            </a>
          </div>
        ) 
      })
    }
  }

  onClick = (id) => {
    if (this.props.onChange) {
      this.props.onChange(id);
    }
  }

  render () {
    return (
      <div>
        {this.tag?<h3>{this.tag}</h3>:''}
        {this.sup?<span className="sup">{this.sup}</span>:''}
        <div className="list">{this.renderOps()}</div>
        {this.sub?<span className="sub">{this.sub}</span>:''}
      </div>
    )
  }
  
}