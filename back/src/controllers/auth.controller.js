const { User, Role } = require("../models")
const { genSalt, hashPassword, validatePassword } = require("../utils/password-utility")
const { generate_signature } = require("../utils/jwt")

module.exports.signup = async (req, res, next)=>{
  let image = "default_image.jpg";
  try {
      if(req.file && req.file.filename){
        image = req.file.filename;
      }
        const existUser = await User.findOne({ email : req.body.email });
        if(existUser){
            throw new Error("Email already in use");
        }

        if(!validateUser(req.body)){
          throw new Error("Invalid/Missing fields");
        }

        const new_salt = await genSalt();
        const hashed_pwd = await hashPassword(req.body.password, new_salt);
        await User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone,
            email: req.body.email,
            password: hashed_pwd,
            salt : new_salt,
            image: image,
            role : Role.Commercial
          });
        return res.status(200).send({ message : "Account created successfully"})
    } catch (error) {
        next(error)
    }
}

module.exports.login = async (req, res, next)=>{
    try {
        const { email, password } = req.body;
        if(!email || !password ){
            throw new Error("Invalid email Or password !");
        }
        const user = await User.findOne({ email : email });
        if(!user){
            throw new Error("User with this email not found")
        }
        if(!user.isEnabled){
            throw new Error("Your account is not activated yet, contact the administartor for activation")
        }

        const isPasswordValid = await validatePassword(password, user.password, user.salt);
        if (!isPasswordValid) {
            throw new Error("Invalid email/Password")
        }

        const { _id, firstName, lastName, role, image } = user;
        let fullName = `${firstName} ${lastName}`; 
        const signature = generate_signature({ _id, fullName, email });

        return res.status(200).send({message : "Authenticated successfully" , data : {  
            token : signature, 
            id : _id, 
            fullName, 
            email, 
            role,
            image 
        }})
    } catch (error) {
        next(error)
    }
}