import express from 'express'; // Import express
const app = express(); // Create an instanse



//startar servern
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});