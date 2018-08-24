/* React Core */
import React from 'react';
import ReactDOM from 'react-dom';
/* Redux */
import { Provider } from 'react-redux';
import store from './redux/store/configureStore';
/* App Component */
import App from './App';
/* Service Worker */
import registerServiceWorker from './registerServiceWorker';
/* console style*/
import style from './consoleStyle';


ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'), (e) => {
  console.log('%cWelcome to Schedule App, I\'m Magic, contact me:', style.basic);
  console.log('%cgaorock530@hotmail.com', style.email);
});
registerServiceWorker();
