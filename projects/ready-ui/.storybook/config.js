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
    showRoots: true,
    name: `Ready UI`,
    theme: themes.light,
    panelPosition: 'right',
    sidebarAnimations: false,
    storySort: (a, b) =>
      a[1].kind === b[1].kind ? 0 : a[1].id.localeCompare(b[1].id, undefined, { numeric: true })
  }
});

const req = require.context('../', true, /\.stories\.ts$/);
function loadStories() {
  const allExports = [require('../welcome.stories.ts')];

  req.keys().forEach((fname) => allExports.push(req(fname)));

  return allExports;
}

configure(loadStories, module);
