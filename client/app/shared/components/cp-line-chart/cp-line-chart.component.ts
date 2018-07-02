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

import { CPSession } from './../../../session';
import { CPLineChartUtilsService, DivideBy } from './cp-line-chart.utils.service';

@Component({
  selector: 'cp-line-chart',
  templateUrl: './cp-line-chart.component.html',
  styleUrls: ['./cp-line-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CPLineChartComponent implements OnInit {
  @ViewChild('chart') chart: ElementRef;

  range;
  series;
  divider;
  labels;
  highestNoInArray = 0;
  isChartDataReady = false;

  @Input() set chartData(data) {
    this.range = data.range;
    this.series = data.series;
    this.divider = data.divider;
    this.labels = data.tooltip_labels;
    this.drawChart();
  }

  constructor(
    public session: CPSession,
    public utils: CPLineChartUtilsService
  ) {}

  labelByDivider(index) {
    let label;
    switch (this.divider) {
      case DivideBy.daily:
        label = this.utils.dailyLabel(this.range.start, index);
        break;

      case DivideBy.weekly:
        label = this.utils.weeklyLabel(this.range.start, index);
        break;

      case DivideBy.monthly:
        label = this.utils.monthlyLabel(this.range.start, index);
        break;

      case DivideBy.quarter:
        label = this.utils.quarterLabel(this.range.start, index);
        break;
    }

    return label;
  }

  buildLabels() {
    return this.series[0].map((_, index) => {
      return this.labelByDivider(index);
    });
  }

  buildSeries() {
    return this.series.map((serie, idx) => {
      this.getHighestNoInArray(serie);

      return serie.map((item, index) => {
        return {
          meta: `${this.labels[idx]}  ${this.labelByDivider(index)}`,
          value: item
        };
      });
    });
  }

  getHighestNoInArray(serie) {
    if (this.highestNoInArray < Math.max.apply(Math, serie)) {
      this.highestNoInArray = Math.max.apply(Math, serie);
    }
  }

  drawChart() {
    const data = {
      labels: this.buildLabels(),

      series: this.buildSeries()
    };

    const high = this.highestNoInArray + 5 - (this.highestNoInArray + 5) % 5;

    const options = {
      low: 0,

      high: high,

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

      lineSmooth: false,

      classNames: {
        grid: 'cp-grid',

        line: 'cp-line',

        point: 'cp-dsh-point',

        label: 'cp-label'
      },

      fullWidth: true,

      axisY: {
        labelInterpolationFnc: function showLabelsOnlyForIntegers(value) {
          return value % 1 === 0 ? value : null;
        }
      },

      axisX: {
        position: 'end',

        showGrid: false,

        labelOffset: {
          x: 0
        },

        labelInterpolationFnc: function skipLabels(value, index) {
          if (index + 1 === this.series[0].length) {
            return null;
          }

          if (this.divider === DivideBy.daily) {
            if (this.series[0].length > 15) {
              return index % 8 === 0 ? value : null;
            }

            return index % 3 === 0 ? value : null;
          }

          if (this.divider === DivideBy.weekly) {
            if (this.series[0].length > 15) {
              return index % 8 === 0 ? value : null;
            }

            return index % 4 === 0 ? value : null;
          }

          return value;
        }.bind(this)
      }
    };

    const chart = new Chartist.Line(this.chart.nativeElement, data, options);

    chart.on(
      'created',
      function() {
        this.isChartDataReady = true;
      }.bind(this)
    );
  }

  ngOnInit() {}
}
