import React from 'react';
import {Dropdown} from 'primereact/dropdown';
import {ToggleButton} from 'primereact/togglebutton';



class ImageUpload extends React.Component {
  constructor(props){
    super(props);
    
    this.state = {
      filename:"",
      inverted:true
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

  if(option && option.value) {
      const logoPath = 'images/' + option.value;// + '.png';
      return (
          <div className="my-multiselected-item-token">
              <img alt={option.label} src={logoPath} style={{width:'20px', verticalAlign:'middle', marginRight:'.5em'}} />
              {/* <span>{option.label}</span> */}
          </div>
      );
  }
  else {
      return <span className="my-multiselected-empty-token">None</span>
  }
}
onChangeFilename(e){
  this.setState({filename:e.value});
  this.props.onChange({filename:e.value,inverted:this.state.inverted});
}
onChangeInverted(e){
  this.setState({inverted: e.value});
  this.props.onChange({filename:this.state.filename,inverted:e.value});
}

  render() {
    const imgs = [
      {label:"None",value:""},
      {label:"Heart",value:"smallheart.png"},
      {label:"Fish",value:"fish.png"},
      {label:"Cross",value:"cross.png"},
      {label:"Christ",value:"christ.png"},
      {label:"Dove",value:"dove.png"},
      {label:"Hands",value:"hands.png"}
    ]
    let extraOptions = <span></span>
    if(this.state.filename){
      extraOptions = <div>
        <img width="90px" height="120px" src={"./images/"+this.state.filename} alt=""/>
        <br/>
        <ToggleButton checked={this.state.inverted} onLabel="Place Words Inside" offLabel="Place Words Outside" onChange={this.onChangeInverted.bind(this)} />
      </div>
    }
    
    return (
      <div>
        {/* <h3> Choose Shape </h3> */}
        <Dropdown
        value={this.state.filename}
        options={imgs}
        onChange={this.onChangeFilename.bind(this)}
        itemTemplate={this.carTemplate}
        placeholder="Select a Car"/>
        <br/>
        {extraOptions}
      </div>
    );
    
  }
}

export default ImageUpload;