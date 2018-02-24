
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
    if(!!img) img.isNear = value;
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

const findNearImg = (exeFun = false) => {
    if(imgBuffer.length) return;
    for (let i = 0; i < lazyLoadImgs.length; i++) {
        let img = lazyLoadImgs[i];
        if(exeFun) img.fun(false, 0.5);
        if (!!img.isNear) {
            imgBuffer.push(img);
            idMap2[img.id] = true;
            break;
        }
    }
};
/**
 * 图片缓冲区的图片要没了的时候调用
 * 添加缓冲图片
 */
const addBufferImg = () => {
    bufferCheck();
    !imgBuffer.length && findNearImg();
    !imgBuffer.length && findNearImg(true);

    if(imgBuffer.length) {
        let index = lazyLoadImgs.findIndex(img => imgBuffer[0].id === img.id);
        let startIndex = Math.max(0, index - 15);
        let endIndex = Math.min(lazyLoadImgs.length, index + imgBuffer.length + 15);
        let secondBuffer = lazyLoadImgs.slice(startIndex, endIndex);
        if(secondBuffer && !!secondBuffer.length) {
            secondBuffer.forEach(img=>idMap2[img.id] = true);
            imgBuffer = secondBuffer;
        }
    }

};
// 全局懒加载控制器，调用所用img组件中的图片加载控制器，只注册一个全局监听的方法做优化
// 因为默认监听window scroll 事件，但是会有其他的情况也会造成视图变化，所以将控制器给开发者控制
let timer = null;
let cacling = false;

export const doLazyLoad = () => {
    if(timer) clearTimeout(timer);
    timer = setTimeout(lazyLoadController, 16);
};
export const lazyLoadController = () => {

    if(cacling) return;
    let dataLen = lazyLoadImgs.length;
    if(dataLen > 100) addBufferImg();
    console.log('img buffer', imgBuffer);
    let arr = (!!imgBuffer.length ? imgBuffer : lazyLoadImgs).slice();
    let len = arr.length;
    for(let i =0; i < len; i++) arr[i].fun(false, 0.5);
    cacling =false;

    if(!lazyLoadImgs.length && isListen === true) toggleListener('remove');
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