const concurrently = require("concurrently");

const commands = [
  { name: "Server", command: "node server.mjs", prefixColor: "cyan" },
  { name: "Upload", command: "node upload.js", prefixColor: "magenta" },
  { name: "Login", command: "node login.js", prefixColor: "yellow" },
];

concurrently(commands, {
  prefix: "name",
  killOthers: ["failure", "success"],
}).catch((err) => {
  console.error("Error:", err);
});
