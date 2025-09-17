const app = require("./app");  // import the app (no listen inside)
const port = process.env.PORT || 3008;

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
