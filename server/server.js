const express = require('express');
const swaggerUi = require('swagger-ui-express');

const app = express();

// 引入路由
const apiRoutes = require('./routes/api');

// 使用路由
app.use('/api', apiRoutes);

// 設定 Swagger UI
const swaggerFile = require('./swagger-output.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});