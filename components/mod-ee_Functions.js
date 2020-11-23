// *******************************************************************************************
//********************************************************************************************
//**** Plugin for GEOweb - Electrical networks functionalities (mod-ee)
//********************************************************************************************

window.GCComponents.Functions.modEEDisplayCircuit = function (featureObj, panelElement) {
    if (clientConfig.MOD_EE_CIRCUIT_FIELD_ID == null) {
        return;
    }
    var eeId = featureObj.attributes[clientConfig.MOD_EE_CIRCUIT_FIELD_ID];
    if (eeId == null) {
        return;
    }
    var eeLabel = featureObj.attributes[clientConfig.MOD_EE_CIRCUIT_FIELD_LABEL];
    if (eeLabel == null) {
        eeLabel = eeId;
    }
    if (panelElement.innerHTML == 'N.A.') {
        panelElement.innerHTML = '';
    }
    panelElement.innerHTML += '<section class="mod-ee_circuit-section"><h1>Circuito</h1>'+eeLabel+'<a href="#" id="ee-mod_circuit_filter_'+featureObj.id+'" filterid="'+eeId+'"><span class="icon-filter"></span></a><a href="#" id="ee-mod_circuit_hilglight_'+featureObj.id+'" filterid="'+eeId+'"><span class="icon-highlight"></span></a></section>';
    $('#ee-mod_circuit_hilglight_'+featureObj.id).click(function(event) {
        event.stopPropagation();
        var filterId = this.getAttribute('filterid');
        window.GCComponents.Functions.modEEHighlight(featureObj.featureTypeName,clientConfig.MOD_EE_CIRCUIT_FIELD_ID,filterId,'layer-ee_circuit-highlight');
    });
    $('#ee-mod_circuit_filter_'+featureObj.id).click(function(event) {
        event.stopPropagation();
        var filterId = this.getAttribute('filterid');
        window.GCComponents.Functions.modEEFilter(featureObj.featureTypeName,clientConfig.MOD_EE_CIRCUIT_FIELD_ID,filterId);
    });
}

window.GCComponents.Functions.modEEDisplaySection = function (featureObj, panelElement) {
    if (clientConfig.MOD_EE_SECTION_FIELD_ID == null) {
        return;
    }
    var eeId = featureObj.attributes[clientConfig.MOD_EE_SECTION_FIELD_ID];
    if (eeId == null) {
        return;
    }
    if (clientConfig.MOD_EE_SECTION_LAYER == null) {
        var eeLabel = featureObj.attributes[clientConfig.MOD_EE_SECTION_FIELD_LABEL];
        if (eeLabel == null) {
            eeLabel = eeId;
        }
        if (panelElement.innerHTML == 'N.A.') {
            panelElement.innerHTML = '';
        }
        panelElement.innerHTML += '<section class="mod-ee_circuit-section"><h1>Sezione</h1>'+eeLabel+'<a href="#" id="ee-mod_section_filter_'+featureObj.id+'" filterid="'+eeId+'"><span class="icon-filter"></span></a><a href="#" id="ee-mod_section_hilglight_'+featureObj.id+'" filterid="'+eeId+'"><span class="icon-highlight"></span></a></section>';
        $('#ee-mod_circuit_hilglight_'+featureObj.id).click(function(event) {
            event.stopPropagation();
            var filterId = this.getAttribute('filterid');
            window.GCComponents.Functions.modEEHighlight(featureObj.featureTypeName,clientConfig.MOD_EE_CIRCUIT_FIELD_ID,filterId,'layer-ee_circuit-highlight');
        });
        $('#ee-mod_circuit_filter_'+featureObj.id).click(function(event) {
            event.stopPropagation();
            var filterId = this.getAttribute('filterid');
            window.GCComponents.Functions.modEEFilter(featureObj.featureTypeName,clientConfig.MOD_EE_CIRCUIT_FIELD_ID,filterId);
        });
        $('#ee-mod_section_hilglight_'+featureObj.id).click(function(event) {
            event.stopPropagation();
            var filterId = this.getAttribute('filterid');
            window.GCComponents.Functions.modEEHighlight(featureObj.featureTypeName,clientConfig.MOD_EE_SECTION_FIELD_ID,filterId,'layer-ee_section-highlight');
        });
        $('#ee-mod_section_filter_'+featureObj.id).click(function(event) {
            event.stopPropagation();
            var filterId = this.getAttribute('filterid');
            window.GCComponents.Functions.modEEFilter(featureObj.featureTypeName,clientConfig.MOD_EE_SECTION_FIELD_ID,filterId);
        });
    }
}

