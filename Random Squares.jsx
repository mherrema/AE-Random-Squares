(function (thisObj) {

    scriptBuildUI(thisObj)

    function scriptBuildUI(thisObj) {
        var win = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Random Squares", undefined);
        win.spacing = 10;
        win.orientation = "column";

        var sliderSize = "width: 250, height: 20";
        var textBoxSize = "width: 30, height: 20";

        //how many squares are there?
        squareCount = setupSlider(52, 0, 100, "Number of Squares");
        //how many random squares should be lit up each beat
        squaresLit = setupSlider(26, 0, 100, "Squares Lit");
        minIntensity = setupSlider(0, 0, 100, "Minimum Value");
        maxIntensity = setupSlider(100, 0, 100, "Maximum Value");
        bpm = setupSlider(60, 0, 200, "BPM");

        var checkbox1 = win.add("checkbox", undefined, "Change Per Measure");
        checkbox1.value = false;
        checkbox1.alignment = "left";
        var checkbox2 = win.add("checkbox", undefined, "Fade");
        checkbox2.value = true;
        checkbox2.alignment = "left";

        function setupSlider(val, min, max, title) {
            var m = win.add("statictext", undefined, title);
            m.alignment = "left";
            var group = win.add("group");
            group.orientation = "row";
            group.alignment = "left";
            var f = group.add("edittext", undefined, val);
            var t = group.add("slider", undefined, val, min, max);
            t.value = val;
            t.onChanging = function () {
                f.text = Math.floor(t.value);
            }
            f.onChanging = function () {
                t.value = Number(f.text)
            }
            t.size = sliderSize;
            f.size = textBoxSize;
            return t;
        }

        var groupThree = win.add("group", undefined, "GroupThree");
        groupThree.orientation = "column";
        var button = groupThree.add("button", undefined, "Go");
        button.onClick = function () {
            randomizeSquares(squareCount.value, squaresLit.value, minIntensity.value, maxIntensity.value, bpm.value, checkbox2.value, checkbox1.value);
        }

        function randomizeSquares(squareCount, squaresLit, minIntensity, maxIntensity, bpm, fade, changePerMeasure) {
            //normalize inputs
            squareCount = Math.floor(squareCount);
            squaresLit = Math.floor(squaresLit);
            minIntensity = Math.floor(minIntensity);
            maxIntensity = Math.floor(maxIntensity);
            bpm = Math.floor(bpm);
            
            //time in seconds of a beat
            var interval = 60/bpm;
            if (changePerMeasure) {
                interval = interval * 4;
            }

            //how many iterations to perform
            var count = 30;
            var shortenTransitions = !fade;

            //setup up square layer properties into array
            var squares = [];
            for (var i = 1; i < squareCount + 1; i++) {
                squares.push(app.project.activeItem.layer(i).opacity);
            }

            //clear out existing keyframes
            for (var k = 0; k < squares.length; k++) {
                for (i = squares[k].numKeys; i != 0; i--) {
                    squares[k].removeKey(i); // Remove the current Keyframe
                }
            }

            //loop through number of iterations
            for (var j = 0; j < count; j++) {
                //loop through all the squares
                var tmpSquares = getRandom(squares, squareCount);
                for (var k = 0; k < squares.length; k++) {
                    var intensity = 0;
                    if (k < squaresLit - 1) {
                        intensity = maxIntensity;
                    } else {
                        intensity = minIntensity;
                    }
                    //set intensity for square
                    tmpSquares[k].setValueAtTime(j * interval, intensity);
                    if (shortenTransitions) {
                        tmpSquares[k].setValueAtTime((j * interval) + (interval * .95), intensity);
                    }
                }
            }
        }


        function getRandom(arr, n) {
            var result = new Array(n),
                len = arr.length,
                taken = new Array(len);
            if (n > len)
                throw new RangeError("getRandom: more elements taken than available");
            while (n--) {
                var x = Math.floor(Math.random() * len);
                result[n] = arr[x in taken ? taken[x] : x];
                taken[x] = --len in taken ? taken[len] : len;
            }
            return result;
        }

        win.onResizing = win.onResize = function () {
            this.layout.resize();
        };

        win instanceof Window
            ?
            (win.center(), win.show()) : (win.layout.layout(true), win.layout.resize());
    }


})(this);
