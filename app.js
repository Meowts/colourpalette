/*
*
*	Colours! By Benjamin Coleman
*	May 2015
*
*	The premis of this lil' app is to create a unified colour palette, based on the 70/30 trick.
*	It will calculate the palette based on the base colours, and output the colours and their
*	respective Hex and RGB values. Handy!
*
*/

var app = angular.module('colours', []);

app.controller('ColourCtrl', function($scope){

	//Initialize the app with the base colours defined
	$scope.colours = {
		black : '#000000',
		c1 : "#FFFFFF",
		c2 : "#B200FF",
		c3 : "#0094FF",
		c4 : "#00FF21",
		c5 : "#FFD800",
		c6 : "#FF6A00",
		c7 : "#FF0000"
	};

	//Here is the table with the keys to the colours. Each key needs to be
	//specifically defined so the values can be linked up on the table,
	//to allow them to be updated and displayed dynamically.
	$scope.table = {
		row1 : ['black','c1','c2','c3','c4','c5','c6','c7'],
		row2 : ['c1','ca1','ca2','ca3','ca4','ca5','ca6', 'ca7'],
		row3 : ['c2','ca8','ca9','ca10','ca11','ca12','ca13', 'ca14'],
		row4 : ['c3','ca15','ca16','ca17','ca18','ca19','ca20', 'ca21'],
		row5 : ['c4','ca22','ca23','ca24','ca25','ca26','ca27', 'ca28'],
		row6 : ['c5','ca29','ca30','ca31','ca32','ca33','ca34', 'ca35'],
		row7 : ['c6','ca36','ca37','ca38','ca39','ca40','ca41', 'ca42'],
		row8 : ['c7','ca43','ca44','ca45','ca46','ca47','ca48', 'ca49']
	};

	//An empty object to hold the calculated colour values
	$scope.calculatedColours = {
		1 : { ca1:"",ca2:"",ca3:"",ca4:"",ca5:"",ca6:"",ca7:""},
		2 : { ca8:"",ca9:"",ca10:"",ca11:"",ca12:"",ca13:"",ca14:""},
		3 : { ca15:"",ca16:"",ca17:"",ca18:"",ca19:"",ca20:"",ca21:""},
		4 : { ca22:"",ca23:"",ca24:"",ca25:"",ca26:"",ca27:"",ca28:""},
		5 : { ca29:"",ca30:"",ca31:"",ca32:"",ca33:"",ca34:"",ca35:""},
		6 : { ca36:"",ca37:"",ca38:"",ca39:"",ca40:"",ca41:"",ca42:""},
		7 : { ca43:"",ca44:"",ca45:"",ca46:"",ca47:"",ca48:"",ca49:""}
	};

	//Opacity settings if one might desire to alter them
	$scope.settings = {
		opacityA : 0.7,
		opacityB : 0.3
	};

	//Pass in a hex value, it will return an array of RGB values
	$scope.getRGB = function(hex){
		var r = parseInt(hex.substring(1, 3), 16);
		var g = parseInt(hex.substring(3, 5), 16);
		var b = parseInt(hex.substring(5, 7), 16);

		return [r, g, b];
	}

	$scope.calcColours = function(update, currentIndex, currentColour){
		//Here we create an array of all of the base colours with the first round of
		//opacity already applied to them
		var whiteBase = [
			applyWhiteBase($scope.getRGB($scope.colours.c1), $scope.settings.opacityA),
			applyWhiteBase($scope.getRGB($scope.colours.c2), $scope.settings.opacityA),
			applyWhiteBase($scope.getRGB($scope.colours.c3), $scope.settings.opacityA),
			applyWhiteBase($scope.getRGB($scope.colours.c4), $scope.settings.opacityA),
			applyWhiteBase($scope.getRGB($scope.colours.c5), $scope.settings.opacityA),
			applyWhiteBase($scope.getRGB($scope.colours.c6), $scope.settings.opacityA),
			applyWhiteBase($scope.getRGB($scope.colours.c7), $scope.settings.opacityA)
		];

		//Fill the table the first time you load the page, or change either opacity value
		if(!update){
			//Loop through the calculatedColours object and calculate the colour (lol)
			var x = 0;
			for(var index in $scope.calculatedColours){
				var y = 0;
				for(var colour in $scope.calculatedColours[index]){
					$scope.calculatedColours[index][colour] = getHex(mixColours(whiteBase[x], whiteBase[y], $scope.settings.opacityB));
					y++;
				}
				x++
			}			
		}
		//For when colours are updated by the input fields, only update the colours that are affected
		else{
			//Check that it's a full hex string (eg. "#000000")
			if(currentColour.length === 7){
				var currentBase = applyWhiteBase($scope.getRGB(currentColour), $scope.settings.opacityA);
				var x = 0;

				for(var index in $scope.calculatedColours){

					//If it's that colour's row...
					if(index === currentIndex.toString()){
						
						var y = 0;

						for(var colour in $scope.calculatedColours[index]){
							$scope.calculatedColours[index][colour] = getHex(mixColours(currentBase, whiteBase[y], $scope.settings.opacityB));
							y++;						
						}
					}
					//... otherwise just update the one affect colour in the row
					else{
						var checkIndex = 1;
						for(var colour in $scope.calculatedColours[index]){
							if(checkIndex === currentIndex){
								$scope.calculatedColours[index][colour] = getHex(mixColours(whiteBase[x], currentBase, $scope.settings.opacityB));
							}
							checkIndex++;
						}
					}

					//x here maintains which row it is on
					x++;
				}
			}
		}

	}

	//Fill up those calculated colours on load
	$scope.calcColours(false, null);

	//For getting the RGB value with alpha, placed upon a blank white HTML canvas.
	function applyWhiteBase(rgb, alpha){
		//Invert alpha value
		alpha = 1 - alpha;

		return [
			Math.round(((1 - alpha) * rgb[0]) + (alpha * 255)),
			Math.round(((1 - alpha) * rgb[1]) + (alpha * 255)),
			Math.round(((1 - alpha) * rgb[2]) + (alpha * 255))
		];
	}

	//For mixing an already white-based colour with another colour along with its alpha
	function mixColours(one, two, alpha){
		return [
			Math.round(((1 - alpha) * one[0]) + (alpha * two[0])),
			Math.round(((1 - alpha) * one[1]) + (alpha * two[1])),
			Math.round(((1 - alpha) * one[2]) + (alpha * two[2]))
		];
	};

	//Pass in an array of RGB values, it will return the hex value
	function getHex(rgb){
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
	}
});