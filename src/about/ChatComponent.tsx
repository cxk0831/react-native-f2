import React, {Component} from "react";
import F2 from "@antv/f2";

export class ChatComponent extends Component<any, any> {
    componentDidMount() {
        const data = [
            { genre: 'Sports', sold: 275 },
            { genre: 'Strategy', sold: 115 },
            { genre: 'Action', sold: 120 },
            { genre: 'Shooter', sold: 350 },
            { genre: 'Other', sold: 150 },
        ];

        const chart = new F2.Chart({
            id: 'myChart',
            pixelRatio: window.devicePixelRatio, // 指定分辨率
        });

        chart.source(data);

        chart
            .interval()
            .position('genre*sold')
            .color('genre');

        chart.render();
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        alert('错误输出')
    }

    render(){
        return (
            <div style={{width: '100%', backgroundColor: '#b51212'}}>
                <canvas id="myChart" width="500" height="260"></canvas>
            </div>
        )
    }
}
