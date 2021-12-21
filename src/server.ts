
import { Server } from "@hapi/hapi";
import manifest from "./manifest";
import Glue from '@hapi/glue'

const options = {
  relativeTo: __dirname,
};

const init = async () => {
  const server:Server = await Glue.compose(manifest, options);
  await server.start()
    console.log(`server started on http://localhost:${server.info.port}`);
};

init();
process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});