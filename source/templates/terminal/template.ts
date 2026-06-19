// @ts-nocheck -- TODO(ts): remove and type this (staged migration)
/**Template processor */
export default async function ({q}, _, {imports}) {
  //Core
  await imports.plugins.core(...arguments)
  //Disable optimization to keep white-spaces
  q.raw = true
}
