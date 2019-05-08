const app = require('./config');
require('dotenv').config();
const port = process.env.port || 3000;
app.listen(port, 'localhost', (err) => {
  if (err) {
    console.log('Deu ruim na conexao bro');
  } else {
    console.log(`Romulando na porta ${port}`);
  }
});