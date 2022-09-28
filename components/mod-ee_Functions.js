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

window.GCComponents.Functions.modEEDisplaySubstationCircuits = function (featureObj, panelElement) {
    if (clientConfig.MOD_EE_CIRCUIT_FIELD_ID == null) {
        return;
    }
    var circuitLabel = clientConfig.MOD_EE_SUBSTATION_CIRCUIT_FIELD_LABEL == null ? clientConfig.MOD_EE_CIRCUIT_FIELD_LABEL : clientConfig.MOD_EE_SUBSTATION_CIRCUIT_FIELD_LABEL;
    var fType = GisClientMap.getFeatureType(featureObj.featureTypeName);
    if(!fType) return alert('Errore: il featureType '+featureType+' non esiste');

    var len = fType.properties.length, property, i, pkey, parentData={};

    for(i = 0; i < len; i++) {
        property = fType.properties[i];
        if(property.isPrimaryKey) {
            pkey = property.name;
            break;
        }
    }

    if(!featureObj.attributes[pkey]) {
        return alert('Errore: la feature selezionata non ha un valore per la primary key '+pkey);
    }

    var params = {
        projectName: GisClientMap.projectName,
        mapsetName: GisClientMap.mapsetName,
        srid: GisClientMap.map.projection,
        featureType: featureObj.featureTypeName,
        featureId: featureObj.attributes[pkey],
        relationName: clientConfig.MOD_EE_SUBSTATION_CIRCUIT_RELATION,
        action: 'viewdetails'
    };

    $.ajax({
        url: clientConfig.GISCLIENT_URL + '/services/xMapQuery.php',
        method: 'POST',
        dataType: 'json',
        data: params,
        beforeSend:function(jqXHR){
            jqXHR.featureType=featureObj.featureTypeName;
        },
        success: function(response, textStatus, jqXHR) {
            if(!response || typeof(response) != 'object') {
                return alert('Errore di sistema');

            }
            if(!response.length) {

                return;
            }
            var len = response.length, result, i, fieldsHTML = '';
            for(i = 0; i < len; i++) {
                result = response[i];
                var eeId = result[clientConfig.MOD_EE_CIRCUIT_FIELD_ID];
                if (eeId == null) {
                    continue;
                }
                var eeLabel = result[circuitLabel];
                if (eeLabel == null) {
                    eeLabel = eeId;
                }
                if (panelElement.innerHTML == 'N.A.') {
                    panelElement.innerHTML = '';
                }
                panelElement.innerHTML += '<section class="mod-ee_circuit-section">'+eeLabel+'<a href="#" id="ee-mod_circuit_hilglight_'+featureObj.id+eeId+'" class="ee-mod_substation_circuit_hilglight_'+featureObj.id+'" filterid="'+eeId+'"><span class="icon-highlight"></span></a></section>';
            }

            parentData['featureType'] = jqXHR.featureType;
            for (var j=0; j<clientConfig.MOD_EE_SUBSTATION_DISPLAY_FIELDS.length; j++) {
                parentData[clientConfig.MOD_EE_SUBSTATION_DISPLAY_FIELDS[j]] = result[clientConfig.MOD_EE_SUBSTATION_DISPLAY_FIELDS[j]];
            }

            $('.ee-mod_substation_circuit_hilglight_'+featureObj.id).click(function(event) {
                event.stopPropagation();
                var filterField = [];
                var filterValue = [];
                var filterOp = [];
                if ($(this).hasClass('mod-ee_substation-circuit-selected')) {
                    $(this).removeClass('mod-ee_substation-circuit-selected');
                }
                else {
                    $(this).addClass('mod-ee_substation-circuit-selected');
                }
                $('.ee-mod_substation_circuit_hilglight_'+featureObj.id).each(function(idx,elem){
                    if ($(this).hasClass('mod-ee_substation-circuit-selected')) {
                        filterField.push(clientConfig.MOD_EE_CIRCUIT_FIELD_ID);
                        filterValue.push(this.getAttribute('filterid'));
                        filterOp.push('=');
                    }
                });

                window.GCComponents.Functions.modEEHighlight(clientConfig.MOD_EE_LINE_LAYERS,filterField,filterValue,'layer-ee_circuit-highlight',filterOp,null,'OR',parentData);
            });
        },
        error: function() {

        }
    });
}

