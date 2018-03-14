import React, { PureComponent } from 'react'
import Flower from '../Flower'
import './style.scss'

import '../../style/core/font.scss'
import { launchFullscreen, exitFullscreen } from '../../utils'

let fontMap = {
    kx: 'KangXi',
    mnfz: 'MNFanZhuan',
    qk: 'QingKai',
};
let spaces = <span>&nbsp;&nbsp;</span>;

let bgiS = {
    background: `no-repeat center 100% auto`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'auto 100%',
    backgroundPosition: 'center',
    backgroundImage: `url(${require('../../images/background/shan.jpg')})`,
    justifyContent: 'center',
    alignItems: 'center',
};

let content = {
    marginTop: `${-700/75}rem`,
    marginRight: `${450/75}rem`,
    fontSize: `${80/75}rem`,
    fontFamily: fontMap['mnfz'],
    // textShadow: '1px 1px 0px #212121',
    // color: '#030303',
    // marginBottom: '20px',
};

class BgImg extends PureComponent{
    state = {
        isFullScreen: false,
        col1Text: '望去千重山',
        col2Text: '高深渐可攀',
        optionHide: false,
    };
    constructor(params) {
        super(params);
        this.toggleFullScreen = this.toggleFullScreen.bind(this);
        this.inputText = this.inputText.bind(this);
        this.hideOption = this.hideOption.bind(this);
    }
    toggleFullScreen(){
        this.state.isFullScreen ? exitFullscreen() : launchFullscreen(document.body);
        this.setState({
            isFullScreen: !this.state.isFullScreen,
        });
    }
    inputText(e, propName) {
        this.setState({
            [propName]: e.target.value,
        });
    }
    hideOption(){
        window.event.stopPropagation();
        this.setState({
            optionHide: true,
        });
    }
    render(){

        const { col1Text, col2Text, optionHide } = this.state;
        return(
            <div id='bg-img' 
                 ref='wrapper'
                 onClick={this.toggleFullScreen}
                 style={bgiS}>
                    <div className='qk-font'
                         ref='content'
                         style={content} >
                        {spaces}{col2Text}<br/>
                        {col1Text}
                    </div>
                </div>
        )
    }
}

export default BgImg;