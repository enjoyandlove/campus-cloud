import { withKnobs, number, boolean } from '@storybook/addon-knobs';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { ReadyUiModule } from '@ready-education/ready-ui';

function mockDataGenerator(dataPoints) {
  const entries = Array.from(Array(dataPoints).keys());

  return entries.map(() => Math.floor(Math.random() * 100000));
}

function randomHexColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

function range(n: number) {
  return Array.from(Array(n).keys());
}

storiesOf('Charts', module)
  .addDecorator(
    moduleMetadata({
      imports: [ReadyUiModule]
    })
  )
  .addDecorator(withKnobs)
  .add(
    'Line',
    () => {
      const seriesToRender = range(number('# Series', 2));
      const horizontalLabels = range(number('# Horizonal Labels', 8));

      const colors = seriesToRender.map(() => randomHexColor());
      const xLabels = horizontalLabels.map((_, idx) => `Oct ${idx + 1}`);
      const series = seriesToRender.map((label) => {
        return {
          name: `Series ${label}`,
          type: 'line',
          data: mockDataGenerator(xLabels.length)
        };
      });

      return {
        props: {
          series,
          colors,
          xLabels
        },
        template: `
      <ready-ui-line-chart
        [colors]="colors"
        [xLabels]="xLabels"
        [series]="series"
        style="display: block; width: 100%; height: 300px;"
      ></ready-ui-line-chart>`
      };
    },
    {
      notes: require('./components/line/README.md')
    }
  )
  .add(
    'Bar',
    () => {
      const stacked = boolean('Stacked', false);
      const seriesToRender = range(number('# Series', 2));

      const colors = seriesToRender.map(() => randomHexColor());
      const series = seriesToRender.map((label, idx) => {
        return {
          name: `Series ${label}`,
          type: 'bar',
          stack: stacked ? 'one' : idx,
          data: mockDataGenerator(1)
        };
      });

      const xAxis = {
        show: false,
        type: 'value'
      };
      const yAxis = {
        show: false,
        type: 'category',
        data: ['']
      };
      return {
        props: {
          series,
          colors,
          yAxis,
          xAxis
        },
        template: `<ready-ui-bar-chart
        [colors]="colors"
        [xAxis]="xAxis"
        [yAxis]="yAxis"
        [series]="series"
        style="display: block; width: 100%; height: 300px;"></ready-ui-bar-chart>`
      };
    },
    {
      notes: require('./components/bar/README.md')
    }
  );
