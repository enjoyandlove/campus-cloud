import { Input, OnInit, Component } from '@angular/core';

@Component({
  selector: 'cp-dashboard-social-activity-chart',
  templateUrl: './dashboard-social-activity-chart.component.html',
  styleUrls: ['./dashboard-social-activity-chart.component.scss']
})
export class DashboardSocialActivyChartComponent implements OnInit {
  series;
  labels;
  _series;
  percentages;
  xAxis = {
    show: false,
    type: 'value'
  };
  yAxis = {
    show: false,
    type: 'category',
    data: ['']
  };

  @Input()
  set data(data) {
    this.series = data.series;
    this.labels = data.labels;
    this.percentages = data.percentage;

    this.drawChart();
  }

  constructor() {}

  drawChart() {
    this._series = this.series.map((data: number[], index: number) => {
      return {
        data,
        name: `${this.labels[index]} (${this.percentages[index]}%)`,
        type: 'bar',
        stack: 'singleStack'
      };
    });
  }

  ngOnInit() {}
}
