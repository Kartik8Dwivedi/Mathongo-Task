import app from "./app.js";
import Config from "./Config/serverConfig.js";

app.listen(Config.PORT, () => {
  console.log(`✅ Server is running on http://localhost:${Config.PORT}/`);
});
  
  