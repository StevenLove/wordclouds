import React from 'react';
import Text from "../js/Text.js";
import Board from "../js/board.js";
import utils from "../js/utils.js";
import fabric from "../js/fabric.js";
// import {InputSwitch} from 'primereact/inputswitch';
import {ToggleButton} from 'primereact/togglebutton';

import {Button} from 'primereact/button';

const MAX_WORD_SIZE = 144;



class BoardPreview extends React.PureComponent {

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



    componentDidMount() {
        let f = fabric.fromID("boardPreviewCanvas");
        this.props.board.fabcan(f);
    }

    // toggleAutoRedraw = () => {
    //     this.setState({autoRedraw:!this.state.autoRedraw})
    //     if(this.state.autoRedraw){
    //         this.startUpdating();
    //     }
    //     else{
    //         this.stopUpdating();
    //     }
    // };

    

    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }

    render() {
        

        return (
        <div className="BoardPreview">
            <canvas width="300" height="400" id="boardPreviewCanvas"></canvas>
            <canvas width="300" height="400" id="boardPreviewSprite"></canvas>
        </div>
        );
        
    }
}

export default BoardPreview;