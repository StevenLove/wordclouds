import React from 'react';
import {Dropdown} from 'primereact/dropdown';


let nameToDegreeArrays = {
    "flat":[0],
    "cross":[0,90],
    "first":[0,-10,-20,-30,-40,-50,-60,-70,-80,-90],
    "fourth":[0,10,20,30,40,50,60,70,80,90],
    "ltr":[0,-10,-20,-30,-40,-50,-60,-70,-80,-90,10,20,30,40,50,60,70,80,90],
    "any":[0,10,20,30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180,190,200,210,220,230,240,250,260,270,280,290,300,310,320,330,340,350]
}

const options = [
    {label:"Flat",value:"flat"},
    {label:"0 and 90 Degrees",value:"cross"},
    {label:"First Quadrant",value:"first"},
    {label:"Fourth Quadrant",value:"fourth"},
    {label:"Left to Right",value:"ltr"},
    {label:"Any",value:"any"},
]

class TextRotation extends React.Component {
    state = {
        value:"flat"
    };

    componentDidMount() {
        this.handleSetRotationName(this.state.value);
    }
    handleSetRotationName = rotationName => {
        let degreeArray = nameToDegreeArrays[rotationName];
        this.props.handleUpdate(degreeArray)
        this.setState({value: rotationName});


        let valueArray = nameToDegreeArrays[rotationName];
        this.props.handleUpdate(valueArray);
        this.setState({value:rotationName});
    }
    
    handleSelectEvent = (e) => {
        let rotationName = e.target.value;
        this.handleSetRotationName(rotationName);
    };

    render() {
        return (

        <div className="TextRotation">
            <label>
                Text Rotation: &nbsp;
                <Dropdown
                    value={this.state.value}
                    options={options}
                    onChange={this.handleSelectEvent.bind(this)}/>
            </label>
        </div>
        );
    }
}

export default TextRotation;