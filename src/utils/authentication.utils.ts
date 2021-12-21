import { Request,ResponseToolkit } from "@hapi/hapi";
import userSchema, { IUser } from "../modules/user/models/user.model";
import { getModelByTenant } from "./multiTenant/connectionManager";

const round = 12;
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import configs from "../configs";
import { IUserTokenPayload } from "../modules/user/interfaces";
export default {
  hashPassword: async (password:string) => {
    try {
      return await bcrypt.hash(password, round);
    } catch (error) {
      throw error;
    }
  },
  comparePassword: async (password:string, hash:string) => {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      throw error;
    }
  },
  //auth
  sign: async (payload:IUserTokenPayload) => {
    try {
      return await JWT.sign(payload, configs.JWT_SECRET, { expiresIn: '1d' });
    } catch (error) {
      throw error;
    }
  },
  //auth
  verify: async (decodedToken:IUserTokenPayload, req:Request, h:ResponseToolkit) => {
    try {
      const User = getModelByTenant(req.headers.slug,'user',userSchema)
      const user = await User.findOne({
        _id: decodedToken.id,
        email: decodedToken.email,
        dbName:decodedToken.dbName
      });
      if (!user || user?._id != decodedToken.id) {
        return { isValid: false };
      }
      return { isValid: true };
    } catch (error) {
      return { isValid: false };
    }
  },
};