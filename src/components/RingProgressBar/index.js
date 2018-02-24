import React, { PureComponent } from 'react'
import './style.scss'
// 环形进度条
class RingProgressBar extends PureComponent{
    constructor(props) {
        super(props);
        this.drawTest = this.drawTest.bind(this);
        this.drawMain = this.drawMain.bind(this);
    }

    componentWillMount() {

    }

    drawTest(ref) {
        this.drawMain({
            drawing_elem: ref,
            currentValue: 30000,
            totalValue: 300000,
        }, 'rgb(249, 235, 181)', 'rgb(228, 140, 128)')
    }
    drawMain({ drawing_elem, currentValue, totalValue }, forecolor, bgcolor) {
        /*
            @drawing_elem: 绘制对象
            @percent：绘制圆环百分比, 范围[0, 100]
            @forecolor: 绘制圆环的前景色，颜色代码
            @bgcolor: 绘制圆环的背景色，颜色代码
        */
        let percent = currentValue / totalValue * 100;
        let context = drawing_elem.getContext("2d");
        let center_x = drawing_elem.width / 2;
        let center_y = drawing_elem.height / 2;
        let rad = Math.PI * (2- 1/3) / 100;
        let speed = 0;
        let textValue = 0;
        let textStep = totalValue / 100 ;
        let lineWidth = 30;

        // 绘制背景圆圈
        function backgroundCircle(){
            context.save();
            context.beginPath();
            context.shadowBlur = 0;
            context.shadowColor="rgb(211, 68, 68)";
            context.lineWidth = lineWidth; //设置线宽
            let radius = center_x - context.lineWidth;
            context.lineCap = "round";
            context.strokeStyle = bgcolor;
            context.arc(center_x, center_y, radius, -Math.PI/3*4, Math.PI/3, false);
            context.stroke();
            context.closePath();
            context.restore();
            context.shadowBlur=0;
            context.shadowColor="#000";
        }

        //绘制运动圆环
        function foregroundCircle(n){
            context.save();
            let gradient = context.createLinearGradient(0, 0, center_y * 2 ,0);
            gradient.addColorStop(0, 'rgb(246, 223, 147)');   //红
            gradient.addColorStop(1, 'rgb(250, 238, 190)');   //蓝

            context.strokeStyle = gradient;
            context.lineWidth = lineWidth;
            context.lineCap = "round";
            let radius = center_x - context.lineWidth;
            context.beginPath();
            context.arc(center_x, center_y, radius , -Math.PI/3*4, -Math.PI/3*4 + n*rad, false); //用于绘制圆弧context.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)
            context.stroke();
            context.closePath();
            context.restore();
        }

        //绘制文字
        function text(n){
            context.save(); //save和restore可以保证样式属性只运用于该段canvas元素
            context.fillStyle = forecolor;
            let font_size = 40;
            context.font = font_size + "px Helvetica";
            let text_width = context.measureText(n.toFixed(0)+"%").width;
            let cy = center_y || center_y-text_width / 2;
            context.fillText(n.toFixed(0), center_x-text_width/2, cy + font_size/2);
            context.restore();
        }

        //执行动画
        (function drawFrame(){
            if(speed >= percent) return;
            else window.requestAnimationFrame(drawFrame);

            context.clearRect(0, 0, drawing_elem.width, drawing_elem.height);
            backgroundCircle();
            speed++;
            foregroundCircle(speed);
            textValue+=textStep;
            if(speed >= percent && textValue!==currentValue)textValue=currentValue;
            text(textValue);
        }());
    }
    render(){
        return(
            <div id="canvas-wrapper" >
                <canvas id="canvas"
                        ref= {this.drawTest}
                        width="500"
                        height="500"/>
            </div>
        )
    }
}

export default RingProgressBar;