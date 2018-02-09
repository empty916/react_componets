import React, { PureComponent } from 'react'
import BetterScroll from 'better-scroll'
import Img from '../Img'
import './style.scss'
let evObj = document.createEvent('HTMLEvents');
evObj.initEvent('scroll',true,false);

class Slide extends PureComponent{
    constructor(props) {
        super(props);
    }

    componentWillMount() {

    }

    componentDidMount() {
        console.log(this);
        this.bs = new BetterScroll(this.refs.slide, {
            scrollX: true,
            scrollY: false,
            momentum: false,
            probeType: 3,
            snap: {
                loop: true,
                threshold: 0.03,
                speed: 400
            },
            bounce: false,
            // click: this.click
        });

        this.bs.on('scroll',() => {
            this.refs.slide.dispatchEvent(evObj);
        });
    }


    render(){
        return(
            <div id="slide" ref={'slide'}>
                <div className="slide-group" style={{width:`${100*this.props.sources.length}%`}}>
                    {
                        this.props.sources.map((item, index) => (
                            <div className="slide-item" key={index}>
                                {/*{item}*/}
                                <Img src={item} className='img' lazy wrapper={this.bs}/>
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }
}

Slide.defaultProps = {
    // text: '加载中',
};

export default Slide;