
// 全局懒加载监听是否开启
export let isListen = false;
//使用数组缓存img 加载控制器，在遍历的时候更快
export let lazyLoadImgs = [];
let idMap = {}; // lazyLoadImgs id map
let idMap2 = {}; // img buffer id map
let imgBuffer = [];
let bufferLen = 10;

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
    if(imgBuffer.length > bufferLen) return;
    arr = arr.slice();
    let isNearSign;
    for(let i = 0; i < arr.length; i++){
        let img = arr[i];
        img && img.fun(false, 0.5);
        if(!!img.isNear && !idMap2[img.id]){
            imgBuffer.push(img);
            idMap2[img.id] = true;
        }
        if(!!isNearSign && !img.isNear) {
            let ibl = imgBuffer.length;
            imgBuffer.splice((ibl - bufferLen) * 0.5 , (ibl + bufferLen) * 0.5);
            break;
        }
        isNearSign = img.isNear;
    }
};
// buffer 自我检查
const bufferCheck = () => {
    console.log('bufferCheck ', imgBuffer);
    imgBuffer = imgBuffer.filter(img => {
        if(!img.isNear) {
            delete idMap2[img.id];
            return false;
        }
        return true;
    });
    console.log('bufferCheck ', imgBuffer);
};
/**
 * 图片缓冲区的图片要没了的时候调用
 * 添加缓冲图片
 */
const addBufferImg = () => {
    bufferCheck();
    if(imgBuffer.length > bufferLen) return;
    // console.log('addBufferImg step 1', imgBuffer);
    // console.log('addBufferImg step 2', imgBuffer);
    if(!imgBuffer.length){
        let isNearSign;
        for(let i = 0; i < lazyLoadImgs.length; i++){
            let img = lazyLoadImgs[i];
            if(!img.isNear) {
                imgBuffer.push(img);
                idMap2[img.id] = true;
            }
            if(!!isNearSign && !img.isNear) {
                let ibl = imgBuffer.length;
                imgBuffer.splice((ibl - bufferLen) * 0.5 , (ibl + bufferLen) * 0.5);
                break;
            }
            isNearSign = img.isNear;
        }
    }
    // console.log('addBufferImg step 3', imgBuffer);
    if(imgBuffer.length < bufferLen / 2 && imgBuffer.length) {
        let index = lazyLoadImgs.findIndex(img => imgBuffer[0].id === img.id);
        let startIndex = Math.max(0, index - 10);
        let endIndex = Math.min(lazyLoadImgs.length, index + 10);
        let secondBuffer = lazyLoadImgs.slice(startIndex, endIndex);
        if(secondBuffer.length >= 10)
            secondBuffer.slice((secondBuffer.length - bufferLen) / 2, bufferLen);
        doAdd(secondBuffer);
    }
    // console.log('addBufferImg step 4', imgBuffer);
    bufferCheck();
    // console.log('addBufferImg step 5', imgBuffer);
    if(imgBuffer.length <= 1) {
        console.log('addBufferImg ===> lazyLoadImgs');
        doAdd(lazyLoadImgs);
    }
    // console.log('addBufferImg step 6', imgBuffer);
};
// 全局懒加载控制器，调用所用img组件中的图片加载控制器，只注册一个全局监听的方法做优化
// 因为默认监听window scroll 事件，但是会有其他的情况也会造成视图变化，所以将控制器给开发者控制
let timer = null;
let cacling = false;
const controlImgLoad = () => {
    if(cacling) return;
    addBufferImg();
    let arr = (imgBuffer.length >= 1 ? imgBuffer : lazyLoadImgs).slice();
    let len = arr.length;
    for(let i =0; i < len; i++){
        let _img = arr[i];
        _img && _img.fun(false, 0.5);
        if( !!_img.isNear &&
            imgBuffer.length < bufferLen &&
            !idMap2[_img.id]) { // 不重复添加
            idMap2[_img.id] = true;
            imgBuffer.push(_img);
        }
        // else if(!_img.isNear && !!idMap2[_img.id]) {
        //     delete idMap2[_img.id];
        //     let idx = imgBuffer.findIndex(img => img.id === _img.id);
        //     idx > -1 && imgBuffer.splice(idx, 1);
        // }
    }
    timer = null;
    cacling =false;
};


export const lazyLoadController = () => {
    console.log('lazyLoadController step 1', imgBuffer.length);
    let len = lazyLoadImgs.length;
    if(!!timer) clearTimeout(timer);
    timer = setTimeout(controlImgLoad, 16);
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