window.GCComponents.Functions.modEESearchPanel = function (arrLayers, arrSearchLayers, arrFields, searchFunction, formTitle, vectorLayer, relationName, relationName1n, fieldName1n, fieldLabel1n) {
    if (typeof(searchFunction) != 'function' || typeof(arrLayers) != 'object' || typeof(arrSearchLayers) != 'object' || typeof(arrFields) != 'object') {
        alert ('Parametri non corretti, impossibile aprire il pannello di ricerca');
        return;
    }

    var parentData = {};

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
    var form = '<table id="mod_ee_circuit_search_table">';
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
        if (typeof(fieldName1n) != 'undefined' && fieldName1n != null) {
            $('.modEEfields1nRow').remove();
            var eeValue = $(this).val();
            if(!eeValue || eeValue == '') return;

            var eeName = $(this).attr('name');
            var eeType = '=';
            var searchType = $(this).attr('searchType');

            if(searchType == 4) {
                eeType = $('#ricerca select[name="'+name+'_operator"]').val();
            }
            if(searchType == 2) {
                eeType = ' LIKE ';
                eeValue = '%'+eeValue+'%';
            }

            if(!eeName || typeof(eeName) == 'undefined') return;

            var params = {
                featureType: '',
                srid: GisClientMap.map.projection,
                projectName : GisClientMap.projectName,
                mapsetName : GisClientMap.mapsetName,
                query: eeName+eeType+':param_1',
                values: {'param_1': eeValue}
            };
            if (typeof(relationName1n) != 'undefined' && relationName1n != null) {
                params.relationName = relationName1n;
                params.action = 'show1nrelations';
                params.orderby = fieldName1n;
            }
            for (var k = 0; k < arrSearchLayers.length; k++) {
                params.featureType = arrSearchLayers[k];
                $.ajax({
                    url: clientConfig.GISCLIENT_URL + '/services/xMapQuery.php',
                    method: 'POST',
                    dataType: 'json',
                    data: params,
                    beforeSend:function(jqXHR){
                        jqXHR.featureType=arrSearchLayers[k];
                    },
                    success: function(response, textStatus, jqXHR) {
                        if(!response || typeof(response) != 'object') {
                            return alert('Errore di sistema');

                        }
                        if(!response.length) {

                            return;
                        }
                        var fieldLabel = fieldLabel1n == null ? fieldName1n : fieldLabel1n;
                        var len = response.length, result, i, fieldsHTML = '';
                        for(i = 0; i < len; i++) {
                            result = response[i];
                            fieldsHTML += '<tr class="modEEfields1nRow"><td></td><td>';
                            fieldsHTML += '<input type="checkbox" name="'+fieldName1n+'" value="'+result[fieldName1n]+'" searchType="7" id="search_form_input_1n_'+i+'" class="mod_ee_type7_ctrl"><label for="search_form_input_1n_'+i+'">'+result[fieldLabel]+'</label>';
                            fieldsHTML += '</td></tr>';
                        }
                        if (fieldsHTML.length > 0) {
                            fieldsHTML = '<tr class="modEEfields1nRow"><td>Circuiti</td><td><a href="#" id="mod_ee_search_type7_select_btn" class="olButton eeType7Select"><span></span></a></td></tr>' + fieldsHTML;
                            $('#mod_ee_circuit_search_table').append(fieldsHTML);
                            if ($.mobile) {
                                $('.mod_ee_type7_ctrl').checkboxradio();
                            }
                            $('.mod_ee_type7_ctrl').change(function() {
                                if ($('.mod_ee_type7_ctrl:checkbox:checked').length == len) {
                                    $('#mod_ee_search_type7_select_btn').removeClass('eeType7Select');
                                    $('#mod_ee_search_type7_select_btn').addClass('eeType7Unselect');
                                }
                                else {
                                    $('#mod_ee_search_type7_select_btn').removeClass('eeType7Unselect');
                                    $('#mod_ee_search_type7_select_btn').addClass('eeType7Select');
                                }
                            });
                            $('#mod_ee_search_type7_select_btn').click(function(event) {
                                event.preventDefault();
                                if ($(this).hasClass('eeType7Select')) {
                                    if ($.mobile) {
                                        $('.mod_ee_type7_ctrl:checkbox').prop('checked', true).checkboxradio( "refresh" );
                                    }
                                    else {
                                        $('.mod_ee_type7_ctrl:checkbox').prop('checked', true);
                                    }
                                    $(this).removeClass('eeType7Select');
                                    $(this).addClass('eeType7Unselect');
                                }
                                else {
                                    if ($.mobile) {
                                        $('.mod_ee_type7_ctrl:checkbox').prop('checked', false).checkboxradio( "refresh" );
                                    }
                                    else {
                                        $('.mod_ee_type7_ctrl:checkbox').prop('checked', false);
                                    }
                                    $(this).removeClass('eeType7Unselect');
                                    $(this).addClass('eeType7Select');
                                }
                            });
                        }

                        parentData.featureType = jqXHR.featureType;
                        for (var j=0; j<clientConfig.MOD_EE_SUBSTATION_DISPLAY_FIELDS.length; j++) {
                            parentData[clientConfig.MOD_EE_SUBSTATION_DISPLAY_FIELDS[j]] = result[clientConfig.MOD_EE_SUBSTATION_DISPLAY_FIELDS[j]];
                        }

                    },
                    error: function() {

                    }
                });
            }
        }
    });

    $('#ricerca button[type="submit"]').click(function(event) {
        event.preventDefault();
        var eeName, eeValue = null, eeType, eeLogicOp = null;
        $('#ricerca input[gcfilter!="false"]').each(function(e, input) {
            var tmpValue = $(input).val();
            if(!tmpValue || tmpValue == '') return;
            var searchType = $(input).attr('searchType');

            switch (searchType) {
                case '4':
                eeName = $(input).attr('name');
                eeType = $('#ricerca select[name="'+name+'_operator"]').val();
                eeValue = tmpValue;
                break;
                case '2':
                eeName = $(input).attr('name');
                eeType = ' LIKE ';
                eeValue = '%'+tmpValue+'%';
                break;
                case '7':
                if ($(input).prop('checked')) {
                    if (!Array.isArray(eeName)) {
                        eeName = [$(input).attr('name')];
                        eeType = ['='];
                        eeValue = [tmpValue];
                        eeLogicOp = 'OR';
                    }
                    else {
                        eeName.push($(input).attr('name'));
                        eeType.push('=');
                        eeValue.push(tmpValue);
                    }
                }
                break;
                default:
                eeName = $(input).attr('name');
                eeType = '=';
                eeValue = tmpValue;
            }
         });

        if(!eeValue || eeValue == '') return alert('Specificare almeno un parametro di ricerca');

        searchFunction.call(this,arrLayers,eeName,eeValue,vectorLayer,eeType,relationName,eeLogicOp,parentData);

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

window.GCComponents.Functions.modEEHighlight = function (layerName, idField, idValue, vectorLayer, queryOp, eeRelation, queryLogicOp, parentData) {
    var loadingControl = GisClientMap.map.getControlsByClass('OpenLayers.Control.LoadingPanel')[0];
    loadingControl.maximizeControl();
    var highlightLayer = GisClientMap.map.getLayersByName(vectorLayer)[0];
    highlightLayer.destroyFeatures();
    highlightLayer.relationName = null;
    highlightLayer.dataTable = [];
    highlightLayer.circuitsList = {};
    highlightLayer.parentData = typeof(parentData) !== 'object' ? {} : parentData;

    if (!Array.isArray(idField)) idField = [idField];
    if (idField.length == 0) {
        window.GCComponents.Functions.modEESectionsPanel(null);
        loadingControl.minimizeControl();
        return;
    }

    if (!Array.isArray(layerName)) layerName = [layerName];
    highlightLayer.pendingRequests = layerName.length;

    if (!Array.isArray(idValue)) idValue = [idValue];
    queryOp = typeof(queryOp) !== 'undefined' ? queryOp : '=';
    queryLogicOp = typeof(queryLogicOp) !== 'undefined' ? queryLogicOp : 'AND';
    if (!Array.isArray(queryOp)) queryOp = [queryOp];
    var eeQuery = '', eeValues = {};
    for (var i=0; i<idField.length; i++) {
        if (i>0) eeQuery += ' ' + queryLogicOp + ' ';
        eeQuery += idField[i]+queryOp[i]+':param_'+i;
        eeValues['param_'+i] = idValue[i];
    }
    var params = {
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
    for (var k = 0; k < layerName.length; k++) {
        var fTypeK = GisClientMap.getFeatureType(layerName[k]);
        if(!fTypeK) continue;
        params.featureType = layerName[k];
        $.ajax({
            url: clientConfig.GISCLIENT_URL + '/services/xMapQuery.php',
            method: 'POST',
            dataType: 'json',
            data: params,
            beforeSend:function(jqXHR){
                jqXHR.featureType=layerName[k];
            },
            success: function(response, textStatus, jqXHR) {
                if(!response || typeof(response) != 'object') {
                    return alert('Errore di sistema');
                    highlightLayer.pendingRequests--;
                    if (highlightLayer.pendingRequests <=0) {
                        loadingControl.minimizeControl();
                        if (highlightLayer.dataTable.length == 0) {
                            alert ('Nessun risultato');
                        }
                    }
                }

                if(!response.length) {
                    highlightLayer.pendingRequests--;
                    if (highlightLayer.pendingRequests <=0) {
                        loadingControl.minimizeControl();
                        if (highlightLayer.dataTable.length == 0) {
                            alert ('Nessun risultato');
                        }
                    }
                    return;
                }

                var selectPod = GisClientMap.map.getControlsBy('gc_id', 'control-mod-ee-selectpod')[0];
                selectPod.deactivate();

                var features = [], sections=[], circuits={}, len = response.length, result, i, geometry, feature, lastObjId = null, circuitId = null, appendFeatures = false;
                if (!$.isEmptyObject(highlightLayer.parentData)) {
                    circuits = highlightLayer.circuitsList;
                }
                for(i = 0; i < len; i++) {
                    result = response[i];
                    if (result.gc_objid != lastObjId) {
                        lastObjId = result.gc_objid;
                        geometry = result.gc_geom && OpenLayers.Geometry.fromWKT(result.gc_geom);
                        if(!geometry) continue;
                        delete result.gc_geom;
                        result.circuit_color = clientConfig.MOD_EE_CIRCUIT_COLOR;
                        result.circuit_display = 'block';
                        feature = new OpenLayers.Feature.Vector(geometry, result);
                        feature.featureTypeName = jqXHR.featureType;
                        features.push(feature);
                        circuitId = result[clientConfig.MOD_EE_CIRCUIT_FIELD_ID];
                        // **** Circuits sinthetic data
                        if (!circuits.hasOwnProperty(result[clientConfig.MOD_EE_CIRCUIT_FIELD_ID])) {
                            appendFeatures = true;
                            circuits[circuitId] = {};
                            for (var j=0; j<clientConfig.MOD_EE_CIRCUIT_DISPLAY_FIELDS.length; j++) {
                                circuits[circuitId][clientConfig.MOD_EE_CIRCUIT_DISPLAY_FIELDS[j]] = result[clientConfig.MOD_EE_CIRCUIT_DISPLAY_FIELDS[j]];
                            }
                            if (result.hasOwnProperty(clientConfig.MOD_EE_CIRCUIT_COLOR_FIELD)) {
                                var resColor = result[clientConfig.MOD_EE_CIRCUIT_COLOR_FIELD];
                                if (resColor) {
                                    if (/^#[0-9A-F]{6}$/i.test(resColor)) {
                                        circuits[circuitId]['circuit_color'] = resColor;
                                    }
                                    else {
                                        var outColor = resColor.match(/^(\d+)[, ]+(\d+)[, ]+(\d+)$/);
                                        function hex(x) {
                                            return ("0" + parseInt(x).toString(16)).slice(-2);
                                        }
                                        circuits[circuitId]['circuit_color'] = "#" + hex(outColor[1]) + hex(outColor[2]) + hex(outColor[3]);
                                    }
                                }
                            }
                            circuits[circuitId]['sections'] = [];
                        }
                        if (result[clientConfig.MOD_EE_SECTION_FIELD_ID] != null && circuits[circuitId]['sections'].indexOf(result[clientConfig.MOD_EE_SECTION_FIELD_ID]) < 0) {
                            circuits[circuitId]['sections'].push(result[clientConfig.MOD_EE_SECTION_FIELD_ID]);
                        }
                    }
                }

                if (appendFeatures) {
                    highlightLayer.dataTable = highlightLayer.dataTable.concat(response);
                    highlightLayer.relationName = eeRelation;
                    highlightLayer.circuitsList = circuits;
                    highlightLayer.addFeatures(features);
                    highlightLayer.refresh();

                    // **** bring Vector layer on top
                    var origLayerIndex = GisClientMap.map.getLayerIndex(highlightLayer);
                    var maxIndex = GisClientMap.map.getLayerIndex(GisClientMap.map.layers[GisClientMap.map.layers.length -1]);
                    if(origLayerIndex < maxIndex) GisClientMap.map.raiseLayer(highlightLayer, (maxIndex - origLayerIndex));
                    GisClientMap.map.resetLayersZIndex();
                }

                highlightLayer.pendingRequests--;
                if (highlightLayer.pendingRequests <=0) {
                    loadingControl.minimizeControl();
                    if (highlightLayer.dataTable.length == 0) {
                        alert ('Nessun risultato');
                    }
                }
            },
            error: function() {
                highlightLayer.pendingRequests--;
                if (highlightLayer.pendingRequests <=0) {
                    loadingControl.minimizeControl();
                    if (highlightLayer.dataTable.length == 0) {
                        alert ('Nessun risultato');
                    }
                }
            }
        });
    }
};

window.GCComponents.Functions.switchCircuitColor = function (layer, color, circuit) {
    for (var i=0; i < layer.features.length; i++) {
        if (circuit) {
            if (layer.features[i].attributes[clientConfig.MOD_EE_CIRCUIT_FIELD_ID] != circuit) {
                continue;
            }
        }
        if (color) {
            layer.features[i].attributes['circuit_color'] = color;
        }
        else {
            layer.features[i].attributes['circuit_color'] = layer.circuitsList[layer.features[i].attributes[clientConfig.MOD_EE_CIRCUIT_FIELD_ID]].circuit_color;
        }
    }
    layer.redraw();
};

window.GCComponents.Functions.modEESectionsPanel = function (layer, section) {
    if (layer == null) {
        $('#mod_ee_circuit_panel_parent_content').html('');
        $('#mod_ee_circuit_panel_content').html('');
        $('#mod_ee_circuit_panel').css('height', 'auto');
        $('#mod_ee_circuit_panel').css('display', 'none');
        $('#map-toolbar-mod-ee-colorpicker').css('display', 'none');
        GisClientMap.map.getLayersByName('layer-ee_circuit-highlight')[0].destroyFeatures();
        GisClientMap.map.getLayersByName('layer-ee_section-highlight')[0].destroyFeatures();
        return;
    }
    $('#mod_ee_circuit_panel').css('height', 'auto');
    $('#map-toolbar-mod-ee-colorpicker').css('display', 'none');
    var fType = GisClientMap.getFeatureType(layer.features[0].featureTypeName);
    if (section === true) {
        var circuitAttr = layer.features[0].attributes;
        var sectionPanelContent = '';
        var sectionId = null;
        $(".section_display_field").remove();
        for (var i=0; i<fType.properties.length; i++) {
            if (clientConfig.MOD_EE_SECTION_DISPLAY_FIELDS.some(function(arrVal) {
                var eePropData = arrVal.split(':');
                return fType.properties[i].name === eePropData[0];
                })) {
                var format = typeof(fType.properties[i].fieldFormat) != 'undefined'?fType.properties[i].fieldFormat:null;
                var value = circuitAttr[fType.properties[i].name];
                if (format && typeof(value) != 'undefined') {
                    value = sprintf(format, value);
                }
                sectionPanelContent +='<div class="section_display_field"><span class="circuit_data_header">' + fType.properties[i].header + '</span><span class="circuit_data_content">' + value + '</span></div>';
            }
            if (fType.properties[i].name === clientConfig.MOD_EE_SECTION_FIELD_ID) {
                var sectionId = circuitAttr[fType.properties[i].name];
            }
        }
        $("#mod_ee_circuit_panel_section_div_"+sectionId).append(sectionPanelContent);
    }
    else {
        var panelTitle = '';
        if (Object.keys(layer.circuitsList).length > 1) {
            panelTitle = 'Circuiti Selezionati';
            $('#mod_ee_circuit_panel_toolbar_color').css('display', 'block');
            $("#mod_ee_circuit_panel_toolbar_color a").removeClass('olControlButtonItemActive');
            $("#mod_ee_circuit_panel_toolbar_color a[title='Default']").addClass('olControlButtonItemActive');
        }
        else {
            panelTitle = 'Circuito Selezionato';
            $('#mod_ee_circuit_panel_toolbar_color').css('display', 'none')
        }
        $('#mod_ee_circuit_panel_title').html(panelTitle);
        $('#mod_ee_circuit_panel_parent_content').html('');
        $('#mod_ee_circuit_panel_content').html('');
        var panelParentContent = '';
        var panelContent = '';
        if (layer.hasOwnProperty('parentData')) {
            if (layer.parentData.hasOwnProperty('featureType')) {
                var fTypeP = GisClientMap.getFeatureType(layer.parentData.featureType);
                for (var i=0; i<fTypeP.properties.length; i++) {
                    if (clientConfig.MOD_EE_SUBSTATION_DISPLAY_FIELDS.some(function(arrVal) {
                        var eePropData = arrVal.split(':');
                        return fTypeP.properties[i].name === eePropData[0];
                        })) {
                        var format = typeof(fTypeP.properties[i].fieldFormat) != 'undefined'?fTypeP.properties[i].fieldFormat:null;
                        var value = layer.parentData[fTypeP.properties[i].name];
                        if (format && typeof(value) != 'undefined') {
                            value = sprintf(format, value);
                        }
                        panelParentContent += '<div><span class="circuit_data_header">' + fTypeP.properties[i].header + '</span><span class="circuit_data_content">' + value + '</span></div>';
                    }
                }
                $('#mod_ee_circuit_panel_parent_content').html(panelParentContent);
            }
        }
        var arrCircuitsList = Object.keys(layer.circuitsList).map(function (key) { return key; }).sort();
        var displayColorToolbar = false;
        $.each(arrCircuitsList, function(idx, circuitIDX) {
            var circuit = layer.circuitsList[circuitIDX];
            if (circuit.hasOwnProperty('circuit_color')) {
                displayColorToolbar = true;
            }
            var sectionHeader = '';
            var circID = circuit[clientConfig.MOD_EE_CIRCUIT_FIELD_ID];
            panelContent += '<div><a href="#" class="ee-mod_panel_circuit_toggle" circID="'+circID+'"><span class="ee-mod_panel_circuit_toggle_icon icon-hide-panel" style="margin-left: 10px;"></span></a>\
                            <span class="ee-mod_panel_circuit_separator"></span>\
                            <a href="#" class="ee-mod_panel_circuit_colorpicker" circID="'+circID+'"><span id="ee-mod_panel_circuit_color_'+circID+'" class="glyphicon-white glyphicon-stop" style="margin-right: 10px; color: '+clientConfig.MOD_EE_CIRCUIT_COLOR+';"></span></a></div>';
            panelContent += '<div id="mod_ee_circuit_panel_'+circID+'">';
            for (var i=0; i<fType.properties.length; i++) {
                if (clientConfig.MOD_EE_CIRCUIT_DISPLAY_FIELDS.some(function(arrVal) {
                    var eePropData = arrVal.split(':');
                    return fType.properties[i].name === eePropData[0];
                    })) {
                    var format = typeof(fType.properties[i].fieldFormat) != 'undefined'?fType.properties[i].fieldFormat:null;
                    var value = circuit[fType.properties[i].name];
                    if (format && typeof(value) != 'undefined') {
                        value = sprintf(format, value);
                    }
                    panelContent += '<div><span class="circuit_data_header">' + fType.properties[i].header + '</span><span class="circuit_data_content">' + value + '</span></div>';
                }
                if (fType.properties[i].name === clientConfig.MOD_EE_SECTION_FIELD_LABEL) {
                    var sectionHeader = fType.properties[i].header;
                }
            }
            for (var i=0; i<circuit.sections.length; i++) {
                panelContent += '<div id="mod_ee_circuit_panel_section_div_'+circuit.sections[i]+'" class="circuit_section_container"><div><span class="circuit_data_header">' + sectionHeader + '</span><span class="circuit_data_content">' + '<a href="#" id="mod_ee_circuit_panel_section_btn_'+circuit.sections[i]+'" filterid="'+circuit.sections[i]+'" class="olControlItemInactive olButton">'+circuit.sections[i]+'</a></span></div></div>';
            }
            panelContent += '</div>';
        });
        if (!displayColorToolbar) {
            $('#mod_ee_circuit_panel_toolbar_color').css('display', 'none');
        }
        $('#mod_ee_circuit_panel_content').html(panelContent);
        var panelSize = $('#mod_ee_circuit_panel').height();
        var maxPanelSize = $('#map').height() - 50;
        if (panelSize > maxPanelSize) {
            $('#mod_ee_circuit_panel').css('height', maxPanelSize);
            $('#mod_ee_circuit_panel').css('overflow', 'auto');
        }
        $("#mod_ee_circuit_panel_content a").click(function() {
            event.stopPropagation();
            $('#map-toolbar-mod-ee-colorpicker').css('display', 'none');
            if ($(this).hasClass("ee-mod_panel_circuit_toggle")) {
                var circDisplay = '';
                var circColor = null;
                var circID = this.getAttribute('circID');
                var spanItem = $(this).find('.ee-mod_panel_circuit_toggle_icon')[0];
                if ($(spanItem).hasClass('icon-hide-panel')) {
                    $(spanItem).removeClass('icon-hide-panel');
                    $(spanItem).addClass('icon-show-panel');
                    circDisplay = 'none';
                    circColor = '#FFFFFF';

                }
                else {
                    $(spanItem).removeClass('icon-show-panel');
                    $(spanItem).addClass('icon-hide-panel');
                    circDisplay = 'block';
                }
                $('#mod_ee_circuit_panel_'+circID).css('display', circDisplay);
                // **** Hide/Show circuit highlight
                for (var i=0; i < layer.features.length; i++) {
                    if (layer.features[i].attributes[clientConfig.MOD_EE_CIRCUIT_FIELD_ID] == circID) {
                        layer.features[i].attributes['circuit_display'] = circDisplay;
                        if (circColor === null) {
                            circColor = layer.features[i].attributes['circuit_color'];
                        }
                    }
                }
                $('#ee-mod_panel_circuit_color_'+circID).css('color', circColor);
                layer.redraw();
                //window.GCComponents.Functions.switchCircuitColor(layer,layer.circuitsList[circID].circuit_color,circID);
            }
            else if ($(this).hasClass("ee-mod_panel_circuit_colorpicker")) {
                var circID = this.getAttribute('circID');
                var currColor = $("span[id='ee-mod_panel_circuit_color_"+circID+"']").css('color');
                if (currColor == 'rgb(255, 255, 255)') {
                    alert('Impossibile impostare il colore di un circuito non evidenziato');
                    return;
                }
                var currColorRGB = currColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
                var x = $(this).position().left + 90;
                var y = $(this).position().top - 120;
                if (y < 5) {
                    y = 5;
                }
                if ($('#mod_ee_circuit_panel').get(0).scrollHeight > $('#mod_ee_circuit_panel').get(0).clientHeight) {
                    x += 15;
                }
                $('#map-toolbar-mod-ee-colorpicker').css({left:x,top:y});
                var noteColorPicker = ColorPicker(
                    document.getElementById('mod_ee_color-picker'),
                    function(hex, hsv, rgb) {
                        $('#mod-ee_circuit_setcolor').css('color', hex);
                        $('#mod-ee_circuit_setcolor').attr('hexColor', hex);
                    });
                noteColorPicker.setRgb({r:currColorRGB[1], g:currColorRGB[2], b:currColorRGB[3]});
                $('#mod-ee_circuit_setcolor').css('color', currColor);
                $('#mod-ee_circuit_setcolor').attr('circID', circID);
                $('#map-toolbar-mod-ee-colorpicker').css('display', 'block');
            }
            else {
                var filterId = this.getAttribute('filterid');
                $("#mod_ee_circuit_panel_content a").removeClass("olControlItemActive");
                $("#mod_ee_circuit_panel_content a").addClass("olControlItemInactive");
                $(this).removeClass("olControlItemInactive");
                $(this).addClass("olControlItemActive");
                window.GCComponents.Functions.modEEHighlight(layer.features[0].featureTypeName,clientConfig.MOD_EE_SECTION_FIELD_ID,filterId,'layer-ee_section-highlight');

            }
        });
        GisClientMap.map.getLayersByName('layer-ee_section-highlight')[0].destroyFeatures();
        $('#mod_ee_circuit_panel').css('display', 'block');
    }
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
    //GisClientMap.map.getLayersByName('layer-ee_circuit-highlight')[0].destroyFeatures();
    //GisClientMap.map.getLayersByName('layer-ee_section-highlight')[0].destroyFeatures();
    GisClientMap.map.getLayersByName('layer-ee_pod-highlight')[0].dataTable = [];
    GisClientMap.map.getLayersByName('layer-ee_pod-highlight')[0].circuitsList = {};
    GisClientMap.map.getLayersByName('layer-ee_pod-highlight')[0].parentData = {};
    GisClientMap.map.getLayersByName('layer-ee_pod-highlight')[0].destroyFeatures(null,{silent:true});

    var selectPod = GisClientMap.map.getControlsBy('gc_id', 'control-mod-ee-selectpod')[0];
    selectPod.deactivate();

    window.GCComponents.Functions.modEESectionsPanel(null);

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
        table = '<table id="ee-rel-table"><thead><tr>',
        exportLinks = ' <a href="#" class="reportTbl_export podTbl_export" action="xls"><img src="../../resources/themes/icons/xls.gif">&nbsp;Esporta in Excel</a>'
                    + ' <a href="#" class="reportTbl_export podTbl_export" action="pdf" ><img src="../../resources/themes/icons/acrobat.gif">&nbsp;Esporta in PDF</a>',
        data = [], fields = [], tmpArr, col, j,
        result, value, title;
    var eeRelContent = exportLinks + ' <div id="ee-rel-content"></div>';
    var selectControls = GisClientMap.map.getControlsBy('gc_id', 'control-querytoolbar');
    for(i = 0; i < len; i++) {
        property = fType.properties[i];

        if(property.relationName == relationName || clientConfig.MOD_EE_POD_DISPLAY_FIELDS.indexOf(property.name) >= 0) {
            fields.push({field_name:property.name,
                         title:property.header,
                         type:property.fieldType,
                         format:typeof(property.fieldFormat) != 'undefined'?property.fieldFormat:null
                        });
            title = property.header || property.name;
            table += '<th>'+title+'</th>';
        }
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

    $('#DetailsWindow div.modal-body').css('overflow', 'visible');
    $('#DetailsWindow div.modal-body').html(eeRelContent);
    $('#ee-rel-content').css('height', $('#map').height()-120);
    $('#ee-rel-content').css('overflow', 'auto');
    $('#ee-rel-content').html(table);
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
    var observer = new MutationObserver(function (mutations) {
        var tblH = $('#ee-rel-table').height();
        var mapH = $('#map').height()-100;
        if (tblH > 0 && tblH < mapH)
            $('#ee-rel-content').css('height', tblH + 20);
    });
    var config = { childList: true, subtree: true };
    observer.observe(document.getElementById('DetailsWindow'), config);

    $('#map-toolbar-mod-ee-colorpicker').css('display', 'none');
    $('#map-toolbar-mod-ee-colorpicker').html('<div><a href="#" class="ee-mod_colorpicker_close"><span class="glyphicon-white glyphicon-remove modEEColorPickerClose"></span></a></div>\
                                            <div id="mod_ee_color-picker" class="olToolbarControl cp-default"></div>\
                                            <div class="modEEColorPickerButtons">\
                                            <a class="searchButton olLikeButton modEECircuitColorPicker btn">\
                                            <span id="mod-ee_circuit_setcolor" class="glyphicon-white glyphicon-stop" circID=""></span><span>Imposta Colore</span></a>\
                                            </div>');
    $("#map-toolbar-mod-ee-colorpicker a").click(function() {
        event.stopPropagation();
        if ($(this).hasClass("modEECircuitColorPicker")) {
            var circColor = $('#mod-ee_circuit_setcolor').attr('hexColor');
            var circID = $('#mod-ee_circuit_setcolor').attr('circID');
            var layer = GisClientMap.map.getLayersByName('layer-ee_circuit-highlight')[0];
            $("span[id='ee-mod_panel_circuit_color_"+circID+"']").css('color', circColor);
            window.GCComponents.Functions.switchCircuitColor(layer, circColor, circID);
            $('#map-toolbar-mod-ee-colorpicker').css('display', 'none');
            $("#mod_ee_circuit_panel_toolbar_color a").removeClass('olControlButtonItemActive');
        }
        else {
            $('#map-toolbar-mod-ee-colorpicker').css('display', 'none');
        }
    });
}
