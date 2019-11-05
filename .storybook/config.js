import { configure, addDecorator } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { withA11y } from '@storybook/addon-a11y';

addDecorator(withA11y);
addDecorator(withNotes);

const req = require.context('../', true, /\.stories\.ts$/);

function loadStories() {
  req.keys().forEach(req);
}

configure(loadStories, module);
