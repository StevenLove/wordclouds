import React from 'react';
const DEFAULT_FONTS = ["Garamond", "Courier", "Bookman", "Arial", "Impact"];

// const DEFAULT_SELECTED_FONTS = ["Garamond","Impact"];

// class FontDropdown extends React.Component {
//     // getInitialState :: a -> UIState
//     state = {
//         all:        DEFAULT_FONTS           .map(name=>{return{label:name,value:name}}),
//         // selected:   DEFAULT_SELECTED_FONTS  .map(name=>{return{label:name,value:name}})
//         selected: this.props.initial.map(name=>{return{label:name,value:name}})
//     };

//     // render :: a -> ReactElement
//     render() {
//         self = this;
//         let isSelected = function(value){
//           return self.state.selected.map(lv=>lv.value).indexOf(value) > -1
//         }
  
//         return <MultiSelect
//             placeholder = "Select Fonts"
//             options = {this.state.all}
//             values = {this.state.selected}
            
//             // restoreOnBackspace :: Item -> String
//             restoreOnBackspace = {function(item){
//                 return item.label;
//             }}
            
//             // onValuesChange :: [Item] -> (a -> Void) -> Void
//             onValuesChange = {function(selected){
//                 console.log("SELECTIZE FONT CHANGED",selected);
//                 self.setState({
//                   selected: selected
//                 });
//                 self.props.onValuesChange(selected);
//             }}
            
//             // filterOptions :: [Item] -> [Item] -> String -> [Item]
//             filterOptions = {function(options, values, search){
//                 // if (!!charMap[search])
//                 //     return options.filter(function(option){
//                 //         return option.label == charMap[search];
//                 //     });
//                 // else
//                 return options.filter(op=>!isSelected(op.value)).filter(op=>op.label.indexOf(search == 0));
//             }}
  
//             // uid :: (Eq e) => Item -> e
//             uid = {function(item){
//                 return item.label;
//             }}
  
//             // renderOption :: Int -> Item -> ReactElement
//             renderOption = {function(item){
//                 return <div className = "simple-option">
//                     {/* <img src = {item.value} style = {{marginRight: 4, verticalAlign: "middle", width: 24}}/> */}
//                     <span style={{fontFamily:item.value}}>{item.label}</span>
//                 </div>
//             }}
            
//             // renderValue :: Int -> Item -> ReactElement
//             renderValue = {function(item){
//                 return <div className = "removable-emoji">
//                     <span onClick = {function(){
//                         let newState = self.state.selected.filter(itemToRemove=>itemToRemove.value != item.value )
//                         self.setState({
//                             // selectedEmojis: _.reject(self.state.selectedEmojis, function(emoji){
//                             //     return emoji.value == item.value;
//                             // }) 
//                             selected: newState
//                         });
//                         console.log("new fonts",newState);
//                         self.props.onValuesChange(newState);
//                     }}>x</span>
//                     <span style={{fontFamily:item.value}}>{item.label}</span>
//                     {/* <img src = {item.value} style = {{marginRight: 4, verticalAlign: "middle", width: 24}}/> */}
//                 </div>
//             }}
//         />
//     }

//     // componentWillMount :: a -> Void
//     componentWillMount() {
//         self = this;
//         // $.getJSON("http://api.github.com/emojis").done(function(result){
//         //     self.setState({
//         //         emojis:Object.keys(result).map(key=>{
//         //           return {label:key,value:result[key]}
//         //         })
//         //         // emojis: _.chain(result)
//         //         //     .pairs()
//         //         //     .map(function(arr){
//         //         //         return {label: arr[0], value: arr[1]};
//         //         //     })
//         //         //     .value()
//         //     });    
//         // });
//     }
// }


let numRenders = 0;

class FontBox extends React.Component {
    state = {
        value:"breaks"
    };

    handleChange = (e) => {
      console.log("handle fonts change",e);
        let values = e.map(item=>item.value);
        this.props.handleUpdate(values);
    };

    render() {
        ++numRenders;
        return (

        <div className="FontBox">
        Fonts
            {/* <FontDropdown
                initial = {this.props.initial}
                onValuesChange = {this.handleChange}
            /> */}
        </div>
        );
    }
}

export default FontBox;