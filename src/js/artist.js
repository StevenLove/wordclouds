/* The artist makes the decisions about drawing on the board
it determines the initial size of text to be drawn and generates the next word to be drawn on the board */

import utils from "./utils.js";
import Text from "./Text.js";
import Board from "./board.js";
// import WordCloud from "wordcloud";

const MAX_WORD_SIZE = 144;
const MIN_WORD_SIZE = 10;

/* Private variables */
let curWordSize = MAX_WORD_SIZE;



function Artist(){
    /* Private variables that have public accessors */
    this._id = Math.random();
    this._text = "";
    this._separator = "breaks";
    this._words = [];
    this._wordIndex = 0;
    this._autoRedraw = false;
    this._board = new Board();
    this._serializer = new utils.Serializer();
}
Artist.prototype.text = function(t){this._text = t; this._words = calculateWords(this._text,this._separator);}
Artist.prototype.separator = function(s){this._separator = s; this._words = calculateWords(this._text,this._separator);}
Artist.prototype.board = function(b){
    if(b===undefined)return this._board;
    this._board = b;
}
Artist.prototype.words = function(){return this._words};
Artist.prototype.clear = function(){ return this.board().clear();}
Artist.prototype.start = function(){
    curWordSize = MAX_WORD_SIZE;
    this.placeEachWord().then(this.start.bind(this));
    
    // let wordlist = this.words().map((word,index)=>[word,30-Math.round(index/10)]);
    // WordCloud(document.querySelector("#boardPreviewCanvas"),{
    //     list:wordlist,
    //     // gridSize:1
    // });
}
Artist.prototype.stop = function(){
    this._serializer.clear();
}
Artist.prototype.reset = function(){
    this.stop();
    this.clear();
    curWordSize = MAX_WORD_SIZE;
    this._wordIndex = 0;
}
Artist.prototype.placeEachWord = function(){
    return new Promise((res,rej)=>{
        if(curWordSize >= MIN_WORD_SIZE){
            this._words.forEach(word=>{
                this._serializer.add(()=>{
                    let promise;
                    if(curWordSize >= MIN_WORD_SIZE){
                        let t = new Text().text(word).fontSize(curWordSize);
                        promise = this.board().tryToPlace(t); // try to place the word
                        promise.catch(()=>{ // if we couldn't place the word anywhere
                            shrinkFutureWords() // shrink subsequent words down a bit
                        })
                    }
                    else{
                        promise = Promise.reject(); // not even going to try
                    }
                    return promise;
                })
            })
            this._serializer.on(res);
        }
        else{
            this.stop();
            rej();
        }
    })
    

}

function shrinkFutureWords(){
    curWordSize = 2/3 * curWordSize;
    if(curWordSize < MIN_WORD_SIZE) curWordSize = MIN_WORD_SIZE;
}

function calculateWords(text,sep){
    text = text || "";
    text = text.trim();
    switch(sep){
    case "commas":
        return text.split(/,+/);
    break;
    case "spaces":
        return text.split(/\s+/);
    break;
    case "breaks":
    default:
        return text.split(/\n+/);
    }
}

export default Artist;