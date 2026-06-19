// @ts-nocheck -- TODO(ts): remove and type this (staged migration)
/**Template processor */
export default async function(_, __, {imports}) {
  //Core
  await imports.plugins.core(...arguments)
}