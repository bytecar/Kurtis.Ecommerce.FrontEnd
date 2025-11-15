import express from 'express';
import { registerRoutes } from './routes';
import { setupAuth } from './auth';
const app = express();
app.use(express.json());
setupAuth(app);
registerRoutes(app).then(server=>{
  const port = process.env.PORT || 5000;
  server.listen(port, ()=>console.log('Server listening on', port));
}).catch(err=>{ console.error('Failed to start',err); process.exit(1); });
