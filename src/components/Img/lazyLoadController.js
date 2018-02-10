
// 全局懒加载监听是否开启
export let isListen = false;
//使用数组缓存img 加载控制器，在遍历的时候更快
export let lazyLoadImgs = [];
// 保证需要处理的图片在30张以内，否则超大量图片的场景会卡死
let idMap = {};
let imgBuffer = [];
let bufferLen = 10;
let useBuffer = 30;

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

let config = {
    startRatio: 0.5, // 初始视界倍率
    step: 0.5, // 视界倍率增长步长
    limitRatio: 2, // 最大视界倍率
    frequency: 16, // 监听事件函数执行频率
};
let cacling = false;
/**
 * 配置懒加载控制器，
 * @param new_config
 */
export const configController = (new_config) => {
    config = {...config, ...new_config}
};

const controlImgLoad = () => {
    if(cacling) return;
    imgBuffer = imgBuffer.filter(img => img.isNear);
    console.log(imgBuffer, lazyLoadImgs);
    let arr = (imgBuffer.length >= 1 ? imgBuffer : lazyLoadImgs).slice();
    console.log(lazyLoadImgs.length, imgBuffer.length, bufferLen);

    let len = arr.length;
    //1倍视界图优先加载
    //1 + step倍视界图次优先加载
    //1 + step * 2倍视界图次优先加载
    // ...
    for(let baseRatio = config.startRatio; baseRatio <= config.limitRatio; baseRatio += config.step){
        for(let i =0; i < len; i++){
            arr[i] && arr[i].fun(false, baseRatio);
            if( arr[i].isNear &&
                imgBuffer.length < bufferLen &&
                idMap[arr[i].id] === 1) { // 不重复添加

                idMap[arr[i].id]++;
                imgBuffer.push(arr[i]);
            }
        }
    }
    timer = null;
    cacling =false;
};

export const lazyLoadController = () => {
    let len = lazyLoadImgs.length;
    if(!!timer) clearTimeout(timer);
    timer = setTimeout(controlImgLoad, config.frequency);
    if(len === 0 && isListen === true) toggleListener('remove');
};

export const toggleListener = type => {
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