import { configure, addDecorator, addParameters } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { withKnobs } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import { themes } from '@storybook/theming';

const pkg = require('../package.json');
const { version } = pkg;

addDecorator(withA11y);
addDecorator(withNotes);
addDecorator(withKnobs);

// https://storybook.js.org/docs/configurations/options-parameter/
addParameters({
  options: {
    name: `Ready UI (v.${version})`,
    theme: themes.light,
    panelPosition: 'right',
    sidebarAnimations: false
  }
});

const req = require.context('../', true, /\.stories\.ts$/);
function loadStories() {
  const allExports = [require('../welcome.stories.ts')];

  req.keys().forEach((fname) => allExports.push(req(fname)));

  return allExports;
}

configure(loadStories, module);
