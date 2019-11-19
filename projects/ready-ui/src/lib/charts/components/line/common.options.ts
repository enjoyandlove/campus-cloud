export const commonOptions = {
  grid: {
    top: 10,
    left: 0,
    right: 20,
    bottom: 28,
    containLabel: true
  },
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
        color: '#bdbdbd',
        opacity: 0.4
      }
    },
    axisTick: {
      show: false
    },
    type: 'category',
    boundaryGap: false,
    axisLabel: {
      color: '#757575',
      showMinLabel: false
    }
  },
  yAxis: {
    minInterval: 1,
    axisLabel: {
      color: '#757575',
      margin: 18,
      showMinLabel: false
    },
    axisTick: {
      show: false
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: ['#bdbdbd'],
        opacity: 0.4
      }
    },
    type: 'value',
    axisLine: {
      show: false
    }
  }
};
