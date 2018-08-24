import React, {Component} from 'react';

class Top extends Component {
  toTop = () => {
    window.scrollBy(0, -window.scrollY);
  }

  render () {
    return (
      <div className="top noselect" onClick={this.toTop}>
        <a><i className="fa fa-chevron-up"></i></a>
      </div>
    )
  }
}

export default Top;