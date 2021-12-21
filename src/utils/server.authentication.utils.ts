
import { Request, ResponseToolkit } from '@hapi/hapi';
import { ICallback } from '../configs/types';
import configs from './../configs'
import JWT from 'jsonwebtoken'

export default {
  sign: async (payload:{username:string}) => {
    try {
      return await JWT.sign(payload, configs.JWT_SECRET_ADMIN, { expiresIn: '1d' });
    } catch (error) {
      throw error;
    }
  },

  verify: async (decodedToken:any, req:Request, h:ResponseToolkit) => {
    try {
      const user = {username:configs.ADMIN.username,password:configs.ADMIN.password}
      if (!user || user?.username != decodedToken.username) {
        return { isValid: false };
      }
      return { isValid: true };
    } catch (error) {
      return { isValid: false };
    }
  },
}