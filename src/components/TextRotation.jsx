import React from 'react';

let numRenders = 0;
let nameToDegreeArrays = {
    "flat":[0],
    "cross":[0,90],
    "first":[0,-10,-20,-30,-40,-50,-60,-70,-80,-90],
    "fourth":[0,10,20,30,40,50,60,70,80,90],
    "ltr":[0,-10,-20,-30,-40,-50,-60,-70,-80,-90,10,20,30,40,50,60,70,80,90],
    "any":[0,10,20,30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180,190,200,210,220,230,240,250,260,270,280,290,300,310,320,330,340,350]
}

class TextRotation extends React.Component {
    state = {
        value:"breaks"
    };

    componentDidMount() {
        this.props.handleUpdate(this.state.value);
    }

    handleChange = (e) => {
        let val = e.target.value;
        this.props.handleUpdate(nameToDegreeArrays[val]);
        this.setState({value: val});
    };

    render() {
        ++numRenders;
        return (

        <div className="TextRotation">
            <label>
                Text Rotation: &nbsp; 
                <select value={this.state.value} onChange={this.handleChange}>
                    <option value="flat">Flat</option>
                    <option value="cross">0 and 90 degrees</option>
                    <option value="first">First Quadrant</option>
                    <option value="fourth">Fourth Quadrant</option>
                    <option value="ltr">Left to Right</option>
                    <option value="any">Any</option>
                </select>
            </label>
            {/* <div>
                Renders:{numRenders}
            </div> */}
        </div>
        );
    }
}

export default TextRotation;