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
  CPStatsFormatterPipe
} from './../../../assess/engagement/components/engagement-stats/pipes/stats-formatter.pipe';

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
  range;
  series;
  divider;

  @Input()
  set data(data) {
    this.range = data.range;
    this.series = data.series;
    this.divider = data.divider;
    this.drawChart();
  }

  constructor() { }

  dailyLabel(index) {
    const date = CPDate.toEpoch(moment(this.range.start).add(index, 'days'));

    return moment.unix(date).format('MMM Do');
  }

  weeklyLabel(index) {
    const weekOne = moment(this.range.start).add(index, 'weeks');

    const weekStart = CPDate.toEpoch(weekOne);

    const weekEnd = CPDate
      .toEpoch(weekOne.add(1, 'weeks'));

    return `${moment.unix(weekStart).format('MMM D')} - ${moment.unix(weekEnd).format('MMM D')}`;
  }

  monthlyLabel(index) {
    const date = CPDate.toEpoch(moment(this.range.start).add(index, 'months'));

    return moment.unix(date).format('MMM YY');
  }

  quarterLabel(index) {
    const date = CPDate.toEpoch(moment(this.range.start).add(index, 'quarters'));

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
    return this.series.map((serie, idx) => {
      const chartName = idx === 0 ? 'Downloads ' : 'Registrations ';

      return serie.map((item, index) => {
        return {
          'meta': chartName + this.labelByDivider(index),
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
            class: 'cp-dsh-downloads',

            pointClass: 'cp-dsh-point',
          }
        )
      ],

      lineSmooth: false,

      classNames: {
        grid: 'cp-grid',

        line: 'cp-line',

        point: 'cp-dsh-point',

        label: 'cp-label',
      },

      axisY: {
        labelInterpolationFnc: function showLabelsOnlyForIntegers(value) {
          const formatter = new CPStatsFormatterPipe();

          return value % 1 === 0 ? formatter.transform(value) : null;
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
