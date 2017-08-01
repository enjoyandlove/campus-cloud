import {
  Input,
  OnInit,
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ViewEncapsulation,
} from '@angular/core';

import * as moment from 'moment';
import { CPDate } from '../../../../../../shared/utils/date';

interface IProps {
  ends: number;
  starts: number;
  series: Array<number>;
  zero_engagements: Array<number>;
  one_engagements: Array<number>;
  repeat_engagements: Array<number>;
}

declare var Chartist;

@Component({
  selector: 'cp-engagement-chart',
  templateUrl: './engagement-chart.component.html',
  styleUrls: ['./engagement-chart.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EngagementChartComponent implements OnInit, AfterViewInit {
  @Input() props: IProps;
  @ViewChild('chart') chart: ElementRef;

  data: Array<number>;

  isChartDataReady = false;

  constructor() { }

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

    const chart = new Chartist.Line(this.chart.nativeElement, data, options);

    chart.on('created', function () {
      this.isChartDataReady = true;
    }.bind(this));
  }

  ngAfterViewInit() {
    this.drawChart();
  }

  ngOnInit() { }
}

