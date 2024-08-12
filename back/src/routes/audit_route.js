const express = require('express');
const router = express.Router();
const { AuditController } = require('../controllers');
const { uploader } = require("../utils");

router.post("/create", uploader.uploadAuditFiles.single("file"), AuditController.createAudit);
router.patch("/assign/:id", AuditController.assignAudit);
router.get("/findAll", AuditController.findAll);
router.delete("/delete/:id", AuditController.deleteAudit);
router.get("/findByAuditor/:id", AuditController.findByAuditor);

module.exports = router;