import React, { PureComponent } from 'react'
import { isInViewport, getObjectType, makeUniqueID } from '../../utils'
import Flower from '../Flower'

import './style.scss'
import defImg from '../../images/start_up_lady.png'

// 全局懒加载监听是否开启
let isListen = false;
//使用数组缓存img 加载控制器，在遍历的时候更快
let lazyLoadImgs = [];
// 全局懒加载控制器，调用所用img组件中的图片加载控制器，只注册一个全局监听的方法做优化
// 因为默认监听window scroll 事件，但是会有其他的情况也会造成视图变化，所以将控制器给开发者控制
let timer = null;
export const lazyLoadController = () => {
    let len = lazyLoadImgs.length;
    let controllImgLoad = () => {
        //1倍视界图优先加载
        let baseRatio = 1;
        for(let i =0;i < len; ){
            lazyLoadImgs[i].fun(false, baseRatio);
            i+1 < len && lazyLoadImgs[i+1].fun(false, baseRatio);
            i+2 < len && lazyLoadImgs[i+2].fun(false, baseRatio);
            i+=3;
        }
        //2倍视界图次优先加载
        for(let i =0;i < len; ){
            lazyLoadImgs[i].fun(false, baseRatio + 1);
            i+1 < len && lazyLoadImgs[i+1].fun(false, baseRatio + 1);
            i+2 < len && lazyLoadImgs[i+2].fun(false, baseRatio + 1);
            i+=3;
        }
    };

    // controllImgLoad();
    if(!!timer) clearTimeout(timer);
    timer = setTimeout(controllImgLoad, 20);

    if(len === 0 && isListen === true) toggleListener('remove');
};

const toggleListener = type => {
    if(type === 'add'){
        isListen = true;
        window.addEventListener('scroll', lazyLoadController, false);
        window.addEventListener('resize', lazyLoadController, false);
        setTimeout(lazyLoadController, 100);
    }
    if(type === 'remove'){
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
            if(!isListen) toggleListener('add');
        }
    }
    // 释放缓存,图片加载完成，组件被销毁时调用
    releaseImg() {
        for(let i =0;i<lazyLoadImgs.length; i++){
            if(lazyLoadImgs[i].id === this.id) {
                lazyLoadImgs.splice(i,1);
            }
        }
        let { img } = this;
        img.onload = null;
        img.onerror = null;
        img = null;
        this.img = img;
        this.el = null;
    }
    //执行图片加载操作
    doLoad(){
        let img = new Image();
        img.src = this.props.src;
        img.onload = this.onLoad;
        img.onerror = this.loadErr;
        //无须将img 放到state中，因为img跟页面没关系，而且加入state会多一次渲染
        this.img = img;
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
        if(!this.props.lazy || !!this.img) return;
        if(getObjectType(el) !== 'HTMLDivElement' && !this.el) return;
        if(getObjectType(el) !== 'HTMLDivElement' && !!this.el) el = this.el;
        else if(!!el && !this.el) this.el = el;
        // 当元素在视界中时，加载图片
        if(!!el && isInViewport(el, ratio)) this.doLoad();
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
                <Flower
                    size={50}
                    petalNum={12}
                    petalBorderRadius={2}
                    time={1}/>
            </div>
        ) : <img src={src} className={className}/>
    }
}

Img.defaultProps = {
    src: defImg,
    lazy: false,
    type: 'part',
    className: '',
};

export default Img;