const { FreestyleSandboxes } = require("freestyle-sandboxes");
const { prepareDirForDeploymentSync } = require("freestyle-sandboxes/utils");

const api = new FreestyleSandboxes({
  apiKey: process.env.FREESTYLE_API_KEY, // You'll need to set this
});

// Prepare all files in the current directory for deployment
const files = prepareDirForDeploymentSync(".");

// Deploy website with minimal server to Style.dev
api
  .deployWeb(files, {
    domains: ["brandsnap-ai.style.dev"], // Your custom subdomain
    entrypoint: "server.js", // Minimal Node.js HTTP server
  })
  .then((result) => {
    console.log("🎉 BrandSnap.ai deployed successfully!");
    console.log("🌐 Live at:", result.domains);
    console.log("✨ Your AI-powered brand generator is now online!");
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    console.log("💡 Make sure your FREESTYLE_API_KEY is set correctly");
  }); 