window.GCComponents.Functions.modEESearchPanel = function (arrLayers, arrSearchLayers, arrFields, searchFunction, formTitle, vectorLayer, relationName) {
    if (typeof(searchFunction) != 'function' || typeof(arrLayers) != 'object' || typeof(arrSearchLayers) != 'object' || typeof(arrFields) != 'object') {
        alert ('Parametri non corretti, impossibile aprire il pannello di ricerca');
        return;
    }
    if (arrSearchLayers.length == 0) {
        arrSearchLayers = arrLayers;
    }
    formTitle = typeof formTitle !== 'undefined' ? formTitle : 'Pannello di ricerca modulo EE';
    vectorLayer = typeof vectorLayer !== 'undefined' ? vectorLayer : 'layer-ee_circuit-highlight';

    $('li[role="advanced-search"]').hide();
    $('#ricerca').addClass('active');
    $('#avanzata').removeClass('active');
    $('#searchFormTitle').html(formTitle);

    var eeProps = {};

    for (var k = 0; k < arrSearchLayers.length; k++) {
        var fTypeK = GisClientMap.getFeatureType(arrSearchLayers[k]);
        if(!fTypeK) continue;
        var propertiesK = fTypeK.properties;
        var eePropData = [];
        for (var idx = 0; idx < propertiesK.length; idx++) {
            var nameK = propertiesK[idx].name;
            if (arrFields.some(function(arrVal) {
                    eePropData = arrVal.split(':');
                    return nameK === eePropData[0];
                })) {
                if (eeProps[nameK] === undefined) {
                    eeProps[nameK] = propertiesK[idx];
                    if (eePropData.length == 1) {
                        eeProps[nameK].searchType = 3;
                    }
                    else {
                        eeProps[nameK].searchType = parseInt(eePropData[1]);
                    }
                }
                else {
                    eeProps[nameK].fieldId += ',' + propertiesK[idx].fieldId;
                }
            }
        }
    }

    var hasProperties = false;
    var form = '<table>';
    $.each(eeProps, function(key, property) {
        if(!property.searchType) return; //searchType undefined oppure 0

        hasProperties = true;
        //form += '<div class="form-group">'+
        //            '<label for="search_form_input_'+key+'">'+property.header+'</label>';
        form += '<tr><td>'+property.header+'</td><td>';

        switch(property.searchType) {
            case 1:
            case 2: //testo
                form += '<input type="text" name="'+property.name+'" searchType="'+property.searchType+'" class="form-control" id="search_form_input_'+key+'">';
            break;
            case 3: //lista di valori
                form += '<input type="text" name="'+property.name+'" fieldId="'+property.fieldId+'" searchType="'+property.searchType+'" id="search_form_input_'+key+'"  style="width:300px;">';
            break;
            case 4: //numero
                form += '<div class="form-inline">'+
                    '<select name="'+property.name+'_operator" class="form-control">'+
                    '<option value="'+OpenLayers.Filter.Comparison.EQUAL_TO+'">=</option>'+
                    '<option value="'+OpenLayers.Filter.Comparison.NOT_EQUAL_TO+'">!=</option>'+
                    '<option value="'+OpenLayers.Filter.Comparison.LESS_THAN+'">&lt;</option>'+
                    '<option value="'+OpenLayers.Filter.Comparison.GREATER_THAN+'">&gt;</option>'+
                    '</select>'+
                    '<input type="number" name="'+property.name+'" searchType="'+property.searchType+'" class="form-control" id="search_form_input_'+key+'">'+
                    '</div>';
            break;
            case 5: //data
                form += '<input type="date" name="'+property.name+'" searchType="'+property.searchType+'" class="form-control" id="search_form_input_'+key+'">';
            break;
            case 6: //lista di valori non wfs
                form += '<input type="number" name="'+property.name+'" searchType="'+property.searchType+'" fieldFilter="'+property.fieldFilter+'" id="search_form_input_'+key+'" style="width:300px;">';
            break;
        }

        form += '</td></tr>';
    });
    form += '</table>';

    if (!hasProperties) {
        $('#ricerca').empty().append('<div>Nessun campo applicabile per la ricerca circuiti/sezioni</div>');
        $('#SearchWindow').modal('show');
        return;
    }

    if ($.mobile) {
        form += '<button type="submit" class="btn btn-default ui-btn ui-shadow ui-corner-all">Cerca</button>'
    }
    else {
        form += '<button type="submit" class="btn btn-default">Cerca</button>'
    }

    form += '</form>';

    $('#ricerca').empty().append(form);

    $('#ricerca input[searchType="3"],#ricerca input[searchType="6"]').each(function(e, input) {
        var fieldId = $(input).attr('fieldId');
        var fieldFilter = $(input).attr('fieldFilter');
        $(input).select2({
            minimumInputLength: 0,
            query: function(query) {
                var filterValue = '';
                var filterFields = '';
                var fieldFilterTmp = fieldFilter;

                while (fieldFilterTmp !== 'undefined' && fieldFilterTmp !== null){
                    if ($('#ricerca input[fieldId="'+fieldFilterTmp+'"]').length === 0) {
                        break;
                    }
                    if (typeof $('#ricerca input[fieldId="'+fieldFilterTmp+'"]').select2('data') !== "undefined" && $('#ricerca input[fieldId="'+fieldFilterTmp+'"]').select2('data') !== null) {
                        var filterSelect = $('#ricerca input[fieldId="'+fieldFilterTmp+'"]').select2('data');
                        filterValue +=  $('#ricerca input[fieldId="'+fieldFilterTmp+'"]').select2('data').text + ',';
                        filterFields += fieldFilterTmp + ',';
                    }
                    fieldFilterTmp = $('#ricerca input[fieldId="'+fieldFilterTmp+'"]').attr('fieldFilter');
                }
                if (filterValue.length > 0) {
                    filterValue = filterValue.slice(0, -1);
                    filterFields = filterFields.slice(0, -1);
                }

                if (typeof $('#ricerca input[fieldFilter="'+fieldId+'"]').select2('data') !== "undefined" && $('#ricerca input[fieldFilter="'+fieldId+'"]').select2('data') !== null)
                    $('#ricerca input[fieldFilter="'+fieldId+'"]').select2('data', null);


                $.ajax({
                    url: GisClientMap.baseUrl + 'services/xSuggest.php',
                    data: {
                        suggest: query.term,
                        field_id: fieldId,
                        filterfields: filterFields,
                        filtervalue: filterValue
                    },
                    dataType: 'json',
                    success: function(data) {
                        var results = [];
                        $.each(data.data, function(e, val) {
                            results.push({
                                id: val.value,
                                text: val.value
                            });
                        });
                        query.callback({results:results});
                    }
                });
            }
        });
    });

    $('#ricerca input').change(function() {
        var ctrlId = $(this).attr('id');
        $('#ricerca input[id!="'+ctrlId+'"]').not('[id*="id_autogen"]').each(function(e, input) {
            var fieldType = $(input).attr('searchType');
            if (fieldType == '3' || fieldType == '6') {
                $(input).select2('data', null);
            }
            else {
                $(input).val("");
            }
        });
    });

    $('#ricerca button[type="submit"]').click(function(event) {
        event.preventDefault();
        var eeName, eeValue = null, eeType;
        $('#ricerca input[gcfilter!="false"]').each(function(e, input) {
            var tmpValue = $(input).val();
            if(!tmpValue || tmpValue == '') return;

            eeValue = tmpValue;
            eeName = $(input).attr('name');
            eeType = '=';
            var searchType = $(input).attr('searchType');

            if(searchType == 4) {
                eeType = $('#ricerca select[name="'+name+'_operator"]').val();
            }
            if(searchType == 2) {
                eeType = ' LIKE ';
                eeValue = '%'+eeValue+'%';
            }
        });

        if(!eeValue || eeValue == '') return alert('Specificare almeno un parametro di ricerca');

        for (var k = 0; k < arrLayers.length; k++) {
            var fTypeK = GisClientMap.getFeatureType(arrLayers[k]);
            if(!fTypeK) continue;
            searchFunction.call(this,arrLayers[k],eeName,eeValue,vectorLayer,eeType,relationName);
        }
        $('#SearchWindow').modal('hide');
    });

    $('#SearchWindow').modal('show');
}

