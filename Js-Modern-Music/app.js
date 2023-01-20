const container = document.querySelector(".container");
const image = document.querySelector("#music-image");
const title = document.querySelector("#music-details .title");
const singer = document.querySelector("#music-details .singer");
const prev = document.querySelector("#controls #prev");
const play = document.querySelector("#controls #play");
const next = document.querySelector("#controls #next");
const duration = document.querySelector("#duration");
const CurrentTime = document.querySelector("#current-time");
const progressBar = document.querySelector("#progress-bar");
const volume = document.querySelector("#volume");
const volumeBar = document.querySelector("#volume-bar");
const ul = document.querySelector("ul");

const player = new MusicPlayer(musicList); //Dışarıdan music listesini verdik..

window.addEventListener("load", () => { //sf load olduğunda
    let music = player.getMusic(); 
    displayMusic(music); //İlk başta ilk index getMusic ile alınır. Sf açıldığında.. O da music değişkenine aktarılır ve displayMusic'e o anki music aktarılır.
    displayMusicList(player.musicList);
    isPlayingNow();
});

const displayMusic = (music) => {
    title.innerText = music.getName(); //İlgili indexteki music'in bilgilerini aktarır.
    singer.innerText = music.singer; 
    image.src = "img/" + music.img;
    audio.src = "mp3/" + music.file;
}

play.addEventListener("click", () => {
    const isMusicPlay = container.classList.contains("playing"); //T F döndürür. True varsa click olduğunda pauseMusic çalıştırılır ve durur. Aksiyse tam tersi
    isMusicPlay ? pauseMusic() : playMusic();
});

prev.addEventListener("click", () => {  prevMusic();  });
next.addEventListener("click", () => {  nextMusic();  });

const prevMusic = () => {
    player.prev(); //player üzerinden prev metodu çağırılır.
    let music = player.getMusic(); //Daha sonra o anki güncel müzik bilgisi music'e aktarılır, displayMusic ile yansıtılır.
    displayMusic(music); 
    playMusic();
    isPlayingNow();
}
const nextMusic = () => {
    player.next(); //İlk index arttırılır. Daha sonra music'e aktarılır ve displayMusic ile yansıtılır.
    let music = player.getMusic();
    displayMusic(music); 
    playMusic();
    isPlayingNow();
}

const pauseMusic = () => { //PauseMusic çağırıldığında playing kaldırılır, play ikonu gözükür.
    container.classList.remove("playing"); 
    play.querySelector("i").classList = "fa-solid fa-play";
    audio.pause();
}
const playMusic = () => { //Playing eklenip silinmesinin nedeni -> Ona göre ikona basıldığında duracak veya çalışacak.
    container.classList.add("playing");
    play.querySelector("i").classList = "fa-solid fa-pause";
    audio.play();
}

const calculateTime = (toplamSaniye) => {
    const minute = Math.floor(toplamSaniye / 60);
    const second = Math.floor(toplamSaniye % 60);
    const guncellenenSaniye = second < 10 ? `0${second}` : `${second}`;
    //Minute second hesaplanır. Saniye 10'dan az ise 09 şeklinde değilse direkt sayı değeri yazsın
    const sonuc = `${minute}: ${guncellenenSaniye}`;
    return sonuc;
}

audio.addEventListener("loadedmetadata", () => { 
    duration.textContent =calculateTime(audio.duration); //calculateTime'a audio.duration gönderiliyor. Ör 191 sn.
    progressBar.max = Math.floor(audio.duration); //ProgressBar'ın max'ına da o süre verilir.
});
//HTML AUDİO EVENTS OLARAK AŞAĞIDAKİLER BULUNABİLİR.  //Timeupdate loadedmetadata birer hazır metodlardır.
audio.addEventListener("timeupdate", () => { //Timeupdate ile her sn güncellendiğinde auodio'nun aşağıdaki kısım çalışacak.
    progressBar.value = Math.floor(audio.currentTime); //currentTime o an hangi saniye ise o aktarılır. Hazır metod.
    CurrentTime.textContent = calculateTime(progressBar.value); //Üstte hesaplanan da currentTime' ın textine atılacak.
});

