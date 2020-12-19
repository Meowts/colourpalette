/*
*
*	ColourMixer! By Benjamin Coleman
*	May 2015
*
*	This tool is to create a unified colour palette from a set of base colours you choose.
*	It will also display the calculated colours' respective Hex and RGB values. Handy!
*
*/

const colours = angular.module('colours', []);

/*
*
*	Colour controller
*
*/
colours.controller('ColourCtrl', function($scope, ColourMixer){

	//Opacity ratio
	$scope.opacity = {
		A : 0.7,
		B : 0.3
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
	//uniquely defined so the values can be linked up to the right <td> elements,
	//so the calculated colours will be displayed dynamically.
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

	$scope.validColour = true;
	$scope.validOpacity = true;

	//Load page with the defaults calculated
	$scope.calculatedColours = ColourMixer.calcColours($scope.colours, $scope.opacity);

	$scope.getRGB = function(hex){ return ColourMixer.getRGB(hex); }

	$scope.getHex = function(rgb){ return ColourMixer.getHex(rgb); }

	//Cal-cu-late!
	$scope.update = function(currentIndex, currentColour, isRGB){
		
		//Validate Colour
		if(currentIndex){
			$scope.validColour = $scope.isValidColour(currentColour, isRGB);
			if(!$scope.validColour) return;
		}

		//Validate Opacity
		$scope.validOpacity = $scope.isValidOpacity($scope.opacity);
		if(!$scope.validOpacity) return;
	
		$scope.calculatedColours = ColourMixer.calcColours($scope.colours, $scope.opacity, currentIndex, currentColour);

		//Update the input fields
		if(currentIndex){
			if(isRGB) $scope.colours['c' + currentIndex].hex = $scope.getHex($scope.colours['c' + currentIndex].rgb);
			else $scope.colours['c' + currentIndex].rgb = $scope.getRGB($scope.colours['c' + currentIndex].hex);
		}
	}

	$scope.isValidColour = function(currentColour, isRGB){
		var valid = true;

		if(isRGB && !ColourMixer.isValidRGB(currentColour.rgb)) return false;
		if(!isRGB && !ColourMixer.isValidHex(currentColour.hex)) return false;

		return true;
	}

	$scope.isValidOpacity = function(opacity){		
		if(!ColourMixer.isValidOpacity(opacity.A)) return false;
		if(!ColourMixer.isValidOpacity(opacity.B)) return false;

		return true;
	}
});



/*
*
*	ColourMixer factory for handling all of the colourful calculations
*
*/
colours.factory('ColourMixer', function(){
	return {

		//A container with keys to hold the calculated colour values
		calculatedColours : {
			1 : { ca1:"",ca2:"",ca3:"",ca4:"",ca5:"",ca6:"",ca7:""},
			2 : { ca8:"",ca9:"",ca10:"",ca11:"",ca12:"",ca13:"",ca14:""},
			3 : { ca15:"",ca16:"",ca17:"",ca18:"",ca19:"",ca20:"",ca21:""},
			4 : { ca22:"",ca23:"",ca24:"",ca25:"",ca26:"",ca27:"",ca28:""},
			5 : { ca29:"",ca30:"",ca31:"",ca32:"",ca33:"",ca34:"",ca35:""},
			6 : { ca36:"",ca37:"",ca38:"",ca39:"",ca40:"",ca41:"",ca42:""},
			7 : { ca43:"",ca44:"",ca45:"",ca46:"",ca47:"",ca48:"",ca49:""}
		},

		//All of the functions working with RGB are in an array context,
		//so with this you could pass in either a string or an array to those functions
		//("255,0,50" or [255,0,50]) and it will return an array
		prepRGB : function(rgb){
			//Check if string
			if(typeof rgb === 'string'){
				rgb = rgb.split(',');
			}

			//Convert all stringy numbers to integers
			for(var i = 0; i < rgb.length; i++){
				if(typeof rgb[i] === 'string'){
					rgb[i] = parseInt(rgb[i]);
				}
			}

			return rgb;
		},

		//Pass in a hex value, it will return an array of RGB values
		getRGB : function(hex){
			var r, g, b;

			//"#XXXXXX"
			if(hex.length === 7){
				r = parseInt(hex.substring(1, 3), 16);
				g = parseInt(hex.substring(3, 5), 16);
				b = parseInt(hex.substring(5, 7), 16);
			}
			//"#XXX"
			else if(hex.length === 4){
				r = (parseInt(hex.substring(1, 2), 16));
				g = (parseInt(hex.substring(2, 3), 16));
				b = (parseInt(hex.substring(3, 4), 16));
				r *= r + 2;
				g *= g + 2;
				b *= b + 2;
			}

			return [r, g, b];
		},

		//Pass in an array of RGB values, it will return the hex value
		getHex : function(rgb){
			rgb = this.prepRGB(rgb);

			var hex = [];

			var a = rgb[0].toString(16);
			var b = rgb[1].toString(16);
			var c = rgb[2].toString(16);

			hex.push(a); hex.push(b); hex.push(c);

			//Add leading 0 for single character results 
			//i.e. decimal:'10' == hex:'a', and will need to be '0a' in order to be parsed 
			//by the browser as a correct CSS background-color value
			for(var x = 0; x < 3; x++){
				if(hex[x].length === 1) 
					hex[x] = "0" + hex[x];
			}

			return "#" + hex[0] + hex[1] + hex[2];
		},

		//For getting the RGB value with alpha, placed upon a blank white HTML canvas.
		applyWhiteBase : function(rgb, alpha){
			rgb = this.prepRGB(rgb);
			
			//Say you pass in 0.7 opacity, it implies a subtraction of 0.3 from 1 on a white background
			alpha = 1 - alpha;

			return [
				Math.round(((1 - alpha) * rgb[0]) + (alpha * 255)),
				Math.round(((1 - alpha) * rgb[1]) + (alpha * 255)),
				Math.round(((1 - alpha) * rgb[2]) + (alpha * 255))
			];
		},

		//For mixing an already white-based colour with another colour along with its alpha
		mixColours : function(one, two, alpha){
			one = this.prepRGB(one);
			two = this.prepRGB(two);

			return [
				Math.round(((1 - alpha) * one[0]) + (alpha * two[0])),
				Math.round(((1 - alpha) * one[1]) + (alpha * two[1])),
				Math.round(((1 - alpha) * one[2]) + (alpha * two[2]))
			];
		},

		calcColours : function(colours, opacity, currentIndex, currentColour){

			//Create a deep copy of the colours so that the array linked to the DOM isn't manipulated	
			var __colours = angular.copy(colours);

			//Here we create an array of all of the base colours with the first round of
			//opacity applied to them (1979 Mobile Suit Gundam reference, anyone?)
			var whiteBase = [];

			for(var colour in __colours){
				whiteBase.push(this.applyWhiteBase(__colours[colour].rgb, opacity.A));
			}

			//Fill the table the first time you load the page, or change either opacity value
			if(!currentIndex){
				//Loop through the calculatedColours object and calculate the colour (lol)
				var x = 0;
				for(var index in this.calculatedColours){
					var y = 0;
					for(var colour in this.calculatedColours[index]){
						this.calculatedColours[index][colour] = this.getHex(this.mixColours(whiteBase[x], whiteBase[y], opacity.B));
						y++;
					}
					x++
				}			
			}
			//For when colours are updated by the input fields, only update the colours that are affected
			else{
				var currentBase = this.applyWhiteBase(currentColour.rgb, opacity.A);
				var row = 0;

				for(var index in this.calculatedColours){

					//If it's that colour's row...
					if(index === currentIndex.toString()){
						
						var y = 0;

						for(var colour in this.calculatedColours[index]){
							this.calculatedColours[index][colour] = this.getHex(this.mixColours(currentBase, whiteBase[y], opacity.B));
							y++;						
						}
					}
					//... otherwise just update the one colour affected in that row
					else{

						var indexCheck = 1;

						for(var colour in this.calculatedColours[index]){
							if(indexCheck === currentIndex){
								this.calculatedColours[index][colour] = this.getHex(this.mixColours(whiteBase[row], currentBase, opacity.B));
							}
							indexCheck++;
						}
					}

					//Move down a row
					row++;
				}
			}

			return this.calculatedColours;
		},

		isValidRGB : function(rgb){
			rgb = rgb.replace(/,\s/g,',');

			var exp = /(\d{1,3}),(\d{1,3}),(\d{1,3})/;

			if(exp.exec(rgb) === null) return false;

			var limitCheck = rgb.split(',');
			for(var i = 0; i < limitCheck.length; i++){
				if(parseInt(limitCheck[i]) > 255) return false;
			}

			return true;
		},

		isValidHex : function(hex){
			var exp = /^#([0-9a-fA-F]{3}){1,2}$/i;

			if(exp.exec(hex) != null)
				return true;

			return false;
		},

		isValidOpacity : function(opacity){
			var exp = /0\.([0-9]{1,3})/;

			if(exp.exec(opacity) != null)
				return true;

			return false;
		}
	}
});