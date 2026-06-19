// Shared types for the metrics engine.
//
// These are intentionally permissive (pragmatic migration baseline): the engine
// passes large dynamically-composed objects around (`imports`, `data.plugins[name]`,
// `conf`) and relies on untyped third-party libs (puppeteer, d3, ejs). Index
// signatures keep the surface usable while we tighten types incrementally.

// Generic string-keyed bag with an opt-out value type.
export type Dict<T = any> = Record<string, T>

// Context object destructured as the first argument of every plugin/template.
// See source/app/metrics/index.ts (the `imports`/`data` construction) and
// source/plugins/*/index.ts for the consumers.
export interface PluginContext {
  login: string
  q: Dict
  imports: Imports
  data?: MetricsData
  graphql?: any
  rest?: any
  plugins?: Dict
  queries?: Dict
  account?: string
  callbacks?: Dict | null
  pending?: Array<Promise<any>>
  [key: string]: any
}

// Second argument of a plugin: the plugin's own options (from action inputs).
export interface PluginOptions {
  enabled?: boolean
  extras?: boolean
  [key: string]: any
}

// A plugin's default export.
export type Plugin = (context: PluginContext, options?: PluginOptions) => Promise<any>

// The shared `imports` bag: utils spread + registries + metadata. Loosely typed
// for now (it is assembled via object spread in index.ts).
export interface Imports {
  plugins: Dict
  templates: Dict
  metadata: Dict
  [key: string]: any
}

// The mutable `data` object accumulated across the rendering pipeline.
export interface MetricsData {
  q: Dict
  animated?: boolean
  large?: boolean
  base: Dict
  config: Dict
  errors: any[]
  warnings: any[]
  plugins: Dict
  computed: Dict
  extras?: boolean
  postscripts?: any[]
  [key: string]: any
}
