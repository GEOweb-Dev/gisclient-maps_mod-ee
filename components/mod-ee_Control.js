// *******************************************************************************************
//********************************************************************************************
//**** Plugin for GEOweb - Electrical networks functionalities (mod-ee)
//********************************************************************************************

// **** Toolbar integration
$(function(){
    window.GCComponents["QueryToolbar.Actions"].addAction(
        'mod-ee_circuit',
        function(featureType, feature) {
            var selectControls = feature.layer.map.getControlsBy('gc_id', 'control-querytoolbar');
            if (clientConfig.MOD_EE_LINE_LAYERS.includes(featureType.typeName) || clientConfig.MOD_EE_SUBSTATION_LAYERS.includes(featureType.typeName)) {
                return '<a class="olControlButtonItemInactive olButton olLikeButton" href="#" featureType="' + featureType.typeName
                + '" featureId="' + feature.id
                +'" action="mod-ee_circuit" title="Circuiti/Sezioni"><span class="glyphicon-white glyphicon-random"></span></a>';
            }
            return "";
        },
        function(featureTypeName, featureId, objQueryToolbar) {
            if(featureId && featureTypeName) {
                var fType = GisClientMap.getFeatureType(featureTypeName);
                var panelElement = document.getElementById('actionpanel_' + featureTypeName + '-' + featureId);
                if (panelElement.getAttribute('actionvalue') == 'mod-ee_showPanel') {
                    panelElement.setAttribute('actionvalue', '');
                    panelElement.setAttribute('feature-col', '');
                    panelElement.innerHTML = '';
                    panelElement.classList.add('actionpanel_hidden');
                    window.GCComponents.Functions.modEEClear();
                }
                else {
                    panelElement.classList.remove('actionpanel_hidden');
                    panelElement.setAttribute('feature-col', 'Circuiti');
                    panelElement.setAttribute('actionvalue',  'mod-ee_showPanel');
                    panelElement.innerHTML = 'N.A.';
                    var elFeature = objQueryToolbar.findFeature(featureId);
                    if (clientConfig.MOD_EE_SUBSTATION_LAYERS.includes(featureTypeName)) {
                        window.GCComponents.Functions.modEEDisplaySubstationCircuits(elFeature, panelElement);
                    }
                    else {
                        window.GCComponents.Functions.modEEDisplayCircuit(elFeature, panelElement);
                        window.GCComponents.Functions.modEEDisplaySection(elFeature, panelElement);
                    }
                };
            }
        }
    );
});

