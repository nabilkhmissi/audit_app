const express = require('express');
const router = express.Router();
const { AuditController } = require('../controllers');
const { uploader } = require("../utils");

router.post("/create", uploader.uploadAuditFiles.single("file"), AuditController.createAudit);
router.patch("/assign/:id", AuditController.assignAudit);
router.get("/findAll", AuditController.findAll);
router.delete("/delete/:id", AuditController.deleteAudit);
router.get("/findByAuditor/:id", AuditController.findByAuditor);
router.patch("/updateAudit/:id", AuditController.updateAudit);
router.get("/findById/:id", AuditController.findById);
router.patch("/:id/equipements", AuditController.addEquipement);
router.get("/:id/equipements", AuditController.findAuditEquipements);
router.delete("/:auditID/equipements/:eqID", AuditController.removeEquipementFromAudit);
router.patch("/equipements/:eqID", AuditController.updateEquipementFromAudit);
router.patch("/:id/questionnaire", AuditController.submitQuestionnaire);
// router.patch("/:id/progress", AuditController.updateAuditProgress);
//get audit data
router.get("/:id/contact", AuditController.findAuditContactInfosByID);
router.get("/:id/equipements", AuditController.findAuditEquipementsByID);
router.get("/:id/questionnaire", AuditController.findAuditQuestionnaireByID);

router.post("/:id/files", uploader.uploadAuditFiles.single('file'), AuditController.uploadFile);
router.patch("/:id/files/:fileId", AuditController.deleteFile);
router.get("/dashboard", AuditController.dashboardNumbers);

module.exports = router;