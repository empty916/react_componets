import React from 'react'
import './style.scss'

/**
 * 这个组件只是一个菊花🌻
 */
const itemNum = 24;
let items = [];
for(let i=0; i < itemNum; i++) {
    items.push(<div key={i} className='item'/>);
}

const Flower = () => (
    <div id="flower">
        <div className="wrapper">{items}</div>
    </div>
);

export default Flower;