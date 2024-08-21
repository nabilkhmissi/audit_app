const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const EquipementSchema = new Schema({
name: { type: String, required : true },
  type: { type: String, required: true },
  ref: { type: String, required: true },
  details: { type: String },
  
},
{
  timestamps: true
});

module.exports = mongoose.model("Equipement", EquipementSchema);


