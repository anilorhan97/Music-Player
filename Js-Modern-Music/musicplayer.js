//Oynatıcı vs ileri geri

class MusicPlayer {
    constructor(musicList){ //Dışarıdan göndereceğimiz müzik listesini alacak.
        this.musicList  = musicList; 
        this.index = 0; //Başta 0 olarak gelecek.
    }

    getMusic(){
        return this.musicList[this.index]; //O andaki index numarası neyse ona göre gelecek. İlk başta sıfır dediğimiz için ilk music gelecek.
    } //İlgili müzikListesinin ilgili indexini getMusic ile çağırabiliriz.

    next(){
        if(this.index+1 < this.musicList.length){
            this.index++;
        }
        else{
            this.index = 0;
        }
    } //next prev'e göre o anki musicList'e göre indexleri this ile hareket edecek.
    prev(){
        if(this.index != 0){
            this.index--;
        }
        else{
            this.index = this.musicList.length -1; //Son müziğin index numarasını verir.
        }
    }
}

