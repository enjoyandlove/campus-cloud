### Client

> Angular Application Code

This is a standard NG2 / Webpack app, that once built for production is read by a Django template.

### TODO

- Load https://popper.js.org/ for tooltips
- Ensure G_MAPS library is only loaded once, avoid loading a script tag though

### package.json Commands

The following file describes the main commands in the `script` section in the `package.json`

- `i18n`  Using the [Phrase CLI Tool](https://phrase.com/cli/) this commands pulls all translations for the `campus cloud`  project

- `precommit`  Ensures the formatting of all files staged to be committed

- `release` Before every release we run this command to generate a CHANGELOG file with all new changes, using [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.4/)

- `start`  Starts the development server for the `campus cloud` project and listens on `localhost:3030`. During development there is no need to run the Python server as all app assets are handled by Webpack

- `test`  Runs all unit tests for the `campus cloud` project

- `start:ready-ui`  Starts the development server for the `ready-ui` project

- `build`  Builds the `campus cloud`  project for either `staging` or `production`. Outputs its contents to `dist`, the generated `index.html` is read by the django app and served when visiting the root of the app
