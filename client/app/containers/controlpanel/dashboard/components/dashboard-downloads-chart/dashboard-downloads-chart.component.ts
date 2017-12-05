import {
  Input,
  OnInit,
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ViewEncapsulation,
} from '@angular/core';

import { URLSearchParams } from '@angular/http';

const Chartist = require('chartist');
require('chartist-plugin-tooltips');

import * as moment from 'moment';
import { CPSession } from '../../../../../session';
import { CPDate } from '../../../../../shared/utils';
import { DashboardService } from './../../dashboard.service';


@Component({
  selector: 'cp-dashboard-downloads-chart',
  templateUrl: './dashboard-downloads-chart.component.html',
  styleUrls: ['./dashboard-downloads-chart.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardDownloadsChartComponent implements OnInit, AfterViewInit {
  _dates;
  props = {
    series: []
  };

  isChartDataReady = false;

  @ViewChild('chartHost') chartHost: ElementRef;

  @Input()
  set dates(dates) {
    this._dates = dates;
    this.fetch();
  }

  constructor(
    private session: CPSession,
    private service: DashboardService
  ) { }

  fetch() {
    this.isChartDataReady = false;

    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id);
    search.append('start', this._dates.start);
    search.append('end', this._dates.end);
    this
      .service
      .getDownloads(search)
      .subscribe(res => {
        this.props = res;
        this.drawChart();
      })
  }

  ngAfterViewInit() {
    this.fetch();
  }

  buildLabels() {
    let labels = [];

    for (let i = 1; i <= this.props.series.length; i++) {
      let date = CPDate
        .toEpoch(moment().subtract(this.props.series.length - i, 'days'));
      labels.push(moment.unix(date).format('MMM D'));
    }

    return labels;
  }

  buildSeries() {
    let series = [];

    for (let i = 1; i <= this.props.series.length; i++) {
      let date = CPDate
        .toEpoch(moment().subtract(this.props.series.length - i, 'days'));

      series.push(
        {
          'meta': moment.unix(date).format('ddd, MMM D'),
          'value': this.props.series[i - 1]
        }
      );
    }

    return series;
  }

  drawChart() {
    const data = {
      labels: this.buildLabels(),

      series: [this.buildSeries()],
    };

    const chipContent = `<span class="tooltip-chip"></span>
    <span class="tooltip-val">Engagement(s) </span>`;

    const highestNoInArray = Math.max.apply(Math, this.props.series);

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
