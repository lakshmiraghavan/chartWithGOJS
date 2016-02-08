/**
 * Created by lakshmi on 1/21/16.
 */

angular.module('minimal', [])
    .directive('goDiagram', function() {
        return {
            restrict: 'E',
            template: '<div></div>',  // just an empty DIV element
            replace: true,
            scope: { model: '=goModel' },
            link: function(scope, element, attrs) {
                console.log("element 0",element[0]);
                var $ = go.GraphObject.make;
                var diagram =  // create a Diagram for the given HTML DIV element
                    $(go.Diagram, element[0],

                        {
                           /* grid : $(go.Panel, "Grid",
                                    { gridCellSize: new go.Size(50, 50) },
                                    $(go.Shape, "BarH", { fill: "lightgreen", interval: 1, height: 25 })
                                ),*/

                            initialContentAlignment : go.Spot.Center,
                            layout : $(go.TreeLayout, { angle: 90, alignment:   go.TreeLayout.AlignmentStart }),

                            nodeTemplate : $(go.Node, "Auto",
                                new go.Binding("location", "loc"),
                                { selectionAdorned: true,  // don't bother with any selection adornment
                                    selectionChanged: function (node) {
                                        var icon = node.findObject("Icon");
                                        if (icon !== null) {
                                            if (node.isSelected)
                                                icon.fill = "#69BB67";
                                            else
                                                icon.fill = "white";
                                        }
                                    }
                                },  // executed when Part.isSelected has changed
                                { fromSpot: go.Spot.TopCenter,  // coming out from right side
                                    toSpot: go.Spot.BottomCenter },
                                new go.Binding("location", "loc", go.Point.parse),
                                { // when the user clicks on a Node, highlight all Links coming out of the node
                                    // and all of the Nodes at the other ends of those Links.
                                    click: function(e, node) { showConnections(node); }  // defined below
                                },
                                $(go.Shape, "RoundedRectangle",
                                    { strokeWidth: 2, stroke: null },
                                    new go.Binding("fill", "color"),
                                    // the Shape.stroke color depends on whether Node.isHighlighted is true
                                    new go.Binding("stroke", "isHighlighted", function(h) { return h ? "#69BB67" : "black"; })
                                        .ofObject()),
                                $(go.TextBlock,
                                    { margin: 10, font: "bold 18px Verdana" },
                                    new go.Binding("text", "name"))
                            ),

                            linkTemplate : $(go.Link,
                                { routing: go.Link.AvoidsNodes , toShortLength: 10, selectable: true },
                                new go.Binding("fromSpot", "fromSpot", go.Spot.parse),
                                new go.Binding("toSpot", "toSpot", go.Spot.parse),

                                $(go.Shape,
                                    { isPanelMain: true, stroke: "black", strokeWidth: 1 },
                                    // the Shape.stroke color depends on whether Link.isHighlighted is true
                                    new go.Binding("stroke", "isHighlighted", function(h) { return h ? "#69BB67" : "black"; })
                                        .ofObject()),
                                $(go.Shape,
                                    { toArrow: "standard", stroke: null, strokeWidth: 0 },
                                    // the Shape.fill color depends on whether Link.isHighlighted is true
                                    new go.Binding("fill", "isHighlighted", function(h) { return h ? "#69BB67" : "black"; })
                                        .ofObject())
                            )


                        });

                diagram.addDiagramListener("click", function(e) {
                    e.diagram.findTreeRoots().each(function(r) { r.expandTree(3); });
                });



                // whenever a GoJS transaction has finished modifying the model, update all Angular bindings
                function updateAngular(e) {
                    if (e.isTransactionFinished) scope.$apply();
                }
                // notice when the value of "model" changes: update the Diagram.model
                scope.$watch("model", function(newmodel) {
                    var oldmodel = diagram.model;
                    if (oldmodel !== newmodel) {
                        if (oldmodel) oldmodel.removeChangedListener(updateAngular);
                        newmodel.addChangedListener(updateAngular);
                        diagram.model = newmodel;
                    }
                });
                scope.$watch("model.selectedNodeData.name", function(newname) {
                    // disable recursive updates
                    diagram.model.removeChangedListener(updateAngular);
                    // change the name
                    diagram.startTransaction("change name");
                    // the data property has already been modified, so setDataProperty would have no effect
                    var node = diagram.findNodeForData(diagram.model.selectedNodeData);
                    if (node !== null) node.updateTargetBindings("name");
                    diagram.commitTransaction("change name");
                    // re-enable normal updates
                    diagram.model.addChangedListener(updateAngular);
                });
                // update the model when the selection changes
                function showConnections(node) {
                    var diagram = node.diagram;
                    diagram.startTransaction("highlight");
                    // remove any previous highlighting
                    diagram.clearHighlighteds();
                    // for each Link coming out of the Node, set Link.isHighlighted
                    node.findLinksOutOf().each(function(l) { l.isHighlighted = true; });
                    // for each Node destination for the Node, set Node.isHighlighted
                    node.findNodesOutOf().each(function(n) { n.isHighlighted = true; });
                    diagram.commitTransaction("highlight");
                }

                // when the user clicks on the background of the Diagram, remove all highlighting
                diagram.click = function(e) {
                    diagram.startTransaction("no highlighteds");
                    diagram.clearHighlighteds();
                    diagram.commitTransaction("no highlighteds");
                };

            }
        };
    })
    .controller('MinimalCtrl', function($scope) {
        var jsonData= [{"_id":"569961cc6223326017000008","created_at":"2016-01-15T21:17:00.298Z","updated_at":"2016-01-15T21:17:00.297Z","no_of_services":1,"name":"Sales","type":"Core Value","description":"test description","__v":0,
            "services":[{"no_of_capabilities":1,"created_at":"2016-01-15T21:17:00.289Z","updated_at":"2016-01-15T21:17:00.289Z","name":"Configure Offerings","type":"Strategic","category":"FP&A","_id":"569961cb6223326017000004","capabilities":[{"created_at":"2016-01-15T21:17:00.289Z","updated_at":"2016-01-15T21:17:00.288Z","name":"Simplified SW Offers","type":"Operational","description":"test","_id":"569961cb6223326017000005","default_features":[{"name":"Program Eligibility","description":"test","type":"Operational","region_name":"All","region_scope":"Global","_id":"569961cb6223326017000007","status":"Active"},{"name":"Offer Eligibility","description":"test","type":"Operational","region_name":"All","region_scope":"Global","_id":"569961cb6223326017000006","status":"Active"}],"status":"Active"}],"status":"Active"}],"status":"Active"},{"_id":"569feeadc6951fc02677f3b8","created_at":"2016-01-20T20:31:43.433Z","updated_at":"2016-01-20T20:31:43.433Z","no_of_services":2,"name":"Finance","type":"Support","industry":"High-Tech","description":"","__v":0,"services":[{"no_of_capabilities":4,"created_at":"2016-01-20T20:31:43.427Z","updated_at":"2016-01-20T20:31:43.427Z","name":"Physical Asset Recovery & Disposal","type":"Operational","category":"Acquire_To_Retire","shared_service":false,"_id":"569feeadc6951fc02677f3b9","capabilities":[{"created_at":"2016-01-20T20:31:43.428Z","updated_at":"2016-01-20T20:31:43.428Z","name":"Recover Physical Assets","type":"Operational","description":"Involves taking steps to handle the lost, stolen, or damaged goods and establishes programs for reducing and controlling such losses. ","_id":"569feeadc6951fc02677f3bd","default_features":[],"status":"Active"},{"created_at":"2016-01-20T20:31:43.429Z","updated_at":"2016-01-20T20:31:43.429Z","name":"Dispose Assets","type":"Operational","description":"Approvals required for the disposal of a physical asset, and to coordinate other required capabilities, including update of the physical asset register and fixed asset accounting register.","_id":"569feeadc6951fc02677f3bc","default_features":[],"status":"Active"},{"created_at":"2016-01-20T20:31:43.430Z","updated_at":"2016-01-20T20:31:43.430Z","name":"Reconcile Bank Accounts","type":"Operational","description":"Perform period end reconciliation between bank account activities and recorded journal entries.","_id":"569feeadc6951fc02677f3bb","default_features":[],"status":"Active"},{"created_at":"2016-01-20T20:31:43.431Z","updated_at":"2016-01-20T20:31:43.431Z","name":"Manage Bank Accounts","type":"Operational","description":"Define and manage bank accounts (e.g. change signatory, account types, electronic vs. paper statements etc.) according to business needs.","_id":"569feeadc6951fc02677f3ba","default_features":[],"status":"Active"}],"status":"Active"},{"no_of_capabilities":0,"created_at":"2016-01-20T20:31:43.432Z","updated_at":"2016-01-20T20:31:43.432Z","name":"Internal Banks & Reconciliation","type":"Operational","category":"Treasury","description":"Manages in-house bank accounts and support the reconciliation between bank account activities and recorded journal entries.","shared_service":false,"_id":"569feeadc6951fc02677f3be","capabilities":[],"status":"Active"}],"status":"Active"},{"_id":"56a00c2dc6951fc02677f3bf","created_at":"2016-01-20T22:37:33.962Z","updated_at":"2016-01-20T22:37:33.962Z","no_of_services":1,"name":"Supply Chain & Logistics","type":"Support","industry":"High-Tech","description":"","__v":0,"services":[{"name":"Sales","type":"Core Value 115","description":"test description","_id":"56a0179d85b34cc411eb3fdd","capabilities":[{"name":"Simplified SW Offers 987987","type":"Operational","description":"test","_id":"56a0179d85b34cc411eb3fde","default_features":[],"status":"Active"}],"status":"Active"},{"name":"Software Fulfillment","type":"Operational","category":"Supply Chain & Logistics","_id":"56a00c2dc6951fc02677f3c0","capabilities":[{"name":"Disti RTM for SW","type":"Operational","description":"To Enable Disti Fulfiullment of SW Sales 111111","_id":"56a00c2dc6951fc02677f3c2","default_features":[],"status":"Active"},{"name":"Simplified Provisioing & APIs 123","type":"Operational","description":"Deliver B2B APIs that support a simplified subscription provisioning capability for each Subscription SW Offer type, that support every offer within each Subscription offer type.","_id":"56a00c2dc6951fc02677f3c1","default_features":[],"status":"Active"}],"status":"Active"}],"status":"Active"}];



        var myArr=[{key:0,parent:-1, name:"function", color: "#FFFFFF",loc: new go.Point(0, 0)}];
        var count = 0, fnParent, servParent;
        for(var i=0; i<jsonData.length; i++) {
            var obj = {};
            obj["key"] = ++count;
            //  console.log(jsonData[0].name)
            obj["parent"] = myArr[0].key;
            fnParent = obj["key"];
            obj["name"] = jsonData[i].name;
            obj['fromSpot'] = "TopCenter";
            obj['toSpot'] = "BottomCenter";
            obj["color"] =  "#FFFFFF";
            obj['loc'] =  new go.Point(0, 0)
            myArr.push(obj);
            //  console.log( "name: ",  jsonData[i].name, "  :  ","services",jsonData[i].services[0].name);
            obj = {};

            for (var j = 0; j < jsonData[i].services.length; j++) {
                obj["name"] = jsonData[i].services[j].name;
                obj["key"] = ++count
                servParent = obj["key"];
                obj["parent"] = fnParent;
                obj["color"] = "#FFFFFF";
                obj['fromSpot'] = "TopCenter";
                obj['toSpot'] = "BottomCenter";
                obj['loc'] =  new go.Point(100, 50)
                myArr.push(obj);
                obj = {};

                for (var k = 0; k < jsonData[i].services[j].capabilities.length; k++) {
                    obj["key"] = ++count;
                    obj["parent"] = servParent;
                    obj["name"] = jsonData[i].services[j].capabilities[k].name;
                    obj["color"] = "#FFFFFF";
                    obj['fromSpot'] = "TopCenter";
                    obj['toSpot'] = "BottomCenter";
                    obj['loc'] =  new go.Point(200, 100)
                    myArr.push(obj);
                }
            }
        }

       // myArr.shift();

       // console.log(myArr)
       // console.log("arr length",myArr.length)

        var fromToArray = [];

        for(var i=0; i< myArr.length; i++){

            var obj = {};
            obj["from"] = myArr[i]['parent'];
            obj["to"] = myArr[i]['key'];
            obj['fromSpot'] = myArr[i]['fromSpot'];
            obj['toSpot'] = myArr[i]['toSpot'];
            fromToArray.push(obj);
        }

        console.log(fromToArray)


       /* var arr2=    [{ from:-1,  to:0},  { from:0,  to:1},  { from:1,  to:2}, { from:2,  to:3}, { from:0,  to:4},
             { from:4,  to:5},  { from:4,  to:10}, { from:4,  to:10}, { from:4,  to:10}, { from:4,  to:10},
            { from:4,  to:10}, { from:0,  to:11}, { from:11,  to:12},  { from:11,  to:14},  { from:11,  to:14},
             { from:14,  to:16},  { from:14,  to:16}]*/


         $scope.model = new go.GraphLinksModel(myArr, fromToArray);





         $scope.model.selectedNodeData = null;
    });

