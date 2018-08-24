import React from 'react';

/**
 * @param {Array} data input data
 * @param {Function} onChange return wordcount
 */

export default (props) => {
  let data;
  if (props.data) {
    data = props.data.sort((a, b) => {
      return a.index > b.index;
    })
  }


  const up = (id) => {
    const newI = data.map((i, index) => {
      if(i.id === id && index !== 0) {
        i.index--;
        data[index - 1].index++;
      }
      return i;
    });
    if (props.onChange) {
      props.onChange(newI);
    }
  }
  const down = (id) => {
    const newI = data.map((i, index) => {
      if(i.id === id && index < data.length-1) {
        i.index++;
        data[index + 1].index--;
      }
      return i;
    });
    if (props.onChange) {
      props.onChange(newI);
    }
  }
  const del = (id) => {
    const newT = data.filter(i => {
      return id !== i.id;
    }).map((i, index) => {
      i.index = index;
      return i;
    });

    if (props.onChange) {
      props.onChange(newT);
    }
  }

  const renderList = (data) => {
    return data.map(i => {
      return (
        <div className="list-wrapper" key={i.id}>
          <div className="pic" style={{backgroundImage: 'url('+i.pic+')'}}></div>
          <div className="utils">
            <div className="left">
              {/* <span>顺序：{i.index}</span> */}
              <span>标题：{i.title}</span>
            </div>
            <div className="right">
              <a onClick={up.bind(this, i.id)}><i className="fa fa-chevron-up blue"></i></a>
              <a onClick={down.bind(this, i.id)}><i className="fa fa-chevron-down blue"></i></a>
              <a onClick={del.bind(this, i.id)}><i className="fa fa-times red"></i></a>
            </div>
          </div>
        </div>
      )
    })
  }

  return (
    <div className="forms-inputs">
      <div className="list-container">
        <h3>视频：3</h3>
        {renderList(data)}
      </div>
      
    </div>
  )
}