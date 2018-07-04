import {
  Input,
  OnInit,
  Component,
  ViewChild,
  ElementRef,
  ViewEncapsulation
} from '@angular/core';

const Chartist = require('chartist');
require('chartist-plugin-tooltips');

@Component({
  selector: 'cp-line-chart',
  templateUrl: './cp-line-chart.component.html',
  styleUrls: ['./cp-line-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CPLineChartComponent implements OnInit {
  @ViewChild('chart') chart: ElementRef;

  @Input() series;
  @Input() labels;
  @Input() chartOptions;

  highestNoInArray = 0;
  isChartDataReady = false;

  constructor() {}

  getHighestNoInArray() {
    this.series.map((serie) => {
      serie.map((item) => {
        if (this.highestNoInArray < item.value) {
          this.highestNoInArray = item.value;
        }
      });
    });
  }

  drawChart() {
    let options;
    this.getHighestNoInArray();

    const data = {
      labels: this.labels,

      series: this.series
    };

    const high = this.highestNoInArray + 5 - (this.highestNoInArray + 5) % 5;

    options = {
      low: 0,

      high: high,

      fullWidth: true,

      lineSmooth: false,

      chartPadding: {
        top: 5,

        right: 20
      },

      plugins: [
        Chartist.plugins.tooltip({
          class: 'cp-dsh-downloads',

          appendToBody: true,

          anchorToPoint: true,

          pointClass: 'cp-dsh-point'
        })
      ],

      classNames: {
        grid: 'cp-grid',

        line: 'cp-line',

        point: 'cp-dsh-point',

        label: 'cp-label'
      },

      axisY: {
        labelInterpolationFnc: function showLabelsOnlyForIntegers(value) {
          return value % 1 === 0 ? value : null;
        }
      }
    };

    options = {
      ...options,
      ...this.chartOptions
    };

    const chart = new Chartist.Line(this.chart.nativeElement, data, options);

    chart.on(
      'created',
      function() {
        this.isChartDataReady = true;
      }.bind(this)
    );
  }

  ngOnInit() {
    this.drawChart();
  }
}
