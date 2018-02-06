import React, { PureComponent } from 'react'
import Flower from '../Flower'
import './style.scss'

class Loading extends PureComponent{
    state = {
        petalNum: 12,
        petalWidth: 3,
        petalHeight: 10,
        time: 0.09,
        petalBorderRadius: '50%',
    };
    render(){
        const size = parseInt(Math.random()*100);
        const state = {
            petalWidth: size,
            petalHeight: size,

        };
        return(
            <div id="loading">
                <div className="wrapper">
                    <Flower {...this.state}/>
                    <div className="loading-text">{this.props.text}</div>
                </div>
                <button style={{width: '200px',height: '60px', position: 'absolute', bottom: '0'}} onClick={() => {this.setState(state)}}>change</button>
            </div>
        )
    }
}

Loading.defaultProps = {
    text: '加载中',
};

export default Loading;