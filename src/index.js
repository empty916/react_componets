import React from 'react'
import ReactDOM from 'react-dom'
import './style/core/base.scss'
import './style.scss'
import Loading from './components/Loading'

const rootElement = document.getElementById('app');

ReactDOM.render(
	<Loading/>,
    rootElement
);
