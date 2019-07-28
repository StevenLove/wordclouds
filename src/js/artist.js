/* The artist makes the decisions about drawing on the board
it determines the initial size of text to be drawn and generates the next word to be drawn on the board */

let utils = require("./utils.js");
let Text = require("./Text.js");
let Board = require("./board.js");

const MAX_WORD_SIZE = 144;

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
    console.log("board accessing",this,b,this._board);
    return this._board;
    // this._board = b;
}
Artist.prototype.words = function(){return this._words};
Artist.prototype.clear = function(){ return this.board().clear();}
Artist.prototype.start = function(){
    this.placeEachWord();
    this._serializer.on(this.placeEachWord.bind(this));
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
    if(curWordSize >= 10){
        this._words.forEach(word=>{
            this._serializer.add(()=>{
                let promise;
                if(curWordSize >= 10){
                    let t = new Text().text(word).fontSize(curWordSize);
                    promise = this.board().tryToPlace(t); // try to place the word
                    promise.catch(()=>{ // if we couldn't place the word anywhere
                        curWordSize *= 2/3; // shrink subsequent words down a bit
                    })
                }
                else{
                    promise = Promise.reject(); // not even going to try
                }
                return promise;
            })
        })
    }
    else{
        this.stop();
    }
}







// stopUpdating(){
//     this.state.serializer.clear();
//     this.setState({allowNextWordPlacement:false})
// }
// placeNextWord(){
//     let word = this.state.words[this.state.wordIndex];
//     console.log("placing",word);
//     let t = new Text().text(word).fontSize(this.state.curWordSize);
//     let p = this.state.board.tryToPlace(t);
//     p.finally(()=>{
//         this.setState({wordIndex:this.state.wordIndex+1})
//         if(this.state.wordIndex >= this.state.words.length){
//             this.setState({wordIndex:0});
//         }
//     })
//     return p;
// }
// placeEachWord(){
//     if(this.state.curWordSize < 10) return;
//     this.state.words.slice(1).forEach(word=>{
//         this.state.serializer.add(()=>{
//             if(this.state.curWordSize < 10) return Promise.reject();
//             let t = new Text().text(word).fontSize(this.state.curWordSize);
//             let p = this.state.board.tryToPlace(t);
//             p.catch(()=>{
//                 this.setState({curWordSize:this.state.curWordSize*2/3})
//             })
//             return p;
//         })
//     })
// }
// continueUpdating(){
//     if(this.state.curWordSize >= 10 && this.state.allowNextWordPlacement){
//         this.placeNextWord().catch(()=>{this.setState({curWordSize:this.state.curWordSize*2/3})}).finally(this.continueUpdating.bind(this));
//     }
// }
// startUpdating(){
//     this.setState({allowNextWordPlacement:true})
//     this.placeFirstWord().then(this.continueUpdating.bind(this))
// }
// placeFirstWord(){
//     return new Promise((res,rej)=>{
//         let t = new Text().text(this.state.words[0]).fontSize(this.state.curWordSize);
//         console.log("first word",t);
//         this.state.board.tryToPlace(t).then(res).catch(()=>{
//             this.setState({curWordSize:Math.floor(this.state.curWordSize*4/5)})
//             if(this.state.curWordSize > 10){
//                 res(this.placeFirstWord()); // try again!
//             }
//             else{
//                 rej("couldn't place first word");
//             }
//         })
//     })
// }

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

module.exports = Artist;
