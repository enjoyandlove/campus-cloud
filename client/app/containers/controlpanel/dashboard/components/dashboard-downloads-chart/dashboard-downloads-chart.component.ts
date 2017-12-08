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
    let weekStart = CPDate
      .toEpoch(moment().subtract(this.series[0].length - index, 'days'));

    let weekEnd = CPDate
      .toEpoch(moment().subtract(this.series[0].length - index, 'weeks'));

    return `${moment.unix(weekEnd).format('MMM D')} - ${moment.unix(weekStart).format('MMM D')}`;
  }

  monthlyLabel(index) {
    let date = CPDate
      .toEpoch(moment().subtract(this.series[0].length - index, 'months'));

    return moment.unix(date).format('MMM YY');
  }

  biMonthlyLabel(index) {
    let date = CPDate
      .toEpoch(moment().subtract((this.series[0].length - index) * 2, 'months'));

    return moment.unix(date).format('MMM YY');
  }

  buildLabels() {
    let labels = [];

    for (let i = 1; i <= this.series[0].length; i++) {
      switch (this.divider) {
        case DivideBy.daily:
          labels.push(this.dailyLabel(i));
          break;

        case DivideBy.weekly:
          labels.push(this.weeklyLabel(i));
          break;

        case DivideBy.monthly:
          labels.push(this.monthlyLabel(i));
          break;

        case DivideBy.biMonthly:
          labels.push(this.biMonthlyLabel(i));
          break;
      }
    }
    return labels;
  }

  buildSeries() {
    return this.series.map(serie => {
      return serie.map((item, index) => {
        let date = CPDate.toEpoch(moment().subtract(serie.length - index, this.divider));
        return {
          'meta': moment.unix(date).format('MMM D'),
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

    const chipContent = `<span class="tooltip-chip"></span>
    <span class="tooltip-val">Engagement(s) </span>`;

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
            currency: chipContent,

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
          x: -14,
        },

        labelInterpolationFnc: function skipLabels(value, index) {
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
