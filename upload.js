const uploadLog = require("./utils/upload-log");

async function main() {
  try {
    await uploadLog(
      "/Users/rt/projects/scriptor/skriptor_testing/echo-testing-1725446946122.log",
      "echo-testing"
    );
    console.log("Log file uploaded successfully");
  } catch (error) {
    console.error("Failed to upload log file:", error);
  }
}

main();
