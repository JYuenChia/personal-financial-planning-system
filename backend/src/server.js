const express = require("express");
const apiRoutes = require("./routes");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API server is running" });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api", apiRoutes);

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
