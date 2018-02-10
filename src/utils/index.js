/**
 * 判断dom元素是否在视界中
 * @param {*} el dom元素
 * @param {*} ratio 判断在几倍视界中
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

    if(typeof ratio !== 'number' || ratio <=0) ratio = 1;

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
    if(ratio >= 1){
        calcLimit(ratio);
    } else {
        bottomLimit = ratio * innerHeight;
    }
    if(isInLimitView()){
        return 1;
    } else {
        calcLimit(4);
        if(isInLimitView()){
            // 在4屏以内就返回4了
            return 4;
        }
        return 0;

    }

};

// 获取对象类型，首字母大写
export const getObjectType = obj => Object.prototype.toString.call(obj).slice(8).replace(']', '');

// 生成id
export const makeUniqueID = (randomLength = 8) => Number(Math.random().toString().substr(3,randomLength) + Date.now()).toString(36);

