import { Input, Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';

import { commonOptions } from './common.options';
import { EChartsService } from '../../providers/echarts/echarts.service';

@Component({
  selector: 'ready-ui-line-chart',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss'],
  providers: [EChartsService]
})
export class LineComponent implements OnInit, AfterViewInit {
  _chartInstance;
  @Input() colors: string[];
  @Input() xLabels: string[] | number[];
  @Input() series: { name: string; data: number[]; lineStyle?: { type: string } }[];

  @ViewChild('element', { static: true }) private element: ElementRef;

  constructor(private chart: EChartsService) {}

  ngAfterViewInit() {
    this._chartInstance = this.chart.init(this.element.nativeElement);
    this.chart.setOptions(this._chartInstance, {
      ...commonOptions,
      color: this.colors,
      series: this.series,
      xAxis: {
        ...commonOptions.xAxis,
        data: this.xLabels
      }
    });
  }

  ngOnInit() {}
}
