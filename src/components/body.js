import React, {Component} from 'react';
import { connect } from 'react-redux';
import cuid from 'cuid';

/* Components */
// import { Scrollbars } from 'react-custom-scrollbars';
import Spinner from './animates/spinner';
import Loader from './animates/loader';


class Body extends Component {

  ws = this.props.ws.connection;
  

  componentWillMount () {
    // this.ws.on('room', (data) => {
    //   const talks = this.state.talks;
    //   talks.push(data.name + ': ' + data.msg);
    //   this.setState({ talks });
    // });
    // this.ws.on('limited-talk', (data) => {
    //   console.log(data);
    // });
    // this.ws.on('message', data => {
    //   console.log(data);
    // });
  }

  state = {
    talks: []
  }

  renderTalks = () => {
    return this.state.talks.map((talk) => {
      return <div key={cuid()}>{talk}</div>
    })
  }

  handleOnSubmit = (e) => {
    e.preventDefault();
    const text = this.refs.text.value;
    if (text !== '') {
      this.ws.emit('talk', text);
      const talks = this.state.talks;
      talks.push('me: ' + text);
      this.setState({ talks });
      this.refs.text.value = '';
    }
  }
  render () {

    return (
      <div className="app-body">
        <section className="header-mask"></section>   

        <section className='talk-list'>
          {this.renderTalks()}
        </section>
        <section>
          <form onSubmit={this.handleOnSubmit}>
            <input type="text" ref="text" />
            <button>说话</button>
          </form>
        </section>
        <footer>
          <section className="test-large">
            main body
            <Spinner className="" Stype="style2">加载</Spinner>
            <Spinner className="" Stype="style1">加载</Spinner>
            <Spinner className="" Stype="style3">加载</Spinner>
            <Spinner className="" Stype="style4">加载</Spinner>
            <Loader />
          </section>
        </footer>
      </div>
    )
  }
}

export default connect(state => state, null)(Body);