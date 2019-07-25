import React from 'react';


class Toggler extends React.Component {
    state = {
        active:this.props.initial,
    };

    getString = () => {
        return this.state.active?"On":"Off";
    };

    handleToggle = () => {
      this.setState({active:!this.state.active});
      this.props.onChange(this.state.active);
    };

    render() {

      return (
          <button 
              className={"toggler toggler-"+(this.state.active?"on":"off")}
              onClick={this.handleToggle}
          >{this.getString()}</button>
        
      );
    }
}




export default Toggler;