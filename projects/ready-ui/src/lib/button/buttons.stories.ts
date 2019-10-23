import { storiesOf, moduleMetadata } from '@storybook/angular';
import { ButtonModule } from './button.module';

storiesOf('Button', module)
  .addDecorator(
    moduleMetadata({
      imports: [ButtonModule]
    })
  )
  .add('Default', () => {
    return {
      template: '<button readyBtn>Hello</button>'
    };
  })
  .add('Default Stroked', () => {
    return {
      template: '<button readyBtn class="stroked">Hello</button>'
    };
  })
  .add('Default Transparent', () => {
    return {
      template: '<button readyBtn class="transparent">Hello</button>'
    };
  })
  .add('Primary', () => {
    return {
      template: '<button readyBtn class="primary">Hello</button>'
    };
  })
  .add('Primary Stroked', () => {
    return {
      template: '<button readyBtn class="primary stroked">Hello</button>'
    };
  })
  .add('Primary Transparent', () => {
    return {
      template: '<button readyBtn class="primary transparent">Hello</button>'
    };
  })
  .add('Danger', () => {
    return {
      template: '<button readyBtn class="danger">Hello</button>'
    };
  });
