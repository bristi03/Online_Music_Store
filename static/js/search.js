// Function to update the search results in the search-output div

let searchinp = document.getElementById("search-input");
let searchoup = document.getElementById("search-output");


// Function to update the search results in the search-output div
const updateSearchResults = (searchResults) => {
    searchoup.innerHTML = "";

    searchResults.forEach((song) => {
        searchoup.appendChild(createCard(song));
    });
};

const searchSongs = (searchTerm) => {
    return songs.filter((song) => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const lowerCaseSongName = song.name.toLowerCase();
        const lowerCaseArtist = song.artist.toLowerCase();

        return (
            lowerCaseSongName.includes(lowerCaseSearchTerm) ||
            lowerCaseArtist.includes(lowerCaseSearchTerm)
        );
    });
};

// Function to display all song cards initially
const displayAllSongs = () => {
    songs.forEach((song) => {
        searchoup.appendChild(createCard(song));
    });
};

// Call the displayAllSongs function when the page loads
document.addEventListener("DOMContentLoaded", () => {
    displayAllSongs();
});

// Event listener for the search button
document.getElementById("searchBtn").addEventListener("click", () => {
    const searchTerm = $('#search-input').val().trim().toLowerCase();

    if (searchTerm !== "") {
        const searchResults = searchSongs(searchTerm);
        updateSearchResults(searchResults);
    } else {
        // If the search term is empty, display all songs
        displayAllSongs();
    }
});
