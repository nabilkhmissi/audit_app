const { Audit, User } = require("../models");

//find all audits
module.exports.findAll = async function (req, res, next) {
  try {
    const audits = await Audit.find({ isDeleted : false }).populate({
        path: "auditors",
        select: "-password -salt -isEnabled -isDeleted"
      })
      .exec();
    return res.status(200).send({ data : audits, message : "Audits retrieved successfully" });
  } catch (error) {
    next(Error("Error while getting audits"))
  }
}

//find all audits by auditor
module.exports.findByAuditor = async function (req, res, next) {
  try {
    const audits = await Audit.find({ auditors : { $in : req.params.id } })
    return res.status(200).send({ data : audits, message : "Audits retrieved successfully" });
  } catch (error) {
    next(Error("Error while getting audits by auditor"))
  }
}
//create audit
module.exports.createAudit = async function (req, res, next) {
  try {
    const auditors = [];
    let files = [];
    if(req.files){
      req.files.forEach(element => {
        files.push(element);
      });
    }
    const req_auditors = req.body.auditors;
    for (const a of req_auditors) {
      const user = await User.findById(a).select("-password -salt");
      auditors.push(user);
    }
    const audit = await Audit.create({
      auditors : auditors,
      contactEmail : req.body.contactEmail,
      contactName : req.body.contactName,
      contactNumber : req.body.contactNumber,
      employeesInPerimeter : req.body.employeesInPerimeter,
      employeesNumber : req.body.employeesNumber,
      files : files,
      phoneNumber : req.body.phoneNumber,
      website : req.body.website,
      organisationName : req.body.organisationName,
      status : req.body.status
    })
    
    return res.status(200).send({ data : audit, message : "Audit created successfully" });
  } catch (error) {
    next(Error("Error while creating audit"))
  }
}

module.exports.assignAudit = async (req, res, next) => {
  try {
    const audit = await Audit.findById(req.params.id);
    let auditors = [];
    for (let i = 0; i < req.body.auditors.length; i++) {
      const auditor = await User.findById(req.body.auditors[i]);
      auditor.push(auditor);
    }
    audit.auditors = auditors;
    const updated =  await audit.save();
    return res.status(200).send({ message : 'Auditors assigned successfully', data : updated })
  } catch (error) {
    next(error)
  }
}

//delete audits 
module.exports.deleteAudit = async function (req, res, next) {
  try {
    const audit = await Audit.findById(req.params.id);
    audit.isDeleted = !audit.isDeleted;
    await audit.save()
    return res.status(200).send({ message : "Audit deleted successfully" });
  } catch (error) {
    next(Error("Error while deleteing audit"))
  }
}