const songs = [
{
    title: "Victory Anthem",
    artist: "Khushi TDT, LASH CURRY & Audiocrackerr",
    src: "songs/victory-anthem.mp3"
},
{
    title: "Excuses",
    artist: "AP Dhillon, Gurinder Gill & Intense",
    src: "songs/excuses.mp3"
},
{
    title: "Bella Ciao (La Casa de Papel)",
    artist: "Manu Pilas",
    src: "songs/bella-ciao.mp3"
},
{
    title: "Pasoori",
    artist: "Ali Sethi & Shae Gill",
    src: "songs/pasoori.mp3"
},
{
    title: "Pal Pal",
    artist: "Afusic",
    src: "songs/pal-pal.mp3"
}
];

const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

const title = document.getElementById("title");
const artist = document.getElementById("artist");

const progress = document.getElementById("progress");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");

const volume = document.getElementById("volume");
const playlist = document.getElementById("playlist");

let songIndex = 0;

/* Load Song */
function loadSong(index){
    audio.src = songs[index].src;
    title.textContent = songs[index].title;
    artist.textContent = songs[index].artist;

    updatePlaylist();
}

loadSong(songIndex);

function playSong(){
    audio.play();
    playBtn.textContent = "⏸";
}

function pauseSong(){
    audio.pause();
    playBtn.textContent = "▶";
}

/* Toggle Play */
playBtn.addEventListener("click",()=>{
    if(audio.paused){
        playSong();
    }else{
        pauseSong();
    }
});

/* Next Song */
nextBtn.addEventListener("click",()=>{
    songIndex++;
    if(songIndex >= songs.length){
        songIndex = 0;
    }

    loadSong(songIndex);
    playSong();
});

/* Previous Song */
prevBtn.addEventListener("click",()=>{
    songIndex--;

    if(songIndex < 0){
        songIndex = songs.length - 1;
    }

    loadSong(songIndex);
    playSong();
});

/* Update Progress Bar */
audio.addEventListener("timeupdate",()=>{

    const progressPercent =
    (audio.currentTime / audio.duration) * 100;

    progress.value = progressPercent || 0;

    currentTime.textContent =
    formatTime(audio.currentTime);
});

/* Duration */
audio.addEventListener("loadedmetadata",()=>{
    duration.textContent =
    formatTime(audio.duration);
});

/* Seek Song */
progress.addEventListener("input",()=>{

    audio.currentTime =
    (progress.value / 100) * audio.duration;
});

/* Volume Control */
volume.addEventListener("input",()=>{
    audio.volume = volume.value;
});

/* Format Time */
function formatTime(time){

    let mins = Math.floor(time / 60);
    let secs = Math.floor(time % 60);

    if(secs < 10){
        secs = "0" + secs;
    }

    return `${mins}:${secs}`;
}

/* Playlist */
function renderPlaylist(){

    songs.forEach((song,index)=>{

        const li = document.createElement("li");

        li.textContent =
        `${song.title} - ${song.artist}`;

        li.addEventListener("click",()=>{
            songIndex = index;
            loadSong(songIndex);
            playSong();
        });

        playlist.appendChild(li);
    });
}

renderPlaylist();

/* Highlight Active Song */
function updatePlaylist(){

    const items =
    document.querySelectorAll("#playlist li");

    items.forEach((item,index)=>{
        item.classList.remove("active");

        if(index === songIndex){
            item.classList.add("active");
        }
    });
}

/* Autoplay Next Song */
audio.addEventListener("ended",()=>{

    songIndex++;

    if(songIndex >= songs.length){
        songIndex = 0;
    }

    loadSong(songIndex);
    playSong();
});