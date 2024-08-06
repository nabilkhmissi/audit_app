const { Audit, User } = require("../models");

//find all audits
module.exports.findAll = async function (req, res, next) {
  try {
    const audits = await Audit.find({ isDeleted : false })
    return res.status(200).send({ data : audits, message : "Audits retrieved successfully" });
  } catch (error) {
    next(Error("Error while getting audits"))
  }
}

//find all audits by auditor
module.exports.findByAuditor = async function (req, res, next) {
  try {
    const audits = await Audit.find({ auditor : req.params.id })
    return res.status(200).send({ data : audits, message : "Audits retrieved successfully" });
  } catch (error) {
    next(Error("Error while getting audits by auditor"))
  }
}
//create audit
module.exports.createAudit = async function (req, res, next) {
  try {
    const auditors = [];
    const req_auditors = req.body.auditors;
    for (const a of req_auditors) {
      const user = await User.findById(a);
      auditors.push(user);
    }
    const audit = await Audit.create({
      
    })
    const audits = await Audit.find({ auditor : req.params.id })
    return res.status(200).send({ data : audits, message : "Audits retrieved successfully" });
  } catch (error) {
    next(Error("Error while getting audits by auditor"))
  }
}
