/*
COMP206 - Group Assignment
Author: Manlin Mao, Xuancheng Li, Yanan Liu
Description: This is a page to list the restaurants by using different filters.
*/

let express = require('express');
let app = express();
const queries = require("./mysql/queries");
app.use(express.static('public'));
app.use('/public', express.static('public'));
app.set('view engine', 'ejs');
app.listen(3000);

//http://localhost:3000/
app.get("/", (request, response) => {
  response.render('index');
});

//
//http://localhost:3000/allData
app.get("/allData", (request, response) => {
  let queryFilter = request.query.filter;
  let queryFilterType = request.query.type;
  let take = parseInt(request.query.take);
  let skip = parseInt(request.query.page) * take;

//if the filter is undefined, display all data
  if (request.query.filter === undefined)
    queries.getAll({
      take:take,
      skip,skip
    }) .then(result => {
      response.json(result);
    });
  else //if the filter is defined, display the specific data
   queries.getSome({
      filter:queryFilter,
      type:queryFilterType,
      take:take,
      skip,skip
    }) .then(result => {
      response.json(result);
    });

});

//load specific type dropdown list based on the first selected filter
//http://localhost:3000/data/:filterType
app.get("/data/:filterType", (request, response) => {
  let filter = request.params.filterType;
  queries.getFiltered(filter) 
  .then(filteredResult => {
      response.json(filteredResult);
    });
});