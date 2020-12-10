import "./database";

import App from "./app";

const port = 9090;

App.listen(port, () => {
  console.log(`Rocket Punch Server listening at http://localhost:${port}`);
});
