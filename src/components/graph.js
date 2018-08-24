import React, { PureComponent } from 'react';
import utils from '../helper/utils';

/**
 * @param {Array} data data to process *required*
 * @param {String} className custom style
 * @param {Number} space space around actual graph
 * @param {Number} x how many day to display on X 
 * @param {Number} y how many values to display on Y
 * @param {color} bgColor custom background color
 * @param {color} baselineColor custom baseline color
 * @param {color} gridColor custom grid color
 * @param {color} lineColor custom line color
 * @param {color} pointColor custom point color
 */

class Graph extends PureComponent {
  constructor (props) {
    super(props);
    this.data = this.props.data || [];
    this.space = this.props.space || 30;
    this.x_value = this.props.x || this.data.length; // 7
    this.y_value = this.props.y || 10;
    this.bgColor = this.props.bgColor || "#222";
    this.baselineColor = this.props.baselineColor || "#111";
    this.gridColor = this.props.gridColor || "#333";
    this.lineColor = this.props.lineColor || "orangered";
    this.pointColor = this.props.pointColor || "orange";
    console.log(this.data);
  }

  componentWillMount () {
    window.addEventListener('resize', this.draw, false);
  }
  componentDidMount () {
    this.canvas = this.refs.chart;
    this.container = this.refs.canvas;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.translate(0.5, 0.5)
    this.draw();
  }
  componentWillReceiveProps () {
    this.data = this.props.data || [];
    this.x_value = this.data.length;
    this.draw();
  }
  componentWillUnmount () {
    window.removeEventListener('resize', this.draw, false);
  }

  draw = () => {
    this.canvas.width = this.container.offsetWidth;
    this.canvas.height = this.container.offsetHeight;
    const width = this.canvas.offsetWidth;
    const height = this.canvas.offsetHeight;
    const left = this.space; // left boundary
    const right = width - this.space; // right boundary
    const top = this.space;  // top boundary
    const bottom = height - this.space; // bottom boundary
    const vertical_space = (bottom-top)/this.y_value; // space between vertical lines
    const horiztal_space = (right-left)/this.x_value; // space between horizontal lines
    // highest value for scaling
    const scaleDown = bottom - vertical_space /2 - 3;
    // lowest value for scaling
    const scaleUp = bottom - (this.y_value - 1) * vertical_space - vertical_space / 2 - 3;
    /* background */
    this.ctx.fillStyle = this.bgColor;
    this.ctx.fillRect(0, 0, width, height);
    /* draw base line */
    this.ctx.strokeStyle = this.baselineColor;
    // 1
    this.ctx.beginPath();
    this.ctx.moveTo(left, bottom);
    this.ctx.lineTo(right, bottom);
    this.ctx.closePath();
    this.ctx.stroke();
    // 2
    this.ctx.beginPath();
    this.ctx.moveTo(left, bottom);
    this.ctx.lineTo(left, top);
    this.ctx.closePath();
    this.ctx.stroke();
    // text 1
    this.ctx.strokeStyle = this.gridColor;
    for(let i=0;i<this.y_value;i++){
      this.ctx.strokeText((i)*10+100, left-20, bottom - i*vertical_space - vertical_space /2);
      this.ctx.beginPath();
      this.ctx.moveTo(left+1, bottom - i*vertical_space - vertical_space /2 - 3);
      this.ctx.lineTo(right, bottom - i*vertical_space - vertical_space /2 - 3);
      this.ctx.closePath();
      this.ctx.stroke();
    }
    //text 2
    for(let i=0;i<this.x_value;i++){
      this.ctx.strokeText(i+1, left + i*horiztal_space + horiztal_space/2, bottom+10);
      this.ctx.beginPath();
      this.ctx.moveTo(left + i*horiztal_space + horiztal_space/2 + 3, bottom-1);
      this.ctx.lineTo(left + i*horiztal_space + horiztal_space/2 + 3, top);
      this.ctx.closePath();
      this.ctx.stroke();
    }
    // lines
    this.ctx.beginPath();
    for(let i=0;i<this.x_value;i++){
      let x = left + i*horiztal_space + horiztal_space/2 + 3;
      this.data.map((res) => {
        if (res.day-1 === i) {
          let y = utils.map(res.value, 100, 190, scaleDown, scaleUp);
          if (i===0) {
            this.ctx.moveTo(x, y);
          }else {
            this.ctx.lineTo(x, y);
          }
        }
      }) 
    }
    this.ctx.strokeStyle = this.lineColor;
    this.ctx.stroke();
    // points
    for(let i=0;i<this.x_value;i++){
      let x = left + i*horiztal_space + horiztal_space/2 + 3;
      this.data.map((res) => {
        if (res.day-1 === i) {
          let y = utils.map(res.value, 100, 190, scaleDown, scaleUp);
          // points
          this.ctx.fillStyle = this.pointColor;
          this.ctx.beginPath();
          this.ctx.arc(x, y, 2, 0, 2 * Math.PI, false);
          this.ctx.closePath();
          this.ctx.fill();
          // text
          this.ctx.strokeStyle = this.pointColor;
          this.ctx.strokeText(res.value, x-5, y+15);
        }
      }) 
    }
  }

  render () {
    return (
      <div className={this.props.className || ''} ref="canvas">
        <canvas ref="chart"></canvas>
      </div>
    )
  }
}

export default Graph;