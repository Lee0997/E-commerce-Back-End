const express = require('express');
const routes = require('./routes');
// import sequelize connection
// const sequelize = require('./config/connection');
const { Category, Product, ProductTag, Tag } = require('./models');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

(async () => {
  try {
    await Promise.all([
      Category.sync(),
      Product.sync(),
      ProductTag.sync(),
      Tag.sync(),
    ]);
  
    // sync sequelize models to the database, then turn on the server
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}!`);
    });
  } catch (error) {
    console.error('ERROR - server failed to start');
    process.exit(1);
  }
})();
