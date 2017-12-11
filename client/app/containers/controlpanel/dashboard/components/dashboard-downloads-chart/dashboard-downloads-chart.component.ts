import {
  Input,
  OnInit,
  Component,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
} from '@angular/core';

const Chartist = require('chartist');
require('chartist-plugin-tooltips');

import * as moment from 'moment';
import { CPDate } from '../../../../../shared/utils';
import {
  DivideBy
} from './../dashboard-downloads-registration/dashboard-downloads-registration.component';


@Component({
  selector: 'cp-dashboard-downloads-chart',
  templateUrl: './dashboard-downloads-chart.component.html',
  styleUrls: ['./dashboard-downloads-chart.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardDownloadsChartComponent implements OnInit {
  @ViewChild('chartHost') chartHost: ElementRef;
  series;
  divider;

  @Input()
  set data(data) {
    this.series = data.series;
    this.divider = data.divider;
    this.drawChart();
  }

  constructor() { }

  dailyLabel(index) {
    let date = CPDate
      .toEpoch(moment().subtract(this.series[0].length - index, 'days'));

    return moment.unix(date).format('MMM D');
  }

  weeklyLabel(index) {
    const weekOne = moment().subtract(this.series[0].length - index, 'weeks');

    let weekStart = CPDate.toEpoch(weekOne);

    let weekEnd = CPDate
      .toEpoch(weekOne.subtract(1, 'weeks'));

    return `${moment.unix(weekEnd).format('MMM D')} - ${moment.unix(weekStart).format('MMM D')}`;
  }

  monthlyLabel(index) {
    let date = CPDate
      .toEpoch(moment().subtract(this.series[0].length - index, 'months'));

    return moment.unix(date).format('MMM YY');
  }

  quarterLabel(index) {
    let date = CPDate
      .toEpoch(moment().subtract((this.series[0].length - index) * 3, 'months'));

    return moment.unix(date).format('MMM YY');
  }

  labelByDivider(index) {
    let label;
    switch (this.divider) {
      case DivideBy.daily:
        label = this.dailyLabel(index);
        break;

      case DivideBy.weekly:
        label = this.weeklyLabel(index);
        break;

      case DivideBy.monthly:
        label = this.monthlyLabel(index);
        break;

      case DivideBy.quarter:
        label = this.quarterLabel(index);
        break;
    }
    return label;
  }

  buildLabels() {
    return this.series[0].map((_, index) => {
      return this.labelByDivider(index)
    });
  }

  buildSeries() {
    return this.series.map(serie => {
      return serie.map((item, index) => {
        return {
          'meta': this.labelByDivider(index),
          'value': item
        }
      })
    })
  }

  drawChart() {
    const data = {
      labels: this.buildLabels(),

      series: this.buildSeries(),
    };

    const highestDownload = Math.max.apply(Math, this.series[0]);

    const highestRegistration = Math.max.apply(Math, this.series[1]);

    const highestNoInArray = highestDownload > highestRegistration
                             ? highestDownload : highestRegistration;

    const high = (highestNoInArray + 5) - ((highestNoInArray + 5) % 5);

    const options = {
      low: 0,

      high: high,

      fullWidth: true,

      chartPadding: {
        top: 5,

        right: 20,
      },

      plugins: [
        Chartist.plugins.tooltip(
          {
            transformTooltipTextFnc: (value) => {
              const badge = `<span class="tooltip-chip"></span>`;
              const meta = `<span class="tooltip-val">Value ${value}</span>`;

              return `${badge}${meta}`
            },

            appendToBody: true,

            anchorToPoint: true,

            pointClass: 'cp-point',
          }
        )
      ],

      lineSmooth: false,

      classNames: {
        grid: 'cp-grid',

        line: 'cp-line',

        point: 'cp-point',

        label: 'cp-label',
      },

      axisY: {
        labelInterpolationFnc: function showLabelsOnlyForIntegers(value) {
          return value % 1 === 0 ? value : null;
        },
      },

      axisX: {
        position: 'end',

        showGrid: false,

        labelOffset: {
          x: 0
        },

        labelInterpolationFnc: function skipLabels(value, index) {
          // ignore last label
          if (this.divider !== DivideBy.daily && (index + 1 === this.series[0].length)) {
            return null;
          }

          if (this.divider === DivideBy.daily) {
            return index % 3 === 0 ? value : null;
          }

          if (this.divider === DivideBy.weekly) {
            return index % 2 === 0 ? value : null;
          }

          return value;
        }.bind(this),
      }
    };

    const chart = new Chartist.Line(this.chartHost.nativeElement, data, options);

    chart.on('created', function () {
      this.isChartDataReady = true;
    }.bind(this));
  }

  ngOnInit() { }
}
