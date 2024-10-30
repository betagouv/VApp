Scalingo
========

Useful debugging environment variables:
```sh
NPM_CONFIG_LOGLEVEL=error
USE_YARN_CACHE=true
NODE_EXTRA_CA_CERTS=/usr/share/ca-certificates/Scalingo/scalingo-database.pem
NODE_VERBOSE=true
NODE_ENV=staging
NODE_MODULES_CACHE=false
```

Especially when you don't get expected updates try to turning cache off:
```sh
USE_YARN_CACHE=false
NODE_MODULES_CACHE=false
```

Beware, files and folder listed in the [.slugignore](../.slugignore) will be missing from  **Scalingo** one-off `bash` :
```sh
scalingo --app vapp-preprod-pr59 run bash
```