window.GCComponents.Functions.modEECreatePopup = function(feature) {
    var col, colIndex, values, aCols = [], aHeaders = [], aTypes = [], aFormats = [], relation;
    var featureType = GisClientMap.getFeatureType(feature.featureTypeName);
    var selectControls = GisClientMap.map.getControlsBy('gc_id', 'control-querytoolbar');

    // **** fill popupInfo ****
    for (var i = 0; i < featureType.properties.length; i++) {
        col = featureType.properties[i];
        if(col.header && col.resultType!=4 && col.resultType != 20 && col.relationType!=2){
            aCols.push(col.name);
            aHeaders.push(col.header);
            aTypes.push(col.fieldType);
            aFormats.push(typeof(col.fieldFormat) != 'undefined'?col.fieldFormat:null);
        }
    };
    colIndex = aCols.length;

    var htmlPopup = '<span>' +featureType.title+ '</span><table class="featureTypeData, eeModPodData"><tbody>';

    values = '<td feature-col="Escludi POD"><a class="olControlButtonItemInactive olButton olLikeButton" href="#" featureId="'+feature.id+'" action="exclude-pod" title="Escludi POD"><span class="glyphicon-white glyphicon-ban-circle"></span></a></td>';;

    for (var i = 0; i < colIndex; i++) {
        var fieldName = aCols[i];
        var fieldHeader = aHeaders[i];
        var fieldType = aTypes[i];
        var fieldFormat = aFormats[i];
        if (selectControls.length != 1) {
            values += '<td feature-col="' + fieldHeader + '">'+ feature.attributes[fieldName] +'</td>';
        }
        else {
            values += '<td feature-col="' + fieldHeader + '">'+ selectControls[0].writeDataAttribute(fieldType, feature.attributes[fieldName], fieldFormat) +'</td>';
        }
     }

    htmlPopup +=  '<tr featureType="'+featureType.typeName+'" featureId="'+feature.id+'">'+values+'</tr>';

    htmlPopup += '</tbody></table>';

    var popupInfo = '<div class="smalltable"><div class="featureTypeTitle">' + htmlPopup + '</div></div>';

    var pPosX = feature.geometry.getCentroid().x;
    var pPosY = feature.geometry.getCentroid().y;

    var oPopupPos = new OpenLayers.LonLat(pPosX, pPosY);

    var popup = new OpenLayers.Popup.FramedCloud(
        "eePopup",
        oPopupPos,
        new OpenLayers.Size(50, 50),
        popupInfo,
        new OpenLayers.Icon(
            '',
            new OpenLayers.Size(0, 0),
            new OpenLayers.Pixel(0, 0)
        ),
        true,
        function(e) {
            if (feature.layer.popup)
                feature.layer.map.removePopup(feature.layer.popup);
            if (feature.cleanOnPopupClose) {
                var layer = feature.layer;
                layer.removeFeatures([feature]);
            }
        }
    );
    popup.minSize = new OpenLayers.Size(300, 40);
    popup.maxSize = new OpenLayers.Size(300, 500);
    popup.autoSize = true;
    popup.setBackgroundColor('#6a6a6a');
    popup.setOpacity(.9);
    popup.padding = new OpenLayers.Bounds(2,2,2,2);
    popup.keepInMap = true;
    feature.popup = popup;
    popup.onclick = function () {
        return false
    };

    if (feature.layer.popup)
        feature.layer.map.removePopup(feature.layer.popup);

    feature.layer.popup = popup;
    feature.layer.map.addPopup(feature.popup);

    $('.eeModPodData a').click([feature, feature.layer], window.GCComponents.Functions.modEERemoveFeatureFromLayer);
};

