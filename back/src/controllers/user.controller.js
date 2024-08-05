const { User } = require("../models");
const { ApiError } = require("../utils/index")

//find all users
module.exports.findAll = async function (req, res, next) {
  try {
    const users = await User.find({ isDeleted : false })
    return res.status(200).send(users);
  } catch (error) {
    next(Error("Error while getting enabled users"))
  }
}
//find user by id
module.exports.findById = async function (req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    return res.status(200).send(user);
  } catch (error) {
    next(Error("Error while getting user"))
  }
}
//find user by email
module.exports.findByEmail = async function(req,res){
  try {
    const user = await User.findOne({email: req.body.email})
    if (!user) {
      throw new ApiError("User with this email not found");
    }
    return res.status(200).json(user);
  }
  catch (error) {
    next(error);
  }
}
//enable or disable user
module.exports.enableUser = async function (req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    user.isEnabled = !user.isEnabled;
    await user.save();
    return res.status(200).json({ message: "User enabled successfully" });
  } catch (error) {
    next(new Error("Error while enabling user"))
  }
};
//update user image
module.exports.UpdateUserImage = async function (req, res, next) {
  let new_image = "default_image.jpg";
  try {
    if (req.file && req.file.filename) {
      new_image = req.file.filename;
    }
    await User.findByIdAndUpdate(req.params.id, { $set: { image : new_image } });
    return res.status(200).json({ message: "Image updated successfully", image : new_image });
  } catch (error) {
    next(new Error("Error while updating user"))
  } 
};
//update user details
module.exports.UpdateUserDetails = async function (req, res, next) {
  try {
    const { firstName, lastName, adresse, phone } = req.body;
    const user = await User.findById(req.params.id);
    if(firstName) user.firstName = firstName;  
    if(lastName) user.lastName = lastName;  
    if(phone) user.phone = phone;  
    if(adresse) user.adresse = adresse;  
    await user.save();
    return res.status(200).json({ message: "Details updated successfully", image : new_image });
  } catch (error) {
    next(new Error("Error while updating user details"))
  } 
};
//change password
module.exports.changePassword= async function (req,res,next){
  try {
    const { oldPassword , newPassword, confirmPassword } = req.body;
    const user = await User.findById(req.params.id);
    if(hashPassword(oldPassword, user.salt) == user.password){
      throw Error("Old password is not the same")
    }
    if(newPassword != confirmPassword){
      throw Error("Please verify your new password");
    }
    const new_salt = await genSalt();
    const hashed_pwd = await hashPassword(newPassword, new_salt);
    user.password = hashed_pwd;
    user.salt = new_salt;
    await user.save();
    return res.status(200).send({message : "Pazssword updated successfully"});
  } catch (error) {
    next(new Error(error));
  }
}