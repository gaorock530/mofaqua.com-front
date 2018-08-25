import React, { Component } from 'react';
import { connect } from 'react-redux';

import { BrowserRouter, Route, Switch } from 'react-router-dom';
import PrivateRoute from './routers/PrivateRoute';
// import PublicRoute from './routers/PublicRoute';
import * as actions from './redux/actions';

import 'font-awesome/css/font-awesome.min.css'; // font-awesome.min.css
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import 'react-day-picker/lib/style.css';

import Spinner from './components/animates/spinner';

import './scss/style.scss';
import Header from './components/header';
// import Body from './components/body';
import Sidebar from './components/sidebar';
import Cover from './components/cover';
import Home from './components/home';
import Notification from './components/notification';
import Top from './components/top';
// import Edit from './components/edit';
// router
import NotFound from './routers/notFound';
import Login from './components/login';
import Register from './components/register';
//
import Answer from './routers/answer';
import Ask from './routers/ask';
import Buy from './routers/buy';
import Calculator from './routers/calculator/index';
import Collection from './routers/collection';
import Experience from './routers/experience';
import Food from './routers/food';
import Gears from './routers/gears';
import Hot from './routers/hot';
import Live from './routers/live';
import LiveStock from './routers/livestock';
// import Sell from './routers/sell';
import Subscribe from './routers/subscribe';
import Tank from './routers/tank';
import Teamup from './routers/teamup';
import Teamin from './routers/teamin';
import Thumbup from './routers/thumbup';
import Videos from './routers/videos';
//
import Setup from './routers/icon/setup/index';
import Channel from './routers/icon/channel/index';
import ChannelS from './routers/icon/channelS/index';
import Personal from './routers/icon/personal/index';
import Mytank from './routers/icon/mytank/index';
import AddTank from './routers/icon/mytank/addTank';
import TankView from './routers/icon/mytank/tankView';
//
import AddVideo from './routers/icon/channelS/add-video';
import AddList from './routers/icon/channelS/add-list';
import AddPost from './routers/icon/channelS/add-post';
import AddSecond from './routers/icon/channelS/add-second';
// 
import EditVideo from './routers/icon/channelS/edit-video';
import EditList from './routers/icon/channelS/edit-list';
import EditPost from './routers/icon/channelS/edit-post';
import EditSecond from './routers/icon/channelS/edit-second';


class App extends Component {
  constructor (props) {
    super(props);
    this.props.user_verify(); 
    this.loading = true;
    this.refresh = setTimeout(() => {
      this.loading = false;
      return this.props.ws.connection || this.forceUpdate();
    }, 10000);
  }
  componentWillMount () {
    // start timer
    this.t0 = window.performance.now();
    if (window.localStorage) {
      const lang_option = ['zh', 'en'];
      const lang = window.localStorage.getItem('lang');
      if (lang_option.indexOf(lang) !== -1) {
        this.props.set_language(lang);
      } else {
        this.props.set_language('zh');
        window.localStorage.setItem('lang', 'zh');
      }
    }

    // this.props.load_websocket(ws);
    this.prev = window.scrollY;
    this.counter = 0;
    document.addEventListener('scroll', (e) => {
      
      this.now = Math.abs(window.scrollY - this.prev);
      this.prev = window.scrollY;
      this.counter += this.now;

      // console.log(this.counter, this.now);
      if (this.counter > 200) {
        this.counter = 0;
        if (window.scrollY > 200) {
          this.props.toggle_top(true);
        }if (window.scrollY <= 200) {
          this.props.toggle_top(false);
        }
      }
    });    
  }

  componentDidMount () {
    this.t1 = window.performance.now();
    console.log('Page loaded in: ' + (this.t1 - this.t0) + 'ms');
  }

  render() {
    return !this.props.ws.connection?(this.loading?<Spinner />:'no connection'):(
      <div className="center">
        <BrowserRouter>
          <div>
            <Notification/>
            <Header/>
            {this.props.page.sidebar ? <Sidebar /> : ''}
            <Cover />
            {/* {this.props.page.edit ? <Edit /> : ''} */}
            {this.props.page.showTop ? <Top /> : ''}
            <Switch>
              <Route exact path='/' component={Home} />
              <Route exact path='/answer' component={Answer} />
              <Route exact path='/ask' component={Ask} />
              <Route exact path='/shop' component={Buy} />
              <Route exact path='/calculator' component={Calculator} />
              <PrivateRoute exact path='/collection' component={Collection} />
              <Route exact path='/experience' component={Experience} />
              <Route exact path='/food' component={Food} />
              <Route exact path='/gear' component={Gears} />
              <Route exact path='/hot' component={Hot} />
              <Route exact path='/live' component={Live} />
              <Route exact path='/livestock' component={LiveStock} />
              {/* <PrivateRoute exact path='/sell' component={Sell} /> */}
              <PrivateRoute exact path='/subscribe' component={Subscribe} />
              <Route exact path='/tanks' component={Tank} />
              <Route exact path='/teamin' component={Teamin} />
              <PrivateRoute exact path='/teamup' component={Teamup} />
              <PrivateRoute exact path='/thumbup' component={Thumbup} />
              <Route exact path='/videos' component={Videos} />
              <Route exact path='/login' component={Login} />
              <Route exact path='/register' component={Register} />
              <PrivateRoute exact path='/setup' component={Setup} />
              <PrivateRoute exact path='/personal' component={Personal} />
              <PrivateRoute exact path='/mytank' component={Mytank} />
              <PrivateRoute exact path='/mytank/:id' component={TankView} />
              <PrivateRoute exact path='/addtank' component={AddTank} />
              {/* puclic view */}
              <Route exact path='/channel/:id' component={Channel} />
              {/* self view */}
              <PrivateRoute exact path='/channel' component={ChannelS} />
              <PrivateRoute exact path='/add/video' component={AddVideo} />
              <PrivateRoute exact path='/add/list' component={AddList} />
              <PrivateRoute exact path='/add/post' component={AddPost} />
              <PrivateRoute exact path='/add/second' component={AddSecond} />
              <PrivateRoute exact path='/edit/video/:id' component={EditVideo} />
              <PrivateRoute exact path='/edit/list/:id' component={EditList} />
              <PrivateRoute exact path='/edit/post/:id' component={EditPost} />
              <PrivateRoute exact path='/edit/second/:id' component={EditSecond} />
              {/* not found */}
              <Route component={NotFound} />
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default connect(state => state, actions)(App);

