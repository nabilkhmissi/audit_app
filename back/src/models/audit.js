const mongoose = require("mongoose");
const AuditStatus = require("./audit_status");

const Schema = mongoose.Schema;

const AuditSchema = new Schema({
        auditors: [{ type: mongoose.Types.ObjectId, ref: "User" }],
        organisationName: { type: String, required: true    },
        contactNumber: {  type: String, required: true },
        phoneNumber: { type: String, required: true },
        website: { type: String, required: true },
        employeesNumber: { type: Number, required: true },
        employeesInPerimeter: { type: Number, required: true },
        contactName: { type: String, required: true },
        contactEmail: { type: String, required: true },
        isDeleted : { type : Boolean , default : false },
        status : { type : String , default : AuditStatus.pending },
        files : [ { type : String  } ],
    },
    {
        timestamps: true
    }
);

AuditSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.__v;
  // delete obj.createdAt;
  delete obj.updatedAt;
  delete obj.isDeleted;
  return obj;
}

module.exports = mongoose.model("Audit", AuditSchema);


