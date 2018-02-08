import React, { PureComponent } from 'react'
import Flower from '../Flower'
import './style.scss'
import defImg from '../../images/start_up_lady.png'

class Img extends PureComponent{
    constructor(){
        super();
        this.onLoad = this.onLoad.bind(this);
        this.loadErr = this.loadErr.bind(this);
        this.state = {
            loading: true,
            isLoadingError: false,
            img: null,
            imgW: '',
            imgH: '',
        }
    }
    componentWillMount() {
        const { 
            src,
            lazy,
            showLoading,
        } = this.props;

        let img = new Image();
        img.src = src;
        img.onload = this.onLoad;
        img.onerror = this.loadErr;
        this.setState({img});
    }
    onLoad() {
        this.state.img.onload = null;
        this.state.img.onerror = null;
        this.state.img = null;
        this.setState({
            loading: false,
            img: this.state.img,
        });
    }
    loadErr(){
        this.state.img.onload = null;
        this.state.img.onerror = null;
        this.state.img = null;
        this.setState({
            isLoadingError: true,
            img: this.state.img,
        });
        console.log('img load error');
    }
    render(){
        const { 
            src,
            showLoading,
            lazy,
            className,
        } = this.props;
        const { img } = this.state;
        const wrapperStyle = {
            width: !!img ? img.width : 'auto',
            height: !!img ? img.height : 'auto'
        };
        console.log(wrapperStyle);
        return this.state.loading ? (
            <div id="img" className={className} style={wrapperStyle}>
                <div className="loading-wrapper" style={wrapperStyle}>
                    <Flower/>
                </div>
            </div>
        ) : <img src={src}/>
    }
}

Img.defaultProps = {
    src: defImg,
    showLoading: true,
    lazy: true,
};

export default Img;