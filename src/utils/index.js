/**
 * 判断dom元素是否在视界中
 * @param {*} el dom元素
 */
export const isInViewport = el => {
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


    let topLimit = 0;
    let bottomLimit = innerHeight;
    let leftLimit = 0;
    let rightLimit = innerWidth;

    let calcLimit = ratio => {
        ratio-= 1;
        topLimit = -ratio * innerHeight;
        bottomLimit = (1 + ratio) * innerHeight;
        leftLimit = -ratio * innerWidth;
        rightLimit = (1 + ratio) * innerWidth;
    };
    let isInLimitView = () => (
        top >= topLimit &&
        bottom <= bottomLimit &&
        left >= leftLimit &&
        right <= rightLimit
    );

    bottomLimit = 0.5 * innerHeight;
    if(isInLimitView())return true;
    calcLimit(1);
    if(isInLimitView())return 1;
    calcLimit(1.6);
    if(isInLimitView())return 1.6;
    calcLimit(2.1);
    if(isInLimitView())return 2.1;
    calcLimit(5);
    if(isInLimitView())return 5;
    return -1;

};

// 获取对象类型，首字母大写
export const getObjectType = obj => Object.prototype.toString.call(obj).slice(8).replace(']', '');

// 生成id
export const makeUniqueID = (randomLength = 8) => Number(Math.random().toString().substr(3,randomLength) + Date.now()).toString(36);

