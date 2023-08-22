'use strict';

const playList = [
  {
    author: "LED ZEPPELIN",
    song:"STAIRWAY TO HEAVEN"
  },
  
  {
    author: "QUEEN",
    song:"WE WILL ROCK YOU"
  },
  
  {
    author: "LYNYRD SKYNYRD",
    song:"FREE BIRD"
  },
  
  {
    author: "DEEP PURPLE",
    song:"SMOKE ON THE WATER"
  },
  
  {
    author: "JIMI HENDRIX",
    song: "ALL ALONG THE WATCHTOWER"
  },
  
  {
    author: "AC/DC",
    song:"BACK IN BLACK"
  },
  
  {
    author: "QUEEN",
    song:"THE SHOW MUST GO ON"
  },
  
  {
    author: "METALLICA",
    song:"ENTER SANDMAN"
  },

  {
    author: "TOT COTUGNO",
    song:"L'ITALIANO"
  },

  {
    author: "THE RASMUS",
    song:"WONDERMAN"
  }
];

//Globally used Variables
let songName = document.querySelector('.music-name'),
    authorName = document.querySelector('.music-author'),
    prevBtn = document.querySelector('.prev-btn'),
    playBtn = document.querySelector('.play-btn'),
    nextBtn = document.querySelector('.next-btn'),
    menuBtn = document.querySelector('.menu-btn'),
    progressBar = document.querySelector('.progress-bar'),
    currentAudioIndex = 0,
    isPlaying = false,
    audio = new Audio();


loadAudio(currentAudioIndex);
drawMusicList();
playingAudio();

//Event listeners
playBtn.addEventListener('click', () => {
  if (isPlaying) {
    pauseAudio();
  } else {
    playAudio();
  }
});
prevBtn.addEventListener('click', playPrevAudio);
nextBtn.addEventListener('click', playNextAudio);
menuBtn.addEventListener('click', toggleSongList);

audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('loadeddata', updateSongDuration);

progressBar.addEventListener('click', setProgress);

//Load song
function loadAudio() {
  let currentAudio = playList[currentAudioIndex],
      url = currentAudio.song.toLowerCase().split(' ').join(' ');
  
  audio.src = `./media/${url}.mp3`;
  audio.load();
  songName.textContent = currentAudio.song;
  authorName.textContent = currentAudio.author;

  audio.addEventListener('ended', playNextAudio);
}

//Play song
function playAudio() {
  audio.play();
  isPlaying = true;
  playBtn.innerHTML = '<i class="fas fa-pause"></i>';

  playingAudio();
}

//Song on pause
function pauseAudio() {
  audio.pause();
  isPlaying = false;
  playBtn.innerHTML = '<i class="fas fa-play"></i>';
}

//Play the previous song
function playPrevAudio() {
  if (currentAudioIndex > 0) {
    currentAudioIndex--;
  } else {
    currentAudioIndex = playList.length - 1;
  }

  loadAudio();
  playAudio();
  playingAudio();
}

//Play the next song in playlist
function playNextAudio() {
  currentAudioIndex++;

  if (currentAudioIndex >= playList.length) {
    currentAudioIndex = 0;
  }

  loadAudio();
  playAudio();
  playingAudio();
}

//Open/close playlist with songs
function toggleSongList() {
  let boxes = document.getElementsByClassName('box');

  for(const box of boxes) {
    box.classList.toggle('active');
  }
}

