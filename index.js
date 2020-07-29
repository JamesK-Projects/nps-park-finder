'use strict';

const apiKey = 'TY7ncppchzlJjBTHJeTKSakzbYaBSnl9heYPOSjg';
const searchURL = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params){
    const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function displayResults(responseJson, maxResults){
    console.log(responseJson);
    $('#results-list').empty();
    for (let i = 0; i < maxResults && i < responseJson.total; i++){
        $('.js-results').append(
            `<h3>
                <a href="${responseJson.data[i].url}">${responseJson.data[i].name} (${responseJson.data[i].designation})</a>
            </h3>
            <p>
                ${responseJson.data[i].description}
            </p>
            <img src="${responseJson.data[i].images[0].url}" alt="${responseJson.data[i].images[0].altText}" width="300px">
            <p>
                Address:<br>
                ${responseJson.data[i].addresses[0].line1}<br>
                ${responseJson.data[i].addresses[0].line2}<br>
                ${responseJson.data[i].addresses[0].line3}<br>
                ${responseJson.data[i].addresses[0].city}, ${responseJson.data[i].addresses[0].stateCode} 
                ${responseJson.data[i].addresses[0].postalCode}<br>
            </p>
            
        `);
    }
    
}

function getNationalParks(query, maxResults){
    const params = {
        api_key: apiKey,
        stateCode: query,
        limit: maxResults,

    }
    const queryString = formatQueryParams(params);
    const url = searchURL + '?' + queryString;

    console.log(url);

    fetch(url)
        .then(response => {
            if (response.ok){
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson, maxResults))
        .catch(err => {
            $('.js-error-message').text(`Something went wrong: ${err.message}`);
        });
}

function watchForm(){
    $('form').submit(event => {
        event.preventDefault();
        const checkedStates = [];
        const checkBox = $('.checkbox');
        const maxResults = $('.js-max-results').val();
        for (let i = 0; i < checkBox.length; i++){
            if ($(checkBox[i]).prop("checked") === true){
                const checkedId = checkBox[i].value;
                checkedStates.push(checkedId);
            };
        };
        console.log(checkedStates);
        getNationalParks(checkedStates, maxResults);
    });
};

$(watchForm);