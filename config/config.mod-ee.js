clientConfig.CLIENT_COMPONENTS.push("gisclient-maps_mod-ee:mod-ee_Control:2:tools");
clientConfig.CLIENT_COMPONENTS.push("gisclient-maps_mod-ee:mod-ee_Functions:99:zhidden");

clientConfig.MOD_EE_LINE_LAYERS = ['bt_tensione_380.conduttori','bt_tensione_220.conduttori','bt_tensione_nn.conduttori','mt_tensione_27000.conduttori','mt_tensione_22000.conduttori','mt_tensione_15000.conduttori','mt_tensione_6300.conduttori','mt_tensione_5500.conduttori','mt_tensione_nn.conduttori'];
clientConfig.MOD_EE_LINE_SEARCH_FIELDS = ['cod_linea'];
clientConfig.MOD_EE_LINE_SEARCH_LAYERS = [];
clientConfig.MOD_EE_SUBSTATION_LAYERS = [];
clientConfig.MOD_EE_SUBSTATION_SEARCH_FIELDS = [];
clientConfig.MOD_EE_SUBSTATION_SEARCH_LAYERS = [];
clientConfig.MOD_EE_CIRCUIT_FIELD_ID = 'cod_linea';
clientConfig.MOD_EE_CIRCUIT_FIELD_LABEL = 'cod_linea';
clientConfig.MOD_EE_SECTION_FIELD_ID = 'sez_no';
clientConfig.MOD_EE_SECTION_FIELD_LABEL = 'sez_no';
clientConfig.MOD_EE_CIRCUIT_LAYERS = {};
clientConfig.MOD_EE_SECTION_LAYERS = {};
clientConfig.MOD_EE_CIRCUIT_COLOR = '#FFA500';
clientConfig.MOD_EE_CIRCUIT_WIDTH = 5;
clientConfig.MOD_EE_SECTION_COLOR = '#FF00FF';
clientConfig.MOD_EE_SECTION_WIDTH = 5;
// **** Configurazione per ricerca POD
clientConfig.MOD_EE_POD_LAYERS = ['bt_componenti.utenze','bt_componenti.cassette_derivazione','mt_componenti.utenze','mt_componenti.cassette_derivazione'];
clientConfig.MOD_EE_POD_SEARCH_FIELDS_SINGLE = ['pdf:2'];
clientConfig.MOD_EE_POD_SEARCH_FIELDS_LIST = ['codice_linea','codice_cabina'];
clientConfig.MOD_EE_POD_SEARCH_LAYERS = [];
clientConfig.MOD_EE_POD_RELATION = 'pdf_utz';
clientConfig.MOD_EE_POD_COLOR = '#0000FF';
clientConfig.MOD_EE_POD_WIDTH = 5;
