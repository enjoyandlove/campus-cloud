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

@Component({
  selector: 'cp-dashboard-social-activity-chart',
  templateUrl: './dashboard-social-activity-chart.component.html',
  styleUrls: ['./dashboard-social-activity-chart.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardSocialActivyChartComponent implements OnInit {
  @ViewChild('socialActivity') socialActivity: ElementRef;
  series;
  labels;

  @Input()
  set data(data) {
    this.series = data.series;
    this.labels = data.labels;
    this.drawChart();
  }

  constructor() { }

  drawChart() {
    const data = {
      labels: this.labels,

      series: this.series,
    };

    // const highestDownload = Math.max.apply(Math, this.series[0]);

    // const highestRegistration = Math.max.apply(Math, this.series[1]);

    // const highestNoInArray = highestDownload > highestRegistration
    //                          ? highestDownload : highestRegistration;

    // const high = (highestNoInArray + 5) - ((highestNoInArray + 5) % 5);

    const options = {
      // low: 0,

      // high: high,

      fullWidth: true,

      // chartPadding: {
      //   top: 5,

      //   right: 20,
      // },

      plugins: [
        Chartist.plugins.tooltip(
          {
            // transformTooltipTextFnc: (value) => {
            //   const badge = `<span class="tooltip-chip"></span>`;
            //   const meta = `<span class="tooltip-val">${value}</span>`;

            //   return `${badge}${meta}`
            // },

            appendToBody: true,

            anchorToPoint: true,

            // pointClass: 'cp-point',
          }
        )
      ],

      lineSmooth: false,

      reverseData: true,

      stackBars: true,

      seriesBarDistance: 10,

      horizontalBars: true,

      classNames: {
        series: 'dsh-series'
        // grid: 'cp-grid',

        // line: 'cp-line',

        // point: 'cp-point',

        // label: 'cp-label',
      },

      // axisY: {
      //   labelInterpolationFnc: function showLabelsOnlyForIntegers(value) {
      //     return value % 1 === 0 ? value : null;
      //   },
      // },
      axisY: {
        offset: -10,

        showLabel: false,

        showGrid: false,
      },

      axisX: {
        // position: 'end',

        showGrid: false,

        showLabel: false,

        // labelOffset: {
        //   x: 0
        // },

        // labelInterpolationFnc: function skipLabels(value, index) {
        //   // ignore last label
        //   if (this.divider !== DivideBy.daily && (index + 1 === this.series[0].length)) {
        //     return null;
        //   }

        //   if (this.divider === DivideBy.daily) {
        //     return index % 3 === 0 ? value : null;
        //   }

        //   if (this.divider === DivideBy.weekly) {
        //     return index % 2 === 0 ? value : null;
        //   }

        //   return value;
        // }.bind(this),
      }
    };

    const chart = new Chartist.Bar(this.socialActivity.nativeElement, data, options);

    chart.on('created', function () {
      this.isChartDataReady = true;
    }.bind(this));

    chart.on('draw', function (d) {
      d.element.attr({
        style: 'stroke-width: 45px'
      });
    }.bind(this));

  }

  ngOnInit() { }
}
