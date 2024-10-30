# VApp

![GitHub last commit (branch)](https://img.shields.io/github/last-commit/betagouv/template/main)
![Libraries.io dependency status for GitHub repo](https://img.shields.io/librariesio/github/betagouv/template)

## Développement

Créer un fichier `.env` basé sur `.env.development` :

```sh
cp .env.development .env`
```

Lancer le conteneur de BDD :

```sh
docker compose up
```

Installer les dépendences et lancer l'app :

```sh
yarn # to install dependencies
yarn dev # to run in dev mode
```

Ouvrir la page d'accueil [http://127.0.0.1:3000/](http://127.0.0.1:3000/template) and start playing.

### Storybook

> Use React DSFR Storybook :
> https://components.react-dsfr.codegouv.studio

### Migrations

Pour les modifications de BDD :

Créer le fichier de migration et completer le `up` et le `down` :

```sh
yarn kysely migrate make MIGRATION_NAME
```

Executer la migration et mettre les types:

```sh
yarn kysely migrate latest
yarn kysely-codegen
```

## Tests

```sh
# run unit tests with vitest
yarn test
```

```sh
# run storybook
yarn storybook
```

```
docker compose --env-file .env.test up

# build, serve and launch playwright interactive end-to-end tests
yarn e2e --ui
```

## Projets connexes

- https://github.com/MTES-MCT/aides-territoires
- https://github.com/betagouv/mon-espace-collectivite
