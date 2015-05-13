/*
*
*	ColourMixer! By Benjamin Coleman aka Meowts
*	May 2015
*
*	The premis of this lil' app is to create a unified colour palette from whichever base colours you choose.
*	It will also display the calculated colours' respective Hex and RGB values. Handy!
*
*/



//Initialize angular module
var colours = angular.module('colours', []);



/*
*
*	Colour controller for the DOM
*
*/
colours.controller('ColourCtrl', function($scope, ColourMixer){

	//Opacity ratio settings
	$scope.settings = {
		opacityA : 0.7,
		opacityB : 0.3
	};

	//Initialize the app with the base colours defined
	$scope.colours = {
		c1 : {
			hex : "#FFFFFF",
			rgb : "255,255,255"
		},
		c2 : {
			hex : "#B200FF",
			rgb : "178,0,255"
		},
		c3 : {
			hex : "#0094FF",
			rgb : "0,148,255"
		},
		c4 : {
			hex : "#00FF21",
			rgb : "0,255,33"
		},
		c5 : {
			hex : "#FFD800",
			rgb : "255,216,0"
		},
		c6 : {
			hex : "#FF6A00",
			rgb : "255,106,0"
		},
		c7 : {
			hex : "#FF0000",
			rgb : "255,0,0"
		}
	};

	//Here is the table with the keys to the colours. Each key needs to be
	//uniquely defined so the values can be linked up on the table,
	//to allow them to be updated and displayed dynamically.
	$scope.table = {
		row1 : ['','c1','c2','c3','c4','c5','c6','c7'],
		row2 : ['c1','ca1','ca2','ca3','ca4','ca5','ca6', 'ca7'],
		row3 : ['c2','ca8','ca9','ca10','ca11','ca12','ca13', 'ca14'],
		row4 : ['c3','ca15','ca16','ca17','ca18','ca19','ca20', 'ca21'],
		row5 : ['c4','ca22','ca23','ca24','ca25','ca26','ca27', 'ca28'],
		row6 : ['c5','ca29','ca30','ca31','ca32','ca33','ca34', 'ca35'],
		row7 : ['c6','ca36','ca37','ca38','ca39','ca40','ca41', 'ca42'],
		row8 : ['c7','ca43','ca44','ca45','ca46','ca47','ca48', 'ca49']
	};

	//Load page with the defaults calculated
	$scope.calculatedColours = ColourMixer.calcColours($scope.colours, $scope.settings, null, null, true);

	//For the RGB values to be displayed in the table
	$scope.getRGB = function(hex){
		return ColourMixer.getRGB(hex);
	}

	$scope.getHex = function(rgb){
		return ColourMixer.getHex(rgb);
	}

	//Cal-cu-late!
	$scope.calcColours = function(colours, settings, currentIndex, currentColour, isRGB){

		//When editing, validate so that calcColours isn't called when a valid colour isn't there
		var isValid = true;

		if(currentIndex){
			if(isRGB){
				isValid = (ColourMixer.isValidRGB(currentColour) !== null) ? true : false;
			}
			else{
				isValid = (ColourMixer.isValidHex(currentColour) !== null) ? true : false;
			}
		}

		if(isValid){
			$scope.calculatedColours = ColourMixer.calcColours(colours, settings, currentIndex, currentColour, isRGB);

			//Update the input fields
			if(currentIndex){
				if(isRGB){

				}
				else{

				}
			}
		}
	}
});



