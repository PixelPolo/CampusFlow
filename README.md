# README

<https://github.com/PixelPolo/CampusFlow>

Credits: Thiméo D. & Paul R. (University Group F)

This is a prototype for a University management tool frontend.

The backend is simulated inside fake APIs in `src/test/services/api`.

## Authentication fake accounts

### Student

- email: "<jack.doe@student.com>"
- password: 123

### Professor

- email: "<fabian.smith@university.com>"
- password: 123

### Administrative employee

- email: "<jane.johnson@university.com>"
- password: 123

## Dev vs Prod

When prod, uncomments dev stuff inside :

- src/hook/auth-hook.ts
- src/hook/roles-hook.ts
- src/services/auth/auth.ts
- src/ressources/courses/course-detail/course-detail.ts

In dev, the dynamic menu isn't generated, you have to navigate through urls :

- **_src/my-app.ts_** to check the routes !

## Skeleton

This repository contains a Aurelia2 Material application.

Skeleton available on <https://github.com/aurelia-ui-toolkits/aurelia-mdc-web/tree/v2>

```bash
npx makes aurelia-mdc-web/au2
```

## Build

### Development mode

- Injects the `services/config-dev.ts` config
- Starts hot reloading development server

```bash
npm start
```

### Build release

- Injects the `services/config-prod.ts` config
- Generates the application into `dist`

```bash
npm run build
```

## Utils

### Analyze package sizes

Generates visualization of package sizes

```bash
npm run analyze
```

### Update aurelia-mdc

```shell
npm install -g npm-check-updates
ncu -u "/aurelia-mdc-web/"
npm install
```

## References

- Material Framework: <https://github.com/aurelia-ui-toolkits/aurelia-mdc-web>
