(function (thisObj) {

    scriptBuildUI(thisObj)

    function scriptBuildUI(thisObj) {
        var win = (thisObj instanceof Panel) ? thisObj : new Window('palette', "Setup Panels", undefined);
        win.spacing = 10;
        win.orientation = "column";

        var tpanel = win.add('tabbedpanel');
        var panelTab = tpanel.add('tab', undefined, "Panels");

        var shapesTab = tpanel.add('tab', undefined, "Shapes");

        var sliderSize = "width: 250, height: 20";
        var textBoxSize = "width: 30, height: 20";

        panelCount = setupSlider(11, 0, 15, "Number of Panels", panelTab);
        panelWidth = setupSlider(291, 0, 350, "Panel Width", panelTab);
        panelHeight = setupSlider(720, 0, 1024, "Panel Height", panelTab);
        panelOffset = setupSlider(19, 0, 30, "Panel Offset", panelTab);

        horizontalShapes = setupSlider(3, 0, 10, "Horizontal Shapes", shapesTab);
        verticalShapes = setupSlider(3, 0, 10, "Vertical Shapes", shapesTab);

        function setupSlider(val, min, max, title, window) {
            var m = window.add("statictext", undefined, title);
            m.alignment = "left";
            var group = window.add("group");
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
            // randomizeSquares(squareCount.value, squaresLit.value, minIntensity.value, maxIntensity.value, bpm.value, checkbox2.value, checkbox1.value);
            createPanels(panelCount.value, panelWidth.value, panelHeight.value, panelOffset.value, horizontalShapes.value, verticalShapes.value);
        }


        function createPanels(panelCount, panelWidth, panelHeight, panelOffset, horizontalShapes, verticalShapes) {

            var curComp = app.project.activeItem;

            if (curComp) {
                panelCount = Math.floor(panelCount);
                panelWidth = Math.floor(panelWidth);
                panelHeight = Math.floor(panelHeight);
                panelOffset = Math.floor(panelOffset);
                horizontalShapes = Math.floor(horizontalShapes);
                verticalShapes = Math.floor(verticalShapes);

                var shapeWidth = panelWidth / horizontalShapes;
                var shapeHeight = panelHeight / verticalShapes;

                //set composition size
                curComp.width = ((panelCount * panelWidth) + (panelOffset * (panelCount - 1)));
                curComp.height = panelHeight;

                var left = 0;
                for (var i = 0; i < panelCount; i++) {
                    addPanel(curComp, left, shapeWidth, shapeHeight, horizontalShapes, verticalShapes);
                    left += (panelWidth + panelOffset);
                }
            }
        }

        function addPanel(comp, panelLeft, shapeWidth, shapeHeight, horizontalShapes, verticalShapes) {
            var top = 0;
            for (var i = 0; i < verticalShapes; i++) {
                var left = panelLeft;
                for (var j = 0; j < horizontalShapes; j++) {
                    addShape(comp, shapeWidth, shapeHeight, left, top);
                    left += shapeWidth;
                }
                top += shapeHeight;
            }
        }

        function addShape(comp, width, height, left, top) {
            var shapeLayer = comp.layers.addShape();
            var shapeGroup = shapeLayer.property("Contents").addProperty("ADBE Vector Group");
            shapeGroup.property("Contents").addProperty("ADBE Vector Shape - Rect");
            shapeGroup.property("Contents").addProperty("ADBE Vector Graphic - Fill");
            var color = shapeGroup.property("Contents").property("Fill 1").property("Color");
            color.setValue([1, 1, 1, 1]);
            var rect = shapeGroup.property("Contents").property("Rectangle Path 1");
            rect.size.setValue([width, height]);

            var anchorPoint = shapeLayer.property("Transform").property("Anchor Point");
            var leftAnchor = width / 2 * -1;
            var topAnchor = height / 2 * -1;
            anchorPoint.setValue([leftAnchor, topAnchor]);

            shapeLayer.position.setValue([left, top]);
        }

        win.onResizing = win.onResize = function () {
            this.layout.resize();
        };

        win instanceof Window
            ?
            (win.center(), win.show()) : (win.layout.layout(true), win.layout.resize());
    }
})(this);