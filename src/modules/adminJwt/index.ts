import { Server } from "@hapi/hapi";
import configs from "../../configs";

import { ServerAuthenticationUtils } from '../../utils';
const plugin = {
  name: 'admin-jwt-plugin',
  version: '1.0,0',
  register: (server:Server, options:any) => {
    /**
    * adminJwt is the value of auth used in routes
      or add strategies array to auth object in routes index for multiple strategy
    */
    server.auth.strategy('adminJwt', 'jwt', { 
      key: configs.JWT_SECRET_ADMIN,
      verifyOptions: {
        algorithm: ['HS256'],
      },validate: ServerAuthenticationUtils.verify});
    // server.auth.default('adminJwt');
  },
}; 
export default plugin;
