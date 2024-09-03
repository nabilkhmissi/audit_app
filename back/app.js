const express = require("express");
const path = require("path");
const cors = require("cors")
const app = express();
const error_handler = require("./src/utils/error-handler")
const { AuthRoute, UserRoute, AuditRoute, QuestionRoute, QuestionCategoryRoute } = require("./src/routes");

app.use(cors());
app.use(express.json());
app.use("/user_images", express.static(path.join("./src/static/images")));
app.use("/audit_files", express.static(path.join("./src/static/files")));

app.use("/api/auth", AuthRoute);
app.use("/api/users", UserRoute);
app.use("/api/audits", AuditRoute);
app.use("/api/questions", QuestionRoute);
app.use("/api/questions/categories", QuestionCategoryRoute);

app.use(error_handler);

module.exports = app;