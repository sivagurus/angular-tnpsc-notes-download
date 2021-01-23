
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 8080;
const _ = require("lodash");

const baseUrl = "https://api.classplusapp.com";
const token = process.env.TOKEN || "";

let header = {
  'x-access-token' : token,
  'Api-Version': '11',
  'User-Agent': 'Mobile-Android',
  'Host': 'api.classplusapp.com',
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  next();
});

app.get("/getStore", async (req, res) => {
  try{
    let request = await axios({
      method: 'get',
      url: baseUrl + '/v2/courses',
      params: {
        offset: 0,
        tabCategoryId: 2
      },
      headers: header
    });
    return res.status(200).json(request.data);
  } catch(error){
    console.log(error);
    return res.status(500).json({
      error: "something went wrong"
    });
  }
});

app.get("/getContent", async (req, res) => {
  try{
    let courseId = req.query.courseId;
    let request = await axios({
      method: 'get',
      url: baseUrl + '/v2/course/content/get',
      params: {
        courseId: courseId,
      },
      data: {},
      headers: header
    });
    return res.status(200).json(request.data);
  } catch(error){
    return res.status(500).json({
      error: "something went wrong"
    });
  }
});

app.get("/getContentSub", async (req, res) => {
  try{
    let courseId = req.query.courseId;
    let folderId = req.query.folderId;
    let request = await axios({
      method: 'get',
      url: baseUrl + '/v2/course/content/get',
      params: {
        courseId: courseId,
        folderId: folderId
      },
      data: {},
      headers: header
    });
    return res.status(200).json(request.data);
  } catch(error){
    return res.status(500).json({
      error: "something went wrong"
    });
  }
});

app.use(express.static('./dist'));

app.get('/*', (req, res) => {
  res.sendFile('index.html', { root: 'dist/' });
});

app.listen(port, () => {
  console.log(`Server is running at port ${port}...`);
});
