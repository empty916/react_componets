import React, { PureComponent } from 'react'
import Flower from '../Flower'
import './style.scss'

import '../../style/core/font.scss'
import { launchFullscreen, exitFullscreen } from '../../utils'

class BgImg extends PureComponent{
    state = {
        isFullScreen: false,
    };
    constructor(params) {
        super(params);
        this.toggleFullScreen = this.toggleFullScreen.bind(this);
    }
    toggleFullScreen(){
        this.state.isFullScreen ? exitFullscreen() : launchFullscreen(document.body);
        this.setState({
            isFullScreen: !this.state.isFullScreen,
        });
    }
    render(){
        let bgiS = {
            background: `no-repeat center 100% auto`,   
            backgroundRepeat: 'no-repeat',         
            backgroundSize: '100% auto',
            backgroundPosition: 'center',
            backgroundImage: `url(${require('../../images/background/ya.jpeg')})`,
        };
        let fontMap = {
            kx: 'KangXi',
            mnfz: 'MNFanZhuan',
            qk: 'QingKai',
        }
        let content = {
            marginTop: '-200px',
            fontSize: '50px',
            fontFamily: fontMap['qk'],
        };
        return(
            <div id='bg-img' 
                     ref='wrapper'
                     onClick={this.toggleFullScreen}
                     style={bgiS}>
                    <div className='qk-font' 
                         ref='content'
                         style={content} >
                        &nbsp;&nbsp;&nbsp;对境无心
                        <br/>
                        黜聪毁智
                    </div>
                </div>
        )
    }
}

export default BgImg;