import { Server } from "http";
import app from "./app";
import config from "./config";

async function main() {
  try {
    const server: Server = app.listen(config.port, () => {
      console.log("IX-Server is on ", config.port);
    });
  } catch (err) {
    console.log(err);
  }
}

main();
