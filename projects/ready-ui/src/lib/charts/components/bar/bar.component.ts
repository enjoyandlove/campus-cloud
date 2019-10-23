import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { commonOptions } from './common.options';
import { EChartsService } from './../../providers/echarts/echarts.service';

@Component({
  selector: 'ready-ui-bar-chart',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss']
})
export class BarComponent implements AfterViewInit {
  _chartInstance;
  @Input() colors: string[];
  @Input() series: { name: string; data: number[] }[];
  @Input() yAxis: { show: boolean; type: string; data?: number[] } = {
    show: true,
    type: 'category'
  };
  @Input() xAxis: { show: boolean; type: string; data?: number[] } = {
    show: true,
    type: 'value'
  };

  @ViewChild('element', { static: true }) private element: ElementRef;

  constructor(private chart: EChartsService) {}

  ngAfterViewInit() {
    this._chartInstance = this.chart.init(this.element.nativeElement);
    this.chart.setOptions(this._chartInstance, {
      ...commonOptions,
      color: this.colors,
      series: this.series,
      xAxis: this.xAxis,
      yAxis: this.yAxis
    });
  }
}