window.GCComponents["Layers"].addLayer('layer-ee_circuit-highlight', {
    displayInLayerSwitcher:false,
    styleMap: new OpenLayers.StyleMap({
        'default': {
            fill: false,
            fillOpacity: 0.7,
            hoverFillColor: clientConfig.MOD_EE_CIRCUIT_COLOR,
            hoverFillOpacity: 0.9,
            fillColor: clientConfig.MOD_EE_CIRCUIT_COLOR,
            strokeColor: clientConfig.MOD_EE_CIRCUIT_COLOR,
            strokeOpacity: 0.7,
            strokeWidth: clientConfig.MOD_EE_CIRCUIT_WIDTH,
            strokeLinecap: "round",
            strokeDashstyle: "solid",
            hoverStrokeColor: clientConfig.MOD_EE_CIRCUIT_COLOR,
            hoverStrokeOpacity: 1,
            hoverStrokeWidth: clientConfig.MOD_EE_CIRCUIT_WIDTH,
            pointRadius: clientConfig.MOD_EE_CIRCUIT_WIDTH,
            hoverPointRadius: 1,
            hoverPointUnit: "%",
            pointerEvents: "visiblePainted",
            cursor: "inherit"
        },
        'select': {
            fill: true,
            fillColor: clientConfig.MOD_EE_CIRCUIT_COLOR,
            fillOpacity: 0.9,
            hoverFillColor: clientConfig.MOD_EE_CIRCUIT_COLOR,
            hoverFillOpacity: 0.9,
            strokeColor: clientConfig.MOD_EE_CIRCUIT_COLOR,
            strokeOpacity: 1,
            strokeWidth: clientConfig.MOD_EE_CIRCUIT_WIDTH,
            strokeLinecap: "round",
            strokeDashstyle: "solid",
            hoverStrokeColor: clientConfig.MOD_EE_CIRCUIT_COLOR,
            hoverStrokeOpacity: 1,
            hoverStrokeWidth: clientConfig.MOD_EE_CIRCUIT_WIDTH,
            pointRadius: 8,
            hoverPointRadius: 1,
            hoverPointUnit: "%",
            pointerEvents: "visiblePainted",
            cursor: "pointer"
        },
        'temporary': {
            fill: true,
            fillColor: "EEA652",
            fillOpacity: 0.2,
            hoverFillColor: "white",
            hoverFillOpacity: 0.8,
            strokeColor: "#EEA652",
            strokeOpacity: 1,
            strokeLinecap: "round",
            strokeWidth: 4,
            strokeDashstyle: "solid",
            hoverStrokeColor: "red",
            hoverStrokeOpacity: 1,
            hoverStrokeWidth: 0.2,
            pointRadius: 6,
            hoverPointRadius: 1,
            hoverPointUnit: "%",
            pointerEvents: "visiblePainted",
            cursor: "pointer"
        }
    })
}, {
    "featureadded": function(obj) {

    },
    "refresh": function(obj) {
        this.redraw();
        var layerExtent = null;
        if (this.features.length > 0) {
            var layerExtent = this.getDataExtent();
            if (!layerExtent.intersectsBounds(this.map.getMaxExtent())) {
                layerExtent = null;
            }
        }
        if (layerExtent) {
            this.map.zoomToExtent(layerExtent);
        }
        window.GCComponents.Functions.modEESectionsPanel(this);
    }
});

window.GCComponents["Layers"].addLayer('layer-ee_section-highlight', {
    displayInLayerSwitcher:false,
    styleMap: new OpenLayers.StyleMap({
        'default': {
            fill: false,
            fillColor: "red",
            fillOpacity: 0.7,
            hoverFillColor: clientConfig.MOD_EE_SECTION_COLOR,
            hoverFillOpacity: 0.9,
            fillColor: clientConfig.MOD_EE_SECTION_COLOR,
            strokeColor: clientConfig.MOD_EE_SECTION_COLOR,
            strokeOpacity: 0.7,
            strokeWidth: clientConfig.MOD_EE_SECTION_WIDTH,
            strokeLinecap: "round",
            strokeDashstyle: "solid",
            hoverStrokeColor: clientConfig.MOD_EE_SECTION_COLOR,
            hoverStrokeOpacity: 1,
            hoverStrokeWidth: clientConfig.MOD_EE_SECTION_WIDTH,
            pointRadius: clientConfig.MOD_EE_SECTION_WIDTH,
            hoverPointRadius: 1,
            hoverPointUnit: "%",
            pointerEvents: "visiblePainted",
            cursor: "inherit"
        },
        'select': {
            fill: true,
            fillColor: clientConfig.MOD_EE_SECTION_COLOR,
            fillOpacity: 0.9,
            hoverFillColor: clientConfig.MOD_EE_SECTION_COLOR,
            hoverFillOpacity: 0.9,
            strokeColor: clientConfig.MOD_EE_SECTION_COLOR,
            strokeOpacity: 1,
            strokeWidth: clientConfig.MOD_EE_SECTION_WIDTH,
            strokeLinecap: "round",
            strokeDashstyle: "solid",
            hoverStrokeColor: clientConfig.MOD_EE_SECTION_COLOR,
            hoverStrokeOpacity: 1,
            hoverStrokeWidth: clientConfig.MOD_EE_SECTION_WIDTH,
            pointRadius: 8,
            hoverPointRadius: 1,
            hoverPointUnit: "%",
            pointerEvents: "visiblePainted",
            cursor: "pointer"
        },
        'temporary': {
            fill: true,
            fillColor: "EEA652",
            fillOpacity: 0.2,
            hoverFillColor: "white",
            hoverFillOpacity: 0.8,
            strokeColor: "#EEA652",
            strokeOpacity: 1,
            strokeLinecap: "round",
            strokeWidth: 4,
            strokeDashstyle: "solid",
            hoverStrokeColor: "red",
            hoverStrokeOpacity: 1,
            hoverStrokeWidth: 0.2,
            pointRadius: 6,
            hoverPointRadius: 1,
            hoverPointUnit: "%",
            pointerEvents: "visiblePainted",
            cursor: "pointer"
        }
    })
}, {
    "featureadded": function(obj) {

    },
    "refresh": function(obj) {
        this.redraw();
        var layerExtent = null;
        if (this.features.length > 0) {
            var layerExtent = this.getDataExtent();
            if (!layerExtent.intersectsBounds(this.map.getMaxExtent())) {
                layerExtent = null;
            }
        }
        if (layerExtent) {
            this.map.zoomToExtent(layerExtent);
        }
        window.GCComponents.Functions.modEESectionsPanel(this, true);
    }
});

