import React from 'react';
import Text from "../js/Text.js";
import fabric from "../js/fabric.js";
import Sprite from "../js/Sprite.js";


let t = new Text();

class TextPreview extends React.Component {
    componentDidMount() {
        this.update();
    }

    update = () => {
        console.log("update",t,fabric.fromID("textPreviewCanvas"))
        let f = fabric.fromID("textPreviewCanvas");
        f.clear();
        t.draw(f);
        f.renderAll();
        // t.draw(fabric.fromID("textPreviewCanvas"));
        console.log("fab",t,f);



        let spriteFabcan = fabric.fromID("textPreviewSprite");

        new Sprite().fromFabric(f).draw(spriteFabcan);

        // t.toSprite().draw(spriteFabcan);

        
        // t.toSprite()
    };

    onText = (e) => {
        let text = e.target.value;
        console.log("handle text change event",text);
        t.text(text);
        this.update();
    };

    onColor = (e) => {
        let val = e.target.value;
        t.color(val);
        this.update();
    };

    onSize = (e) => {
        let val = e.target.value;
        t.fontSize(val);
        this.update();
    };

    onFont = (e) => {
        t.fontFamily(e.target.value);this.update();
    };

    onAngle = (e) => {
        t.angle(e.target.value);this.update();
    };

    render() {
        return (
        <div className="TextPreview">
                <input type="text" placeholder="your text here" id="textPreviewText" defaultValue="hello world" onInput={this.onText}></input><br/>
                <input type="text" placeholder="color (red,#FF0000,rgba(255,0,0))" id="textPreviewColor" onInput={this.onColor}></input><br/>
                <input type="text" placeholder="size" id="textPreviewSize" onInput={this.onSize}></input><br/>
                <input type="text" placeholder="font" id="textPreviewFont" onInput={this.onFont}></input><br/>
                <input type="text" placeholder="angle" id="textPreviewAngle" onInput={this.onAngle}></input><br/>
                <canvas id="textPreviewCanvas"></canvas>
                <canvas id="textPreviewSprite"></canvas>
        </div>
        );
    }
}

export default TextPreview;