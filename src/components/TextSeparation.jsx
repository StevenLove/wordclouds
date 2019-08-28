import React from 'react';
import {Dropdown} from 'primereact/dropdown';

let numRenders = 0;
const options = [
    {label:"Line Breaks",value:"breaks"},
    {label:"Spaces",value:"spaces"},
    {label:"Commas",value:"commas"}
]

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
                <Dropdown
                    value={this.state.value}
                    options={options}
                    onChange={this.handleChange.bind(this)}/>
            </label>
        </div>
        );
    }
}

export default TextSeparation;