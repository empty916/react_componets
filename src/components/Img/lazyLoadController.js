
// 全局懒加载监听是否开启
export let isListen = false;
//使用数组缓存img 加载控制器，在遍历的时候更快
export let lazyLoadImgs = [];
// 保证需要处理的图片在30张以内，否则超大量图片的场景会卡死
let idMap = {};
let imgBuffer = [];
let bufferLen = 10;

export const addImg = img => {
    if(!!idMap[img.id]) return; // 不重复添加
    idMap[img.id] = 1;
    lazyLoadImgs.push(img);
};
// 从队列中删除需要懒加载的图片
export const removeImgById = id => {
    delete addImg[id];
    const i1 = lazyLoadImgs.findIndex(img => img.id === id);
    const i2 = imgBuffer.findIndex(img => img.id === id);
    i1 > -1 && lazyLoadImgs.splice(i1, 1);
    i2 > -1 && imgBuffer.splice(i2, 1);
};
// 标记此图是否在附近了
export const signImgIsNear = (id, value) => {
    let img = lazyLoadImgs.find(img => img.id === id);
    let img2 = imgBuffer.find(img => img.id === id);
    if(!!img) img.isNear = value;
    if(!!img2) img2.isNear = value;
};
// 全局懒加载控制器，调用所用img组件中的图片加载控制器，只注册一个全局监听的方法做优化
// 因为默认监听window scroll 事件，但是会有其他的情况也会造成视图变化，所以将控制器给开发者控制
let timer = null;

let cacling = false;
/**
 * 配置懒加载控制器，
 * @param new_config
 */
export const configController = (new_config) => {
    config = {...config, ...new_config}
};
let doAdd = arr => {
    let start = Date.now();
    console.log('arr.length', arr.length);
    arr = arr.slice();
    for(let i = 0; i < arr.length; i++){
        let img = arr[i];
        img && img.fun(false, 0.5);
        if(!!img.isNear && idMap[img.id] === 1){
            imgBuffer.push(img);
            idMap[img.id]++;
        }
        if(imgBuffer.length >= bufferLen) break;
    }
    console.log('time cost ===> ' + (Date.now() - start))
};
const creatInViewImgPos = arr => {
    let start = Date.now();
    for(let i = 0; i < arr.length; i++){
        let img = arr[i];
        img && img.fun(false, 0.5);
        if(img.isNear === true || img.isNear === 1) {
            console.log('in view img.id ======> ', img.id);
            console.log(`================creatInViewImgPos cost ${ Date.now() - start }================`);
            return img.id;
        }
    }
};
/**
 * 图片缓冲区的图片要没了的时候调用
 * 添加缓冲图片
 */
const addBufferImg = id => {

    // 找到视觉中心的 索引，id
    let index = lazyLoadImgs.findIndex(img => img.id === id);
    if(index === -1){
        index = lazyLoadImgs.findIndex(img => img.isNear === true || img.isNear === 1 || img.isNear === 2);
        id = lazyLoadImgs[index].id;
    }


    if(imgBuffer.findIndex(img => img.id === id) === -1){
        for(let i = 0; i < imgBuffer.length; i++) {
            idMap[imgBuffer[i].id] = 1;
        }
        imgBuffer = [];
    }

    if(imgBuffer.length === 0) {
        imgBuffer.push(lazyLoadImgs[index]);
        idMap[lazyLoadImgs[index].id] = 2;
    }

    if(imgBuffer.length <= bufferLen / 2 && imgBuffer.length) {
        // let index = lazyLoadImgs.findIndex(img => imgBuffer[0].id === img.id);
        let startIndex = Math.max(0, index - 10);
        let endIndex = Math.min(lazyLoadImgs.length, index + 10);
        let secondBuffer = lazyLoadImgs.slice(startIndex, endIndex);
        doAdd(secondBuffer);
    }
    if(imgBuffer.length <= 1) {
        console.log('addBufferImg ===> lazyLoadImgs');
        doAdd(lazyLoadImgs);
    }
};
let tt = 0;
let ttt = null;
const controlImgLoad = (centerImgId) => {
    tt++;
    if(!!ttt) clearTimeout(ttt);
    ttt = setTimeout(() => {
        console.log('frequency>>>>>>>>>>', tt);
        tt = 0;
    }, 20);

    if(cacling) return;
    addBufferImg(centerImgId);
    let arr = (imgBuffer.length >= 1 ? imgBuffer : lazyLoadImgs).slice();
    let len = arr.length;
    console.log(imgBuffer.length === arr.length);
    for(let i =0; i < len; i++){
        arr[i] && arr[i].fun(false, 0.5);
        if( !!arr[i].isNear &&
            imgBuffer.length < bufferLen &&
            idMap[arr[i].id] === 1) { // 不重复添加

            idMap[arr[i].id]++;
            imgBuffer.push(arr[i]);
        }
    }
    timer = null;
    cacling =false;
};

export const lazyLoadController = () => {
    let len = lazyLoadImgs.length;
    let centerImgId = creatInViewImgPos(lazyLoadImgs);
    // controlImgLoad();
    if(!!timer) clearTimeout(timer);
    timer = setTimeout(() => controlImgLoad(centerImgId), 16);
    if(len === 0 && isListen === true) toggleListener('remove');
};

export const toggleListener = type => {
    if(type === 'add'){
        isListen = true;
        window.addEventListener('scroll', lazyLoadController, false);
        window.addEventListener('resize', lazyLoadController, false);
        setTimeout(lazyLoadController, 16);
    }
    if(type === 'remove'){
        window.removeEventListener('scroll', lazyLoadController, false);
        window.removeEventListener('resize', lazyLoadController, false);
        isListen = false;
    }
};