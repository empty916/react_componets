import React, { PureComponent } from 'react'
import './style.scss'

class Loading extends PureComponent{
    constructor(props){
        super(props);
    }
    render(){
        const itemNum = 24;
        const { text } = this.props;
        let items = [];
        for(let i=0; i < itemNum; i++) {
            items.push(<div key={i} className='item'/>);
        }
        return(
            <div id="loading">
                <div className="wrapper">
                    <div className='loading-icon'>{items}</div>
                    <div className="loading-text">{text}</div>
                </div>
            </div>
        )
    }
}

Loading.defaultProps = {
    text: '加载中',
};

export default Loading;