import React from 'react';
import BoardPreview from "../components/BoardPreview";
import {ToggleButton} from 'primereact/togglebutton';

import {Button} from 'primereact/button';


class DrawControls extends React.Component {
    state = {
       autoRedraw:false
    };


    render() {
        return (
        <div className="DrawControls">
            {/* <ToggleButton checked={this.state.autoRedraw} 
            onLabel={"Automatic Redraw On"}
            offLabel={"Automatic Redraw Off"}
            onChange={(e) => {
                this.setState({autoRedraw: e.value});
                if(e.value){
                    this.startUpdating();
                }
                else{
                    this.stopUpdating();
                }
            }} />
            <br></br> */}
            <Button label="Clear" onClick={this.props.clear} />
            <Button label="Start" onClick={this.props.start} />
            <Button label="Stop" onClick={this.props.stop} />
            <Button label="Reset" onClick={this.props.reset} />
        </div>
        );
    }
}

export default DrawControls;