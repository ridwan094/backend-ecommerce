import AuthHelper from '../helpers/AuthHelper';
import config from '../../config/config';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
//import defaultImage from './../../client/assets/images/default.png';

//1.declare pathDir untuk menyimpan image di local storage
const pathDir = __dirname + '../../uploads/users/';

// findAll = select * from users
const findAll = async (req, res) => {
  const users = await req.context.models.Users.findAll({
    attributes: { exclude: ['user_password', 'user_salt'] },
    include:[{
      all:true
  }]
  });
  return res.send(users);
}

const findOne = async (req, res) => {
    const users = await req.context.models.Users.findOne({
      where: {user_id: req.params.id},
      include:[{
        all:true
    }]
    });
    return res.send(users); 
  }

// create user with hash & salt
const signup = async (req, res) => {

  if (req.cekEmail) return res.status(400).send({message : "Email alredy exists"})
  
  const { dataValues } = new req.context.models.Users(req.body);
  const salt = AuthHelper.makeSalt();
  const hashPassword = AuthHelper.hashPassword(dataValues.user_password, salt);

  try {
    const user = await req.context.models.Users.create({
      user_name: dataValues.user_name,
      user_email: dataValues.user_email,
      user_password: hashPassword,
      user_salt: salt,
      user_type: dataValues.user_type,
      user_birthdate: dataValues.user_birthdate,
      user_gender: dataValues.user_gender,
      user_avatar: dataValues.user_avatar
    }
    );
    if (!user.user_id) return res.status(500).send({ message: 'Failed to signUp.' })
    return res.status(201).send(
        {
            user_name: user.user_name,
            user_email: user.user_email,
            user_birthdate: user.user_birthdate,
            user_gender: user.user_gender,
            user_avatar: user.user_avatar,
            user_type: user.user_type,
        }
    )
  } catch (error) {
    return res.status(400).json({message: "Failed for sign up "+error })
  }
  
  
}

const update = async (req, res) => {

  if (!fs.existsSync(pathDir)) {
    fs.mkdirSync(pathDir);
  }

  const form = formidable({
    multiples: true,
    uploadDir: pathDir,
    keepExtensions: true
  });

  

  form
    .on('fileBegin', function (name, file) {
      //rename the incoming file to the file's name
      let photo = pathDir + `/${req.params.id}/`
      if (!fs.existsSync(photo)) fs.mkdirSync(photo)
      file.path = path.join(photo + file.name);
    })
    .parse(req, async (err, fields, files) => {
      if (err) {
        res.status(400).json({
          message: "Image tidak bisa diupload"
        })
      }
      const Userlama = req.cekUser
      const Emaillama = req.cekEmail

      if (!Userlama) return res.status(404).send({ message: 'User to be updated not found.' })

      if (Emaillama && Userlama.user_email !== Emaillama.user_email) return res.status(400).send({ message: 'New email is already exists.' })
      const emFormat = /^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/
      if (!user_email.match(emFormat)) return res.status(400).send({ message: 'Email format is not valid.' })
      
      let users = new req.context.models.Users(fields);

      if (!users.user_id) {
        users.user_id = req.params.id
      }

      if (Object.keys(files).length !==0) {
        users.user_avatar = files.user_avatar.name;
      }
      
      if (users.user_password){
        const salt = AuthHelper.makeSalt();
        const hashPassword = AuthHelper.hashPassword(users.user_password, salt);
        users.user_password =  hashPassword,
        users.user_salt = salt
      }
      try {
        const result = await req.context.models.Users.update(users.dataValues,{
          returning: true, where: { user_id: req.params.id }
        });
        
        return res.send(result)
      } catch (error) {
        res.send(error.message)
      }


    });

}

// filter find by user_email
const signin = async (req, res) => {
  //1. extract values from request body
  const { user_email, user_password } = req.body

  //2. gunakan try catch, agar jika terjadi error misal table ga bisa diakses bisa munculkan error message
  try {

    // idem : select * from users where user_email = :user_email
    const users = await req.context.models.Users.findOne({
      where: { user_email: user_email }
    });

    //3. jika user tidak ketemu munculkan error
    if (!users) {
      return res.status('400').json({
        error: "User not found"
      });
    }

    //3. check apakah user_password di table === user_passowrd yg di entry dari body,
    // tambahkan salt
    if (!AuthHelper.authenticate(user_password, users.dataValues.user_password, users.dataValues.user_salt)) {
      return res.status('401').send({
        error: "Email and password doesn't match."
      })
    }

    //4. generate token jwt, jangan lupa tambahkan jwtSecret value di file config.js
    const token = jwt.sign({ _id: users.user_id }, config.jwtSecret)

    //5. set expire cookie
    res.cookie("t", token, {
      expire: new Date() + 9999
    })

    //6. exclude value user_password & user_salt, agar tidak tampil di front-end
    // lalu send dengan include token, it's done
    return res.json({
      token, users: {
        user_id: users.dataValues.user_id,
        user_name: users.dataValues.user_name,
        user_email: users.dataValues.user_email,
        user_type: users.dataValues.user_type,
        user_birthdate: users.dataValues.user_birthdate,
        user_gender: users.dataValues.user_gender,
        user_avatar: users.dataValues.user_avatar
      }
    });


  } catch (err) {
    return res.status('400').json({
      error: "Could not retrieve user"
    });
  }

}

const signout = (req, res) => {
  res.clearCookie("t")
  return res.status('200').json({
    message: "signed out"
  })
}

const requireSignin = expressJwt({
  secret: config.jwtSecret,
  userProperty: 'auth',
  algorithms: ['sha1', 'RS256', 'HS256']
})

const cekUser = async (req,res,next)=>{
  try{
    if(req.params.id===undefined || isNaN(req.params.id)) res.status(400).send({message : "Wrong Id User" })
    const user = await req.context.models.Users.findOne({
      where:{user_id:req.params.id}
    })
    req.cekUser = {
      user_id:user.user_id
    }
    next()
  }catch(error){
    return res.status(500).send({message:`User ${error}`})
  }
}

const cekEmail = async (req,res,next)=>{
  try{
    if(!req.body.user_email) return res.status(400).send({message : "Email can't be null" })
    const emFormat = /^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/
    if(req.body.user_email.match(emFormat)) return res.send({message : "Email Not Valid"})
    const eMuser = await req.context.models.Users.findOne({
      where:{user_email:req.body.user_email}
    })
    req.cekEmail = eMuser
    next()
  }catch(error){
    return res.status(500).send({message:`Cek Email ${error}`})
  }
}

const isAuthorized = (req, res, next) => {
  try {
      const authorized = req.user && req.auth && req.user.id == req.auth.id
      if (!(authorized)) return res.status(403).send({ message: 'User not authorized.' })
      next()
  } catch (error) {
      return res.status(500).send({ message: `Function isAuthorized ${error}.` })
  }
}

const Delete = async (req, res) => {
    try {
        const deleteUser = req.cekUser
        if (!deleteUser) res.status(404).send({ message: 'User to be deleted not found.' })

        await req.context.models.User.destroy(
            {
                where: { user_id: req.params.id }
            }
        )
    } catch (error) {
        return res.status(500).send({ message: `Delete user ${error}.` })
    }
}

// Gunakan export default agar semua function bisa dipakai di file lain.
export default {
  findAll,
  findOne,
  signup,
  signin,
  update,
  cekUser,
  cekEmail,
  requireSignin,
  signout,
  isAuthorized,
  Delete
}