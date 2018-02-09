/**
 * 判断dom元素是否在视界中
 * @param {*} el dom元素
 * @param {*} type 判断类型
 * 'complete': 判断是否完全在视界中
 * 'part': 判断是否部分在视界中
 */
export const isInViewport = (el, type = 'complete') => {
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
    if (type === 'part') {
        return (top <= innerHeight && top >= 0 && left >= 0 && left <= innerWidth) ||
            (top <= innerHeight && top >= 0 && right >= 0 && right <= innerWidth) ||
            (bottom <= innerHeight && bottom >= 0 && left >= 0 && left <= innerWidth) ||
            (bottom <= innerHeight && bottom >= 0 && right >= 0 && right <= innerWidth);

    } else {
        return top >= 0 &&
            bottom <= innerHeight &&
            left >= 0 &&
            right <= innerWidth
    }

}

// 获取对象类型，首字母大写
export const getObjectType = obj => Object.prototype.toString.call(obj).slice(8).replace(']', '');

// 生成id
export const makeUniqueID = (randomLength = 8) => Number(Math.random().toString().substr(3,randomLength) + Date.now()).toString(36);
