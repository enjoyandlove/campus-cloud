import { Injectable } from '@angular/core';
import * as echarts from 'echarts';

@Injectable({
  providedIn: 'root'
})
export class EChartsService {
  constructor() {}

  init(el: HTMLDivElement): echarts.ECharts {
    return echarts.init(el);
  }

  setOptions(chart: echarts.ECharts, options): void {
    chart.setOption(options);
  }
}
