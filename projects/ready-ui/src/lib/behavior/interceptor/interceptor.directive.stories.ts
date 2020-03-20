import { InterceptorDirective } from '@ready-education/ready-ui/behavior';
import { storiesOf, moduleMetadata } from '@storybook/angular';

storiesOf('Interceptor', module)
  .addDecorator(
    moduleMetadata({
      declarations: [InterceptorDirective]
    })
  )
  .add('Default', () => {
    const onVisible = (id: number) => {
      console.log(`${id} scrolled into view`);
    };

    return {
      props: {
        onVisible: onVisible,
        boxes: Array.from(Array(25).keys())
      },
      styles: [
        `
      .box {
        width: 100%;
        height: 300px;
        background: #ddd;
      }

      .box:nth-child(even) {
        background: #ccc;
      }
      `
      ],
      template: `
        <div
          class="box"
          [id]="index"
          ready-ui-interceptor
          (visible)="onVisible(index)"
          *ngFor="let box of boxes; index as index">{{index}}</div>
      `
    };
  });