progressBar.addEventListener("input", () => { //Herhangibir input kontrolünde çalıştırılır.
    CurrentTime.textContent = calculateTime(progressBar.value);
    audio.currentTime = progressBar.value; //Müziğin süre bilgisi. ProgressBar üzerinden alınan değer..
});
//playing gibi pause-play metodları gibi yapabilirdik. Bunda farklı bir yöntem öğreneceğiz.
let sesDurumu ="sesli"; //sesli olduğunda sesi açık olacak. Ve tam tersi kontrol edilecek.

volumeBar.addEventListener("input", (e) => { //Value değeriyle oynanınca değeri göndermek için referansı göndermek gerekir.
    let musicValue = e.target.value; //Ör %68 oranında ses açıldı. 68 /100 0.68
    audio.volume = musicValue / 100; //html audio referanslarında volume bilgisi 0-1 arasındadır. input range 100'e kadar old. için
    //100 sayısı anlamlı olmadığı için 100'e böleriz ve ona göre değerlendirmeyi aktarırırz.
    if(musicValue == 0){
        audio.muted = true;
        sesDurumu = "sessiz";
        volume.classList = "fa-solid fa-volume-xmark";
    }
    else{
        audio.muted = false;
        sesDurumu = "sesli";
        volume.classList = "fa-solid fa-volume-high";
    }
});

volume.addEventListener("click", () => {
    if(sesDurumu === "sesli"){
        audio.muted = true; //Kısılması için, audionun muted metodu..
        sesDurumu = "sessiz";
        volume.classList = "fa-solid fa-volume-xmark";
        volumeBar.value = 0;
    }
    else{
        audio.muted = false;
        sesDurumu = "sesli";
        volume.classList = "fa-solid fa-volume-high";
        volumeBar.value = 100;
        audio.volume = 1;
    }
});

const displayMusicList = (list) => {
    for(let i=0; i< list.length; i++){ //Aşağıdaki her li'nin span-audiosunda i'ler farklı. Her biri farklı bir müziği temsil eder.
        let liTag = `
                    <li li-index="${i}" onclick="selectedMusic(this)" class="list-group-item d-flex justify-content-between align-items-center">
                        <span>${list[i].getName()}</span>
                        <span id="music-${i}" class="badge bg-primary rounded-pill"></span>
                        <audio class="music-${i}" src="mp3/${list[i].file}"></audio>
                    </li>
        `; //music-${i} ile music-0, music-2 gibi bilgiler gelir. Tıklanınca o müziğin gelmesi için.
        ul.insertAdjacentHTML("beforeend", liTag);

        let liAudioDuration = ul.querySelector(`#music-${i}`);
        let liAudioTag = ul.querySelector(`.music-${i}`);

        liAudioTag.addEventListener("loadeddata", () => {
            liAudioDuration.innerText = calculateTime(liAudioTag.duration); //İlgili audio'nun bilgisini liAudioTag'e atıldı. Duration bilgisi alınıp hesaplanıp liAudioDuration text'ine atılır.
        }); //Sn cinsinden duration ile alınıp hesaplanır.
    }
}

const selectedMusic = (li) => {
    player.index = li.getAttribute("li-index"); //Her tanımlanan li için uygulanır. 0,1,2.. şeklinde li-index'lere sahip olurlar.
    //Player'in index no, seçilen index ile set edilir.
    displayMusic(player.getMusic());
    playMusic();
    isPlayingNow();
}

const isPlayingNow = () => {
    for(let li of ul.querySelectorAll("li")){
        if(li.classList.contains("playing")){ //Herhangibir şarkıya basıldığında hangisinde playing varsa hepsinden silinmesi için.
            li.classList.remove("playing");
        }

        if(li.getAttribute("li-index") == player.index){ //playing ekleme için. O an hangi mğzik çalınıyorsa onun index'i player.index'e eşittir.
            li.classList.add("playing");
        }
    }
}

audio.addEventListener("ended", () => { //Ended metodu ile müzik bitince direkt nextMusic uygulanır.
    nextMusic();
})