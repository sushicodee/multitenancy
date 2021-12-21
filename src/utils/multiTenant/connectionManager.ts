import Boom from '@hapi/boom';
import mongodb from './createConnection';

const getTenantDB = (tenantId:string, modelName:string, schema:any) => {
  const dbName = `hapi-db-test-${tenantId}`;
  if (mongodb) {
    // useDb will return new connection
    const db = (mongodb as any).useDb(dbName, { useCache: true });
    console.log(`DB switched to ${dbName}`);
    db.model(modelName, schema);
    return db;
  }
  // return throwError(500, codes.CODE_8004);
  return Boom.internal();
};
/**
 * Return Model as per tenant
 */
export const getModelByTenant = (tenantId:string, modelName:string, schema:any) => {
  console.log(`getModelByTenant tenantId : ${tenantId}.`);
  const tenantDb = getTenantDB(tenantId, modelName, schema);
  return tenantDb.model(modelName);
};
