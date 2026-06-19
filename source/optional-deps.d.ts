// Ambient stubs for optional native dependencies.
//
// These live in package.json `optionalDependencies` and require native builds
// (libxml, etc.), so they are frequently absent in CI. The code imports them
// dynamically behind try/catch and treats them loosely, so declaring them as
// `any` modules keeps `tsc --noEmit` resolvable whether or not they installed.
declare module "libxmljs2"
declare module "gifencoder"
