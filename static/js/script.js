//An array of objects, where each object is a song. 
// {songs} means destructuring the ojbect from the right.
//Note: the destructing should be key specific. 
//If songs is an key in the object, then only it will get the songs array.

var songs;
// Getting required elemets, const to not allow reinitialization
// let for reinitialization of that elements to update from DOM.
var playerHead = document.getElementById("player");
let playBtn = document.getElementById("playBtn");
let pauseBtn = document.getElementById("pauseBtn");
let seekBar = document.querySelector("#seek-bar");
let forwardBtn = document.getElementById("forward-btn");
let backwardBtn = document.getElementById("backward-btn");
let repeatBtn = document.getElementById("repeat-btn");
let durationTime = document.querySelector(".duration-time");
const currTime = document.getElementById("current-time");
let cardCollection = document.querySelectorAll(".card__collection_main");
let currentSong = new Audio();

//Player is hidden by default and is visible only when a song is clicked.
playerHead.style.display = "none";

//Function to create card and add functionality to update player head.
const createCard = (song) => {
    //Takes in the song object as an argument.
    /*
    Create the Structure.
    <div class="card">
        <img src="./images/content/noctornal.jpg" alt="Noctornal">
            <div class="card_info">
                <p class="card_name">Noctornal</p>
                <p class="card_artist">The Midnight</p>
            </div>
    </div>
    */
    const card = document.createElement("div");
    const img = document.createElement("img");
    const cardInfo = document.createElement("div");
    const cardName = document.createElement("p");
    const cardArtist = document.createElement("p");

    //Assigning Classes to the elements created.
    card.className = "card";
    cardInfo.className = "card_info";
    cardName.className = "card_name";
    cardArtist.className = "card_artist";

    //Adding the song details to the card.
    cardName.innerHTML = song.name;
    cardArtist.innerHTML = song.artist;
    img.src = song.image;
    img.alt = song.name;

    //Structuring the card
    cardInfo.append(cardName, cardArtist);
    card.append(img, cardInfo);

    //Adding functionality to the card to update the player head on click
    card.onclick = function(){
        playerHead.style.display = "flex";
        currentSong = updatePlayer(song);
        playPauseFunc(currentSong);
        forwdBackwdFunc(song)
    }

    //Return the dynamic card element.
    return card;
}

//Adds functionality to the play and pause buttons to play the current song.
const playPauseFunc = (song) => {
    //Reinitialize the buttons.
    playBtn = document.getElementById("playBtn");
    pauseBtn = document.getElementById("pauseBtn");
    forwardBtn = document.getElementById("forward-btn");
    backwardBtn = document.getElementById("backward-btn");
    repeatBtn = document.getElementById("repeat-btn");
    
    //When the pause button is clicked, the song is paused.
    pauseBtn.addEventListener("click", () => {
        song.pause();
        playBtn.style.display = "inline";
        pauseBtn.style.display = "none"; 
    });

    //When the play button is clicked, the song is played.
    playBtn.addEventListener("click", () => {
        song.play();
        playBtn.style.display = "none";
        pauseBtn.style.display = "inline";
    });

    
}

const forwdBackwdFunc = ({name, artist, location, image, liked, id}) =>{
    forwardBtn.addEventListener('click', ()=> {
        if(id >= songs.length -1){
            id =0;
        }
        else{
            id++;
        }
        currentSong = updatePlayer(songs[id]);
    })

    backwardBtn.addEventListener('click', ()=> {
        if(id == 0){
            id =songs.length -1;
        }
        else{
            id--;
        }
        currentSong = updatePlayer(songs[id]);
    })

    repeatBtn.addEventListener('click', ()=> {
       
        currentSong = updatePlayer(songs[id]);
    })
}

const setMusic =(i) => {
    seekBar.value = 0;
    let song =songs[i];
    currentSong = i;

    currTime.innerHTML = '00:00';
    setTimeout(()=>{
        seekBar.max = currentSong.duration;
    },300);
}
//Like and unlike the song and update the card collection for liked songs.
const likeSong = (id, likeBtn, songName) => {
    //id - the id of the song, on which the button is clicked for.
    //likeBtn - The acutal element to update the styling.
    //songName - The name of the song for which button is clicked
    //           as we don't have id for every card, only the name is 
    //           is unique, so we use it cross check the songs object.

    //Reinitialize the collection to get the updated collection from DOM.
    cardCollection = document.querySelectorAll(".card__collection_main");
    //Get the current liked songs from the above collection.
    let likedSongs = cardCollection[0].children;
    //Since it returns a HTMLCollection, array functions can not be performed
    //The likedSongs is converted into an array using the Array object
    //converting it to an actual array using Array.from()l
    likedSongs = Array.from(likedSongs);

    //Check if the global song object is liked or not
    //if liked before, then unlike it, change color of like button
    //and remove that song from the liked songs collection.
    if(songs[id].liked){
        songs[id].liked = false;
        likeBtn.style.color = "grey";
        likedSongs.forEach(songCard => {
            const name = songCard.lastChild.firstChild.innerHTML;
            if(name == songName){
                songCard.style.display = "none";
                songCard.remove();
            }
        });
    //If song is not liked, then like the song,
    //change the color of like button
    //and add that song in the liked song collection.
    } else {
        songs[id].liked = true;
        likeBtn.style.color = "red";
        cardCollection[0].append(createCard(songs[id]));
    }
    updateStorage();
}

