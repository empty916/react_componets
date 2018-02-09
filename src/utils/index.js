/**
 * 判断dom元素是否在视界中
 * @param {*} el dom元素
 * @param {*} ratio 判断在几倍视界中 >=1
 */
export const isInViewport = (el, ratio) => {
    if(Object.prototype.toString.call(el) !== '[object HTMLDivElement]') return;
    const {
        top,
        bottom,
        left,
        right
    } = el.getBoundingClientRect();
    const {
        innerHeight,
        innerWidth
    } = window;
    if(typeof ratio !== 'number') ratio = 1;
    else Math.max(1, ratio);

    ratio-= 1;
    let topLimit = -ratio * innerHeight;
    let bottomLimit = (1 + ratio) * innerHeight;
    let leftLimit = -ratio * innerWidth;
    let rightLimit = (1 + ratio) * innerWidth;

    return top >= topLimit &&
        bottom <= bottomLimit &&
        left >= leftLimit &&
        right <= rightLimit

};

// 获取对象类型，首字母大写
export const getObjectType = obj => Object.prototype.toString.call(obj).slice(8).replace(']', '');

// 生成id
export const makeUniqueID = (randomLength = 8) => Number(Math.random().toString().substr(3,randomLength) + Date.now()).toString(36);