window.GCComponents["Layers"].addLayer('layer-ee_pod-highlight', {
    displayInLayerSwitcher:false,
    styleMap: new OpenLayers.StyleMap({
        'default': {
            fill: false,
            fillOpacity: 0.7,
            hoverFillColor: clientConfig.MOD_EE_POD_COLOR,
            hoverFillOpacity: 0.9,
            fillColor: clientConfig.MOD_EE_POD_COLOR,
            strokeColor: clientConfig.MOD_EE_POD_COLOR,
            strokeOpacity: 0.7,
            strokeWidth: clientConfig.MOD_EE_POD_WIDTH,
            strokeLinecap: "round",
            strokeDashstyle: "solid",
            hoverStrokeColor: clientConfig.MOD_EE_POD_COLOR,
            hoverStrokeOpacity: 1,
            hoverStrokeWidth: clientConfig.MOD_EE_POD_WIDTH,
            pointRadius: clientConfig.MOD_EE_POD_WIDTH,
            hoverPointRadius: 1,
            hoverPointUnit: "%",
            pointerEvents: "visiblePainted",
            cursor: "inherit"
        },
        'select': {
            fill: true,
            fillColor: clientConfig.MOD_EE_POD_COLOR,
            fillOpacity: 0.9,
            hoverFillColor: clientConfig.MOD_EE_POD_COLOR,
            hoverFillOpacity: 0.9,
            strokeColor: clientConfig.MOD_EE_POD_COLOR,
            strokeOpacity: 1,
            strokeWidth: clientConfig.MOD_EE_POD_WIDTH,
            strokeLinecap: "round",
            strokeDashstyle: "solid",
            hoverStrokeColor: clientConfig.MOD_EE_POD_COLOR,
            hoverStrokeOpacity: 1,
            hoverStrokeWidth: clientConfig.MOD_EE_POD_WIDTH,
            pointRadius: 8,
            hoverPointRadius: 1,
            hoverPointUnit: "%",
            pointerEvents: "visiblePainted",
            cursor: "pointer"
        },
        'temporary': {
            fill: true,
            fillColor: "EEA652",
            fillOpacity: 0.2,
            hoverFillColor: "white",
            hoverFillOpacity: 0.8,
            strokeColor: "#EEA652",
            strokeOpacity: 1,
            strokeLinecap: "round",
            strokeWidth: 4,
            strokeDashstyle: "solid",
            hoverStrokeColor: "red",
            hoverStrokeOpacity: 1,
            hoverStrokeWidth: 0.2,
            pointRadius: 6,
            hoverPointRadius: 1,
            hoverPointUnit: "%",
            pointerEvents: "visiblePainted",
            cursor: "pointer"
        }
    })
}, {
    "featureadded": function(obj) {

    },
    "featureremoved": function(obj) {
        this.dataTable = this.dataTable.filter(function( dataObj ) {
            return dataObj.gc_objid !== obj.feature.attributes.gc_objid;
        });
        this.refresh();
    },
    "sketchcomplete": function(obj) {
        this.displayRelation = true;
        var selectionBox = obj.feature.geometry.getBounds();

        var fields = ['ST_XMin(ST_GeomFromText(gc_geom))', 'ST_XMax(ST_GeomFromText(gc_geom))', 'ST_YMin(ST_GeomFromText(gc_geom))', 'ST_YMax(ST_GeomFromText(gc_geom))'];
        var ops = ['>','<','>','<'];
        var values = [selectionBox.left,selectionBox.right,selectionBox.bottom,selectionBox.top];
        window.GCComponents.Functions.modEEHighlight.call(this,clientConfig.MOD_EE_POD_LAYERS,fields,values,'layer-ee_pod-highlight',ops,clientConfig.MOD_EE_POD_RELATION);

        var mod_ee_ToolbarControl = this.map.getControlsBy('gc_id', 'control-mod-ee-toolbar');
        if (mod_ee_ToolbarControl.length == 1) {
            if (mod_ee_ToolbarControl[0].controls.length > 2) {
                mod_ee_ToolbarControl[0].controls[4].deactivate();
            }
        }
        return false;
    },
    "refresh": function(obj) {
        this.redraw();
        var layerExtent = null;
        if (this.features.length > 0) {
            var layerExtent = this.getDataExtent();
            if (!layerExtent.intersectsBounds(this.map.getMaxExtent())) {
                layerExtent = null;
            }
        }
        if (layerExtent) {
            this.map.zoomToExtent(layerExtent);
        }
        if (this.relationName && this.features.length > 0 && this.dataTable.length > 0 && this.displayRelation) {
            window.GCComponents.Functions.modEEShowRelation(this.features[0].featureTypeName, this.dataTable, this.relationName);
            var selectPod = this.map.getControlsBy('gc_id', 'control-mod-ee-selectpod')[0];
            selectPod.activate();
        }
        window.GCComponents.Functions.modEESectionsPanel(null);
    }
});

