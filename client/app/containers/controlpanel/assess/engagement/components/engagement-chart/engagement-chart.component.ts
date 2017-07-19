import {
  OnInit,
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ViewEncapsulation
} from '@angular/core';

/**
 * 7D: 7D
 * last month: 30D
 * 6W: 6W
 * 3M: 12W...
 */

declare var Chartist;

@Component({
  selector: 'cp-engagement-chart',
  templateUrl: './engagement-chart.component.html',
  styleUrls: ['./engagement-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EngagementChartComponent implements OnInit, AfterViewInit {
  @ViewChild('chart') chart: ElementRef;

  data: Array<number>;

  constructor() { }

  buildLabels() {
    let labels = [];

    for (let i = 1; i <= 30; i++) {
      labels.push(`Mar ${i}`);
    }

    return labels;
  }

  buildSeries() {
    let series = [];

    for (let i = 1; i <= 30; i++) {
      series.push(
        {
          'meta': `Sun, Mar ${Math.floor(Math.random() * 100)}`,
          'value': Math.floor(Math.random() * 100)
        }
      );
    }

    return series;
  }

  drawChart() {
    const data = {
      labels: this.buildLabels(),

      series: [this.data],
    };

    const chipContent = `<span class="tooltip-chip"></span>
    <span class="tooltip-val">Engagement </span>`;

    const options = {
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

      axisX: {
        position: 'end',

        showGrid: false,

        labelInterpolationFnc: function skipLabels(value, index, labels) {
          // skip labels if too many
          if (labels.length === 30) {
            return index % 5 === 0 ? value : null;
          }

          // if not too many skip last label
          if (labels.length === index + 1) {
            return null;
          }

          return value;
        },
      }
    };

    new Chartist.Line(this.chart.nativeElement, data, options);
  }

  ngAfterViewInit() {
    this.drawChart();
  }

  ngOnInit() {
    this.data = this.buildSeries();
  }
}

