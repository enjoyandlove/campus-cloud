import { centered } from '@storybook/addon-centered/angular';
import { storiesOf, moduleMetadata } from '@storybook/angular';

const pkg = require('./package.json');

const { version, description, homepage } = pkg;

storiesOf('Welcome', module)
  .addDecorator(centered)
  .add(
    'Welcome',
    () => {
      return {
        props: {
          version,
          homepage,
          description
        },
        styles: [
          `div {
          text-align: center;
        }
        a {
          text-decoration: underline;
        }
        `
        ],
        template: `
          <div>
            <h3>Ready UI</h3>
            <p>{{ description }}</p>
            <p>Version: {{ version }}</p>
            <a [href]="homepage" target="_blank"><code>yarn i @ready-education/ready-ui</code></a>
          </div>
        `
      };
    },
    {
      notes: require('./README.md')
    }
  );
