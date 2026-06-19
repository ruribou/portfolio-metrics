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

# This fork's source is now TypeScript (.mts), run through the tsx loader at
# runtime (no build step). Drop the upstream .mjs source so stale files can't
# shadow ours, install the tsx loader into the inherited node_modules, then
# overlay our source.
RUN rm -rf /metrics/source \
  && npm install --no-save --ignore-scripts --prefix /metrics tsx
COPY source/ /metrics/source/

WORKDIR /metrics
ENTRYPOINT node --import tsx /metrics/source/app/action/index.mts
