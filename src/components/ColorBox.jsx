import React from 'react';
import settings from "../js/settings.js";
import ColorLibrary from "color";


class BackgroundColorPicker extends React.Component {
  handleColorClick = (e) => {
    var styleString = (e.target.style.backgroundColor);
    var c = new ColorLibrary(styleString);
    var hex = c.hex();
    this.props.onSetBG(this.props.bg.mode, hex);
  };

  render() {
    var colors, preview;
    if(this.props.bg.mode === "transparent"){
      colors = [];
      preview = <Color color="wheat"/>;
    }
    if(this.props.bg.mode === "palette"){
      colors = this.props.paletteColors;
      preview = <Color color={this.props.bg.color}/>
    }
    if(this.props.bg.mode === "all"){
      colors = settings.safeColors;
      preview = <Color color={this.props.bg.color}/>
    }


    return(
      <div>
        <h3>Choose the Background Color</h3>
        <label>
          <input
            type="radio"
            name="bg"
            onChange={()=>{
              this.props.onSetBG("transparent",this.props.bg.color);
            }}
            checked={this.props.bg.mode === "transparent"}/>
          Transparent
         </label>
         <br/>
        <label>
          <input
            type="radio"
            name="bg"
            onChange={()=>{
              this.props.onSetBG("palette",this.props.bg.color);
            }}
            checked={this.props.bg.mode === "palette"}/>
          Palette
         </label>
         <br/>
        <label>
          <input
            type="radio"
            name="bg"
            onChange={()=>{
              this.props.onSetBG("all",this.props.bg.color);
            }}
            checked={this.props.bg.mode === "all"}/>
          All Colors
         </label>
         <br/>
         <ColorStrip 
           handleColorClick={this.handleColorClick}
           colors={colors}/>
         <br/>
         Chosen:  {preview}
      </div>
    );
  }
}

class Color extends React.Component {
  // handleClick:function(e){
  //   var styleString = (e.target.style.backgroundColor);
  //   var c = new ColorLibrary(styleString);
  //   this.props.onSetBG(c.hex());
  // },
  render() {
    return (
      <div
      className="Color"
      style={{"backgroundColor": this.props.color}}
      onClick={this.props.handleClick}>
      </div>
    );
  }
}

class ColorStrip extends React.Component {
  render() {
    var colors = this.props.colors.map((color,index)=>{
      return (
        <Color 
        key={index} 
        handleClick={this.props.handleColorClick}
        color={color}/>
        )
    });
    return (
      <span>
        {colors}
      </span>
    );
  }
}

class Palette extends React.Component {
  render() {
    return(
      <div>
        <label>
          <input
            type="radio"
            name="color"
            onChange={()=>{
              this.props.onSetPalette({name:this.props.name,colors:this.props.colors})
            }}
            checked={this.props.name === this.props.selected.name}/>
          {this.props.name}:&nbsp;
          <ColorStrip colors={this.props.colors}/>
        </label>
      </div>
    );
  }
}

class TextColorPicker extends React.Component{
  render() {

    var paletteObjs = settings.palettes.map((obj,index)=>{
      return (
        <Palette
          key={index}
          name={obj.name}
          colors={obj.colors}
          onSetPalette={this.props.onSetPalette}
          selected={this.props.selected}
          onSetBG={this.props.onSetBG}/>
      );
    })

    return (
      <div className="ColorBox">
        <h3>Choose a Palette</h3>
        <div>
          {paletteObjs}
        </div>
      </div>
    );
  }
}


// class ColorBox extends React.Component {
//   onSetPalette = (palette) => {

//   };

//   render() {

//     var paletteObjs = settings.palettes.map((obj,index)=>{
//       return (
//         <Palette
//           key={index}
//           name={obj.name}
//           colors={obj.colors}
//           onSetPalette={this.props.onSetPalette}
//           selected={this.props.selected}
//           onSetBG={this.props.onSetBG}/>
//       );
//     })

//     return (
//       <div className="ColorBox">
//         {/* <ColorDropdown/> */}
//         <h3>Choose a Palette</h3>
//         <div>
//           {paletteObjs}
//         </div>
//         <BackgroundPicker
//           onSetBG={this.props.onSetBG}
//           paletteColors={this.props.selected.colors}
//           bg={this.props.bg}/>
//       </div>
//     );
//   }
// }




export {TextColorPicker,BackgroundColorPicker};