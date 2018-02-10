import React from 'react'
import ReactDOM from 'react-dom'
import './style/core/base.scss'
import './style.scss'
import Img from './components/Img'
import Slide from './components/Slide'
import imgs from './data/img'

const rootElement = document.getElementById('app');

const sources = imgs.slice(0, 20).map(item=><Img className='img' src={item} lazy/>);
console.log(imgs.length);
ReactDOM.render(
	<div>
        {/*<Slide sources={sources}/>*/}
        {sources}
    </div>,
    rootElement
);
