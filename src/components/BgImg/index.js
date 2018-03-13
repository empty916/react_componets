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
    backgroundSize: '100% auto',
    backgroundPosition: 'center',
    backgroundImage: `url(${require('../../images/background/ya.jpeg')})`,
    justifyContent: 'center',
    alignItems: 'center',
};

let content = {
    marginTop: `${-500/75}rem`,
    fontSize: `${100/75}rem`,
    fontFamily: fontMap['qk'],
    // marginBottom: '20px',
};

class BgImg extends PureComponent{
    state = {
        isFullScreen: false,
        col1Text: '黜聪毁智',
        col2Text: '对境无心',
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
                {
                    optionHide ? '' : (
                        <div className="option-wrapper">
                            <div className="col-text">
                                <span>第一列文字</span>
                                <input type="text"
                                       value={col1Text}
                                       onChange={e => this.inputText(e, 'col1Text')}/>
                            </div>
                            <div className="col-text">
                                <span>第二列文字</span>
                                <input type="text"
                                       value={col2Text}
                                       onChange={e => this.inputText(e, 'col2Text')}/>
                            </div>

                            <div className="submit-cancle">
                                {/*<div className="submit">确定</div>*/}
                                <div className="hide" onClick={this.hideOption}>隐藏输入面板</div>
                            </div>
                        </div>
                    )
                }

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