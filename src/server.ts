import app from './app';
import connectDB from './database/connection';

const PORT = process.env.PORT || 3000;

connectDB();
app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));