window.GCComponents.Functions.modEEDestroyPopup = function (feature) {
    if(!feature) return;
    if(feature.popup) feature.layer.map.removePopup(feature.popup);
    feature.popup.blocks = new Array();
    feature.popup.destroy();
    feature.popup = null;
},

window.GCComponents.Functions.modEEHighlight = function (layerName, idField, idValue, vectorLayer, queryOp, eeRelation) {
    var loadingControl = GisClientMap.map.getControlsByClass('OpenLayers.Control.LoadingPanel')[0];
    loadingControl.maximizeControl();
    var hilightLayer = GisClientMap.map.getLayersByName(vectorLayer)[0];
    hilightLayer.relationName = null;
    if (!Array.isArray(idField)) idField = [idField];
    if (!Array.isArray(idValue)) idValue = [idValue];
    queryOp = typeof(queryOp) !== 'undefined' ? queryOp : '=';
    if (!Array.isArray(queryOp)) queryOp = [queryOp];
    var eeQuery = '', eeValues = {};
    for (var i=0; i<idField.length; i++) {
        if (i>0) eeQuery += ' AND ';
        eeQuery += idField[i]+queryOp[i]+':param_'+i;
        eeValues['param_'+i] = idValue[i];
    }
    var params = {
        featureType: layerName,
        srid: GisClientMap.map.projection,
        projectName : GisClientMap.projectName,
        mapsetName : GisClientMap.mapsetName,
        query: '('+eeQuery+')'
    };
    params.values = eeValues;
    if (typeof(eeRelation) !== 'undefined' && eeRelation != null) {
        params.relationName = eeRelation;
        params.action = 'show1nrelations';
        params.orderby = 'gc_objid';
    }
    $.ajax({
        url: clientConfig.GISCLIENT_URL + '/services/xMapQuery.php',
        method: 'POST',
        dataType: 'json',
        data: params,
        success: function(response) {
            if(!response || typeof(response) != 'object') {
                return alert('Errore di sistema');
                loadingControl.minimizeControl();
            }
            if(!response.length) {
                loadingControl.minimizeControl();
                return;
            }

            var selectPod = GisClientMap.map.getControlsBy('gc_id', 'control-mod-ee-selectpod')[0];
            selectPod.deactivate();

            var features = [], len = response.length, result, i, geometry, feature, lastObjId = null;
            for(i = 0; i < len; i++) {
                result = response[i];
                if (result.gc_objid != lastObjId) {
                    lastObjId = result.gc_objid;
                    geometry = result.gc_geom && OpenLayers.Geometry.fromWKT(result.gc_geom);
                    if(!geometry) continue;
                    delete result.gc_geom;
                    feature = new OpenLayers.Feature.Vector(geometry, result);
                    feature.featureTypeName = layerName;
                    features.push(feature);
                }
            }

            hilightLayer.destroyFeatures();
            hilightLayer.dataTable = response;
            hilightLayer.relationName = eeRelation;
            hilightLayer.addFeatures(features);
            hilightLayer.refresh();

            // **** bring Vector layer on top
            var origLayerIndex = GisClientMap.map.getLayerIndex(hilightLayer);
            var maxIndex = GisClientMap.map.getLayerIndex(GisClientMap.map.layers[GisClientMap.map.layers.length -1]);
            if(origLayerIndex < maxIndex) GisClientMap.map.raiseLayer(hilightLayer, (maxIndex - origLayerIndex));
            GisClientMap.map.resetLayersZIndex();

            loadingControl.minimizeControl();
        },
        error: function() {
            loadingControl.minimizeControl();
        }
    });
};

