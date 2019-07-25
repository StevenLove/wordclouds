import React from 'react';
import utils from "../js/utils.js";
// import {Button,UncontrolledCollapse} from "reactstrap";
// import { ListGroup, ListGroupItem } from 'reactstrap';
import $ from "jquery";


let timer;
let numRenders = 0;
let mostUpToDateText;
const CHANGE_DEBOUNCE_DURATION = 350; //ms

function getInitialText(){
    return `George Clark
Pure Country
UMD
skiing
family
travel
outdoors
amazing
business
talented
dogs
courageous
skiing
loving
outdoors
family
mac n cheese
caring
fishing
ping pong
adventurous
storm chasing
gardening
poetry
reliable
brave
inventive
HAM Radio
generous
honest
Grandaddy
Baltimore Ravens
enthusiastic
oil painting
computers
mac n cheese
Orioles
caring
HAM Radio
smart
considerate
courageous
hard-working
inventive
sincere
Orioles
thoughtful
amazing
travel
love
Ford F150
passionate
Cumberland
Pure Country
incredible
camping
loving
talented
Wharton
hiking
skilled
gadgets
honest
kind
poetry
business
camping
reliable
Wharton
great
Bill
French
lovely
skilled
love
golf
Ooggie
passionate
generous
dogs
Bill
gardening
lovely
hiking
loyal
running
creative
smart
patient
sincere
kind
Baltimore Ravens
UMD
brave
ping pong
optimistic
patient
creative
Ford F150
French
Cumberland
gadgets
enthusiastic
Grandaddy
considerate
oil painting
running
Cape Cod
hard-working
Ooggie
great
loyal
calm
Cape Cod
computers
adventurous
storm chasing
incredible
fishing
calm
golf
optimistic
thoughtful`
  }

class TextInput extends React.Component {
    componentDidMount() {
        /* As an effort to debounce the many text input changes that can fire...
            use a timer that waits until CHANGE_DEBOUNCE_DURATION ms after the last change
            then percolates up with handleUpdate fn call
        */
        mostUpToDateText = getInitialText();//this.props.text;
        $("#phraseInput").val(mostUpToDateText);
        timer = new utils.Timer().delay(CHANGE_DEBOUNCE_DURATION).then(()=>this.props.handleUpdate(mostUpToDateText)).start();
    }

    handleTextChangeEvent = (e) => {
        mostUpToDateText = e.target.value;
        $("#phraseInput").val(mostUpToDateText);
        timer.reset();
    };

    render() {
        ++numRenders;
        return (

        <div>
            <textarea
                id="phraseInput"
                rows="10"
                // value={mostUpToDateText}
                onChange={this.handleTextChangeEvent}>
            </textarea>
        </div>
        );
    }
}

export default TextInput;