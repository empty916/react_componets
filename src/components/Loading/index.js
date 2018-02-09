import React, { PureComponent } from 'react'
import Flower from '../Flower'
import './style.scss'

class Loading extends PureComponent{
    state = {
        petalNum: 24,
        petalWidth: 4,
        petalHeight: 18,
        time: 1,
        petalBorderRadius: 2,
    };
    render(){
        return(
            <div id="loading">
                <div className="wrapper">
                    <Flower {...this.state}/>
                    {!!this.props.text ? <div className="loading-text">{this.props.text}</div> : ''}
                </div>
            </div>
        )
    }
}

Loading.defaultProps = {
    text: '加载中',
};

export default Loading;