window.GCComponents.Functions.modEERemoveFeatureFromLayer = function (evt) {
        window.GCComponents.Functions.modEEDestroyPopup(evt.data[0]);
        evt.data[1].destroyFeatures([evt.data[0]]);
};

window.GCComponents.Functions.modEEFilter = function (layerName, idField, idValue) {
    var loadingControl = GisClientMap.map.getControlsByClass('OpenLayers.Control.LoadingPanel')[0];
    loadingControl.maximizeControl();
    var params = {
        featureType: layerName,
        projectName : GisClientMap.projectName,
        mapsetName : GisClientMap.mapsetName,
        action: 'set'
    };
    params.filter = "('["+idField+"]'='"+idValue+"')";
    $.ajax({
        url: clientConfig.GISCLIENT_URL + '/services/gcFilterLayer.php',
        method: 'POST',
        dataType: 'json',
        data: params,
        success: function(response) {
            if(!response || typeof(response) != 'object') {
                return alert('Errore di sistema');
                loadingControl.minimizeControl();
            }
            // **** Relod filtered layers
            var queryToolbarControl = GisClientMap.map.getControlsBy('gc_id', 'control-querytoolbar')[0];
            var fLayer = queryToolbarControl.getLayerFromFeature(layerName);
            fLayer.redraw();

            loadingControl.minimizeControl();
        },
        error: function() {
            loadingControl.minimizeControl();
        }
    });
}

