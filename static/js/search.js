// Function to update the search results in the search-output div

let searchinp = document.getElementById("search-input");
let searchoup = document.getElementById("search-output");


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



// Event listener for the search button
document.getElementById("searchBtn").addEventListener("click", () => {
    const searchTerm = $('#search-input').val().trim().toLowerCase();
    console.log(searchTerm);
    if (searchTerm !== "") {
        const searchResults = searchSongs(searchTerm);
        console.log(searchResults);
        updateSearchResults(searchResults);
    }
});
