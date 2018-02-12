
// 全局懒加载监听是否开启
export let isListen = false;
//使用数组缓存img 加载控制器，在遍历的时候更快
export let lazyLoadImgs = [];
let idMap = {}; // lazyLoadImgs id map
let idMap2 = {}; // img buffer id map
let imgBuffer = [];

export const addImg = img => {
    if(!!idMap[img.id]) return; // 不重复添加
    idMap[img.id] = 1;
    lazyLoadImgs.push(img);
};

// 从队列中删除需要懒加载的图片
export const removeImgById = id => {
    delete idMap[id];
    delete idMap2[id];

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

let doAdd = arr => {
    arr = arr.slice();
    let isNearSign;
    for(let i = 0; i < arr.length; i++){
        let img = arr[i];
        // if(img === undefined || img.isNear === undefined) continue;
        img.fun(false, 0.5);
        if(!!img.isNear && !idMap2[img.id]){
            imgBuffer.push(img);
            idMap2[img.id] = true;
        }
        if(!!isNearSign && !img.isNear) break;
        isNearSign = img.isNear;
    }
};
// buffer 自我检查
const bufferCheck = () => {
    if(!imgBuffer.length) return;
    imgBuffer = imgBuffer.filter(img => {
        if(!img.isNear) {
            delete idMap2[img.id];
            return false;
        }
        return true;
    });
};
/**
 * 图片缓冲区的图片要没了的时候调用
 * 添加缓冲图片
 */
const addBufferImg = () => {
    bufferCheck();
    if(!imgBuffer.length){
        let isNearSign;
        for(let i = 0; i < lazyLoadImgs.length; i++){
            let img = lazyLoadImgs[i];
            if(!img.isNear) {
                imgBuffer.push(img);
                idMap2[img.id] = true;
            }
            if(!!isNearSign && !img.isNear || imgBuffer.length > 20) break;
            isNearSign = img.isNear;
        }
        bufferCheck();
    }
    if(imgBuffer.length) {
        let index = lazyLoadImgs.findIndex(img => imgBuffer[0].id === img.id);
        let startIndex = Math.max(0, index - 15);
        let endIndex = Math.min(lazyLoadImgs.length, index + 15);
        let secondBuffer = lazyLoadImgs.slice(startIndex, endIndex);
        console.log('use secondBuffer', secondBuffer.length);
        doAdd(secondBuffer);
        return;
    }
    bufferCheck();
    console.log('use lazyLoadImgs', lazyLoadImgs.length);
    if(imgBuffer.length <= 1) doAdd(lazyLoadImgs);
};
// 全局懒加载控制器，调用所用img组件中的图片加载控制器，只注册一个全局监听的方法做优化
// 因为默认监听window scroll 事件，但是会有其他的情况也会造成视图变化，所以将控制器给开发者控制
let timer = null;
let cacling = false;

const controlImgLoad = () => {
    if(cacling) return;
    let dataLen = lazyLoadImgs.length;
    if(dataLen > 100) addBufferImg();
    let arr = (imgBuffer.length >= 1 ? imgBuffer : lazyLoadImgs).slice();
    let len = arr.length;
    console.log('img buffer len', imgBuffer.length);
    for(let i =0; i < len; i++) arr[i].fun(false, 0.5);
    // console.log('img buffer', imgBuffer);
    // timer = null;
    cacling =false;
};
export const doLazyLoad = () => {
    if(timer) clearTimeout(timer);
    timer = setTimeout(lazyLoadController, 16);
};
export const lazyLoadController = () => {
    let len = lazyLoadImgs.length;
    controlImgLoad();
    if(len === 0 && isListen === true) toggleListener('remove');
};

export const toggleListener = type => {
    if(type === 'add'){
        isListen = true;
        window.addEventListener('scroll', lazyLoadController, false);
        window.addEventListener('resize', lazyLoadController, false);
        window.addEventListener('change', lazyLoadController, false);
        setTimeout(lazyLoadController, 100);
    }
    if(type === 'remove'){
        window.removeEventListener('scroll', lazyLoadController, false);
        window.removeEventListener('resize', lazyLoadController, false);
        window.removeEventListener('change', lazyLoadController, false);
        isListen = false;
    }
};