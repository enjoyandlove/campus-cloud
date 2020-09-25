import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'cp-health-dashboard-location-view-graph',
  templateUrl: './health-dashboard-location-view-graph.component.html',
  styleUrls: ['./health-dashboard-location-view-graph.component.scss']
})
export class HealthDashboardLocationViewGraphComponent implements OnInit {
  series = [];
  labels = [];
  _series;
  percentages;
  xAxis = {
    show: true,
    type: 'category',
    data: ['']
  };
  yAxis = {
    show: true,
    type: 'value'
  };

  @Input()
  set chartData(data) {
    data.map((item, index) => {
      this.series[index] = item.checkins;
      this.labels[index] = item.hour;
      this.xAxis.data[index] = item.hour;
    });
    this.drawChart();
  }

  constructor() {}
  drawChart() {
    let topVal = [];
    let temp = [...this.series];
    for (let i = 0; i < 3; i++) {
      topVal = [...topVal, this.series.indexOf(Math.max(...temp))];
      temp.splice(temp.indexOf(Math.max(...temp)), 1);
    }
    const newSeries = this.series.map((item, index) => {
      return topVal.includes(index) ? { value: item, itemStyle: { color: '#FF2121' } } : item;
    });

    this._series = [
      {
        data: newSeries,
        type: 'bar'
      }
    ];
  }
  ngOnInit(): void {}
}
