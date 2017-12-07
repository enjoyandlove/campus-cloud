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


@Component({
  selector: 'cp-dashboard-downloads-chart',
  templateUrl: './dashboard-downloads-chart.component.html',
  styleUrls: ['./dashboard-downloads-chart.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardDownloadsChartComponent implements OnInit {
  @ViewChild('chartHost') chartHost: ElementRef;
  series;

  @Input()
  set data(data) {
    this.series = data;
    this.drawChart();
    console.log('new series', this.series);
  }

  constructor() { }

  buildLabels() {
    let labels = [];

    for (let i = 1; i <= this.series[0].length; i++) {
      let date = CPDate
        .toEpoch(moment().subtract(this.series.length - i, 'days'));
      labels.push(moment.unix(date).format('MMM D'));
    }
    console.log('labels', labels);
    return labels;
  }

  buildSeries() {
    return this.series.map(serie => {
      return serie.map((item, index) => {
        let date = CPDate.toEpoch(moment().subtract(serie.length - index, 'days'));
        return {
          'meta': moment.unix(date).format('ddd, MMM D'),
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

    const highestNoInArray = Math.max.apply(Math, this.series);

    const high = (highestNoInArray + 5) - ((highestNoInArray + 5) % 5);

    const options = {
      low: 0,

      high: high,

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

      fullWidth: true,

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

        labelInterpolationFnc: function skipLabels(value, index, labels) {
          const DATE_TYPES = [28, 40, 80];

          const [MONTH, SIX_WEEKS, THREE_MONTHS] = DATE_TYPES;

          if (labels.length >= THREE_MONTHS + 1) {
            return index % 9 === 0 ? value : null;
          } else if (labels.length >= SIX_WEEKS + 1) {
            return index % 5 === 0 ? value : null;
          } else if (labels.length >= MONTH + 1) {
            return index % 3 === 0 ? value : null;
          }
          return value;
        },
      }
    };

    const chart = new Chartist.Line(this.chartHost.nativeElement, data, options);

    chart.on('created', function () {
      this.isChartDataReady = true;
    }.bind(this));
  }

  ngOnInit() { }
}