window.GCComponents.Functions.modEEClear = function() {
    var loadingControl = GisClientMap.map.getControlsByClass('OpenLayers.Control.LoadingPanel')[0];
    loadingControl.maximizeControl();
    GisClientMap.map.getLayersByName('layer-ee_circuit-highlight')[0].destroyFeatures();
    GisClientMap.map.getLayersByName('layer-ee_section-highlight')[0].destroyFeatures();
    GisClientMap.map.getLayersByName('layer-ee_pod-highlight')[0].dataTable = [];
    GisClientMap.map.getLayersByName('layer-ee_pod-highlight')[0].destroyFeatures();

    var selectPod = GisClientMap.map.getControlsBy('gc_id', 'control-mod-ee-selectpod')[0];
    selectPod.deactivate();

    var eeLayers = clientConfig.MOD_EE_LINE_LAYERS.concat(clientConfig.MOD_EE_SUBSTATION_LAYERS);
    var eeLayersStr = eeLayers.join();
    var params = {
        featureType: eeLayersStr,
        projectName : GisClientMap.projectName,
        mapsetName : GisClientMap.mapsetName,
        action: 'set'
    };
    $.ajax({
        url: clientConfig.GISCLIENT_URL + '/services/gcFilterLayer.php',
        method: 'POST',
        dataType: 'json',
        data: params,
        success: function(response) {
            if(!response || typeof(response) != 'object') {
                return alert('Errore di sistema');
                loadingControl.minimizeControl();
            }
            // **** Relod filtered layers
            var queryToolbarControl = GisClientMap.map.getControlsBy('gc_id', 'control-querytoolbar')[0];
            for (var i=0; i<eeLayers.length; i++) {
                var fLayer = queryToolbarControl.getLayerFromFeature(eeLayers[i]);
                fLayer.redraw();
            }

            loadingControl.minimizeControl();
        },
        error: function() {
            loadingControl.minimizeControl();
        }
    });

}

