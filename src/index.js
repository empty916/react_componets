import React from 'react'
import ReactDOM from 'react-dom'
import './style/core/base.scss'
import './style.scss'
import Img from './components/Img'
import Slide from './components/Slide'

const rootElement = document.getElementById('app');

let imgs = [
"http://pic1.win4000.com/wallpaper/8/58f48e128666f.jpg"
,"http://pic1.win4000.com/wallpaper/6/57d275c0abf74.jpg"
,"http://www.vsochina.com/data/uploads/resource/batch/2/110174992053a276b26bad4.jpg"
,"http://4493bz.1985t.com/uploads/allimg/150604/1-150604143424.jpg"
,"http://abc.2008php.com/2012_Website_appreciate/2012-02-12/20120212034025.jpg"
,"http://uploadfile.bizhizu.cn/2015/0430/20150430020318313.jpg"
,"http://img.tuku.cn/file_big/201502/d16c9d1ae4834e8ba13271cdcf94bb0f.jpg"
,"http://pic1.win4000.com/wallpaper/8/58fefb49c18a3.jpg"
,"http://pic1.win4000.com/wallpaper/b/57faf439bbdbb.jpg"
,"http://pic1.win4000.com/wallpaper/8/58fefb31cba49.jpg"
,"http://img.tuku.cn/file_big/201502/f4490c6cdb9b42cd9d6d856e502fa328.jpg"
,"http://a.hiphotos.baidu.com/baike/c0%3Dbaike52%2C5%2C5%2C52%2C17/sign=5ca33fe35edf8db1a8237436684ab631/3812b31bb051f81986db3d31dab44aed2f73e7ca.jpg"
,"http://img.25pp.com/uploadfile/bizhi/ipad3/2015/0205/20150205091238360_ipad3.jpg"];

const sources = imgs.map(item=><Img className='img' src={item} lazy/>);

ReactDOM.render(
	<div>
        <Slide sources={sources}/>
        {/*{sources}*/}
    </div>,
    rootElement
);
