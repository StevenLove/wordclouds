import React from 'react';
import settings from "../js/settings.js";


class Shape extends React.Component {
  render() {
    return (
      <div className="Shape">
        <label>
          <input
            type="radio"
            name="shape"
            onChange={()=>{
              this.props.onSetShape({name:this.props.name})
            }}
            checked={this.props.name === this.props.selected.name}/>
          <img src={require(this.props.url)} />
        </label>
      </div>
    );
  }
}

class ShapeBox extends React.Component {
  render() {

    var shapeObjs = settings.shapes.map((shapeObj,index)=>{
      return <Shape
      name={shapeObj.name}
      url={shapeObj.url}
      key={index}
      selected={this.props.selected}
      onSetShape={this.props.onSetShape}/>
    });


    return (
      <div className="ShapeBox">
        {shapeObjs}
      </div>
    );
  }
}


export default ShapeBox;