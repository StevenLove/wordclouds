import React from 'react';

let numRenders = 0;

class SeedInput extends React.Component {
    state = {
        value:Math.random()
    };

    componentDidMount() {
        this.props.handleUpdate(this.state.value);
    }

    handleChange = (e) => {
        let v = e.target.value;
        this.props.handleUpdate(v)
        this.setState({value: v});
    };

    render() {
        ++numRenders;
        return (

        <div className="TextSeparation">
            <label>
                Seed:<input type="text" onChange={this.handleChange} value={this.state.value}></input>
            </label>
            <div>
                Renders:{numRenders}
            </div>
        </div>
        );
    }
}

export default SeedInput;