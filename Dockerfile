# Lightweight fork image: layer this fork's source changes on top of the upstream
# pre-built image instead of rebuilding everything from scratch.
#
# The fork only diverges from upstream in source/**, but a from-scratch build
# (Chrome + deno + ruby/nokogiri-from-source + npm ci) is so heavy it stalled the
# GHCR publish workflow for over an hour. The upstream image already ships all of
# that, so we just overlay the forked source on top — this builds in seconds.
#
# Pinned to the version the upstream "latest" tag currently resolves to; bump when
# rebasing the fork onto a newer upstream release. The Node.js runtime is inherited
# from this base image.
FROM ghcr.io/lowlighter/metrics:v3.34

# This fork's source is now TypeScript (.ts), run through the tsx loader at
# runtime (no build step). Drop the upstream .mjs source and test mocks so stale
# files can't shadow ours, install the tsx loader into the inherited
# node_modules, then overlay our source. The action entry point statically
# imports tests/mocks (used only when METRICS_MOCKED), so the renamed .js mocks
# must be overlaid too or module resolution fails at startup.
#
# The upstream base image's /metrics/package.json has no "type" field (defaults
# to commonjs); our package.json is never copied into the image. Without this,
# tsx interprets our .ts source — and the ESM .js mocks — as CommonJS, which
# silently turns `import x from "<cjs-module>"` (e.g. @actions/github) into
# `undefined` and crashes at startup ("Cannot read properties of undefined
# (reading 'context')"). `.mts` used to sidestep this by always being ESM;
# restore that guarantee for .ts files by marking the inherited package.json as
# an ES module.
RUN rm -rf /metrics/source /metrics/tests \
  && npm install --no-save --ignore-scripts --prefix /metrics tsx \
  && node -e "const f='/metrics/package.json',p=require(f);p.type='module';require('fs').writeFileSync(f,JSON.stringify(p,null,2)+'\n')"
COPY source/ /metrics/source/
COPY tests/ /metrics/tests/

WORKDIR /metrics
ENTRYPOINT node --import tsx /metrics/source/app/action/index.ts
