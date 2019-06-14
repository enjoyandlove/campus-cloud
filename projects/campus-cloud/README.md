### Client

> Angular Application Code

This is a standard NG2 / Webpack app, that once built for production is read by a Django template.

### TODO

- Load https://popper.js.org/ for tooltips
- Ensure G_MAPS library is only loaded once, avoid loading a script tag though

**Dev Workflow**
`npm start`: Runs Webpack Dev Server and listens on `localhost:3030` during development tehre is no need to run the Python server as all app assets are handled by Webpack

`npm run build`: Builds app ready for production and outputs its contents to `dist` the generated `index.html` is read by the django app and served when visiting the root of the app
