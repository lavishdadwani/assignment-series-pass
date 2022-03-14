var mongoose = require('mongoose');

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then((res) => console.log('database conected'))
  .catch((err) => console.log(err));