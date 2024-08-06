const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AuditSchema = new Schema({
        auditor: [{ type: mongoose.Types.ObjectId, ref: "User" }],
        organisationName: { type: String, required: true    },
        contactNumber: {  type: String, required: true },
        phoneNumber: { type: String, required: true },
        website: { type: String, required: true },
        employeesNumber: { type: String, required: true },
        employeesInPerimeter: { type: String, required: true },
        contactName: { type: String, required: true },
        contactEmail: { type: String, required: true },
        isDeleted : { type : Boolean , default : false },
        status : { type : String , default : "Pending" },
        files : [ { type : String  } ],
        isAssigned : { type : Boolean, default : false }
    },
    {
        timestamps: true
    }
);

AuditSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.__v;
  delete obj.createdAt;
  delete obj.updatedAt;
  delete obj.isDeleted;
  return obj;
}

module.exports = mongoose.model("Audit", UserSchema);