const formatTime =(time) =>{
    let min = Math.floor(time/60);
    if(min<10){
        min = `0${min}`;
    }
    let sec = Math.floor(time%60);
    if(sec<10){
        sec = `0${sec}`;
    }
    return `${min} : ${sec}`;
}

//update the player head whenever a new song is clicked. 
const updatePlayer = ({name, artist, location, image, liked, id}) => {
    //The arugument of the function is a song object
    //We are destructuing it in the arguments directly and using it.

    //Setting the new song for the global song object.
    currentSong.setAttribute("src", location);

    //Getting the required elements from the player head.
    const songContainer = document.querySelector(".song");
    const artistContainer = document.querySelector(".artist");
    const likeBtn = document.querySelector(".likeBtn");
    const artistImage = document.querySelector(".artist_image");
    const endTime = document.getElementById("end_time");

    playBtn = document.getElementById("playBtn");
    pauseBtn = document.getElementById("pauseBtn");

    //Setting the default to the player head pause and play buttons.
    playBtn.style.display = "inline";
    pauseBtn.style.display = "none";
    
    //Adding the selected song details in the player head.
    songContainer.innerHTML = name;
    artistContainer.innerHTML = artist;
    artistImage.src = image;
    
    //Assign the id of the song to the button,
    //Check is song is liked and add the color based on song.liked.
    likeBtn.id = id;
    likeBtn.style.color = "grey";
    if(liked){
        likeBtn.style.color = "red";
    }

    //Adding a onclick functionlity to the like button.
    likeBtn.onclick = function () {
        likeSong(likeBtn.id, likeBtn, name);
    }   

    //When the current song is loaded, set it's duration and add it 
    //to the end time element.
    currentSong.onloadedmetadata = () => {
        endTime.innerHTML = formatTime(currentSong.duration);

    }
    currentSong.play();
    playBtn.style.display = "none";
    pauseBtn.style.display = "inline";
    //Return the current song 
    return currentSong;
}

setInterval(()=>{
    seekBar.value = currentSong.currentTime;
    seekBar.max = currentSong.duration;
    currTime.innerHTML= formatTime(currentSong.currentTime);
},500)

seekBar.addEventListener('change',()=>{
    currentSong.currentTime = seekBar.value;
})

//main function that calls all other functions.
//updates the collection by creating the cards and adding them.
const updateCollection = () => {
    //Reinitalize the collection to get the latest from DOM.
    cardCollection = document.querySelectorAll(".card__collection_main");
    //For all collections, using ForEach, we pass in the songs
    //and create cards for each collection.
    cardCollection.forEach((collection, index) => {
        //First collection is always for liked songs, so put
        //liked songs alone in that collection.
        if(index === 0){
            songs.forEach((song) => {
                if(song.liked){
                    collection.append(createCard(song))
                }
            })
        //all other collections put all songs.
        } else {
            songs.forEach((song) => {
                collection.append(createCard(song));
            });
        }
        //for every odd collection, reverse the order of the collection.
        if(index%2 !== 0){
            collection.classList.toggle("reverse");
        }
    })
}

//Once the document if fully loaded, call the update collection function
//and add the functionlity to the Spotify Clone.
document.addEventListener("DOMContentLoaded", async() => {
    updateCollection();
})

let searchinp = document.getElementById("search-input");
let searchoup = document.getElementById("search-output");


// Once the document if fully loaded, call the update collection function
// and add the functionality to the Spotify Clone.
document.addEventListener("DOMContentLoaded", async () => {
    await fetch('/static/data/data.json') // Update the path accordingly
        .then(response => response.json())
        .then(data => {
            // Destructure the 'songs' array from the data
            songs  = data.songs;

            // Use the 'songs' variable here or perform any operations needed
            console.log(songs); // Just an example to display the 'songs' array in the console
        })
        .catch(error => {
            console.error('Error fetching the data:', error);
        });
    updateCollection();
});

function confirm_logout(){
    let result=confirm("You are about to logout!");
    if(result){
        $.ajax({
            type: "GET",
            url: "/logout",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (response) {
                console.log(response);
                window.location.href = "/";
            },
            error: function (error) {
                console.error(error);
                alert(error.responseJSON.message);
            }
        });
    }
}
