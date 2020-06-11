import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {SocketProvider} from 'socket.io-react';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:5000');

ReactDOM.render(
    <React.StrictMode>
        <SocketProvider socket={socket}>
            <App/>
        </SocketProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
