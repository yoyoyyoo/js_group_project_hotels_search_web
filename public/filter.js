//variable declarations
let Dropdown = document.getElementById("types");
let table=document.querySelector('table tbody');
let pageNumber=0;
let take=5;
let displayPage = document.querySelector("#noPage");
let displayRows;
let nextBnt=document.getElementById("next");
let previousBnt=document.getElementById("previous");
let elementClicked = true;
let filterButton = document.querySelector('#filterButton');
let useFilter = document.getElementById("filters");

//function declarations

//getAll function to receive all data without filter
function getAll() {
    table.innerHTML="";
    displayRows=0;
    displayPage.innerHTML = "Displaying ";

    //fetch all the data from route - http://localhost:3000/allData
    fetch(`/allData?page=${pageNumber}&take=${take}`)
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                table.innerHTML += "<tr><td>" + data[i].name + "</td>"
                    + "<td>" + data[i].country + "</td>"
                    + "<td>" + data[i].city + "</td>"
                    + "<td>" + data[i].cuisine + "</td></tr>";
             }
            displayRows=data[0].rowsResult;
            if(pageNumber == 0) /* if on first page
            - previous button -> disabled
            - display "1 - selected page number"*/
            {
             displayPage.innerHTML += `${pageNumber+1}  -  ${take} of ${displayRows}`; 
                previousBnt.disabled=true;
                nextBnt.disabled=false;
            }  
            else if((pageNumber+1)*take < displayRows) /* if in the middle
            - display corresponding results*/
              {  displayPage.innerHTML += `${pageNumber*take+1}  -  ${take*(pageNumber+1)} of ${displayRows}`;
              previousBnt.disabled=false;
              nextBnt.disabled=false;
            }
            else/** if on last page
            - next button - disabled
            - display last corresponding result
            */
              { 
                displayPage.innerHTML += `${pageNumber*take+1}  -  ${displayRows} of ${displayRows}`;
                nextBnt.disabled=true;
                previousBnt.disabled=false;
              }
         });
    
    };

//get specific data based on the applied filters
function getSpecific()
{
    let useType = document.querySelector("#types");
    displayRows=0;
    displayPage.innerHTML="Displaying ";
    if(useFilter.value == "" || useType.value == "" ) //alert if filters are not applied
       alert(`You must select a filter to filter! If you wish to clearImmediate. Click 'Clear Filter'!`);
    else // fetch the data based on the applied filters from route - http://localhost:3000/allData
    {
    fetch(`./allData?filter=${useFilter.value}&type=${useType.value}&page=${pageNumber}&take=${take}`)//send those values as query parmeters
        .then(response => response.json())
        .then(data => {
            table.innerHTML="";
            for (let i = 0; i < data.length; i++) {
                table.innerHTML += "<tr><td>" + data[i].name + "</td>"
                    + "<td>" + data[i].country + "</td>"
                    + "<td>" + data[i].city + "</td>"
                    + "<td>" + data[i].cuisine + "</td></tr>";
            }
            displayRows=data[0].rowsResult;
         if(pageNumber == 0)
            {//if the result less than the selected page number, display the returned rows number only
                if(displayRows > take ) 
                { 
                    displayPage.innerHTML += `${pageNumber+1}  -  ${take} of ${displayRows}`; 
                    nextBnt.disabled=false;
                }
                else
                  { displayPage.innerHTML += `${pageNumber*take+1}  -  ${displayRows} of ${displayRows}`;
                  nextBnt.disabled=true;
            }
            previousBnt.disabled=true;
        }
        else if((pageNumber+1)*take<displayRows) 
           { 
            displayPage.innerHTML += `${pageNumber*take+1}  -  ${take*(pageNumber+1)} of ${displayRows}`;
            previousBnt.disabled=false;
            nextBnt.disabled=false;
           }
        else
          { 
            displayPage.innerHTML += `${pageNumber*take+1}  -  ${displayRows} of ${displayRows}`;
            nextBnt.disabled=true;
            previousBnt.disabled=false;
           }
         });
        }
}

//call the getAll function to display data in the table
getAll();

//add eventlistener to select filter dropdown list so that select type will be changed accordingly
useFilter.addEventListener("change", event => {
    
    fetch(`/data/${useFilter.value}`)
        .then(response => response.json())
        .then(result => {
            Dropdown.innerHTML = "<option value=''> --Select a type-- </option>";
            for (let i = 0; i < result.length; i++) {
               Dropdown.innerHTML += `<option value="${result[i].filterResult}"> ${result[i].filterResult}</option>`;
            }
        });
});

//add eventlistener to apply filter button so that getSpecific function will be called when it's clicked
filterButton.addEventListener("click", event => {
    event.preventDefault();
    pageNumber=0;
    elementClicked = false; //if clicked, set elementClicked to false
    getSpecific();
});

//add eventlistener to previous button so that getAll or getSpecific is called
document.querySelector("#previous").addEventListener("click", event => {
    pageNumber--;
    if(elementClicked) //if filter is not clicked, call getAll function 
        getAll();
    else
        getSpecific(); //if filter is clicked, call getSpecific function
});

//add eventlistener to next button so that getAll or getSpecific is called
document.querySelector("#next").addEventListener("click", event => {
    pageNumber++;
    if(elementClicked)
        getAll();
    else
        getSpecific();
});

//add eventlistener to select page number dropdown list so that getAll or getSpecific function will be called accordingly
//will also set data display accordinly
document.querySelector("#perPage").addEventListener("change", event => {
    pageNumber = 0;
    let pageValue = document.querySelector('#perPage option:checked').value;
    take = pageValue;
    displayPage.innerHTML = `${pageNumber+1}  -  ${take} of ${displayRows}`;
   
   if(elementClicked)
        getAll();
    else
        getSpecific();
});




    