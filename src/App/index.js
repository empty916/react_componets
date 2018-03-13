import React, { PureComponent } from 'react'
import './style.scss'
import '../style/core/font.scss'



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
        
        let bgiS = {
            background: `no-repeat center 100% auto`,   
            backgroundRepeat: 'no-repeat',         
            backgroundSize: '100% auto',
            backgroundPosition: 'center',
            backgroundImage: `url(${require('../images/background/ya.jpeg')})`,
        };
        let content = {
            marginTop: '-300px',
            fontSize: '100px',
        };
        return (
            <div id='app'>
                <div className='wrapper' style={bgiS}>
                    <div className='qk-font' style={content}>
                        &nbsp;&nbsp;&nbsp;对境无心
                        <br/>
                        黜聪毁智
                    </div>
                    {/* <div className='mnfz-font'>罢聪毁智 对境无心</div> */}
                    {/* <div className='kx-font'>黜聪毁智 对境无心</div> */}
                    {/* <div className='kx-font' style={content}>
                        若无闲事挂心头 <br/>&nbsp;&nbsp;&nbsp;便是人间好时节
                    </div> */}
                </div>
            </div>
        );
    }
}

App.propTypes = {};

export default App;
