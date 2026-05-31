import app from "./app";
import { env } from "./config/env.config";

const PORT = env.PORT ?? 3000;

app.listen(PORT, () => console.log(`🚀Serving at http://localhost:${PORT}`));
