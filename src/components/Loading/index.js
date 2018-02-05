import React, { PureComponent } from 'react'
import Flower from '../Flower'
import './style.scss'

class Loading extends PureComponent{
    render(){

        return(
            <div id="loading">
                <div className="wrapper">
                    <Flower/>
                    <div className="loading-text">{this.props.text}</div>
                </div>
            </div>
        )
    }
}

Loading.defaultProps = {
    text: '加载中',
};

export default Loading;