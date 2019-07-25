import React from 'react';
import $ from "jquery";
// import {Button,UncontrolledCollapse, ListGroup, ListGroupItem } from "reactstrap";
// import 'bootstrap/dist/css/bootstrap.min.css';
import {Accordion,AccordionTab} from "primereact/accordion";
import {Listbox} from "primereact/listbox";

import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

// import './node_modules/bootstrap/dist/css/bootstrap.css';


import TextInput      from "./TextInput.jsx";
import TextSeparation from "./TextSeparation.jsx";
import TextRotation   from "./TextRotation.jsx";
import {TextColorPicker,BackgroundColorPicker}       from "./ColorBox.jsx";
import FontBox        from "./FontBox.jsx";
import ImageUpload    from "./ImageUpload.jsx";

import utils          from "../js/utils.js";
import settings       from "../js/settings.js";
// import underlay       from "./js/underlay.js";

// let compressedoperations = require("./js/compressedoperations.js");
// import compressedoperations from "./js/compressedoperations.js";
// console.log({compressedoperations})
// import fabricUtils from "./js/fabricutils";
// import canvasUtils from "./js/canvasutils";
// import visualTests from "./js/visualTests.js";
import BoardPreview from './BoardPreview.jsx';
// console.log(visualTests,"t");

// console.log({visualTests});

var url;
if(process.env.NODE_ENV == "production"){
  url =  "http://gpwclark.net:8289/sample";
}
else{ // default: development
  url = "http://localhost:8289/sample";
}

//shape:{
// type: none, preset, user
// if none: nothing
// if preset: filename
// if user: file
// if preset or user: inversion / proper color and tolerance
// }

//underlay:{
// type: none, shape, image
// if none: nothing
// if shape, then foreground and background colors
// if image, then the file
// }



class App extends React.Component {
  constructor(props) {
    super(props);
    var protoPhrases = [];

    this.state = {
      protoPhrases: settings.defaultProtoPhrases,
      shape: settings.defaultShape,
      invert: true,
      palette:      settings.defaultPalette,
      bg:           {mode:"transparent",color:"#FFFFFF"},
      fonts:        ["Courier","Garamond"],
      sizer:        settings.defaultSizer,
      // underlay:     underlay.defaultUnderlay
    };
  }

  handleCreatePhrase = (id, text) => {
    var protos = this.state.protoPhrases;
    // don't do anything if it already exists
    if(utils.containsByKey(protos,"id",id)){
      console.log("already contains id " + id + " text: " + text);
      return
    }
    var len = protos.length;
    var newProto = {id: id, index: len, text: text};
    var newProtos = protos.concat([newProto]);
        console.log(id,text);

console.log(newProto);
console.log(newProtos);

    this.setState({protoPhrases: newProtos});
  };

  handleCreatePhrases = (idsAndTexts) => {
    var protos = this.state.protoPhrases;
    var indexBase = protos.length;

    if(idsAndTexts && idsAndTexts.length > 0){

      var protosToAdd = idsAndTexts.map((obj,indexOffset)=>{
        return {id:obj.id, index:indexBase+indexOffset, text:obj.text};
      });

      var updatedProtos = protos.concat(protosToAdd);
      this.setState({protoPhrases: updatedProtos});

    }
  };

  handleUpdateSeed = (seed) => {
    this.setState({seed:seed});
  };

  handleUpdateText = (text) => {
    console.log("handle update text",text);
    this.setState({text: text});
  };

  handleUpdateSeparation = (sep) => {
    this.setState({separator:sep});
  };

  handleUpdateRotation = (v) => {
    this.setState({angles:v});
  };

  handleUpdateFont = (v) => {
    this.setState({fonts:v});
  };

  handleRemovePhrase = (id) => {
    var protos = this.state.protoPhrases;
    // don't do anything it it doesn't exist
    if(!utils.containsByKey(protos,"id",id)){
      return;
    }

    var index = utils.safeIndexByKey(protos,"id",id);
    protos.splice(index,1);
    // reset all indices
    protos.forEach((proto,index)=>{
      proto.index = index;
    });
    this.setState({protoPhrases: protos});
  };

