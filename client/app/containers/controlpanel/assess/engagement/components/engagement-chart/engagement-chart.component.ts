import {
  OnInit,
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'cp-engagement-chart',
  templateUrl: './engagement-chart.component.html',
  styleUrls: ['./engagement-chart.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class EngagementChartComponent implements OnInit, AfterViewInit {
  @ViewChild('chart') chart: ElementRef;

  constructor() { }

  ngAfterViewInit() {
    let Chartist = require('./lib/chartist.min.js');

    new Chartist.Line(this.chart.nativeElement, {
      labels: ['Mar 10', 'Mar 11', 'Mar 12', 'Mar 13', 'Mar 14', 'Mar 15', 'Mar 16'],
      series: [
        [64, 38, 60, 9, 18, 38, 24],
      ]
    }, {
        lineSmooth: false,

        classNames: {
          grid: 'cp-grid',

          line: 'cp-line',

          point: 'cp-point',

          label: 'cp-label',
        },

        fullWidth: false,

        axisX: {
          showGrid: false
        }
      });
  }

  ngOnInit() { }
}

