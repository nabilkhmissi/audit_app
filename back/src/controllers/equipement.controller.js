const { Equipement } = require("../models")

module.exports.searchEquipements = async (req, res, next)=>{
    try {
        const { manufacturer, ref } = req.body;
        let filter = {};
        if(manufacturer){
            filter.manufacturer = { $regex : manufacturer, $options : 'i'};
        }
        if(ref){
            filter.ref = { $regex : ref, $options : 'i'};
        }
        const equippements = await Equipement.find(filter)
        return res.status(200).send({ message : "Equipements retrieved successfully", data : equippements })
    } catch (error) {
        next(error)
    }
}