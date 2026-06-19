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

# Overlay this fork's source — the only divergence from upstream.
COPY source/ /metrics/source/

WORKDIR /metrics
ENTRYPOINT node /metrics/source/app/action/index.mjs
