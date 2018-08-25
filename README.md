Check the NPM docs for install

With the --production flag (or when the NODE_ENV environment variable is set to production), npm will not install modules listed in devDependencies."

The --only={prod[uction]|dev[elopment]} argument will cause either only devDependencies or only non-devDependencies to be installed regardless of the NODE_ENV."

Have you tried

npm install --only=dev