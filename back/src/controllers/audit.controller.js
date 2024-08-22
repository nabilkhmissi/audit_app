const { Audit, User } = require("../models");

//find all audits
module.exports.findAll = async function (req, res, next) {
  try {
    const audits = await Audit.find({ isDeleted : false })
    .populate({
        path: "auditors",
        select: "-password -salt -isEnabled -isDeleted"
      })
      .populate({
        path: "client",
        select: "-password -salt -isEnabled -isDeleted"
      })
      .exec();
    return res.status(200).send({ data : audits, message : "Audits retrieved successfully" });
  } catch (error) {
    next(Error("Error while getting audits"))
  }
}
//find by id
module.exports.findById = async function (req, res, next) {
  try {
    const audit = await Audit.findOne({ _id : req.params.id, isDeleted : false })
    .populate({
        path: "auditors",
        select: "-password -salt -isEnabled -isDeleted"
      })
      .populate({
        path: "client",
        select: "-password -salt -isEnabled -isDeleted"
      })
      .exec();
    return res.status(200).send({ data : audit, message : "Audit retrieved successfully" });
  } catch (error) {
    next(Error("Error while getting audit by id"))
  }
}

//find all audits by auditor
module.exports.findByAuditor = async function (req, res, next) {
  try {
    const audits = await Audit.find({ auditors : { $in : req.params.id } })
    .populate({
      path: "auditors",
      select: "-password -salt -isEnabled -isDeleted"
    })
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
    const selectedClient = await User.findById(req.body.client);
    const audit = await Audit.create({
      auditors : auditors,
      client : selectedClient,
      contactEmail : req.body.contactEmail,
      contactName : req.body.contactName,
      contactNumber : req.body.contactNumber,
      employeesInPerimeter : req.body.employeesInPerimeter,
      employeesNumber : req.body.employeesNumber,
      files : files,
      phoneNumber : req.body.phoneNumber,
      website : req.body.website,
      organisationName : req.body.organisationName,
    })
    
    return res.status(200).send({ data : audit, message : "Audit created successfully" });
  } catch (error) {
    console.log(error)
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
    const deleted = await audit.save()
    return res.status(200).send({ message : "Audit deleted successfully", data : deleted });
  } catch (error) {
    next(Error("Error while deleteing audit"))
  }
}

module.exports.updateAudit = async function (req, res, next) {
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
    const audit = await Audit.findByIdAndUpdate(req.params.id, {
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
      progress : req.body.progress
    });
    const updated = await Audit.findById(req.params.id).populate({
      path: "auditors",
      select: "-password -salt -isEnabled -isDeleted"
    })
    .exec();
    
    
    return res.status(200).send({ data : updated, message : "Audit updated successfully" });
  } catch (error) {
    next(Error("Error while creating audit"))
  }
}