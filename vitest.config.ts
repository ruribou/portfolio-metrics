import {defineConfig} from "vitest/config"

// Test runner config. The suites are integration-heavy (they spawn the action
// and a web instance on a fixed port via `node --import tsx`), so files must run
// sequentially in a single process — the equivalent of jest's `--runInBand`.
export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["tests/**/*.test.ts"],
    testTimeout: 60000,
    fileParallelism: false,
    pool: "forks",
    poolOptions: {forks: {singleFork: true}},
  },
})
