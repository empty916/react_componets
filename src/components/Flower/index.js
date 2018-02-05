import React from 'react'
import './style.scss'

/**
 * 这个组件只是一个菊花🌻
 * petal：花瓣
 */
const petalNum = 24;
let petals = [];
for(let i=0; i < petalNum; i++) {
    petals.push(<div key={i} className='petal'/>);
}

const Flower = () => (
    <div id="flower">
        <div className="wrapper">{petals}</div>
    </div>
);

export default Flower;