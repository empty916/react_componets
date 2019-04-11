import React, { PureComponent } from 'react'
import Flower from '../Flower'
import './style.scss'

import '../../style/core/font.scss'
import { launchFullscreen, exitFullscreen } from '../../utils'

let fontMap = {
    kx: 'KangXi',
    mnfz: 'MNFanZhuan',
    qk: 'QingKai',
    dzcs: 'DanZhaiCaoShu',
    sqxs: 'SongQingXingShu',
    ywxs: 'YuWeiXingShu',
};
let spaces = <span>&nbsp;&nbsp;</span>;

const rem = num => `${num/75}rem`;

let bgiS = {
    background: `no-repeat center 100% auto`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'auto 100%',
    backgroundPosition: 'center',
    backgroundImage: `url(${require('../../images/background/chuidiao.jpg')})`,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
};

let content = {
    // marginTop: `${rem(-700)}`,
    // marginRight: `${rem(450)}`,
    margin: `${rem(10)} ${rem(100)} ${rem(0)} 0`,
    fontSize: `${rem(20)}`,
    fontFamily: fontMap['kx'],
    letterSpacing: rem(3)
    // textShadow: '1px 1px 0px #212121',
    // color: '#adadad',
    // marginBottom: '20px',
};

class BgImg extends PureComponent{
    state = {
        isFullScreen: false,
        col2Text: '闲来垂钓碧溪上',
        col1Text: '忽复乘舟梦日边',
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
                 // onClick={this.toggleFullScreen}
                 style={bgiS}>
                    <div className='qk-font'
                         ref='content'
                         style={content} >
                        {/*{spaces}*/}
                        {col2Text}<br/>
                        {col1Text}
                    </div>
                </div>
        )
    }
}

export default BgImg;