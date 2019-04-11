import React, { PureComponent } from 'react'
import './style.scss'

import Img from '../components/Img'
import Test from '../components/FlowerM'
import imgs from '../data/img'

class App extends PureComponent {
    constructor(params) {
        super(params);
    }
    render() {
        
        return (
            <div id='app'>
                <Test/>
            </div>
        );
    }
}

App.propTypes = {};

export default App;
