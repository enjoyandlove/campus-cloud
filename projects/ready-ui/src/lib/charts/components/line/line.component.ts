import { Input, Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';

import { commonOptions } from './common.options';
import { EChartsService } from '../../providers/echarts/echarts.service';

interface ISerie {
  name: string;
  data: number[];
  lineStyle?: { type: string };
}

@Component({
  selector: 'ready-ui-line-chart',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss'],
  providers: [EChartsService]
})
export class LineComponent implements OnInit, AfterViewInit {
  _chartInstance;
  @Input() colors: string[];
  @Input() series: ISerie[];
  @Input() xLabels: string[] | number[];

  @ViewChild('element', { static: true }) private element: ElementRef;

  constructor(private chart: EChartsService) {}

  ngAfterViewInit() {
    this._chartInstance = this.chart.init(this.element.nativeElement);
    const highest = this.series.map(({ data }: ISerie) => data).reduce((a, b) => a.concat(b), []);

    this.chart.setOptions(this._chartInstance, {
      ...commonOptions,
      color: this.colors,
      series: this.series,
      yAxis: {
        ...commonOptions.yAxis,
        max:
          Math.max(...highest) < 5
            ? Math.max(...highest) + 5 - ((Math.max(...highest) + 5) % 5)
            : undefined
      },
      xAxis: {
        ...commonOptions.xAxis,
        data: this.xLabels
      }
    });
  }

  ngOnInit() {}
}
