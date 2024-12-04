# README

## Dev only to remove

- src/hook/auth-hook.ts
- src/hook/roles-hook.ts
- src/services/auth/auth.ts
- src/ressources/courses/course-detail/course-detail.ts
- src/ressources/courses/course-detail/course-detail.html

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
