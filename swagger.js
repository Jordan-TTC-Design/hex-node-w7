const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info:{
    title:'META API',
    description:'六角作業貼文api'
  },
  host: 'localhost:8080',
  scheme: ['http', 'https'],

}

const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js'];

// swaggerAutogen(輸出檔案名稱, 輸出檔案, 資料);
swaggerAutogen(outputFile, endpointsFiles, doc);