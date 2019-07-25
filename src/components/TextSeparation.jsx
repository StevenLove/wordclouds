import React from 'react';
import utils from "../js/utils.js";

let numRenders = 0;

class TextSeparation extends React.Component {
    state = {
        value:"breaks"
    };

    componentDidMount() {
        this.props.handleUpdate(this.state.value);
    }

    handleChange = (e) => {
        let sep = e.target.value;
        this.props.handleUpdate(sep)
        this.setState({value: sep});
    };

    render() {
        ++numRenders;
        return (

        <div className="TextSeparation">
            <label>
                Separate text by &nbsp; 
                <select value={this.state.value} onChange={this.handleChange}>
                    <option value="breaks">Line Breaks</option>
                    <option value="spaces">Spaces</option>
                    <option value="commas">Commas</option>
                </select>
            </label>
            {/* <div>
                Renders:{numRenders}
            </div> */}
        </div>
        );
    }
}

export default TextSeparation;