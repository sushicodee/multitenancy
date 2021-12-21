import path from 'path';
import Pack from './../package.json';
import {Request,ResponseToolkit} from '@hapi/hapi';
import configs from './configs';
import Joi from 'joi'
//import all modules
import adminJwt from './modules/adminJwt';
import userJwt from './modules/userJwt';
import user from './modules/user';

const swaggerOptions = {
    info: {
      title: 'API Documentation for Test',
      version: Pack.version,
    },
  };
  export default {
    server: {
      port: configs.PORT,
      routes: {
        files: {
          relativeTo: path.join(__dirname,'static'),
        },
      },
    },
    register: {
      plugins: [
        {
          plugin: require('@hapi/inert'),
        },
        {
            plugin: require('@hapi/vision'),
            options: {
              engines: {
                hbs: require('handlebars'),
              },
              path: __dirname,
              layout: true,
              layoutPath: path.join(__dirname,'templates'),
              context: (req:Request) => {
                return { credentials: req.auth.credentials };
              },
            },
          },
        { plugin: require('laabr'), options: {} },
        { plugin: require('hapi-swagger'), options: swaggerOptions },
        {
          plugin: require('hapi-auth-jwt2'),
        },
        {
            plugin:adminJwt,
        },
        {
          plugin:userJwt
        },
        {
          plugin:user,
          options: {
            validate: {
              headers: Joi.object({
                slug: Joi.string().required(),
              }).unknown(),
              failAction: (req:Request, h:ResponseToolkit, err:Error) => {
                throw err;
              },
            },
          },
          routes:{
            prefix: '/api',
          }
         
        }
        

        // {
        //   plugin: require('./modules/application'),
        //   options: {
        //     validate: {
        //       headers: Joi.object({
        //         authorization: Joi.string().required(),
        //       }).unknown(),
        //       failAction: (req:Request, h:ResponseToolkit, err:Error) => {
        //         throw err;
        //       },
        //     },
        //   },
        //   routes: {
        //     prefix: '/api',
        //   },
        // },
      ],
    },
  };
  