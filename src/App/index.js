import React, { PureComponent } from 'react'
import './style.scss'
import Img from '../components/Img'
import Test from '../components/RingProgressBar'
import imgs from '../data/img'

const btnStyle = {width: '100%',height: '200px',backgroundColor:'lightblue'};

class App extends PureComponent {
    state = {
        imgNum: 1,
        showImg: false,
    };
    changeImgNum = (e) => {
        this.setState({
            imgNum: e.target.value,
        });
    };
    render() {
        const {
            imgNum,
            showImg,
        } = this.state;

        const sources = imgs.slice(0, Math.min(imgNum, 2000)).map((item, index)=><Img className='img' index={index} src={item} lazy/>);
        return <Test/> || (
            <div id='app'>
                {showImg?sources:[
                    <input
                        type="number"
                        max={2000}
                        min={0}
                        placeholder={'最大2000'}
                        onChange={this.changeImgNum}/>
                    ,<button style={btnStyle} onClick={() => this.setState({
                        showImg: true,
                    })}>确定</button>
                ]}
            </div>
        );
    }
}

App.propTypes = {};

export default App;
