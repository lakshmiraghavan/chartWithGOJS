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
                            nodeTemplate : /*$(go.Node, "Vertical",
                              //  { background: "#44CCFF" },
                                $(go.Panel, "Auto",
                                    $(go.Shape, "RoundedRectangle", { fill: null },  new go.Binding("fill", "color")),
                                    $(go.TextBlock,{ margin: 15 },
                                        new go.Binding("text", "name"))
                                )

                            ),*/

                                $(go.Node, "Auto",
                                    { desiredSize: new go.Size(180, 50) },  // on Panel
                                    $(go.Shape, "RoundedRectangle",{stroke: null},
                new go.Binding("fill", "color")),
                                    $(go.TextBlock,
                                        { margin: 5 },
                                        new go.Binding("text", "name"))
                                ),

                            linkTemplate: $(go.Link,
                                { routing: go.Link.Orthogonal },
                                new go.Binding("routing", "routing"),
                                $(go.Shape, {stroke:"#76C277" }),
                                $(go.Shape, { toArrow: "Standard" }, {fill:"#76C277"},{stroke: null})
                            ),
                            initialContentAlignment: go.Spot.Center, // center Diagram contents

                            layout: $(go.TreeLayout, // specify a Diagram.layout that arranges trees
                                { angle: 360, layerSpacing: 150 })

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
                diagram.addDiagramListener("ChangedSelection", function(e) {
                    var selnode = diagram.selection.first();
                    diagram.model.selectedNodeData = (selnode instanceof go.Node ? selnode.data : null);
                    scope.$apply();
                });
            }
        };
    })
    .controller('MinimalCtrl', function($scope) {
        var jsonData= [{"_id":"569961cc6223326017000008","created_at":"2016-01-15T21:17:00.298Z","updated_at":"2016-01-15T21:17:00.297Z","no_of_services":1,"name":"Sales","type":"Core Value","description":"test description","__v":0,
            "services":[{"no_of_capabilities":1,"created_at":"2016-01-15T21:17:00.289Z","updated_at":"2016-01-15T21:17:00.289Z","name":"Configure Offerings","type":"Strategic","category":"FP&A","_id":"569961cb6223326017000004","capabilities":[{"created_at":"2016-01-15T21:17:00.289Z","updated_at":"2016-01-15T21:17:00.288Z","name":"Simplified SW Offers","type":"Operational","description":"test","_id":"569961cb6223326017000005","default_features":[{"name":"Program Eligibility","description":"test","type":"Operational","region_name":"All","region_scope":"Global","_id":"569961cb6223326017000007","status":"Active"},{"name":"Offer Eligibility","description":"test","type":"Operational","region_name":"All","region_scope":"Global","_id":"569961cb6223326017000006","status":"Active"}],"status":"Active"}],"status":"Active"}],"status":"Active"},{"_id":"569feeadc6951fc02677f3b8","created_at":"2016-01-20T20:31:43.433Z","updated_at":"2016-01-20T20:31:43.433Z","no_of_services":2,"name":"Finance","type":"Support","industry":"High-Tech","description":"","__v":0,"services":[{"no_of_capabilities":4,"created_at":"2016-01-20T20:31:43.427Z","updated_at":"2016-01-20T20:31:43.427Z","name":"Physical Asset Recovery & Disposal","type":"Operational","category":"Acquire_To_Retire","shared_service":false,"_id":"569feeadc6951fc02677f3b9","capabilities":[{"created_at":"2016-01-20T20:31:43.428Z","updated_at":"2016-01-20T20:31:43.428Z","name":"Recover Physical Assets","type":"Operational","description":"Involves taking steps to handle the lost, stolen, or damaged goods and establishes programs for reducing and controlling such losses. ","_id":"569feeadc6951fc02677f3bd","default_features":[],"status":"Active"},{"created_at":"2016-01-20T20:31:43.429Z","updated_at":"2016-01-20T20:31:43.429Z","name":"Dispose Assets","type":"Operational","description":"Approvals required for the disposal of a physical asset, and to coordinate other required capabilities, including update of the physical asset register and fixed asset accounting register.","_id":"569feeadc6951fc02677f3bc","default_features":[],"status":"Active"},{"created_at":"2016-01-20T20:31:43.430Z","updated_at":"2016-01-20T20:31:43.430Z","name":"Reconcile Bank Accounts","type":"Operational","description":"Perform period end reconciliation between bank account activities and recorded journal entries.","_id":"569feeadc6951fc02677f3bb","default_features":[],"status":"Active"},{"created_at":"2016-01-20T20:31:43.431Z","updated_at":"2016-01-20T20:31:43.431Z","name":"Manage Bank Accounts","type":"Operational","description":"Define and manage bank accounts (e.g. change signatory, account types, electronic vs. paper statements etc.) according to business needs.","_id":"569feeadc6951fc02677f3ba","default_features":[],"status":"Active"}],"status":"Active"},{"no_of_capabilities":0,"created_at":"2016-01-20T20:31:43.432Z","updated_at":"2016-01-20T20:31:43.432Z","name":"Internal Banks & Reconciliation","type":"Operational","category":"Treasury","description":"Manages in-house bank accounts and support the reconciliation between bank account activities and recorded journal entries.","shared_service":false,"_id":"569feeadc6951fc02677f3be","capabilities":[],"status":"Active"}],"status":"Active"},{"_id":"56a00c2dc6951fc02677f3bf","created_at":"2016-01-20T22:37:33.962Z","updated_at":"2016-01-20T22:37:33.962Z","no_of_services":1,"name":"Supply Chain & Logistics","type":"Support","industry":"High-Tech","description":"","__v":0,"services":[{"name":"Sales","type":"Core Value 115","description":"test description","_id":"56a0179d85b34cc411eb3fdd","capabilities":[{"name":"Simplified SW Offers 987987","type":"Operational","description":"test","_id":"56a0179d85b34cc411eb3fde","default_features":[],"status":"Active"}],"status":"Active"},{"name":"Software Fulfillment","type":"Operational","category":"Supply Chain & Logistics","_id":"56a00c2dc6951fc02677f3c0","capabilities":[{"name":"Disti RTM for SW","type":"Operational","description":"To Enable Disti Fulfiullment of SW Sales 111111","_id":"56a00c2dc6951fc02677f3c2","default_features":[],"status":"Active"},{"name":"Simplified Provisioing & APIs 123","type":"Operational","description":"Deliver B2B APIs that support a simplified subscription provisioning capability for each Subscription SW Offer type, that support every offer within each Subscription offer type.","_id":"56a00c2dc6951fc02677f3c1","default_features":[],"status":"Active"}],"status":"Active"}],"status":"Active"}];



        var myArr=[{key:0,parent:-1, name:"function", color: "#69BB67"}];
        var count = 0, fnParent, servParent;
        for(var i=0; i<jsonData.length; i++) {
            var obj = {};
            obj["key"] = ++count;
            //  console.log(jsonData[0].name)
            obj["parent"] = myArr[0].key;
            fnParent = obj["key"];
            obj["name"] = jsonData[i].name;
            obj["color"] =  "#EAE693"
            myArr.push(obj);
            //  console.log( "name: ",  jsonData[i].name, "  :  ","services",jsonData[i].services[0].name);
            obj = {};

            for (var j = 0; j < jsonData[i].services.length; j++) {
                obj["name"] = jsonData[i].services[j].name;
                obj["key"] = ++count
                servParent = obj["key"];
                obj["parent"] = fnParent;
                obj["color"] = "#9AD1DA";
                myArr.push(obj);
                obj = {};

                for (var k = 0; k < jsonData[i].services[j].capabilities.length; k++) {
                    obj["key"] = ++count;
                    obj["parent"] = servParent;
                    obj["name"] = jsonData[i].services[j].capabilities[k].name;
                    obj["color"] = "#69BB67";
                    myArr.push(obj);
                }
            }
        }


       // console.log("arr length",myArr.length)

      var  uniqueArray = myArr.filter(function(item, pos, self) {
            return self.indexOf(item) == pos;
        })

        console.log("unique",uniqueArray)

        var fromToArray = [];

        for(var i=0; i< uniqueArray.length; i++){

            var obj = {};
            obj["from"] = uniqueArray[i]['parent'];
            obj["to"] = uniqueArray[i]['key'];
            fromToArray.push(obj);
        }

        console.log("Link array",fromToArray)

         $scope.model = new go.GraphLinksModel(uniqueArray,fromToArray);

        console.log($scope.model);



         $scope.model.selectedNodeData = null;
    });

