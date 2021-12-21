import { Server } from '@hapi/hapi';
import userHandlers from './controllers'
import Joi from 'joi'
import createUserSchema from './schemas/createUserSchema';
const plugin = {
    name: 'auth',
    version: '1.0.0',
    register: async (server:Server, options:any) => {
      server.route([
        {
          method: 'GET',
          path: '/users',
          handler: userHandlers.find,
          options: {
            validate:{
              ...options.validate
            },
            auth: {
              strategies:['adminJwt'],
            },
            description: 'find all users',
            tags: ['api' ,'admin'],
          },
        },
        {
          method: 'GET',
          path: '/users/{id}',
          handler: userHandlers.findById,
          options:{
              validate:{
                ...options.validate,
                params:Joi.object({id:Joi.string().required()})
              },
              auth: {
                strategies:['adminJwt'],
              },
          }
        },
  
        {
          method: 'POST',
          path: '/signup',
          handler: userHandlers.create,
          options: {
            ...options,
            auth: false,
            description: 'sign up a user',
            tags: ['api' ,'user'],
            notes: 'responds with created user',
            validate: {
              payload: createUserSchema,
              failAction: async (req, h, err) => {
                throw err;
              },
            },
          },
        },
        {
          method: 'POST',
          path: '/login',
          handler: userHandlers.login,
          options: {
            ...options,
            auth: false,
            description: 'sign up a user',
            tags: ['api'],
            notes: 'responds with created user',
            validate: {
              ...options.validate,
              payload: Joi.object({
                username: Joi.string().required(),
                password: Joi.string().required(),
              }),
              failAction: async (req, h, err) => {
                throw err;
              },
            },
          },
        },
        {
          method: 'POST',
          path: '/login/admin',
          handler: userHandlers.loginAdmin,
          options: {
            ...options,
            auth: false,
            description: 'login as server admin',
            tags: ['api'],
            notes: 'responds admin bearer access token',
            validate: {
              ...options.validate,
              payload: Joi.object({
                username: Joi.string().required(),
                password: Joi.string().required(),
              }),
              failAction: async (req, h, err) => {
                throw err;
              },
            },
          },
        },
        {
          method: 'PUT',
          path: '/user/{id}',
          handler: userHandlers.updateOne,
          options
        },
        {
          method: 'DELETE',
          path: '/user/{id}',
          handler: userHandlers.deleteById,
          options
        },
    ]);
    },
}
export default plugin;