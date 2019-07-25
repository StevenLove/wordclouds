import utils from "./utils.js";
// import spriter from "./clientSpriter.js";

/////////////
/* PHRASES */
/////////////


var textBankStrings =[
  "Loving Father",
  "Loving Husband",
  "Sweet Prince",
  "John 3:16",
  "Trustworthy",
  "Loyal",
  "Helpful",
  "Friendly",
  "Courteous",
  "Kind",
  "Obedient",
  "Peaceful"
]; 


// var defaultString = "path righteous beset iniquities selfish tyranny evil men. Blessed charity good shepherds weak valley darkness brother keeper lost children strike thee great vengeance furious anger poison destroy brothers Lord lay vengeance asses dead fucking fried chicken shit transitional period dumb ass Your bones don't break, mine do. That's clear. Your cells react to bacteria and viruses differently than mine. You don't get sick, I do. That's also clear. But for some reason, you and I react the exact same way to water. We swallow it too fast, we choke. We get some in our lungs, we drown. However unreal it may seem, we are connected, you and I. We're on the same curve, just on opposite ends";


// var defaultString = "peace peace peace peace peace courageous honest great hard-working thoughtful talented enthusiastic loving smart incredible creative optimistic reliable patient kind skilled caring considerate generous sincere loyal passionate inventive amazing lovely missed brave adventurous calm witty courageous honest great hard-working thoughtful talented enthusiastic loving smart incredible creative optimistic reliable patient kind skilled caring considerate generous sincere loyal passionate inventive amazing lovely missed brave adventurous calm witty courageous honest great hard-working thoughtful talented enthusiastic loving smart incredible creative optimistic reliable patient kind skilled caring considerate generous sincere loyal passionate inventive amazing lovely missed brave adventurous calm witty courageous honest great hard-working thoughtful talented enthusiastic loving smart incredible creative optimistic reliable patient kind skilled caring considerate generous sincere loyal passionate inventive amazing lovely missed brave adventurous calm witty courageous honest great hard-working thoughtful talented enthusiastic loving smart incredible creative optimistic reliable patient kind skilled caring considerate generous sincere loyal passionate inventive amazing lovely missed brave adventurous calm witty courageous honest great hard-working thoughtful talented enthusiastic loving smart incredible creative optimistic reliable patient kind skilled caring considerate generous sincere loyal passionate inventive amazing lovely missed brave adventurous calm witty courageous honest great hard-working thoughtful talented enthusiastic loving smart incredible creative optimistic reliable patient kind skilled caring considerate generous sincere loyal passionate inventive amazing lovely missed brave adventurous calm witty courageous honest great hard-working thoughtful talented enthusiastic loving smart incredible creative optimistic reliable patient kind skilled caring considerate generous sincere loyal passionate inventive amazing lovely missed brave adventurous calm witty";


var defaultString = "travel gardening hiking skiing Cumberland Orioles fishing camping outdoors Bill poetry Grandaddy love family business UMD Wharton Ooggie dogs running courageous honest great hard-working thoughtful talented enthusiastic loving smart incredible creative optimistic reliable patient kind skilled caring considerate generous sincere loyal passionate inventive amazing lovely brave adventurous calm";

var defaultTexts = ["ping pong","computers","gadgets","HAM Radio","golf","storm chasing","French","Cape Cod","mac n cheese","oil painting","Pure Country", "Ford F150","Baltimore Ravens"];

// defaultTexts = defaultTexts.concat(utils.parsePhrases(defaultString," "));

defaultTexts = defaultTexts.concat(defaultTexts);


// defaultTexts = defaultTexts.concat(defaultTexts);



// var defaultTexts = defaultString.split(/ +/);

utils.Shuffle(defaultTexts);

// console.log(defaultTexts);

var defaultProtoPhrases = defaultTexts.map(function(text,index){
  return {id: Math.random(), index: index, text: text};
})



//////////////
/* PALETTES */
//////////////

var makePalette = function(name){
  var args = Array.prototype.slice.call(arguments,1);
  return {
    name: name,
    colors: args
  }
}

var safeColors = [
 "#FFFFFF", "#D3D3D3", "#9A9A9A", "#6F6F70", "#4C4C4C", "#313131", "#1F1F1F",
 "#161616", "#000003", "#D8E9F6", "#BAD1EC", "#627DAB", "#3F507C", "#243357",
 "#0D1945", "#091235", "#040B25", "#020510", "#E1FFE7", "#C6FFC5", "#87C38E",
 "#539852", "#2F5C2F", "#1B361D", "#04340D", "#0C2811", "#071B0B", "#010E01",
 "#E4FAC8", "#DDF89D", "#A7C45A", "#789833", "#597A1B", "#53671E", "#2C4704",
 "#193202", "#283108", "#E2E1A2", "#D2CF7E", "#AAA248", "#66631A", "#716B13",
 "#3C3908", "#E0ACC7", "#CD8BAA", "#9C5478", "#8F305E", "#5D1239", "#47112D",
 "#2A0418", "#1D010F", "#E5D7F4", "#D9BFF3", "#A98CE7", "#B397D0", "#705D98",
 "#5B4181", "#4C306B", "#3A1554", "#1D0529", "#D0F0EC", "#84B7AD", "#4E8283",
 "#316467", "#0A3B3E", "#062729", "#021718", "#E66D67", "#AA433B", "#791308",
 "#4F0D02", "#CEC9AE", "#B0AF88", "#818362", "#49492F", "#D87379", "#D05258",
 "#902C2E", "#650408", "#460205", "#2C0103", "#1A0102", "#F2C577", "#B68632",
 "#895005", "#653A03", "#382002", "#211301", "#F1AB89", "#CD6646", "#7F341E",
 "#631604", "#FFC98F", "#F3AE4C", "#F5973C", "#DA621F", "#A64C03", "#9C3204",
 "#EE603F", "#F5C4B5", "#D38D82", "#F4D6C5", "#F3D5A1", "#F2B477", "#D2AD89",
 "#D9A471", "#9B663B", "#4D2F15", "#341704", "#110A09", "#000000", "#88C7C9",
 "#12566A", "#468099", "#47759C", "#84F2BF", "#725943", "#4F3D2E"
];

