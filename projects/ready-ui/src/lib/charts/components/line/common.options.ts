export const commonOptions = {
  tooltip: {
    trigger: 'axis',

    backgroundColor: 'rgba(0,0,0,0.7)',
    textStyle: {
      fontSize: 12
    }
  },
  xAxis: {
    axisLine: {
      lineStyle: {
        color: '#bdbdbd'
      }
    },
    axisTick: {
      show: false
    },
    type: 'category',
    boundaryGap: false,
    axisLabel: {
      color: '#757575'
    }
  },
  yAxis: {
    axisLabel: {
      color: '#757575'
    },
    axisTick: {
      show: false
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: ['#bdbdbd']
      }
    },
    type: 'value',
    axisLine: {
      show: false
    }
  }
};
