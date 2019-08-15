import React from 'react';
import {MultiSelect} from 'primereact/multiselect'
const DEFAULT_FONTS = ["Garamond", "Courier", "Bookman", "Arial", "Impact"];

class FontDropdown extends React.Component {
    // getInitialState :: a -> UIState
    state = {
        all:DEFAULT_FONTS.map(name=>{return{label:name,value:name}}),
        // all:this.props.options,
        // selected:   DEFAULT_SELECTED_FONTS  .map(name=>{return{label:name,value:name}})
        selected: this.props.selected
    };

    // render :: a -> ReactElement
    render() {
        let self = this;
  
        return <MultiSelect
            options = {this.state.all}
            value = {this.state.selected}
            onChange = {function(event){
                let val = event.value;
                console.log("SELECTIZE FONT CHANGED",val);
                self.setState({
                  selected: val
                });
                self.props.handleChange(val);
            }}
            /* How to render an option in the dropdown list */
            itemTemplate = {function(option){
                return (
                    <div className="simple-option">
                        <span style={{fontFamily:option.value}}>{option.label}</span>
                    </div>
                );
            }}
            /* How to render an item that has been selected
                For some reason the argument is not a {label:blah,value:blah} but just "blah" */
            selectedItemTemplate = {function(fontName){
                if (fontName) {
                    return (
                        <div className="my-multiselected-item-token">
                            <span style={{fontFamily:fontName}}>{fontName}</span>
                        </div>
                    );
                }
                else {
                    return <span className="my-multiselected-empty-token">Select Fonts...</span>
                }
            }}
        />
    }

    // componentWillMount :: a -> Void
    componentWillMount() {
    }
}


let numRenders = 0;

class FontBox extends React.Component {
    state = {
        value:"breaks"
    };

    handleChange = values => {
        this.props.handleUpdate(values);
    };

    render() {
        ++numRenders;
        return (

        <div className="FontBox">
        {/* Fonts */}
            <FontDropdown
                options = {DEFAULT_FONTS}
                selected = {this.props.selected}
                handleChange = {this.handleChange}
            />
        </div>
        );
    }
}

export default FontBox;