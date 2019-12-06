import { configure, addDecorator, addParameters } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { withA11y } from '@storybook/addon-a11y';

addDecorator(withA11y);
addDecorator(withNotes);

// https://storybook.js.org/docs/configurations/options-parameter/
addParameters({
  options: {
    panelPosition: 'right',
    sidebarAnimations: false
  }
});

const req = require.context('../', true, /\.stories\.ts$/);

function loadStories() {
  req.keys().forEach(req);
}

configure(loadStories, module);