/*
*
*	ColourMixer factory for handling all of the colourful calculations
*
*/
colours.factory('ColourMixer', function(){
	return {

		//An container with keys to hold the calculated colour values
		calculatedColours : {
			1 : { ca1:"",ca2:"",ca3:"",ca4:"",ca5:"",ca6:"",ca7:""},
			2 : { ca8:"",ca9:"",ca10:"",ca11:"",ca12:"",ca13:"",ca14:""},
			3 : { ca15:"",ca16:"",ca17:"",ca18:"",ca19:"",ca20:"",ca21:""},
			4 : { ca22:"",ca23:"",ca24:"",ca25:"",ca26:"",ca27:"",ca28:""},
			5 : { ca29:"",ca30:"",ca31:"",ca32:"",ca33:"",ca34:"",ca35:""},
			6 : { ca36:"",ca37:"",ca38:"",ca39:"",ca40:"",ca41:"",ca42:""},
			7 : { ca43:"",ca44:"",ca45:"",ca46:"",ca47:"",ca48:"",ca49:""}
		},

		//Pass in a hex value, it will return an array of RGB values
		getRGB : function(hex){
			var r = parseInt(hex.substring(1, 3), 16);
			var g = parseInt(hex.substring(3, 5), 16);
			var b = parseInt(hex.substring(5, 7), 16);

			return [r, g, b];
		},

		//Pass in an array of RGB values, it will return the hex value
		getHex : function(rgb){
			var hex = [];

			var a = rgb[0].toString(16);
			var b = rgb[1].toString(16);
			var c = rgb[2].toString(16);

			hex.push(a); hex.push(b); hex.push(c);

			for(var x = 0; x < 3; x++){
				if(hex[x] == "0") 
					hex[x] = "00";
			}

			return "#" + hex[0] + hex[1] + hex[2];
		},

		//For getting the RGB value with alpha, placed upon a blank white HTML canvas.
		applyWhiteBase : function(rgb, alpha){
			//From this point, the rgb value will be an array for simplicity sake
			rgb = rgb.split(',');

			//Say you pass in 0.7, it implies a subtraction of 0.3 from 1 on a white background
			alpha = 1 - alpha;

			return [
				Math.round(((1 - alpha) * rgb[0]) + (alpha * 255)),
				Math.round(((1 - alpha) * rgb[1]) + (alpha * 255)),
				Math.round(((1 - alpha) * rgb[2]) + (alpha * 255))
			];
		},

		//For mixing an already white-based colour with another colour along with its alpha
		mixColours : function(one, two, alpha){
			return [
				Math.round(((1 - alpha) * one[0]) + (alpha * two[0])),
				Math.round(((1 - alpha) * one[1]) + (alpha * two[1])),
				Math.round(((1 - alpha) * one[2]) + (alpha * two[2]))
			];
		},

		calcColours : function(colours, settings, currentIndex, currentColour, isRGB){

			//Create a copy of the colours so that the original values aren't touched			
			var __colours = angular.copy(colours);

			//Here we create an array of all of the base colours with the first round of
			//opacity applied to them (1979 Mobile Suit Gundam reference, anyone?)
			var whiteBase = [];

			for(var colour in __colours){
				whiteBase.push(this.applyWhiteBase(__colours[colour].rgb, settings.opacityA));
			}

			//Fill the table the first time you load the page, or change either opacity value
			if(!currentIndex){
				//Loop through the calculatedColours object and calculate the colour (lol)
				var x = 0;
				for(var index in this.calculatedColours){
					var y = 0;
					for(var colour in this.calculatedColours[index]){
						this.calculatedColours[index][colour] = this.getHex(this.mixColours(whiteBase[x], whiteBase[y], settings.opacityB));
						y++;
					}
					x++
				}			
			}
			//For when colours are updated by the input fields, only update the colours that are affected
			else{
				var currentBase = this.applyWhiteBase(currentColour, settings.opacityA);
				var row = 0;

				for(var index in this.calculatedColours){

					//If it's that colour's row...
					if(index === currentIndex.toString()){
						
						var y = 0;

						for(var colour in this.calculatedColours[index]){
							this.calculatedColours[index][colour] = this.getHex(this.mixColours(currentBase, whiteBase[y], settings.opacityB));
							y++;						
						}
					}
					//... otherwise just update the one colour affected in that row
					else{

						var checkIndex = 1;

						for(var colour in this.calculatedColours[index]){
							if(checkIndex === currentIndex){
								this.calculatedColours[index][colour] = this.getHex(this.mixColours(whiteBase[row], currentBase, settings.opacityB));
							}
							checkIndex++;
						}
					}

					//Move down a row
					row++;
				}
			}
			debugger;
			//Finally, update the original values
			// if(isRGB){
			// 	for(var colour in colours){
			// 		colours[colour].hex = this.getHex(colours[colour].rgb);
			// 	}
			// }
			// else{
			// 	for(var colour in colours){
			// 		colours[colour].rgb = this.getRGB(colours[colour].hex);
			// 	}
			// }

			//Return the calculated colours
			return this.calculatedColours;
		},

		isValidRGB : function(rgb){
			var exp = /(\d{1,3}),(\d{1,3}),(\d{1,3})/;
			return exp.exec(rgb);
		},

		isValidHex : function(hex){
			var exp = /^#([0-9a-fA-F]{3}){1,2}$/i;
			return exp.exec(rgb);
		}
	}
});