  handleClearPhrases = () => {
    this.setState({protoPhrases:[]});
  };

  handleSetPalette = (newPalette) => {
    this.setState({palette: newPalette})
  };

  handleSetBG = (mode, color) => {
    this.setState({bg: {mode:mode,color:color}});
  };

  handleSetSizer = (newSizer) => {
    this.setState({sizer: newSizer});
  };

  handleToggleFont = (fontName) => {
    var newFontNames = this.state.fontNames.slice(0);

    if(this.state.fontNames.includes(fontName)){
      // Don't try to turn off the last font
      if(this.state.fontNames.length === 1){
        return;
      }
      var index = newFontNames.indexOf(fontName);
      newFontNames.splice(index,1);
    }
    else{
      newFontNames.push(fontName);
    }
    this.setState({fontNames:newFontNames})

  };

  handleSetShape = (newShape) => {
    console.log("newshape",newShape);
    this.setState({shape: newShape})
  };

  handleSetSprite = (newSprite) => {
    this.setState({sprite: newSprite});
  };


  readURL = (e) => {
    console.log(e.nativeEvent);
    if (this.files && this.files[0]) {
      var reader = new FileReader();
      $(reader).load(
        function(e) {
          $('#blah').attr('src', e.target.result); 
        }
      );
      reader.readAsDataURL(this.files[0]);
    }
  };

  handleImageUpload = (file) => {
    this.setState({file:file})
  };

  handleToggleInvert = () => {
    var inverted = this.state.invert;
    var newVal = !inverted;
    this.setState({invert:newVal});
    console.log("inverted state is now " + newVal); 
  };

  render() {  
    return (
      <div id="container">
        <div id="controls">
          <Accordion>
            <AccordionTab header="Text Input">
                <TextInput handleUpdate={this.handleUpdateText}></TextInput>
                <TextSeparation handleUpdate={this.handleUpdateSeparation}></TextSeparation>
            </AccordionTab>
            <AccordionTab header="Font">
              <FontBox handleUpdate={this.handleUpdateFont} initial={this.state.fonts}></FontBox>
            </AccordionTab>
            <AccordionTab header="Rotation">
              <TextRotation handleUpdate={this.handleUpdateRotation}></TextRotation>
            </AccordionTab>
            <AccordionTab header="Text Color">
              <TextColorPicker
                onSetPalette={this.handleSetPalette}
                selected={this.state.palette}
                onSetBG={this.handleSetBG}
                bg={this.state.bg}/>
            </AccordionTab>
            <AccordionTab header="Background Color">
              <BackgroundColorPicker
                paletteColors={this.state.palette.colors}
                onSetBG={this.handleSetBG}
                bg={this.state.bg}/>
            </AccordionTab>
            <AccordionTab header="Cloud Shape">
              <ImageUpload 
              shape = {this.state.shape}
              onChange = {this.handleSetShape}

              
              // handleImageUpload={this.handleImageUpload}
              // invert={this.state.invert}
              // handleToggleInvert={this.handleToggleInvert}
              />
              <img src={"./images/"+this.state.shape}/>
            </AccordionTab>
          </Accordion>

          {/* <ImageUpload 
            shape = {this.state.shape}
            handleSetShape = {this.handleSetShape}
            handleImageUpload={this.handleImageUpload}
            invert={this.state.invert}
            handleToggleInvert={this.handleToggleInvert}/> */}

          {/* <Submitter 
            phrases={phrases}
            bg={this.state.bg}
            invert={this.state.invert}
            shape={this.state.shape}
            underlay={this.state.underlay}/> */}
        </div>
        <div id="preview">
          <BoardPreview
            seed={this.state.seed}
            text={this.state.text}
            separator={this.state.separator}
            palette={this.state.palette}
            angles={this.state.angles}
            fonts={this.state.fonts}
            bg={this.state.bg}
            shape={this.state.shape}
          ></BoardPreview>

        </div>
      </div>
    );
  }
}


export default App;


// <ShapeBox 
//   onSetShape={this.handleSetShape}
//   selected={this.state.shape}/>