var defaultPalette = makePalette("Black","#000000");

var palettes = [
  makePalette("Black","#000000"),
  makePalette("RGB","#FF0000","#00FF00","#0000FF"),
  makePalette("CYM","#FFFF00","#00FFFF","#FF00FF"),
  makePalette("Blues","#0000FF","#0000AA","#111199","#6666FF"),
  makePalette("Royal","#091235",
    // "#3A1554",
    "#020510",
    "#705D98","#F3AE4C","#341704"),
  makePalette("Sunshine","#F3AE4C","#F2C577","#88C7C9","#FFFFFF"),
  makePalette("Somber", "#243357","#5B4181","#84B7AD","#B0AF88","#D2AD89"),
  makePalette("Galaxy","#D8E9F6","#84F2BF","#468099","#3A1554","#1D0529"),
  makePalette("Sunset","#3A1554","#D05258","#705D98","#EE603F","#F2C577"),
  makePalette("Isolations","#84F2BF","#DDF89D","#F2C577","#DA621F","#D05258"),
  makePalette("All",
   "#FFFFFF", "#D3D3D3", "#9A9A9A", "#6F6F70", "#4C4C4C", "#313131", "#1F1F1F",
   "#161616", "#000003", "#D8E9F6", "#BAD1EC", "#627DAB", "#3F507C", "#243357",
   "#0D1945", "#091235", "#040B25", "#020510", "#E1FFE7", "#C6FFC5", "#87C38E",
   "#539852", "#2F5C2F", "#1B361D", "#04340D", "#0C2811", "#071B0B", "#010E01",
   "#E4FAC8", "#DDF89D", "#A7C45A", "#789833", "#597A1B", "#53671E", "#2C4704",
   "#193202", "#283108", "#E2E1A2", "#D2CF7E", "#AAA248", "#66631A", "#716B13",
   "#3C3908", "#E0ACC7", "#CD8BAA", "#9C5478", "#8F305E", "#5D1239", "#47112D",
   "#2A0418", "#1D010F", "#E5D7F4", "#D9BFF3", "#A98CE7", "#B397D0", "#705D98",
   "#5B4181", "#4C306B", "#3A1554", "#1D0529", "#D0F0EC", "#84B7AD", "#4E8283",
   "#316467", "#0A3B3E", "#062729", "#021718", "#E66D67", "#AA433B", "#791308",
   "#4F0D02", "#CEC9AE", "#B0AF88", "#818362", "#49492F", "#D87379", "#D05258",
   "#902C2E", "#650408", "#460205", "#2C0103", "#1A0102", "#F2C577", "#B68632",
   "#895005", "#653A03", "#382002", "#211301", "#F1AB89", "#CD6646", "#7F341E",
   "#631604", "#FFC98F", "#F3AE4C", "#F5973C", "#DA621F", "#A64C03", "#9C3204",
   "#EE603F", "#F5C4B5", "#D38D82", "#F4D6C5", "#F3D5A1", "#F2B477", "#D2AD89",
   "#D9A471", "#9B663B", "#4D2F15", "#341704", "#110A09", "#000000", "#88C7C9",
   "#12566A", "#468099", "#47759C", "#84F2BF", "#725943", "#4F3D2E")
]

////////////
/* SIZERS */
////////////

var sizes = {
  xl: 96,
  l: 72,
  m: 48,
  s: 36,
  xs: 24 // comment this out?
}

var makeSizer = function(name,f){
  return {name: name, f: f};
}

var makePlateauSizer = function(width){
  return makeSizer(
    "Plateau " + width,
    function(index){
      if(index==0)return sizes.xl;
      if(index < width/2) return sizes.l;
      if(index < 2*width) return sizes.m;
      if(index < 4*width) return sizes.s;
      return sizes.xs;
    }
  );
}

var makeStaticSizer = function(val){
  return makeSizer("Static " + val, ()=>val);
}

var randomSizer = makeSizer("random",function(index){
  return sizes[utils.getRandomElement(Object.keys(sizes))];
})

var sizers = [
  randomSizer,
  makePlateauSizer(3),
  makePlateauSizer(10),
  makeStaticSizer(12),
  makeStaticSizer(24),
  makeStaticSizer(72)
]

var defaultSizer = randomSizer;


///////////
/* FONTS */
///////////



////////////
/* SHAPES */
////////////

var shapeNames = [
  "dove",
  "cross",
  "christ",
  "fish",
  "hands"
]

// var makeShape = function(name){
//   return {name: name, url: "./images/"+name+".png"}
// }

var noShape = {type:"none",file:{}, size:"blanket"};

var defaultShape = noShape;

// var shapes = shapeNames.map(function(name){
//   return makeShape(name);
// })

var namedShapeSizes = {
  "blanket":{width:768,height:1025}
}










// var defaultSprite = spriter.fromDimensions(768,1025);



export default {
  palettes:palettes,
  defaultPalette: defaultPalette,
  defaultSizer: defaultSizer,
  sizers: sizers,
  defaultShape: defaultShape,
  // shapes: shapes,
  // defaultSprite: defaultSprite,
  defaultProtoPhrases: defaultProtoPhrases,
  textBankStrings:textBankStrings,
  safeColors:safeColors,
  namedShapeSizes: namedShapeSizes
}