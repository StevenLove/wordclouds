import React from 'react';
import Text from "../js/Text.js";
import Board from "../js/board.js";
import utils from "../js/utils.js";
import fabric from "../js/fabric.js";
import Toggler from "../components/Toggler.jsx";

// let board = new Board();
// let words;
// let curSize = 72;
// let serializer;
// let numRenders = 0;

// function stopPreviousUpdates(){
//     return new Promise((res,rej)=>{
//         if(serializer){ // previous updates are ongoing
//             serializer.stop(); // dont call any more functions
//             serializer = undefined;
//             setTimeout(res,200); // say we're done in a bit (200ms)
//         }
//         else{
//             res(); // no previous updates to stop, resolve
//         }
//     });
// }

// const update = (()=>{

//     if(!words || words.length < 1){
//         board.clear();
//         return;
//     }
//     let timer = new utils.Timer().delay(200).then(update);

//     function placeFirstWord(){
//         return new Promise((res,rej)=>{
//             let t = new Text().text(words[0]).fontSize(curSize);
//             console.log("first word",t);
//             board.tryToPlace(t).then(res).catch(()=>{
//                 curSize = Math.floor(curSize* 4/5);
//                 console.log("reduced size to ",curSize);
//                 if(curSize > 10){
//                     res(placeFirstWord());
//                 }
//                 else{
//                     rej("couldn't place first word");
//                 }
//             })
//         })
        
//     }
//     function update(){ 
//         stopPreviousUpdates().then(()=>{
//             board.clear();
//             serializer = new utils.Serializer();
//             serializer.on(continueProcessingIndef)
//             curSize = 128;

//             // size the first word
//             placeFirstWord().then(continueProcessingIndef);

        
//             function continueProcessingIndef(){
//                 if(curSize > 1000){
//                     words.slice(1).forEach(word=>{
//                         serializer.add(() => {
//                             let t = new Text().text(word).fontSize(curSize);
//                             let p = board.tryToPlace(t);
//                             p.catch(()=>{
//                                 curSize *= 2/3;
//                                 // board.tryToPlace(t);
//                             });
//                             return p;
//                         });
//                     })
                    
//                 }
//                 else{
//                     let spriteFabcan = fabric.fromID("boardPreviewSprite");
//                     board.toSprite().draw(spriteFabcan);
//                 }
//             }
//             // continueProcessingIndef();
//         })
//     }
//     return ()=>{
//         timer.reset();
//     }
// })()



class BoardPreview extends React.Component {
    state = {
        autoRedraw:false,
        board: new Board(),
        words: ["yo"],
        serializer: new utils.Serializer(),
        timer: new utils.Timer(),
        curWordSize: 144
    };

    stopUpdating(){
        this.state.serializer.clear();
    }
    startUpdating(){
        this.placeFirstWord();
    }
    placeFirstWord(){
        return new Promise((res,rej)=>{
            let t = new Text().text(this.state.words[0]).fontSize(this.state.curWordSize);
            console.log("first word",t);
            this.state.board.tryToPlace(t).then(res).catch(()=>{
                this.state.curWordSize = Math.floor(this.state.curWordSize * 4/5);
                if(this.state.curWordSize > 10){
                    res(this.placeFirstWord()); // try again!
                }
                else{
                    rej("couldn't place first word");
                }
            })
        })
        
    }


    componentDidMount() {
        let f = fabric.fromID("boardPreviewCanvas");
        this.state.board.fabcan(f);
        this.state.board.fonts(this.props.fonts);
        this.state.board.seed(this.props.seed);
        this.state.board.palette(this.props.palette);
        this.state.board.angles(this.props.angles);
        this.state.board.bg(this.props.bg);
        console.log("board preview did mount bg",this.props.bg);
    }

    toggleAutoRedraw = () => {
        this.state.autoRedraw = !this.state.autoRedraw;
        if(this.state.autoRedraw){
            this.startUpdating();
        }
        else{
            this.stopUpdating();
        }
    };

    shouldComponentUpdate(nextProps, nextState) {
        let changed = {};
        ["palette",
        "text",
        "shape",
        "angles",
        "fonts",
        "separator",
        "bg",
        "seed"].forEach(prop=>{
            if(this.state[prop] != nextState[prop])changed[prop] = true;
            if(this.props[prop] != nextProps[prop])changed[prop] = true;
        })
        if(changed.seed){
            this.state.board.seed(nextProps.seed);
            return true;
        }
        if(changed.text || changed.separator){
            return true;
        }
        else if(changed.angles){
            this.state.board.angles(nextProps.angles);
            return true;
        }
        else if(changed.fonts){
            this.state.board.fonts(nextProps.fonts);
            return true;
        }
        else if(changed.palette){
            this.state.board.palette(nextProps.palette.colors);
            // board.setColors(nextProps.palette.colors);
            console.log("palette changed",nextProps.palette);
        }
        else if(changed.bg){
            this.state.board.bg(nextProps.bg);
            console.log("updating bg",nextProps.bg);
        }
        else if(changed.shape){
            this.state.board.shape(nextProps.shape);
            return true;
        }
        return false;
    }

    render() {
        console.log("rendering preview");
        let text = this.props.text;
        /* Don't draw anything if there is no text  */
        if(!text){
            this.state.board.clear();
        }
        else{
            /* determine the words from the text and separator */
            text = text.trim();
            switch(this.props.separator){
            case "commas":
                this.state.words = text.split(/\,+/);
            break;
            case "spaces":
                this.state.words = text.split(/\s+/);
            break;
            case "breaks":
            default:
                this.state.words = text.split(/\n+/);
            }
            /* start placing words on the board */
            if(this.state.autoRedraw){
                this.startUpdating();
            }
        }
        return (
        <div className="BoardPreview">
            <canvas width="300" height="400" id="boardPreviewCanvas"></canvas>
            <canvas width="300" height="400" id="boardPreviewSprite"></canvas>
            <br/>
            Automatic Redraw: <Toggler onChange={this.toggleAutoRedraw} initial={this.state.autoRedraw}></Toggler>
        </div>
        );
    }
}

export default BoardPreview;