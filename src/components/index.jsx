import React from 'react';
import {Accordion,AccordionTab} from "primereact/accordion";

import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';


import Artist from "../js/artist.js";
import Board from "../js/board.js";
import settings from "../js/settings.js";


import TextInput      from "./TextInput.jsx";
import TextSeparation from "./TextSeparation.jsx";
import TextRotation   from "./TextRotation.jsx";
import {TextColorPicker,BackgroundColorPicker}       from "./ColorBox.jsx";
import FontBox        from "./FontBox.jsx";
import ImageUpload    from "./ImageUpload.jsx";
import DrawControls   from "./DrawControls.jsx";


import BoardPreview from './BoardPreview.jsx';

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

    this.state = {
      shape:        settings.defaultShape,
      invert:       true,
      text:         "hello",
      words:        [],
      separator:    ",",
      palette:      settings.defaultPalette,
      bg:           {mode:"transparent",color:"#FFFFFF"},
      fonts:        ["Courier","Garamond"],
      // board:        new Board(),
      artist:       new Artist()
      
      // underlay:     underlay.defaultUnderlay
    };

    console.log("new artist",this.state.artist);
  }

  handleUpdateSeed = (seed) => {
    this.setState({seed:seed});
  };

  handleUpdateText = (text) => {
    console.log("handle update text",text);
    this.setState({text: text});
    this.state.artist.text(text);
    // this.calculateWords(text,this.state.separator);

  };

  handleUpdateSeparation = (sep) => {
    this.setState({separator:sep});
    this.state.artist.separator(sep);
    // this.calculateWords(this.state.text,sep);
  };

  handleUpdateRotation = (v) => {
    this.setState({angles:v});
    this.state.artist.board().angles(v);
  };

  handleUpdateFont = (v) => {
    this.setState({fonts:v});
    this.state.artist.board().fonts(v);
  };

  handleSetPalette = (newPalette) => {
    this.setState({palette: newPalette})
    this.state.artist.board().palette(newPalette.colors);
  };

  handleSetBG = (mode, color) => {
    this.setState({bg: {mode:mode,color:color}});
    this.state.artist.board().bg({mode:mode,color:color});
  };

  handleSetShape = (newShape) => {
    console.log("newshape",newShape);
    this.setState({shape: newShape})
  };
  calculateWords(text,sep){
    text = text.trim();
    switch(sep){
    case "commas":
        this.setState({words:text.split(/,+/)})
    break;
    case "spaces":
        this.setState({words:text.split(/\s+/)})
    break;
    case "breaks":
    default:
        this.setState({words:text.split(/\n+/)})
    }
}


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
            board={this.state.artist._board}
          ></BoardPreview>
          <DrawControls
            start={this.state.artist.start.bind(this.state.artist)}
            stop={this.state.artist.stop.bind(this.state.artist)}
            clear={this.state.artist.clear.bind(this.state.artist)}
            reset={this.state.artist.reset.bind(this.state.artist)}
          ></DrawControls>
        </div>
      </div>
    );
  }
}


export default App;


// <ShapeBox 
//   onSetShape={this.handleSetShape}
//   selected={this.state.shape}/>