// Bin entry point. Placeholder for Phase 1 scaffold — the real CLI (Node-version
// gate, parseArgs, dispatch, error boundary) lands in Phase 5 (M5).
const NODE_MAJOR = Number(process.versions.node.split(".")[0]);

function main(): void {
  if (NODE_MAJOR < 20) {
    console.error("your-second-mind requires Node 20+.");
    process.exit(1);
  }
  console.log("your-second-mind: scaffold not yet implemented.");
}

main();
