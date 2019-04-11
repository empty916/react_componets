import React, { PureComponent } from 'react'
import './style.scss'

/**
 * 这个组件只是一个菊花🌻
 * petal：花瓣
 */
const r = px => {
    return `${px}px`;
    // if(/[A-Za-z]/.test(px)){ // 去除字母
    //     px = px.replace(/[A-Za-z]/g, '');
    // }
    // if(px=='1'){
    //     return '1px';
    // } else if(/%/.test(px)){
    //     return px;
    // } else {
    //     return px / 75 + 'rem';
    // }
}; // 样式单位适配

// petalNum = 24; // 花瓣数量
// time = 0.05; // 一个菊花闪烁的频率，数值越小表示 菊花转的越快 
// petalWidth = 4; // 花瓣的宽度
// petalHeight = 18; // 花瓣的高度
// petalBorderRadius = 1;  // 花瓣的圆角
// petalBackGroundColor = '#000';
// animationDuration = time * petalNum; // 菊花转一圈的时间
// rotateDeg = 360/petalNum; // 每一瓣花瓣的旋转角度

class Flower extends PureComponent{

    constructor(){
        super();
        this.state = {
            initOpacity: '0', // 菊花 初始|最小 透明度,
        };
    }
    componentWillMount() {
        this.refresh();
    }
    componentWillReceiveProps(newProps){
        this.refresh(newProps);
    }
    shouldComponentUpdate(){
        return this.props.update || false;
    }
    refresh = props => {
        let { 
            size, 
            time,
            bgColor, 
            petalNum,
            petalWidth, 
            petalHeight, 
            petalBorderRadius,
            scale,
        } = props ? props : this.props;

        petalNum = props ? this.state.petalNum : petalNum;
        time = time ? time/petalNum : this.state.time;

        let state = {};
        state.time = time;
        state.scale = scale;
        state.petalHeight = !!petalHeight ? petalHeight : (size / 4);
        state.petalBorderRadius = petalBorderRadius;
        state.petalBackGroundColor = bgColor;
        state.petalWidth = petalWidth;
        state.petalNum = petalNum;
        state.animationDuration = state.time * petalNum; // 菊花转一圈的时间
        state.rotateDeg = 360/petalNum; // 每一瓣花瓣的旋转角度
        this.setState(state);
    };
    flowerStyle = () => (
        { // 花的样式
            width: r(this.state.petalHeight * 4),
            height: r(this.state.petalHeight * 4),
        }
    );
    // 矫正位置用的 因为菊花的中心是transformOrigin往右移了半个花瓣宽度，所以菊花容器要左移等长距离
    translateWrapper = () => { 
        return {
            transform: `translateX(${r(this.state.petalWidth / -2)})`,
        }
    };
    getPetalStyle = index => {
        const {
            petalWidth,
            petalHeight,
            initOpacity,
            petalBackGroundColor,
            petalBorderRadius,
            animationDuration,
            rotateDeg,
            time,
            scale,
        } = this.state;

        const wrapper = { // 根据index生成petal样式
            // width: r(petalWidth),
            // height: r(petalHeight),
            position: 'absolute',
            left: '50%',
            opacity: initOpacity,
            transformOrigin: `${r(petalWidth / 2)} ${r(petalHeight * 2)}`,
            transform: `rotate(${index * rotateDeg}deg)`,
            // webkitAnimation: `load ${animationDuration}s ease infinite`,
            WebkitAnimation: `load-opacity ${animationDuration}s linear ${time * index}s infinite`,
            animation: `load-opacity ${animationDuration}s linear ${time * index}s infinite`,
        }
        const child = {
            width: r(petalWidth),
            height: r(petalHeight),
            
            backgroundColor: petalBackGroundColor,
            borderRadius: r(petalBorderRadius),
        }
        if (scale) {
            child.WebkitAnimation = `load-scale ${animationDuration}s linear ${time * index}s infinite`;
            child.animation = `load-scale ${animationDuration}s linear ${time * index}s infinite`;
        }
        return {
            wrapper,
            child,
        }
    };

    
    render(){
        let petals = [];
        for(let i=0; i < this.state.petalNum; i++) {
            petals.push((
                <div key={i} style={this.getPetalStyle(i).wrapper}>
                    <div style={this.getPetalStyle(i).child}></div>
                </div>
            ));
        }

        return(
            <div id="flower" style={this.flowerStyle()}>
                <div className="wrapper" style={this.translateWrapper()}>{petals}</div>
            </div>
        )
    }
}

Flower.defaultProps = {
    size: 72, // 菊花大小 优先级低于petaHeight
    petalWidth: 4, // 花瓣宽度
    // petalHeight: 18, // 花瓣高度
    petalBorderRadius: 1, // 花瓣圆角大小
    bgColor: '#fff', // 花瓣背景色
    petalNum: 24, // 花瓣数量
    time: 0.05*24, // 转动一圈所用的时间,感觉应该叫cycle(周期) 或者 frequency(频率)好点，
    update: false,// 要不要实时更新？就是动态修改菊花属性的时候会更新
    scale: true,
};

export default Flower;