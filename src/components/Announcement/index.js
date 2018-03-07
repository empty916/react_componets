import React, { PureComponent } from 'react'
import './style.scss'

/**
 * 公告跑马灯组件
 * 公告文字
 * 公告动画时间
 * 公告动画延迟执行时间
 */

class Announcement extends PureComponent {
    state = {
        spanClass: 1,
        ratio: 1,
    };
    constructor(props) {
        super(props);
        this.update = this.update.bind(this);
        this.getSize = this.getSize.bind(this);
    }

    update() {
        this.setState({ spanClass: 2 });
    }

    getSize(el) {
        if(!el) return;
        let span = el.children[0];
        let data = {
            ratio: 1 + el.clientWidth / span.clientWidth,
        };
        if(span.clientWidth < el.clientWidth){
            data.spanClass = false;
        }
        this.setState(data);
    }

    render() {
        let {
            duration,
            delay,
            content,
        } = this.props;
        const {
            spanClass,
            ratio,
        } = this.state;
        delay = spanClass === 1 ? delay : 0;
        duration = spanClass === 1 ? duration : duration * ratio;

        return <div id="announcement" ref={this.getSize}>
            <span
                style={{
                    animationDelay: `${delay}s`,
                    animationDuration: `${duration}s`,
                }}
                className={ !!spanClass ? `span${spanClass}` : '' }
                onAnimationEnd={this.update}>{content}</span>
        </div>
    }
}

Announcement.defaultProps = {
    duration: 10,
    delay: 3,
    content: 'null',
};

export default Announcement;