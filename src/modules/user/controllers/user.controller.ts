import Boom from '@hapi/boom';
import {Request,ResponseToolkit} from '@hapi/hapi';
import UserSchema from './../models/user.model';
import {authenticationUtils ,getModelByTenant} from './../../../utils/index';
import { IUser } from '../models/user.model';
import configs from '../../../configs';
import serverAuthenticationUtils from '../../../utils/server.authentication.utils';
/** 
 *dbName/slug represents the database.
 *dbName used to get the connection model providing the model name and schema 
*/
const getUser = (dbName:string) => getModelByTenant(dbName,'user',UserSchema)

const find = async (req:Request, h:ResponseToolkit) => {
    // const User = getUser(req.headers.slug);
    const User = getModelByTenant(req.headers.slug,'user',UserSchema)
    const users = await User.find({},{password:0})
    return users;
};

const create = async (req:Request, h:ResponseToolkit) => {
  try {
    const User = getUser(req.headers.slug);
    const { username, email, password } = req.payload as IUser;
    const isExisting = await User.findOne({ username }).select(
      '_id,username,email'
    );
    if (isExisting?.username === username || isExisting?.email === email) {
      return Boom.badRequest(`user already exists`);
    }
    const hashedPassword = await authenticationUtils.hashPassword(password);
    const newUser = new User({ username, email, password: hashedPassword });
    const user = await newUser.save();
    delete user.password;
    return user;
  } catch (error) {}
};

const login = async (req:Request, h:ResponseToolkit) => {
  const { username, password } = req.payload as IUser;
  const User = getUser(req.headers.slug);
  const user = await User.findOne({ username });
  if (!user) return Boom.unauthorized('invalid username or password');
  const isMatch = await authenticationUtils.comparePassword(password, user.password);
  if (isMatch) {
    const accessToken = await authenticationUtils.sign({
      id: user._id,
      email: user.email,
      dbName:req.headers.slug
    });
    const { _id: id, email, username, createdAt, updatedAt, __v } = user;
    return {
      user: { id, email, username, createdAt, updatedAt, __v },
      accessToken,
    };
  }
  return Boom.unauthorized('invalid username or password');
};

const updateOne = async (req:Request, h:ResponseToolkit) => {
  try {
    const User = getUser(req.headers.slug);
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.payload,
      { new: true }
    );
    if (updatedUser) {
      return h.response(updatedUser);
    }
    return Boom.badRequest('something went wrong');
  } catch (error) {
    return Boom.badGateway('server error');
  }
};

const findById = async (req:Request, h:ResponseToolkit) => {
  const id = req.params.id;
  const User = getUser(req.headers.slug);
  try {
    const user = await User.findById(id).select('_id username email');
    return user;
  } catch (err) {
    return Boom.badRequest('user dosent exist');
  }
};

const deleteById = async (req:Request, h:ResponseToolkit) => {
  try {
    const User = getUser(req.headers.slug);
    const deletedUser = await User.findByIdAndUpdate(req.params.id ,{isDeleted:true});
    return h.response(deletedUser);
  } catch (err) {
    Boom.badGateway('Server error');
  }
};

//server auth
const loginAdmin = async (req:Request, h:ResponseToolkit) => {
  const { username, password } = req.payload as IUser;
  if (username !== configs.ADMIN.username) return Boom.unauthorized('user dosent exist');
  if(password !== configs.ADMIN.password) return Boom.unauthorized('invalid username or password');
    const accessToken = await serverAuthenticationUtils.sign({
      username,
    });
    return {
      user: {  username },
      accessToken,
    };
};

const userController = {
    find,
    create,
    login,
    findById,
    updateOne,
    deleteById,
    loginAdmin
}

export default userController;