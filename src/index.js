import React from 'react'
import ReactDOM from 'react-dom'
import './style/core/base.scss'
import './style.scss'
import Test from './components/Img'

const rootElement = document.getElementById('app');
let src = 'http://img.zcool.cn/community/0159fa5944bcd3a8012193a34b762d.jpg@2o.jpg';
ReactDOM.render(
	<div>
        <Test className='wrapper' lazy type='all' src={src}/>
        <Test className='wrapper' lazy src='http://img.dwstatic.com/ow/1603/321664812092/1457711198415.jpg'/>
    </div>,
    rootElement
);
