require("dotenv").config({
  path: require("path").join(__dirname, "../.env")
});

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  "/api/auth",
  require("./routes/authRoutes")
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, "../.env")
});
app.use(
  "/api/vendors",
  require("./routes/vendorRoutes")
);

app.use(
  "/api/po",
  require("./routes/poRoutes")
);
app.use(
    "/api/employees",
    require("./routes/employeeRoutes")
);

app.use(
    "/api/approvers",
    require("./routes/approverRoutes")
);