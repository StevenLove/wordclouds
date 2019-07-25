import React from 'react';

// import fabricModule from "fabric";
// var fabric = fabricModule.fabric;

// 'http://localhost:8289/multi',


class ToggleShowShape extends React.Component {
  render() {
    return(
      <label>
        <input
          type="checkbox"
          name="toggleShowShape"
          onChange={()=>{
            var newVisibility = !this.props.visibility;
            this.props.setShapeVisibility(newVisibility);
          }}
          checked={this.props.visibility}/>
        Show Shape
      </label>
    )
  }
}

class Submitter extends React.Component {
  state = {
    dataURL: "",
    shapeVisibility: true
  };

  sendMultipart = (url, jsobject, file) => {
    var formData = new FormData();
    // load up the formdata
    Object.keys(jsobject).forEach(function(key){
      formData.append(key,JSON.stringify(jsobject[key]));
    })
    // formData.append("sampleName","sampleVal");
    // formData.append("name2","val2");
    formData.append("userfile",file);
   
    $.ajax({
      url: url,
      type: 'POST',
      data: formData,
      async: true, //was originally false
      cache: false,
      contentType: false,
      processData: false,
      success: function (returndata) {
        console.log("success sending multipart");
        this.setState({dataURL:returndata});
      }.bind(this),
      error: function(xhr, status, err){
        console.log("error sending multipart");
        console.log("status " + status);
      }.bind(this)
    });
  };

  setShapeVisibility = (visible) => {
    this.setState({shapeVisibility:visible});
  };

  onSubmit = () => {

    var sendThis = {
      phrases: this.props.phrases,
      shape: this.props.shape,
      invert: this.props.invert,
      bg: this.props.bg,
      underlay: this.props.underlay
    }


    var url;
    var env = process.env.NODE_ENV;
    if(env=="production"){
      url = "http://gpwclark.net:8289/multi"
    }
    else if(env=="development"){
      url = "http://localhost:8289/multi";
    }

    var fileToSend;
    if(this.props.shape.type === "user"){
      fileToSend = this.props.shape.file;
    }
    else{
      fileToSend = {};
    }
    

    this.sendMultipart(url,sendThis,fileToSend);
  };

  render() {
    return (
      <div>
        <button onClick={this.onSubmit}> Submit </button>

        <div className="resultBox">
          {(this.state.shapeVisibility && this.props.shape.type !== "none")? <img className="imageShape" src={this.props.shape.file.preview} /> : null}
          <img className="imageResult" src={this.state.dataURL} />
        </div>

        <ToggleShowShape visibility={this.state.shapeVisibility} setShapeVisibility={this.setShapeVisibility} />
      </div>
    );
  }
}

export default Submitter;