window.GCComponents.Functions.modEEShowRelation = function (featureType, dataTable, relationName) {
    var fType = GisClientMap.getFeatureType(featureType),
        len = fType.properties.length, i, property,
        table = '<table><thead><tr>',
        exportLinks = ' <a href="#" class="reportTbl_export podTbl_export" action="xls"><img src="../../resources/themes/icons/xls.gif">&nbsp;Esporta in Excel</a>'
                    + ' <a href="#" class="reportTbl_export podTbl_export" action="pdf" ><img src="../../resources/themes/icons/acrobat.gif">&nbsp;Esporta in PDF</a>',
        data = [], fields = [], tmpArr, col, j,
        result, value, title;
    var selectControls = GisClientMap.map.getControlsBy('gc_id', 'control-querytoolbar');

    for(i = 0; i < len; i++) {
        property = fType.properties[i];

        if(!property.relationName || property.relationName != relationName) continue;
        fields.push({field_name:property.name,
                     title:property.header,
                     type:property.fieldType,
                     format:typeof(property.fieldFormat) != 'undefined'?property.fieldFormat:null
                    });
        title = property.header || property.name;
        table += '<th>'+title+'</th>';
    }
    table += '</tr></thead><tbody>';

    for(i = 0; i < dataTable.length; i++) {
        result = dataTable[i];
        tmpArr = {};
        table += '<tr>';
        for(j = 0; j < fields.length; j++) {
            col = fields[j];
            if (!result.hasOwnProperty(col.field_name)) {
                alert ('Errore in definizione relazione POD; impossibile visualizzare la tabella dei risultati');
                return;
            }
            value = result[col.field_name] || '';
            tmpArr [col.field_name] = value;

            if (selectControls.length != 1) {
                table += '<td>'+value+'</td>';
            }
            else {
                table += '<td>'+selectControls[0].writeDataAttribute(col.type, value, col.format)+'</td>';
            }
        }
        data.push(tmpArr);
        table += '</tr>';
    }
    table += '</tbody></table>';

    $('#DetailsWindow div.modal-body').html(exportLinks+table);
    $('#DetailsWindow h4.modal-title').html('Tabella POD');
    $('.podTbl_export').click(function() {
        var action = this.getAttribute('action');
        window.GCComponents.Functions.modEEexportRelation(fields, data, action);
    });

    $('#DetailsWindow').modal('show');
}

window.GCComponents.Functions.modEEexportRelation = function(fields, data, action) {
    var params = {
        export_format: action,
        data: data,
        fields: fields
    };

    var request = OpenLayers.Request.POST({
        url: GisClientMap.baseUrl + '/services/export.php',
        data: JSON.stringify(params),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        callback: function(response) {
                var fmt = action;
                if(!response || typeof(response) != 'object' || !response.status || response.status != 200) {
                    return alert('Errore di sistema');
                }

                if (!response.responseText) {
                    return alert('Nessun file generato, errore non previsto');
                }

                var responseObj = JSON.parse(response.responseText);

                if (!responseObj.result || responseObj.result != 'ok') {
                    var errMessage = 'Errore in generazione file';
                    if (responseObj.error)
                        errMessage += ' - Dettagli: ' + responseObj.error;
                    return alert (errMessage);
                }

                if (fmt == 'xls') {
                    window.location.assign(responseObj.file);
                }
                else {
                    var win = window.open(responseObj.file, '_blank');
                    win.focus();
                }
        },
        scope: this
    });
}

window.GCComponents.InitFunctions.modEEInit = function() {
    $('.panel-clearresults').click(function(event) {
        window.GCComponents.Functions.modEEClear();
    });
}
