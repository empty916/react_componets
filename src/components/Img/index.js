import React, { PureComponent } from 'react'
import { isInViewport, getObjectType, makeUniqueID } from '../../utils'
import Flower from '../Flower'

import './style.scss'
import defImg from '../../images/start_up_lady.png'

let isListen = false; // 全局懒加载监听是否开启
let lazyLoadImgs = []; //使用数组缓存img 加载控制器，在遍历的时候更快
// 全局懒加载控制器，调用所用img组件中的图片加载控制器，只注册一个全局监听的方法做优化
const lazyLoadController = () => {
    let len = lazyLoadImgs.length;
    for(let i =0;i < len; ){
        lazyLoadImgs[i].fun();
        i+1 < len && lazyLoadImgs[i+1].fun();// 循环更快
        i+2 < len && lazyLoadImgs[i+2].fun();
        i+=3;
    }
    if(len === 0 && isListen === true){
        window.removeEventListener('scroll', lazyLoadController, false);
        window.removeEventListener('resize', lazyLoadController, false);
        isListen = false;
    }
};

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
            loading: true,
            isLoadingError: false,
        }
    }
    componentWillMount() {
        if(!this.props.lazy) {
            this.doLoad();
        } else {
            lazyLoadImgs.push({
                id: this.id,
                fun: this.lazyLoadController,
            });
            if(!isListen){
                isListen = true;
                window.addEventListener('scroll', lazyLoadController, false);
                window.addEventListener('resize', lazyLoadController, false);
            }
        }
    }
    releaseImg() { // 释放缓存,图片加载完成，组件被销毁时调用
        for(let i =0;i<lazyLoadImgs.length; i++){
            if(lazyLoadImgs[i].id === this.id) {
                lazyLoadImgs.splice(i,1);
            }
        }
        // window.removeEventListener('scroll', this.lazyLoadController, false);
        let { img } = this;
        img.onload = null;
        img.onerror = null;
        img = null;
        this.img = img;
        this.el = null;
    }
    doLoad(){ //执行图片加载操作
        let img = new Image();
        img.src = this.props.src;
        img.onload = this.onLoad;
        img.onerror = this.loadErr;
        this.img = img; //无须将img 放到state中，因为img跟页面没关系，而且加入state会多一次渲染
    }
    onLoad() { // 图片加载完成后的操作
        this.releaseImg();
        this.setState({
            loading: false,
        });
    }
    loadErr(){ // // 图片加载失败后的操作
        this.releaseImg();
        this.setState({
            isLoadingError: true,
        });
        console.log('img load error');
    }
    
    lazyLoadController(el){ // 图片懒加载控制器
        if(!this.props.lazy) return;
        if(getObjectType(el) !== 'HTMLDivElement' && !this.el) return;
        if(getObjectType(el) !== 'HTMLDivElement' && !!this.el) el = this.el;
        else if(!!el && !this.el) this.el = el;
        // 当元素在视界中时，加载图片
        if(!!el && isInViewport(el, this.props.type) && !this.img) this.doLoad();

    }
    componentWillUnmount(){
        this.releaseImg();
    }
    render(){
        const { 
            src,
            className,
        } = this.props;
        return (this.state.loading) ? (
            <div className={`img ${className}`} ref={this.lazyLoadController}>
                <Flower size={50} petalNum={12} petalBorderRadius={2} time={1}/>
            </div>
        ) : <img src={src} className={className}/>
    }
}

Img.defaultProps = {
    src: defImg,
    lazy: false,
    type: 'part',
};

export default Img;