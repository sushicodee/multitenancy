import { Server } from "@hapi/hapi";
import configs from '../../configs' ;
import { authenticationUtils } from '../../utils';
const plugin = {
  name: 'jwt-plugin',
  version: '1.0,0',
  register: (server:Server, options:any) => {
    server.auth.strategy('userJwt', 'jwt', {
      key: configs.JWT_SECRET,
      verifyOptions: {
        algorithm: ['HS256'],
      },
      validate: authenticationUtils.verify,
    });
    // server.auth.default('jwt');
  },
};

export default plugin;
