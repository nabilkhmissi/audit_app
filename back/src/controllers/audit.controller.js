const { Audit, User, Equipement } = require("../models");

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
      .populate({
        path: "questionnaire",
        populate: "question"
      })
      .exec();
    return res.status(200).send({ data : audit, message : "Audit retrieved successfully" });
  } catch (error) {
    next(Error("Error while getting audit by id"))
  }
}

//find by id and contact only
module.exports.findAuditContactInfosByID = async function (req, res, next) {
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
    .select('-equipements -questionnaire -isDeleted')
    return res.status(200).send({ data : audit, message : "Audit contact retrieved successfully" });
  } catch (error) {
    console.log(error)
    next(Error("Error while getting audit contact"))
  }
}

//find by id and equipements only
module.exports.findAuditEquipementsByID = async function (req, res, next) {
  try {
    const audit = await Audit.findOne({ _id : req.params.id, isDeleted : false })
    .populate('equipements')
    return res.status(200).send({ data : audit.equipements, message : "Audit contact retrieved successfully" });
  } catch (error) {
    next(Error("Error while getting audit by id"))
  }
}

//find by id and questionnaire only
module.exports.findAuditQuestionnaireByID = async function (req, res, next) {
  try {
    const audit = await Audit.findOne({ _id : req.params.id, isDeleted : false })
    .populate({
      path : 'questionnaire',
      populate : 'question'
    })
    return res.status(200).send({ data : audit.questionnaire, message : "Audit questionnaire retrieved successfully" });
  } catch (error) {
    console.log(error)
    next(Error("Error while getting audit questionnaire"))
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
    .populate({
      path : 'questionnaire',
      populate : 'question'
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
      equipements : []
    })
    
    return res.status(200).send({ data : audit, message : "Audit created successfully" });
  } catch (error) {
    console.log(error)
    next(Error("Error while creating audit"))
  }
}

module.exports.addEquipement = async (req, res, next)=>{
  try {
      const auditID = req.params.id;
      //check if an equiepent for this details exists already, suppose we have an id
      let equipement = null;
      if(req.body.id){
        equipement = await Equipement.find({ ref : req.body.ref, manufacturer : req.body.manufacturer });
      }else{
        equipement = await Equipement.create({
          category : req.body.category,
          details : req.body.details,
          ref : req.body.ref,
          manufacturer : req.body.manufacturer,
          subcategory : req.body.subcategory
        });
      }
      const audit = await Audit.findById(auditID).populate("equipements");
      audit.equipements.push(equipement);
      await audit.save();
      return res.status(200).send({ message : "Equipenemt added successfully", data : equipement })
  } catch (error) {
    next(error)
  }
}

module.exports.findAuditEquipements = async (req, res, next)=>{
  try {
      const auditID = req.params.id;
      const audit = await Audit.findById(auditID).populate("equipements");
      return res.status(200).send({ message : "Equipenemts retrieved successfully", data : audit.equipements })
  } catch (error) {
    next(error)
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

//delete equipement from audits 
module.exports.removeEquipementFromAudit = async function (req, res, next) {
  try {
    const auditID = req.params.auditID;
    const equipementID = req.params.eqID;
    const audit = await Audit.findById(auditID).populate("equipements");
    audit.equipements = audit.equipements.filter(e => e._id != equipementID);
    await audit.save();    
    return res.status(200).send({ message : "Audit equipement removed successfully", data : { _id : equipementID } });
  } catch (error) {
    next(error)
  }
}
//update equipement from audits 
module.exports.updateEquipementFromAudit = async function (req, res, next) {
  try {
    const equipementID = req.params.eqID;
    const equipement = await Equipement.findById(equipementID);
    equipement.category = req.body.category;
    equipement.subcategory = req.body.subcategory;
    equipement.category = req.body.category;
    equipement.ref = req.body.ref;
    equipement.details = req.body.details;
    equipement.manufacturer = req.body.manufacturer;
    await equipement.save();    
    return res.status(200).send({ message : "Audit equipement updated successfully", data : equipement });
  } catch (error) {
    next(error)
  }
}
//submit questionnaire
module.exports.submitQuestionnaire = async function (req, res, next) {
  try {
    let { questionnaire } = req.body;
    const audit = await Audit.findById(req.params.id);

    audit.questionnaire = [];

    for (let i = 0; i < questionnaire.length; i++) {
      const element = questionnaire[i];
      audit.questionnaire.push({ question : element.question, response : element.response ?? false })
    }
    const updated = await audit.save();
    const updated_audit = await Audit.findById(updated._id)
    .populate({
      path:'questionnaire',
      populate : 'question'
    });

    return res.status(200).send({ message : "Audit questionnaire updated successfully", data : updated_audit.questionnaire });
  } catch (error) {
    next(error)
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
module.exports.updateAuditProgress = async function (req, res, next){
  try { 
    const audit = await Audit.findOne({_id : req.params.id, isDeleted : false });
    if(!audit){
      throw Error("Audit not found/deleted")
    } 
    audit.progress = req.body.progress;
    await audit.save();
    return res.status(200).send({ message : 'Progress updated successfully', data : audit })
  } catch (error) {
    next(error)
  }
}