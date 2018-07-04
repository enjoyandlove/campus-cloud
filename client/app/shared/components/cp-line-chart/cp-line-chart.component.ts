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

  drawChart() {
    let newOptions;
    let defaultOptions;

    const data = {
      labels: this.labels,

      series: this.series
    };

    defaultOptions = {
      high: 5,

      low: 0,

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
      },

      axisX: {
        position: 'end',

        showGrid: false,
      }
    };

    newOptions = {
      ...defaultOptions,
      ...this.chartOptions,
      axisX: {
        ...defaultOptions.axisX,
        ...this.chartOptions.axisX
      }
    };

    const chart = new Chartist.Line(this.chart.nativeElement, data, newOptions);

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