window.GCComponents["Controls"].addControl('control-mod-ee-selectpod', function(map){
    var podsLayer = GisClientMap.map.getLayersByName('layer-ee_pod-highlight')[0];
    return new  OpenLayers.Control.SelectFeature(
        podsLayer,
        {
            gc_id: 'control-mod-ee-selectpod',
            multiple: false,
            clickout: true,
            toggle: false,
            box: false,
            hover: false,
            onSelect: function(obj) {
                window.GCComponents.Functions.modEECreatePopup(obj);
            },
            onUnselect: function (obj) {
                window.GCComponents.Functions.modEEDestroyPopup(obj);
            }
        }
    )
});

window.GCComponents["Controls"].addControl('control-mod-ee-toolbar', function(map){
    return new  OpenLayers.Control.Panel({
        gc_id: 'control-mod-ee-toolbar',
        createControlMarkup:customCreateControlMarkup,
        div:document.getElementById("map-toolbar-mod-ee"),
        autoActivate:false,
        saveState:true,
        draw: function() {
            var podLayer = this.map.getLayersByName('layer-ee_pod-highlight')[0];
            var controls = [
                new OpenLayers.Control(
                    {
                        ctrl: this,
                        type: OpenLayers.Control.TYPE_BUTTON ,
                        iconclass:"glyphicon-white glyphicon-random",
                        text:"Circuti",
                        title:"Circuiti",
                        trigger: function () {
                            window.GCComponents.Functions.modEESearchPanel.call(this, clientConfig.MOD_EE_LINE_LAYERS, clientConfig.MOD_EE_LINE_SEARCH_LAYERS, clientConfig.MOD_EE_LINE_SEARCH_FIELDS, window.GCComponents.Functions.modEEHighlight, 'Ricerca Circuito/Sezione', 'layer-ee_circuit-highlight');
                        }
                    }
                )
            ];
            if (clientConfig.MOD_EE_SUBSTATION_LAYERS !== null && clientConfig.MOD_EE_SUBSTATION_LAYERS.length > 0) {
                controls = controls.concat([new OpenLayers.Control(
                    {
                        ctrl: this,
                        type: OpenLayers.Control.TYPE_BUTTON ,
                        iconclass:"glyphicon-white glyphicon-folder-close",
                        text:"Cabine",
                        title:"Cabine",
                        trigger: function () {
                            window.GCComponents.Functions.modEESearchPanel.call(this, clientConfig.MOD_EE_LINE_LAYERS, clientConfig.MOD_EE_SUBSTATION_SEARCH_LAYERS, clientConfig.MOD_EE_SUBSTATION_SEARCH_FIELDS, window.GCComponents.Functions.modEEHighlight, 'Ricerca Circuito per Cabina', 'layer-ee_circuit-highlight', null, clientConfig.MOD_EE_SUBSTATION_CIRCUIT_RELATION, clientConfig.MOD_EE_SUBSTATION_CIRCUIT_SEARCH_FIELD, clientConfig.MOD_EE_SUBSTATION_CIRCUIT_FIELD_LABEL);
                        }
                    }
                )]);
            }
            if (clientConfig.MOD_EE_POD_LAYERS !== null && clientConfig.MOD_EE_POD_LAYERS.length > 0) {
                controls = controls.concat([new OpenLayers.Control(
                    {
                        ctrl: this,
                        type: OpenLayers.Control.TYPE_BUTTON ,
                        iconclass:"glyphicon-white glyphicon-flag",
                        text:"Ricerca POD",
                        title:"Ricerca POD",
                        trigger: function() {
                            GisClientMap.map.getLayersByName('layer-ee_pod-highlight')[0].displayRelation = false;
                            window.GCComponents.Functions.modEESearchPanel.call(this, clientConfig.MOD_EE_POD_LAYERS, clientConfig.MOD_EE_POD_SEARCH_LAYERS, clientConfig.MOD_EE_POD_SEARCH_FIELDS_SINGLE, window.GCComponents.Functions.modEEHighlight, 'Ricerca POD', 'layer-ee_pod-highlight', clientConfig.MOD_EE_POD_RELATION);
                        }
                    }
                ),
                new OpenLayers.Control(
                    {
                        ctrl: this,
                        type: OpenLayers.Control.TYPE_BUTTON ,
                        iconclass:"glyphicon-white glyphicon-list-alt",
                        text:"Lista POD",
                        title:"Lista POD",
                        trigger: function() {
                            GisClientMap.map.getLayersByName('layer-ee_pod-highlight')[0].displayRelation = true;
                            window.GCComponents.Functions.modEESearchPanel.call(this, clientConfig.MOD_EE_POD_LAYERS, clientConfig.MOD_EE_POD_SEARCH_LAYERS, clientConfig.MOD_EE_POD_SEARCH_FIELDS_LIST, window.GCComponents.Functions.modEEHighlight, 'Ricerca POD', 'layer-ee_pod-highlight', clientConfig.MOD_EE_POD_RELATION);
                        }
                    }
                ),
                new OpenLayers.Control.DrawFeature(
                    podLayer,
                    OpenLayers.Handler.RegularPolygon,
                    {
                        handlerOptions: {irregular: true},
                        iconclass:"glyphicon-white glyphicon-unchecked",
                        text:"Selezione POD",
                        title:"Selezione POD",
                        eventListeners: {
                            'activate': function(){
                                this.map.currentControl.deactivate();
                                OpenLayers.Control.DrawFeature.prototype.activate.apply(this);
                                this.map.currentControl=this;
                            },
                            'deactivate': function(){
                                OpenLayers.Control.DrawFeature.prototype.deactivate.apply(this);
                                this.map.currentControl=this.map.defaultControl;
                            },
                        }
                    }
                )]);
            }

            this.addControls(controls);
            OpenLayers.Control.Panel.prototype.draw.apply(this)
        },
        redraw: function () {
            OpenLayers.Control.Panel.prototype.redraw.apply(this);
            var sectPanel = document.createElement("div");
            sectPanel.setAttribute('id', 'mod_ee_circuit_panel');
            this.div.appendChild(sectPanel);
            var sectPanelHeader = document.createElement("div");
            sectPanelHeader.setAttribute('id', 'mod_ee_circuit_panel_header');
            sectPanelHeader.innerHTML = '<a href="#" id="ee-mod_panel_toggle"><span id="ee-mod_panel_toggle_span" class="icon-hide-panel"></span></a><span id="mod_ee_circuit_panel_title">Circuito Selezionato</span>'
            sectPanel.appendChild(sectPanelHeader);
            var sectPanelParentContent = document.createElement("div");
            sectPanelParentContent.setAttribute('id', 'mod_ee_circuit_panel_parent_content');
            sectPanel.appendChild(sectPanelParentContent);
            var sectPanelContent = document.createElement("div");
            sectPanelContent.setAttribute('id', 'mod_ee_circuit_panel_content');
            sectPanel.appendChild(sectPanelContent);
            $("#mod_ee_circuit_panel_header a").click(function() {
                event.stopPropagation();
                if ($("#ee-mod_panel_toggle_span").hasClass('icon-hide-panel')) {
                    $("#ee-mod_panel_toggle_span").removeClass('icon-hide-panel');
                    $("#ee-mod_panel_toggle_span").addClass('icon-show-panel');
                    $('#mod_ee_circuit_panel_parent_content').css('display', 'none');
                    $('#mod_ee_circuit_panel_content').css('display', 'none');
                }
                else {
                    $("#ee-mod_panel_toggle_span").removeClass('icon-show-panel');
                    $("#ee-mod_panel_toggle_span").addClass('icon-hide-panel');
                    $('#mod_ee_circuit_panel_parent_content').css('display', 'block');
                    $('#mod_ee_circuit_panel_content').css('display', 'block');
                }
            });
        }
    })
});

