import React from 'react';


import Sizer from "../js/sizer.js";



class SizerElement extends React.Component {
  render() {
    return(
      <div>
        <label>
          <input
            type="radio"
            name="sizer"
            onChange={()=>{
              this.props.onSetSizer({name:this.props.name,f:this.props.f})
            }}
            checked={this.props.name === this.props.selected.name}/>
          {this.props.humanName}
        </label>
      </div>
    );
  }
}

class SizeBox extends React.Component {
  render() {

    var sizerElements = Object.keys(Sizer.list).map((sizerName,index)=>{
      var sizer = Sizer.list[sizerName];


      return <SizerElement key={index} onSetSizer={this.props.onSetSizer} name={sizer.name} humanName={sizer.humanName} f={sizer.f} selected={this.props.selected}/>
    })

    return (
      <div className="SizeBox">
        <h3>Choose A Size</h3>
        <div>
          {sizerElements}
        </div>
      </div>
    );
  }
}




export default SizeBox;