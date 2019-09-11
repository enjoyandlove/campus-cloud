const shell = require('shelljs');

function runOrExit(shellCmd) {
  const { code } = shellCmd;
  if (code !== 0) {
    shell.exit(code);
  }
}
shell.echo('Testing...');
runOrExit(shell.exec('ng test ready-ui --codeCoverage --watch=false', { async: false }));

shell.echo('Bumping version...');
shell.cd('./projects/ready-ui');
shell.exec('npm version patch -m "Bumped to version %s"');
shell.cd('../..');

shell.echo('Building...');
runOrExit(shell.exec('ng build ready-ui', { async: false }));

shell.exec('echo //registry.npmjs.org/:_authToken=${NPM_TOKEN} > ./dist/ready-ui/.npmrc');
shell.cd('./dist/ready-ui');

shell.echo('Packaging...');
shell.exec('npm pack');

shell.echo('Publishing...');
shell.echo(shell.pwd());
shell.exec('npm publish . --access=public --verbose');
