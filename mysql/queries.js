const mysql = require("./config.js");

//query all data from restaurants table, count rows returned and limit returned result accordingly
function getAll(criteria)
{
    query=`select name, city, country, cuisine,  (select count(*) from restaurants) as rowsResult from restaurants order by name limit ?,?`;
    let safeQuery = mysql.functions.format(query, [criteria.skip, criteria.take]);
    return querySql(safeQuery);
}

//query specific data according to applied filter,count rows returned and limit returned result accordingly
function getSome(criteria)
{
    query = `select name, city, country, cuisine,  (select count(*) from restaurants WHERE ${criteria.filter} = ?) as rowsResult from restaurants WHERE ${criteria.filter} = ? ORDER BY name Limit ?,?`;
    let safeQuery = mysql.functions.format(query, [criteria.type,criteria.type, criteria.skip, criteria.take]);
    return querySql(safeQuery);
}
//query lists of specified filter according to user selected type
function getFiltered(criteria)
{
    query = `SELECT DISTINCT ${criteria} as filterResult FROM restaurants ORDER BY  ${criteria}`;
    return querySql(query);
}

module.exports = {
   getAll:getAll,
   getSome: getSome,
   getFiltered:getFiltered
};


/*****************************************************************
 *        You can ignore everything below here!
 *****************************************************************/

// don't worry too much about this function! 
// it has been written to return the data from your database query
// *** it DOES NOT need modifying! ***
function querySql(sql) {
    let con = mysql.getCon();

    con.connect(function (error) {
        if (error) {
            return console.error(error);
        }
    });

    return new Promise((resolve, reject) => {
        con.query(sql, (error, sqlResult) => {
            if (error) {
                return reject(error);
            }

            return resolve(sqlResult);
        });

        con.end();
    });
}