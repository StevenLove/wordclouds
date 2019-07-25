import React from 'react';
// import Dropzone from "react-dropzone";
import utils from "../js/utils.js";
import {Listbox} from "primereact/listbox";
import {InputText} from 'primereact/inputtext';
import {Dropdown} from 'primereact/dropdown';




// class UserShape extends React.Component {
//   render() {
//       if(this.props.type !== "user") return (<div></div>);

//       return (
//             <Dropzone onDrop={this.props.onDrop} multiple={false} accept={"image/*"}>
//               <div>Click here or drag & drop a file to upload it</div>
//             </Dropzone>
           
//       );
//     }
// }

class PresetShape extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      selected:"smallheart.png"
    }
  }
  carTemplate(option) {
      const logoPath = 'images/' + option.label + '.png';

      return (
          <div className="p-clearfix">
              <img alt={option.label} src={logoPath} style={{display:'inline-block',margin:'5px 0 0 5px'}} />
              <span style={{fontSize:'1em',float:'right',margin:'1em .5em 0 0'}}>{option.label}</span>
          </div>
      );
  }
  render() {
      // if(this.props.type !== "preset") return (<div></div>);

      const imgs = [
        {name:"Heart",filename:"smallheart.png"},
        {name:"Fish",filename:"fish.png"}
      ]

      // var imgNames = ["Heart","Fish","Cross","Christ","Dove","Hands"];
      // var imgFileNames = ["smallheart.png","fish.png","cross.png","christ.png","dove.png","hands.png"];
      // var imgElements = imgFileNames.map(function(name,index){
      //   return(
      //     <div>
      //       {imgs[index]}
      //       <img className="presetImage" src= {"./images/" + name} />
      //     </div>
      //   )
      // })
      // var Radios = utils.makeReactRadios("preset",imgFileNames,imgElements)

      return (
        <div>
          <Listbox value={this.state.selected} options={imgs} onChange={(e) => this.setState({selected: e.filename})}/>
        </div>
      );
    }
}

class Inversion extends React.Component {
  render() {
    if(this.props.type === "none") return (<div></div>);
    return(
      <div>
        <h4> Where to place words </h4>
        <label>
          <input
            type="radio"
            name="invert"
            onChange={()=>{
              if(!this.props.invert){
                this.props.handleToggleInvert();
              }
            }}
            checked={this.props.invert}/>
          Place Words in black areas
        </label>
        <br/>
        <label>
          <input
            type="radio"
            name="invert"
            onChange={()=>{
              if(this.props.invert){
                this.props.handleToggleInvert();
              }
            }}
            checked={!this.props.invert}/>
          Place Words in clear/white areas
        </label>
      </div>
    );
  }
}

class ImageUpload extends React.Component {
  constructor(props){
    super(props);
    
    this.state = {
      selected:"smallheart.png",
      city: null,
      cities: null,
      car: 'BMW'
    }
  }
  onDrop = (files) => {
    var newShape = this.props.shape;
    newShape.file = files[0];
    // set dimensions
    this.props.handleSetShape(newShape);
  };

  // remove this probably
  handleSetShape = (shape) => {
    this.props.handleSetShape(shape);
  };

  handleSetType = (type) => {
    var newShape = this.props.shape;
    newShape.type = type;
    this.props.handleSetShape(newShape);
  };

  handleSetSize = (size) => {
    var newShape = this.props.shape;
    newShape.size = size;
    this.props.handleSetShape(newShape);
  };

  handleSetPresetName = (presetName) => {
    var newShape = this.props.shape;
    newShape.presetName = presetName;
    this.props.handleSetShape(newShape);
  };
  carTemplate(option) {
    if (!option.value) {
        return option.label;
    }
    else {
        const logoPath = 'images/' + option.value;// + '.png';

        return (
            <div className="p-clearfix">
                <img alt={option.label} src={logoPath} style={{display:'inline-block',margin:'5px 0 0 5px'}} width="24"/>
                <span style={{float:'right', margin:'.5em .25em 0 0'}}>{option.label}</span>
            </div>
        );
    }
}
selectedCarTemplate(option) {

  if(option) {
      const logoPath = 'images/' + option.value;// + '.png';
      return (
          <div className="my-multiselected-item-token">
              <img alt={option.label} src={logoPath} style={{width:'20px', verticalAlign:'middle', marginRight:'.5em'}} />
              {/* <span>{option.label}</span> */}
          </div>
      );
  }
  else {
      return <span className="my-multiselected-empty-token">Choose</span>
  }
}
onChange(e){
  this.setState({selected:e.value});
  this.props.onChange(e.value);
  console.log("image set to ",e);
}

  render() {
    const imgs = [
      {label:"Heart",value:"smallheart.png"},
      {label:"Fish",value:"fish.png"}
    ]
    
    return (
      <div>
        <h3> Choose Shape </h3>
        <Dropdown
        value={this.state.selected}
        options={imgs}
        onChange={this.onChange.bind(this)}
        itemTemplate={this.carTemplate}
        placeholder="Select a Car"/>
      </div>
    );
  }
}

export default ImageUpload;