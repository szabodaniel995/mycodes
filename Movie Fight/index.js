const config = {
   fetchData: async(searchterm) => {
        const config = {
            params: {
                apikey: "5e40ed70",
                s: searchterm
            }
        };
         
        const response = await axios.get("http://www.omdbapi.com/?", config);
        return response.data.Search;
    },

    renderOption: (movie) => {
        const imgSrc = movie.Poster==="N/A" ? "" : movie.Poster;
        return `
                <img class="image" src="${imgSrc}" alt="">
                <span>${movie.Title}</span>
        `;
    },

    value: function(input) {
        return input.Title;
    }
};

const leftAutoComplete = {
    root: document.querySelector(".left-autocomplete"),

    onOptionSelect: async (result) => { 
        const resultDetails = await fetchDetails(result);
        renderMovieParameters(resultDetails, document.querySelector(".left-summary"), "left");
    },

    ...config
};

const rightAutoComplete = {
    root: document.querySelector(".right-autocomplete"),

    onOptionSelect: async (result) => { 
        const resultDetails = await fetchDetails(result);
        renderMovieParameters(resultDetails, document.querySelector(".right-summary"), "right");
    },

    ...config
};

createAutocomplete(leftAutoComplete);
createAutocomplete(rightAutoComplete);

let leftDetails;
let rightDetails; 

const renderMovieParameters = (data, target, side) => {
    target.innerHTML = renderDetails(data);

    document.querySelector(".tutorial").style.display = "none";

    if (side==="right") {
        rightDetails=data;
    }
    else if (side==="left") {
        leftDetails=data;
    } 
    
    if (leftDetails && rightDetails) { 
        compare();
    }
};


const fetchDetails = async(input) => {
    const config = {
        params: {
            apikey: "5e40ed70",
            i: input.imdbID
        }
    };
    const response = await axios.get("http://www.omdbapi.com/", config);
    return response.data;
};


const renderDetails = (movie) => {
    const awards = wins(movie.Awards);
    const boxOffice = movie.BoxOffice ? (movie.BoxOffice==="N/A" ? 0 : parseInt(movie.BoxOffice.replace(/\$/g, "").replace(/,/g, ""))) : 0;
    const metaScore = movie.Metascore ? (movie.Metascore==="N/A" ? 0 : parseInt(movie.Metascore)) : 0;
    const imdbRating = movie.imdbRating ? (movie.imdbRating==="N/A" ? 0 :parseFloat(movie.imdbRating)) : 0;
    const imdbVotes = movie.imdbVotes? (movie.imdbVotes==="N/A" ? 0 : parseInt(movie.imdbVotes.replace(/,/g, ""))) : 0;

    return `
    <div class="columns figure">
        <div class="column is-one-quarter">
            <img class="image" src="${movie.Poster}" alt="">
        </div>
        <div class="column">
            <p class="title is-2">${movie.Title}</h1>
            <p class="subtitle is-4">${movie.Genre}</p>
            <p>${movie.Plot}</p>
        </div>
    </div>
    <div class="columns">
        <div class="column notification is-primary data" data-value="${awards}"><h1 class="title">${movie.Awards}</h1>
            <p class="subtitle">Awards</p>
        </div>
    </div>
    <div class="columns">
        <div class="column notification is-primary data" data-value="${boxOffice}"><h1 class="title">${movie.BoxOffice}</h1>
            <p class="subtitle">Box Office</p>
        </div>
    </div>
    <div class="columns">
        <div class="column notification is-primary data" data-value="${metaScore}"><h1 class="title">${movie.Metascore}</h1>
            <p class="subtitle">Metascore</p>
        </div>
    </div>
    <div class="columns">
        <div class="column notification is-primary data" data-value="${imdbRating}"><h1 class="title">${movie.imdbRating}</h1>
            <p class="subtitle">IMDB Rating</p>
        </div>
    </div>
    <div class="columns">
        <div class="column notification is-primary data" data-value="${imdbVotes}"><h1 class="title">${movie.imdbVotes}</h1>
            <p class="subtitle">IMDB Votes</p>
        </div>
    </div>
    `
};


const compare = () => {
    const elements = document.querySelectorAll(".left-summary .data"); 

    elements.forEach((element, index) => {
        const otherElement = document.querySelectorAll(".right-summary .data");

        element.classList.remove("is-warning");
        otherElement[index].classList.remove("is-warning");

        const data1=parseFloat(element.dataset.value);
        const data2=parseFloat(otherElement[index].dataset.value);

        if (data1 > data2) {
            otherElement[index].classList.add("is-warning");
        }
        else if (data2 > data1) {
            element.classList.add("is-warning");
        }
        else {
            element.classList.add("is-info");
            otherElement[index].classList.add("is-info");
            console.log (data1, data2);
        }
    })
};

function wins(data) {
    const arr = data.split(" ").reduce((acc, curr) => {
        if (parseInt(curr)) {
            acc.push(parseInt(curr));
        }
        return acc;
    }, [])

    if (arr.length===2) {
        return arr[0];
    } else if (arr.length===3) {
        return arr[1];
    }
    else {
        return 0;
    }
};