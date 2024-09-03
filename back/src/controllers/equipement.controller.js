const { Equipement } = require("../models")

module.exports.searchEquipements = async (req, res, next)=>{
    try {
        const { manufacturer, ref } = req.body;
        let filter = {};
        if(manufacturer){
            filter.manufacturer = manufacturer;
        }
        if(ref){
            filter.ref = ref;
        }
        const equippements = await Equipement.findOne(filter)
        return res.status(200).send({ message : "Equipements retrieved successfully", data : equippements })
    } catch (error) {
        next(error)
    }
}