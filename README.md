# IT-Tools — LifeViwer fork

<p align="center">
  <a href="#english">EN</a> · <a href="#русский">RU</a>
</p>

This repository is a modified fork of [IT-Tools](https://github.com/CorentinTh/it-tools). It remains free and open-source software under the GNU GPLv3.

---

## English

A collection of handy online tools for developers and people working in IT.

### Features and roadmap

See the [issues](https://github.com/CorentinTh/it-tools/issues) for planned features and current discussions. Feature requests and bug reports are welcome in the upstream issue tracker.

### Self-hosting

IT-Tools can be self-hosted in a homelab or on your own server.

**Docker Hub:**

```sh
docker run -d --name it-tools --restart unless-stopped -p 8080:80 corentinth/it-tools:latest
```

**GitHub Container Registry:**

```sh
docker run -d --name it-tools --restart unless-stopped -p 8080:80 ghcr.io/corentinth/it-tools:latest
```

**Other solutions:**

- [Cloudron](https://www.cloudron.io/store/tech.ittools.cloudron.html)
- [Tipi](https://www.runtipi.io/docs/apps-available)
- [Unraid](https://unraid.net/community/apps?q=it-tools)

### Development

#### Recommended IDE setup

[VS Code](https://code.visualstudio.com/) with:

- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (disable Vetur)
- [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=vue.vscode-typescript-vue-plugin)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [i18n Ally](https://marketplace.visualstudio.com/items?itemName=lokalise.i18n-ally)

Recommended settings:

```json
{
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "i18n-ally.localesPaths": ["locales", "src/tools/*/locales"],
  "i18n-ally.keystyle": "nested"
}
```

#### Type support for `.vue` imports

TypeScript needs additional support to understand `.vue` files. The project uses `vue-tsc` for type checking. In VS Code, install the TypeScript Vue Plugin (Volar). If the standalone plugin is not fast enough, Volar also provides Take Over Mode:

1. Disable the built-in **TypeScript and JavaScript Language Features** extension for the workspace.
2. Reload the VS Code window.

#### Project setup

```sh
pnpm install
```

#### Development server

```sh
pnpm dev
```

#### Type-check and production build

```sh
pnpm build
```

#### Unit tests

```sh
pnpm test
```

#### End-to-end tests

```sh
pnpm test:e2e
```

#### Lint

```sh
pnpm lint
```

#### Create a new tool

```sh
pnpm run script:create:tool my-tool-name
```

The command creates the tool boilerplate in `src/tools` and adds its import to `src/tools/index.ts`.

### Attribution

This fork is based on the original IT-Tools project by Corentin Thomasset and its contributors. Third-party open-source dependencies are listed in [`package.json`](package.json).

Changes in this fork include Russian localization and additional developer tools. This repository is not an official project of the original IT-Tools maintainers.

### License

This project is distributed under the [GNU General Public License v3.0](LICENSE).

This is a modified version of IT-Tools. The source code and any distributed modified version remain subject to the GPLv3 terms.

---

## Русский

Набор полезных онлайн-инструментов для разработчиков и специалистов, работающих в сфере IT.

### Возможности и план развития

Список планируемых возможностей и текущие обсуждения находятся в разделе [issues](https://github.com/CorentinTh/it-tools/issues). Предложения новых функций и сообщения об ошибках можно отправлять в трекер исходного проекта.

### Самостоятельный хостинг

IT-Tools можно развернуть в домашней лаборатории или на собственном сервере.

**Docker Hub:**

```sh
docker run -d --name it-tools --restart unless-stopped -p 8080:80 corentinth/it-tools:latest
```

**GitHub Container Registry:**

```sh
docker run -d --name it-tools --restart unless-stopped -p 8080:80 ghcr.io/corentinth/it-tools:latest
```

**Другие варианты:**

- [Cloudron](https://www.cloudron.io/store/tech.ittools.cloudron.html)
- [Tipi](https://www.runtipi.io/docs/apps-available)
- [Unraid](https://unraid.net/community/apps?q=it-tools)

### Разработка

#### Рекомендуемая настройка IDE

[VS Code](https://code.visualstudio.com/) со следующими расширениями:

- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (расширение Vetur нужно отключить)
- [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=vue.vscode-typescript-vue-plugin)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [i18n Ally](https://marketplace.visualstudio.com/items?itemName=lokalise.i18n-ally)

Рекомендуемые настройки:

```json
{
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "i18n-ally.localesPaths": ["locales", "src/tools/*/locales"],
  "i18n-ally.keystyle": "nested"
}
```

#### Поддержка импорта `.vue`

Для понимания файлов `.vue` TypeScript требует дополнительную поддержку. Для проверки типов проект использует `vue-tsc`. В VS Code установите TypeScript Vue Plugin (Volar). Если отдельное расширение работает недостаточно быстро, в Volar можно включить режим Take Over Mode:

1. Отключите встроенное расширение **TypeScript and JavaScript Language Features** для этого рабочего пространства.
2. Перезапустите окно VS Code.

#### Подготовка проекта

```sh
pnpm install
```

#### Сервер разработки

```sh
pnpm dev
```

#### Проверка типов и production-сборка

```sh
pnpm build
```

#### Модульные тесты

```sh
pnpm test
```

#### End-to-end тесты

```sh
pnpm test:e2e
```

#### Проверка линтером

```sh
pnpm lint
```

#### Создание нового инструмента

```sh
pnpm run script:create:tool my-tool-name
```

Команда создаёт шаблон инструмента в `src/tools` и добавляет его импорт в `src/tools/index.ts`.

### Атрибуция

Этот форк основан на исходном проекте IT-Tools, созданном Corentin Thomasset и контрибьюторами. Список сторонних библиотек с открытым исходным кодом приведён в файле [`package.json`](package.json).

Изменения форка включают русскую локализацию и дополнительные инструменты для разработчиков. Репозиторий не является официальным проектом первоначальных сопровождающих IT-Tools.

### Лицензия

Проект распространяется по лицензии [GNU General Public License версии 3.0](LICENSE).

Это изменённая версия IT-Tools. Исходный код и распространяемые изменённые версии остаются под условиями GPLv3.
