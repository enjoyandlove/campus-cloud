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

import * as moment from 'moment';
import { CPDate } from '../../utils/date';
import { CPSession } from './../../../session';
import { CPI18nService } from '../../services/i18n.service';

export enum DivideBy {
  'daily' = 0,
  'weekly' = 1,
  'monthly' = 2,
  'quarter' = 3
}

@Component({
  selector: 'cp-chart',
  templateUrl: './cp-chart.component.html',
  styleUrls: ['./cp-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CPChartComponent implements OnInit {
  @ViewChild('chart') chart: ElementRef;

  range;
  series;
  divider;
  labels;
  isChartDataReady = false;

  @Input() set chartData(data) {
    this.range = data.range;
    this.series = data.series;
    this.divider = data.divider;
    this.labels = data.tooltip_labels;
    this.drawChart();
  }

  constructor(public session: CPSession) {}

  dailyLabel(index) {
    const date = CPDate.toEpoch(moment(this.range.start).add(index, 'days'), this.session.tz);

    return moment
      .unix(date)
      .locale(CPI18nService.getLocale())
      .format('MMM D');
  }

  weeklyLabel(index) {
    const weekOne = moment(this.range.start).add(index, 'weeks');

    const weekStart = CPDate.toEpoch(weekOne, this.session.tz);

    const weekEnd = CPDate.toEpoch(weekOne.add(1, 'weeks'), this.session.tz);

    return `${moment
      .unix(weekStart)
      .locale(CPI18nService.getLocale())
      .format('MMM D')} - ${moment
      .unix(weekEnd)
      .locale(CPI18nService.getLocale())
      .format('MMM D')}`;
  }

  monthlyLabel(index) {
    const date = CPDate.toEpoch(moment(this.range.start).add(index, 'months'), this.session.tz);

    return moment
      .unix(date)
      .locale(CPI18nService.getLocale())
      .format('MMM YY');
  }

  quarterLabel(index) {
    const date = CPDate.toEpoch(
      moment(this.range.start)
        .locale(CPI18nService.getLocale())
        .add(index, 'quarters'),
      this.session.tz
    );

    return moment
      .unix(date)
      .locale(CPI18nService.getLocale())
      .format('MMM YY');
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
      return this.labelByDivider(index);
    });
  }

  buildSeries() {
    return this.series.map((serie, idx) => {

      return serie.map((item, index) => {
        return {
          meta: `${this.labels[idx]}  ${this.labelByDivider(index)}`,
          value: item
        };
      });
    });
  }

  drawChart() {
    const data = {
      labels: this.buildLabels(),

      series: this.buildSeries()
    };

    const highestNoInArray = Math.max.apply(Math, this.series[0]);

    const high = highestNoInArray + 5 - (highestNoInArray + 5) % 5;

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