//show playlist in HTML
function drawMusicList() {
  let container = document.querySelector('.music-player'),
      backBtnElem = document.createElement('button'),
      info = document.createElement('div'),
      olElem = document.createElement('ol');

  backBtnElem.classList = 'btn back-btn';
  info.classList = 'music-info box';
  olElem.className = 'music-list';

  backBtnElem.innerHTML = `<i class="fa-solid fa-arrow-left"></i>`;

  for (let i = 0; i < playList.length; i++) {
    let item = document.createElement('li'),
        divElem = document.createElement('div'),
        titleElem = document.createElement('h3'),
        authorElem = document.createElement('p'),
        spanElem = document.createElement('span'),
        audioElem = document.createElement('audio');
    
    item.className = 'music-list__item';
    divElem.className = 'music-list__info';
    titleElem.className = 'music-name';
    authorElem.className = 'music-author';
    spanElem.className = 'audio-duration';
    
    item.setAttribute('li-index', `${i}`);
    spanElem.setAttribute('id', `${'song' + playList.indexOf(playList[i])}`);
    audioElem.className = `${'song' + playList.indexOf(playList[i])}`;
    audioElem.setAttribute('src', `./media/${playList[i].song.toLowerCase().split(' ').join(' ')}.mp3`);

    titleElem.innerText = playList[i].song;
    authorElem.innerText = playList[i].author;
    
    divElem.append(titleElem, authorElem);
    item.append(divElem, spanElem, audioElem);
    olElem.append(item);

    let liAudioDuratingTag = olElem.querySelector(`#\\${'song' + playList.indexOf(playList[i])}`),
        liAudioTag = olElem.querySelector(`.\\${'song' + playList.indexOf(playList[i])}`);

    liAudioTag.addEventListener('loadeddata', () => {
      let duration = liAudioTag.duration,
          min = Math.floor(duration / 60),
          sec = Math.floor(duration % 60);

      if(sec < 10) {
        sec = `0${sec}`;
      }

      liAudioDuratingTag.innerText = `${min}:${sec}`;
      liAudioDuratingTag.setAttribute('t-duration', `${min}:${sec}`)

    });
    
  }

  info.append(backBtnElem, olElem);
  container.append(info);

  let backBtn = document.querySelector('.back-btn');
  backBtn.addEventListener('click', toggleSongList);
}

//Current song play in playlist
function playingAudio() {
  let liAudio = document.querySelectorAll('li');

  for (let i = 0; i < liAudio.length; i++) {
    let audioTag = liAudio[i].querySelector('.audio-duration');

    if (liAudio[i].classList.contains('playing')) {
      liAudio[i].classList.remove('playing');

      let adDuration = audioTag.getAttribute('t-duration');
      audioTag.innerText = adDuration;
      audioTag.style.color = '';
    }

    if (liAudio[i].getAttribute('li-index') == currentAudioIndex) {
      liAudio[i].classList.add('playing');
      audioTag.innerText = 'Playing';
      audioTag.style.color = '#9400d3';
    }

    liAudio[i].setAttribute('onclick', 'clicked(this)');
  }
}

//show current audio 
function clicked(element) {
  let liIndex = element.getAttribute('li-index');

  currentAudioIndex = liIndex;

  loadAudio(currentAudioIndex);
  playAudio();
  playingAudio();
}

//update progress bar width according to music current time
function updateProgress(e) {
  let currentProgress = document.querySelector('.current-progress'),
      audioCurrentTime = document.querySelector('.current-time'),
      currentTime = e.target.currentTime,
      duration = e.target.duration,
      progressWith = (currentTime / duration) * 100,
      currentMin = Math.floor(currentTime / 60),
      currentSec = Math.floor(currentTime % 60);

  currentProgress.style.width = `${progressWith}%`;

  if(currentSec < 10) {
    currentSec = `0${currentSec}`;
  }

  audioCurrentTime.innerText = `${currentMin} : ${currentSec}`;
}

//update total duration of song
function updateSongDuration() {
  let audioDuration = document.querySelector('.duration'),
      duration = audio.duration,
      min = Math.floor(duration / 60),
      sec = Math.floor(duration % 60);

  if(sec < 10) {
    sec = `0${sec}`;
  }

  audioDuration.innerText = `${min} : ${sec}`;
}

//set progress bar
function setProgress(e) {
  let progressWidth = progressBar.clientWidth,
      clickedOffsetX = e.offsetX,
      audioDuration = audio.duration;

  audio.currentTime = (clickedOffsetX / progressWidth) * audioDuration;

  playAudio();
  playingAudio();
}