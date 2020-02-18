'use strict';

// put your own value below!
const apiKey = 'kdR7h0Bhlq7D9XKmP8zPs9q3GxIcfLgOBsK7p7OY'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $('#results-list').empty();
  $('#js-error-message').empty();

  if(responseJson.total !== "0"){
  // iterate through the items array
  for (let i = 0; i < responseJson.data.length; i++){
    // for each park object in the items 
    //array, add a list item to the results 
    //list with the full name, description,
    //and url
    $('#results-list').append(
      `<li><h3>${responseJson.data[i].fullName}</h3>
      <p>${responseJson.data[i].description}</p>
      <p><a href='${responseJson.data[i].url}'>${responseJson.data[i].url}</p>
      </li>`
    )};
  //display the results section  
  $('#results').removeClass('hidden');
} else {
  $('#js-error-message').text(`State Code Doesn't Exist. Please Try Again.`);
}
}

function getNationalParks(query, maxResults=10) {
  const params = {
    api_key: apiKey,
    stateCode: query,
    limit: maxResults
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    getNationalParks(searchTerm, maxResults);
  });
}

$(watchForm);