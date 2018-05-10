import { Input, OnInit, Component, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';

const Chartist = require('chartist');
require('chartist-plugin-tooltips');

@Component({
  selector: 'cp-dashboard-social-activity-chart',
  templateUrl: './dashboard-social-activity-chart.component.html',
  styleUrls: ['./dashboard-social-activity-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardSocialActivyChartComponent implements OnInit {
  @ViewChild('socialActivity') socialActivity: ElementRef;
  series;
  labels;
  percentages;

  @Input()
  set data(data) {
    this.series = data.series;
    this.labels = data.labels;
    this.percentages = data.percentage;

    this.drawChart();
  }

  constructor() {}

  buildSeries() {
    return this.series.map((serie, index) => {
      return serie.map((item) => {
        return {
          meta: `${this.labels[index]} (${this.percentages[index]}%)`,
          value: item
        };
      });
    });
  }

  drawChart() {
    const data = {
      series: this.buildSeries()
    };

    const options = {
      fullWidth: true,

      chartPadding: {
        right: 0
      },

      plugins: [
        Chartist.plugins.tooltip({
          class: 'cp-social-activity'
        })
      ],

      lineSmooth: false,

      reverseData: true,

      stackBars: true,

      seriesBarDistance: 0,

      horizontalBars: true,

      classNames: {
        series: 'dsh-series'
      },

      axisY: {
        offset: -10,

        showLabel: false,

        showGrid: false
      },

      axisX: {
        showGrid: false,

        showLabel: false
      }
    };

    const chart = new Chartist.Bar(this.socialActivity.nativeElement, data, options);

    chart.on(
      'created',
      function() {
        this.isChartDataReady = true;
      }.bind(this)
    );

    chart.on(
      'draw',
      function(d) {
        d.element.attr({
          style: 'stroke-width: 45px'
        });
      }.bind(this)
    );
  }

  ngOnInit() {}
}
