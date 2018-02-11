import React, { PureComponent } from 'react'
import { isInViewport, getObjectType, makeUniqueID } from '../../utils'
import Flower from '../Flower'
import { isListen, toggleListener, lazyLoadImgs, removeImgById, signImgIsNear, addImg } from './lazyLoadController'
export { lazyLoadController } from './lazyLoadController'
import './style.scss'
import defImg from '../../images/start_up_lady.png'
class Img extends PureComponent{
    constructor(){
        super();
        this.id = makeUniqueID();
        this.doLoad = this.doLoad.bind(this);
        this.onLoad = this.onLoad.bind(this);
        this.loadErr = this.loadErr.bind(this);
        this.releaseImg = this.releaseImg.bind(this);
        this.lazyLoadController = this.lazyLoadController.bind(this);
        
        this.state = {
            img: null,
            loading: true,
            isLoadingError: false,
        }
    }
    componentWillMount() {
        if(!this.props.lazy) {
            this.doLoad();
        } else {
            addImg({
                id: this.id,
                isNear: false,
                fun: this.lazyLoadController,
            });
            if(!isListen) toggleListener('add');
        }
    }
    // 释放缓存,图片加载完成，组件被销毁时调用
    releaseImg() {
        removeImgById(this.id);
        this.el = null;
    }
    //执行图片加载操作
    doLoad(){
        // 既然已经开始加载了，就从懒加载队列中删除
        removeImgById(this.id);
        this.setState({ loading: 1});
    }
    // 图片加载完成后的操作
    onLoad() {
        this.releaseImg();
        this.setState({
            loading: false,
        });
    }
    // 图片加载失败后的操作
    loadErr(){
        this.releaseImg();
        this.setState({
            isLoadingError: true,
            loading: false,
        });
        console.log('img load error');
    }
    // 图片懒加载控制器
    lazyLoadController(el, ratio = 1){
        if(!this.props.lazy || this.state.loading === 1) return;
        if(getObjectType(el) !== 'HTMLDivElement' && !this.el) return;
        if(getObjectType(el) !== 'HTMLDivElement' && !!this.el) el = this.el;
        else if(!!el && !this.el) this.el = el;
        // 当元素在视界中时，加载图片
        let pos = isInViewport(el, ratio);
        let value = true;
        if(!!el && pos === true) {
            this.doLoad();
            value = true;
        }
        if(!!el && pos <= 2.1 && pos > 0){
            value = 2;
            setTimeout(this.doLoad, pos+15);
        }
        // 如果当前图片在4屏以内，加入缓冲区
        if(pos > 2.1) value = true;
        if(pos <= 0) value = false;
        signImgIsNear(this.id, value);
    }
    componentWillUnmount(){
        this.releaseImg();
    }
    render(){
        const { 
            src,
            className,
        } = this.props;
        let hasImg = [
            <div className={`img ${className}`} ref={this.lazyLoadController}>
                {
                    this.state.loading === 1 ? <Flower
                        size={50}
                        petalNum={12}
                        petalBorderRadius={2}
                        time={1}/> : ''
                }
            </div>
        ];
        if(this.state.loading === 1){
            hasImg.push(<img style={{display: 'none'}} src={src} className={className} onLoad={this.onLoad} onError={this.loadErr}/>);
        } else if(this.state.loading === false){
            hasImg = <img src={src} className={className} onLoad={this.onLoad} onError={this.loadErr}/>;
        }
        return hasImg;
    }
}

Img.defaultProps = {
    src: defImg,
    lazy: false,
    className: '',
};

export default Img;