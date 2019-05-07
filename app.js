const  app  = require('./config');

app.listen(3000, 'localhost', (err) => {
  if (err) {
    console.log('Deu ruim na conexao bro');
  } else {
    console.log('Romulando na porta 3000');
  }
});