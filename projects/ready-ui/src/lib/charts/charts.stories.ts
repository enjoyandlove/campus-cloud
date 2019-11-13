import { storiesOf, moduleMetadata } from '@storybook/angular';

import { ChartsModule } from './charts.module';

function mockDataGenerator(dataPoints) {
  const entries = Array.from(Array(dataPoints).keys());

  return entries.map(() => Math.floor(Math.random() * 100000));
}

storiesOf('Chart', module)
  .addDecorator(
    moduleMetadata({
      imports: [ChartsModule]
    })
  )
  .add(
    'Line Default',
    () => {
      const colors = ['#2096f3', '#ffa941'];
      const xLabels = ['Oct 1', 'Oct2', 'Oct3'];
      const series = [
        {
          name: 'Downloads',
          type: 'line',
          data: mockDataGenerator(xLabels.length)
        },
        {
          name: 'Registrations',
          type: 'line',
          data: mockDataGenerator(xLabels.length)
        }
      ];

      return {
        props: {
          series,
          colors,
          xLabels
        },
        template:
          '<ready-ui-line-chart [colors]="colors" [xLabels]="xLabels" [series]="series"></ready-ui-line-chart>'
      };
    },
    { notes: 'A very simple example of addon notes' }
  )
  .add('Line Dashed', () => {
    const colors = ['#2096f3', '#ffa941'];
    const xLabels = ['Oct 1', 'Oct2', 'Oct3'];
    const series = [
      {
        name: 'Downloads',
        type: 'line',
        data: mockDataGenerator(xLabels.length)
      },
      {
        name: 'Registrations',
        type: 'line',
        lineStyle: {
          type: 'dashed'
        },
        data: mockDataGenerator(xLabels.length)
      }
    ];
    return {
      props: {
        series,
        colors,
        xLabels
      },
      template:
        '<ready-ui-line-chart [colors]="colors" [xLabels]="xLabels" [series]="series"></ready-ui-line-chart>'
    };
  })
  .add('Bar Chart', () => {
    const colors = ['#f65031', '#fbab42', '#8cdd51', '#609df5', '#989eb1'];
    const xAxis = {
      show: false,
      type: 'value'
    };
    const yAxis = {
      show: false,
      type: 'category',
      data: ['']
    };
    const series = [
      {
        name: 'Messages',
        type: 'bar',
        stack: 'one',
        data: mockDataGenerator(yAxis.data.length)
      },
      {
        name: 'Comments',
        type: 'bar',
        stack: 'one',
        data: mockDataGenerator(yAxis.data.length)
      },
      {
        name: 'Connections',
        type: 'bar',
        stack: 'one',
        data: mockDataGenerator(yAxis.data.length)
      },
      {
        name: 'Wall Posts',
        type: 'bar',
        stack: 'one',
        data: mockDataGenerator(yAxis.data.length)
      },
      {
        name: 'Likes',
        type: 'bar',
        stack: 'one',
        data: mockDataGenerator(yAxis.data.length)
      }
    ];
    return {
      props: {
        series,
        colors,
        yAxis,
        xAxis
      },
      template: `<ready-ui-bar-chart [colors]="colors" [xAxis]="xAxis" [yAxis]="yAxis" [series]="series"></ready-ui-bar-chart>`
    };
  })
  .add('Bar Chart Update', () => {
    const colors = ['#f65031', '#fbab42', '#8cdd51', '#609df5', '#989eb1'];
    const yAxis = {
      show: true,
      type: 'category',
      data: ['October', 'November', 'December']
    };
    const series = [
      {
        name: 'Messages',
        type: 'bar',
        data: mockDataGenerator(yAxis.data.length)
      },
      {
        name: 'Comments',
        type: 'bar',
        data: mockDataGenerator(yAxis.data.length)
      },
      {
        name: 'Connections',
        type: 'bar',
        data: mockDataGenerator(yAxis.data.length)
      },
      {
        name: 'Wall Posts',
        type: 'bar',
        data: mockDataGenerator(yAxis.data.length)
      },
      {
        name: 'Likes',
        type: 'bar',
        data: mockDataGenerator(yAxis.data.length)
      }
    ];
    return {
      props: {
        series,
        colors,
        yAxis
      },
      template: `<ready-ui-bar-chart [colors]="colors" [yAxis]="yAxis" [series]="series"></ready-ui-bar-chart>`
    };
  });
