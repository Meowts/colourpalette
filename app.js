

var app = angular.module('colours', []);

app.controller('ColourCtrl', function($scope){
	$scope.bottomTable = {
		row1 : ['black','c1','c2','c3','c4','c5','c6','c7'],
		row2 : ['c1','c1','c1','c1','c1','c1','c1', 'c1'],
		row3 : ['c2','c2','c2','c2','c2','c2','c2', 'c2'],
		row4 : ['c3','c3','c3','c3','c3','c3','c3', 'c3'],
		row5 : ['c4','c4','c4','c4','c4','c4','c4', 'c4'],
		row6 : ['c5','c5','c5','c5','c5','c5','c5', 'c5'],
		row7 : ['c6','c6','c6','c6','c6','c6','c6', 'c6'],
		row8 : ['c7','c7','c7','c7','c7','c7','c7', 'c7']
	};
	$scope.topTable = {
		row1 : ['black','c1','c2','c3','c4','c5','c6','c7'],
		row2 : ['','c1','c2','c3','c4','c5','c6','c7'],
		row3 : ['','c1','c2','c3','c4','c5','c6','c7'],
		row4 : ['','c1','c2','c3','c4','c5','c6','c7'],
		row5 : ['','c1','c2','c3','c4','c5','c6','c7'],
		row6 : ['','c1','c2','c3','c4','c5','c6','c7'],
		row7 : ['','c1','c2','c3','c4','c5','c6','c7'],
		row8 : ['','c1','c2','c3','c4','c5','c6','c7']
	}

	$scope.colours = {
		black : "#000000",
		c1 : "#FFFFFF",
		c2 : "#B200FF",
		c3 : "#0094FF",
		c4 : "#00FF21",
		c5 : "#FFD800",
		c6 : "#FF6A00",
		c7 : "#FF0000"
	}

	$scope.settings = {
		opacityA : 0.7,
		opacityB : 0.3
	}
});