// **** Toolbar button
window.GCComponents["SideToolbar.Buttons"].addButton (
    'button-mod-ee-toolbar',
    'Toolbar Circuiti e Utenze',
    'glyphicon-white glyphicon-flash',
    function() {
        if (sidebarPanel.handleEvent || typeof(sidebarPanel.handleEvent) === 'undefined')
        {
            if (this.active) {
                this.deactivate();
                var mod_ee_ToolbarControl = this.map.getControlsBy('gc_id', 'control-mod-ee-toolbar');
                if (mod_ee_ToolbarControl.length == 1) {
                    mod_ee_ToolbarControl[0].deactivate();
                    this.map.currentControl = this.map.defaultControl;
                }
                window.GCComponents.Functions.modEEClear();
            }
            else
            {
                this.activate();
                var mod_ee_ToolbarControl = this.map.getControlsBy('gc_id', 'control-mod-ee-toolbar');
                if (mod_ee_ToolbarControl.length == 1) {
                    mod_ee_ToolbarControl[0].activate();
                    if (mod_ee_ToolbarControl[0].controls.length > 2) {
                        mod_ee_ToolbarControl[0].controls[4].deactivate();
                    }
                }
            }
            if (typeof(sidebarPanel.handleEvent) !== 'undefined')
                sidebarPanel.handleEvent = false;
        }
    },
    {button_group: 'tools'}
);
