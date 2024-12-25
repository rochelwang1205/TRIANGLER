const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Triangle Light API',
    description: 'API Documentation'
  },
  host: 'localhost:3001',
  schemes: ['http']
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/api.js'];

// 生成 swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc)
  .then(() => {
    console.log('Swagger documentation generated');
  })
  .catch((err) => {
    console.error('Error generating swagger documentation:', err);
  });