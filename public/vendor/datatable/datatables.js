/*
 * This combined file was created by the DataTables downloader builder:
 *   https://datatables.net/download
 *
 * To rebuild or modify this file with the latest versions of the included
 * software please visit:
 *   https://datatables.net/download/#bs5/dt-2.0.2/e-2.3.1
 *
 * Included libraries:
 *   DataTables 2.0.2, Editor 2.3.1
 */

/*! DataTables 2.0.2
 * © SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     DataTables
 * @description Paginate, search and order HTML tables
 * @version     2.0.2
 * @author      SpryMedia Ltd
 * @contact     www.datatables.net
 * @copyright   SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - https://datatables.net/license
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: https://www.datatables.net
 */

(function( factory ) {
	"use strict";

	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		// jQuery's factory checks for a global window - if it isn't present then it
		// returns a factory function that expects the window object
		var jq = require('jquery');

		if (typeof window === 'undefined') {
			module.exports = function (root, $) {
				if ( ! root ) {
					// CommonJS environments without a window global must pass a
					// root. This will give an error otherwise
					root = window;
				}

				if ( ! $ ) {
					$ = jq( root );
				}

				return factory( $, root, root.document );
			};
		}
		else {
			module.exports = factory( jq, window, window.document );
		}
	}
	else {
		// Browser
		window.DataTable = factory( jQuery, window, document );
	}
}(function( $, window, document ) {
	"use strict";

	
	var DataTable = function ( selector, options )
	{
		// Check if called with a window or jQuery object for DOM less applications
		// This is for backwards compatibility
		if (DataTable.factory(selector, options)) {
			return DataTable;
		}
	
		// When creating with `new`, create a new DataTable, returning the API instance
		if (this instanceof DataTable) {
			return $(selector).DataTable(options);
		}
		else {
			// Argument switching
			options = selector;
		}
	
		var _that = this;
		var emptyInit = options === undefined;
		var len = this.length;
	
		if ( emptyInit ) {
			options = {};
		}
	
		// Method to get DT API instance from jQuery object
		this.api = function ()
		{
			return new _Api( this );
		};
	
		this.each(function() {
			// For each initialisation we want to give it a clean initialisation
			// object that can be bashed around
			var o = {};
			var oInit = len > 1 ? // optimisation for single table case
				_fnExtend( o, options, true ) :
				options;
	
			
			var i=0, iLen;
			var sId = this.getAttribute( 'id' );
			var bInitHandedOff = false;
			var defaults = DataTable.defaults;
			var $this = $(this);
			
			
			/* Sanity check */
			if ( this.nodeName.toLowerCase() != 'table' )
			{
				_fnLog( null, 0, 'Non-table node initialisation ('+this.nodeName+')', 2 );
				return;
			}
			
			$(this).trigger( 'options.dt', oInit );
			
			/* Backwards compatibility for the defaults */
			_fnCompatOpts( defaults );
			_fnCompatCols( defaults.column );
			
			/* Convert the camel-case defaults to Hungarian */
			_fnCamelToHungarian( defaults, defaults, true );
			_fnCamelToHungarian( defaults.column, defaults.column, true );
			
			/* Setting up the initialisation object */
			_fnCamelToHungarian( defaults, $.extend( oInit, $this.data() ), true );
			
			
			
			/* Check to see if we are re-initialising a table */
			var allSettings = DataTable.settings;
			for ( i=0, iLen=allSettings.length ; i<iLen ; i++ )
			{
				var s = allSettings[i];
			
				/* Base check on table node */
				if (
					s.nTable == this ||
					(s.nTHead && s.nTHead.parentNode == this) ||
					(s.nTFoot && s.nTFoot.parentNode == this)
				) {
					var bRetrieve = oInit.bRetrieve !== undefined ? oInit.bRetrieve : defaults.bRetrieve;
					var bDestroy = oInit.bDestroy !== undefined ? oInit.bDestroy : defaults.bDestroy;
			
					if ( emptyInit || bRetrieve )
					{
						return s.oInstance;
					}
					else if ( bDestroy )
					{
						new DataTable.Api(s).destroy();
						break;
					}
					else
					{
						_fnLog( s, 0, 'Cannot reinitialise DataTable', 3 );
						return;
					}
				}
			
				/* If the element we are initialising has the same ID as a table which was previously
				 * initialised, but the table nodes don't match (from before) then we destroy the old
				 * instance by simply deleting it. This is under the assumption that the table has been
				 * destroyed by other methods. Anyone using non-id selectors will need to do this manually
				 */
				if ( s.sTableId == this.id )
				{
					allSettings.splice( i, 1 );
					break;
				}
			}
			
			/* Ensure the table has an ID - required for accessibility */
			if ( sId === null || sId === "" )
			{
				sId = "DataTables_Table_"+(DataTable.ext._unique++);
				this.id = sId;
			}
			
			/* Create the settings object for this table and set some of the default parameters */
			var oSettings = $.extend( true, {}, DataTable.models.oSettings, {
				"sDestroyWidth": $this[0].style.width,
				"sInstance":     sId,
				"sTableId":      sId,
				colgroup: $('<colgroup>').prependTo(this),
				fastData: function (row, column, type) {
					return _fnGetCellData(oSettings, row, column, type);
				}
			} );
			oSettings.nTable = this;
			oSettings.oInit  = oInit;
			
			allSettings.push( oSettings );
			
			// Make a single API instance available for internal handling
			oSettings.api = new _Api( oSettings );
			
			// Need to add the instance after the instance after the settings object has been added
			// to the settings array, so we can self reference the table instance if more than one
			oSettings.oInstance = (_that.length===1) ? _that : $this.dataTable();
			
			// Backwards compatibility, before we apply all the defaults
			_fnCompatOpts( oInit );
			
			// If the length menu is given, but the init display length is not, use the length menu
			if ( oInit.aLengthMenu && ! oInit.iDisplayLength )
			{
				oInit.iDisplayLength = Array.isArray(oInit.aLengthMenu[0])
					? oInit.aLengthMenu[0][0]
					: $.isPlainObject( oInit.aLengthMenu[0] )
						? oInit.aLengthMenu[0].value
						: oInit.aLengthMenu[0];
			}
			
			// Apply the defaults and init options to make a single init object will all
			// options defined from defaults and instance options.
			oInit = _fnExtend( $.extend( true, {}, defaults ), oInit );
			
			
			// Map the initialisation options onto the settings object
			_fnMap( oSettings.oFeatures, oInit, [
				"bPaginate",
				"bLengthChange",
				"bFilter",
				"bSort",
				"bSortMulti",
				"bInfo",
				"bProcessing",
				"bAutoWidth",
				"bSortClasses",
				"bServerSide",
				"bDeferRender"
			] );
			_fnMap( oSettings, oInit, [
				"ajax",
				"fnFormatNumber",
				"sServerMethod",
				"aaSorting",
				"aaSortingFixed",
				"aLengthMenu",
				"sPaginationType",
				"iStateDuration",
				"bSortCellsTop",
				"iTabIndex",
				"sDom",
				"fnStateLoadCallback",
				"fnStateSaveCallback",
				"renderer",
				"searchDelay",
				"rowId",
				"caption",
				"layout",
				[ "iCookieDuration", "iStateDuration" ], // backwards compat
				[ "oSearch", "oPreviousSearch" ],
				[ "aoSearchCols", "aoPreSearchCols" ],
				[ "iDisplayLength", "_iDisplayLength" ]
			] );
			_fnMap( oSettings.oScroll, oInit, [
				[ "sScrollX", "sX" ],
				[ "sScrollXInner", "sXInner" ],
				[ "sScrollY", "sY" ],
				[ "bScrollCollapse", "bCollapse" ]
			] );
			_fnMap( oSettings.oLanguage, oInit, "fnInfoCallback" );
			
			/* Callback functions which are array driven */
			_fnCallbackReg( oSettings, 'aoDrawCallback',       oInit.fnDrawCallback );
			_fnCallbackReg( oSettings, 'aoStateSaveParams',    oInit.fnStateSaveParams );
			_fnCallbackReg( oSettings, 'aoStateLoadParams',    oInit.fnStateLoadParams );
			_fnCallbackReg( oSettings, 'aoStateLoaded',        oInit.fnStateLoaded );
			_fnCallbackReg( oSettings, 'aoRowCallback',        oInit.fnRowCallback );
			_fnCallbackReg( oSettings, 'aoRowCreatedCallback', oInit.fnCreatedRow );
			_fnCallbackReg( oSettings, 'aoHeaderCallback',     oInit.fnHeaderCallback );
			_fnCallbackReg( oSettings, 'aoFooterCallback',     oInit.fnFooterCallback );
			_fnCallbackReg( oSettings, 'aoInitComplete',       oInit.fnInitComplete );
			_fnCallbackReg( oSettings, 'aoPreDrawCallback',    oInit.fnPreDrawCallback );
			
			oSettings.rowIdFn = _fnGetObjectDataFn( oInit.rowId );
			
			/* Browser support detection */
			_fnBrowserDetect( oSettings );
			
			var oClasses = oSettings.oClasses;
			
			$.extend( oClasses, DataTable.ext.classes, oInit.oClasses );
			$this.addClass( oClasses.table );
			
			if (! oSettings.oFeatures.bPaginate) {
				oInit.iDisplayStart = 0;
			}
			
			if ( oSettings.iInitDisplayStart === undefined )
			{
				/* Display start point, taking into account the save saving */
				oSettings.iInitDisplayStart = oInit.iDisplayStart;
				oSettings._iDisplayStart = oInit.iDisplayStart;
			}
			
			/* Language definitions */
			var oLanguage = oSettings.oLanguage;
			$.extend( true, oLanguage, oInit.oLanguage );
			
			if ( oLanguage.sUrl )
			{
				/* Get the language definitions from a file - because this Ajax call makes the language
				 * get async to the remainder of this function we use bInitHandedOff to indicate that
				 * _fnInitialise will be fired by the returned Ajax handler, rather than the constructor
				 */
				$.ajax( {
					dataType: 'json',
					url: oLanguage.sUrl,
					success: function ( json ) {
						_fnCamelToHungarian( defaults.oLanguage, json );
						$.extend( true, oLanguage, json, oSettings.oInit.oLanguage );
			
						_fnCallbackFire( oSettings, null, 'i18n', [oSettings], true);
						_fnInitialise( oSettings );
					},
					error: function () {
						// Error occurred loading language file
						_fnLog( oSettings, 0, 'i18n file loading error', 21 );
			
						// continue on as best we can
						_fnInitialise( oSettings );
					}
				} );
				bInitHandedOff = true;
			}
			else {
				_fnCallbackFire( oSettings, null, 'i18n', [oSettings]);
			}
			
			/*
			 * Columns
			 * See if we should load columns automatically or use defined ones
			 */
			var columnsInit = [];
			var thead = this.getElementsByTagName('thead');
			var initHeaderLayout = _fnDetectHeader( oSettings, thead[0] );
			
			// If we don't have a columns array, then generate one with nulls
			if ( oInit.aoColumns ) {
				columnsInit = oInit.aoColumns;
			}
			else if ( initHeaderLayout.length ) {
				for ( i=0, iLen=initHeaderLayout[0].length ; i<iLen ; i++ ) {
					columnsInit.push( null );
				}
			}
			
			// Add the columns
			for ( i=0, iLen=columnsInit.length ; i<iLen ; i++ ) {
				_fnAddColumn( oSettings );
			}
			
			// Apply the column definitions
			_fnApplyColumnDefs( oSettings, oInit.aoColumnDefs, columnsInit, initHeaderLayout, function (iCol, oDef) {
				_fnColumnOptions( oSettings, iCol, oDef );
			} );
			
			/* HTML5 attribute detection - build an mData object automatically if the
			 * attributes are found
			 */
			var rowOne = $this.children('tbody').find('tr').eq(0);
			
			if ( rowOne.length ) {
				var a = function ( cell, name ) {
					return cell.getAttribute( 'data-'+name ) !== null ? name : null;
				};
			
				$( rowOne[0] ).children('th, td').each( function (i, cell) {
					var col = oSettings.aoColumns[i];
			
					if (! col) {
						_fnLog( oSettings, 0, 'Incorrect column count', 18 );
					}
			
					if ( col.mData === i ) {
						var sort = a( cell, 'sort' ) || a( cell, 'order' );
						var filter = a( cell, 'filter' ) || a( cell, 'search' );
			
						if ( sort !== null || filter !== null ) {
							col.mData = {
								_:      i+'.display',
								sort:   sort !== null   ? i+'.@data-'+sort   : undefined,
								type:   sort !== null   ? i+'.@data-'+sort   : undefined,
								filter: filter !== null ? i+'.@data-'+filter : undefined
							};
							col._isArrayHost = true;
			
							_fnColumnOptions( oSettings, i );
						}
					}
				} );
			}
			
			var features = oSettings.oFeatures;
			var loadedInit = function () {
				/*
				 * Sorting
				 * @todo For modularisation (1.11) this needs to do into a sort start up handler
				 */
			
				// If aaSorting is not defined, then we use the first indicator in asSorting
				// in case that has been altered, so the default sort reflects that option
				if ( oInit.aaSorting === undefined ) {
					var sorting = oSettings.aaSorting;
					for ( i=0, iLen=sorting.length ; i<iLen ; i++ ) {
						sorting[i][1] = oSettings.aoColumns[ i ].asSorting[0];
					}
				}
			
				/* Do a first pass on the sorting classes (allows any size changes to be taken into
				 * account, and also will apply sorting disabled classes if disabled
				 */
				_fnSortingClasses( oSettings );
			
				_fnCallbackReg( oSettings, 'aoDrawCallback', function () {
					if ( oSettings.bSorted || _fnDataSource( oSettings ) === 'ssp' || features.bDeferRender ) {
						_fnSortingClasses( oSettings );
					}
				} );
			
			
				/*
				 * Final init
				 * Cache the header, body and footer as required, creating them if needed
				 */
				var caption = $this.children('caption');
			
				if ( oSettings.caption ) {
					if ( caption.length === 0 ) {
						caption = $('<caption/>').appendTo( $this );
					}
			
					caption.html( oSettings.caption );
				}
			
				// Store the caption side, so we can remove the element from the document
				// when creating the element
				if (caption.length) {
					caption[0]._captionSide = caption.css('caption-side');
					oSettings.captionNode = caption[0];
				}
			
				if ( thead.length === 0 ) {
					thead = $('<thead/>').appendTo($this);
				}
				oSettings.nTHead = thead[0];
				$('tr', thead).addClass(oClasses.thead.row);
			
				var tbody = $this.children('tbody');
				if ( tbody.length === 0 ) {
					tbody = $('<tbody/>').insertAfter(thead);
				}
				oSettings.nTBody = tbody[0];
			
				var tfoot = $this.children('tfoot');
				if ( tfoot.length === 0 ) {
					// If we are a scrolling table, and no footer has been given, then we need to create
					// a tfoot element for the caption element to be appended to
					tfoot = $('<tfoot/>').appendTo($this);
				}
				oSettings.nTFoot = tfoot[0];
				$('tr', tfoot).addClass(oClasses.tfoot.row);
			
				// Check if there is data passing into the constructor
				if ( oInit.aaData ) {
					for ( i=0 ; i<oInit.aaData.length ; i++ ) {
						_fnAddData( oSettings, oInit.aaData[ i ] );
					}
				}
				else if ( _fnDataSource( oSettings ) == 'dom' ) {
					// Grab the data from the page
					_fnAddTr( oSettings, $(oSettings.nTBody).children('tr') );
				}
			
				/* Copy the data index array */
				oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
			
				/* Initialisation complete - table can be drawn */
				oSettings.bInitialised = true;
			
				/* Check if we need to initialise the table (it might not have been handed off to the
				 * language processor)
				 */
				if ( bInitHandedOff === false ) {
					_fnInitialise( oSettings );
				}
			};
			
			/* Must be done after everything which can be overridden by the state saving! */
			_fnCallbackReg( oSettings, 'aoDrawCallback', _fnSaveState );
			
			if ( oInit.bStateSave )
			{
				features.bStateSave = true;
				_fnLoadState( oSettings, oInit, loadedInit );
			}
			else {
				loadedInit();
			}
			
		} );
		_that = null;
		return this;
	};
	
	
	
	/**
	 * DataTables extensions
	 * 
	 * This namespace acts as a collection area for plug-ins that can be used to
	 * extend DataTables capabilities. Indeed many of the build in methods
	 * use this method to provide their own capabilities (sorting methods for
	 * example).
	 *
	 * Note that this namespace is aliased to `jQuery.fn.dataTableExt` for legacy
	 * reasons
	 *
	 *  @namespace
	 */
	DataTable.ext = _ext = {
		/**
		 * Buttons. For use with the Buttons extension for DataTables. This is
		 * defined here so other extensions can define buttons regardless of load
		 * order. It is _not_ used by DataTables core.
		 *
		 *  @type object
		 *  @default {}
		 */
		buttons: {},
	
	
		/**
		 * Element class names
		 *
		 *  @type object
		 *  @default {}
		 */
		classes: {},
	
	
		/**
		 * DataTables build type (expanded by the download builder)
		 *
		 *  @type string
		 */
		build:"bs5/dt-2.0.2/e-2.3.1",
	
	
		/**
		 * Error reporting.
		 * 
		 * How should DataTables report an error. Can take the value 'alert',
		 * 'throw', 'none' or a function.
		 *
		 *  @type string|function
		 *  @default alert
		 */
		errMode: "alert",
	
	
		/**
		 * Legacy so v1 plug-ins don't throw js errors on load
		 */
		feature: [],
	
		/**
		 * Feature plug-ins.
		 * 
		 * This is an object of callbacks which provide the features for DataTables
		 * to be initialised via the `layout` option.
		 */
		features: {},
	
	
		/**
		 * Row searching.
		 * 
		 * This method of searching is complimentary to the default type based
		 * searching, and a lot more comprehensive as it allows you complete control
		 * over the searching logic. Each element in this array is a function
		 * (parameters described below) that is called for every row in the table,
		 * and your logic decides if it should be included in the searching data set
		 * or not.
		 *
		 * Searching functions have the following input parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 * 2. `{array|object}` Data for the row to be processed (same as the
		 *    original format that was passed in as the data source, or an array
		 *    from a DOM data source
		 * 3. `{int}` Row index ({@link DataTable.models.oSettings.aoData}), which
		 *    can be useful to retrieve the `TR` element if you need DOM interaction.
		 *
		 * And the following return is expected:
		 *
		 * * {boolean} Include the row in the searched result set (true) or not
		 *   (false)
		 *
		 * Note that as with the main search ability in DataTables, technically this
		 * is "filtering", since it is subtractive. However, for consistency in
		 * naming we call it searching here.
		 *
		 *  @type array
		 *  @default []
		 *
		 *  @example
		 *    // The following example shows custom search being applied to the
		 *    // fourth column (i.e. the data[3] index) based on two input values
		 *    // from the end-user, matching the data in a certain range.
		 *    $.fn.dataTable.ext.search.push(
		 *      function( settings, data, dataIndex ) {
		 *        var min = document.getElementById('min').value * 1;
		 *        var max = document.getElementById('max').value * 1;
		 *        var version = data[3] == "-" ? 0 : data[3]*1;
		 *
		 *        if ( min == "" && max == "" ) {
		 *          return true;
		 *        }
		 *        else if ( min == "" && version < max ) {
		 *          return true;
		 *        }
		 *        else if ( min < version && "" == max ) {
		 *          return true;
		 *        }
		 *        else if ( min < version && version < max ) {
		 *          return true;
		 *        }
		 *        return false;
		 *      }
		 *    );
		 */
		search: [],
	
	
		/**
		 * Selector extensions
		 *
		 * The `selector` option can be used to extend the options available for the
		 * selector modifier options (`selector-modifier` object data type) that
		 * each of the three built in selector types offer (row, column and cell +
		 * their plural counterparts). For example the Select extension uses this
		 * mechanism to provide an option to select only rows, columns and cells
		 * that have been marked as selected by the end user (`{selected: true}`),
		 * which can be used in conjunction with the existing built in selector
		 * options.
		 *
		 * Each property is an array to which functions can be pushed. The functions
		 * take three attributes:
		 *
		 * * Settings object for the host table
		 * * Options object (`selector-modifier` object type)
		 * * Array of selected item indexes
		 *
		 * The return is an array of the resulting item indexes after the custom
		 * selector has been applied.
		 *
		 *  @type object
		 */
		selector: {
			cell: [],
			column: [],
			row: []
		},
	
	
		/**
		 * Legacy configuration options. Enable and disable legacy options that
		 * are available in DataTables.
		 *
		 *  @type object
		 */
		legacy: {
			/**
			 * Enable / disable DataTables 1.9 compatible server-side processing
			 * requests
			 *
			 *  @type boolean
			 *  @default null
			 */
			ajax: null
		},
	
	
		/**
		 * Pagination plug-in methods.
		 * 
		 * Each entry in this object is a function and defines which buttons should
		 * be shown by the pagination rendering method that is used for the table:
		 * {@link DataTable.ext.renderer.pageButton}. The renderer addresses how the
		 * buttons are displayed in the document, while the functions here tell it
		 * what buttons to display. This is done by returning an array of button
		 * descriptions (what each button will do).
		 *
		 * Pagination types (the four built in options and any additional plug-in
		 * options defined here) can be used through the `paginationType`
		 * initialisation parameter.
		 *
		 * The functions defined take two parameters:
		 *
		 * 1. `{int} page` The current page index
		 * 2. `{int} pages` The number of pages in the table
		 *
		 * Each function is expected to return an array where each element of the
		 * array can be one of:
		 *
		 * * `first` - Jump to first page when activated
		 * * `last` - Jump to last page when activated
		 * * `previous` - Show previous page when activated
		 * * `next` - Show next page when activated
		 * * `{int}` - Show page of the index given
		 * * `{array}` - A nested array containing the above elements to add a
		 *   containing 'DIV' element (might be useful for styling).
		 *
		 * Note that DataTables v1.9- used this object slightly differently whereby
		 * an object with two functions would be defined for each plug-in. That
		 * ability is still supported by DataTables 1.10+ to provide backwards
		 * compatibility, but this option of use is now decremented and no longer
		 * documented in DataTables 1.10+.
		 *
		 *  @type object
		 *  @default {}
		 *
		 *  @example
		 *    // Show previous, next and current page buttons only
		 *    $.fn.dataTableExt.oPagination.current = function ( page, pages ) {
		 *      return [ 'previous', page, 'next' ];
		 *    };
		 */
		pager: {},
	
	
		renderer: {
			pageButton: {},
			header: {}
		},
	
	
		/**
		 * Ordering plug-ins - custom data source
		 * 
		 * The extension options for ordering of data available here is complimentary
		 * to the default type based ordering that DataTables typically uses. It
		 * allows much greater control over the the data that is being used to
		 * order a column, but is necessarily therefore more complex.
		 * 
		 * This type of ordering is useful if you want to do ordering based on data
		 * live from the DOM (for example the contents of an 'input' element) rather
		 * than just the static string that DataTables knows of.
		 * 
		 * The way these plug-ins work is that you create an array of the values you
		 * wish to be ordering for the column in question and then return that
		 * array. The data in the array much be in the index order of the rows in
		 * the table (not the currently ordering order!). Which order data gathering
		 * function is run here depends on the `dt-init columns.orderDataType`
		 * parameter that is used for the column (if any).
		 *
		 * The functions defined take two parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 * 2. `{int}` Target column index
		 *
		 * Each function is expected to return an array:
		 *
		 * * `{array}` Data for the column to be ordering upon
		 *
		 *  @type array
		 *
		 *  @example
		 *    // Ordering using `input` node values
		 *    $.fn.dataTable.ext.order['dom-text'] = function  ( settings, col )
		 *    {
		 *      return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
		 *        return $('input', td).val();
		 *      } );
		 *    }
		 */
		order: {},
	
	
		/**
		 * Type based plug-ins.
		 *
		 * Each column in DataTables has a type assigned to it, either by automatic
		 * detection or by direct assignment using the `type` option for the column.
		 * The type of a column will effect how it is ordering and search (plug-ins
		 * can also make use of the column type if required).
		 *
		 * @namespace
		 */
		type: {
			/**
			 * Automatic column class assignment
			 */
			className: {},
	
			/**
			 * Type detection functions.
			 *
			 * The functions defined in this object are used to automatically detect
			 * a column's type, making initialisation of DataTables super easy, even
			 * when complex data is in the table.
			 *
			 * The functions defined take two parameters:
			 *
		     *  1. `{*}` Data from the column cell to be analysed
		     *  2. `{settings}` DataTables settings object. This can be used to
		     *     perform context specific type detection - for example detection
		     *     based on language settings such as using a comma for a decimal
		     *     place. Generally speaking the options from the settings will not
		     *     be required
			 *
			 * Each function is expected to return:
			 *
			 * * `{string|null}` Data type detected, or null if unknown (and thus
			 *   pass it on to the other type detection functions.
			 *
			 *  @type array
			 *
			 *  @example
			 *    // Currency type detection plug-in:
			 *    $.fn.dataTable.ext.type.detect.push(
			 *      function ( data, settings ) {
			 *        // Check the numeric part
			 *        if ( ! data.substring(1).match(/[0-9]/) ) {
			 *          return null;
			 *        }
			 *
			 *        // Check prefixed by currency
			 *        if ( data.charAt(0) == '$' || data.charAt(0) == '&pound;' ) {
			 *          return 'currency';
			 *        }
			 *        return null;
			 *      }
			 *    );
			 */
			detect: [],
	
			/**
			 * Automatic renderer assignment
			 */
			render: {},
	
	
			/**
			 * Type based search formatting.
			 *
			 * The type based searching functions can be used to pre-format the
			 * data to be search on. For example, it can be used to strip HTML
			 * tags or to de-format telephone numbers for numeric only searching.
			 *
			 * Note that is a search is not defined for a column of a given type,
			 * no search formatting will be performed.
			 * 
			 * Pre-processing of searching data plug-ins - When you assign the sType
			 * for a column (or have it automatically detected for you by DataTables
			 * or a type detection plug-in), you will typically be using this for
			 * custom sorting, but it can also be used to provide custom searching
			 * by allowing you to pre-processing the data and returning the data in
			 * the format that should be searched upon. This is done by adding
			 * functions this object with a parameter name which matches the sType
			 * for that target column. This is the corollary of <i>afnSortData</i>
			 * for searching data.
			 *
			 * The functions defined take a single parameter:
			 *
		     *  1. `{*}` Data from the column cell to be prepared for searching
			 *
			 * Each function is expected to return:
			 *
			 * * `{string|null}` Formatted string that will be used for the searching.
			 *
			 *  @type object
			 *  @default {}
			 *
			 *  @example
			 *    $.fn.dataTable.ext.type.search['title-numeric'] = function ( d ) {
			 *      return d.replace(/\n/g," ").replace( /<.*?>/g, "" );
			 *    }
			 */
			search: {},
	
	
			/**
			 * Type based ordering.
			 *
			 * The column type tells DataTables what ordering to apply to the table
			 * when a column is sorted upon. The order for each type that is defined,
			 * is defined by the functions available in this object.
			 *
			 * Each ordering option can be described by three properties added to
			 * this object:
			 *
			 * * `{type}-pre` - Pre-formatting function
			 * * `{type}-asc` - Ascending order function
			 * * `{type}-desc` - Descending order function
			 *
			 * All three can be used together, only `{type}-pre` or only
			 * `{type}-asc` and `{type}-desc` together. It is generally recommended
			 * that only `{type}-pre` is used, as this provides the optimal
			 * implementation in terms of speed, although the others are provided
			 * for compatibility with existing Javascript sort functions.
			 *
			 * `{type}-pre`: Functions defined take a single parameter:
			 *
		     *  1. `{*}` Data from the column cell to be prepared for ordering
			 *
			 * And return:
			 *
			 * * `{*}` Data to be sorted upon
			 *
			 * `{type}-asc` and `{type}-desc`: Functions are typical Javascript sort
			 * functions, taking two parameters:
			 *
		     *  1. `{*}` Data to compare to the second parameter
		     *  2. `{*}` Data to compare to the first parameter
			 *
			 * And returning:
			 *
			 * * `{*}` Ordering match: <0 if first parameter should be sorted lower
			 *   than the second parameter, ===0 if the two parameters are equal and
			 *   >0 if the first parameter should be sorted height than the second
			 *   parameter.
			 * 
			 *  @type object
			 *  @default {}
			 *
			 *  @example
			 *    // Numeric ordering of formatted numbers with a pre-formatter
			 *    $.extend( $.fn.dataTable.ext.type.order, {
			 *      "string-pre": function(x) {
			 *        a = (a === "-" || a === "") ? 0 : a.replace( /[^\d\-\.]/g, "" );
			 *        return parseFloat( a );
			 *      }
			 *    } );
			 *
			 *  @example
			 *    // Case-sensitive string ordering, with no pre-formatting method
			 *    $.extend( $.fn.dataTable.ext.order, {
			 *      "string-case-asc": function(x,y) {
			 *        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			 *      },
			 *      "string-case-desc": function(x,y) {
			 *        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
			 *      }
			 *    } );
			 */
			order: {}
		},
	
		/**
		 * Unique DataTables instance counter
		 *
		 * @type int
		 * @private
		 */
		_unique: 0,
	
	
		//
		// Depreciated
		// The following properties are retained for backwards compatibility only.
		// The should not be used in new projects and will be removed in a future
		// version
		//
	
		/**
		 * Version check function.
		 *  @type function
		 *  @depreciated Since 1.10
		 */
		fnVersionCheck: DataTable.fnVersionCheck,
	
	
		/**
		 * Index for what 'this' index API functions should use
		 *  @type int
		 *  @deprecated Since v1.10
		 */
		iApiIndex: 0,
	
	
		/**
		 * Software version
		 *  @type string
		 *  @deprecated Since v1.10
		 */
		sVersion: DataTable.version
	};
	
	
	//
	// Backwards compatibility. Alias to pre 1.10 Hungarian notation counter parts
	//
	$.extend( _ext, {
		afnFiltering: _ext.search,
		aTypes:       _ext.type.detect,
		ofnSearch:    _ext.type.search,
		oSort:        _ext.type.order,
		afnSortData:  _ext.order,
		aoFeatures:   _ext.feature,
		oStdClasses:  _ext.classes,
		oPagination:  _ext.pager
	} );
	
	
	$.extend( DataTable.ext.classes, {
		container: 'dt-container',
		empty: {
			row: 'dt-empty'
		},
		info: {
			container: 'dt-info'
		},
		length: {
			container: 'dt-length',
			select: 'dt-input'
		},
		order: {
			canAsc: 'dt-orderable-asc',
			canDesc: 'dt-orderable-desc',
			isAsc: 'dt-ordering-asc',
			isDesc: 'dt-ordering-desc',
			none: 'dt-orderable-none',
			position: 'sorting_'
		},
		processing: {
			container: 'dt-processing'
		},
		scrolling: {
			body: 'dt-scroll-body',
			container: 'dt-scroll',
			footer: {
				self: 'dt-scroll-foot',
				inner: 'dt-scroll-footInner'
			},
			header: {
				self: 'dt-scroll-head',
				inner: 'dt-scroll-headInner'
			}
		},
		search: {
			container: 'dt-search',
			input: 'dt-input'
		},
		table: 'dataTable',	
		tbody: {
			cell: '',
			row: ''
		},
		thead: {
			cell: '',
			row: ''
		},
		tfoot: {
			cell: '',
			row: ''
		},
		paging: {
			active: 'current',
			button: 'dt-paging-button',
			container: 'dt-paging',
			disabled: 'disabled'
		}
	} );
	
	
	/*
	 * It is useful to have variables which are scoped locally so only the
	 * DataTables functions can access them and they don't leak into global space.
	 * At the same time these functions are often useful over multiple files in the
	 * core and API, so we list, or at least document, all variables which are used
	 * by DataTables as private variables here. This also ensures that there is no
	 * clashing of variable names and that they can easily referenced for reuse.
	 */
	
	
	// Defined else where
	//  _selector_run
	//  _selector_opts
	//  _selector_row_indexes
	
	var _ext; // DataTable.ext
	var _Api; // DataTable.Api
	var _api_register; // DataTable.Api.register
	var _api_registerPlural; // DataTable.Api.registerPlural
	
	var _re_dic = {};
	var _re_new_lines = /[\r\n\u2028]/g;
	var _re_html = /<.*?>/g;
	
	// This is not strict ISO8601 - Date.parse() is quite lax, although
	// implementations differ between browsers.
	var _re_date = /^\d{2,4}[./-]\d{1,2}[./-]\d{1,2}([T ]{1}\d{1,2}[:.]\d{2}([.:]\d{2})?)?$/;
	
	// Escape regular expression special characters
	var _re_escape_regex = new RegExp( '(\\' + [ '/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\', '$', '^', '-' ].join('|\\') + ')', 'g' );
	
	// https://en.wikipedia.org/wiki/Foreign_exchange_market
	// - \u20BD - Russian ruble.
	// - \u20a9 - South Korean Won
	// - \u20BA - Turkish Lira
	// - \u20B9 - Indian Rupee
	// - R - Brazil (R$) and South Africa
	// - fr - Swiss Franc
	// - kr - Swedish krona, Norwegian krone and Danish krone
	// - \u2009 is thin space and \u202F is narrow no-break space, both used in many
	// - Ƀ - Bitcoin
	// - Ξ - Ethereum
	//   standards as thousands separators.
	var _re_formatted_numeric = /['\u00A0,$£€¥%\u2009\u202F\u20BD\u20a9\u20BArfkɃΞ]/gi;
	
	
	var _empty = function ( d ) {
		return !d || d === true || d === '-' ? true : false;
	};
	
	
	var _intVal = function ( s ) {
		var integer = parseInt( s, 10 );
		return !isNaN(integer) && isFinite(s) ? integer : null;
	};
	
	// Convert from a formatted number with characters other than `.` as the
	// decimal place, to a Javascript number
	var _numToDecimal = function ( num, decimalPoint ) {
		// Cache created regular expressions for speed as this function is called often
		if ( ! _re_dic[ decimalPoint ] ) {
			_re_dic[ decimalPoint ] = new RegExp( _fnEscapeRegex( decimalPoint ), 'g' );
		}
		return typeof num === 'string' && decimalPoint !== '.' ?
			num.replace( /\./g, '' ).replace( _re_dic[ decimalPoint ], '.' ) :
			num;
	};
	
	
	var _isNumber = function ( d, decimalPoint, formatted ) {
		var type = typeof d;
		var strType = type === 'string';
	
		if ( type === 'number' || type === 'bigint') {
			return true;
		}
	
		// If empty return immediately so there must be a number if it is a
		// formatted string (this stops the string "k", or "kr", etc being detected
		// as a formatted number for currency
		if ( _empty( d ) ) {
			return true;
		}
	
		if ( decimalPoint && strType ) {
			d = _numToDecimal( d, decimalPoint );
		}
	
		if ( formatted && strType ) {
			d = d.replace( _re_formatted_numeric, '' );
		}
	
		return !isNaN( parseFloat(d) ) && isFinite( d );
	};
	
	
	// A string without HTML in it can be considered to be HTML still
	var _isHtml = function ( d ) {
		return _empty( d ) || typeof d === 'string';
	};
	
	// Is a string a number surrounded by HTML?
	var _htmlNumeric = function ( d, decimalPoint, formatted ) {
		if ( _empty( d ) ) {
			return true;
		}
	
		// input and select strings mean that this isn't just a number
		if (typeof d === 'string' && d.match(/<(input|select)/i)) {
			return null;
		}
	
		var html = _isHtml( d );
		return ! html ?
			null :
			_isNumber( _stripHtml( d ), decimalPoint, formatted ) ?
				true :
				null;
	};
	
	
	var _pluck = function ( a, prop, prop2 ) {
		var out = [];
		var i=0, ien=a.length;
	
		// Could have the test in the loop for slightly smaller code, but speed
		// is essential here
		if ( prop2 !== undefined ) {
			for ( ; i<ien ; i++ ) {
				if ( a[i] && a[i][ prop ] ) {
					out.push( a[i][ prop ][ prop2 ] );
				}
			}
		}
		else {
			for ( ; i<ien ; i++ ) {
				if ( a[i] ) {
					out.push( a[i][ prop ] );
				}
			}
		}
	
		return out;
	};
	
	
	// Basically the same as _pluck, but rather than looping over `a` we use `order`
	// as the indexes to pick from `a`
	var _pluck_order = function ( a, order, prop, prop2 )
	{
		var out = [];
		var i=0, ien=order.length;
	
		// Could have the test in the loop for slightly smaller code, but speed
		// is essential here
		if ( prop2 !== undefined ) {
			for ( ; i<ien ; i++ ) {
				if ( a[ order[i] ][ prop ] ) {
					out.push( a[ order[i] ][ prop ][ prop2 ] );
				}
			}
		}
		else {
			for ( ; i<ien ; i++ ) {
				if ( a[ order[i] ] ) {
					out.push( a[ order[i] ][ prop ] );
				}
			}
		}
	
		return out;
	};
	
	
	var _range = function ( len, start )
	{
		var out = [];
		var end;
	
		if ( start === undefined ) {
			start = 0;
			end = len;
		}
		else {
			end = start;
			start = len;
		}
	
		for ( var i=start ; i<end ; i++ ) {
			out.push( i );
		}
	
		return out;
	};
	
	
	var _removeEmpty = function ( a )
	{
		var out = [];
	
		for ( var i=0, ien=a.length ; i<ien ; i++ ) {
			if ( a[i] ) { // careful - will remove all falsy values!
				out.push( a[i] );
			}
		}
	
		return out;
	};
	
	// Replaceable function in api.util
	var _stripHtml = function ( d ) {
		return d
			.replace( _re_html, '' ) // Complete tags
			.replace(/<script/i, ''); // Safety for incomplete script tag
	};
	
	// Replaceable function in api.util
	var _escapeHtml = function ( d ) {
		if (Array.isArray(d)) {
			d = d.join(',');
		}
	
		return typeof d === 'string' ?
			d
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;') :
			d;
	};
	
	// Remove diacritics from a string by decomposing it and then removing
	// non-ascii characters
	var _normalize = function (str, both) {
		if (typeof str !== 'string') {
			return str;
		}
	
		// It is faster to just run `normalize` than it is to check if
		// we need to with a regex!
		var res = str.normalize("NFD");
	
		// Equally, here we check if a regex is needed or not
		return res.length !== str.length
			? (both === true ? str + ' ' : '' ) + res.replace(/[\u0300-\u036f]/g, "")
			: res;
	}
	
	/**
	 * Determine if all values in the array are unique. This means we can short
	 * cut the _unique method at the cost of a single loop. A sorted array is used
	 * to easily check the values.
	 *
	 * @param  {array} src Source array
	 * @return {boolean} true if all unique, false otherwise
	 * @ignore
	 */
	var _areAllUnique = function ( src ) {
		if ( src.length < 2 ) {
			return true;
		}
	
		var sorted = src.slice().sort();
		var last = sorted[0];
	
		for ( var i=1, ien=sorted.length ; i<ien ; i++ ) {
			if ( sorted[i] === last ) {
				return false;
			}
	
			last = sorted[i];
		}
	
		return true;
	};
	
	
	/**
	 * Find the unique elements in a source array.
	 *
	 * @param  {array} src Source array
	 * @return {array} Array of unique items
	 * @ignore
	 */
	var _unique = function ( src )
	{
		if (Array.from && Set) {
			return Array.from(new Set(src));
		}
	
		if ( _areAllUnique( src ) ) {
			return src.slice();
		}
	
		// A faster unique method is to use object keys to identify used values,
		// but this doesn't work with arrays or objects, which we must also
		// consider. See jsperf.app/compare-array-unique-versions/4 for more
		// information.
		var
			out = [],
			val,
			i, ien=src.length,
			j, k=0;
	
		again: for ( i=0 ; i<ien ; i++ ) {
			val = src[i];
	
			for ( j=0 ; j<k ; j++ ) {
				if ( out[j] === val ) {
					continue again;
				}
			}
	
			out.push( val );
			k++;
		}
	
		return out;
	};
	
	// Surprisingly this is faster than [].concat.apply
	// https://jsperf.com/flatten-an-array-loop-vs-reduce/2
	var _flatten = function (out, val) {
		if (Array.isArray(val)) {
			for (var i=0 ; i<val.length ; i++) {
				_flatten(out, val[i]);
			}
		}
		else {
			out.push(val);
		}
	
		return out;
	}
	
	// Similar to jQuery's addClass, but use classList.add
	function _addClass(el, name) {
		if (name) {
			name.split(' ').forEach(function (n) {
				if (n) {
					// `add` does deduplication, so no need to check `contains`
					el.classList.add(n);
				}
			});
		}
	}
	
	/**
	 * DataTables utility methods
	 * 
	 * This namespace provides helper methods that DataTables uses internally to
	 * create a DataTable, but which are not exclusively used only for DataTables.
	 * These methods can be used by extension authors to save the duplication of
	 * code.
	 *
	 *  @namespace
	 */
	DataTable.util = {
		/**
		 * Return a string with diacritic characters decomposed
		 * @param {*} mixed Function or string to normalize
		 * @param {*} both Return original string and the normalized string
		 * @returns String or undefined
		 */
		diacritics: function (mixed, both) {
			var type = typeof mixed;
	
			if (type !== 'function') {
				return _normalize(mixed, both);
			}
			_normalize = mixed;
		},
	
		/**
		 * Debounce a function
		 *
		 * @param {function} fn Function to be called
		 * @param {integer} freq Call frequency in mS
		 * @return {function} Wrapped function
		 */
		debounce: function ( fn, timeout ) {
			var timer;
	
			return function () {
				var that = this;
				var args = arguments;
	
				clearTimeout(timer);
	
				timer = setTimeout( function () {
					fn.apply(that, args);
				}, timeout || 250 );
			};
		},
	
		/**
		 * Throttle the calls to a function. Arguments and context are maintained
		 * for the throttled function.
		 *
		 * @param {function} fn Function to be called
		 * @param {integer} freq Call frequency in mS
		 * @return {function} Wrapped function
		 */
		throttle: function ( fn, freq ) {
			var
				frequency = freq !== undefined ? freq : 200,
				last,
				timer;
	
			return function () {
				var
					that = this,
					now  = +new Date(),
					args = arguments;
	
				if ( last && now < last + frequency ) {
					clearTimeout( timer );
	
					timer = setTimeout( function () {
						last = undefined;
						fn.apply( that, args );
					}, frequency );
				}
				else {
					last = now;
					fn.apply( that, args );
				}
			};
		},
	
		/**
		 * Escape a string such that it can be used in a regular expression
		 *
		 *  @param {string} val string to escape
		 *  @returns {string} escaped string
		 */
		escapeRegex: function ( val ) {
			return val.replace( _re_escape_regex, '\\$1' );
		},
	
		/**
		 * Create a function that will write to a nested object or array
		 * @param {*} source JSON notation string
		 * @returns Write function
		 */
		set: function ( source ) {
			if ( $.isPlainObject( source ) ) {
				/* Unlike get, only the underscore (global) option is used for for
				 * setting data since we don't know the type here. This is why an object
				 * option is not documented for `mData` (which is read/write), but it is
				 * for `mRender` which is read only.
				 */
				return DataTable.util.set( source._ );
			}
			else if ( source === null ) {
				// Nothing to do when the data source is null
				return function () {};
			}
			else if ( typeof source === 'function' ) {
				return function (data, val, meta) {
					source( data, 'set', val, meta );
				};
			}
			else if (
				typeof source === 'string' && (source.indexOf('.') !== -1 ||
				source.indexOf('[') !== -1 || source.indexOf('(') !== -1)
			) {
				// Like the get, we need to get data from a nested object
				var setData = function (data, val, src) {
					var a = _fnSplitObjNotation( src ), b;
					var aLast = a[a.length-1];
					var arrayNotation, funcNotation, o, innerSrc;
		
					for ( var i=0, iLen=a.length-1 ; i<iLen ; i++ ) {
						// Protect against prototype pollution
						if (a[i] === '__proto__' || a[i] === 'constructor') {
							throw new Error('Cannot set prototype values');
						}
		
						// Check if we are dealing with an array notation request
						arrayNotation = a[i].match(__reArray);
						funcNotation = a[i].match(__reFn);
		
						if ( arrayNotation ) {
							a[i] = a[i].replace(__reArray, '');
							data[ a[i] ] = [];
		
							// Get the remainder of the nested object to set so we can recurse
							b = a.slice();
							b.splice( 0, i+1 );
							innerSrc = b.join('.');
		
							// Traverse each entry in the array setting the properties requested
							if ( Array.isArray( val ) ) {
								for ( var j=0, jLen=val.length ; j<jLen ; j++ ) {
									o = {};
									setData( o, val[j], innerSrc );
									data[ a[i] ].push( o );
								}
							}
							else {
								// We've been asked to save data to an array, but it
								// isn't array data to be saved. Best that can be done
								// is to just save the value.
								data[ a[i] ] = val;
							}
		
							// The inner call to setData has already traversed through the remainder
							// of the source and has set the data, thus we can exit here
							return;
						}
						else if ( funcNotation ) {
							// Function call
							a[i] = a[i].replace(__reFn, '');
							data = data[ a[i] ]( val );
						}
		
						// If the nested object doesn't currently exist - since we are
						// trying to set the value - create it
						if ( data[ a[i] ] === null || data[ a[i] ] === undefined ) {
							data[ a[i] ] = {};
						}
						data = data[ a[i] ];
					}
		
					// Last item in the input - i.e, the actual set
					if ( aLast.match(__reFn ) ) {
						// Function call
						data = data[ aLast.replace(__reFn, '') ]( val );
					}
					else {
						// If array notation is used, we just want to strip it and use the property name
						// and assign the value. If it isn't used, then we get the result we want anyway
						data[ aLast.replace(__reArray, '') ] = val;
					}
				};
		
				return function (data, val) { // meta is also passed in, but not used
					return setData( data, val, source );
				};
			}
			else {
				// Array or flat object mapping
				return function (data, val) { // meta is also passed in, but not used
					data[source] = val;
				};
			}
		},
	
		/**
		 * Create a function that will read nested objects from arrays, based on JSON notation
		 * @param {*} source JSON notation string
		 * @returns Value read
		 */
		get: function ( source ) {
			if ( $.isPlainObject( source ) ) {
				// Build an object of get functions, and wrap them in a single call
				var o = {};
				$.each( source, function (key, val) {
					if ( val ) {
						o[key] = DataTable.util.get( val );
					}
				} );
		
				return function (data, type, row, meta) {
					var t = o[type] || o._;
					return t !== undefined ?
						t(data, type, row, meta) :
						data;
				};
			}
			else if ( source === null ) {
				// Give an empty string for rendering / sorting etc
				return function (data) { // type, row and meta also passed, but not used
					return data;
				};
			}
			else if ( typeof source === 'function' ) {
				return function (data, type, row, meta) {
					return source( data, type, row, meta );
				};
			}
			else if (
				typeof source === 'string' && (source.indexOf('.') !== -1 ||
				source.indexOf('[') !== -1 || source.indexOf('(') !== -1)
			) {
				/* If there is a . in the source string then the data source is in a
				 * nested object so we loop over the data for each level to get the next
				 * level down. On each loop we test for undefined, and if found immediately
				 * return. This allows entire objects to be missing and sDefaultContent to
				 * be used if defined, rather than throwing an error
				 */
				var fetchData = function (data, type, src) {
					var arrayNotation, funcNotation, out, innerSrc;
		
					if ( src !== "" ) {
						var a = _fnSplitObjNotation( src );
		
						for ( var i=0, iLen=a.length ; i<iLen ; i++ ) {
							// Check if we are dealing with special notation
							arrayNotation = a[i].match(__reArray);
							funcNotation = a[i].match(__reFn);
		
							if ( arrayNotation ) {
								// Array notation
								a[i] = a[i].replace(__reArray, '');
		
								// Condition allows simply [] to be passed in
								if ( a[i] !== "" ) {
									data = data[ a[i] ];
								}
								out = [];
		
								// Get the remainder of the nested object to get
								a.splice( 0, i+1 );
								innerSrc = a.join('.');
		
								// Traverse each entry in the array getting the properties requested
								if ( Array.isArray( data ) ) {
									for ( var j=0, jLen=data.length ; j<jLen ; j++ ) {
										out.push( fetchData( data[j], type, innerSrc ) );
									}
								}
		
								// If a string is given in between the array notation indicators, that
								// is used to join the strings together, otherwise an array is returned
								var join = arrayNotation[0].substring(1, arrayNotation[0].length-1);
								data = (join==="") ? out : out.join(join);
		
								// The inner call to fetchData has already traversed through the remainder
								// of the source requested, so we exit from the loop
								break;
							}
							else if ( funcNotation ) {
								// Function call
								a[i] = a[i].replace(__reFn, '');
								data = data[ a[i] ]();
								continue;
							}
		
							if (data === null || data[ a[i] ] === null) {
								return null;
							}
							else if ( data === undefined || data[ a[i] ] === undefined ) {
								return undefined;
							}
	
							data = data[ a[i] ];
						}
					}
		
					return data;
				};
		
				return function (data, type) { // row and meta also passed, but not used
					return fetchData( data, type, source );
				};
			}
			else {
				// Array or flat object mapping
				return function (data) { // row and meta also passed, but not used
					return data[source];
				};
			}
		},
	
		stripHtml: function (mixed) {
			var type = typeof mixed;
	
			if (type === 'function') {
				_stripHtml = mixed;
				return;
			}
			else if (type === 'string') {
				return _stripHtml(mixed);
			}
			return mixed;
		},
	
		escapeHtml: function (mixed) {
			var type = typeof mixed;
	
			if (type === 'function') {
				_escapeHtml = mixed;
				return;
			}
			else if (type === 'string' || Array.isArray(mixed)) {
				return _escapeHtml(mixed);
			}
			return mixed;
		},
	
		unique: _unique
	};
	
	
	
	/**
	 * Create a mapping object that allows camel case parameters to be looked up
	 * for their Hungarian counterparts. The mapping is stored in a private
	 * parameter called `_hungarianMap` which can be accessed on the source object.
	 *  @param {object} o
	 *  @memberof DataTable#oApi
	 */
	function _fnHungarianMap ( o )
	{
		var
			hungarian = 'a aa ai ao as b fn i m o s ',
			match,
			newKey,
			map = {};
	
		$.each( o, function (key) {
			match = key.match(/^([^A-Z]+?)([A-Z])/);
	
			if ( match && hungarian.indexOf(match[1]+' ') !== -1 )
			{
				newKey = key.replace( match[0], match[2].toLowerCase() );
				map[ newKey ] = key;
	
				if ( match[1] === 'o' )
				{
					_fnHungarianMap( o[key] );
				}
			}
		} );
	
		o._hungarianMap = map;
	}
	
	
	/**
	 * Convert from camel case parameters to Hungarian, based on a Hungarian map
	 * created by _fnHungarianMap.
	 *  @param {object} src The model object which holds all parameters that can be
	 *    mapped.
	 *  @param {object} user The object to convert from camel case to Hungarian.
	 *  @param {boolean} force When set to `true`, properties which already have a
	 *    Hungarian value in the `user` object will be overwritten. Otherwise they
	 *    won't be.
	 *  @memberof DataTable#oApi
	 */
	function _fnCamelToHungarian ( src, user, force )
	{
		if ( ! src._hungarianMap ) {
			_fnHungarianMap( src );
		}
	
		var hungarianKey;
	
		$.each( user, function (key) {
			hungarianKey = src._hungarianMap[ key ];
	
			if ( hungarianKey !== undefined && (force || user[hungarianKey] === undefined) )
			{
				// For objects, we need to buzz down into the object to copy parameters
				if ( hungarianKey.charAt(0) === 'o' )
				{
					// Copy the camelCase options over to the hungarian
					if ( ! user[ hungarianKey ] ) {
						user[ hungarianKey ] = {};
					}
					$.extend( true, user[hungarianKey], user[key] );
	
					_fnCamelToHungarian( src[hungarianKey], user[hungarianKey], force );
				}
				else {
					user[hungarianKey] = user[ key ];
				}
			}
		} );
	}
	
	/**
	 * Map one parameter onto another
	 *  @param {object} o Object to map
	 *  @param {*} knew The new parameter name
	 *  @param {*} old The old parameter name
	 */
	var _fnCompatMap = function ( o, knew, old ) {
		if ( o[ knew ] !== undefined ) {
			o[ old ] = o[ knew ];
		}
	};
	
	
	/**
	 * Provide backwards compatibility for the main DT options. Note that the new
	 * options are mapped onto the old parameters, so this is an external interface
	 * change only.
	 *  @param {object} init Object to map
	 */
	function _fnCompatOpts ( init )
	{
		_fnCompatMap( init, 'ordering',      'bSort' );
		_fnCompatMap( init, 'orderMulti',    'bSortMulti' );
		_fnCompatMap( init, 'orderClasses',  'bSortClasses' );
		_fnCompatMap( init, 'orderCellsTop', 'bSortCellsTop' );
		_fnCompatMap( init, 'order',         'aaSorting' );
		_fnCompatMap( init, 'orderFixed',    'aaSortingFixed' );
		_fnCompatMap( init, 'paging',        'bPaginate' );
		_fnCompatMap( init, 'pagingType',    'sPaginationType' );
		_fnCompatMap( init, 'pageLength',    'iDisplayLength' );
		_fnCompatMap( init, 'searching',     'bFilter' );
	
		// Boolean initialisation of x-scrolling
		if ( typeof init.sScrollX === 'boolean' ) {
			init.sScrollX = init.sScrollX ? '100%' : '';
		}
		if ( typeof init.scrollX === 'boolean' ) {
			init.scrollX = init.scrollX ? '100%' : '';
		}
	
		// Column search objects are in an array, so it needs to be converted
		// element by element
		var searchCols = init.aoSearchCols;
	
		if ( searchCols ) {
			for ( var i=0, ien=searchCols.length ; i<ien ; i++ ) {
				if ( searchCols[i] ) {
					_fnCamelToHungarian( DataTable.models.oSearch, searchCols[i] );
				}
			}
		}
	
		// Enable search delay if server-side processing is enabled
		if (init.serverSide && ! init.searchDelay) {
			init.searchDelay = 400;
		}
	}
	
	
	/**
	 * Provide backwards compatibility for column options. Note that the new options
	 * are mapped onto the old parameters, so this is an external interface change
	 * only.
	 *  @param {object} init Object to map
	 */
	function _fnCompatCols ( init )
	{
		_fnCompatMap( init, 'orderable',     'bSortable' );
		_fnCompatMap( init, 'orderData',     'aDataSort' );
		_fnCompatMap( init, 'orderSequence', 'asSorting' );
		_fnCompatMap( init, 'orderDataType', 'sortDataType' );
	
		// orderData can be given as an integer
		var dataSort = init.aDataSort;
		if ( typeof dataSort === 'number' && ! Array.isArray( dataSort ) ) {
			init.aDataSort = [ dataSort ];
		}
	}
	
	
	/**
	 * Browser feature detection for capabilities, quirks
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnBrowserDetect( settings )
	{
		// We don't need to do this every time DataTables is constructed, the values
		// calculated are specific to the browser and OS configuration which we
		// don't expect to change between initialisations
		if ( ! DataTable.__browser ) {
			var browser = {};
			DataTable.__browser = browser;
	
			// Scrolling feature / quirks detection
			var n = $('<div/>')
				.css( {
					position: 'fixed',
					top: 0,
					left: -1 * window.pageXOffset, // allow for scrolling
					height: 1,
					width: 1,
					overflow: 'hidden'
				} )
				.append(
					$('<div/>')
						.css( {
							position: 'absolute',
							top: 1,
							left: 1,
							width: 100,
							overflow: 'scroll'
						} )
						.append(
							$('<div/>')
								.css( {
									width: '100%',
									height: 10
								} )
						)
				)
				.appendTo( 'body' );
	
			var outer = n.children();
			var inner = outer.children();
	
			// Get scrollbar width
			browser.barWidth = outer[0].offsetWidth - outer[0].clientWidth;
	
			// In rtl text layout, some browsers (most, but not all) will place the
			// scrollbar on the left, rather than the right.
			browser.bScrollbarLeft = Math.round( inner.offset().left ) !== 1;
	
			n.remove();
		}
	
		$.extend( settings.oBrowser, DataTable.__browser );
		settings.oScroll.iBarWidth = DataTable.__browser.barWidth;
	}
	
	/**
	 * Add a column to the list used for the table with default values
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnAddColumn( oSettings )
	{
		// Add column to aoColumns array
		var oDefaults = DataTable.defaults.column;
		var iCol = oSettings.aoColumns.length;
		var oCol = $.extend( {}, DataTable.models.oColumn, oDefaults, {
			"aDataSort": oDefaults.aDataSort ? oDefaults.aDataSort : [iCol],
			"mData": oDefaults.mData ? oDefaults.mData : iCol,
			idx: iCol,
			searchFixed: {},
			colEl: $('<col>')
		} );
		oSettings.aoColumns.push( oCol );
	
		// Add search object for column specific search. Note that the `searchCols[ iCol ]`
		// passed into extend can be undefined. This allows the user to give a default
		// with only some of the parameters defined, and also not give a default
		var searchCols = oSettings.aoPreSearchCols;
		searchCols[ iCol ] = $.extend( {}, DataTable.models.oSearch, searchCols[ iCol ] );
	}
	
	
	/**
	 * Apply options for a column
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iCol column index to consider
	 *  @param {object} oOptions object with sType, bVisible and bSearchable etc
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnOptions( oSettings, iCol, oOptions )
	{
		var oCol = oSettings.aoColumns[ iCol ];
	
		/* User specified column options */
		if ( oOptions !== undefined && oOptions !== null )
		{
			// Backwards compatibility
			_fnCompatCols( oOptions );
	
			// Map camel case parameters to their Hungarian counterparts
			_fnCamelToHungarian( DataTable.defaults.column, oOptions, true );
	
			/* Backwards compatibility for mDataProp */
			if ( oOptions.mDataProp !== undefined && !oOptions.mData )
			{
				oOptions.mData = oOptions.mDataProp;
			}
	
			if ( oOptions.sType )
			{
				oCol._sManualType = oOptions.sType;
			}
		
			// `class` is a reserved word in Javascript, so we need to provide
			// the ability to use a valid name for the camel case input
			if ( oOptions.className && ! oOptions.sClass )
			{
				oOptions.sClass = oOptions.className;
			}
	
			var origClass = oCol.sClass;
	
			$.extend( oCol, oOptions );
			_fnMap( oCol, oOptions, "sWidth", "sWidthOrig" );
	
			// Merge class from previously defined classes with this one, rather than just
			// overwriting it in the extend above
			if (origClass !== oCol.sClass) {
				oCol.sClass = origClass + ' ' + oCol.sClass;
			}
	
			/* iDataSort to be applied (backwards compatibility), but aDataSort will take
			 * priority if defined
			 */
			if ( oOptions.iDataSort !== undefined )
			{
				oCol.aDataSort = [ oOptions.iDataSort ];
			}
			_fnMap( oCol, oOptions, "aDataSort" );
		}
	
		/* Cache the data get and set functions for speed */
		var mDataSrc = oCol.mData;
		var mData = _fnGetObjectDataFn( mDataSrc );
	
		// The `render` option can be given as an array to access the helper rendering methods.
		// The first element is the rendering method to use, the rest are the parameters to pass
		if ( oCol.mRender && Array.isArray( oCol.mRender ) ) {
			var copy = oCol.mRender.slice();
			var name = copy.shift();
	
			oCol.mRender = DataTable.render[name].apply(window, copy);
		}
	
		oCol._render = oCol.mRender ? _fnGetObjectDataFn( oCol.mRender ) : null;
	
		var attrTest = function( src ) {
			return typeof src === 'string' && src.indexOf('@') !== -1;
		};
		oCol._bAttrSrc = $.isPlainObject( mDataSrc ) && (
			attrTest(mDataSrc.sort) || attrTest(mDataSrc.type) || attrTest(mDataSrc.filter)
		);
		oCol._setter = null;
	
		oCol.fnGetData = function (rowData, type, meta) {
			var innerData = mData( rowData, type, undefined, meta );
	
			return oCol._render && type ?
				oCol._render( innerData, type, rowData, meta ) :
				innerData;
		};
		oCol.fnSetData = function ( rowData, val, meta ) {
			return _fnSetObjectDataFn( mDataSrc )( rowData, val, meta );
		};
	
		// Indicate if DataTables should read DOM data as an object or array
		// Used in _fnGetRowElements
		if ( typeof mDataSrc !== 'number' && ! oCol._isArrayHost ) {
			oSettings._rowReadObject = true;
		}
	
		/* Feature sorting overrides column specific when off */
		if ( !oSettings.oFeatures.bSort )
		{
			oCol.bSortable = false;
		}
	}
	
	
	/**
	 * Adjust the table column widths for new data. Note: you would probably want to
	 * do a redraw after calling this function!
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnAdjustColumnSizing ( settings )
	{
		_fnCalculateColumnWidths( settings );
		_fnColumnSizes( settings );
	
		var scroll = settings.oScroll;
		if ( scroll.sY !== '' || scroll.sX !== '') {
			_fnScrollDraw( settings );
		}
	
		_fnCallbackFire( settings, null, 'column-sizing', [settings] );
	}
	
	/**
	 * Apply column sizes
	 *
	 * @param {*} settings DataTables settings object
	 */
	function _fnColumnSizes ( settings )
	{
		var cols = settings.aoColumns;
	
		for (var i=0 ; i<cols.length ; i++) {
			var width = _fnColumnsSumWidth(settings, [i], false, false);
	
			cols[i].colEl.css('width', width);
		}
	}
	
	
	/**
	 * Convert the index of a visible column to the index in the data array (take account
	 * of hidden columns)
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iMatch Visible column index to lookup
	 *  @returns {int} i the data index
	 *  @memberof DataTable#oApi
	 */
	function _fnVisibleToColumnIndex( oSettings, iMatch )
	{
		var aiVis = _fnGetColumns( oSettings, 'bVisible' );
	
		return typeof aiVis[iMatch] === 'number' ?
			aiVis[iMatch] :
			null;
	}
	
	
	/**
	 * Convert the index of an index in the data array and convert it to the visible
	 *   column index (take account of hidden columns)
	 *  @param {int} iMatch Column index to lookup
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {int} i the data index
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnIndexToVisible( oSettings, iMatch )
	{
		var aiVis = _fnGetColumns( oSettings, 'bVisible' );
		var iPos = aiVis.indexOf(iMatch);
	
		return iPos !== -1 ? iPos : null;
	}
	
	
	/**
	 * Get the number of visible columns
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {int} i the number of visible columns
	 *  @memberof DataTable#oApi
	 */
	function _fnVisbleColumns( settings )
	{
		var layout = settings.aoHeader;
		var columns = settings.aoColumns;
		var vis = 0;
	
		if ( layout.length ) {
			for ( var i=0, ien=layout[0].length ; i<ien ; i++ ) {
				if ( columns[i].bVisible && $(layout[0][i].cell).css('display') !== 'none' ) {
					vis++;
				}
			}
		}
	
		return vis;
	}
	
	
	/**
	 * Get an array of column indexes that match a given property
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sParam Parameter in aoColumns to look for - typically
	 *    bVisible or bSearchable
	 *  @returns {array} Array of indexes with matched properties
	 *  @memberof DataTable#oApi
	 */
	function _fnGetColumns( oSettings, sParam )
	{
		var a = [];
	
		oSettings.aoColumns.map( function(val, i) {
			if ( val[sParam] ) {
				a.push( i );
			}
		} );
	
		return a;
	}
	
	
	/**
	 * Calculate the 'type' of a column
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnTypes ( settings )
	{
		var columns = settings.aoColumns;
		var data = settings.aoData;
		var types = DataTable.ext.type.detect;
		var i, ien, j, jen, k, ken;
		var col, detectedType, cache;
	
		// For each column, spin over the 
		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			col = columns[i];
			cache = [];
	
			if ( ! col.sType && col._sManualType ) {
				col.sType = col._sManualType;
			}
			else if ( ! col.sType ) {
				for ( j=0, jen=types.length ; j<jen ; j++ ) {
					for ( k=0, ken=data.length ; k<ken ; k++ ) {
	
						if (! data[k]) {
							continue;
						}
	
						// Use a cache array so we only need to get the type data
						// from the formatter once (when using multiple detectors)
						if ( cache[k] === undefined ) {
							cache[k] = _fnGetCellData( settings, k, i, 'type' );
						}
	
						detectedType = types[j]( cache[k], settings );
	
						// If null, then this type can't apply to this column, so
						// rather than testing all cells, break out. There is an
						// exception for the last type which is `html`. We need to
						// scan all rows since it is possible to mix string and HTML
						// types
						if ( ! detectedType && j !== types.length-2 ) {
							break;
						}
	
						// Only a single match is needed for html type since it is
						// bottom of the pile and very similar to string - but it
						// must not be empty
						if ( detectedType === 'html' && ! _empty(cache[k]) ) {
							break;
						}
					}
	
					// Type is valid for all data points in the column - use this
					// type
					if ( detectedType ) {
						col.sType = detectedType;
						break;
					}
				}
	
				// Fall back - if no type was detected, always use string
				if ( ! col.sType ) {
					col.sType = 'string';
				}
			}
	
			// Set class names for header / footer for auto type classes
			var autoClass = _ext.type.className[col.sType];
	
			if (autoClass) {
				_columnAutoClass(settings.aoHeader, i, autoClass);
				_columnAutoClass(settings.aoFooter, i, autoClass);
			}
	
			var renderer = _ext.type.render[col.sType];
	
			// This can only happen once! There is no way to remover
			// a renderer. After the first time the renderer has
			// already been set so createTr will run the renderer itself.
			if (renderer && ! col._render) {
				col._render = DataTable.util.get(renderer);
	
				_columnAutoRender(settings, i);
			}
		}
	}
	
	/**
	 * Apply an auto detected renderer to data which doesn't yet have
	 * a renderer
	 */
	function _columnAutoRender(settings, colIdx) {
		var data = settings.aoData;
	
		for (var i=0 ; i<data.length ; i++) {
			if (data[i].nTr) {
				// We have to update the display here since there is no
				// invalidation check for the data
				var display = _fnGetCellData( settings, i, colIdx, 'display' );
	
				data[i].displayData[colIdx] = display;
				_fnWriteCell(data[i].anCells[colIdx], display);
	
				// No need to update sort / filter data since it has
				// been invalidated and will be re-read with the
				// renderer now applied
			}
		}
	}
	
	/**
	 * Apply a class name to a column's header cells
	 */
	function _columnAutoClass(container, colIdx, className) {
		container.forEach(function (row) {
			if (row[colIdx] && row[colIdx].unique) {
				_addClass(row[colIdx].cell, className);
			}
		});
	}
	
	/**
	 * Take the column definitions and static columns arrays and calculate how
	 * they relate to column indexes. The callback function will then apply the
	 * definition found for a column to a suitable configuration object.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {array} aoColDefs The aoColumnDefs array that is to be applied
	 *  @param {array} aoCols The aoColumns array that defines columns individually
	 *  @param {array} headerLayout Layout for header as it was loaded
	 *  @param {function} fn Callback function - takes two parameters, the calculated
	 *    column index and the definition for that column.
	 *  @memberof DataTable#oApi
	 */
	function _fnApplyColumnDefs( oSettings, aoColDefs, aoCols, headerLayout, fn )
	{
		var i, iLen, j, jLen, k, kLen, def;
		var columns = oSettings.aoColumns;
	
		if ( aoCols ) {
			for ( i=0, iLen=aoCols.length ; i<iLen ; i++ ) {
				if (aoCols[i] && aoCols[i].name) {
					columns[i].sName = aoCols[i].name;
				}
			}
		}
	
		// Column definitions with aTargets
		if ( aoColDefs )
		{
			/* Loop over the definitions array - loop in reverse so first instance has priority */
			for ( i=aoColDefs.length-1 ; i>=0 ; i-- )
			{
				def = aoColDefs[i];
	
				/* Each definition can target multiple columns, as it is an array */
				var aTargets = def.target !== undefined
					? def.target
					: def.targets !== undefined
						? def.targets
						: def.aTargets;
	
				if ( ! Array.isArray( aTargets ) )
				{
					aTargets = [ aTargets ];
				}
	
				for ( j=0, jLen=aTargets.length ; j<jLen ; j++ )
				{
					var target = aTargets[j];
	
					if ( typeof target === 'number' && target >= 0 )
					{
						/* Add columns that we don't yet know about */
						while( columns.length <= target )
						{
							_fnAddColumn( oSettings );
						}
	
						/* Integer, basic index */
						fn( target, def );
					}
					else if ( typeof target === 'number' && target < 0 )
					{
						/* Negative integer, right to left column counting */
						fn( columns.length+target, def );
					}
					else if ( typeof target === 'string' )
					{
						for ( k=0, kLen=columns.length ; k<kLen ; k++ ) {
							if (target === '_all') {
								// Apply to all columns
								fn( k, def );
							}
							else if (target.indexOf(':name') !== -1) {
								// Column selector
								if (columns[k].sName === target.replace(':name', '')) {
									fn( k, def );
								}
							}
							else {
								// Cell selector
								headerLayout.forEach(function (row) {
									if (row[k]) {
										var cell = $(row[k].cell);
	
										// Legacy support. Note that it means that we don't support
										// an element name selector only, since they are treated as
										// class names for 1.x compat.
										if (target.match(/^[a-z][\w-]*$/i)) {
											target = '.' + target;
										}
	
										if (cell.is( target )) {
											fn( k, def );
										}
									}
								});
							}
						}
					}
				}
			}
		}
	
		// Statically defined columns array
		if ( aoCols ) {
			for ( i=0, iLen=aoCols.length ; i<iLen ; i++ ) {
				fn( i, aoCols[i] );
			}
		}
	}
	
	
	/**
	 * Get the width for a given set of columns
	 *
	 * @param {*} settings DataTables settings object
	 * @param {*} targets Columns - comma separated string or array of numbers
	 * @param {*} original Use the original width (true) or calculated (false)
	 * @param {*} incVisible Include visible columns (true) or not (false)
	 * @returns Combined CSS value
	 */
	function _fnColumnsSumWidth( settings, targets, original, incVisible ) {
		if ( ! Array.isArray( targets ) ) {
			targets = _fnColumnsFromHeader( targets );
		}
	
		var sum = 0;
		var unit;
		var columns = settings.aoColumns;
		
		for ( var i=0, ien=targets.length ; i<ien ; i++ ) {
			var column = columns[ targets[i] ];
			var definedWidth = original ?
				column.sWidthOrig :
				column.sWidth;
	
			if ( ! incVisible && column.bVisible === false ) {
				continue;
			}
	
			if ( definedWidth === null || definedWidth === undefined ) {
				return null; // can't determine a defined width - browser defined
			}
			else if ( typeof definedWidth === 'number' ) {
				unit = 'px';
				sum += definedWidth;
			}
			else {
				var matched = definedWidth.match(/([\d\.]+)([^\d]*)/);
	
				if ( matched ) {
					sum += matched[1] * 1;
					unit = matched.length === 3 ?
						matched[2] :
						'px';
				}
			}
		}
	
		return sum + unit;
	}
	
	function _fnColumnsFromHeader( cell )
	{
		var attr = $(cell).closest('[data-dt-column]').attr('data-dt-column');
	
		if ( ! attr ) {
			return [];
		}
	
		return attr.split(',').map( function (val) {
			return val * 1;
		} );
	}
	/**
	 * Add a data array to the table, creating DOM node etc. This is the parallel to
	 * _fnGatherData, but for adding rows from a Javascript source, rather than a
	 * DOM source.
	 *  @param {object} settings dataTables settings object
	 *  @param {array} data data array to be added
	 *  @param {node} [tr] TR element to add to the table - optional. If not given,
	 *    DataTables will create a row automatically
	 *  @param {array} [tds] Array of TD|TH elements for the row - must be given
	 *    if nTr is.
	 *  @returns {int} >=0 if successful (index of new aoData entry), -1 if failed
	 *  @memberof DataTable#oApi
	 */
	function _fnAddData ( settings, dataIn, tr, tds )
	{
		/* Create the object for storing information about this new row */
		var rowIdx = settings.aoData.length;
		var rowModel = $.extend( true, {}, DataTable.models.oRow, {
			src: tr ? 'dom' : 'data',
			idx: rowIdx
		} );
	
		rowModel._aData = dataIn;
		settings.aoData.push( rowModel );
	
		var columns = settings.aoColumns;
	
		for ( var i=0, iLen=columns.length ; i<iLen ; i++ )
		{
			// Invalidate the column types as the new data needs to be revalidated
			columns[i].sType = null;
		}
	
		/* Add to the display array */
		settings.aiDisplayMaster.push( rowIdx );
	
		var id = settings.rowIdFn( dataIn );
		if ( id !== undefined ) {
			settings.aIds[ id ] = rowModel;
		}
	
		/* Create the DOM information, or register it if already present */
		if ( tr || ! settings.oFeatures.bDeferRender )
		{
			_fnCreateTr( settings, rowIdx, tr, tds );
		}
	
		return rowIdx;
	}
	
	
	/**
	 * Add one or more TR elements to the table. Generally we'd expect to
	 * use this for reading data from a DOM sourced table, but it could be
	 * used for an TR element. Note that if a TR is given, it is used (i.e.
	 * it is not cloned).
	 *  @param {object} settings dataTables settings object
	 *  @param {array|node|jQuery} trs The TR element(s) to add to the table
	 *  @returns {array} Array of indexes for the added rows
	 *  @memberof DataTable#oApi
	 */
	function _fnAddTr( settings, trs )
	{
		var row;
	
		// Allow an individual node to be passed in
		if ( ! (trs instanceof $) ) {
			trs = $(trs);
		}
	
		return trs.map( function (i, el) {
			row = _fnGetRowElements( settings, el );
			return _fnAddData( settings, row.data, el, row.cells );
		} );
	}
	
	
	/**
	 * Get the data for a given cell from the internal cache, taking into account data mapping
	 *  @param {object} settings dataTables settings object
	 *  @param {int} rowIdx aoData row id
	 *  @param {int} colIdx Column index
	 *  @param {string} type data get type ('display', 'type' 'filter|search' 'sort|order')
	 *  @returns {*} Cell data
	 *  @memberof DataTable#oApi
	 */
	function _fnGetCellData( settings, rowIdx, colIdx, type )
	{
		if (type === 'search') {
			type = 'filter';
		}
		else if (type === 'order') {
			type = 'sort';
		}
	
		var draw           = settings.iDraw;
		var col            = settings.aoColumns[colIdx];
		var rowData        = settings.aoData[rowIdx]._aData;
		var defaultContent = col.sDefaultContent;
		var cellData       = col.fnGetData( rowData, type, {
			settings: settings,
			row:      rowIdx,
			col:      colIdx
		} );
	
		// Allow for a node being returned for non-display types
		if (type !== 'display' && cellData && typeof cellData === 'object' && cellData.nodeName) {
			cellData = cellData.innerHTML;
		}
	
		if ( cellData === undefined ) {
			if ( settings.iDrawError != draw && defaultContent === null ) {
				_fnLog( settings, 0, "Requested unknown parameter "+
					(typeof col.mData=='function' ? '{function}' : "'"+col.mData+"'")+
					" for row "+rowIdx+", column "+colIdx, 4 );
				settings.iDrawError = draw;
			}
			return defaultContent;
		}
	
		// When the data source is null and a specific data type is requested (i.e.
		// not the original data), we can use default column data
		if ( (cellData === rowData || cellData === null) && defaultContent !== null && type !== undefined ) {
			cellData = defaultContent;
		}
		else if ( typeof cellData === 'function' ) {
			// If the data source is a function, then we run it and use the return,
			// executing in the scope of the data object (for instances)
			return cellData.call( rowData );
		}
	
		if ( cellData === null && type === 'display' ) {
			return '';
		}
	
		if ( type === 'filter' ) {
			var fomatters = DataTable.ext.type.search;
	
			if ( fomatters[ col.sType ] ) {
				cellData = fomatters[ col.sType ]( cellData );
			}
		}
	
		return cellData;
	}
	
	
	/**
	 * Set the value for a specific cell, into the internal data cache
	 *  @param {object} settings dataTables settings object
	 *  @param {int} rowIdx aoData row id
	 *  @param {int} colIdx Column index
	 *  @param {*} val Value to set
	 *  @memberof DataTable#oApi
	 */
	function _fnSetCellData( settings, rowIdx, colIdx, val )
	{
		var col     = settings.aoColumns[colIdx];
		var rowData = settings.aoData[rowIdx]._aData;
	
		col.fnSetData( rowData, val, {
			settings: settings,
			row:      rowIdx,
			col:      colIdx
		}  );
	}
	
	/**
	 * Write a value to a cell
	 * @param {*} td Cell
	 * @param {*} val Value
	 */
	function _fnWriteCell(td, val)
	{
		if (val && typeof val === 'object' && val.nodeName) {
			$(td)
				.empty()
				.append(val);
		}
		else {
			td.innerHTML = val;
		}
	}
	
	
	// Private variable that is used to match action syntax in the data property object
	var __reArray = /\[.*?\]$/;
	var __reFn = /\(\)$/;
	
	/**
	 * Split string on periods, taking into account escaped periods
	 * @param  {string} str String to split
	 * @return {array} Split string
	 */
	function _fnSplitObjNotation( str )
	{
		var parts = str.match(/(\\.|[^.])+/g) || [''];
	
		return parts.map( function ( s ) {
			return s.replace(/\\\./g, '.');
		} );
	}
	
	
	/**
	 * Return a function that can be used to get data from a source object, taking
	 * into account the ability to use nested objects as a source
	 *  @param {string|int|function} mSource The data source for the object
	 *  @returns {function} Data get function
	 *  @memberof DataTable#oApi
	 */
	var _fnGetObjectDataFn = DataTable.util.get;
	
	
	/**
	 * Return a function that can be used to set data from a source object, taking
	 * into account the ability to use nested objects as a source
	 *  @param {string|int|function} mSource The data source for the object
	 *  @returns {function} Data set function
	 *  @memberof DataTable#oApi
	 */
	var _fnSetObjectDataFn = DataTable.util.set;
	
	
	/**
	 * Return an array with the full table data
	 *  @param {object} oSettings dataTables settings object
	 *  @returns array {array} aData Master data array
	 *  @memberof DataTable#oApi
	 */
	function _fnGetDataMaster ( settings )
	{
		return _pluck( settings.aoData, '_aData' );
	}
	
	
	/**
	 * Nuke the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnClearTable( settings )
	{
		settings.aoData.length = 0;
		settings.aiDisplayMaster.length = 0;
		settings.aiDisplay.length = 0;
		settings.aIds = {};
	}
	
	
	/**
	 * Mark cached data as invalid such that a re-read of the data will occur when
	 * the cached data is next requested. Also update from the data source object.
	 *
	 * @param {object} settings DataTables settings object
	 * @param {int}    rowIdx   Row index to invalidate
	 * @param {string} [src]    Source to invalidate from: undefined, 'auto', 'dom'
	 *     or 'data'
	 * @param {int}    [colIdx] Column index to invalidate. If undefined the whole
	 *     row will be invalidated
	 * @memberof DataTable#oApi
	 *
	 * @todo For the modularisation of v1.11 this will need to become a callback, so
	 *   the sort and filter methods can subscribe to it. That will required
	 *   initialisation options for sorting, which is why it is not already baked in
	 */
	function _fnInvalidate( settings, rowIdx, src, colIdx )
	{
		var row = settings.aoData[ rowIdx ];
		var i, ien;
	
		// Remove the cached data for the row
		row._aSortData = null;
		row._aFilterData = null;
		row.displayData = null;
	
		// Are we reading last data from DOM or the data object?
		if ( src === 'dom' || ((! src || src === 'auto') && row.src === 'dom') ) {
			// Read the data from the DOM
			row._aData = _fnGetRowElements(
					settings, row, colIdx, colIdx === undefined ? undefined : row._aData
				)
				.data;
		}
		else {
			// Reading from data object, update the DOM
			var cells = row.anCells;
			var display = _fnGetRowDisplay(settings, rowIdx);
	
			if ( cells ) {
				if ( colIdx !== undefined ) {
					_fnWriteCell(cells[colIdx], display[colIdx]);
				}
				else {
					for ( i=0, ien=cells.length ; i<ien ; i++ ) {
						_fnWriteCell(cells[i], display[i]);
					}
				}
			}
		}
	
		// Column specific invalidation
		var cols = settings.aoColumns;
		if ( colIdx !== undefined ) {
			// Type - the data might have changed
			cols[ colIdx ].sType = null;
	
			// Max length string. Its a fairly cheep recalculation, so not worth
			// something more complicated
			cols[ colIdx ].maxLenString = null;
		}
		else {
			for ( i=0, ien=cols.length ; i<ien ; i++ ) {
				cols[i].sType = null;
				cols[i].maxLenString = null;
			}
	
			// Update DataTables special `DT_*` attributes for the row
			_fnRowAttributes( settings, row );
		}
	}
	
	
	/**
	 * Build a data source object from an HTML row, reading the contents of the
	 * cells that are in the row.
	 *
	 * @param {object} settings DataTables settings object
	 * @param {node|object} TR element from which to read data or existing row
	 *   object from which to re-read the data from the cells
	 * @param {int} [colIdx] Optional column index
	 * @param {array|object} [d] Data source object. If `colIdx` is given then this
	 *   parameter should also be given and will be used to write the data into.
	 *   Only the column in question will be written
	 * @returns {object} Object with two parameters: `data` the data read, in
	 *   document order, and `cells` and array of nodes (they can be useful to the
	 *   caller, so rather than needing a second traversal to get them, just return
	 *   them from here).
	 * @memberof DataTable#oApi
	 */
	function _fnGetRowElements( settings, row, colIdx, d )
	{
		var
			tds = [],
			td = row.firstChild,
			name, col, i=0, contents,
			columns = settings.aoColumns,
			objectRead = settings._rowReadObject;
	
		// Allow the data object to be passed in, or construct
		d = d !== undefined ?
			d :
			objectRead ?
				{} :
				[];
	
		var attr = function ( str, td  ) {
			if ( typeof str === 'string' ) {
				var idx = str.indexOf('@');
	
				if ( idx !== -1 ) {
					var attr = str.substring( idx+1 );
					var setter = _fnSetObjectDataFn( str );
					setter( d, td.getAttribute( attr ) );
				}
			}
		};
	
		// Read data from a cell and store into the data object
		var cellProcess = function ( cell ) {
			if ( colIdx === undefined || colIdx === i ) {
				col = columns[i];
				contents = (cell.innerHTML).trim();
	
				if ( col && col._bAttrSrc ) {
					var setter = _fnSetObjectDataFn( col.mData._ );
					setter( d, contents );
	
					attr( col.mData.sort, cell );
					attr( col.mData.type, cell );
					attr( col.mData.filter, cell );
				}
				else {
					// Depending on the `data` option for the columns the data can
					// be read to either an object or an array.
					if ( objectRead ) {
						if ( ! col._setter ) {
							// Cache the setter function
							col._setter = _fnSetObjectDataFn( col.mData );
						}
						col._setter( d, contents );
					}
					else {
						d[i] = contents;
					}
				}
			}
	
			i++;
		};
	
		if ( td ) {
			// `tr` element was passed in
			while ( td ) {
				name = td.nodeName.toUpperCase();
	
				if ( name == "TD" || name == "TH" ) {
					cellProcess( td );
					tds.push( td );
				}
	
				td = td.nextSibling;
			}
		}
		else {
			// Existing row object passed in
			tds = row.anCells;
	
			for ( var j=0, jen=tds.length ; j<jen ; j++ ) {
				cellProcess( tds[j] );
			}
		}
	
		// Read the ID from the DOM if present
		var rowNode = row.firstChild ? row : row.nTr;
	
		if ( rowNode ) {
			var id = rowNode.getAttribute( 'id' );
	
			if ( id ) {
				_fnSetObjectDataFn( settings.rowId )( d, id );
			}
		}
	
		return {
			data: d,
			cells: tds
		};
	}
	
	/**
	 * Render and cache a row's display data for the columns, if required
	 * @returns 
	 */
	function _fnGetRowDisplay (settings, rowIdx) {
		let rowModal = settings.aoData[rowIdx];
		let columns = settings.aoColumns;
	
		if (! rowModal.displayData) {
			// Need to render and cache
			rowModal.displayData = [];
		
			for ( var colIdx=0, len=columns.length ; colIdx<len ; colIdx++ ) {
				rowModal.displayData.push(
					_fnGetCellData( settings, rowIdx, colIdx, 'display' )
				);
			}
		}
	
		return rowModal.displayData;
	}
	
	/**
	 * Create a new TR element (and it's TD children) for a row
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iRow Row to consider
	 *  @param {node} [nTrIn] TR element to add to the table - optional. If not given,
	 *    DataTables will create a row automatically
	 *  @param {array} [anTds] Array of TD|TH elements for the row - must be given
	 *    if nTr is.
	 *  @memberof DataTable#oApi
	 */
	function _fnCreateTr ( oSettings, iRow, nTrIn, anTds )
	{
		var
			row = oSettings.aoData[iRow],
			rowData = row._aData,
			cells = [],
			nTr, nTd, oCol,
			i, iLen, create,
			trClass = oSettings.oClasses.tbody.row;
	
		if ( row.nTr === null )
		{
			nTr = nTrIn || document.createElement('tr');
	
			row.nTr = nTr;
			row.anCells = cells;
	
			_addClass(nTr, trClass);
	
			/* Use a private property on the node to allow reserve mapping from the node
			 * to the aoData array for fast look up
			 */
			nTr._DT_RowIndex = iRow;
	
			/* Special parameters can be given by the data source to be used on the row */
			_fnRowAttributes( oSettings, row );
	
			/* Process each column */
			for ( i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
			{
				oCol = oSettings.aoColumns[i];
				create = nTrIn && anTds[i] ? false : true;
	
				nTd = create ? document.createElement( oCol.sCellType ) : anTds[i];
	
				if (! nTd) {
					_fnLog( oSettings, 0, 'Incorrect column count', 18 );
				}
	
				nTd._DT_CellIndex = {
					row: iRow,
					column: i
				};
				
				cells.push( nTd );
				
				var display = _fnGetRowDisplay(oSettings, iRow);
	
				// Need to create the HTML if new, or if a rendering function is defined
				if (
					create ||
					(
						(oCol.mRender || oCol.mData !== i) &&
						(!$.isPlainObject(oCol.mData) || oCol.mData._ !== i+'.display')
					)
				) {
					_fnWriteCell(nTd, display[i]);
				}
	
				// Visibility - add or remove as required
				if ( oCol.bVisible && create )
				{
					nTr.appendChild( nTd );
				}
				else if ( ! oCol.bVisible && ! create )
				{
					nTd.parentNode.removeChild( nTd );
				}
	
				if ( oCol.fnCreatedCell )
				{
					oCol.fnCreatedCell.call( oSettings.oInstance,
						nTd, _fnGetCellData( oSettings, iRow, i ), rowData, iRow, i
					);
				}
			}
	
			_fnCallbackFire( oSettings, 'aoRowCreatedCallback', 'row-created', [nTr, rowData, iRow, cells] );
		}
		else {
			_addClass(row.nTr, trClass);
		}
	}
	
	
	/**
	 * Add attributes to a row based on the special `DT_*` parameters in a data
	 * source object.
	 *  @param {object} settings DataTables settings object
	 *  @param {object} DataTables row object for the row to be modified
	 *  @memberof DataTable#oApi
	 */
	function _fnRowAttributes( settings, row )
	{
		var tr = row.nTr;
		var data = row._aData;
	
		if ( tr ) {
			var id = settings.rowIdFn( data );
	
			if ( id ) {
				tr.id = id;
			}
	
			if ( data.DT_RowClass ) {
				// Remove any classes added by DT_RowClass before
				var a = data.DT_RowClass.split(' ');
				row.__rowc = row.__rowc ?
					_unique( row.__rowc.concat( a ) ) :
					a;
	
				$(tr)
					.removeClass( row.__rowc.join(' ') )
					.addClass( data.DT_RowClass );
			}
	
			if ( data.DT_RowAttr ) {
				$(tr).attr( data.DT_RowAttr );
			}
	
			if ( data.DT_RowData ) {
				$(tr).data( data.DT_RowData );
			}
		}
	}
	
	
	/**
	 * Create the HTML header for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnBuildHead( settings, side )
	{
		var classes = settings.oClasses;
		var columns = settings.aoColumns;
		var i, ien, row;
		var target = side === 'header'
			? settings.nTHead
			: settings.nTFoot;
		var titleProp = side === 'header' ? 'sTitle' : side;
	
		// Footer might be defined
		if (! target) {
			return;
		}
	
		// If no cells yet and we have content for them, then create
		if (side === 'header' || _pluck(settings.aoColumns, titleProp).join('')) {
			row = $('tr', target);
	
			// Add a row if needed
			if (! row.length) {
				row = $('<tr/>').appendTo(target)
			}
	
			// Add the number of cells needed to make up to the number of columns
			if (row.length === 1) {
				var cells = $('td, th', row);
	
				for ( i=cells.length, ien=columns.length ; i<ien ; i++ ) {
					$('<th/>')
						.html( columns[i][titleProp] || '' )
						.appendTo( row );
				}
			}
		}
	
		var detected = _fnDetectHeader( settings, target, true );
	
		if (side === 'header') {
			settings.aoHeader = detected;
		}
		else {
			settings.aoFooter = detected;
		}
	
		// ARIA role for the rows
		$(target).children('tr').attr('role', 'row');
	
		// Every cell needs to be passed through the renderer
		$(target).children('tr').children('th, td')
			.each( function () {
				_fnRenderer( settings, side )(
					settings, $(this), classes
				);
			} );
	}
	
	/**
	 * Build a layout structure for a header or footer
	 *
	 * @param {*} settings DataTables settings
	 * @param {*} source Source layout array
	 * @param {*} incColumns What columns should be included
	 * @returns Layout array
	 */
	function _fnHeaderLayout( settings, source, incColumns )
	{
		var row, column, cell;
		var local = [];
		var structure = [];
		var columns = settings.aoColumns;
		var columnCount = columns.length;
		var rowspan, colspan;
	
		if ( ! source ) {
			return;
		}
	
		// Default is to work on only visible columns
		if ( ! incColumns ) {
			incColumns = _range(columnCount)
				.filter(function (idx) {
					return columns[idx].bVisible;
				});
		}
	
		// Make a copy of the master layout array, but with only the columns we want
		for ( row=0 ; row<source.length ; row++ ) {
			// Remove any columns we haven't selected
			local[row] = source[row].slice().filter(function (cell, i) {
				return incColumns.includes(i);
			});
	
			// Prep the structure array - it needs an element for each row
			structure.push( [] );
		}
	
		for ( row=0 ; row<local.length ; row++ ) {
			for ( column=0 ; column<local[row].length ; column++ ) {
				rowspan = 1;
				colspan = 1;
	
				// Check to see if there is already a cell (row/colspan) covering our target
				// insert point. If there is, then there is nothing to do.
				if ( structure[row][column] === undefined ) {
					cell = local[row][column].cell;
	
					// Expand for rowspan
					while (
						local[row+rowspan] !== undefined &&
						local[row][column].cell == local[row+rowspan][column].cell
					) {
						structure[row+rowspan][column] = null;
						rowspan++;
					}
	
					// And for colspan
					while (
						local[row][column+colspan] !== undefined &&
						local[row][column].cell == local[row][column+colspan].cell
					) {
						// Which also needs to go over rows
						for ( var k=0 ; k<rowspan ; k++ ) {
							structure[row+k][column+colspan] = null;
						}
	
						colspan++;
					}
	
					var titleSpan = $('span.dt-column-title', cell);
	
					structure[row][column] = {
						cell: cell,
						colspan: colspan,
						rowspan: rowspan,
						title: titleSpan.length
							? titleSpan.html()
							: $(cell).html()
					};
				}
			}
		}
	
		return structure;
	}
	
	
	/**
	 * Draw the header (or footer) element based on the column visibility states.
	 *
	 *  @param object oSettings dataTables settings object
	 *  @param array aoSource Layout array from _fnDetectHeader
	 *  @memberof DataTable#oApi
	 */
	function _fnDrawHead( settings, source )
	{
		var layout = _fnHeaderLayout(settings, source);
		var tr, n;
	
		for ( var row=0 ; row<source.length ; row++ ) {
			tr = source[row].row;
	
			// All cells are going to be replaced, so empty out the row
			// Can't use $().empty() as that kills event handlers
			if (tr) {
				while( (n = tr.firstChild) ) {
					tr.removeChild( n );
				}
			}
	
			for ( var column=0 ; column<layout[row].length ; column++ ) {
				var point = layout[row][column];
	
				if (point) {
					$(point.cell)
						.appendTo(tr)
						.attr('rowspan', point.rowspan)
						.attr('colspan', point.colspan);
				}
			}
		}
	}
	
	
	/**
	 * Insert the required TR nodes into the table for display
	 *  @param {object} oSettings dataTables settings object
	 *  @param ajaxComplete true after ajax call to complete rendering
	 *  @memberof DataTable#oApi
	 */
	function _fnDraw( oSettings, ajaxComplete )
	{
		// Allow for state saving and a custom start position
		_fnStart( oSettings );
	
		/* Provide a pre-callback function which can be used to cancel the draw is false is returned */
		var aPreDraw = _fnCallbackFire( oSettings, 'aoPreDrawCallback', 'preDraw', [oSettings] );
		if ( aPreDraw.indexOf(false) !== -1 )
		{
			_fnProcessingDisplay( oSettings, false );
			return;
		}
	
		var anRows = [];
		var iRowCount = 0;
		var bServerSide = _fnDataSource( oSettings ) == 'ssp';
		var aiDisplay = oSettings.aiDisplay;
		var iDisplayStart = oSettings._iDisplayStart;
		var iDisplayEnd = oSettings.fnDisplayEnd();
		var columns = oSettings.aoColumns;
		var body = $(oSettings.nTBody);
	
		oSettings.bDrawing = true;
	
		/* Server-side processing draw intercept */
		if ( !bServerSide )
		{
			oSettings.iDraw++;
		}
		else if ( !oSettings.bDestroying && !ajaxComplete)
		{
			// Show loading message for server-side processing
			if (oSettings.iDraw === 0) {
				body.empty().append(_emptyRow(oSettings));
			}
	
			_fnAjaxUpdate( oSettings );
			return;
		}
	
		if ( aiDisplay.length !== 0 )
		{
			var iStart = bServerSide ? 0 : iDisplayStart;
			var iEnd = bServerSide ? oSettings.aoData.length : iDisplayEnd;
	
			for ( var j=iStart ; j<iEnd ; j++ )
			{
				var iDataIndex = aiDisplay[j];
				var aoData = oSettings.aoData[ iDataIndex ];
				if ( aoData.nTr === null )
				{
					_fnCreateTr( oSettings, iDataIndex );
				}
	
				var nRow = aoData.nTr;
	
				// Add various classes as needed
				for (var i=0 ; i<columns.length ; i++) {
					var col = columns[i];
					var td = aoData.anCells[i];
	
					_addClass(td, _ext.type.className[col.sType]); // auto class
					_addClass(td, col.sClass); // column class
					_addClass(td, oSettings.oClasses.tbody.cell); // all cells
				}
	
				// Row callback functions - might want to manipulate the row
				// iRowCount and j are not currently documented. Are they at all
				// useful?
				_fnCallbackFire( oSettings, 'aoRowCallback', null,
					[nRow, aoData._aData, iRowCount, j, iDataIndex] );
	
				anRows.push( nRow );
				iRowCount++;
			}
		}
		else
		{
			anRows[ 0 ] = _emptyRow(oSettings);
		}
	
		/* Header and footer callbacks */
		_fnCallbackFire( oSettings, 'aoHeaderCallback', 'header', [ $(oSettings.nTHead).children('tr')[0],
			_fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );
	
		_fnCallbackFire( oSettings, 'aoFooterCallback', 'footer', [ $(oSettings.nTFoot).children('tr')[0],
			_fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );
	
		body.children().detach();
		body.append( $(anRows) );
	
		// Empty table needs a specific class
		$(oSettings.nTableWrapper).toggleClass('dt-empty-footer', $('tr', oSettings.nTFoot).length === 0);
	
		/* Call all required callback functions for the end of a draw */
		_fnCallbackFire( oSettings, 'aoDrawCallback', 'draw', [oSettings], true );
	
		/* Draw is complete, sorting and filtering must be as well */
		oSettings.bSorted = false;
		oSettings.bFiltered = false;
		oSettings.bDrawing = false;
	}
	
	
	/**
	 * Redraw the table - taking account of the various features which are enabled
	 *  @param {object} oSettings dataTables settings object
	 *  @param {boolean} [holdPosition] Keep the current paging position. By default
	 *    the paging is reset to the first page
	 *  @memberof DataTable#oApi
	 */
	function _fnReDraw( settings, holdPosition, recompute )
	{
		var
			features = settings.oFeatures,
			sort     = features.bSort,
			filter   = features.bFilter;
	
		if (recompute === undefined || recompute === true) {
			if ( sort ) {
				_fnSort( settings );
			}
	
			if ( filter ) {
				_fnFilterComplete( settings, settings.oPreviousSearch );
			}
			else {
				// No filtering, so we want to just use the display master
				settings.aiDisplay = settings.aiDisplayMaster.slice();
			}
		}
	
		if ( holdPosition !== true ) {
			settings._iDisplayStart = 0;
		}
	
		// Let any modules know about the draw hold position state (used by
		// scrolling internally)
		settings._drawHold = holdPosition;
	
		_fnDraw( settings );
	
		settings._drawHold = false;
	}
	
	
	/*
	 * Table is empty - create a row with an empty message in it
	 */
	function _emptyRow ( settings ) {
		var oLang = settings.oLanguage;
		var zero = oLang.sZeroRecords;
		var dataSrc = _fnDataSource( settings );
	
		if (
			(settings.iDraw < 1 && dataSrc === 'ssp') ||
			(settings.iDraw <= 1 && dataSrc === 'ajax')
		) {
			zero = oLang.sLoadingRecords;
		}
		else if ( oLang.sEmptyTable && settings.fnRecordsTotal() === 0 )
		{
			zero = oLang.sEmptyTable;
		}
	
		return $( '<tr/>' )
			.append( $('<td />', {
				'colSpan': _fnVisbleColumns( settings ),
				'class':   settings.oClasses.empty.row
			} ).html( zero ) )[0];
	}
	
	
	/**
	 * Convert a `layout` object given by a user to the object structure needed
	 * for the renderer. This is done twice, once for above and once for below
	 * the table. Ordering must also be considered.
	 *
	 * @param {*} settings DataTables settings object
	 * @param {*} layout Layout object to convert
	 * @param {string} side `top` or `bottom`
	 * @returns Converted array structure - one item for each row.
	 */
	function _layoutArray ( settings, layout, side )
	{
		var groups = {};
	
		// Combine into like groups (e.g. `top`, `top2`, etc)
		$.each( layout, function ( pos, val ) {
			if (val === null) {
				return;
			}
	
			var splitPos = pos.replace(/([A-Z])/g, ' $1').split(' ');
	
			if ( ! groups[ splitPos[0] ] ) {
				groups[ splitPos[0] ] = {};
			}
	
			var align = splitPos.length === 1 ?
				'full' :
				splitPos[1].toLowerCase();
			var group = groups[ splitPos[0] ];
			var groupRun = function (contents, innerVal) {
				// If it is an object, then there can be multiple features contained in it
				if ( $.isPlainObject( innerVal ) ) {
					Object.keys(innerVal).map(function (key) {
						contents.push( {
							feature: key,
							opts: innerVal[key]
						});
					});
				}
				else {
					contents.push(innerVal);
				}
			}
	
			// Transform to an object with a contents property
			if (! group[align] || ! group[align].contents) {
				group[align] = { contents: [] };
			}
	
			// Allow for an array or just a single object
			if ( Array.isArray(val)) {
				for (var i=0 ; i<val.length ; i++) {
					groupRun(group[align].contents, val[i]);
				}
			}
			else {
				groupRun(group[ align ].contents, val);
			}
	
			// And make contents an array
			if ( ! Array.isArray( group[ align ].contents ) ) {
				group[ align ].contents = [ group[ align ].contents ];
			}
		} );
	
		var filtered = Object.keys(groups)
			.map( function ( pos ) {
				// Filter to only the side we need
				if ( pos.indexOf(side) !== 0 ) {
					return null;
				}
	
				return {
					name: pos,
					val: groups[pos]
				};
			} )
			.filter( function (item) {
				return item !== null;
			});
	
		// Order by item identifier
		filtered.sort( function ( a, b ) {
			var order1 = a.name.replace(/[^0-9]/g, '') * 1;
			var order2 = b.name.replace(/[^0-9]/g, '') * 1;
	
			return order2 - order1;
		} );
		
		if ( side === 'bottom' ) {
			filtered.reverse();
		}
	
		// Split into rows
		var rows = [];
		for ( var i=0, ien=filtered.length ; i<ien ; i++ ) {
			if (  filtered[i].val.full ) {
				rows.push( { full: filtered[i].val.full } );
				_layoutResolve( settings, rows[ rows.length - 1 ] );
	
				delete filtered[i].val.full;
			}
	
			if ( Object.keys(filtered[i].val).length ) {
				rows.push( filtered[i].val );
				_layoutResolve( settings, rows[ rows.length - 1 ] );
			}
		}
	
		return rows;
	}
	
	
	/**
	 * Convert the contents of a row's layout object to nodes that can be inserted
	 * into the document by a renderer. Execute functions, look up plug-ins, etc.
	 *
	 * @param {*} settings DataTables settings object
	 * @param {*} row Layout object for this row
	 */
	function _layoutResolve( settings, row ) {
		var getFeature = function (feature, opts) {
			if ( ! _ext.features[ feature ] ) {
				_fnLog( settings, 0, 'Unknown feature: '+ feature );
			}
	
			return _ext.features[ feature ].apply( this, [settings, opts] );
		};
	
		var resolve = function ( item ) {
			var line = row[ item ].contents;
	
			for ( var i=0, ien=line.length ; i<ien ; i++ ) {
				if ( ! line[i] ) {
					continue;
				}
				else if ( typeof line[i] === 'string' ) {
					line[i] = getFeature( line[i], null );
				}
				else if ( $.isPlainObject(line[i]) ) {
					// If it's an object, it just has feature and opts properties from
					// the transform in _layoutArray
					line[i] = getFeature(line[i].feature, line[i].opts);
				}
				else if ( typeof line[i].node === 'function' ) {
					line[i] = line[i].node( settings );
				}
				else if ( typeof line[i] === 'function' ) {
					var inst = line[i]( settings );
	
					line[i] = typeof inst.node === 'function' ?
						inst.node() :
						inst;
				}
			}
		};
	
		$.each( row, function ( key ) {
			resolve( key );
		} );
	}
	
	
	/**
	 * Add the options to the page HTML for the table
	 *  @param {object} settings DataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnAddOptionsHtml ( settings )
	{
		var classes = settings.oClasses;
		var table = $(settings.nTable);
	
		// Wrapper div around everything DataTables controls
		var insert = $('<div/>')
			.attr({
				id:      settings.sTableId+'_wrapper',
				'class': classes.container
			})
			.insertBefore(table);
	
		settings.nTableWrapper = insert[0];
	
		var top = _layoutArray( settings, settings.layout, 'top' );
		var bottom = _layoutArray( settings, settings.layout, 'bottom' );
		var renderer = _fnRenderer( settings, 'layout' );
	
		if (settings.sDom) {
			// Legacy
			_fnLayoutDom(settings, settings.sDom, insert);
		}
		else {
			// Everything above - the renderer will actually insert the contents into the document
			top.forEach(function (item) {
				renderer( settings, insert, item );
			});
	
			// The table - always the center of attention
			renderer( settings, insert, {
				full: {
					table: true,
					contents: [ _fnFeatureHtmlTable(settings) ]
				}
			} );
	
			// Everything below
			bottom.forEach(function (item) {
				renderer( settings, insert, item );
			});
		}
	
		// Processing floats on top, so it isn't an inserted feature
		_processingHtml( settings );
	}
	
	/**
	 * Draw the table with the legacy DOM property
	 * @param {*} settings DT settings object
	 * @param {*} dom DOM string
	 * @param {*} insert Insert point
	 */
	function _fnLayoutDom( settings, dom, insert )
	{
		var parts = dom.match(/(".*?")|('.*?')|./g);
		var featureNode, option, newNode, next, attr;
	
		for ( var i=0 ; i<parts.length ; i++ ) {
			featureNode = null;
			option = parts[i];
	
			if ( option == '<' ) {
				// New container div
				newNode = $('<div/>');
	
				// Check to see if we should append an id and/or a class name to the container
				next = parts[i+1];
	
				if ( next[0] == "'" || next[0] == '"' ) {
					attr = next.replace(/['"]/g, '');
	
					var id = '', className;
	
					/* The attribute can be in the format of "#id.class", "#id" or "class" This logic
					 * breaks the string into parts and applies them as needed
					 */
					if ( attr.indexOf('.') != -1 ) {
						var split = attr.split('.');
	
						id = split[0];
						className = split[1];
					}
					else if ( attr[0] == "#" ) {
						id = attr;
					}
					else {
						className = attr;
					}
	
					newNode
						.attr('id', id.substring(1))
						.addClass(className);
	
					i++; // Move along the position array
				}
	
				insert.append( newNode );
				insert = newNode;
			}
			else if ( option == '>' ) {
				// End container div
				insert = insert.parent();
			}
			else if ( option == 't' ) {
				// Table
				featureNode = _fnFeatureHtmlTable( settings );
			}
			else
			{
				DataTable.ext.feature.forEach(function(feature) {
					if ( option == feature.cFeature ) {
						featureNode = feature.fnInit( settings );
					}
				});
			}
	
			// Add to the display
			if ( featureNode ) {
				insert.append( featureNode );
			}
		}
	}
	
	
	/**
	 * Use the DOM source to create up an array of header cells. The idea here is to
	 * create a layout grid (array) of rows x columns, which contains a reference
	 * to the cell that that point in the grid (regardless of col/rowspan), such that
	 * any column / row could be removed and the new grid constructed
	 *  @param {node} thead The header/footer element for the table
	 *  @returns {array} Calculated layout array
	 *  @memberof DataTable#oApi
	 */
	function _fnDetectHeader ( settings, thead, write )
	{
		var columns = settings.aoColumns;
		var rows = $(thead).children('tr');
		var row, cell;
		var i, k, l, iLen, shifted, column, colspan, rowspan;
		var isHeader = thead && thead.nodeName.toLowerCase() === 'thead';
		var layout = [];
		var unique;
		var shift = function ( a, i, j ) {
			var k = a[i];
			while ( k[j] ) {
				j++;
			}
			return j;
		};
	
		// We know how many rows there are in the layout - so prep it
		for ( i=0, iLen=rows.length ; i<iLen ; i++ ) {
			layout.push( [] );
		}
	
		for ( i=0, iLen=rows.length ; i<iLen ; i++ ) {
			row = rows[i];
			column = 0;
	
			// For every cell in the row..
			cell = row.firstChild;
			while ( cell ) {
				if (
					cell.nodeName.toUpperCase() == 'TD' ||
					cell.nodeName.toUpperCase() == 'TH'
				) {
					var cols = [];
	
					// Get the col and rowspan attributes from the DOM and sanitise them
					colspan = cell.getAttribute('colspan') * 1;
					rowspan = cell.getAttribute('rowspan') * 1;
					colspan = (!colspan || colspan===0 || colspan===1) ? 1 : colspan;
					rowspan = (!rowspan || rowspan===0 || rowspan===1) ? 1 : rowspan;
	
					// There might be colspan cells already in this row, so shift our target
					// accordingly
					shifted = shift( layout, i, column );
	
					// Cache calculation for unique columns
					unique = colspan === 1 ?
						true :
						false;
					
					// Perform header setup
					if ( write ) {
						if (unique) {
							// Allow column options to be set from HTML attributes
							_fnColumnOptions( settings, shifted, $(cell).data() );
							
							// Get the width for the column. This can be defined from the
							// width attribute, style attribute or `columns.width` option
							var columnDef = columns[shifted];
							var width = cell.getAttribute('width') || null;
							var t = cell.style.width.match(/width:\s*(\d+[pxem%]+)/);
							if ( t ) {
								width = t[1];
							}
	
							columnDef.sWidthOrig = columnDef.sWidth || width;
	
							if (isHeader) {
								// Column title handling - can be user set, or read from the DOM
								// This happens before the render, so the original is still in place
								if ( columnDef.sTitle !== null && ! columnDef.autoTitle ) {
									cell.innerHTML = columnDef.sTitle;
								}
	
								if (! columnDef.sTitle && unique) {
									columnDef.sTitle = cell.innerHTML.replace( /<.*?>/g, "" );
									columnDef.autoTitle = true;
								}
							}
							else {
								// Footer specific operations
								if (columnDef.footer) {
									cell.innerHTML = columnDef.footer;
								}
							}
	
							// Fall back to the aria-label attribute on the table header if no ariaTitle is
							// provided.
							if (! columnDef.ariaTitle) {
								columnDef.ariaTitle = $(cell).attr("aria-label") || columnDef.sTitle;
							}
	
							// Column specific class names
							if ( columnDef.className ) {
								$(cell).addClass( columnDef.className );
							}
						}
	
						// Wrap the column title so we can write to it in future
						if ( $('span.dt-column-title', cell).length === 0) {
							$('<span>')
								.addClass('dt-column-title')
								.append(cell.childNodes)
								.appendTo(cell);
						}
	
						if ( isHeader && $('span.dt-column-order', cell).length === 0) {
							$('<span>')
								.addClass('dt-column-order')
								.appendTo(cell);
						}
					}
	
					// If there is col / rowspan, copy the information into the layout grid
					for ( l=0 ; l<colspan ; l++ ) {
						for ( k=0 ; k<rowspan ; k++ ) {
							layout[i+k][shifted+l] = {
								cell: cell,
								unique: unique
							};
	
							layout[i+k].row = row;
						}
	
						cols.push( shifted+l );
					}
	
					// Assign an attribute so spanning cells can still be identified
					// as belonging to a column
					cell.setAttribute('data-dt-column', _unique(cols).join(','));
				}
	
				cell = cell.nextSibling;
			}
		}
	
		return layout;
	}
	
	/**
	 * Set the start position for draw
	 *  @param {object} oSettings dataTables settings object
	 */
	function _fnStart( oSettings )
	{
		var bServerSide = _fnDataSource( oSettings ) == 'ssp';
		var iInitDisplayStart = oSettings.iInitDisplayStart;
	
		// Check and see if we have an initial draw position from state saving
		if ( iInitDisplayStart !== undefined && iInitDisplayStart !== -1 )
		{
			oSettings._iDisplayStart = bServerSide ?
				iInitDisplayStart :
				iInitDisplayStart >= oSettings.fnRecordsDisplay() ?
					0 :
					iInitDisplayStart;
	
			oSettings.iInitDisplayStart = -1;
		}
	}
	
	/**
	 * Create an Ajax call based on the table's settings, taking into account that
	 * parameters can have multiple forms, and backwards compatibility.
	 *
	 * @param {object} oSettings dataTables settings object
	 * @param {array} data Data to send to the server, required by
	 *     DataTables - may be augmented by developer callbacks
	 * @param {function} fn Callback function to run when data is obtained
	 */
	function _fnBuildAjax( oSettings, data, fn )
	{
		var ajaxData;
		var ajax = oSettings.ajax;
		var instance = oSettings.oInstance;
		var callback = function ( json ) {
			var status = oSettings.jqXHR
				? oSettings.jqXHR.status
				: null;
	
			if ( json === null || (typeof status === 'number' && status == 204 ) ) {
				json = {};
				_fnAjaxDataSrc( oSettings, json, [] );
			}
	
			var error = json.error || json.sError;
			if ( error ) {
				_fnLog( oSettings, 0, error );
			}
	
			oSettings.json = json;
	
			_fnCallbackFire( oSettings, null, 'xhr', [oSettings, json, oSettings.jqXHR], true );
			fn( json );
		};
	
		if ( $.isPlainObject( ajax ) && ajax.data )
		{
			ajaxData = ajax.data;
	
			var newData = typeof ajaxData === 'function' ?
				ajaxData( data, oSettings ) :  // fn can manipulate data or return
				ajaxData;                      // an object object or array to merge
	
			// If the function returned something, use that alone
			data = typeof ajaxData === 'function' && newData ?
				newData :
				$.extend( true, data, newData );
	
			// Remove the data property as we've resolved it already and don't want
			// jQuery to do it again (it is restored at the end of the function)
			delete ajax.data;
		}
	
		var baseAjax = {
			"url": typeof ajax === 'string' ?
				ajax :
				'',
			"data": data,
			"success": callback,
			"dataType": "json",
			"cache": false,
			"type": oSettings.sServerMethod,
			"error": function (xhr, error) {
				var ret = _fnCallbackFire( oSettings, null, 'xhr', [oSettings, null, oSettings.jqXHR], true );
	
				if ( ret.indexOf(true) === -1 ) {
					if ( error == "parsererror" ) {
						_fnLog( oSettings, 0, 'Invalid JSON response', 1 );
					}
					else if ( xhr.readyState === 4 ) {
						_fnLog( oSettings, 0, 'Ajax error', 7 );
					}
				}
	
				_fnProcessingDisplay( oSettings, false );
			}
		};
	
		// If `ajax` option is an object, extend and override our default base
		if ( $.isPlainObject( ajax ) ) {
			$.extend( baseAjax, ajax )
		}
	
		// Store the data submitted for the API
		oSettings.oAjaxData = data;
	
		// Allow plug-ins and external processes to modify the data
		_fnCallbackFire( oSettings, null, 'preXhr', [oSettings, data, baseAjax], true );
	
		if ( typeof ajax === 'function' )
		{
			// Is a function - let the caller define what needs to be done
			oSettings.jqXHR = ajax.call( instance, data, callback, oSettings );
		}
		else if (ajax.url === '') {
			// No url, so don't load any data. Just apply an empty data array
			// to the object for the callback.
			var empty = {};
	
			DataTable.util.set(ajax.dataSrc)(empty, []);
			callback(empty);
		}
		else {
			// Object to extend the base settings
			oSettings.jqXHR = $.ajax( baseAjax );
	
			// Restore for next time around
			if ( ajaxData ) {
				ajax.data = ajaxData;
			}
		}
	}
	
	
	/**
	 * Update the table using an Ajax call
	 *  @param {object} settings dataTables settings object
	 *  @returns {boolean} Block the table drawing or not
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxUpdate( settings )
	{
		settings.iDraw++;
		_fnProcessingDisplay( settings, true );
	
		_fnBuildAjax(
			settings,
			_fnAjaxParameters( settings ),
			function(json) {
				_fnAjaxUpdateDraw( settings, json );
			}
		);
	}
	
	
	/**
	 * Build up the parameters in an object needed for a server-side processing
	 * request.
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {bool} block the table drawing or not
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxParameters( settings )
	{
		var
			columns = settings.aoColumns,
			features = settings.oFeatures,
			preSearch = settings.oPreviousSearch,
			preColSearch = settings.aoPreSearchCols,
			colData = function ( idx, prop ) {
				return typeof columns[idx][prop] === 'function' ?
					'function' :
					columns[idx][prop];
			};
	
		return {
			draw: settings.iDraw,
			columns: columns.map( function ( column, i ) {
				return {
					data: colData(i, 'mData'),
					name: column.sName,
					searchable: column.bSearchable,
					orderable: column.bSortable,
					search: {
						value: preColSearch[i].search,
						regex: preColSearch[i].regex,
						fixed: Object.keys(column.searchFixed).map( function(name) {
							return {
								name: name,
								term: column.searchFixed[name].toString()
							}
						})
					}
				};
			} ),
			order: _fnSortFlatten( settings ).map( function ( val ) {
				return {
					column: val.col,
					dir: val.dir,
					name: colData(val.col, 'sName')
				};
			} ),
			start: settings._iDisplayStart,
			length: features.bPaginate ?
				settings._iDisplayLength :
				-1,
			search: {
				value: preSearch.search,
				regex: preSearch.regex,
				fixed: Object.keys(settings.searchFixed).map( function(name) {
					return {
						name: name,
						term: settings.searchFixed[name].toString()
					}
				})
			}
		};
	}
	
	
	/**
	 * Data the data from the server (nuking the old) and redraw the table
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} json json data return from the server.
	 *  @param {string} json.sEcho Tracking flag for DataTables to match requests
	 *  @param {int} json.iTotalRecords Number of records in the data set, not accounting for filtering
	 *  @param {int} json.iTotalDisplayRecords Number of records in the data set, accounting for filtering
	 *  @param {array} json.aaData The data to display on this page
	 *  @param {string} [json.sColumns] Column ordering (sName, comma separated)
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxUpdateDraw ( settings, json )
	{
		var data = _fnAjaxDataSrc(settings, json);
		var draw = _fnAjaxDataSrcParam(settings, 'draw', json);
		var recordsTotal = _fnAjaxDataSrcParam(settings, 'recordsTotal', json);
		var recordsFiltered = _fnAjaxDataSrcParam(settings, 'recordsFiltered', json);
	
		if ( draw !== undefined ) {
			// Protect against out of sequence returns
			if ( draw*1 < settings.iDraw ) {
				return;
			}
			settings.iDraw = draw * 1;
		}
	
		// No data in returned object, so rather than an array, we show an empty table
		if ( ! data ) {
			data = [];
		}
	
		_fnClearTable( settings );
		settings._iRecordsTotal   = parseInt(recordsTotal, 10);
		settings._iRecordsDisplay = parseInt(recordsFiltered, 10);
	
		for ( var i=0, ien=data.length ; i<ien ; i++ ) {
			_fnAddData( settings, data[i] );
		}
		settings.aiDisplay = settings.aiDisplayMaster.slice();
	
		_fnDraw( settings, true );
		_fnInitComplete( settings );
		_fnProcessingDisplay( settings, false );
	}
	
	
	/**
	 * Get the data from the JSON data source to use for drawing a table. Using
	 * `_fnGetObjectDataFn` allows the data to be sourced from a property of the
	 * source object, or from a processing function.
	 *  @param {object} settings dataTables settings object
	 *  @param  {object} json Data source object / array from the server
	 *  @return {array} Array of data to use
	 */
	function _fnAjaxDataSrc ( settings, json, write )
	{
		var dataProp = 'data';
	
		if ($.isPlainObject( settings.ajax ) && settings.ajax.dataSrc !== undefined) {
			// Could in inside a `dataSrc` object, or not!
			var dataSrc = settings.ajax.dataSrc;
	
			// string, function and object are valid types
			if (typeof dataSrc === 'string' || typeof dataSrc === 'function') {
				dataProp = dataSrc;
			}
			else if (dataSrc.data !== undefined) {
				dataProp = dataSrc.data;
			}
		}
	
		if ( ! write ) {
			if ( dataProp === 'data' ) {
				// If the default, then we still want to support the old style, and safely ignore
				// it if possible
				return json.aaData || json[dataProp];
			}
	
			return dataProp !== "" ?
				_fnGetObjectDataFn( dataProp )( json ) :
				json;
		}
		
		// set
		_fnSetObjectDataFn( dataProp )( json, write );
	}
	
	/**
	 * Very similar to _fnAjaxDataSrc, but for the other SSP properties
	 * @param {*} settings DataTables settings object
	 * @param {*} param Target parameter
	 * @param {*} json JSON data
	 * @returns Resolved value
	 */
	function _fnAjaxDataSrcParam (settings, param, json) {
		var dataSrc = $.isPlainObject( settings.ajax )
			? settings.ajax.dataSrc
			: null;
	
		if (dataSrc && dataSrc[param]) {
			// Get from custom location
			return _fnGetObjectDataFn( dataSrc[param] )( json );
		}
	
		// else - Default behaviour
		var old = '';
	
		// Legacy support
		if (param === 'draw') {
			old = 'sEcho';
		}
		else if (param === 'recordsTotal') {
			old = 'iTotalRecords';
		}
		else if (param === 'recordsFiltered') {
			old = 'iTotalDisplayRecords';
		}
	
		return json[old] !== undefined
			? json[old]
			: json[param];
	}
	
	
	/**
	 * Filter the table using both the global filter and column based filtering
	 *  @param {object} settings dataTables settings object
	 *  @param {object} input search information
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterComplete ( settings, input )
	{
		var columnsSearch = settings.aoPreSearchCols;
	
		// Resolve any column types that are unknown due to addition or invalidation
		// @todo As per sort - can this be moved into an event handler?
		_fnColumnTypes( settings );
	
		// In server-side processing all filtering is done by the server, so no point hanging around here
		if ( _fnDataSource( settings ) != 'ssp' )
		{
			// Check if any of the rows were invalidated
			_fnFilterData( settings );
	
			// Start from the full data set
			settings.aiDisplay = settings.aiDisplayMaster.slice();
	
			// Global filter first
			_fnFilter( settings.aiDisplay, settings, input.search, input );
	
			$.each(settings.searchFixed, function (name, term) {
				_fnFilter(settings.aiDisplay, settings, term, {});
			});
	
			// Then individual column filters
			for ( var i=0 ; i<columnsSearch.length ; i++ )
			{
				var col = columnsSearch[i];
	
				_fnFilter(
					settings.aiDisplay,
					settings,
					col.search,
					col,
					i
				);
	
				$.each(settings.aoColumns[i].searchFixed, function (name, term) {
					_fnFilter(settings.aiDisplay, settings, term, {}, i);
				});
			}
	
			// And finally global filtering
			_fnFilterCustom( settings );
		}
	
		// Tell the draw function we have been filtering
		settings.bFiltered = true;
	
		_fnCallbackFire( settings, null, 'search', [settings] );
	}
	
	
	/**
	 * Apply custom filtering functions
	 * 
	 * This is legacy now that we have named functions, but it is widely used
	 * from 1.x, so it is not yet deprecated.
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterCustom( settings )
	{
		var filters = DataTable.ext.search;
		var displayRows = settings.aiDisplay;
		var row, rowIdx;
	
		for ( var i=0, ien=filters.length ; i<ien ; i++ ) {
			var rows = [];
	
			// Loop over each row and see if it should be included
			for ( var j=0, jen=displayRows.length ; j<jen ; j++ ) {
				rowIdx = displayRows[ j ];
				row = settings.aoData[ rowIdx ];
	
				if ( filters[i]( settings, row._aFilterData, rowIdx, row._aData, j ) ) {
					rows.push( rowIdx );
				}
			}
	
			// So the array reference doesn't break set the results into the
			// existing array
			displayRows.length = 0;
			displayRows.push.apply(displayRows, rows);
		}
	}
	
	
	/**
	 * Filter the data table based on user input and draw the table
	 */
	function _fnFilter( searchRows, settings, input, options, column )
	{
		if ( input === '' ) {
			return;
		}
	
		var i = 0;
	
		// Search term can be a function, regex or string - if a string we apply our
		// smart filtering regex (assuming the options require that)
		var searchFunc = typeof input === 'function' ? input : null;
		var rpSearch = input instanceof RegExp
			? input
			: searchFunc
				? null
				: _fnFilterCreateSearch( input, options );
	
		// Then for each row, does the test pass. If not, lop the row from the array
		while (i < searchRows.length) {
			var row = settings.aoData[ searchRows[i] ];
			var data = column === undefined
				? row._sFilterRow
				: row._aFilterData[ column ];
	
			if ( (searchFunc && ! searchFunc(data, row._aData, searchRows[i], column)) || (rpSearch && ! rpSearch.test(data)) ) {
				searchRows.splice(i, 1);
				i--;
			}
	
			i++;
		}
	}
	
	
	/**
	 * Build a regular expression object suitable for searching a table
	 *  @param {string} sSearch string to search for
	 *  @param {bool} bRegex treat as a regular expression or not
	 *  @param {bool} bSmart perform smart filtering or not
	 *  @param {bool} bCaseInsensitive Do case insensitive matching or not
	 *  @returns {RegExp} constructed object
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterCreateSearch( search, inOpts )
	{
		var not = [];
		var options = $.extend({}, {
			boundary: false,
			caseInsensitive: true,
			exact: false,
			regex: false,
			smart: true
		}, inOpts);
	
		if (typeof search !== 'string') {
			search = search.toString();
		}
	
		// Remove diacritics if normalize is set up to do so
		search = _normalize(search);
	
		if (options.exact) {
			return new RegExp(
				'^'+_fnEscapeRegex(search)+'$',
				options.caseInsensitive ? 'i' : ''
			);
		}
	
		search = options.regex ?
			search :
			_fnEscapeRegex( search );
		
		if ( options.smart ) {
			/* For smart filtering we want to allow the search to work regardless of
			 * word order. We also want double quoted text to be preserved, so word
			 * order is important - a la google. And a negative look around for
			 * finding rows which don't contain a given string.
			 * 
			 * So this is the sort of thing we want to generate:
			 * 
			 * ^(?=.*?\bone\b)(?=.*?\btwo three\b)(?=.*?\bfour\b).*$
			 */
			var parts = search.match( /!?["\u201C][^"\u201D]+["\u201D]|[^ ]+/g ) || [''];
			var a = parts.map( function ( word ) {
				var negative = false;
				var m;
	
				// Determine if it is a "does not include"
				if ( word.charAt(0) === '!' ) {
					negative = true;
					word = word.substring(1);
				}
	
				// Strip the quotes from around matched phrases
				if ( word.charAt(0) === '"' ) {
					m = word.match( /^"(.*)"$/ );
					word = m ? m[1] : word;
				}
				else if ( word.charAt(0) === '\u201C' ) {
					// Smart quote match (iPhone users)
					m = word.match( /^\u201C(.*)\u201D$/ );
					word = m ? m[1] : word;
				}
	
				// For our "not" case, we need to modify the string that is
				// allowed to match at the end of the expression.
				if (negative) {
					if (word.length > 1) {
						not.push('(?!'+word+')');
					}
	
					word = '';
				}
	
				return word.replace('"', '');
			} );
	
			var match = not.length
				? not.join('')
				: '';
	
			var boundary = options.boundary
				? '\\b'
				: '';
	
			search = '^(?=.*?'+boundary+a.join( ')(?=.*?'+boundary )+')('+match+'.)*$';
		}
	
		return new RegExp( search, options.caseInsensitive ? 'i' : '' );
	}
	
	
	/**
	 * Escape a string such that it can be used in a regular expression
	 *  @param {string} sVal string to escape
	 *  @returns {string} escaped string
	 *  @memberof DataTable#oApi
	 */
	var _fnEscapeRegex = DataTable.util.escapeRegex;
	
	var __filter_div = $('<div>')[0];
	var __filter_div_textContent = __filter_div.textContent !== undefined;
	
	// Update the filtering data for each row if needed (by invalidation or first run)
	function _fnFilterData ( settings )
	{
		var columns = settings.aoColumns;
		var data = settings.aoData;
		var column;
		var j, jen, filterData, cellData, row;
		var wasInvalidated = false;
	
		for ( var rowIdx=0 ; rowIdx<data.length ; rowIdx++ ) {
			if (! data[rowIdx]) {
				continue;
			}
	
			row = data[rowIdx];
	
			if ( ! row._aFilterData ) {
				filterData = [];
	
				for ( j=0, jen=columns.length ; j<jen ; j++ ) {
					column = columns[j];
	
					if ( column.bSearchable ) {
						cellData = _fnGetCellData( settings, rowIdx, j, 'filter' );
	
						// Search in DataTables is string based
						if ( cellData === null ) {
							cellData = '';
						}
	
						if ( typeof cellData !== 'string' && cellData.toString ) {
							cellData = cellData.toString();
						}
					}
					else {
						cellData = '';
					}
	
					// If it looks like there is an HTML entity in the string,
					// attempt to decode it so sorting works as expected. Note that
					// we could use a single line of jQuery to do this, but the DOM
					// method used here is much faster https://jsperf.com/html-decode
					if ( cellData.indexOf && cellData.indexOf('&') !== -1 ) {
						__filter_div.innerHTML = cellData;
						cellData = __filter_div_textContent ?
							__filter_div.textContent :
							__filter_div.innerText;
					}
	
					if ( cellData.replace ) {
						cellData = cellData.replace(/[\r\n\u2028]/g, '');
					}
	
					filterData.push( cellData );
				}
	
				row._aFilterData = filterData;
				row._sFilterRow = filterData.join('  ');
				wasInvalidated = true;
			}
		}
	
		return wasInvalidated;
	}
	
	
	/**
	 * Draw the table for the first time, adding all required features
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnInitialise ( settings )
	{
		var i, iAjaxStart=settings.iInitDisplayStart;
	
		/* Ensure that the table data is fully initialised */
		if ( ! settings.bInitialised ) {
			setTimeout( function(){ _fnInitialise( settings ); }, 200 );
			return;
		}
	
		/* Build and draw the header / footer for the table */
		_fnBuildHead( settings, 'header' );
		_fnBuildHead( settings, 'footer' );
		_fnDrawHead( settings, settings.aoHeader );
		_fnDrawHead( settings, settings.aoFooter );
	
		// Enable features
		_fnAddOptionsHtml( settings );
		_fnSortInit( settings );
	
		_colGroup( settings );
	
		/* Okay to show that something is going on now */
		_fnProcessingDisplay( settings, true );
	
		_fnCallbackFire( settings, null, 'preInit', [settings], true );
	
		// If there is default sorting required - let's do it. The sort function
		// will do the drawing for us. Otherwise we draw the table regardless of the
		// Ajax source - this allows the table to look initialised for Ajax sourcing
		// data (show 'loading' message possibly)
		_fnReDraw( settings );
	
		var dataSrc = _fnDataSource( settings );
	
		// Server-side processing init complete is done by _fnAjaxUpdateDraw
		if ( dataSrc != 'ssp' ) {
			// if there is an ajax source load the data
			if ( dataSrc == 'ajax' ) {
				_fnBuildAjax( settings, {}, function(json) {
					var aData = _fnAjaxDataSrc( settings, json );
	
					// Got the data - add it to the table
					for ( i=0 ; i<aData.length ; i++ ) {
						_fnAddData( settings, aData[i] );
					}
	
					// Reset the init display for cookie saving. We've already done
					// a filter, and therefore cleared it before. So we need to make
					// it appear 'fresh'
					settings.iInitDisplayStart = iAjaxStart;
	
					_fnReDraw( settings );
					_fnProcessingDisplay( settings, false );
					_fnInitComplete( settings );
				}, settings );
			}
			else {
				_fnInitComplete( settings );
				_fnProcessingDisplay( settings, false );
			}
		}
	}
	
	
	/**
	 * Draw the table for the first time, adding all required features
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnInitComplete ( settings )
	{
		if (settings._bInitComplete) {
			return;
		}
	
		var args = [settings, settings.json];
	
		settings._bInitComplete = true;
	
		// Table is fully set up and we have data, so calculate the
		// column widths
		_fnAdjustColumnSizing( settings );
	
		_fnCallbackFire( settings, null, 'plugin-init', args, true );
		_fnCallbackFire( settings, 'aoInitComplete', 'init', args, true );
	}
	
	function _fnLengthChange ( settings, val )
	{
		var len = parseInt( val, 10 );
		settings._iDisplayLength = len;
	
		_fnLengthOverflow( settings );
	
		// Fire length change event
		_fnCallbackFire( settings, null, 'length', [settings, len] );
	}
	
	/**
	 * Alter the display settings to change the page
	 *  @param {object} settings DataTables settings object
	 *  @param {string|int} action Paging action to take: "first", "previous",
	 *    "next" or "last" or page number to jump to (integer)
	 *  @param [bool] redraw Automatically draw the update or not
	 *  @returns {bool} true page has changed, false - no change
	 *  @memberof DataTable#oApi
	 */
	function _fnPageChange ( settings, action, redraw )
	{
		var
			start     = settings._iDisplayStart,
			len       = settings._iDisplayLength,
			records   = settings.fnRecordsDisplay();
	
		if ( records === 0 || len === -1 )
		{
			start = 0;
		}
		else if ( typeof action === "number" )
		{
			start = action * len;
	
			if ( start > records )
			{
				start = 0;
			}
		}
		else if ( action == "first" )
		{
			start = 0;
		}
		else if ( action == "previous" )
		{
			start = len >= 0 ?
				start - len :
				0;
	
			if ( start < 0 )
			{
				start = 0;
			}
		}
		else if ( action == "next" )
		{
			if ( start + len < records )
			{
				start += len;
			}
		}
		else if ( action == "last" )
		{
			start = Math.floor( (records-1) / len) * len;
		}
		else if ( action === 'ellipsis' )
		{
			return;
		}
		else
		{
			_fnLog( settings, 0, "Unknown paging action: "+action, 5 );
		}
	
		var changed = settings._iDisplayStart !== start;
		settings._iDisplayStart = start;
	
		_fnCallbackFire( settings, null, changed ? 'page' : 'page-nc', [settings] );
	
		if ( changed && redraw ) {
			_fnDraw( settings );
		}
	
		return changed;
	}
	
	
	/**
	 * Generate the node required for the processing node
	 *  @param {object} settings DataTables settings object
	 */
	function _processingHtml ( settings )
	{
		var table = settings.nTable;
	
		if ( settings.oFeatures.bProcessing ) {
			var n = $('<div/>', {
					'id': settings.sTableId + '_processing',
					'class': settings.oClasses.processing.container,
					'role': 'status'
				} )
				.html( settings.oLanguage.sProcessing )
				.append('<div><div></div><div></div><div></div><div></div></div>')
				.insertBefore( table );
			
			$(table).on( 'processing.dt.DT', function (e, s, show) {
				n.css( 'display', show ? 'block' : 'none' );
			} );
		}
	}
	
	
	/**
	 * Display or hide the processing indicator
	 *  @param {object} settings DataTables settings object
	 *  @param {bool} show Show the processing indicator (true) or not (false)
	 */
	function _fnProcessingDisplay ( settings, show )
	{
		_fnCallbackFire( settings, null, 'processing', [settings, show] );
	}
	/**
	 * Add any control elements for the table - specifically scrolling
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Node to add to the DOM
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlTable ( settings )
	{
		var table = $(settings.nTable);
	
		// Scrolling from here on in
		var scroll = settings.oScroll;
	
		if ( scroll.sX === '' && scroll.sY === '' ) {
			return settings.nTable;
		}
	
		var scrollX = scroll.sX;
		var scrollY = scroll.sY;
		var classes = settings.oClasses.scrolling;
		var caption = settings.captionNode;
		var captionSide = caption ? caption._captionSide : null;
		var headerClone = $( table[0].cloneNode(false) );
		var footerClone = $( table[0].cloneNode(false) );
		var footer = table.children('tfoot');
		var _div = '<div/>';
		var size = function ( s ) {
			return !s ? null : _fnStringToCss( s );
		};
	
		if ( ! footer.length ) {
			footer = null;
		}
	
		/*
		 * The HTML structure that we want to generate in this function is:
		 *  div - scroller
		 *    div - scroll head
		 *      div - scroll head inner
		 *        table - scroll head table
		 *          thead - thead
		 *    div - scroll body
		 *      table - table (master table)
		 *        thead - thead clone for sizing
		 *        tbody - tbody
		 *    div - scroll foot
		 *      div - scroll foot inner
		 *        table - scroll foot table
		 *          tfoot - tfoot
		 */
		var scroller = $( _div, { 'class': classes.container } )
			.append(
				$(_div, { 'class': classes.header.self } )
					.css( {
						overflow: 'hidden',
						position: 'relative',
						border: 0,
						width: scrollX ? size(scrollX) : '100%'
					} )
					.append(
						$(_div, { 'class': classes.header.inner } )
							.css( {
								'box-sizing': 'content-box',
								width: scroll.sXInner || '100%'
							} )
							.append(
								headerClone
									.removeAttr('id')
									.css( 'margin-left', 0 )
									.append( captionSide === 'top' ? caption : null )
									.append(
										table.children('thead')
									)
							)
					)
			)
			.append(
				$(_div, { 'class': classes.body } )
					.css( {
						position: 'relative',
						overflow: 'auto',
						width: size( scrollX )
					} )
					.append( table )
			);
	
		if ( footer ) {
			scroller.append(
				$(_div, { 'class': classes.footer.self } )
					.css( {
						overflow: 'hidden',
						border: 0,
						width: scrollX ? size(scrollX) : '100%'
					} )
					.append(
						$(_div, { 'class': classes.footer.inner } )
							.append(
								footerClone
									.removeAttr('id')
									.css( 'margin-left', 0 )
									.append( captionSide === 'bottom' ? caption : null )
									.append(
										table.children('tfoot')
									)
							)
					)
			);
		}
	
		var children = scroller.children();
		var scrollHead = children[0];
		var scrollBody = children[1];
		var scrollFoot = footer ? children[2] : null;
	
		// When the body is scrolled, then we also want to scroll the headers
		$(scrollBody).on( 'scroll.DT', function () {
			var scrollLeft = this.scrollLeft;
	
			scrollHead.scrollLeft = scrollLeft;
	
			if ( footer ) {
				scrollFoot.scrollLeft = scrollLeft;
			}
		} );
	
		// When focus is put on the header cells, we might need to scroll the body
		$('th, td', scrollHead).on('focus', function () {
			var scrollLeft = scrollHead.scrollLeft;
	
			scrollBody.scrollLeft = scrollLeft;
	
			if ( footer ) {
				scrollBody.scrollLeft = scrollLeft;
			}
		});
	
		$(scrollBody).css('max-height', scrollY);
		if (! scroll.bCollapse) {
			$(scrollBody).css('height', scrollY);
		}
	
		settings.nScrollHead = scrollHead;
		settings.nScrollBody = scrollBody;
		settings.nScrollFoot = scrollFoot;
	
		// On redraw - align columns
		settings.aoDrawCallback.push(_fnScrollDraw);
	
		return scroller[0];
	}
	
	
	
	/**
	 * Update the header, footer and body tables for resizing - i.e. column
	 * alignment.
	 *
	 * Welcome to the most horrible function DataTables. The process that this
	 * function follows is basically:
	 *   1. Re-create the table inside the scrolling div
	 *   2. Correct colgroup > col values if needed
	 *   3. Copy colgroup > col over to header and footer
	 *   4. Clean up
	 *
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnScrollDraw ( settings )
	{
		// Given that this is such a monster function, a lot of variables are use
		// to try and keep the minimised size as small as possible
		var
			scroll         = settings.oScroll,
			barWidth       = scroll.iBarWidth,
			divHeader      = $(settings.nScrollHead),
			divHeaderInner = divHeader.children('div'),
			divHeaderTable = divHeaderInner.children('table'),
			divBodyEl      = settings.nScrollBody,
			divBody        = $(divBodyEl),
			divFooter      = $(settings.nScrollFoot),
			divFooterInner = divFooter.children('div'),
			divFooterTable = divFooterInner.children('table'),
			header         = $(settings.nTHead),
			table          = $(settings.nTable),
			footer         = settings.nTFoot && $('th, td', settings.nTFoot).length ? $(settings.nTFoot) : null,
			browser        = settings.oBrowser,
			headerCopy, footerCopy;
	
		// If the scrollbar visibility has changed from the last draw, we need to
		// adjust the column sizes as the table width will have changed to account
		// for the scrollbar
		var scrollBarVis = divBodyEl.scrollHeight > divBodyEl.clientHeight;
		
		if ( settings.scrollBarVis !== scrollBarVis && settings.scrollBarVis !== undefined ) {
			settings.scrollBarVis = scrollBarVis;
			_fnAdjustColumnSizing( settings );
			return; // adjust column sizing will call this function again
		}
		else {
			settings.scrollBarVis = scrollBarVis;
		}
	
		// 1. Re-create the table inside the scrolling div
		// Remove the old minimised thead and tfoot elements in the inner table
		table.children('thead, tfoot').remove();
	
		// Clone the current header and footer elements and then place it into the inner table
		headerCopy = header.clone().prependTo( table );
		headerCopy.find('th, td').removeAttr('tabindex');
		headerCopy.find('[id]').removeAttr('id');
	
		if ( footer ) {
			footerCopy = footer.clone().prependTo( table );
			footerCopy.find('[id]').removeAttr('id');
		}
	
		// 2. Correct colgroup > col values if needed
		// It is possible that the cell sizes are smaller than the content, so we need to
		// correct colgroup>col for such cases. This can happen if the auto width detection
		// uses a cell which has a longer string, but isn't the widest! For example 
		// "Chief Executive Officer (CEO)" is the longest string in the demo, but
		// "Systems Administrator" is actually the widest string since it doesn't collapse.
		if (settings.aiDisplay.length) {
			// Get the column sizes from the first row in the table
			var colSizes = table.find('tbody tr').eq(0).find('th, td').map(function () {
				return $(this).outerWidth();
			});
	
			// Check against what the colgroup > col is set to and correct if needed
			$('col', settings.colgroup).each(function (i) {
				var colWidth = this.style.width.replace('px', '');
	
				if (colWidth !== colSizes[i]) {
					this.style.width = colSizes[i] + 'px';
				}
			});
		}
	
		// 3. Copy the colgroup over to the header and footer
		divHeaderTable
			.find('colgroup')
			.remove();
	
		divHeaderTable.append(settings.colgroup.clone());
	
		if ( footer ) {
			divFooterTable
				.find('colgroup')
				.remove();
	
			divFooterTable.append(settings.colgroup.clone());
		}
	
		// "Hide" the header and footer that we used for the sizing. We need to keep
		// the content of the cell so that the width applied to the header and body
		// both match, but we want to hide it completely.
		$('th, td', headerCopy).each(function () {
			$(this.childNodes).wrapAll('<div class="dt-scroll-sizing">');
		});
	
		if ( footer ) {
			$('th, td', footerCopy).each(function () {
				$(this.childNodes).wrapAll('<div class="dt-scroll-sizing">');
			});
		}
	
		// 4. Clean up
		// Figure out if there are scrollbar present - if so then we need a the header and footer to
		// provide a bit more space to allow "overflow" scrolling (i.e. past the scrollbar)
		var isScrolling = Math.floor(table.height()) > divBodyEl.clientHeight || divBody.css('overflow-y') == "scroll";
		var paddingSide = 'padding' + (browser.bScrollbarLeft ? 'Left' : 'Right' );
	
		// Set the width's of the header and footer tables
		var outerWidth = table.outerWidth();
	
		divHeaderTable.css('width', _fnStringToCss( outerWidth ));
		divHeaderInner
			.css('width', _fnStringToCss( outerWidth ))
			.css(paddingSide, isScrolling ? barWidth+"px" : "0px");
	
		if ( footer ) {
			divFooterTable.css('width', _fnStringToCss( outerWidth ));
			divFooterInner
				.css('width', _fnStringToCss( outerWidth ))
				.css(paddingSide, isScrolling ? barWidth+"px" : "0px");
		}
	
		// Correct DOM ordering for colgroup - comes before the thead
		table.children('colgroup').prependTo(table);
	
		// Adjust the position of the header in case we loose the y-scrollbar
		divBody.trigger('scroll');
	
		// If sorting or filtering has occurred, jump the scrolling back to the top
		// only if we aren't holding the position
		if ( (settings.bSorted || settings.bFiltered) && ! settings._drawHold ) {
			divBodyEl.scrollTop = 0;
		}
	}
	
	/**
	 * Calculate the width of columns for the table
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnCalculateColumnWidths ( settings )
	{
		// Not interested in doing column width calculation if auto-width is disabled
		if (! settings.oFeatures.bAutoWidth) {
			return;
		}
	
		var
			table = settings.nTable,
			columns = settings.aoColumns,
			scroll = settings.oScroll,
			scrollY = scroll.sY,
			scrollX = scroll.sX,
			scrollXInner = scroll.sXInner,
			visibleColumns = _fnGetColumns( settings, 'bVisible' ),
			tableWidthAttr = table.getAttribute('width'), // from DOM element
			tableContainer = table.parentNode,
			i, column, columnIdx;
	
		var styleWidth = table.style.width;
		if ( styleWidth && styleWidth.indexOf('%') !== -1 ) {
			tableWidthAttr = styleWidth;
		}
	
		// Let plug-ins know that we are doing a recalc, in case they have changed any of the
		// visible columns their own way (e.g. Responsive uses display:none).
		_fnCallbackFire(
			settings,
			null,
			'column-calc',
			{visible: visibleColumns},
			false
		);
	
		// Construct a single row, worst case, table with the widest
		// node in the data, assign any user defined widths, then insert it into
		// the DOM and allow the browser to do all the hard work of calculating
		// table widths
		var tmpTable = $(table.cloneNode())
			.css( 'visibility', 'hidden' )
			.removeAttr( 'id' );
	
		// Clean up the table body
		tmpTable.append('<tbody>')
		var tr = $('<tr/>').appendTo( tmpTable.find('tbody') );
	
		// Clone the table header and footer - we can't use the header / footer
		// from the cloned table, since if scrolling is active, the table's
		// real header and footer are contained in different table tags
		tmpTable
			.append( $(settings.nTHead).clone() )
			.append( $(settings.nTFoot).clone() );
	
		// Remove any assigned widths from the footer (from scrolling)
		tmpTable.find('tfoot th, tfoot td').css('width', '');
	
		// Apply custom sizing to the cloned header
		tmpTable.find('thead th, thead td').each( function () {
			// Get the `width` from the header layout
			var width = _fnColumnsSumWidth( settings, this, true, false );
	
			if ( width ) {
				this.style.width = width;
	
				// For scrollX we need to force the column width otherwise the
				// browser will collapse it. If this width is smaller than the
				// width the column requires, then it will have no effect
				if ( scrollX ) {
					$( this ).append( $('<div/>').css( {
						width: width,
						margin: 0,
						padding: 0,
						border: 0,
						height: 1
					} ) );
				}
			}
			else {
				this.style.width = '';
			}
		} );
	
		// Find the widest piece of data for each column and put it into the table
		for ( i=0 ; i<visibleColumns.length ; i++ ) {
			columnIdx = visibleColumns[i];
			column = columns[ columnIdx ];
	
			var longest = _fnGetMaxLenString(settings, columnIdx);
			var autoClass = _ext.type.className[column.sType];
			var text = longest + column.sContentPadding;
			var insert = longest.indexOf('<') === -1
				? document.createTextNode(text)
				: text
			
			$('<td/>')
				.addClass(autoClass)
				.addClass(column.sClass)
				.append(insert)
				.appendTo(tr);
		}
	
		// Tidy the temporary table - remove name attributes so there aren't
		// duplicated in the dom (radio elements for example)
		$('[name]', tmpTable).removeAttr('name');
	
		// Table has been built, attach to the document so we can work with it.
		// A holding element is used, positioned at the top of the container
		// with minimal height, so it has no effect on if the container scrolls
		// or not. Otherwise it might trigger scrolling when it actually isn't
		// needed
		var holder = $('<div/>').css( scrollX || scrollY ?
				{
					position: 'absolute',
					top: 0,
					left: 0,
					height: 1,
					right: 0,
					overflow: 'hidden'
				} :
				{}
			)
			.append( tmpTable )
			.appendTo( tableContainer );
	
		// When scrolling (X or Y) we want to set the width of the table as 
		// appropriate. However, when not scrolling leave the table width as it
		// is. This results in slightly different, but I think correct behaviour
		if ( scrollX && scrollXInner ) {
			tmpTable.width( scrollXInner );
		}
		else if ( scrollX ) {
			tmpTable.css( 'width', 'auto' );
			tmpTable.removeAttr('width');
	
			// If there is no width attribute or style, then allow the table to
			// collapse
			if ( tmpTable.width() < tableContainer.clientWidth && tableWidthAttr ) {
				tmpTable.width( tableContainer.clientWidth );
			}
		}
		else if ( scrollY ) {
			tmpTable.width( tableContainer.clientWidth );
		}
		else if ( tableWidthAttr ) {
			tmpTable.width( tableWidthAttr );
		}
	
		// Get the width of each column in the constructed table
		var total = 0;
		var bodyCells = tmpTable.find('tbody tr').eq(0).children();
	
		for ( i=0 ; i<visibleColumns.length ; i++ ) {
			// Use getBounding for sub-pixel accuracy, which we then want to round up!
			var bounding = bodyCells[i].getBoundingClientRect().width;
	
			// Total is tracked to remove any sub-pixel errors as the outerWidth
			// of the table might not equal the total given here
			total += bounding;
	
			// Width for each column to use
			columns[ visibleColumns[i] ].sWidth = _fnStringToCss( bounding );
		}
	
		table.style.width = _fnStringToCss( total );
	
		// Finished with the table - ditch it
		holder.remove();
	
		// If there is a width attr, we want to attach an event listener which
		// allows the table sizing to automatically adjust when the window is
		// resized. Use the width attr rather than CSS, since we can't know if the
		// CSS is a relative value or absolute - DOM read is always px.
		if ( tableWidthAttr ) {
			table.style.width = _fnStringToCss( tableWidthAttr );
		}
	
		if ( (tableWidthAttr || scrollX) && ! settings._reszEvt ) {
			var bindResize = function () {
				$(window).on('resize.DT-'+settings.sInstance, DataTable.util.throttle( function () {
					if (! settings.bDestroying) {
						_fnAdjustColumnSizing( settings );
					}
				} ) );
			};
	
			bindResize();
	
			settings._reszEvt = true;
		}
	}
	
	
	/**
	 * Get the maximum strlen for each data column
	 *  @param {object} settings dataTables settings object
	 *  @param {int} colIdx column of interest
	 *  @returns {string} string of the max length
	 *  @memberof DataTable#oApi
	 */
	function _fnGetMaxLenString( settings, colIdx )
	{
		var column = settings.aoColumns[colIdx];
	
		if (! column.maxLenString) {
			var s, max='', maxLen = -1;
		
			for ( var i=0, ien=settings.aiDisplayMaster.length ; i<ien ; i++ ) {
				var rowIdx = settings.aiDisplayMaster[i];
				var data = _fnGetRowDisplay(settings, rowIdx)[colIdx];
	
				var cellString = data && typeof data === 'object' && data.nodeType
					? data.innerHTML
					: data+'';
	
				// Remove id / name attributes from elements so they
				// don't interfere with existing elements
				cellString = cellString
					.replace(/id=".*?"/g, '')
					.replace(/name=".*?"/g, '');
	
				s = _stripHtml(cellString)
					.replace( /&nbsp;/g, ' ' );
		
				if ( s.length > maxLen ) {
					// We want the HTML in the string, but the length that
					// is important is the stripped string
					max = cellString;
					maxLen = s.length;
				}
			}
	
			column.maxLenString = max;
		}
	
		return column.maxLenString;
	}
	
	
	/**
	 * Append a CSS unit (only if required) to a string
	 *  @param {string} value to css-ify
	 *  @returns {string} value with css unit
	 *  @memberof DataTable#oApi
	 */
	function _fnStringToCss( s )
	{
		if ( s === null ) {
			return '0px';
		}
	
		if ( typeof s == 'number' ) {
			return s < 0 ?
				'0px' :
				s+'px';
		}
	
		// Check it has a unit character already
		return s.match(/\d$/) ?
			s+'px' :
			s;
	}
	
	/**
	 * Re-insert the `col` elements for current visibility
	 *
	 * @param {*} settings DT settings
	 */
	function _colGroup( settings ) {
		var cols = settings.aoColumns;
	
		settings.colgroup.empty();
	
		for (i=0 ; i<cols.length ; i++) {
			if (cols[i].bVisible) {
				settings.colgroup.append(cols[i].colEl);
			}
		}
	}
	
	
	function _fnSortInit( settings ) {
		var target = settings.nTHead;
		var headerRows = target.querySelectorAll('tr');
		var legacyTop = settings.bSortCellsTop;
		var notSelector = ':not([data-dt-order="disable"]):not([data-dt-order="icon-only"])';
		
		// Legacy support for `orderCellsTop`
		if (legacyTop === true) {
			target = headerRows[0];
		}
		else if (legacyTop === false) {
			target = headerRows[ headerRows.length - 1 ];
		}
	
		_fnSortAttachListener(
			settings,
			target,
			target === settings.nTHead
				? 'tr'+notSelector+' th'+notSelector+', tr'+notSelector+' td'+notSelector
				: 'th'+notSelector+', td'+notSelector
		);
	
		// Need to resolve the user input array into our internal structure
		var order = [];
		_fnSortResolve( settings, order, settings.aaSorting );
	
		settings.aaSorting = order;
	}
	
	
	function _fnSortAttachListener(settings, node, selector, column, callback) {
		_fnBindAction( node, selector, function (e) {
			var run = false;
			var columns = column === undefined
				? _fnColumnsFromHeader( e.target )
				: [column];
	
			if ( columns.length ) {
				for ( var i=0, ien=columns.length ; i<ien ; i++ ) {
					var ret = _fnSortAdd( settings, columns[i], i, e.shiftKey );
	
					if (ret !== false) {
						run = true;
					}					
	
					// If the first entry is no sort, then subsequent
					// sort columns are ignored
					if (settings.aaSorting.length === 1 && settings.aaSorting[0][1] === '') {
						break;
					}
				}
	
				if (run) {
					_fnProcessingDisplay( settings, true );
	
					// Allow the processing display to show
					setTimeout( function () {
						_fnSort( settings );
						_fnSortDisplay( settings );
						_fnReDraw( settings, false, false );
						_fnProcessingDisplay( settings, false );
	
						if (callback) {
							callback();
						}
					}, 0);
				}
			}
		} );
	}
	
	/**
	 * Sort the display array to match the master's order
	 * @param {*} settings
	 */
	function _fnSortDisplay(settings) {
		var display = settings.aiDisplay;
		var master = settings.aiDisplayMaster;
		var masterMap = {};
		var map = {};
		var i;
	
		// Rather than needing an `indexOf` on master array, we can create a map
		for (i=0 ; i<master.length ; i++) {
			masterMap[master[i]] = i;
		}
	
		// And then cache what would be the indexOf fom the display
		for (i=0 ; i<display.length ; i++) {
			map[display[i]] = masterMap[display[i]];
		}
	
		display.sort(function(a, b){
			// Short version of this function is simply `master.indexOf(a) - master.indexOf(b);`
			return map[a] - map[b];
		});
	}
	
	
	function _fnSortResolve (settings, nestedSort, sort) {
		var push = function ( a ) {
			if ($.isPlainObject(a)) {
				if (a.idx !== undefined) {
					// Index based ordering
					nestedSort.push([a.idx, a.dir]);
				}
				else if (a.name) {
					// Name based ordering
					var cols = _pluck( settings.aoColumns, 'sName');
					var idx = cols.indexOf(a.name);
	
					if (idx !== -1) {
						nestedSort.push([idx, a.dir]);
					}
				}
			}
			else {
				// Plain column index and direction pair
				nestedSort.push(a);
			}
		};
	
		if ( $.isPlainObject(sort) ) {
			// Object
			push(sort);
		}
		else if ( sort.length && typeof sort[0] === 'number' ) {
			// 1D array
			push(sort);
		}
		else if ( sort.length ) {
			// 2D array
			for (var z=0; z<sort.length; z++) {
				push(sort[z]); // Object or array
			}
		}
	}
	
	
	function _fnSortFlatten ( settings )
	{
		var
			i, k, kLen,
			aSort = [],
			extSort = DataTable.ext.type.order,
			aoColumns = settings.aoColumns,
			aDataSort, iCol, sType, srcCol,
			fixed = settings.aaSortingFixed,
			fixedObj = $.isPlainObject( fixed ),
			nestedSort = [];
		
		if ( ! settings.oFeatures.bSort ) {
			return aSort;
		}
	
		// Build the sort array, with pre-fix and post-fix options if they have been
		// specified
		if ( Array.isArray( fixed ) ) {
			_fnSortResolve( settings, nestedSort, fixed );
		}
	
		if ( fixedObj && fixed.pre ) {
			_fnSortResolve( settings, nestedSort, fixed.pre );
		}
	
		_fnSortResolve( settings, nestedSort, settings.aaSorting );
	
		if (fixedObj && fixed.post ) {
			_fnSortResolve( settings, nestedSort, fixed.post );
		}
	
		for ( i=0 ; i<nestedSort.length ; i++ )
		{
			srcCol = nestedSort[i][0];
	
			if ( aoColumns[ srcCol ] ) {
				aDataSort = aoColumns[ srcCol ].aDataSort;
	
				for ( k=0, kLen=aDataSort.length ; k<kLen ; k++ )
				{
					iCol = aDataSort[k];
					sType = aoColumns[ iCol ].sType || 'string';
	
					if ( nestedSort[i]._idx === undefined ) {
						nestedSort[i]._idx = aoColumns[iCol].asSorting.indexOf(nestedSort[i][1]);
					}
	
					if ( nestedSort[i][1] ) {
						aSort.push( {
							src:       srcCol,
							col:       iCol,
							dir:       nestedSort[i][1],
							index:     nestedSort[i]._idx,
							type:      sType,
							formatter: extSort[ sType+"-pre" ],
							sorter:    extSort[ sType+"-"+nestedSort[i][1] ]
						} );
					}
				}
			}
		}
	
		return aSort;
	}
	
	/**
	 * Change the order of the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnSort ( oSettings, col, dir )
	{
		var
			i, ien, iLen,
			aiOrig = [],
			extSort = DataTable.ext.type.order,
			aoData = oSettings.aoData,
			sortCol,
			displayMaster = oSettings.aiDisplayMaster,
			aSort;
	
		// Resolve any column types that are unknown due to addition or invalidation
		// @todo Can this be moved into a 'data-ready' handler which is called when
		//   data is going to be used in the table?
		_fnColumnTypes( oSettings );
	
		// Allow a specific column to be sorted, which will _not_ alter the display
		// master
		if (col !== undefined) {
			var srcCol = oSettings.aoColumns[col];
			aSort = [{
				src:       col,
				col:       col,
				dir:       dir,
				index:     0,
				type:      srcCol.sType,
				formatter: extSort[ srcCol.sType+"-pre" ],
				sorter:    extSort[ srcCol.sType+"-"+dir ]
			}];
			displayMaster = displayMaster.slice();
		}
		else {
			aSort = _fnSortFlatten( oSettings );
		}
	
		for ( i=0, ien=aSort.length ; i<ien ; i++ ) {
			sortCol = aSort[i];
	
			// Load the data needed for the sort, for each cell
			_fnSortData( oSettings, sortCol.col );
		}
	
		/* No sorting required if server-side or no sorting array */
		if ( _fnDataSource( oSettings ) != 'ssp' && aSort.length !== 0 )
		{
			// Reset the initial positions on each pass so we get a stable sort
			for ( i=0, iLen=displayMaster.length ; i<iLen ; i++ ) {
				aiOrig[ i ] = i;
			}
	
			// If the first sort is desc, then reverse the array to preserve original
			// order, just in reverse
			if (aSort.length && aSort[0].dir === 'desc') {
				aiOrig.reverse();
			}
	
			/* Do the sort - here we want multi-column sorting based on a given data source (column)
			 * and sorting function (from oSort) in a certain direction. It's reasonably complex to
			 * follow on it's own, but this is what we want (example two column sorting):
			 *  fnLocalSorting = function(a,b){
			 *    var test;
			 *    test = oSort['string-asc']('data11', 'data12');
			 *      if (test !== 0)
			 *        return test;
			 *    test = oSort['numeric-desc']('data21', 'data22');
			 *    if (test !== 0)
			 *      return test;
			 *    return oSort['numeric-asc']( aiOrig[a], aiOrig[b] );
			 *  }
			 * Basically we have a test for each sorting column, if the data in that column is equal,
			 * test the next column. If all columns match, then we use a numeric sort on the row
			 * positions in the original data array to provide a stable sort.
			 */
			displayMaster.sort( function ( a, b ) {
				var
					x, y, k, test, sort,
					len=aSort.length,
					dataA = aoData[a]._aSortData,
					dataB = aoData[b]._aSortData;
	
				for ( k=0 ; k<len ; k++ ) {
					sort = aSort[k];
	
					// Data, which may have already been through a `-pre` function
					x = dataA[ sort.col ];
					y = dataB[ sort.col ];
	
					if (sort.sorter) {
						// If there is a custom sorter (`-asc` or `-desc`) for this
						// data type, use it
						test = sort.sorter(x, y);
	
						if ( test !== 0 ) {
							return test;
						}
					}
					else {
						// Otherwise, use generic sorting
						test = x<y ? -1 : x>y ? 1 : 0;
	
						if ( test !== 0 ) {
							return sort.dir === 'asc' ? test : -test;
						}
					}
				}
	
				x = aiOrig[a];
				y = aiOrig[b];
	
				return x<y ? -1 : x>y ? 1 : 0;
			} );
		}
		else if ( aSort.length === 0 ) {
			// Apply index order
			displayMaster.sort(function (x, y) {
				return x<y ? -1 : x>y ? 1 : 0;
			});
		}
	
		if (col === undefined) {
			// Tell the draw function that we have sorted the data
			oSettings.bSorted = true;
	
			_fnCallbackFire( oSettings, null, 'order', [oSettings, aSort] );
		}
	
		return displayMaster;
	}
	
	
	/**
	 * Function to run on user sort request
	 *  @param {object} settings dataTables settings object
	 *  @param {node} attachTo node to attach the handler to
	 *  @param {int} colIdx column sorting index
	 *  @param {int} addIndex Counter
	 *  @param {boolean} [shift=false] Shift click add
	 *  @param {function} [callback] callback function
	 *  @memberof DataTable#oApi
	 */
	function _fnSortAdd ( settings, colIdx, addIndex, shift )
	{
		var col = settings.aoColumns[ colIdx ];
		var sorting = settings.aaSorting;
		var asSorting = col.asSorting;
		var nextSortIdx;
		var next = function ( a, overflow ) {
			var idx = a._idx;
			if ( idx === undefined ) {
				idx = asSorting.indexOf(a[1]);
			}
	
			return idx+1 < asSorting.length ?
				idx+1 :
				overflow ?
					null :
					0;
		};
	
		if ( ! col.bSortable ) {
			return false;
		}
	
		// Convert to 2D array if needed
		if ( typeof sorting[0] === 'number' ) {
			sorting = settings.aaSorting = [ sorting ];
		}
	
		// If appending the sort then we are multi-column sorting
		if ( (shift || addIndex) && settings.oFeatures.bSortMulti ) {
			// Are we already doing some kind of sort on this column?
			var sortIdx = _pluck(sorting, '0').indexOf(colIdx);
	
			if ( sortIdx !== -1 ) {
				// Yes, modify the sort
				nextSortIdx = next( sorting[sortIdx], true );
	
				if ( nextSortIdx === null && sorting.length === 1 ) {
					nextSortIdx = 0; // can't remove sorting completely
				}
	
				if ( nextSortIdx === null ) {
					sorting.splice( sortIdx, 1 );
				}
				else {
					sorting[sortIdx][1] = asSorting[ nextSortIdx ];
					sorting[sortIdx]._idx = nextSortIdx;
				}
			}
			else if (shift) {
				// No sort on this column yet, being added by shift click
				// add it as itself
				sorting.push( [ colIdx, asSorting[0], 0 ] );
				sorting[sorting.length-1]._idx = 0;
			}
			else {
				// No sort on this column yet, being added from a colspan
				// so add with same direction as first column
				sorting.push( [ colIdx, sorting[0][1], 0 ] );
				sorting[sorting.length-1]._idx = 0;
			}
		}
		else if ( sorting.length && sorting[0][0] == colIdx ) {
			// Single column - already sorting on this column, modify the sort
			nextSortIdx = next( sorting[0] );
	
			sorting.length = 1;
			sorting[0][1] = asSorting[ nextSortIdx ];
			sorting[0]._idx = nextSortIdx;
		}
		else {
			// Single column - sort only on this column
			sorting.length = 0;
			sorting.push( [ colIdx, asSorting[0] ] );
			sorting[0]._idx = 0;
		}
	}
	
	
	/**
	 * Set the sorting classes on table's body, Note: it is safe to call this function
	 * when bSort and bSortClasses are false
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnSortingClasses( settings )
	{
		var oldSort = settings.aLastSort;
		var sortClass = settings.oClasses.order.position;
		var sort = _fnSortFlatten( settings );
		var features = settings.oFeatures;
		var i, ien, colIdx;
	
		if ( features.bSort && features.bSortClasses ) {
			// Remove old sorting classes
			for ( i=0, ien=oldSort.length ; i<ien ; i++ ) {
				colIdx = oldSort[i].src;
	
				// Remove column sorting
				$( _pluck( settings.aoData, 'anCells', colIdx ) )
					.removeClass( sortClass + (i<2 ? i+1 : 3) );
			}
	
			// Add new column sorting
			for ( i=0, ien=sort.length ; i<ien ; i++ ) {
				colIdx = sort[i].src;
	
				$( _pluck( settings.aoData, 'anCells', colIdx ) )
					.addClass( sortClass + (i<2 ? i+1 : 3) );
			}
		}
	
		settings.aLastSort = sort;
	}
	
	
	// Get the data to sort a column, be it from cache, fresh (populating the
	// cache), or from a sort formatter
	function _fnSortData( settings, colIdx )
	{
		// Custom sorting function - provided by the sort data type
		var column = settings.aoColumns[ colIdx ];
		var customSort = DataTable.ext.order[ column.sSortDataType ];
		var customData;
	
		if ( customSort ) {
			customData = customSort.call( settings.oInstance, settings, colIdx,
				_fnColumnIndexToVisible( settings, colIdx )
			);
		}
	
		// Use / populate cache
		var row, cellData;
		var formatter = DataTable.ext.type.order[ column.sType+"-pre" ];
		var data = settings.aoData;
	
		for ( var rowIdx=0 ; rowIdx<data.length ; rowIdx++ ) {
			// Sparse array
			if (! data[rowIdx]) {
				continue;
			}
	
			row = data[rowIdx];
	
			if ( ! row._aSortData ) {
				row._aSortData = [];
			}
	
			if ( ! row._aSortData[colIdx] || customSort ) {
				cellData = customSort ?
					customData[rowIdx] : // If there was a custom sort function, use data from there
					_fnGetCellData( settings, rowIdx, colIdx, 'sort' );
	
				row._aSortData[ colIdx ] = formatter ?
					formatter( cellData, settings ) :
					cellData;
			}
		}
	}
	
	
	/**
	 * State information for a table
	 *
	 * @param {*} settings
	 * @returns State object
	 */
	function _fnSaveState ( settings )
	{
		if (settings._bLoadingState) {
			return;
		}
	
		/* Store the interesting variables */
		var state = {
			time:    +new Date(),
			start:   settings._iDisplayStart,
			length:  settings._iDisplayLength,
			order:   $.extend( true, [], settings.aaSorting ),
			search:  $.extend({}, settings.oPreviousSearch),
			columns: settings.aoColumns.map( function ( col, i ) {
				return {
					visible: col.bVisible,
					search: $.extend({}, settings.aoPreSearchCols[i])
				};
			} )
		};
	
		settings.oSavedState = state;
		_fnCallbackFire( settings, "aoStateSaveParams", 'stateSaveParams', [settings, state] );
		
		if ( settings.oFeatures.bStateSave && !settings.bDestroying )
		{
			settings.fnStateSaveCallback.call( settings.oInstance, settings, state );
		}	
	}
	
	
	/**
	 * Attempt to load a saved table state
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} oInit DataTables init object so we can override settings
	 *  @param {function} callback Callback to execute when the state has been loaded
	 *  @memberof DataTable#oApi
	 */
	function _fnLoadState ( settings, init, callback )
	{
		if ( ! settings.oFeatures.bStateSave ) {
			callback();
			return;
		}
	
		var loaded = function(state) {
			_fnImplementState(settings, state, callback);
		}
	
		var state = settings.fnStateLoadCallback.call( settings.oInstance, settings, loaded );
	
		if ( state !== undefined ) {
			_fnImplementState( settings, state, callback );
		}
		// otherwise, wait for the loaded callback to be executed
	
		return true;
	}
	
	function _fnImplementState ( settings, s, callback) {
		var i, ien;
		var columns = settings.aoColumns;
		settings._bLoadingState = true;
	
		// When StateRestore was introduced the state could now be implemented at any time
		// Not just initialisation. To do this an api instance is required in some places
		var api = settings._bInitComplete ? new DataTable.Api(settings) : null;
	
		if ( ! s || ! s.time ) {
			settings._bLoadingState = false;
			callback();
			return;
		}
	
		// Reject old data
		var duration = settings.iStateDuration;
		if ( duration > 0 && s.time < +new Date() - (duration*1000) ) {
			settings._bLoadingState = false;
			callback();
			return;
		}
	
		// Allow custom and plug-in manipulation functions to alter the saved data set and
		// cancelling of loading by returning false
		var abStateLoad = _fnCallbackFire( settings, 'aoStateLoadParams', 'stateLoadParams', [settings, s] );
		if ( abStateLoad.indexOf(false) !== -1 ) {
			settings._bLoadingState = false;
			callback();
			return;
		}
	
		// Number of columns have changed - all bets are off, no restore of settings
		if ( s.columns && columns.length !== s.columns.length ) {
			settings._bLoadingState = false;
			callback();
			return;
		}
	
		// Store the saved state so it might be accessed at any time
		settings.oLoadedState = $.extend( true, {}, s );
	
		// This is needed for ColReorder, which has to happen first to allow all
		// the stored indexes to be usable. It is not publicly documented.
		_fnCallbackFire( settings, null, 'stateLoadInit', [settings, s], true );
	
		// Page Length
		if ( s.length !== undefined ) {
			// If already initialised just set the value directly so that the select element is also updated
			if (api) {
				api.page.len(s.length)
			}
			else {
				settings._iDisplayLength   = s.length;
			}
		}
	
		// Restore key features - todo - for 1.11 this needs to be done by
		// subscribed events
		if ( s.start !== undefined ) {
			if(api === null) {
				settings._iDisplayStart    = s.start;
				settings.iInitDisplayStart = s.start;
			}
			else {
				_fnPageChange(settings, s.start/settings._iDisplayLength);
			}
		}
	
		// Order
		if ( s.order !== undefined ) {
			settings.aaSorting = [];
			$.each( s.order, function ( i, col ) {
				settings.aaSorting.push( col[0] >= columns.length ?
					[ 0, col[1] ] :
					col
				);
			} );
		}
	
		// Search
		if ( s.search !== undefined ) {
			$.extend( settings.oPreviousSearch, s.search );
		}
	
		// Columns
		if ( s.columns ) {
			for ( i=0, ien=s.columns.length ; i<ien ; i++ ) {
				var col = s.columns[i];
	
				// Visibility
				if ( col.visible !== undefined ) {
					// If the api is defined, the table has been initialised so we need to use it rather than internal settings
					if (api) {
						// Don't redraw the columns on every iteration of this loop, we will do this at the end instead
						api.column(i).visible(col.visible, false);
					}
					else {
						columns[i].bVisible = col.visible;
					}
				}
	
				// Search
				if ( col.search !== undefined ) {
					$.extend( settings.aoPreSearchCols[i], col.search );
				}
			}
			
			// If the api is defined then we need to adjust the columns once the visibility has been changed
			if (api) {
				api.columns.adjust();
			}
		}
	
		settings._bLoadingState = false;
		_fnCallbackFire( settings, 'aoStateLoaded', 'stateLoaded', [settings, s] );
		callback();
	}
	
	/**
	 * Log an error message
	 *  @param {object} settings dataTables settings object
	 *  @param {int} level log error messages, or display them to the user
	 *  @param {string} msg error message
	 *  @param {int} tn Technical note id to get more information about the error.
	 *  @memberof DataTable#oApi
	 */
	function _fnLog( settings, level, msg, tn )
	{
		msg = 'DataTables warning: '+
			(settings ? 'table id='+settings.sTableId+' - ' : '')+msg;
	
		if ( tn ) {
			msg += '. For more information about this error, please see '+
			'https://datatables.net/tn/'+tn;
		}
	
		if ( ! level  ) {
			// Backwards compatibility pre 1.10
			var ext = DataTable.ext;
			var type = ext.sErrMode || ext.errMode;
	
			if ( settings ) {
				_fnCallbackFire( settings, null, 'dt-error', [ settings, tn, msg ], true );
			}
	
			if ( type == 'alert' ) {
				alert( msg );
			}
			else if ( type == 'throw' ) {
				throw new Error(msg);
			}
			else if ( typeof type == 'function' ) {
				type( settings, tn, msg );
			}
		}
		else if ( window.console && console.log ) {
			console.log( msg );
		}
	}
	
	
	/**
	 * See if a property is defined on one object, if so assign it to the other object
	 *  @param {object} ret target object
	 *  @param {object} src source object
	 *  @param {string} name property
	 *  @param {string} [mappedName] name to map too - optional, name used if not given
	 *  @memberof DataTable#oApi
	 */
	function _fnMap( ret, src, name, mappedName )
	{
		if ( Array.isArray( name ) ) {
			$.each( name, function (i, val) {
				if ( Array.isArray( val ) ) {
					_fnMap( ret, src, val[0], val[1] );
				}
				else {
					_fnMap( ret, src, val );
				}
			} );
	
			return;
		}
	
		if ( mappedName === undefined ) {
			mappedName = name;
		}
	
		if ( src[name] !== undefined ) {
			ret[mappedName] = src[name];
		}
	}
	
	
	/**
	 * Extend objects - very similar to jQuery.extend, but deep copy objects, and
	 * shallow copy arrays. The reason we need to do this, is that we don't want to
	 * deep copy array init values (such as aaSorting) since the dev wouldn't be
	 * able to override them, but we do want to deep copy arrays.
	 *  @param {object} out Object to extend
	 *  @param {object} extender Object from which the properties will be applied to
	 *      out
	 *  @param {boolean} breakRefs If true, then arrays will be sliced to take an
	 *      independent copy with the exception of the `data` or `aaData` parameters
	 *      if they are present. This is so you can pass in a collection to
	 *      DataTables and have that used as your data source without breaking the
	 *      references
	 *  @returns {object} out Reference, just for convenience - out === the return.
	 *  @memberof DataTable#oApi
	 *  @todo This doesn't take account of arrays inside the deep copied objects.
	 */
	function _fnExtend( out, extender, breakRefs )
	{
		var val;
	
		for ( var prop in extender ) {
			if ( Object.prototype.hasOwnProperty.call(extender, prop) ) {
				val = extender[prop];
	
				if ( $.isPlainObject( val ) ) {
					if ( ! $.isPlainObject( out[prop] ) ) {
						out[prop] = {};
					}
					$.extend( true, out[prop], val );
				}
				else if ( breakRefs && prop !== 'data' && prop !== 'aaData' && Array.isArray(val) ) {
					out[prop] = val.slice();
				}
				else {
					out[prop] = val;
				}
			}
		}
	
		return out;
	}
	
	
	/**
	 * Bind an event handers to allow a click or return key to activate the callback.
	 * This is good for accessibility since a return on the keyboard will have the
	 * same effect as a click, if the element has focus.
	 *  @param {element} n Element to bind the action to
	 *  @param {object|string} selector Selector (for delegated events) or data object
	 *   to pass to the triggered function
	 *  @param {function} fn Callback function for when the event is triggered
	 *  @memberof DataTable#oApi
	 */
	function _fnBindAction( n, selector, fn )
	{
		$(n)
			.on( 'click.DT', selector, function (e) {
				fn(e);
			} )
			.on( 'keypress.DT', selector, function (e){
				if ( e.which === 13 ) {
					e.preventDefault();
					fn(e);
				}
			} )
			.on( 'selectstart.DT', selector, function () {
				// Don't want a double click resulting in text selection
				return false;
			} );
	}
	
	
	/**
	 * Register a callback function. Easily allows a callback function to be added to
	 * an array store of callback functions that can then all be called together.
	 *  @param {object} settings dataTables settings object
	 *  @param {string} store Name of the array storage for the callbacks in oSettings
	 *  @param {function} fn Function to be called back
	 *  @memberof DataTable#oApi
	 */
	function _fnCallbackReg( settings, store, fn )
	{
		if ( fn ) {
			settings[store].push(fn);
		}
	}
	
	
	/**
	 * Fire callback functions and trigger events. Note that the loop over the
	 * callback array store is done backwards! Further note that you do not want to
	 * fire off triggers in time sensitive applications (for example cell creation)
	 * as its slow.
	 *  @param {object} settings dataTables settings object
	 *  @param {string} callbackArr Name of the array storage for the callbacks in
	 *      oSettings
	 *  @param {string} eventName Name of the jQuery custom event to trigger. If
	 *      null no trigger is fired
	 *  @param {array} args Array of arguments to pass to the callback function /
	 *      trigger
	 *  @param {boolean} [bubbles] True if the event should bubble
	 *  @memberof DataTable#oApi
	 */
	function _fnCallbackFire( settings, callbackArr, eventName, args, bubbles )
	{
		var ret = [];
	
		if ( callbackArr ) {
			ret = settings[callbackArr].slice().reverse().map( function (val) {
				return val.apply( settings.oInstance, args );
			} );
		}
	
		if ( eventName !== null) {
			var e = $.Event( eventName+'.dt' );
			var table = $(settings.nTable);
			
			// Expose the DataTables API on the event object for easy access
			e.dt = settings.api;
	
			table[bubbles ?  'trigger' : 'triggerHandler']( e, args );
	
			// If not yet attached to the document, trigger the event
			// on the body directly to sort of simulate the bubble
			if (bubbles && table.parents('body').length === 0) {
				$('body').trigger( e, args );
			}
	
			ret.push( e.result );
		}
	
		return ret;
	}
	
	
	function _fnLengthOverflow ( settings )
	{
		var
			start = settings._iDisplayStart,
			end = settings.fnDisplayEnd(),
			len = settings._iDisplayLength;
	
		/* If we have space to show extra rows (backing up from the end point - then do so */
		if ( start >= end )
		{
			start = end - len;
		}
	
		// Keep the start record on the current page
		start -= (start % len);
	
		if ( len === -1 || start < 0 )
		{
			start = 0;
		}
	
		settings._iDisplayStart = start;
	}
	
	
	function _fnRenderer( settings, type )
	{
		var renderer = settings.renderer;
		var host = DataTable.ext.renderer[type];
	
		if ( $.isPlainObject( renderer ) && renderer[type] ) {
			// Specific renderer for this type. If available use it, otherwise use
			// the default.
			return host[renderer[type]] || host._;
		}
		else if ( typeof renderer === 'string' ) {
			// Common renderer - if there is one available for this type use it,
			// otherwise use the default
			return host[renderer] || host._;
		}
	
		// Use the default
		return host._;
	}
	
	
	/**
	 * Detect the data source being used for the table. Used to simplify the code
	 * a little (ajax) and to make it compress a little smaller.
	 *
	 *  @param {object} settings dataTables settings object
	 *  @returns {string} Data source
	 *  @memberof DataTable#oApi
	 */
	function _fnDataSource ( settings )
	{
		if ( settings.oFeatures.bServerSide ) {
			return 'ssp';
		}
		else if ( settings.ajax ) {
			return 'ajax';
		}
		return 'dom';
	}
	
	/**
	 * Common replacement for language strings
	 *
	 * @param {*} settings DT settings object
	 * @param {*} str String with values to replace
	 * @param {*} entries Plural number for _ENTRIES_ - can be undefined
	 * @returns String
	 */
	function _fnMacros ( settings, str, entries )
	{
		// When infinite scrolling, we are always starting at 1. _iDisplayStart is
		// used only internally
		var
			formatter  = settings.fnFormatNumber,
			start      = settings._iDisplayStart+1,
			len        = settings._iDisplayLength,
			vis        = settings.fnRecordsDisplay(),
			max        = settings.fnRecordsTotal(),
			all        = len === -1;
	
		return str.
			replace(/_START_/g, formatter.call( settings, start ) ).
			replace(/_END_/g,   formatter.call( settings, settings.fnDisplayEnd() ) ).
			replace(/_MAX_/g,   formatter.call( settings, max ) ).
			replace(/_TOTAL_/g, formatter.call( settings, vis ) ).
			replace(/_PAGE_/g,  formatter.call( settings, all ? 1 : Math.ceil( start / len ) ) ).
			replace(/_PAGES_/g, formatter.call( settings, all ? 1 : Math.ceil( vis / len ) ) ).
			replace(/_ENTRIES_/g, settings.api.i18n('entries', '', entries) ).
			replace(/_ENTRIES-MAX_/g, settings.api.i18n('entries', '', max) ).
			replace(/_ENTRIES-TOTAL_/g, settings.api.i18n('entries', '', vis) );
	}
	
	
	
	/**
	 * Computed structure of the DataTables API, defined by the options passed to
	 * `DataTable.Api.register()` when building the API.
	 *
	 * The structure is built in order to speed creation and extension of the Api
	 * objects since the extensions are effectively pre-parsed.
	 *
	 * The array is an array of objects with the following structure, where this
	 * base array represents the Api prototype base:
	 *
	 *     [
	 *       {
	 *         name:      'data'                -- string   - Property name
	 *         val:       function () {},       -- function - Api method (or undefined if just an object
	 *         methodExt: [ ... ],              -- array    - Array of Api object definitions to extend the method result
	 *         propExt:   [ ... ]               -- array    - Array of Api object definitions to extend the property
	 *       },
	 *       {
	 *         name:     'row'
	 *         val:       {},
	 *         methodExt: [ ... ],
	 *         propExt:   [
	 *           {
	 *             name:      'data'
	 *             val:       function () {},
	 *             methodExt: [ ... ],
	 *             propExt:   [ ... ]
	 *           },
	 *           ...
	 *         ]
	 *       }
	 *     ]
	 *
	 * @type {Array}
	 * @ignore
	 */
	var __apiStruct = [];
	
	
	/**
	 * `Array.prototype` reference.
	 *
	 * @type object
	 * @ignore
	 */
	var __arrayProto = Array.prototype;
	
	
	/**
	 * Abstraction for `context` parameter of the `Api` constructor to allow it to
	 * take several different forms for ease of use.
	 *
	 * Each of the input parameter types will be converted to a DataTables settings
	 * object where possible.
	 *
	 * @param  {string|node|jQuery|object} mixed DataTable identifier. Can be one
	 *   of:
	 *
	 *   * `string` - jQuery selector. Any DataTables' matching the given selector
	 *     with be found and used.
	 *   * `node` - `TABLE` node which has already been formed into a DataTable.
	 *   * `jQuery` - A jQuery object of `TABLE` nodes.
	 *   * `object` - DataTables settings object
	 *   * `DataTables.Api` - API instance
	 * @return {array|null} Matching DataTables settings objects. `null` or
	 *   `undefined` is returned if no matching DataTable is found.
	 * @ignore
	 */
	var _toSettings = function ( mixed )
	{
		var idx, jq;
		var settings = DataTable.settings;
		var tables = _pluck(settings, 'nTable');
	
		if ( ! mixed ) {
			return [];
		}
		else if ( mixed.nTable && mixed.oFeatures ) {
			// DataTables settings object
			return [ mixed ];
		}
		else if ( mixed.nodeName && mixed.nodeName.toLowerCase() === 'table' ) {
			// Table node
			idx = tables.indexOf(mixed);
			return idx !== -1 ? [ settings[idx] ] : null;
		}
		else if ( mixed && typeof mixed.settings === 'function' ) {
			return mixed.settings().toArray();
		}
		else if ( typeof mixed === 'string' ) {
			// jQuery selector
			jq = $(mixed).get();
		}
		else if ( mixed instanceof $ ) {
			// jQuery object (also DataTables instance)
			jq = mixed.get();
		}
	
		if ( jq ) {
			return settings.filter(function (v, idx) {
				return jq.includes(tables[idx]);
			});
		}
	};
	
	
	/**
	 * DataTables API class - used to control and interface with  one or more
	 * DataTables enhanced tables.
	 *
	 * The API class is heavily based on jQuery, presenting a chainable interface
	 * that you can use to interact with tables. Each instance of the API class has
	 * a "context" - i.e. the tables that it will operate on. This could be a single
	 * table, all tables on a page or a sub-set thereof.
	 *
	 * Additionally the API is designed to allow you to easily work with the data in
	 * the tables, retrieving and manipulating it as required. This is done by
	 * presenting the API class as an array like interface. The contents of the
	 * array depend upon the actions requested by each method (for example
	 * `rows().nodes()` will return an array of nodes, while `rows().data()` will
	 * return an array of objects or arrays depending upon your table's
	 * configuration). The API object has a number of array like methods (`push`,
	 * `pop`, `reverse` etc) as well as additional helper methods (`each`, `pluck`,
	 * `unique` etc) to assist your working with the data held in a table.
	 *
	 * Most methods (those which return an Api instance) are chainable, which means
	 * the return from a method call also has all of the methods available that the
	 * top level object had. For example, these two calls are equivalent:
	 *
	 *     // Not chained
	 *     api.row.add( {...} );
	 *     api.draw();
	 *
	 *     // Chained
	 *     api.row.add( {...} ).draw();
	 *
	 * @class DataTable.Api
	 * @param {array|object|string|jQuery} context DataTable identifier. This is
	 *   used to define which DataTables enhanced tables this API will operate on.
	 *   Can be one of:
	 *
	 *   * `string` - jQuery selector. Any DataTables' matching the given selector
	 *     with be found and used.
	 *   * `node` - `TABLE` node which has already been formed into a DataTable.
	 *   * `jQuery` - A jQuery object of `TABLE` nodes.
	 *   * `object` - DataTables settings object
	 * @param {array} [data] Data to initialise the Api instance with.
	 *
	 * @example
	 *   // Direct initialisation during DataTables construction
	 *   var api = $('#example').DataTable();
	 *
	 * @example
	 *   // Initialisation using a DataTables jQuery object
	 *   var api = $('#example').dataTable().api();
	 *
	 * @example
	 *   // Initialisation as a constructor
	 *   var api = new DataTable.Api( 'table.dataTable' );
	 */
	_Api = function ( context, data )
	{
		if ( ! (this instanceof _Api) ) {
			return new _Api( context, data );
		}
	
		var settings = [];
		var ctxSettings = function ( o ) {
			var a = _toSettings( o );
			if ( a ) {
				settings.push.apply( settings, a );
			}
		};
	
		if ( Array.isArray( context ) ) {
			for ( var i=0, ien=context.length ; i<ien ; i++ ) {
				ctxSettings( context[i] );
			}
		}
		else {
			ctxSettings( context );
		}
	
		// Remove duplicates
		this.context = settings.length > 1
			? _unique( settings )
			: settings;
	
		// Initial data
		if ( data ) {
			this.push.apply(this, data);
		}
	
		// selector
		this.selector = {
			rows: null,
			cols: null,
			opts: null
		};
	
		_Api.extend( this, this, __apiStruct );
	};
	
	DataTable.Api = _Api;
	
	// Don't destroy the existing prototype, just extend it. Required for jQuery 2's
	// isPlainObject.
	$.extend( _Api.prototype, {
		any: function ()
		{
			return this.count() !== 0;
		},
	
		context: [], // array of table settings objects
	
		count: function ()
		{
			return this.flatten().length;
		},
	
		each: function ( fn )
		{
			for ( var i=0, ien=this.length ; i<ien; i++ ) {
				fn.call( this, this[i], i, this );
			}
	
			return this;
		},
	
		eq: function ( idx )
		{
			var ctx = this.context;
	
			return ctx.length > idx ?
				new _Api( ctx[idx], this[idx] ) :
				null;
		},
	
		filter: function ( fn )
		{
			var a = __arrayProto.filter.call( this, fn, this );
	
			return new _Api( this.context, a );
		},
	
		flatten: function ()
		{
			var a = [];
	
			return new _Api( this.context, a.concat.apply( a, this.toArray() ) );
		},
	
		get: function ( idx )
		{
			return this[ idx ];
		},
	
		join:    __arrayProto.join,
	
		includes: function ( find ) {
			return this.indexOf( find ) === -1 ? false : true;
		},
	
		indexOf: __arrayProto.indexOf,
	
		iterator: function ( flatten, type, fn, alwaysNew ) {
			var
				a = [], ret,
				i, ien, j, jen,
				context = this.context,
				rows, items, item,
				selector = this.selector;
	
			// Argument shifting
			if ( typeof flatten === 'string' ) {
				alwaysNew = fn;
				fn = type;
				type = flatten;
				flatten = false;
			}
	
			for ( i=0, ien=context.length ; i<ien ; i++ ) {
				var apiInst = new _Api( context[i] );
	
				if ( type === 'table' ) {
					ret = fn.call( apiInst, context[i], i );
	
					if ( ret !== undefined ) {
						a.push( ret );
					}
				}
				else if ( type === 'columns' || type === 'rows' ) {
					// this has same length as context - one entry for each table
					ret = fn.call( apiInst, context[i], this[i], i );
	
					if ( ret !== undefined ) {
						a.push( ret );
					}
				}
				else if ( type === 'every' || type === 'column' || type === 'column-rows' || type === 'row' || type === 'cell' ) {
					// columns and rows share the same structure.
					// 'this' is an array of column indexes for each context
					items = this[i];
	
					if ( type === 'column-rows' ) {
						rows = _selector_row_indexes( context[i], selector.opts );
					}
	
					for ( j=0, jen=items.length ; j<jen ; j++ ) {
						item = items[j];
	
						if ( type === 'cell' ) {
							ret = fn.call( apiInst, context[i], item.row, item.column, i, j );
						}
						else {
							ret = fn.call( apiInst, context[i], item, i, j, rows );
						}
	
						if ( ret !== undefined ) {
							a.push( ret );
						}
					}
				}
			}
	
			if ( a.length || alwaysNew ) {
				var api = new _Api( context, flatten ? a.concat.apply( [], a ) : a );
				var apiSelector = api.selector;
				apiSelector.rows = selector.rows;
				apiSelector.cols = selector.cols;
				apiSelector.opts = selector.opts;
				return api;
			}
			return this;
		},
	
		lastIndexOf: __arrayProto.lastIndexOf,
	
		length:  0,
	
		map: function ( fn )
		{
			var a = __arrayProto.map.call( this, fn, this );
	
			return new _Api( this.context, a );
		},
	
		pluck: function ( prop )
		{
			var fn = DataTable.util.get(prop);
	
			return this.map( function ( el ) {
				return fn(el);
			} );
		},
	
		pop:     __arrayProto.pop,
	
		push:    __arrayProto.push,
	
		reduce: __arrayProto.reduce,
	
		reduceRight: __arrayProto.reduceRight,
	
		reverse: __arrayProto.reverse,
	
		// Object with rows, columns and opts
		selector: null,
	
		shift:   __arrayProto.shift,
	
		slice: function () {
			return new _Api( this.context, this );
		},
	
		sort:    __arrayProto.sort,
	
		splice:  __arrayProto.splice,
	
		toArray: function ()
		{
			return __arrayProto.slice.call( this );
		},
	
		to$: function ()
		{
			return $( this );
		},
	
		toJQuery: function ()
		{
			return $( this );
		},
	
		unique: function ()
		{
			return new _Api( this.context, _unique(this.toArray()) );
		},
	
		unshift: __arrayProto.unshift
	} );
	
	
	function _api_scope( scope, fn, struc ) {
		return function () {
			var ret = fn.apply( scope || this, arguments );
	
			// Method extension
			_Api.extend( ret, ret, struc.methodExt );
			return ret;
		};
	}
	
	function _api_find( src, name ) {
		for ( var i=0, ien=src.length ; i<ien ; i++ ) {
			if ( src[i].name === name ) {
				return src[i];
			}
		}
		return null;
	}
	
	window.__apiStruct = __apiStruct;
	
	_Api.extend = function ( scope, obj, ext )
	{
		// Only extend API instances and static properties of the API
		if ( ! ext.length || ! obj || ( ! (obj instanceof _Api) && ! obj.__dt_wrapper ) ) {
			return;
		}
	
		var
			i, ien,
			struct;
	
		for ( i=0, ien=ext.length ; i<ien ; i++ ) {
			struct = ext[i];
	
			// Value
			obj[ struct.name ] = struct.type === 'function' ?
				_api_scope( scope, struct.val, struct ) :
				struct.type === 'object' ?
					{} :
					struct.val;
	
			obj[ struct.name ].__dt_wrapper = true;
	
			// Property extension
			_Api.extend( scope, obj[ struct.name ], struct.propExt );
		}
	};
	
	//     [
	//       {
	//         name:      'data'                -- string   - Property name
	//         val:       function () {},       -- function - Api method (or undefined if just an object
	//         methodExt: [ ... ],              -- array    - Array of Api object definitions to extend the method result
	//         propExt:   [ ... ]               -- array    - Array of Api object definitions to extend the property
	//       },
	//       {
	//         name:     'row'
	//         val:       {},
	//         methodExt: [ ... ],
	//         propExt:   [
	//           {
	//             name:      'data'
	//             val:       function () {},
	//             methodExt: [ ... ],
	//             propExt:   [ ... ]
	//           },
	//           ...
	//         ]
	//       }
	//     ]
	
	
	_Api.register = _api_register = function ( name, val )
	{
		if ( Array.isArray( name ) ) {
			for ( var j=0, jen=name.length ; j<jen ; j++ ) {
				_Api.register( name[j], val );
			}
			return;
		}
	
		var
			i, ien,
			heir = name.split('.'),
			struct = __apiStruct,
			key, method;
	
		for ( i=0, ien=heir.length ; i<ien ; i++ ) {
			method = heir[i].indexOf('()') !== -1;
			key = method ?
				heir[i].replace('()', '') :
				heir[i];
	
			var src = _api_find( struct, key );
			if ( ! src ) {
				src = {
					name:      key,
					val:       {},
					methodExt: [],
					propExt:   [],
					type:      'object'
				};
				struct.push( src );
			}
	
			if ( i === ien-1 ) {
				src.val = val;
				src.type = typeof val === 'function' ?
					'function' :
					$.isPlainObject( val ) ?
						'object' :
						'other';
			}
			else {
				struct = method ?
					src.methodExt :
					src.propExt;
			}
		}
	};
	
	_Api.registerPlural = _api_registerPlural = function ( pluralName, singularName, val ) {
		_Api.register( pluralName, val );
	
		_Api.register( singularName, function () {
			var ret = val.apply( this, arguments );
	
			if ( ret === this ) {
				// Returned item is the API instance that was passed in, return it
				return this;
			}
			else if ( ret instanceof _Api ) {
				// New API instance returned, want the value from the first item
				// in the returned array for the singular result.
				return ret.length ?
					Array.isArray( ret[0] ) ?
						new _Api( ret.context, ret[0] ) : // Array results are 'enhanced'
						ret[0] :
					undefined;
			}
	
			// Non-API return - just fire it back
			return ret;
		} );
	};
	
	
	/**
	 * Selector for HTML tables. Apply the given selector to the give array of
	 * DataTables settings objects.
	 *
	 * @param {string|integer} [selector] jQuery selector string or integer
	 * @param  {array} Array of DataTables settings objects to be filtered
	 * @return {array}
	 * @ignore
	 */
	var __table_selector = function ( selector, a )
	{
		if ( Array.isArray(selector) ) {
			var result = [];
	
			selector.forEach(function (sel) {
				var inner = __table_selector(sel, a);
	
				result.push.apply(result, inner);
			});
	
			return result.filter( function (item) {
				return item;
			});
		}
	
		// Integer is used to pick out a table by index
		if ( typeof selector === 'number' ) {
			return [ a[ selector ] ];
		}
	
		// Perform a jQuery selector on the table nodes
		var nodes = a.map( function (el) {
			return el.nTable;
		} );
	
		return $(nodes)
			.filter( selector )
			.map( function () {
				// Need to translate back from the table node to the settings
				var idx = nodes.indexOf(this);
				return a[ idx ];
			} )
			.toArray();
	};
	
	
	
	/**
	 * Context selector for the API's context (i.e. the tables the API instance
	 * refers to.
	 *
	 * @name    DataTable.Api#tables
	 * @param {string|integer} [selector] Selector to pick which tables the iterator
	 *   should operate on. If not given, all tables in the current context are
	 *   used. This can be given as a jQuery selector (for example `':gt(0)'`) to
	 *   select multiple tables or as an integer to select a single table.
	 * @returns {DataTable.Api} Returns a new API instance if a selector is given.
	 */
	_api_register( 'tables()', function ( selector ) {
		// A new instance is created if there was a selector specified
		return selector !== undefined && selector !== null ?
			new _Api( __table_selector( selector, this.context ) ) :
			this;
	} );
	
	
	_api_register( 'table()', function ( selector ) {
		var tables = this.tables( selector );
		var ctx = tables.context;
	
		// Truncate to the first matched table
		return ctx.length ?
			new _Api( ctx[0] ) :
			tables;
	} );
	
	// Common methods, combined to reduce size
	[
		['nodes', 'node', 'nTable'],
		['body', 'body', 'nTBody'],
		['header', 'header', 'nTHead'],
		['footer', 'footer', 'nTFoot'],
	].forEach(function (item) {
		_api_registerPlural(
			'tables().' + item[0] + '()',
			'table().' + item[1] + '()' ,
			function () {
				return this.iterator( 'table', function ( ctx ) {
					return ctx[item[2]];
				}, 1 );
			}
		);
	});
	
	// Structure methods
	[
		['header', 'aoHeader'],
		['footer', 'aoFooter'],
	].forEach(function (item) {
		_api_register( 'table().' + item[0] + '.structure()' , function (selector) {
			var indexes = this.columns(selector).indexes().flatten();
			var ctx = this.context[0];
			
			return _fnHeaderLayout(ctx, ctx[item[1]], indexes);
		} );
	})
	
	
	_api_registerPlural( 'tables().containers()', 'table().container()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTableWrapper;
		}, 1 );
	} );
	
	_api_register( 'tables().every()', function ( fn ) {
		var that = this;
	
		return this.iterator('table', function (s, i) {
			fn.call(that.table(i), i);
		});
	});
	
	_api_register( 'caption()', function ( value, side ) {
		var context = this.context;
	
		// Getter - return existing node's content
		if ( value === undefined ) {
			var caption = context[0].captionNode;
	
			return caption && context.length ?
				caption.innerHTML : 
				null;
		}
	
		return this.iterator( 'table', function ( ctx ) {
			var table = $(ctx.nTable);
			var caption = $(ctx.captionNode);
			var container = $(ctx.nTableWrapper);
	
			// Create the node if it doesn't exist yet
			if ( ! caption.length ) {
				caption = $('<caption/>').html( value );
				ctx.captionNode = caption[0];
	
				// If side isn't set, we need to insert into the document to let the
				// CSS decide so we can read it back, otherwise there is no way to
				// know if the CSS would put it top or bottom for scrolling
				if (! side) {
					table.prepend(caption);
	
					side = caption.css('caption-side');
				}
			}
	
			caption.html( value );
	
			if ( side ) {
				caption.css( 'caption-side', side );
				caption[0]._captionSide = side;
			}
	
			if (container.find('div.dataTables_scroll').length) {
				var selector = (side === 'top' ? 'Head' : 'Foot');
	
				container.find('div.dataTables_scroll'+ selector +' table').prepend(caption);
			}
			else {
				table.prepend(caption);
			}
		}, 1 );
	} );
	
	_api_register( 'caption.node()', function () {
		var ctx = this.context;
	
		return ctx.length ? ctx[0].captionNode : null;
	} );
	
	
	/**
	 * Redraw the tables in the current context.
	 */
	_api_register( 'draw()', function ( paging ) {
		return this.iterator( 'table', function ( settings ) {
			if ( paging === 'page' ) {
				_fnDraw( settings );
			}
			else {
				if ( typeof paging === 'string' ) {
					paging = paging === 'full-hold' ?
						false :
						true;
				}
	
				_fnReDraw( settings, paging===false );
			}
		} );
	} );
	
	
	
	/**
	 * Get the current page index.
	 *
	 * @return {integer} Current page index (zero based)
	 *//**
	 * Set the current page.
	 *
	 * Note that if you attempt to show a page which does not exist, DataTables will
	 * not throw an error, but rather reset the paging.
	 *
	 * @param {integer|string} action The paging action to take. This can be one of:
	 *  * `integer` - The page index to jump to
	 *  * `string` - An action to take:
	 *    * `first` - Jump to first page.
	 *    * `next` - Jump to the next page
	 *    * `previous` - Jump to previous page
	 *    * `last` - Jump to the last page.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'page()', function ( action ) {
		if ( action === undefined ) {
			return this.page.info().page; // not an expensive call
		}
	
		// else, have an action to take on all tables
		return this.iterator( 'table', function ( settings ) {
			_fnPageChange( settings, action );
		} );
	} );
	
	
	/**
	 * Paging information for the first table in the current context.
	 *
	 * If you require paging information for another table, use the `table()` method
	 * with a suitable selector.
	 *
	 * @return {object} Object with the following properties set:
	 *  * `page` - Current page index (zero based - i.e. the first page is `0`)
	 *  * `pages` - Total number of pages
	 *  * `start` - Display index for the first record shown on the current page
	 *  * `end` - Display index for the last record shown on the current page
	 *  * `length` - Display length (number of records). Note that generally `start
	 *    + length = end`, but this is not always true, for example if there are
	 *    only 2 records to show on the final page, with a length of 10.
	 *  * `recordsTotal` - Full data set length
	 *  * `recordsDisplay` - Data set length once the current filtering criterion
	 *    are applied.
	 */
	_api_register( 'page.info()', function () {
		if ( this.context.length === 0 ) {
			return undefined;
		}
	
		var
			settings   = this.context[0],
			start      = settings._iDisplayStart,
			len        = settings.oFeatures.bPaginate ? settings._iDisplayLength : -1,
			visRecords = settings.fnRecordsDisplay(),
			all        = len === -1;
	
		return {
			"page":           all ? 0 : Math.floor( start / len ),
			"pages":          all ? 1 : Math.ceil( visRecords / len ),
			"start":          start,
			"end":            settings.fnDisplayEnd(),
			"length":         len,
			"recordsTotal":   settings.fnRecordsTotal(),
			"recordsDisplay": visRecords,
			"serverSide":     _fnDataSource( settings ) === 'ssp'
		};
	} );
	
	
	/**
	 * Get the current page length.
	 *
	 * @return {integer} Current page length. Note `-1` indicates that all records
	 *   are to be shown.
	 *//**
	 * Set the current page length.
	 *
	 * @param {integer} Page length to set. Use `-1` to show all records.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'page.len()', function ( len ) {
		// Note that we can't call this function 'length()' because `length`
		// is a Javascript property of functions which defines how many arguments
		// the function expects.
		if ( len === undefined ) {
			return this.context.length !== 0 ?
				this.context[0]._iDisplayLength :
				undefined;
		}
	
		// else, set the page length
		return this.iterator( 'table', function ( settings ) {
			_fnLengthChange( settings, len );
		} );
	} );
	
	
	
	var __reload = function ( settings, holdPosition, callback ) {
		// Use the draw event to trigger a callback
		if ( callback ) {
			var api = new _Api( settings );
	
			api.one( 'draw', function () {
				callback( api.ajax.json() );
			} );
		}
	
		if ( _fnDataSource( settings ) == 'ssp' ) {
			_fnReDraw( settings, holdPosition );
		}
		else {
			_fnProcessingDisplay( settings, true );
	
			// Cancel an existing request
			var xhr = settings.jqXHR;
			if ( xhr && xhr.readyState !== 4 ) {
				xhr.abort();
			}
	
			// Trigger xhr
			_fnBuildAjax( settings, {}, function( json ) {
				_fnClearTable( settings );
	
				var data = _fnAjaxDataSrc( settings, json );
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					_fnAddData( settings, data[i] );
				}
	
				_fnReDraw( settings, holdPosition );
				_fnInitComplete( settings );
				_fnProcessingDisplay( settings, false );
			} );
		}
	};
	
	
	/**
	 * Get the JSON response from the last Ajax request that DataTables made to the
	 * server. Note that this returns the JSON from the first table in the current
	 * context.
	 *
	 * @return {object} JSON received from the server.
	 */
	_api_register( 'ajax.json()', function () {
		var ctx = this.context;
	
		if ( ctx.length > 0 ) {
			return ctx[0].json;
		}
	
		// else return undefined;
	} );
	
	
	/**
	 * Get the data submitted in the last Ajax request
	 */
	_api_register( 'ajax.params()', function () {
		var ctx = this.context;
	
		if ( ctx.length > 0 ) {
			return ctx[0].oAjaxData;
		}
	
		// else return undefined;
	} );
	
	
	/**
	 * Reload tables from the Ajax data source. Note that this function will
	 * automatically re-draw the table when the remote data has been loaded.
	 *
	 * @param {boolean} [reset=true] Reset (default) or hold the current paging
	 *   position. A full re-sort and re-filter is performed when this method is
	 *   called, which is why the pagination reset is the default action.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.reload()', function ( callback, resetPaging ) {
		return this.iterator( 'table', function (settings) {
			__reload( settings, resetPaging===false, callback );
		} );
	} );
	
	
	/**
	 * Get the current Ajax URL. Note that this returns the URL from the first
	 * table in the current context.
	 *
	 * @return {string} Current Ajax source URL
	 *//**
	 * Set the Ajax URL. Note that this will set the URL for all tables in the
	 * current context.
	 *
	 * @param {string} url URL to set.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.url()', function ( url ) {
		var ctx = this.context;
	
		if ( url === undefined ) {
			// get
			if ( ctx.length === 0 ) {
				return undefined;
			}
			ctx = ctx[0];
	
			return $.isPlainObject( ctx.ajax ) ?
				ctx.ajax.url :
				ctx.ajax;
		}
	
		// set
		return this.iterator( 'table', function ( settings ) {
			if ( $.isPlainObject( settings.ajax ) ) {
				settings.ajax.url = url;
			}
			else {
				settings.ajax = url;
			}
		} );
	} );
	
	
	/**
	 * Load data from the newly set Ajax URL. Note that this method is only
	 * available when `ajax.url()` is used to set a URL. Additionally, this method
	 * has the same effect as calling `ajax.reload()` but is provided for
	 * convenience when setting a new URL. Like `ajax.reload()` it will
	 * automatically redraw the table once the remote data has been loaded.
	 *
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.url().load()', function ( callback, resetPaging ) {
		// Same as a reload, but makes sense to present it for easy access after a
		// url change
		return this.iterator( 'table', function ( ctx ) {
			__reload( ctx, resetPaging===false, callback );
		} );
	} );
	
	
	
	
	var _selector_run = function ( type, selector, selectFn, settings, opts )
	{
		var
			out = [], res,
			a, i, ien, j, jen,
			selectorType = typeof selector;
	
		// Can't just check for isArray here, as an API or jQuery instance might be
		// given with their array like look
		if ( ! selector || selectorType === 'string' || selectorType === 'function' || selector.length === undefined ) {
			selector = [ selector ];
		}
	
		for ( i=0, ien=selector.length ; i<ien ; i++ ) {
			// Only split on simple strings - complex expressions will be jQuery selectors
			a = selector[i] && selector[i].split && ! selector[i].match(/[[(:]/) ?
				selector[i].split(',') :
				[ selector[i] ];
	
			for ( j=0, jen=a.length ; j<jen ; j++ ) {
				res = selectFn( typeof a[j] === 'string' ? (a[j]).trim() : a[j] );
	
				// Remove empty items
				res = res.filter( function (item) {
					return item !== null && item !== undefined;
				});
	
				if ( res && res.length ) {
					out = out.concat( res );
				}
			}
		}
	
		// selector extensions
		var ext = _ext.selector[ type ];
		if ( ext.length ) {
			for ( i=0, ien=ext.length ; i<ien ; i++ ) {
				out = ext[i]( settings, opts, out );
			}
		}
	
		return _unique( out );
	};
	
	
	var _selector_opts = function ( opts )
	{
		if ( ! opts ) {
			opts = {};
		}
	
		// Backwards compatibility for 1.9- which used the terminology filter rather
		// than search
		if ( opts.filter && opts.search === undefined ) {
			opts.search = opts.filter;
		}
	
		return $.extend( {
			search: 'none',
			order: 'current',
			page: 'all'
		}, opts );
	};
	
	
	// Reduce the API instance to the first item found
	var _selector_first = function ( old )
	{
		let inst = new _Api(old.context[0]);
	
		// Use a push rather than passing to the constructor, since it will
		// merge arrays down automatically, which isn't what is wanted here
		if (old.length) {
			inst.push( old[0] );
		}
	
		inst.selector = old.selector;
	
		// Limit to a single row / column / cell
		if (inst.length && inst[0].length > 1) {
			inst[0].splice(1);
		}
	
		return inst;
	};
	
	
	var _selector_row_indexes = function ( settings, opts )
	{
		var
			i, ien, tmp, a=[],
			displayFiltered = settings.aiDisplay,
			displayMaster = settings.aiDisplayMaster;
	
		var
			search = opts.search,  // none, applied, removed
			order  = opts.order,   // applied, current, index (original - compatibility with 1.9)
			page   = opts.page;    // all, current
	
		if ( _fnDataSource( settings ) == 'ssp' ) {
			// In server-side processing mode, most options are irrelevant since
			// rows not shown don't exist and the index order is the applied order
			// Removed is a special case - for consistency just return an empty
			// array
			return search === 'removed' ?
				[] :
				_range( 0, displayMaster.length );
		}
		else if ( page == 'current' ) {
			// Current page implies that order=current and filter=applied, since it is
			// fairly senseless otherwise, regardless of what order and search actually
			// are
			for ( i=settings._iDisplayStart, ien=settings.fnDisplayEnd() ; i<ien ; i++ ) {
				a.push( displayFiltered[i] );
			}
		}
		else if ( order == 'current' || order == 'applied' ) {
			if ( search == 'none') {
				a = displayMaster.slice();
			}
			else if ( search == 'applied' ) {
				a = displayFiltered.slice();
			}
			else if ( search == 'removed' ) {
				// O(n+m) solution by creating a hash map
				var displayFilteredMap = {};
	
				for ( i=0, ien=displayFiltered.length ; i<ien ; i++ ) {
					displayFilteredMap[displayFiltered[i]] = null;
				}
	
				displayMaster.forEach(function (item) {
					if (! Object.prototype.hasOwnProperty.call(displayFilteredMap, item)) {
						a.push(item);
					}
				});
			}
		}
		else if ( order == 'index' || order == 'original' ) {
			for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
				if (! settings.aoData[i]) {
					continue;
				}
	
				if ( search == 'none' ) {
					a.push( i );
				}
				else { // applied | removed
					tmp = displayFiltered.indexOf(i);
	
					if ((tmp === -1 && search == 'removed') ||
						(tmp >= 0   && search == 'applied') )
					{
						a.push( i );
					}
				}
			}
		}
		else if ( typeof order === 'number' ) {
			// Order the rows by the given column
			var ordered = _fnSort(settings, order, 'asc');
	
			if (search === 'none') {
				a = ordered;
			}
			else { // applied | removed
				for (i=0; i<ordered.length; i++) {
					tmp = displayFiltered.indexOf(ordered[i]);
	
					if ((tmp === -1 && search == 'removed') ||
						(tmp >= 0   && search == 'applied') )
					{
						a.push( ordered[i] );
					}
				}
			}
		}
	
		return a;
	};
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Rows
	 *
	 * {}          - no selector - use all available rows
	 * {integer}   - row aoData index
	 * {node}      - TR node
	 * {string}    - jQuery selector to apply to the TR elements
	 * {array}     - jQuery array of nodes, or simply an array of TR nodes
	 *
	 */
	var __row_selector = function ( settings, selector, opts )
	{
		var rows;
		var run = function ( sel ) {
			var selInt = _intVal( sel );
			var aoData = settings.aoData;
	
			// Short cut - selector is a number and no options provided (default is
			// all records, so no need to check if the index is in there, since it
			// must be - dev error if the index doesn't exist).
			if ( selInt !== null && ! opts ) {
				return [ selInt ];
			}
	
			if ( ! rows ) {
				rows = _selector_row_indexes( settings, opts );
			}
	
			if ( selInt !== null && rows.indexOf(selInt) !== -1 ) {
				// Selector - integer
				return [ selInt ];
			}
			else if ( sel === null || sel === undefined || sel === '' ) {
				// Selector - none
				return rows;
			}
	
			// Selector - function
			if ( typeof sel === 'function' ) {
				return rows.map( function (idx) {
					var row = aoData[ idx ];
					return sel( idx, row._aData, row.nTr ) ? idx : null;
				} );
			}
	
			// Selector - node
			if ( sel.nodeName ) {
				var rowIdx = sel._DT_RowIndex;  // Property added by DT for fast lookup
				var cellIdx = sel._DT_CellIndex;
	
				if ( rowIdx !== undefined ) {
					// Make sure that the row is actually still present in the table
					return aoData[ rowIdx ] && aoData[ rowIdx ].nTr === sel ?
						[ rowIdx ] :
						[];
				}
				else if ( cellIdx ) {
					return aoData[ cellIdx.row ] && aoData[ cellIdx.row ].nTr === sel.parentNode ?
						[ cellIdx.row ] :
						[];
				}
				else {
					var host = $(sel).closest('*[data-dt-row]');
					return host.length ?
						[ host.data('dt-row') ] :
						[];
				}
			}
	
			// ID selector. Want to always be able to select rows by id, regardless
			// of if the tr element has been created or not, so can't rely upon
			// jQuery here - hence a custom implementation. This does not match
			// Sizzle's fast selector or HTML4 - in HTML5 the ID can be anything,
			// but to select it using a CSS selector engine (like Sizzle or
			// querySelect) it would need to need to be escaped for some characters.
			// DataTables simplifies this for row selectors since you can select
			// only a row. A # indicates an id any anything that follows is the id -
			// unescaped.
			if ( typeof sel === 'string' && sel.charAt(0) === '#' ) {
				// get row index from id
				var rowObj = settings.aIds[ sel.replace( /^#/, '' ) ];
				if ( rowObj !== undefined ) {
					return [ rowObj.idx ];
				}
	
				// need to fall through to jQuery in case there is DOM id that
				// matches
			}
			
			// Get nodes in the order from the `rows` array with null values removed
			var nodes = _removeEmpty(
				_pluck_order( settings.aoData, rows, 'nTr' )
			);
	
			// Selector - jQuery selector string, array of nodes or jQuery object/
			// As jQuery's .filter() allows jQuery objects to be passed in filter,
			// it also allows arrays, so this will cope with all three options
			return $(nodes)
				.filter( sel )
				.map( function () {
					return this._DT_RowIndex;
				} )
				.toArray();
		};
	
		var matched = _selector_run( 'row', selector, run, settings, opts );
	
		if (opts.order === 'current' || opts.order === 'applied') {
			var master = settings.aiDisplayMaster;
	
			matched.sort(function(a, b) {  
				return master.indexOf(a) - master.indexOf(b);
			});
		}
	
		return matched;
	};
	
	
	_api_register( 'rows()', function ( selector, opts ) {
		// argument shifting
		if ( selector === undefined ) {
			selector = '';
		}
		else if ( $.isPlainObject( selector ) ) {
			opts = selector;
			selector = '';
		}
	
		opts = _selector_opts( opts );
	
		var inst = this.iterator( 'table', function ( settings ) {
			return __row_selector( settings, selector, opts );
		}, 1 );
	
		// Want argument shifting here and in __row_selector?
		inst.selector.rows = selector;
		inst.selector.opts = opts;
	
		return inst;
	} );
	
	_api_register( 'rows().nodes()', function () {
		return this.iterator( 'row', function ( settings, row ) {
			return settings.aoData[ row ].nTr || undefined;
		}, 1 );
	} );
	
	_api_register( 'rows().data()', function () {
		return this.iterator( true, 'rows', function ( settings, rows ) {
			return _pluck_order( settings.aoData, rows, '_aData' );
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().cache()', 'row().cache()', function ( type ) {
		return this.iterator( 'row', function ( settings, row ) {
			var r = settings.aoData[ row ];
			return type === 'search' ? r._aFilterData : r._aSortData;
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().invalidate()', 'row().invalidate()', function ( src ) {
		return this.iterator( 'row', function ( settings, row ) {
			_fnInvalidate( settings, row, src );
		} );
	} );
	
	_api_registerPlural( 'rows().indexes()', 'row().index()', function () {
		return this.iterator( 'row', function ( settings, row ) {
			return row;
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().ids()', 'row().id()', function ( hash ) {
		var a = [];
		var context = this.context;
	
		// `iterator` will drop undefined values, but in this case we want them
		for ( var i=0, ien=context.length ; i<ien ; i++ ) {
			for ( var j=0, jen=this[i].length ; j<jen ; j++ ) {
				var id = context[i].rowIdFn( context[i].aoData[ this[i][j] ]._aData );
				a.push( (hash === true ? '#' : '' )+ id );
			}
		}
	
		return new _Api( context, a );
	} );
	
	_api_registerPlural( 'rows().remove()', 'row().remove()', function () {
		this.iterator( 'row', function ( settings, row ) {
			var data = settings.aoData;
			var rowData = data[ row ];
	
			// Delete from the display arrays
			var idx = settings.aiDisplayMaster.indexOf(row);
			if (idx !== -1) {
				settings.aiDisplayMaster.splice(idx, 1);
			}
	
			idx = settings.aiDisplay.indexOf(row);
			if (idx !== -1) {
				settings.aiDisplay.splice(idx, 1);
			}
	
			// For server-side processing tables - subtract the deleted row from the count
			if ( settings._iRecordsDisplay > 0 ) {
				settings._iRecordsDisplay--;
			}
	
			// Check for an 'overflow' they case for displaying the table
			_fnLengthOverflow( settings );
	
			// Remove the row's ID reference if there is one
			var id = settings.rowIdFn( rowData._aData );
			if ( id !== undefined ) {
				delete settings.aIds[ id ];
			}
	
			data[row] = null;
		} );
	
		return this;
	} );
	
	
	_api_register( 'rows.add()', function ( rows ) {
		var newRows = this.iterator( 'table', function ( settings ) {
				var row, i, ien;
				var out = [];
	
				for ( i=0, ien=rows.length ; i<ien ; i++ ) {
					row = rows[i];
	
					if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
						out.push( _fnAddTr( settings, row )[0] );
					}
					else {
						out.push( _fnAddData( settings, row ) );
					}
				}
	
				return out;
			}, 1 );
	
		// Return an Api.rows() extended instance, so rows().nodes() etc can be used
		var modRows = this.rows( -1 );
		modRows.pop();
		modRows.push.apply(modRows, newRows);
	
		return modRows;
	} );
	
	
	
	
	
	/**
	 *
	 */
	_api_register( 'row()', function ( selector, opts ) {
		return _selector_first( this.rows( selector, opts ) );
	} );
	
	
	_api_register( 'row().data()', function ( data ) {
		var ctx = this.context;
	
		if ( data === undefined ) {
			// Get
			return ctx.length && this.length && this[0].length ?
				ctx[0].aoData[ this[0] ]._aData :
				undefined;
		}
	
		// Set
		var row = ctx[0].aoData[ this[0] ];
		row._aData = data;
	
		// If the DOM has an id, and the data source is an array
		if ( Array.isArray( data ) && row.nTr && row.nTr.id ) {
			_fnSetObjectDataFn( ctx[0].rowId )( data, row.nTr.id );
		}
	
		// Automatically invalidate
		_fnInvalidate( ctx[0], this[0], 'data' );
	
		return this;
	} );
	
	
	_api_register( 'row().node()', function () {
		var ctx = this.context;
	
		return ctx.length && this.length && this[0].length ?
			ctx[0].aoData[ this[0] ].nTr || null :
			null;
	} );
	
	
	_api_register( 'row.add()', function ( row ) {
		// Allow a jQuery object to be passed in - only a single row is added from
		// it though - the first element in the set
		if ( row instanceof $ && row.length ) {
			row = row[0];
		}
	
		var rows = this.iterator( 'table', function ( settings ) {
			if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
				return _fnAddTr( settings, row )[0];
			}
			return _fnAddData( settings, row );
		} );
	
		// Return an Api.rows() extended instance, with the newly added row selected
		return this.row( rows[0] );
	} );
	
	
	$(document).on('plugin-init.dt', function (e, context) {
		var api = new _Api( context );
	
		api.on( 'stateSaveParams.DT', function ( e, settings, d ) {
			// This could be more compact with the API, but it is a lot faster as a simple
			// internal loop
			var idFn = settings.rowIdFn;
			var rows = settings.aiDisplayMaster;
			var ids = [];
	
			for (var i=0 ; i<rows.length ; i++) {
				var rowIdx = rows[i];
				var data = settings.aoData[rowIdx];
	
				if (data._detailsShow) {
					ids.push( '#' + idFn(data._aData) );
				}
			}
	
			d.childRows = ids;
		});
	
		// For future state loads (e.g. with StateRestore)
		api.on( 'stateLoaded.DT', function (e, settings, state) {
			__details_state_load( api, state );
		});
	
		// And the initial load state
		__details_state_load( api, api.state.loaded() );
	});
	
	var __details_state_load = function (api, state)
	{
		if ( state && state.childRows ) {
			api
				.rows( state.childRows.map(function (id){
					return id.replace(/:/g, '\\:')
				}) )
				.every( function () {
					_fnCallbackFire( api.settings()[0], null, 'requestChild', [ this ] )
				});
		}
	}
	
	var __details_add = function ( ctx, row, data, klass )
	{
		// Convert to array of TR elements
		var rows = [];
		var addRow = function ( r, k ) {
			// Recursion to allow for arrays of jQuery objects
			if ( Array.isArray( r ) || r instanceof $ ) {
				for ( var i=0, ien=r.length ; i<ien ; i++ ) {
					addRow( r[i], k );
				}
				return;
			}
	
			// If we get a TR element, then just add it directly - up to the dev
			// to add the correct number of columns etc
			if ( r.nodeName && r.nodeName.toLowerCase() === 'tr' ) {
				r.setAttribute( 'data-dt-row', row.idx );
				rows.push( r );
			}
			else {
				// Otherwise create a row with a wrapper
				var created = $('<tr><td></td></tr>')
					.attr( 'data-dt-row', row.idx )
					.addClass( k );
				
				$('td', created)
					.addClass( k )
					.html( r )[0].colSpan = _fnVisbleColumns( ctx );
	
				rows.push( created[0] );
			}
		};
	
		addRow( data, klass );
	
		if ( row._details ) {
			row._details.detach();
		}
	
		row._details = $(rows);
	
		// If the children were already shown, that state should be retained
		if ( row._detailsShow ) {
			row._details.insertAfter( row.nTr );
		}
	};
	
	
	// Make state saving of child row details async to allow them to be batch processed
	var __details_state = DataTable.util.throttle(
		function (ctx) {
			_fnSaveState( ctx[0] )
		},
		500
	);
	
	
	var __details_remove = function ( api, idx )
	{
		var ctx = api.context;
	
		if ( ctx.length ) {
			var row = ctx[0].aoData[ idx !== undefined ? idx : api[0] ];
	
			if ( row && row._details ) {
				row._details.remove();
	
				row._detailsShow = undefined;
				row._details = undefined;
				$( row.nTr ).removeClass( 'dt-hasChild' );
				__details_state( ctx );
			}
		}
	};
	
	
	var __details_display = function ( api, show ) {
		var ctx = api.context;
	
		if ( ctx.length && api.length ) {
			var row = ctx[0].aoData[ api[0] ];
	
			if ( row._details ) {
				row._detailsShow = show;
	
				if ( show ) {
					row._details.insertAfter( row.nTr );
					$( row.nTr ).addClass( 'dt-hasChild' );
				}
				else {
					row._details.detach();
					$( row.nTr ).removeClass( 'dt-hasChild' );
				}
	
				_fnCallbackFire( ctx[0], null, 'childRow', [ show, api.row( api[0] ) ] )
	
				__details_events( ctx[0] );
				__details_state( ctx );
			}
		}
	};
	
	
	var __details_events = function ( settings )
	{
		var api = new _Api( settings );
		var namespace = '.dt.DT_details';
		var drawEvent = 'draw'+namespace;
		var colvisEvent = 'column-sizing'+namespace;
		var destroyEvent = 'destroy'+namespace;
		var data = settings.aoData;
	
		api.off( drawEvent +' '+ colvisEvent +' '+ destroyEvent );
	
		if ( _pluck( data, '_details' ).length > 0 ) {
			// On each draw, insert the required elements into the document
			api.on( drawEvent, function ( e, ctx ) {
				if ( settings !== ctx ) {
					return;
				}
	
				api.rows( {page:'current'} ).eq(0).each( function (idx) {
					// Internal data grab
					var row = data[ idx ];
	
					if ( row._detailsShow ) {
						row._details.insertAfter( row.nTr );
					}
				} );
			} );
	
			// Column visibility change - update the colspan
			api.on( colvisEvent, function ( e, ctx ) {
				if ( settings !== ctx ) {
					return;
				}
	
				// Update the colspan for the details rows (note, only if it already has
				// a colspan)
				var row, visible = _fnVisbleColumns( ctx );
	
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					row = data[i];
	
					if ( row && row._details ) {
						row._details.each(function () {
							var el = $(this).children('td');
	
							if (el.length == 1) {
								el.attr('colspan', visible);
							}
						});
					}
				}
			} );
	
			// Table destroyed - nuke any child rows
			api.on( destroyEvent, function ( e, ctx ) {
				if ( settings !== ctx ) {
					return;
				}
	
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					if ( data[i] && data[i]._details ) {
						__details_remove( api, i );
					}
				}
			} );
		}
	};
	
	// Strings for the method names to help minification
	var _emp = '';
	var _child_obj = _emp+'row().child';
	var _child_mth = _child_obj+'()';
	
	// data can be:
	//  tr
	//  string
	//  jQuery or array of any of the above
	_api_register( _child_mth, function ( data, klass ) {
		var ctx = this.context;
	
		if ( data === undefined ) {
			// get
			return ctx.length && this.length && ctx[0].aoData[ this[0] ]
				? ctx[0].aoData[ this[0] ]._details
				: undefined;
		}
		else if ( data === true ) {
			// show
			this.child.show();
		}
		else if ( data === false ) {
			// remove
			__details_remove( this );
		}
		else if ( ctx.length && this.length ) {
			// set
			__details_add( ctx[0], ctx[0].aoData[ this[0] ], data, klass );
		}
	
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.show()',
		_child_mth+'.show()' // only when `child()` was called with parameters (without
	], function () {         // it returns an object and this method is not executed)
		__details_display( this, true );
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.hide()',
		_child_mth+'.hide()' // only when `child()` was called with parameters (without
	], function () {         // it returns an object and this method is not executed)
		__details_display( this, false );
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.remove()',
		_child_mth+'.remove()' // only when `child()` was called with parameters (without
	], function () {           // it returns an object and this method is not executed)
		__details_remove( this );
		return this;
	} );
	
	
	_api_register( _child_obj+'.isShown()', function () {
		var ctx = this.context;
	
		if ( ctx.length && this.length ) {
			// _detailsShown as false or undefined will fall through to return false
			return ctx[0].aoData[ this[0] ]._detailsShow || false;
		}
		return false;
	} );
	
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Columns
	 *
	 * {integer}           - column index (>=0 count from left, <0 count from right)
	 * "{integer}:visIdx"  - visible column index (i.e. translate to column index)  (>=0 count from left, <0 count from right)
	 * "{integer}:visible" - alias for {integer}:visIdx  (>=0 count from left, <0 count from right)
	 * "{string}:name"     - column name
	 * "{string}"          - jQuery selector on column header nodes
	 *
	 */
	
	// can be an array of these items, comma separated list, or an array of comma
	// separated lists
	
	var __re_column_selector = /^([^:]+):(name|title|visIdx|visible)$/;
	
	
	// r1 and r2 are redundant - but it means that the parameters match for the
	// iterator callback in columns().data()
	var __columnData = function ( settings, column, r1, r2, rows, type ) {
		var a = [];
		for ( var row=0, ien=rows.length ; row<ien ; row++ ) {
			a.push( _fnGetCellData( settings, rows[row], column, type ) );
		}
		return a;
	};
	
	
	var __column_selector = function ( settings, selector, opts )
	{
		var
			columns = settings.aoColumns,
			names = _pluck( columns, 'sName' ),
			titles = _pluck( columns, 'sTitle' ),
			cells = DataTable.util.get('[].[].cell')(settings.aoHeader),
			nodes = _unique( _flatten([], cells) );
		
		var run = function ( s ) {
			var selInt = _intVal( s );
	
			// Selector - all
			if ( s === '' ) {
				return _range( columns.length );
			}
	
			// Selector - index
			if ( selInt !== null ) {
				return [ selInt >= 0 ?
					selInt : // Count from left
					columns.length + selInt // Count from right (+ because its a negative value)
				];
			}
	
			// Selector = function
			if ( typeof s === 'function' ) {
				var rows = _selector_row_indexes( settings, opts );
	
				return columns.map(function (col, idx) {
					return s(
							idx,
							__columnData( settings, idx, 0, 0, rows )
						) ? idx : null;
				});
			}
	
			// jQuery or string selector
			var match = typeof s === 'string' ?
				s.match( __re_column_selector ) :
				'';
	
			if ( match ) {
				switch( match[2] ) {
					case 'visIdx':
					case 'visible':
						var idx = parseInt( match[1], 10 );
						// Visible index given, convert to column index
						if ( idx < 0 ) {
							// Counting from the right
							var visColumns = columns.map( function (col,i) {
								return col.bVisible ? i : null;
							} );
							return [ visColumns[ visColumns.length + idx ] ];
						}
						// Counting from the left
						return [ _fnVisibleToColumnIndex( settings, idx ) ];
	
					case 'name':
						// match by name. `names` is column index complete and in order
						return names.map( function (name, i) {
							return name === match[1] ? i : null;
						} );
	
					case 'title':
						// match by column title
						return titles.map( function (title, i) {
							return title === match[1] ? i : null;
						} );
	
					default:
						return [];
				}
			}
	
			// Cell in the table body
			if ( s.nodeName && s._DT_CellIndex ) {
				return [ s._DT_CellIndex.column ];
			}
	
			// jQuery selector on the TH elements for the columns
			var jqResult = $( nodes )
				.filter( s )
				.map( function () {
					return _fnColumnsFromHeader( this ); // `nodes` is column index complete and in order
				} )
				.toArray();
	
			if ( jqResult.length || ! s.nodeName ) {
				return jqResult;
			}
	
			// Otherwise a node which might have a `dt-column` data attribute, or be
			// a child or such an element
			var host = $(s).closest('*[data-dt-column]');
			return host.length ?
				[ host.data('dt-column') ] :
				[];
		};
	
		return _selector_run( 'column', selector, run, settings, opts );
	};
	
	
	var __setColumnVis = function ( settings, column, vis ) {
		var
			cols = settings.aoColumns,
			col  = cols[ column ],
			data = settings.aoData,
			cells, i, ien, tr;
	
		// Get
		if ( vis === undefined ) {
			return col.bVisible;
		}
	
		// Set
		// No change
		if ( col.bVisible === vis ) {
			return false;
		}
	
		if ( vis ) {
			// Insert column
			// Need to decide if we should use appendChild or insertBefore
			var insertBefore = _pluck(cols, 'bVisible').indexOf(true, column+1);
	
			for ( i=0, ien=data.length ; i<ien ; i++ ) {
				if (data[i]) {
					tr = data[i].nTr;
					cells = data[i].anCells;
	
					if ( tr ) {
						// insertBefore can act like appendChild if 2nd arg is null
						tr.insertBefore( cells[ column ], cells[ insertBefore ] || null );
					}
				}
			}
		}
		else {
			// Remove column
			$( _pluck( settings.aoData, 'anCells', column ) ).detach();
		}
	
		// Common actions
		col.bVisible = vis;
	
		_colGroup(settings);
		
		return true;
	};
	
	
	_api_register( 'columns()', function ( selector, opts ) {
		// argument shifting
		if ( selector === undefined ) {
			selector = '';
		}
		else if ( $.isPlainObject( selector ) ) {
			opts = selector;
			selector = '';
		}
	
		opts = _selector_opts( opts );
	
		var inst = this.iterator( 'table', function ( settings ) {
			return __column_selector( settings, selector, opts );
		}, 1 );
	
		// Want argument shifting here and in _row_selector?
		inst.selector.cols = selector;
		inst.selector.opts = opts;
	
		return inst;
	} );
	
	_api_registerPlural( 'columns().header()', 'column().header()', function ( row ) {
		return this.iterator( 'column', function ( settings, column ) {
			var header = settings.aoHeader;
			var target = row !== undefined
				? row
				: settings.bSortCellsTop // legacy support
					? 0
					: header.length - 1;
	
			return header[target][column].cell;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().footer()', 'column().footer()', function ( row ) {
		return this.iterator( 'column', function ( settings, column ) {
			var footer = settings.aoFooter;
	
			if (! footer.length) {
				return null;
			}
	
			return settings.aoFooter[row !== undefined ? row : 0][column].cell;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().data()', 'column().data()', function () {
		return this.iterator( 'column-rows', __columnData, 1 );
	} );
	
	_api_registerPlural( 'columns().render()', 'column().render()', function ( type ) {
		return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
			return __columnData( settings, column, i, j, rows, type );
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().dataSrc()', 'column().dataSrc()', function () {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].mData;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().cache()', 'column().cache()', function ( type ) {
		return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
			return _pluck_order( settings.aoData, rows,
				type === 'search' ? '_aFilterData' : '_aSortData', column
			);
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().init()', 'column().init()', function () {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column];
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().nodes()', 'column().nodes()', function () {
		return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
			return _pluck_order( settings.aoData, rows, 'anCells', column ) ;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().titles()', 'column().title()', function (title, row) {
		return this.iterator( 'column', function ( settings, column ) {
			// Argument shifting
			if (typeof title === 'number') {
				row = title;
				title = undefined;
			}
	
			var span = $('span.dt-column-title', this.column(column).header(row));
	
			if (title !== undefined) {
				span.html(title);
				return this;
			}
	
			return span.html();
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().types()', 'column().type()', function () {
		return this.iterator( 'column', function ( settings, column ) {
			var type = settings.aoColumns[column].sType;
	
			// If the type was invalidated, then resolve it. This actually does
			// all columns at the moment. Would only happen once if getting all
			// column's data types.
			if (! type) {
				_fnColumnTypes(settings);
			}
	
			return type;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().visible()', 'column().visible()', function ( vis, calc ) {
		var that = this;
		var changed = [];
		var ret = this.iterator( 'column', function ( settings, column ) {
			if ( vis === undefined ) {
				return settings.aoColumns[ column ].bVisible;
			} // else
			
			if (__setColumnVis( settings, column, vis )) {
				changed.push(column);
			}
		} );
	
		// Group the column visibility changes
		if ( vis !== undefined ) {
			this.iterator( 'table', function ( settings ) {
				// Redraw the header after changes
				_fnDrawHead( settings, settings.aoHeader );
				_fnDrawHead( settings, settings.aoFooter );
		
				// Update colspan for no records display. Child rows and extensions will use their own
				// listeners to do this - only need to update the empty table item here
				if ( ! settings.aiDisplay.length ) {
					$(settings.nTBody).find('td[colspan]').attr('colspan', _fnVisbleColumns(settings));
				}
		
				_fnSaveState( settings );
	
				// Second loop once the first is done for events
				that.iterator( 'column', function ( settings, column ) {
					if (changed.includes(column)) {
						_fnCallbackFire( settings, null, 'column-visibility', [settings, column, vis, calc] );
					}
				} );
	
				if ( changed.length && (calc === undefined || calc) ) {
					that.columns.adjust();
				}
			});
		}
	
		return ret;
	} );
	
	_api_registerPlural( 'columns().widths()', 'column().width()', function () {
		// Injects a fake row into the table for just a moment so the widths can
		// be read, regardless of colspan in the header and rows being present in
		// the body
		var columns = this.columns(':visible').count();
		var row = $('<tr>').html('<td>' + Array(columns).join('</td><td>') + '</td>');
	
		$(this.table().body()).append(row);
	
		var widths = row.children().map(function () {
			return $(this).outerWidth();
		});
	
		row.remove();
		
		return this.iterator( 'column', function ( settings, column ) {
			var visIdx = _fnColumnIndexToVisible( settings, column );
	
			return visIdx !== null ? widths[visIdx] : 0;
		}, 1);
	} );
	
	_api_registerPlural( 'columns().indexes()', 'column().index()', function ( type ) {
		return this.iterator( 'column', function ( settings, column ) {
			return type === 'visible' ?
				_fnColumnIndexToVisible( settings, column ) :
				column;
		}, 1 );
	} );
	
	_api_register( 'columns.adjust()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnAdjustColumnSizing( settings );
		}, 1 );
	} );
	
	_api_register( 'column.index()', function ( type, idx ) {
		if ( this.context.length !== 0 ) {
			var ctx = this.context[0];
	
			if ( type === 'fromVisible' || type === 'toData' ) {
				return _fnVisibleToColumnIndex( ctx, idx );
			}
			else if ( type === 'fromData' || type === 'toVisible' ) {
				return _fnColumnIndexToVisible( ctx, idx );
			}
		}
	} );
	
	_api_register( 'column()', function ( selector, opts ) {
		return _selector_first( this.columns( selector, opts ) );
	} );
	
	var __cell_selector = function ( settings, selector, opts )
	{
		var data = settings.aoData;
		var rows = _selector_row_indexes( settings, opts );
		var cells = _removeEmpty( _pluck_order( data, rows, 'anCells' ) );
		var allCells = $(_flatten( [], cells ));
		var row;
		var columns = settings.aoColumns.length;
		var a, i, ien, j, o, host;
	
		var run = function ( s ) {
			var fnSelector = typeof s === 'function';
	
			if ( s === null || s === undefined || fnSelector ) {
				// All cells and function selectors
				a = [];
	
				for ( i=0, ien=rows.length ; i<ien ; i++ ) {
					row = rows[i];
	
					for ( j=0 ; j<columns ; j++ ) {
						o = {
							row: row,
							column: j
						};
	
						if ( fnSelector ) {
							// Selector - function
							host = data[ row ];
	
							if ( s( o, _fnGetCellData(settings, row, j), host.anCells ? host.anCells[j] : null ) ) {
								a.push( o );
							}
						}
						else {
							// Selector - all
							a.push( o );
						}
					}
				}
	
				return a;
			}
			
			// Selector - index
			if ( $.isPlainObject( s ) ) {
				// Valid cell index and its in the array of selectable rows
				return s.column !== undefined && s.row !== undefined && rows.indexOf(s.row) !== -1 ?
					[s] :
					[];
			}
	
			// Selector - jQuery filtered cells
			var jqResult = allCells
				.filter( s )
				.map( function (i, el) {
					return { // use a new object, in case someone changes the values
						row:    el._DT_CellIndex.row,
						column: el._DT_CellIndex.column
					};
				} )
				.toArray();
	
			if ( jqResult.length || ! s.nodeName ) {
				return jqResult;
			}
	
			// Otherwise the selector is a node, and there is one last option - the
			// element might be a child of an element which has dt-row and dt-column
			// data attributes
			host = $(s).closest('*[data-dt-row]');
			return host.length ?
				[ {
					row: host.data('dt-row'),
					column: host.data('dt-column')
				} ] :
				[];
		};
	
		return _selector_run( 'cell', selector, run, settings, opts );
	};
	
	
	
	
	_api_register( 'cells()', function ( rowSelector, columnSelector, opts ) {
		// Argument shifting
		if ( $.isPlainObject( rowSelector ) ) {
			// Indexes
			if ( rowSelector.row === undefined ) {
				// Selector options in first parameter
				opts = rowSelector;
				rowSelector = null;
			}
			else {
				// Cell index objects in first parameter
				opts = columnSelector;
				columnSelector = null;
			}
		}
		if ( $.isPlainObject( columnSelector ) ) {
			opts = columnSelector;
			columnSelector = null;
		}
	
		// Cell selector
		if ( columnSelector === null || columnSelector === undefined ) {
			return this.iterator( 'table', function ( settings ) {
				return __cell_selector( settings, rowSelector, _selector_opts( opts ) );
			} );
		}
	
		// The default built in options need to apply to row and columns
		var internalOpts = opts ? {
			page: opts.page,
			order: opts.order,
			search: opts.search
		} : {};
	
		// Row + column selector
		var columns = this.columns( columnSelector, internalOpts );
		var rows = this.rows( rowSelector, internalOpts );
		var i, ien, j, jen;
	
		var cellsNoOpts = this.iterator( 'table', function ( settings, idx ) {
			var a = [];
	
			for ( i=0, ien=rows[idx].length ; i<ien ; i++ ) {
				for ( j=0, jen=columns[idx].length ; j<jen ; j++ ) {
					a.push( {
						row:    rows[idx][i],
						column: columns[idx][j]
					} );
				}
			}
	
			return a;
		}, 1 );
	
		// There is currently only one extension which uses a cell selector extension
		// It is a _major_ performance drag to run this if it isn't needed, so this is
		// an extension specific check at the moment
		var cells = opts && opts.selected ?
			this.cells( cellsNoOpts, opts ) :
			cellsNoOpts;
	
		$.extend( cells.selector, {
			cols: columnSelector,
			rows: rowSelector,
			opts: opts
		} );
	
		return cells;
	} );
	
	
	_api_registerPlural( 'cells().nodes()', 'cell().node()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			var data = settings.aoData[ row ];
	
			return data && data.anCells ?
				data.anCells[ column ] :
				undefined;
		}, 1 );
	} );
	
	
	_api_register( 'cells().data()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return _fnGetCellData( settings, row, column );
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().cache()', 'cell().cache()', function ( type ) {
		type = type === 'search' ? '_aFilterData' : '_aSortData';
	
		return this.iterator( 'cell', function ( settings, row, column ) {
			return settings.aoData[ row ][ type ][ column ];
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().render()', 'cell().render()', function ( type ) {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return _fnGetCellData( settings, row, column, type );
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().indexes()', 'cell().index()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return {
				row: row,
				column: column,
				columnVisible: _fnColumnIndexToVisible( settings, column )
			};
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().invalidate()', 'cell().invalidate()', function ( src ) {
		return this.iterator( 'cell', function ( settings, row, column ) {
			_fnInvalidate( settings, row, src, column );
		} );
	} );
	
	
	
	_api_register( 'cell()', function ( rowSelector, columnSelector, opts ) {
		return _selector_first( this.cells( rowSelector, columnSelector, opts ) );
	} );
	
	
	_api_register( 'cell().data()', function ( data ) {
		var ctx = this.context;
		var cell = this[0];
	
		if ( data === undefined ) {
			// Get
			return ctx.length && cell.length ?
				_fnGetCellData( ctx[0], cell[0].row, cell[0].column ) :
				undefined;
		}
	
		// Set
		_fnSetCellData( ctx[0], cell[0].row, cell[0].column, data );
		_fnInvalidate( ctx[0], cell[0].row, 'data', cell[0].column );
	
		return this;
	} );
	
	
	
	/**
	 * Get current ordering (sorting) that has been applied to the table.
	 *
	 * @returns {array} 2D array containing the sorting information for the first
	 *   table in the current context. Each element in the parent array represents
	 *   a column being sorted upon (i.e. multi-sorting with two columns would have
	 *   2 inner arrays). The inner arrays may have 2 or 3 elements. The first is
	 *   the column index that the sorting condition applies to, the second is the
	 *   direction of the sort (`desc` or `asc`) and, optionally, the third is the
	 *   index of the sorting order from the `column.sorting` initialisation array.
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {integer} order Column index to sort upon.
	 * @param {string} direction Direction of the sort to be applied (`asc` or `desc`)
	 * @returns {DataTables.Api} this
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {array} order 1D array of sorting information to be applied.
	 * @param {array} [...] Optional additional sorting conditions
	 * @returns {DataTables.Api} this
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {array} order 2D array of sorting information to be applied.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'order()', function ( order, dir ) {
		var ctx = this.context;
		var args = Array.prototype.slice.call( arguments );
	
		if ( order === undefined ) {
			// get
			return ctx.length !== 0 ?
				ctx[0].aaSorting :
				undefined;
		}
	
		// set
		if ( typeof order === 'number' ) {
			// Simple column / direction passed in
			order = [ [ order, dir ] ];
		}
		else if ( args.length > 1 ) {
			// Arguments passed in (list of 1D arrays)
			order = args;
		}
		// otherwise a 2D array was passed in
	
		return this.iterator( 'table', function ( settings ) {
			settings.aaSorting = Array.isArray(order) ? order.slice() : order;
		} );
	} );
	
	
	/**
	 * Attach a sort listener to an element for a given column
	 *
	 * @param {node|jQuery|string} node Identifier for the element(s) to attach the
	 *   listener to. This can take the form of a single DOM node, a jQuery
	 *   collection of nodes or a jQuery selector which will identify the node(s).
	 * @param {integer} column the column that a click on this node will sort on
	 * @param {function} [callback] callback function when sort is run
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'order.listener()', function ( node, column, callback ) {
		return this.iterator( 'table', function ( settings ) {
			_fnSortAttachListener(settings, node, {}, column, callback);
		} );
	} );
	
	
	_api_register( 'order.fixed()', function ( set ) {
		if ( ! set ) {
			var ctx = this.context;
			var fixed = ctx.length ?
				ctx[0].aaSortingFixed :
				undefined;
	
			return Array.isArray( fixed ) ?
				{ pre: fixed } :
				fixed;
		}
	
		return this.iterator( 'table', function ( settings ) {
			settings.aaSortingFixed = $.extend( true, {}, set );
		} );
	} );
	
	
	// Order by the selected column(s)
	_api_register( [
		'columns().order()',
		'column().order()'
	], function ( dir ) {
		var that = this;
	
		if ( ! dir ) {
			return this.iterator( 'column', function ( settings, idx ) {
				var sort = _fnSortFlatten( settings );
	
				for ( var i=0, ien=sort.length ; i<ien ; i++ ) {
					if ( sort[i].col === idx ) {
						return sort[i].dir;
					}
				}
	
				return null;
			}, 1 );
		}
		else {
			return this.iterator( 'table', function ( settings, i ) {
				settings.aaSorting = that[i].map( function (col) {
					return [ col, dir ];
				} );
			} );
		}
	} );
	
	_api_registerPlural('columns().orderable()', 'column().orderable()', function ( directions ) {
		return this.iterator( 'column', function ( settings, idx ) {
			var col = settings.aoColumns[idx];
	
			return directions ?
				col.asSorting :
				col.bSortable;
		}, 1 );
	} );
	
	
	_api_register( 'processing()', function ( show ) {
		return this.iterator( 'table', function ( ctx ) {
			_fnProcessingDisplay( ctx, show );
		} );
	} );
	
	
	_api_register( 'search()', function ( input, regex, smart, caseInsen ) {
		var ctx = this.context;
	
		if ( input === undefined ) {
			// get
			return ctx.length !== 0 ?
				ctx[0].oPreviousSearch.search :
				undefined;
		}
	
		// set
		return this.iterator( 'table', function ( settings ) {
			if ( ! settings.oFeatures.bFilter ) {
				return;
			}
	
			if (typeof regex === 'object') {
				// New style options to pass to the search builder
				_fnFilterComplete( settings, $.extend( settings.oPreviousSearch, regex, {
					search: input
				} ) );
			}
			else {
				// Compat for the old options
				_fnFilterComplete( settings, $.extend( settings.oPreviousSearch, {
					search: input,
					regex:  regex === null ? false : regex,
					smart:  smart === null ? true  : smart,
					caseInsensitive: caseInsen === null ? true : caseInsen
				} ) );
			}
		} );
	} );
	
	_api_register( 'search.fixed()', function ( name, search ) {
		var ret = this.iterator( true, 'table', function ( settings ) {
			var fixed = settings.searchFixed;
	
			if (! name) {
				return Object.keys(fixed)
			}
			else if (search === undefined) {
				return fixed[name];
			}
			else if (search === null) {
				delete fixed[name];
			}
			else {
				fixed[name] = search;
			}
	
			return this;
		} );
	
		return name !== undefined && search === undefined
			? ret[0]
			: ret;
	} );
	
	_api_registerPlural(
		'columns().search()',
		'column().search()',
		function ( input, regex, smart, caseInsen ) {
			return this.iterator( 'column', function ( settings, column ) {
				var preSearch = settings.aoPreSearchCols;
	
				if ( input === undefined ) {
					// get
					return preSearch[ column ].search;
				}
	
				// set
				if ( ! settings.oFeatures.bFilter ) {
					return;
				}
	
				if (typeof regex === 'object') {
					// New style options to pass to the search builder
					$.extend( preSearch[ column ], regex, {
						search: input
					} );
				}
				else {
					// Old style (with not all options available)
					$.extend( preSearch[ column ], {
						search: input,
						regex:  regex === null ? false : regex,
						smart:  smart === null ? true  : smart,
						caseInsensitive: caseInsen === null ? true : caseInsen
					} );
				}
	
				_fnFilterComplete( settings, settings.oPreviousSearch );
			} );
		}
	);
	
	_api_register([
			'columns().search.fixed()',
			'column().search.fixed()'
		],
		function ( name, search ) {
			var ret = this.iterator( true, 'column', function ( settings, colIdx ) {
				var fixed = settings.aoColumns[colIdx].searchFixed;
	
				if (! name) {
					return Object.keys(fixed)
				}
				else if (search === undefined) {
					return fixed[name];
				}
				else if (search === null) {
					delete fixed[name];
				}
				else {
					fixed[name] = search;
				}
	
				return this;
			} );
	
			return name !== undefined && search === undefined
				? ret[0]
				: ret;
		}
	);
	/*
	 * State API methods
	 */
	
	_api_register( 'state()', function ( set, ignoreTime ) {
		// getter
		if ( ! set ) {
			return this.context.length ?
				this.context[0].oSavedState :
				null;
		}
	
		var setMutate = $.extend( true, {}, set );
	
		// setter
		return this.iterator( 'table', function ( settings ) {
			if ( ignoreTime !== false ) {
				setMutate.time = +new Date() + 100;
			}
	
			_fnImplementState( settings, setMutate, function(){} );
		} );
	} );
	
	
	_api_register( 'state.clear()', function () {
		return this.iterator( 'table', function ( settings ) {
			// Save an empty object
			settings.fnStateSaveCallback.call( settings.oInstance, settings, {} );
		} );
	} );
	
	
	_api_register( 'state.loaded()', function () {
		return this.context.length ?
			this.context[0].oLoadedState :
			null;
	} );
	
	
	_api_register( 'state.save()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnSaveState( settings );
		} );
	} );
	
	/**
	 * Set the jQuery or window object to be used by DataTables
	 *
	 * @param {*} module Library / container object
	 * @param {string} [type] Library or container type `lib`, `win` or `datetime`.
	 *   If not provided, automatic detection is attempted.
	 */
	DataTable.use = function (module, type) {
		if (type === 'lib' || module.fn) {
			$ = module;
		}
		else if (type == 'win' || module.document) {
			window = module;
			document = module.document;
		}
		else if (type === 'datetime' || module.type === 'DateTime') {
			DataTable.DateTime = module;
		}
	}
	
	/**
	 * CommonJS factory function pass through. This will check if the arguments
	 * given are a window object or a jQuery object. If so they are set
	 * accordingly.
	 * @param {*} root Window
	 * @param {*} jq jQUery
	 * @returns {boolean} Indicator
	 */
	DataTable.factory = function (root, jq) {
		var is = false;
	
		// Test if the first parameter is a window object
		if (root && root.document) {
			window = root;
			document = root.document;
		}
	
		// Test if the second parameter is a jQuery object
		if (jq && jq.fn && jq.fn.jquery) {
			$ = jq;
			is = true;
		}
	
		return is;
	}
	
	/**
	 * Provide a common method for plug-ins to check the version of DataTables being
	 * used, in order to ensure compatibility.
	 *
	 *  @param {string} version Version string to check for, in the format "X.Y.Z".
	 *    Note that the formats "X" and "X.Y" are also acceptable.
	 *  @param {string} [version2=current DataTables version] As above, but optional.
	 *   If not given the current DataTables version will be used.
	 *  @returns {boolean} true if this version of DataTables is greater or equal to
	 *    the required version, or false if this version of DataTales is not
	 *    suitable
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    alert( $.fn.dataTable.versionCheck( '1.9.0' ) );
	 */
	DataTable.versionCheck = function( version, version2 )
	{
		var aThis = version2 ?
			version2.split('.') :
			DataTable.version.split('.');
		var aThat = version.split('.');
		var iThis, iThat;
	
		for ( var i=0, iLen=aThat.length ; i<iLen ; i++ ) {
			iThis = parseInt( aThis[i], 10 ) || 0;
			iThat = parseInt( aThat[i], 10 ) || 0;
	
			// Parts are the same, keep comparing
			if (iThis === iThat) {
				continue;
			}
	
			// Parts are different, return immediately
			return iThis > iThat;
		}
	
		return true;
	};
	
	
	/**
	 * Check if a `<table>` node is a DataTable table already or not.
	 *
	 *  @param {node|jquery|string} table Table node, jQuery object or jQuery
	 *      selector for the table to test. Note that if more than more than one
	 *      table is passed on, only the first will be checked
	 *  @returns {boolean} true the table given is a DataTable, or false otherwise
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    if ( ! $.fn.DataTable.isDataTable( '#example' ) ) {
	 *      $('#example').dataTable();
	 *    }
	 */
	DataTable.isDataTable = function ( table )
	{
		var t = $(table).get(0);
		var is = false;
	
		if ( table instanceof DataTable.Api ) {
			return true;
		}
	
		$.each( DataTable.settings, function (i, o) {
			var head = o.nScrollHead ? $('table', o.nScrollHead)[0] : null;
			var foot = o.nScrollFoot ? $('table', o.nScrollFoot)[0] : null;
	
			if ( o.nTable === t || head === t || foot === t ) {
				is = true;
			}
		} );
	
		return is;
	};
	
	
	/**
	 * Get all DataTable tables that have been initialised - optionally you can
	 * select to get only currently visible tables.
	 *
	 *  @param {boolean} [visible=false] Flag to indicate if you want all (default)
	 *    or visible tables only.
	 *  @returns {array} Array of `table` nodes (not DataTable instances) which are
	 *    DataTables
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    $.each( $.fn.dataTable.tables(true), function () {
	 *      $(table).DataTable().columns.adjust();
	 *    } );
	 */
	DataTable.tables = function ( visible )
	{
		var api = false;
	
		if ( $.isPlainObject( visible ) ) {
			api = visible.api;
			visible = visible.visible;
		}
	
		var a = DataTable.settings
			.filter( function (o) {
				return !visible || (visible && $(o.nTable).is(':visible')) 
					? true
					: false;
			} )
			.map( function (o) {
				return o.nTable;
			});
	
		return api ?
			new _Api( a ) :
			a;
	};
	
	
	/**
	 * Convert from camel case parameters to Hungarian notation. This is made public
	 * for the extensions to provide the same ability as DataTables core to accept
	 * either the 1.9 style Hungarian notation, or the 1.10+ style camelCase
	 * parameters.
	 *
	 *  @param {object} src The model object which holds all parameters that can be
	 *    mapped.
	 *  @param {object} user The object to convert from camel case to Hungarian.
	 *  @param {boolean} force When set to `true`, properties which already have a
	 *    Hungarian value in the `user` object will be overwritten. Otherwise they
	 *    won't be.
	 */
	DataTable.camelToHungarian = _fnCamelToHungarian;
	
	
	
	/**
	 *
	 */
	_api_register( '$()', function ( selector, opts ) {
		var
			rows   = this.rows( opts ).nodes(), // Get all rows
			jqRows = $(rows);
	
		return $( [].concat(
			jqRows.filter( selector ).toArray(),
			jqRows.find( selector ).toArray()
		) );
	} );
	
	
	// jQuery functions to operate on the tables
	$.each( [ 'on', 'one', 'off' ], function (i, key) {
		_api_register( key+'()', function ( /* event, handler */ ) {
			var args = Array.prototype.slice.call(arguments);
	
			// Add the `dt` namespace automatically if it isn't already present
			args[0] = args[0].split( /\s/ ).map( function ( e ) {
				return ! e.match(/\.dt\b/) ?
					e+'.dt' :
					e;
				} ).join( ' ' );
	
			var inst = $( this.tables().nodes() );
			inst[key].apply( inst, args );
			return this;
		} );
	} );
	
	
	_api_register( 'clear()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnClearTable( settings );
		} );
	} );
	
	
	_api_register( 'error()', function (msg) {
		return this.iterator( 'table', function ( settings ) {
			_fnLog( settings, 0, msg );
		} );
	} );
	
	
	_api_register( 'settings()', function () {
		return new _Api( this.context, this.context );
	} );
	
	
	_api_register( 'init()', function () {
		var ctx = this.context;
		return ctx.length ? ctx[0].oInit : null;
	} );
	
	
	_api_register( 'data()', function () {
		return this.iterator( 'table', function ( settings ) {
			return _pluck( settings.aoData, '_aData' );
		} ).flatten();
	} );
	
	
	_api_register( 'trigger()', function ( name, args, bubbles ) {
		return this.iterator( 'table', function ( settings ) {
			return _fnCallbackFire( settings, null, name, args, bubbles );
		} ).flatten();
	} );
	
	
	_api_register( 'ready()', function ( fn ) {
		var ctx = this.context;
	
		// Get status of first table
		if (! fn) {
			return ctx.length
				? (ctx[0]._bInitComplete || false)
				: null;
		}
	
		// Function to run either once the table becomes ready or
		// immediately if it is already ready.
		return this.tables().every(function () {
			if (this.context[0]._bInitComplete) {
				fn.call(this);
			}
			else {
				this.on('init', function () {
					fn.call(this);
				});
			}
		} );
	} );
	
	
	_api_register( 'destroy()', function ( remove ) {
		remove = remove || false;
	
		return this.iterator( 'table', function ( settings ) {
			var classes   = settings.oClasses;
			var table     = settings.nTable;
			var tbody     = settings.nTBody;
			var thead     = settings.nTHead;
			var tfoot     = settings.nTFoot;
			var jqTable   = $(table);
			var jqTbody   = $(tbody);
			var jqWrapper = $(settings.nTableWrapper);
			var rows      = settings.aoData.map( function (r) { return r ? r.nTr : null; } );
			var orderClasses = classes.order;
	
			// Flag to note that the table is currently being destroyed - no action
			// should be taken
			settings.bDestroying = true;
	
			// Fire off the destroy callbacks for plug-ins etc
			_fnCallbackFire( settings, "aoDestroyCallback", "destroy", [settings], true );
	
			// If not being removed from the document, make all columns visible
			if ( ! remove ) {
				new _Api( settings ).columns().visible( true );
			}
	
			// Blitz all `DT` namespaced events (these are internal events, the
			// lowercase, `dt` events are user subscribed and they are responsible
			// for removing them
			jqWrapper.off('.DT').find(':not(tbody *)').off('.DT');
			$(window).off('.DT-'+settings.sInstance);
	
			// When scrolling we had to break the table up - restore it
			if ( table != thead.parentNode ) {
				jqTable.children('thead').detach();
				jqTable.append( thead );
			}
	
			if ( tfoot && table != tfoot.parentNode ) {
				jqTable.children('tfoot').detach();
				jqTable.append( tfoot );
			}
	
			settings.colgroup.remove();
	
			settings.aaSorting = [];
			settings.aaSortingFixed = [];
			_fnSortingClasses( settings );
	
			$('th, td', thead)
				.removeClass(
					orderClasses.canAsc + ' ' +
					orderClasses.canDesc + ' ' +
					orderClasses.isAsc + ' ' +
					orderClasses.isDesc
				)
				.css('width', '');
	
			// Add the TR elements back into the table in their original order
			jqTbody.children().detach();
			jqTbody.append( rows );
	
			var orig = settings.nTableWrapper.parentNode;
			var insertBefore = settings.nTableWrapper.nextSibling;
	
			// Remove the DataTables generated nodes, events and classes
			var removedMethod = remove ? 'remove' : 'detach';
			jqTable[ removedMethod ]();
			jqWrapper[ removedMethod ]();
	
			// If we need to reattach the table to the document
			if ( ! remove && orig ) {
				// insertBefore acts like appendChild if !arg[1]
				orig.insertBefore( table, insertBefore );
	
				// Restore the width of the original table - was read from the style property,
				// so we can restore directly to that
				jqTable
					.css( 'width', settings.sDestroyWidth )
					.removeClass( classes.table );
			}
	
			/* Remove the settings object from the settings array */
			var idx = DataTable.settings.indexOf(settings);
			if ( idx !== -1 ) {
				DataTable.settings.splice( idx, 1 );
			}
		} );
	} );
	
	
	// Add the `every()` method for rows, columns and cells in a compact form
	$.each( [ 'column', 'row', 'cell' ], function ( i, type ) {
		_api_register( type+'s().every()', function ( fn ) {
			var opts = this.selector.opts;
			var api = this;
			var inst;
			var counter = 0;
	
			return this.iterator( 'every', function ( settings, selectedIdx, tableIdx ) {
				inst = api[ type ](selectedIdx, opts);
	
				if (type === 'cell') {
					fn.call(inst, inst[0][0].row, inst[0][0].column, tableIdx, counter);
				}
				else {
					fn.call(inst, selectedIdx, tableIdx, counter);
				}
	
				counter++;
			} );
		} );
	} );
	
	
	// i18n method for extensions to be able to use the language object from the
	// DataTable
	_api_register( 'i18n()', function ( token, def, plural ) {
		var ctx = this.context[0];
		var resolved = _fnGetObjectDataFn( token )( ctx.oLanguage );
	
		if ( resolved === undefined ) {
			resolved = def;
		}
	
		if ( $.isPlainObject( resolved ) ) {
			resolved = plural !== undefined && resolved[ plural ] !== undefined ?
				resolved[ plural ] :
				resolved._;
		}
	
		return typeof resolved === 'string'
			? resolved.replace( '%d', plural ) // nb: plural might be undefined,
			: resolved;
	} );
	
	/**
	 * Version string for plug-ins to check compatibility. Allowed format is
	 * `a.b.c-d` where: a:int, b:int, c:int, d:string(dev|beta|alpha). `d` is used
	 * only for non-release builds. See https://semver.org/ for more information.
	 *  @member
	 *  @type string
	 *  @default Version number
	 */
	DataTable.version = "2.0.2";
	
	/**
	 * Private data store, containing all of the settings objects that are
	 * created for the tables on a given page.
	 *
	 * Note that the `DataTable.settings` object is aliased to
	 * `jQuery.fn.dataTableExt` through which it may be accessed and
	 * manipulated, or `jQuery.fn.dataTable.settings`.
	 *  @member
	 *  @type array
	 *  @default []
	 *  @private
	 */
	DataTable.settings = [];
	
	/**
	 * Object models container, for the various models that DataTables has
	 * available to it. These models define the objects that are used to hold
	 * the active state and configuration of the table.
	 *  @namespace
	 */
	DataTable.models = {};
	
	
	
	/**
	 * Template object for the way in which DataTables holds information about
	 * search information for the global filter and individual column filters.
	 *  @namespace
	 */
	DataTable.models.oSearch = {
		/**
		 * Flag to indicate if the filtering should be case insensitive or not
		 */
		"caseInsensitive": true,
	
		/**
		 * Applied search term
		 */
		"search": "",
	
		/**
		 * Flag to indicate if the search term should be interpreted as a
		 * regular expression (true) or not (false) and therefore and special
		 * regex characters escaped.
		 */
		"regex": false,
	
		/**
		 * Flag to indicate if DataTables is to use its smart filtering or not.
		 */
		"smart": true,
	
		/**
		 * Flag to indicate if DataTables should only trigger a search when
		 * the return key is pressed.
		 */
		"return": false
	};
	
	
	
	
	/**
	 * Template object for the way in which DataTables holds information about
	 * each individual row. This is the object format used for the settings
	 * aoData array.
	 *  @namespace
	 */
	DataTable.models.oRow = {
		/**
		 * TR element for the row
		 */
		"nTr": null,
	
		/**
		 * Array of TD elements for each row. This is null until the row has been
		 * created.
		 */
		"anCells": null,
	
		/**
		 * Data object from the original data source for the row. This is either
		 * an array if using the traditional form of DataTables, or an object if
		 * using mData options. The exact type will depend on the passed in
		 * data from the data source, or will be an array if using DOM a data
		 * source.
		 */
		"_aData": [],
	
		/**
		 * Sorting data cache - this array is ostensibly the same length as the
		 * number of columns (although each index is generated only as it is
		 * needed), and holds the data that is used for sorting each column in the
		 * row. We do this cache generation at the start of the sort in order that
		 * the formatting of the sort data need be done only once for each cell
		 * per sort. This array should not be read from or written to by anything
		 * other than the master sorting methods.
		 */
		"_aSortData": null,
	
		/**
		 * Per cell filtering data cache. As per the sort data cache, used to
		 * increase the performance of the filtering in DataTables
		 */
		"_aFilterData": null,
	
		/**
		 * Filtering data cache. This is the same as the cell filtering cache, but
		 * in this case a string rather than an array. This is easily computed with
		 * a join on `_aFilterData`, but is provided as a cache so the join isn't
		 * needed on every search (memory traded for performance)
		 */
		"_sFilterRow": null,
	
		/**
		 * Denote if the original data source was from the DOM, or the data source
		 * object. This is used for invalidating data, so DataTables can
		 * automatically read data from the original source, unless uninstructed
		 * otherwise.
		 */
		"src": null,
	
		/**
		 * Index in the aoData array. This saves an indexOf lookup when we have the
		 * object, but want to know the index
		 */
		"idx": -1,
	
		/**
		 * Cached display value
		 */
		displayData: null
	};
	
	
	/**
	 * Template object for the column information object in DataTables. This object
	 * is held in the settings aoColumns array and contains all the information that
	 * DataTables needs about each individual column.
	 *
	 * Note that this object is related to {@link DataTable.defaults.column}
	 * but this one is the internal data store for DataTables's cache of columns.
	 * It should NOT be manipulated outside of DataTables. Any configuration should
	 * be done through the initialisation options.
	 *  @namespace
	 */
	DataTable.models.oColumn = {
		/**
		 * Column index.
		 */
		"idx": null,
	
		/**
		 * A list of the columns that sorting should occur on when this column
		 * is sorted. That this property is an array allows multi-column sorting
		 * to be defined for a column (for example first name / last name columns
		 * would benefit from this). The values are integers pointing to the
		 * columns to be sorted on (typically it will be a single integer pointing
		 * at itself, but that doesn't need to be the case).
		 */
		"aDataSort": null,
	
		/**
		 * Define the sorting directions that are applied to the column, in sequence
		 * as the column is repeatedly sorted upon - i.e. the first value is used
		 * as the sorting direction when the column if first sorted (clicked on).
		 * Sort it again (click again) and it will move on to the next index.
		 * Repeat until loop.
		 */
		"asSorting": null,
	
		/**
		 * Flag to indicate if the column is searchable, and thus should be included
		 * in the filtering or not.
		 */
		"bSearchable": null,
	
		/**
		 * Flag to indicate if the column is sortable or not.
		 */
		"bSortable": null,
	
		/**
		 * Flag to indicate if the column is currently visible in the table or not
		 */
		"bVisible": null,
	
		/**
		 * Store for manual type assignment using the `column.type` option. This
		 * is held in store so we can manipulate the column's `sType` property.
		 */
		"_sManualType": null,
	
		/**
		 * Flag to indicate if HTML5 data attributes should be used as the data
		 * source for filtering or sorting. True is either are.
		 */
		"_bAttrSrc": false,
	
		/**
		 * Developer definable function that is called whenever a cell is created (Ajax source,
		 * etc) or processed for input (DOM source). This can be used as a compliment to mRender
		 * allowing you to modify the DOM element (add background colour for example) when the
		 * element is available.
		 */
		"fnCreatedCell": null,
	
		/**
		 * Function to get data from a cell in a column. You should <b>never</b>
		 * access data directly through _aData internally in DataTables - always use
		 * the method attached to this property. It allows mData to function as
		 * required. This function is automatically assigned by the column
		 * initialisation method
		 */
		"fnGetData": null,
	
		/**
		 * Function to set data for a cell in the column. You should <b>never</b>
		 * set the data directly to _aData internally in DataTables - always use
		 * this method. It allows mData to function as required. This function
		 * is automatically assigned by the column initialisation method
		 */
		"fnSetData": null,
	
		/**
		 * Property to read the value for the cells in the column from the data
		 * source array / object. If null, then the default content is used, if a
		 * function is given then the return from the function is used.
		 */
		"mData": null,
	
		/**
		 * Partner property to mData which is used (only when defined) to get
		 * the data - i.e. it is basically the same as mData, but without the
		 * 'set' option, and also the data fed to it is the result from mData.
		 * This is the rendering method to match the data method of mData.
		 */
		"mRender": null,
	
		/**
		 * The class to apply to all TD elements in the table's TBODY for the column
		 */
		"sClass": null,
	
		/**
		 * When DataTables calculates the column widths to assign to each column,
		 * it finds the longest string in each column and then constructs a
		 * temporary table and reads the widths from that. The problem with this
		 * is that "mmm" is much wider then "iiii", but the latter is a longer
		 * string - thus the calculation can go wrong (doing it properly and putting
		 * it into an DOM object and measuring that is horribly(!) slow). Thus as
		 * a "work around" we provide this option. It will append its value to the
		 * text that is found to be the longest string for the column - i.e. padding.
		 */
		"sContentPadding": null,
	
		/**
		 * Allows a default value to be given for a column's data, and will be used
		 * whenever a null data source is encountered (this can be because mData
		 * is set to null, or because the data source itself is null).
		 */
		"sDefaultContent": null,
	
		/**
		 * Name for the column, allowing reference to the column by name as well as
		 * by index (needs a lookup to work by name).
		 */
		"sName": null,
	
		/**
		 * Custom sorting data type - defines which of the available plug-ins in
		 * afnSortData the custom sorting will use - if any is defined.
		 */
		"sSortDataType": 'std',
	
		/**
		 * Class to be applied to the header element when sorting on this column
		 */
		"sSortingClass": null,
	
		/**
		 * Title of the column - what is seen in the TH element (nTh).
		 */
		"sTitle": null,
	
		/**
		 * Column sorting and filtering type
		 */
		"sType": null,
	
		/**
		 * Width of the column
		 */
		"sWidth": null,
	
		/**
		 * Width of the column when it was first "encountered"
		 */
		"sWidthOrig": null,
	
		/** Cached string which is the longest in the column */
		maxLenString: null,
	
		/**
		 * Store for named searches
		 */
		searchFixed: null
	};
	
	
	/*
	 * Developer note: The properties of the object below are given in Hungarian
	 * notation, that was used as the interface for DataTables prior to v1.10, however
	 * from v1.10 onwards the primary interface is camel case. In order to avoid
	 * breaking backwards compatibility utterly with this change, the Hungarian
	 * version is still, internally the primary interface, but is is not documented
	 * - hence the @name tags in each doc comment. This allows a Javascript function
	 * to create a map from Hungarian notation to camel case (going the other direction
	 * would require each property to be listed, which would add around 3K to the size
	 * of DataTables, while this method is about a 0.5K hit).
	 *
	 * Ultimately this does pave the way for Hungarian notation to be dropped
	 * completely, but that is a massive amount of work and will break current
	 * installs (therefore is on-hold until v2).
	 */
	
	/**
	 * Initialisation options that can be given to DataTables at initialisation
	 * time.
	 *  @namespace
	 */
	DataTable.defaults = {
		/**
		 * An array of data to use for the table, passed in at initialisation which
		 * will be used in preference to any data which is already in the DOM. This is
		 * particularly useful for constructing tables purely in Javascript, for
		 * example with a custom Ajax call.
		 */
		"aaData": null,
	
	
		/**
		 * If ordering is enabled, then DataTables will perform a first pass sort on
		 * initialisation. You can define which column(s) the sort is performed
		 * upon, and the sorting direction, with this variable. The `sorting` array
		 * should contain an array for each column to be sorted initially containing
		 * the column's index and a direction string ('asc' or 'desc').
		 */
		"aaSorting": [[0,'asc']],
	
	
		/**
		 * This parameter is basically identical to the `sorting` parameter, but
		 * cannot be overridden by user interaction with the table. What this means
		 * is that you could have a column (visible or hidden) which the sorting
		 * will always be forced on first - any sorting after that (from the user)
		 * will then be performed as required. This can be useful for grouping rows
		 * together.
		 */
		"aaSortingFixed": [],
	
	
		/**
		 * DataTables can be instructed to load data to display in the table from a
		 * Ajax source. This option defines how that Ajax call is made and where to.
		 *
		 * The `ajax` property has three different modes of operation, depending on
		 * how it is defined. These are:
		 *
		 * * `string` - Set the URL from where the data should be loaded from.
		 * * `object` - Define properties for `jQuery.ajax`.
		 * * `function` - Custom data get function
		 *
		 * `string`
		 * --------
		 *
		 * As a string, the `ajax` property simply defines the URL from which
		 * DataTables will load data.
		 *
		 * `object`
		 * --------
		 *
		 * As an object, the parameters in the object are passed to
		 * [jQuery.ajax](https://api.jquery.com/jQuery.ajax/) allowing fine control
		 * of the Ajax request. DataTables has a number of default parameters which
		 * you can override using this option. Please refer to the jQuery
		 * documentation for a full description of the options available, although
		 * the following parameters provide additional options in DataTables or
		 * require special consideration:
		 *
		 * * `data` - As with jQuery, `data` can be provided as an object, but it
		 *   can also be used as a function to manipulate the data DataTables sends
		 *   to the server. The function takes a single parameter, an object of
		 *   parameters with the values that DataTables has readied for sending. An
		 *   object may be returned which will be merged into the DataTables
		 *   defaults, or you can add the items to the object that was passed in and
		 *   not return anything from the function. This supersedes `fnServerParams`
		 *   from DataTables 1.9-.
		 *
		 * * `dataSrc` - By default DataTables will look for the property `data` (or
		 *   `aaData` for compatibility with DataTables 1.9-) when obtaining data
		 *   from an Ajax source or for server-side processing - this parameter
		 *   allows that property to be changed. You can use Javascript dotted
		 *   object notation to get a data source for multiple levels of nesting, or
		 *   it my be used as a function. As a function it takes a single parameter,
		 *   the JSON returned from the server, which can be manipulated as
		 *   required, with the returned value being that used by DataTables as the
		 *   data source for the table.
		 *
		 * * `success` - Should not be overridden it is used internally in
		 *   DataTables. To manipulate / transform the data returned by the server
		 *   use `ajax.dataSrc`, or use `ajax` as a function (see below).
		 *
		 * `function`
		 * ----------
		 *
		 * As a function, making the Ajax call is left up to yourself allowing
		 * complete control of the Ajax request. Indeed, if desired, a method other
		 * than Ajax could be used to obtain the required data, such as Web storage
		 * or an AIR database.
		 *
		 * The function is given four parameters and no return is required. The
		 * parameters are:
		 *
		 * 1. _object_ - Data to send to the server
		 * 2. _function_ - Callback function that must be executed when the required
		 *    data has been obtained. That data should be passed into the callback
		 *    as the only parameter
		 * 3. _object_ - DataTables settings object for the table
		 */
		"ajax": null,
	
	
		/**
		 * This parameter allows you to readily specify the entries in the length drop
		 * down menu that DataTables shows when pagination is enabled. It can be
		 * either a 1D array of options which will be used for both the displayed
		 * option and the value, or a 2D array which will use the array in the first
		 * position as the value, and the array in the second position as the
		 * displayed options (useful for language strings such as 'All').
		 *
		 * Note that the `pageLength` property will be automatically set to the
		 * first value given in this array, unless `pageLength` is also provided.
		 */
		"aLengthMenu": [ 10, 25, 50, 100 ],
	
	
		/**
		 * The `columns` option in the initialisation parameter allows you to define
		 * details about the way individual columns behave. For a full list of
		 * column options that can be set, please see
		 * {@link DataTable.defaults.column}. Note that if you use `columns` to
		 * define your columns, you must have an entry in the array for every single
		 * column that you have in your table (these can be null if you don't which
		 * to specify any options).
		 */
		"aoColumns": null,
	
		/**
		 * Very similar to `columns`, `columnDefs` allows you to target a specific
		 * column, multiple columns, or all columns, using the `targets` property of
		 * each object in the array. This allows great flexibility when creating
		 * tables, as the `columnDefs` arrays can be of any length, targeting the
		 * columns you specifically want. `columnDefs` may use any of the column
		 * options available: {@link DataTable.defaults.column}, but it _must_
		 * have `targets` defined in each object in the array. Values in the `targets`
		 * array may be:
		 *   <ul>
		 *     <li>a string - class name will be matched on the TH for the column</li>
		 *     <li>0 or a positive integer - column index counting from the left</li>
		 *     <li>a negative integer - column index counting from the right</li>
		 *     <li>the string "_all" - all columns (i.e. assign a default)</li>
		 *   </ul>
		 */
		"aoColumnDefs": null,
	
	
		/**
		 * Basically the same as `search`, this parameter defines the individual column
		 * filtering state at initialisation time. The array must be of the same size
		 * as the number of columns, and each element be an object with the parameters
		 * `search` and `escapeRegex` (the latter is optional). 'null' is also
		 * accepted and the default will be used.
		 */
		"aoSearchCols": [],
	
	
		/**
		 * Enable or disable automatic column width calculation. This can be disabled
		 * as an optimisation (it takes some time to calculate the widths) if the
		 * tables widths are passed in using `columns`.
		 */
		"bAutoWidth": true,
	
	
		/**
		 * Deferred rendering can provide DataTables with a huge speed boost when you
		 * are using an Ajax or JS data source for the table. This option, when set to
		 * true, will cause DataTables to defer the creation of the table elements for
		 * each row until they are needed for a draw - saving a significant amount of
		 * time.
		 */
		"bDeferRender": true,
	
	
		/**
		 * Replace a DataTable which matches the given selector and replace it with
		 * one which has the properties of the new initialisation object passed. If no
		 * table matches the selector, then the new DataTable will be constructed as
		 * per normal.
		 */
		"bDestroy": false,
	
	
		/**
		 * Enable or disable filtering of data. Filtering in DataTables is "smart" in
		 * that it allows the end user to input multiple words (space separated) and
		 * will match a row containing those words, even if not in the order that was
		 * specified (this allow matching across multiple columns). Note that if you
		 * wish to use filtering in DataTables this must remain 'true' - to remove the
		 * default filtering input box and retain filtering abilities, please use
		 * {@link DataTable.defaults.dom}.
		 */
		"bFilter": true,
	
		/**
		 * Used only for compatiblity with DT1
		 * @deprecated
		 */
		"bInfo": true,
	
		/**
		 * Used only for compatiblity with DT1
		 * @deprecated
		 */
		"bLengthChange": true,
	
		/**
		 * Enable or disable pagination.
		 */
		"bPaginate": true,
	
	
		/**
		 * Enable or disable the display of a 'processing' indicator when the table is
		 * being processed (e.g. a sort). This is particularly useful for tables with
		 * large amounts of data where it can take a noticeable amount of time to sort
		 * the entries.
		 */
		"bProcessing": false,
	
	
		/**
		 * Retrieve the DataTables object for the given selector. Note that if the
		 * table has already been initialised, this parameter will cause DataTables
		 * to simply return the object that has already been set up - it will not take
		 * account of any changes you might have made to the initialisation object
		 * passed to DataTables (setting this parameter to true is an acknowledgement
		 * that you understand this). `destroy` can be used to reinitialise a table if
		 * you need.
		 */
		"bRetrieve": false,
	
	
		/**
		 * When vertical (y) scrolling is enabled, DataTables will force the height of
		 * the table's viewport to the given height at all times (useful for layout).
		 * However, this can look odd when filtering data down to a small data set,
		 * and the footer is left "floating" further down. This parameter (when
		 * enabled) will cause DataTables to collapse the table's viewport down when
		 * the result set will fit within the given Y height.
		 */
		"bScrollCollapse": false,
	
	
		/**
		 * Configure DataTables to use server-side processing. Note that the
		 * `ajax` parameter must also be given in order to give DataTables a
		 * source to obtain the required data for each draw.
		 */
		"bServerSide": false,
	
	
		/**
		 * Enable or disable sorting of columns. Sorting of individual columns can be
		 * disabled by the `sortable` option for each column.
		 */
		"bSort": true,
	
	
		/**
		 * Enable or display DataTables' ability to sort multiple columns at the
		 * same time (activated by shift-click by the user).
		 */
		"bSortMulti": true,
	
	
		/**
		 * Allows control over whether DataTables should use the top (true) unique
		 * cell that is found for a single column, or the bottom (false - default).
		 * This is useful when using complex headers.
		 */
		"bSortCellsTop": null,
	
	
		/**
		 * Enable or disable the addition of the classes `sorting\_1`, `sorting\_2` and
		 * `sorting\_3` to the columns which are currently being sorted on. This is
		 * presented as a feature switch as it can increase processing time (while
		 * classes are removed and added) so for large data sets you might want to
		 * turn this off.
		 */
		"bSortClasses": true,
	
	
		/**
		 * Enable or disable state saving. When enabled HTML5 `localStorage` will be
		 * used to save table display information such as pagination information,
		 * display length, filtering and sorting. As such when the end user reloads
		 * the page the display display will match what thy had previously set up.
		 */
		"bStateSave": false,
	
	
		/**
		 * This function is called when a TR element is created (and all TD child
		 * elements have been inserted), or registered if using a DOM source, allowing
		 * manipulation of the TR element (adding classes etc).
		 */
		"fnCreatedRow": null,
	
	
		/**
		 * This function is called on every 'draw' event, and allows you to
		 * dynamically modify any aspect you want about the created DOM.
		 */
		"fnDrawCallback": null,
	
	
		/**
		 * Identical to fnHeaderCallback() but for the table footer this function
		 * allows you to modify the table footer on every 'draw' event.
		 */
		"fnFooterCallback": null,
	
	
		/**
		 * When rendering large numbers in the information element for the table
		 * (i.e. "Showing 1 to 10 of 57 entries") DataTables will render large numbers
		 * to have a comma separator for the 'thousands' units (e.g. 1 million is
		 * rendered as "1,000,000") to help readability for the end user. This
		 * function will override the default method DataTables uses.
		 */
		"fnFormatNumber": function ( toFormat ) {
			return toFormat.toString().replace(
				/\B(?=(\d{3})+(?!\d))/g,
				this.oLanguage.sThousands
			);
		},
	
	
		/**
		 * This function is called on every 'draw' event, and allows you to
		 * dynamically modify the header row. This can be used to calculate and
		 * display useful information about the table.
		 */
		"fnHeaderCallback": null,
	
	
		/**
		 * The information element can be used to convey information about the current
		 * state of the table. Although the internationalisation options presented by
		 * DataTables are quite capable of dealing with most customisations, there may
		 * be times where you wish to customise the string further. This callback
		 * allows you to do exactly that.
		 */
		"fnInfoCallback": null,
	
	
		/**
		 * Called when the table has been initialised. Normally DataTables will
		 * initialise sequentially and there will be no need for this function,
		 * however, this does not hold true when using external language information
		 * since that is obtained using an async XHR call.
		 */
		"fnInitComplete": null,
	
	
		/**
		 * Called at the very start of each table draw and can be used to cancel the
		 * draw by returning false, any other return (including undefined) results in
		 * the full draw occurring).
		 */
		"fnPreDrawCallback": null,
	
	
		/**
		 * This function allows you to 'post process' each row after it have been
		 * generated for each table draw, but before it is rendered on screen. This
		 * function might be used for setting the row class name etc.
		 */
		"fnRowCallback": null,
	
	
		/**
		 * Load the table state. With this function you can define from where, and how, the
		 * state of a table is loaded. By default DataTables will load from `localStorage`
		 * but you might wish to use a server-side database or cookies.
		 */
		"fnStateLoadCallback": function ( settings ) {
			try {
				return JSON.parse(
					(settings.iStateDuration === -1 ? sessionStorage : localStorage).getItem(
						'DataTables_'+settings.sInstance+'_'+location.pathname
					)
				);
			} catch (e) {
				return {};
			}
		},
	
	
		/**
		 * Callback which allows modification of the saved state prior to loading that state.
		 * This callback is called when the table is loading state from the stored data, but
		 * prior to the settings object being modified by the saved state. Note that for
		 * plug-in authors, you should use the `stateLoadParams` event to load parameters for
		 * a plug-in.
		 */
		"fnStateLoadParams": null,
	
	
		/**
		 * Callback that is called when the state has been loaded from the state saving method
		 * and the DataTables settings object has been modified as a result of the loaded state.
		 */
		"fnStateLoaded": null,
	
	
		/**
		 * Save the table state. This function allows you to define where and how the state
		 * information for the table is stored By default DataTables will use `localStorage`
		 * but you might wish to use a server-side database or cookies.
		 */
		"fnStateSaveCallback": function ( settings, data ) {
			try {
				(settings.iStateDuration === -1 ? sessionStorage : localStorage).setItem(
					'DataTables_'+settings.sInstance+'_'+location.pathname,
					JSON.stringify( data )
				);
			} catch (e) {
				// noop
			}
		},
	
	
		/**
		 * Callback which allows modification of the state to be saved. Called when the table
		 * has changed state a new state save is required. This method allows modification of
		 * the state saving object prior to actually doing the save, including addition or
		 * other state properties or modification. Note that for plug-in authors, you should
		 * use the `stateSaveParams` event to save parameters for a plug-in.
		 */
		"fnStateSaveParams": null,
	
	
		/**
		 * Duration for which the saved state information is considered valid. After this period
		 * has elapsed the state will be returned to the default.
		 * Value is given in seconds.
		 */
		"iStateDuration": 7200,
	
	
		/**
		 * Number of rows to display on a single page when using pagination. If
		 * feature enabled (`lengthChange`) then the end user will be able to override
		 * this to a custom setting using a pop-up menu.
		 */
		"iDisplayLength": 10,
	
	
		/**
		 * Define the starting point for data display when using DataTables with
		 * pagination. Note that this parameter is the number of records, rather than
		 * the page number, so if you have 10 records per page and want to start on
		 * the third page, it should be "20".
		 */
		"iDisplayStart": 0,
	
	
		/**
		 * By default DataTables allows keyboard navigation of the table (sorting, paging,
		 * and filtering) by adding a `tabindex` attribute to the required elements. This
		 * allows you to tab through the controls and press the enter key to activate them.
		 * The tabindex is default 0, meaning that the tab follows the flow of the document.
		 * You can overrule this using this parameter if you wish. Use a value of -1 to
		 * disable built-in keyboard navigation.
		 */
		"iTabIndex": 0,
	
	
		/**
		 * Classes that DataTables assigns to the various components and features
		 * that it adds to the HTML table. This allows classes to be configured
		 * during initialisation in addition to through the static
		 * {@link DataTable.ext.oStdClasses} object).
		 */
		"oClasses": {},
	
	
		/**
		 * All strings that DataTables uses in the user interface that it creates
		 * are defined in this object, allowing you to modified them individually or
		 * completely replace them all as required.
		 */
		"oLanguage": {
			/**
			 * Strings that are used for WAI-ARIA labels and controls only (these are not
			 * actually visible on the page, but will be read by screenreaders, and thus
			 * must be internationalised as well).
			 */
			"oAria": {
				/**
				 * ARIA label that is added to the table headers when the column may be sorted
				 */
				"orderable": ": Activate to sort",
	
				/**
				 * ARIA label that is added to the table headers when the column is currently being sorted
				 */
				"orderableReverse": ": Activate to invert sorting",
	
				/**
				 * ARIA label that is added to the table headers when the column is currently being 
				 * sorted and next step is to remove sorting
				 */
				"orderableRemove": ": Activate to remove sorting",
	
				paginate: {
					first: 'First',
					last: 'Last',
					next: 'Next',
					previous: 'Previous'
				}
			},
	
			/**
			 * Pagination string used by DataTables for the built-in pagination
			 * control types.
			 */
			"oPaginate": {
				/**
				 * Label and character for first page button
				 */
				"sFirst": "«",
	
				/**
				 * Last page button
				 */
				"sLast": "»",
	
				/**
				 * Next page button
				 */
				"sNext": "›",
	
				/**
				 * Previous page button
				 */
				"sPrevious": "‹",
			},
	
			/**
			 * Plural object for the data type the table is showing
			 */
			entries: {
				_: "entries",
				1: "entry"
			},
	
			/**
			 * This string is shown in preference to `zeroRecords` when the table is
			 * empty of data (regardless of filtering). Note that this is an optional
			 * parameter - if it is not given, the value of `zeroRecords` will be used
			 * instead (either the default or given value).
			 */
			"sEmptyTable": "No data available in table",
	
	
			/**
			 * This string gives information to the end user about the information
			 * that is current on display on the page. The following tokens can be
			 * used in the string and will be dynamically replaced as the table
			 * display updates. This tokens can be placed anywhere in the string, or
			 * removed as needed by the language requires:
			 *
			 * * `\_START\_` - Display index of the first record on the current page
			 * * `\_END\_` - Display index of the last record on the current page
			 * * `\_TOTAL\_` - Number of records in the table after filtering
			 * * `\_MAX\_` - Number of records in the table without filtering
			 * * `\_PAGE\_` - Current page number
			 * * `\_PAGES\_` - Total number of pages of data in the table
			 */
			"sInfo": "Showing _START_ to _END_ of _TOTAL_ _ENTRIES-TOTAL_",
	
	
			/**
			 * Display information string for when the table is empty. Typically the
			 * format of this string should match `info`.
			 */
			"sInfoEmpty": "Showing 0 to 0 of 0 _ENTRIES-TOTAL_",
	
	
			/**
			 * When a user filters the information in a table, this string is appended
			 * to the information (`info`) to give an idea of how strong the filtering
			 * is. The variable _MAX_ is dynamically updated.
			 */
			"sInfoFiltered": "(filtered from _MAX_ total _ENTRIES-MAX_)",
	
	
			/**
			 * If can be useful to append extra information to the info string at times,
			 * and this variable does exactly that. This information will be appended to
			 * the `info` (`infoEmpty` and `infoFiltered` in whatever combination they are
			 * being used) at all times.
			 */
			"sInfoPostFix": "",
	
	
			/**
			 * This decimal place operator is a little different from the other
			 * language options since DataTables doesn't output floating point
			 * numbers, so it won't ever use this for display of a number. Rather,
			 * what this parameter does is modify the sort methods of the table so
			 * that numbers which are in a format which has a character other than
			 * a period (`.`) as a decimal place will be sorted numerically.
			 *
			 * Note that numbers with different decimal places cannot be shown in
			 * the same table and still be sortable, the table must be consistent.
			 * However, multiple different tables on the page can use different
			 * decimal place characters.
			 */
			"sDecimal": "",
	
	
			/**
			 * DataTables has a build in number formatter (`formatNumber`) which is
			 * used to format large numbers that are used in the table information.
			 * By default a comma is used, but this can be trivially changed to any
			 * character you wish with this parameter.
			 */
			"sThousands": ",",
	
	
			/**
			 * Detail the action that will be taken when the drop down menu for the
			 * pagination length option is changed. The '_MENU_' variable is replaced
			 * with a default select list of 10, 25, 50 and 100, and can be replaced
			 * with a custom select box if required.
			 */
			"sLengthMenu": "_MENU_ _ENTRIES_ per page",
	
	
			/**
			 * When using Ajax sourced data and during the first draw when DataTables is
			 * gathering the data, this message is shown in an empty row in the table to
			 * indicate to the end user the the data is being loaded. Note that this
			 * parameter is not used when loading data by server-side processing, just
			 * Ajax sourced data with client-side processing.
			 */
			"sLoadingRecords": "Loading...",
	
	
			/**
			 * Text which is displayed when the table is processing a user action
			 * (usually a sort command or similar).
			 */
			"sProcessing": "",
	
	
			/**
			 * Details the actions that will be taken when the user types into the
			 * filtering input text box. The variable "_INPUT_", if used in the string,
			 * is replaced with the HTML text box for the filtering input allowing
			 * control over where it appears in the string. If "_INPUT_" is not given
			 * then the input box is appended to the string automatically.
			 */
			"sSearch": "Search:",
	
	
			/**
			 * Assign a `placeholder` attribute to the search `input` element
			 *  @type string
			 *  @default 
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.searchPlaceholder
			 */
			"sSearchPlaceholder": "",
	
	
			/**
			 * All of the language information can be stored in a file on the
			 * server-side, which DataTables will look up if this parameter is passed.
			 * It must store the URL of the language file, which is in a JSON format,
			 * and the object has the same properties as the oLanguage object in the
			 * initialiser object (i.e. the above parameters). Please refer to one of
			 * the example language files to see how this works in action.
			 */
			"sUrl": "",
	
	
			/**
			 * Text shown inside the table records when the is no information to be
			 * displayed after filtering. `emptyTable` is shown when there is simply no
			 * information in the table at all (regardless of filtering).
			 */
			"sZeroRecords": "No matching records found"
		},
	
	
		/**
		 * This parameter allows you to have define the global filtering state at
		 * initialisation time. As an object the `search` parameter must be
		 * defined, but all other parameters are optional. When `regex` is true,
		 * the search string will be treated as a regular expression, when false
		 * (default) it will be treated as a straight string. When `smart`
		 * DataTables will use it's smart filtering methods (to word match at
		 * any point in the data), when false this will not be done.
		 */
		"oSearch": $.extend( {}, DataTable.models.oSearch ),
	
	
		/**
		 * Table and control layout. This replaces the legacy `dom` option.
		 */
		layout: {
			topStart: 'pageLength',
			topEnd: 'search',
			bottomStart: 'info',
			bottomEnd: 'paging'
		},
	
	
		/**
		 * Legacy DOM layout option
		 */
		"sDom": null,
	
	
		/**
		 * Search delay option. This will throttle full table searches that use the
		 * DataTables provided search input element (it does not effect calls to
		 * `dt-api search()`, providing a delay before the search is made.
		 */
		"searchDelay": null,
	
	
		/**
		 * DataTables features six different built-in options for the buttons to
		 * display for pagination control:
		 *
		 * * `numbers` - Page number buttons only
		 * * `simple` - 'Previous' and 'Next' buttons only
		 * * 'simple_numbers` - 'Previous' and 'Next' buttons, plus page numbers
		 * * `full` - 'First', 'Previous', 'Next' and 'Last' buttons
		 * * `full_numbers` - 'First', 'Previous', 'Next' and 'Last' buttons, plus page numbers
		 * * `first_last_numbers` - 'First' and 'Last' buttons, plus page numbers
		 */
		"sPaginationType": "full_numbers",
	
	
		/**
		 * Enable horizontal scrolling. When a table is too wide to fit into a
		 * certain layout, or you have a large number of columns in the table, you
		 * can enable x-scrolling to show the table in a viewport, which can be
		 * scrolled. This property can be `true` which will allow the table to
		 * scroll horizontally when needed, or any CSS unit, or a number (in which
		 * case it will be treated as a pixel measurement). Setting as simply `true`
		 * is recommended.
		 */
		"sScrollX": "",
	
	
		/**
		 * This property can be used to force a DataTable to use more width than it
		 * might otherwise do when x-scrolling is enabled. For example if you have a
		 * table which requires to be well spaced, this parameter is useful for
		 * "over-sizing" the table, and thus forcing scrolling. This property can by
		 * any CSS unit, or a number (in which case it will be treated as a pixel
		 * measurement).
		 */
		"sScrollXInner": "",
	
	
		/**
		 * Enable vertical scrolling. Vertical scrolling will constrain the DataTable
		 * to the given height, and enable scrolling for any data which overflows the
		 * current viewport. This can be used as an alternative to paging to display
		 * a lot of data in a small area (although paging and scrolling can both be
		 * enabled at the same time). This property can be any CSS unit, or a number
		 * (in which case it will be treated as a pixel measurement).
		 */
		"sScrollY": "",
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * Set the HTTP method that is used to make the Ajax call for server-side
		 * processing or Ajax sourced data.
		 */
		"sServerMethod": "GET",
	
	
		/**
		 * DataTables makes use of renderers when displaying HTML elements for
		 * a table. These renderers can be added or modified by plug-ins to
		 * generate suitable mark-up for a site. For example the Bootstrap
		 * integration plug-in for DataTables uses a paging button renderer to
		 * display pagination buttons in the mark-up required by Bootstrap.
		 *
		 * For further information about the renderers available see
		 * DataTable.ext.renderer
		 */
		"renderer": null,
	
	
		/**
		 * Set the data property name that DataTables should use to get a row's id
		 * to set as the `id` property in the node.
		 */
		"rowId": "DT_RowId",
	
	
		/**
		 * Caption value
		 */
		"caption": null
	};
	
	_fnHungarianMap( DataTable.defaults );
	
	
	
	/*
	 * Developer note - See note in model.defaults.js about the use of Hungarian
	 * notation and camel case.
	 */
	
	/**
	 * Column options that can be given to DataTables at initialisation time.
	 *  @namespace
	 */
	DataTable.defaults.column = {
		/**
		 * Define which column(s) an order will occur on for this column. This
		 * allows a column's ordering to take multiple columns into account when
		 * doing a sort or use the data from a different column. For example first
		 * name / last name columns make sense to do a multi-column sort over the
		 * two columns.
		 */
		"aDataSort": null,
		"iDataSort": -1,
	
		ariaTitle: '',
	
	
		/**
		 * You can control the default ordering direction, and even alter the
		 * behaviour of the sort handler (i.e. only allow ascending ordering etc)
		 * using this parameter.
		 */
		"asSorting": [ 'asc', 'desc', '' ],
	
	
		/**
		 * Enable or disable filtering on the data in this column.
		 */
		"bSearchable": true,
	
	
		/**
		 * Enable or disable ordering on this column.
		 */
		"bSortable": true,
	
	
		/**
		 * Enable or disable the display of this column.
		 */
		"bVisible": true,
	
	
		/**
		 * Developer definable function that is called whenever a cell is created (Ajax source,
		 * etc) or processed for input (DOM source). This can be used as a compliment to mRender
		 * allowing you to modify the DOM element (add background colour for example) when the
		 * element is available.
		 */
		"fnCreatedCell": null,
	
	
		/**
		 * This property can be used to read data from any data source property,
		 * including deeply nested objects / properties. `data` can be given in a
		 * number of different ways which effect its behaviour:
		 *
		 * * `integer` - treated as an array index for the data source. This is the
		 *   default that DataTables uses (incrementally increased for each column).
		 * * `string` - read an object property from the data source. There are
		 *   three 'special' options that can be used in the string to alter how
		 *   DataTables reads the data from the source object:
		 *    * `.` - Dotted Javascript notation. Just as you use a `.` in
		 *      Javascript to read from nested objects, so to can the options
		 *      specified in `data`. For example: `browser.version` or
		 *      `browser.name`. If your object parameter name contains a period, use
		 *      `\\` to escape it - i.e. `first\\.name`.
		 *    * `[]` - Array notation. DataTables can automatically combine data
		 *      from and array source, joining the data with the characters provided
		 *      between the two brackets. For example: `name[, ]` would provide a
		 *      comma-space separated list from the source array. If no characters
		 *      are provided between the brackets, the original array source is
		 *      returned.
		 *    * `()` - Function notation. Adding `()` to the end of a parameter will
		 *      execute a function of the name given. For example: `browser()` for a
		 *      simple function on the data source, `browser.version()` for a
		 *      function in a nested property or even `browser().version` to get an
		 *      object property if the function called returns an object. Note that
		 *      function notation is recommended for use in `render` rather than
		 *      `data` as it is much simpler to use as a renderer.
		 * * `null` - use the original data source for the row rather than plucking
		 *   data directly from it. This action has effects on two other
		 *   initialisation options:
		 *    * `defaultContent` - When null is given as the `data` option and
		 *      `defaultContent` is specified for the column, the value defined by
		 *      `defaultContent` will be used for the cell.
		 *    * `render` - When null is used for the `data` option and the `render`
		 *      option is specified for the column, the whole data source for the
		 *      row is used for the renderer.
		 * * `function` - the function given will be executed whenever DataTables
		 *   needs to set or get the data for a cell in the column. The function
		 *   takes three parameters:
		 *    * Parameters:
		 *      * `{array|object}` The data source for the row
		 *      * `{string}` The type call data requested - this will be 'set' when
		 *        setting data or 'filter', 'display', 'type', 'sort' or undefined
		 *        when gathering data. Note that when `undefined` is given for the
		 *        type DataTables expects to get the raw data for the object back<
		 *      * `{*}` Data to set when the second parameter is 'set'.
		 *    * Return:
		 *      * The return value from the function is not required when 'set' is
		 *        the type of call, but otherwise the return is what will be used
		 *        for the data requested.
		 *
		 * Note that `data` is a getter and setter option. If you just require
		 * formatting of data for output, you will likely want to use `render` which
		 * is simply a getter and thus simpler to use.
		 *
		 * Note that prior to DataTables 1.9.2 `data` was called `mDataProp`. The
		 * name change reflects the flexibility of this property and is consistent
		 * with the naming of mRender. If 'mDataProp' is given, then it will still
		 * be used by DataTables, as it automatically maps the old name to the new
		 * if required.
		 */
		"mData": null,
	
	
		/**
		 * This property is the rendering partner to `data` and it is suggested that
		 * when you want to manipulate data for display (including filtering,
		 * sorting etc) without altering the underlying data for the table, use this
		 * property. `render` can be considered to be the the read only companion to
		 * `data` which is read / write (then as such more complex). Like `data`
		 * this option can be given in a number of different ways to effect its
		 * behaviour:
		 *
		 * * `integer` - treated as an array index for the data source. This is the
		 *   default that DataTables uses (incrementally increased for each column).
		 * * `string` - read an object property from the data source. There are
		 *   three 'special' options that can be used in the string to alter how
		 *   DataTables reads the data from the source object:
		 *    * `.` - Dotted Javascript notation. Just as you use a `.` in
		 *      Javascript to read from nested objects, so to can the options
		 *      specified in `data`. For example: `browser.version` or
		 *      `browser.name`. If your object parameter name contains a period, use
		 *      `\\` to escape it - i.e. `first\\.name`.
		 *    * `[]` - Array notation. DataTables can automatically combine data
		 *      from and array source, joining the data with the characters provided
		 *      between the two brackets. For example: `name[, ]` would provide a
		 *      comma-space separated list from the source array. If no characters
		 *      are provided between the brackets, the original array source is
		 *      returned.
		 *    * `()` - Function notation. Adding `()` to the end of a parameter will
		 *      execute a function of the name given. For example: `browser()` for a
		 *      simple function on the data source, `browser.version()` for a
		 *      function in a nested property or even `browser().version` to get an
		 *      object property if the function called returns an object.
		 * * `object` - use different data for the different data types requested by
		 *   DataTables ('filter', 'display', 'type' or 'sort'). The property names
		 *   of the object is the data type the property refers to and the value can
		 *   defined using an integer, string or function using the same rules as
		 *   `render` normally does. Note that an `_` option _must_ be specified.
		 *   This is the default value to use if you haven't specified a value for
		 *   the data type requested by DataTables.
		 * * `function` - the function given will be executed whenever DataTables
		 *   needs to set or get the data for a cell in the column. The function
		 *   takes three parameters:
		 *    * Parameters:
		 *      * {array|object} The data source for the row (based on `data`)
		 *      * {string} The type call data requested - this will be 'filter',
		 *        'display', 'type' or 'sort'.
		 *      * {array|object} The full data source for the row (not based on
		 *        `data`)
		 *    * Return:
		 *      * The return value from the function is what will be used for the
		 *        data requested.
		 */
		"mRender": null,
	
	
		/**
		 * Change the cell type created for the column - either TD cells or TH cells. This
		 * can be useful as TH cells have semantic meaning in the table body, allowing them
		 * to act as a header for a row (you may wish to add scope='row' to the TH elements).
		 */
		"sCellType": "td",
	
	
		/**
		 * Class to give to each cell in this column.
		 */
		"sClass": "",
	
		/**
		 * When DataTables calculates the column widths to assign to each column,
		 * it finds the longest string in each column and then constructs a
		 * temporary table and reads the widths from that. The problem with this
		 * is that "mmm" is much wider then "iiii", but the latter is a longer
		 * string - thus the calculation can go wrong (doing it properly and putting
		 * it into an DOM object and measuring that is horribly(!) slow). Thus as
		 * a "work around" we provide this option. It will append its value to the
		 * text that is found to be the longest string for the column - i.e. padding.
		 * Generally you shouldn't need this!
		 */
		"sContentPadding": "",
	
	
		/**
		 * Allows a default value to be given for a column's data, and will be used
		 * whenever a null data source is encountered (this can be because `data`
		 * is set to null, or because the data source itself is null).
		 */
		"sDefaultContent": null,
	
	
		/**
		 * This parameter is only used in DataTables' server-side processing. It can
		 * be exceptionally useful to know what columns are being displayed on the
		 * client side, and to map these to database fields. When defined, the names
		 * also allow DataTables to reorder information from the server if it comes
		 * back in an unexpected order (i.e. if you switch your columns around on the
		 * client-side, your server-side code does not also need updating).
		 */
		"sName": "",
	
	
		/**
		 * Defines a data source type for the ordering which can be used to read
		 * real-time information from the table (updating the internally cached
		 * version) prior to ordering. This allows ordering to occur on user
		 * editable elements such as form inputs.
		 */
		"sSortDataType": "std",
	
	
		/**
		 * The title of this column.
		 */
		"sTitle": null,
	
	
		/**
		 * The type allows you to specify how the data for this column will be
		 * ordered. Four types (string, numeric, date and html (which will strip
		 * HTML tags before ordering)) are currently available. Note that only date
		 * formats understood by Javascript's Date() object will be accepted as type
		 * date. For example: "Mar 26, 2008 5:03 PM". May take the values: 'string',
		 * 'numeric', 'date' or 'html' (by default). Further types can be adding
		 * through plug-ins.
		 */
		"sType": null,
	
	
		/**
		 * Defining the width of the column, this parameter may take any CSS value
		 * (3em, 20px etc). DataTables applies 'smart' widths to columns which have not
		 * been given a specific width through this interface ensuring that the table
		 * remains readable.
		 */
		"sWidth": null
	};
	
	_fnHungarianMap( DataTable.defaults.column );
	
	
	
	/**
	 * DataTables settings object - this holds all the information needed for a
	 * given table, including configuration, data and current application of the
	 * table options. DataTables does not have a single instance for each DataTable
	 * with the settings attached to that instance, but rather instances of the
	 * DataTable "class" are created on-the-fly as needed (typically by a
	 * $().dataTable() call) and the settings object is then applied to that
	 * instance.
	 *
	 * Note that this object is related to {@link DataTable.defaults} but this
	 * one is the internal data store for DataTables's cache of columns. It should
	 * NOT be manipulated outside of DataTables. Any configuration should be done
	 * through the initialisation options.
	 */
	DataTable.models.oSettings = {
		/**
		 * Primary features of DataTables and their enablement state.
		 */
		"oFeatures": {
	
			/**
			 * Flag to say if DataTables should automatically try to calculate the
			 * optimum table and columns widths (true) or not (false).
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 */
			"bAutoWidth": null,
	
			/**
			 * Delay the creation of TR and TD elements until they are actually
			 * needed by a driven page draw. This can give a significant speed
			 * increase for Ajax source and Javascript source data, but makes no
			 * difference at all for DOM and server-side processing tables.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 */
			"bDeferRender": null,
	
			/**
			 * Enable filtering on the table or not. Note that if this is disabled
			 * then there is no filtering at all on the table, including fnFilter.
			 * To just remove the filtering input use sDom and remove the 'f' option.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 */
			"bFilter": null,
	
			/**
			 * Used only for compatiblity with DT1
			 * @deprecated
			 */
			"bInfo": true,
	
			/**
			 * Used only for compatiblity with DT1
			 * @deprecated
			 */
			"bLengthChange": true,
	
			/**
			 * Pagination enabled or not. Note that if this is disabled then length
			 * changing must also be disabled.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 */
			"bPaginate": null,
	
			/**
			 * Processing indicator enable flag whenever DataTables is enacting a
			 * user request - typically an Ajax request for server-side processing.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 */
			"bProcessing": null,
	
			/**
			 * Server-side processing enabled flag - when enabled DataTables will
			 * get all data from the server for every draw - there is no filtering,
			 * sorting or paging done on the client-side.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 */
			"bServerSide": null,
	
			/**
			 * Sorting enablement flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 */
			"bSort": null,
	
			/**
			 * Multi-column sorting
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 */
			"bSortMulti": null,
	
			/**
			 * Apply a class to the columns which are being sorted to provide a
			 * visual highlight or not. This can slow things down when enabled since
			 * there is a lot of DOM interaction.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 */
			"bSortClasses": null,
	
			/**
			 * State saving enablement flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 */
			"bStateSave": null
		},
	
	
		/**
		 * Scrolling settings for a table.
		 */
		"oScroll": {
			/**
			 * When the table is shorter in height than sScrollY, collapse the
			 * table container down to the height of the table (when true).
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 */
			"bCollapse": null,
	
			/**
			 * Width of the scrollbar for the web-browser's platform. Calculated
			 * during table initialisation.
			 */
			"iBarWidth": 0,
	
			/**
			 * Viewport width for horizontal scrolling. Horizontal scrolling is
			 * disabled if an empty string.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 */
			"sX": null,
	
			/**
			 * Width to expand the table to when using x-scrolling. Typically you
			 * should not need to use this.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @deprecated
			 */
			"sXInner": null,
	
			/**
			 * Viewport height for vertical scrolling. Vertical scrolling is disabled
			 * if an empty string.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 */
			"sY": null
		},
	
		/**
		 * Language information for the table.
		 */
		"oLanguage": {
			/**
			 * Information callback function. See
			 * {@link DataTable.defaults.fnInfoCallback}
			 */
			"fnInfoCallback": null
		},
	
		/**
		 * Browser support parameters
		 */
		"oBrowser": {
			/**
			 * Determine if the vertical scrollbar is on the right or left of the
			 * scrolling container - needed for rtl language layout, although not
			 * all browsers move the scrollbar (Safari).
			 */
			"bScrollbarLeft": false,
	
			/**
			 * Browser scrollbar width
			 */
			"barWidth": 0
		},
	
	
		"ajax": null,
	
	
		/**
		 * Array referencing the nodes which are used for the features. The
		 * parameters of this object match what is allowed by sDom - i.e.
		 *   <ul>
		 *     <li>'l' - Length changing</li>
		 *     <li>'f' - Filtering input</li>
		 *     <li>'t' - The table!</li>
		 *     <li>'i' - Information</li>
		 *     <li>'p' - Pagination</li>
		 *     <li>'r' - pRocessing</li>
		 *   </ul>
		 */
		"aanFeatures": [],
	
		/**
		 * Store data information - see {@link DataTable.models.oRow} for detailed
		 * information.
		 */
		"aoData": [],
	
		/**
		 * Array of indexes which are in the current display (after filtering etc)
		 */
		"aiDisplay": [],
	
		/**
		 * Array of indexes for display - no filtering
		 */
		"aiDisplayMaster": [],
	
		/**
		 * Map of row ids to data indexes
		 */
		"aIds": {},
	
		/**
		 * Store information about each column that is in use
		 */
		"aoColumns": [],
	
		/**
		 * Store information about the table's header
		 */
		"aoHeader": [],
	
		/**
		 * Store information about the table's footer
		 */
		"aoFooter": [],
	
		/**
		 * Store the applied global search information in case we want to force a
		 * research or compare the old search to a new one.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 */
		"oPreviousSearch": {},
	
		/**
		 * Store for named searches
		 */
		searchFixed: {},
	
		/**
		 * Store the applied search for each column - see
		 * {@link DataTable.models.oSearch} for the format that is used for the
		 * filtering information for each column.
		 */
		"aoPreSearchCols": [],
	
		/**
		 * Sorting that is applied to the table. Note that the inner arrays are
		 * used in the following manner:
		 * <ul>
		 *   <li>Index 0 - column number</li>
		 *   <li>Index 1 - current sorting direction</li>
		 * </ul>
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 */
		"aaSorting": null,
	
		/**
		 * Sorting that is always applied to the table (i.e. prefixed in front of
		 * aaSorting).
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 */
		"aaSortingFixed": [],
	
		/**
		 * If restoring a table - we should restore its width
		 */
		"sDestroyWidth": 0,
	
		/**
		 * Callback functions array for every time a row is inserted (i.e. on a draw).
		 */
		"aoRowCallback": [],
	
		/**
		 * Callback functions for the header on each draw.
		 */
		"aoHeaderCallback": [],
	
		/**
		 * Callback function for the footer on each draw.
		 */
		"aoFooterCallback": [],
	
		/**
		 * Array of callback functions for draw callback functions
		 */
		"aoDrawCallback": [],
	
		/**
		 * Array of callback functions for row created function
		 */
		"aoRowCreatedCallback": [],
	
		/**
		 * Callback functions for just before the table is redrawn. A return of
		 * false will be used to cancel the draw.
		 */
		"aoPreDrawCallback": [],
	
		/**
		 * Callback functions for when the table has been initialised.
		 */
		"aoInitComplete": [],
	
	
		/**
		 * Callbacks for modifying the settings to be stored for state saving, prior to
		 * saving state.
		 */
		"aoStateSaveParams": [],
	
		/**
		 * Callbacks for modifying the settings that have been stored for state saving
		 * prior to using the stored values to restore the state.
		 */
		"aoStateLoadParams": [],
	
		/**
		 * Callbacks for operating on the settings object once the saved state has been
		 * loaded
		 */
		"aoStateLoaded": [],
	
		/**
		 * Cache the table ID for quick access
		 */
		"sTableId": "",
	
		/**
		 * The TABLE node for the main table
		 */
		"nTable": null,
	
		/**
		 * Permanent ref to the thead element
		 */
		"nTHead": null,
	
		/**
		 * Permanent ref to the tfoot element - if it exists
		 */
		"nTFoot": null,
	
		/**
		 * Permanent ref to the tbody element
		 */
		"nTBody": null,
	
		/**
		 * Cache the wrapper node (contains all DataTables controlled elements)
		 */
		"nTableWrapper": null,
	
		/**
		 * Indicate if all required information has been read in
		 */
		"bInitialised": false,
	
		/**
		 * Information about open rows. Each object in the array has the parameters
		 * 'nTr' and 'nParent'
		 */
		"aoOpenRows": [],
	
		/**
		 * Dictate the positioning of DataTables' control elements - see
		 * {@link DataTable.model.oInit.sDom}.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 */
		"sDom": null,
	
		/**
		 * Search delay (in mS)
		 */
		"searchDelay": null,
	
		/**
		 * Which type of pagination should be used.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 */
		"sPaginationType": "two_button",
	
		/**
		 * Number of paging controls on the page. Only used for backwards compatibility
		 */
		pagingControls: 0,
	
		/**
		 * The state duration (for `stateSave`) in seconds.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 */
		"iStateDuration": 0,
	
		/**
		 * Array of callback functions for state saving. Each array element is an
		 * object with the following parameters:
		 *   <ul>
		 *     <li>function:fn - function to call. Takes two parameters, oSettings
		 *       and the JSON string to save that has been thus far created. Returns
		 *       a JSON string to be inserted into a json object
		 *       (i.e. '"param": [ 0, 1, 2]')</li>
		 *     <li>string:sName - name of callback</li>
		 *   </ul>
		 */
		"aoStateSave": [],
	
		/**
		 * Array of callback functions for state loading. Each array element is an
		 * object with the following parameters:
		 *   <ul>
		 *     <li>function:fn - function to call. Takes two parameters, oSettings
		 *       and the object stored. May return false to cancel state loading</li>
		 *     <li>string:sName - name of callback</li>
		 *   </ul>
		 */
		"aoStateLoad": [],
	
		/**
		 * State that was saved. Useful for back reference
		 */
		"oSavedState": null,
	
		/**
		 * State that was loaded. Useful for back reference
		 */
		"oLoadedState": null,
	
		/**
		 * Note if draw should be blocked while getting data
		 */
		"bAjaxDataGet": true,
	
		/**
		 * The last jQuery XHR object that was used for server-side data gathering.
		 * This can be used for working with the XHR information in one of the
		 * callbacks
		 */
		"jqXHR": null,
	
		/**
		 * JSON returned from the server in the last Ajax request
		 */
		"json": undefined,
	
		/**
		 * Data submitted as part of the last Ajax request
		 */
		"oAjaxData": undefined,
	
		/**
		 * Send the XHR HTTP method - GET or POST (could be PUT or DELETE if
		 * required).
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 */
		"sServerMethod": null,
	
		/**
		 * Format numbers for display.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 */
		"fnFormatNumber": null,
	
		/**
		 * List of options that can be used for the user selectable length menu.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 */
		"aLengthMenu": null,
	
		/**
		 * Counter for the draws that the table does. Also used as a tracker for
		 * server-side processing
		 */
		"iDraw": 0,
	
		/**
		 * Indicate if a redraw is being done - useful for Ajax
		 */
		"bDrawing": false,
	
		/**
		 * Draw index (iDraw) of the last error when parsing the returned data
		 */
		"iDrawError": -1,
	
		/**
		 * Paging display length
		 */
		"_iDisplayLength": 10,
	
		/**
		 * Paging start point - aiDisplay index
		 */
		"_iDisplayStart": 0,
	
		/**
		 * Server-side processing - number of records in the result set
		 * (i.e. before filtering), Use fnRecordsTotal rather than
		 * this property to get the value of the number of records, regardless of
		 * the server-side processing setting.
		 */
		"_iRecordsTotal": 0,
	
		/**
		 * Server-side processing - number of records in the current display set
		 * (i.e. after filtering). Use fnRecordsDisplay rather than
		 * this property to get the value of the number of records, regardless of
		 * the server-side processing setting.
		 */
		"_iRecordsDisplay": 0,
	
		/**
		 * The classes to use for the table
		 */
		"oClasses": {},
	
		/**
		 * Flag attached to the settings object so you can check in the draw
		 * callback if filtering has been done in the draw. Deprecated in favour of
		 * events.
		 *  @deprecated
		 */
		"bFiltered": false,
	
		/**
		 * Flag attached to the settings object so you can check in the draw
		 * callback if sorting has been done in the draw. Deprecated in favour of
		 * events.
		 *  @deprecated
		 */
		"bSorted": false,
	
		/**
		 * Indicate that if multiple rows are in the header and there is more than
		 * one unique cell per column, if the top one (true) or bottom one (false)
		 * should be used for sorting / title by DataTables.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 */
		"bSortCellsTop": null,
	
		/**
		 * Initialisation object that is used for the table
		 */
		"oInit": null,
	
		/**
		 * Destroy callback functions - for plug-ins to attach themselves to the
		 * destroy so they can clean up markup and events.
		 */
		"aoDestroyCallback": [],
	
	
		/**
		 * Get the number of records in the current record set, before filtering
		 */
		"fnRecordsTotal": function ()
		{
			return _fnDataSource( this ) == 'ssp' ?
				this._iRecordsTotal * 1 :
				this.aiDisplayMaster.length;
		},
	
		/**
		 * Get the number of records in the current record set, after filtering
		 */
		"fnRecordsDisplay": function ()
		{
			return _fnDataSource( this ) == 'ssp' ?
				this._iRecordsDisplay * 1 :
				this.aiDisplay.length;
		},
	
		/**
		 * Get the display end point - aiDisplay index
		 */
		"fnDisplayEnd": function ()
		{
			var
				len      = this._iDisplayLength,
				start    = this._iDisplayStart,
				calc     = start + len,
				records  = this.aiDisplay.length,
				features = this.oFeatures,
				paginate = features.bPaginate;
	
			if ( features.bServerSide ) {
				return paginate === false || len === -1 ?
					start + records :
					Math.min( start+len, this._iRecordsDisplay );
			}
			else {
				return ! paginate || calc>records || len===-1 ?
					records :
					calc;
			}
		},
	
		/**
		 * The DataTables object for this table
		 */
		"oInstance": null,
	
		/**
		 * Unique identifier for each instance of the DataTables object. If there
		 * is an ID on the table node, then it takes that value, otherwise an
		 * incrementing internal counter is used.
		 */
		"sInstance": null,
	
		/**
		 * tabindex attribute value that is added to DataTables control elements, allowing
		 * keyboard navigation of the table and its controls.
		 */
		"iTabIndex": 0,
	
		/**
		 * DIV container for the footer scrolling table if scrolling
		 */
		"nScrollHead": null,
	
		/**
		 * DIV container for the footer scrolling table if scrolling
		 */
		"nScrollFoot": null,
	
		/**
		 * Last applied sort
		 */
		"aLastSort": [],
	
		/**
		 * Stored plug-in instances
		 */
		"oPlugins": {},
	
		/**
		 * Function used to get a row's id from the row's data
		 */
		"rowIdFn": null,
	
		/**
		 * Data location where to store a row's id
		 */
		"rowId": null,
	
		caption: '',
	
		captionNode: null,
	
		colgroup: null
	};
	
	/**
	 * Extension object for DataTables that is used to provide all extension
	 * options.
	 *
	 * Note that the `DataTable.ext` object is available through
	 * `jQuery.fn.dataTable.ext` where it may be accessed and manipulated. It is
	 * also aliased to `jQuery.fn.dataTableExt` for historic reasons.
	 *  @namespace
	 *  @extends DataTable.models.ext
	 */
	
	
	/**
	 * DataTables extensions
	 * 
	 * This namespace acts as a collection area for plug-ins that can be used to
	 * extend DataTables capabilities. Indeed many of the build in methods
	 * use this method to provide their own capabilities (sorting methods for
	 * example).
	 *
	 * Note that this namespace is aliased to `jQuery.fn.dataTableExt` for legacy
	 * reasons
	 *
	 *  @namespace
	 */
	DataTable.ext = _ext = {
		/**
		 * Buttons. For use with the Buttons extension for DataTables. This is
		 * defined here so other extensions can define buttons regardless of load
		 * order. It is _not_ used by DataTables core.
		 *
		 *  @type object
		 *  @default {}
		 */
		buttons: {},
	
	
		/**
		 * Element class names
		 *
		 *  @type object
		 *  @default {}
		 */
		classes: {},
	
	
		/**
		 * DataTables build type (expanded by the download builder)
		 *
		 *  @type string
		 */
		build:"bs5/dt-2.0.2/e-2.3.1",
	
	
		/**
		 * Error reporting.
		 * 
		 * How should DataTables report an error. Can take the value 'alert',
		 * 'throw', 'none' or a function.
		 *
		 *  @type string|function
		 *  @default alert
		 */
		errMode: "alert",
	
	
		/**
		 * Legacy so v1 plug-ins don't throw js errors on load
		 */
		feature: [],
	
		/**
		 * Feature plug-ins.
		 * 
		 * This is an object of callbacks which provide the features for DataTables
		 * to be initialised via the `layout` option.
		 */
		features: {},
	
	
		/**
		 * Row searching.
		 * 
		 * This method of searching is complimentary to the default type based
		 * searching, and a lot more comprehensive as it allows you complete control
		 * over the searching logic. Each element in this array is a function
		 * (parameters described below) that is called for every row in the table,
		 * and your logic decides if it should be included in the searching data set
		 * or not.
		 *
		 * Searching functions have the following input parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 * 2. `{array|object}` Data for the row to be processed (same as the
		 *    original format that was passed in as the data source, or an array
		 *    from a DOM data source
		 * 3. `{int}` Row index ({@link DataTable.models.oSettings.aoData}), which
		 *    can be useful to retrieve the `TR` element if you need DOM interaction.
		 *
		 * And the following return is expected:
		 *
		 * * {boolean} Include the row in the searched result set (true) or not
		 *   (false)
		 *
		 * Note that as with the main search ability in DataTables, technically this
		 * is "filtering", since it is subtractive. However, for consistency in
		 * naming we call it searching here.
		 *
		 *  @type array
		 *  @default []
		 *
		 *  @example
		 *    // The following example shows custom search being applied to the
		 *    // fourth column (i.e. the data[3] index) based on two input values
		 *    // from the end-user, matching the data in a certain range.
		 *    $.fn.dataTable.ext.search.push(
		 *      function( settings, data, dataIndex ) {
		 *        var min = document.getElementById('min').value * 1;
		 *        var max = document.getElementById('max').value * 1;
		 *        var version = data[3] == "-" ? 0 : data[3]*1;
		 *
		 *        if ( min == "" && max == "" ) {
		 *          return true;
		 *        }
		 *        else if ( min == "" && version < max ) {
		 *          return true;
		 *        }
		 *        else if ( min < version && "" == max ) {
		 *          return true;
		 *        }
		 *        else if ( min < version && version < max ) {
		 *          return true;
		 *        }
		 *        return false;
		 *      }
		 *    );
		 */
		search: [],
	
	
		/**
		 * Selector extensions
		 *
		 * The `selector` option can be used to extend the options available for the
		 * selector modifier options (`selector-modifier` object data type) that
		 * each of the three built in selector types offer (row, column and cell +
		 * their plural counterparts). For example the Select extension uses this
		 * mechanism to provide an option to select only rows, columns and cells
		 * that have been marked as selected by the end user (`{selected: true}`),
		 * which can be used in conjunction with the existing built in selector
		 * options.
		 *
		 * Each property is an array to which functions can be pushed. The functions
		 * take three attributes:
		 *
		 * * Settings object for the host table
		 * * Options object (`selector-modifier` object type)
		 * * Array of selected item indexes
		 *
		 * The return is an array of the resulting item indexes after the custom
		 * selector has been applied.
		 *
		 *  @type object
		 */
		selector: {
			cell: [],
			column: [],
			row: []
		},
	
	
		/**
		 * Legacy configuration options. Enable and disable legacy options that
		 * are available in DataTables.
		 *
		 *  @type object
		 */
		legacy: {
			/**
			 * Enable / disable DataTables 1.9 compatible server-side processing
			 * requests
			 *
			 *  @type boolean
			 *  @default null
			 */
			ajax: null
		},
	
	
		/**
		 * Pagination plug-in methods.
		 * 
		 * Each entry in this object is a function and defines which buttons should
		 * be shown by the pagination rendering method that is used for the table:
		 * {@link DataTable.ext.renderer.pageButton}. The renderer addresses how the
		 * buttons are displayed in the document, while the functions here tell it
		 * what buttons to display. This is done by returning an array of button
		 * descriptions (what each button will do).
		 *
		 * Pagination types (the four built in options and any additional plug-in
		 * options defined here) can be used through the `paginationType`
		 * initialisation parameter.
		 *
		 * The functions defined take two parameters:
		 *
		 * 1. `{int} page` The current page index
		 * 2. `{int} pages` The number of pages in the table
		 *
		 * Each function is expected to return an array where each element of the
		 * array can be one of:
		 *
		 * * `first` - Jump to first page when activated
		 * * `last` - Jump to last page when activated
		 * * `previous` - Show previous page when activated
		 * * `next` - Show next page when activated
		 * * `{int}` - Show page of the index given
		 * * `{array}` - A nested array containing the above elements to add a
		 *   containing 'DIV' element (might be useful for styling).
		 *
		 * Note that DataTables v1.9- used this object slightly differently whereby
		 * an object with two functions would be defined for each plug-in. That
		 * ability is still supported by DataTables 1.10+ to provide backwards
		 * compatibility, but this option of use is now decremented and no longer
		 * documented in DataTables 1.10+.
		 *
		 *  @type object
		 *  @default {}
		 *
		 *  @example
		 *    // Show previous, next and current page buttons only
		 *    $.fn.dataTableExt.oPagination.current = function ( page, pages ) {
		 *      return [ 'previous', page, 'next' ];
		 *    };
		 */
		pager: {},
	
	
		renderer: {
			pageButton: {},
			header: {}
		},
	
	
		/**
		 * Ordering plug-ins - custom data source
		 * 
		 * The extension options for ordering of data available here is complimentary
		 * to the default type based ordering that DataTables typically uses. It
		 * allows much greater control over the the data that is being used to
		 * order a column, but is necessarily therefore more complex.
		 * 
		 * This type of ordering is useful if you want to do ordering based on data
		 * live from the DOM (for example the contents of an 'input' element) rather
		 * than just the static string that DataTables knows of.
		 * 
		 * The way these plug-ins work is that you create an array of the values you
		 * wish to be ordering for the column in question and then return that
		 * array. The data in the array much be in the index order of the rows in
		 * the table (not the currently ordering order!). Which order data gathering
		 * function is run here depends on the `dt-init columns.orderDataType`
		 * parameter that is used for the column (if any).
		 *
		 * The functions defined take two parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 * 2. `{int}` Target column index
		 *
		 * Each function is expected to return an array:
		 *
		 * * `{array}` Data for the column to be ordering upon
		 *
		 *  @type array
		 *
		 *  @example
		 *    // Ordering using `input` node values
		 *    $.fn.dataTable.ext.order['dom-text'] = function  ( settings, col )
		 *    {
		 *      return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
		 *        return $('input', td).val();
		 *      } );
		 *    }
		 */
		order: {},
	
	
		/**
		 * Type based plug-ins.
		 *
		 * Each column in DataTables has a type assigned to it, either by automatic
		 * detection or by direct assignment using the `type` option for the column.
		 * The type of a column will effect how it is ordering and search (plug-ins
		 * can also make use of the column type if required).
		 *
		 * @namespace
		 */
		type: {
			/**
			 * Automatic column class assignment
			 */
			className: {},
	
			/**
			 * Type detection functions.
			 *
			 * The functions defined in this object are used to automatically detect
			 * a column's type, making initialisation of DataTables super easy, even
			 * when complex data is in the table.
			 *
			 * The functions defined take two parameters:
			 *
		     *  1. `{*}` Data from the column cell to be analysed
		     *  2. `{settings}` DataTables settings object. This can be used to
		     *     perform context specific type detection - for example detection
		     *     based on language settings such as using a comma for a decimal
		     *     place. Generally speaking the options from the settings will not
		     *     be required
			 *
			 * Each function is expected to return:
			 *
			 * * `{string|null}` Data type detected, or null if unknown (and thus
			 *   pass it on to the other type detection functions.
			 *
			 *  @type array
			 *
			 *  @example
			 *    // Currency type detection plug-in:
			 *    $.fn.dataTable.ext.type.detect.push(
			 *      function ( data, settings ) {
			 *        // Check the numeric part
			 *        if ( ! data.substring(1).match(/[0-9]/) ) {
			 *          return null;
			 *        }
			 *
			 *        // Check prefixed by currency
			 *        if ( data.charAt(0) == '$' || data.charAt(0) == '&pound;' ) {
			 *          return 'currency';
			 *        }
			 *        return null;
			 *      }
			 *    );
			 */
			detect: [],
	
			/**
			 * Automatic renderer assignment
			 */
			render: {},
	
	
			/**
			 * Type based search formatting.
			 *
			 * The type based searching functions can be used to pre-format the
			 * data to be search on. For example, it can be used to strip HTML
			 * tags or to de-format telephone numbers for numeric only searching.
			 *
			 * Note that is a search is not defined for a column of a given type,
			 * no search formatting will be performed.
			 * 
			 * Pre-processing of searching data plug-ins - When you assign the sType
			 * for a column (or have it automatically detected for you by DataTables
			 * or a type detection plug-in), you will typically be using this for
			 * custom sorting, but it can also be used to provide custom searching
			 * by allowing you to pre-processing the data and returning the data in
			 * the format that should be searched upon. This is done by adding
			 * functions this object with a parameter name which matches the sType
			 * for that target column. This is the corollary of <i>afnSortData</i>
			 * for searching data.
			 *
			 * The functions defined take a single parameter:
			 *
		     *  1. `{*}` Data from the column cell to be prepared for searching
			 *
			 * Each function is expected to return:
			 *
			 * * `{string|null}` Formatted string that will be used for the searching.
			 *
			 *  @type object
			 *  @default {}
			 *
			 *  @example
			 *    $.fn.dataTable.ext.type.search['title-numeric'] = function ( d ) {
			 *      return d.replace(/\n/g," ").replace( /<.*?>/g, "" );
			 *    }
			 */
			search: {},
	
	
			/**
			 * Type based ordering.
			 *
			 * The column type tells DataTables what ordering to apply to the table
			 * when a column is sorted upon. The order for each type that is defined,
			 * is defined by the functions available in this object.
			 *
			 * Each ordering option can be described by three properties added to
			 * this object:
			 *
			 * * `{type}-pre` - Pre-formatting function
			 * * `{type}-asc` - Ascending order function
			 * * `{type}-desc` - Descending order function
			 *
			 * All three can be used together, only `{type}-pre` or only
			 * `{type}-asc` and `{type}-desc` together. It is generally recommended
			 * that only `{type}-pre` is used, as this provides the optimal
			 * implementation in terms of speed, although the others are provided
			 * for compatibility with existing Javascript sort functions.
			 *
			 * `{type}-pre`: Functions defined take a single parameter:
			 *
		     *  1. `{*}` Data from the column cell to be prepared for ordering
			 *
			 * And return:
			 *
			 * * `{*}` Data to be sorted upon
			 *
			 * `{type}-asc` and `{type}-desc`: Functions are typical Javascript sort
			 * functions, taking two parameters:
			 *
		     *  1. `{*}` Data to compare to the second parameter
		     *  2. `{*}` Data to compare to the first parameter
			 *
			 * And returning:
			 *
			 * * `{*}` Ordering match: <0 if first parameter should be sorted lower
			 *   than the second parameter, ===0 if the two parameters are equal and
			 *   >0 if the first parameter should be sorted height than the second
			 *   parameter.
			 * 
			 *  @type object
			 *  @default {}
			 *
			 *  @example
			 *    // Numeric ordering of formatted numbers with a pre-formatter
			 *    $.extend( $.fn.dataTable.ext.type.order, {
			 *      "string-pre": function(x) {
			 *        a = (a === "-" || a === "") ? 0 : a.replace( /[^\d\-\.]/g, "" );
			 *        return parseFloat( a );
			 *      }
			 *    } );
			 *
			 *  @example
			 *    // Case-sensitive string ordering, with no pre-formatting method
			 *    $.extend( $.fn.dataTable.ext.order, {
			 *      "string-case-asc": function(x,y) {
			 *        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			 *      },
			 *      "string-case-desc": function(x,y) {
			 *        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
			 *      }
			 *    } );
			 */
			order: {}
		},
	
		/**
		 * Unique DataTables instance counter
		 *
		 * @type int
		 * @private
		 */
		_unique: 0,
	
	
		//
		// Depreciated
		// The following properties are retained for backwards compatibility only.
		// The should not be used in new projects and will be removed in a future
		// version
		//
	
		/**
		 * Version check function.
		 *  @type function
		 *  @depreciated Since 1.10
		 */
		fnVersionCheck: DataTable.fnVersionCheck,
	
	
		/**
		 * Index for what 'this' index API functions should use
		 *  @type int
		 *  @deprecated Since v1.10
		 */
		iApiIndex: 0,
	
	
		/**
		 * Software version
		 *  @type string
		 *  @deprecated Since v1.10
		 */
		sVersion: DataTable.version
	};
	
	
	//
	// Backwards compatibility. Alias to pre 1.10 Hungarian notation counter parts
	//
	$.extend( _ext, {
		afnFiltering: _ext.search,
		aTypes:       _ext.type.detect,
		ofnSearch:    _ext.type.search,
		oSort:        _ext.type.order,
		afnSortData:  _ext.order,
		aoFeatures:   _ext.feature,
		oStdClasses:  _ext.classes,
		oPagination:  _ext.pager
	} );
	
	
	$.extend( DataTable.ext.classes, {
		container: 'dt-container',
		empty: {
			row: 'dt-empty'
		},
		info: {
			container: 'dt-info'
		},
		length: {
			container: 'dt-length',
			select: 'dt-input'
		},
		order: {
			canAsc: 'dt-orderable-asc',
			canDesc: 'dt-orderable-desc',
			isAsc: 'dt-ordering-asc',
			isDesc: 'dt-ordering-desc',
			none: 'dt-orderable-none',
			position: 'sorting_'
		},
		processing: {
			container: 'dt-processing'
		},
		scrolling: {
			body: 'dt-scroll-body',
			container: 'dt-scroll',
			footer: {
				self: 'dt-scroll-foot',
				inner: 'dt-scroll-footInner'
			},
			header: {
				self: 'dt-scroll-head',
				inner: 'dt-scroll-headInner'
			}
		},
		search: {
			container: 'dt-search',
			input: 'dt-input'
		},
		table: 'dataTable',	
		tbody: {
			cell: '',
			row: ''
		},
		thead: {
			cell: '',
			row: ''
		},
		tfoot: {
			cell: '',
			row: ''
		},
		paging: {
			active: 'current',
			button: 'dt-paging-button',
			container: 'dt-paging',
			disabled: 'disabled'
		}
	} );
	
	
	var extPagination = DataTable.ext.pager;
	
	// Paging buttons configuration
	$.extend( extPagination, {
		simple: function () {
			return [ 'previous', 'next' ];
		},
	
		full: function () {
			return [  'first', 'previous', 'next', 'last' ];
		},
	
		numbers: function () {
			return [ 'numbers' ];
		},
	
		simple_numbers: function () {
			return [ 'previous', 'numbers', 'next' ];
		},
	
		full_numbers: function () {
			return [ 'first', 'previous', 'numbers', 'next', 'last' ];
		},
		
		first_last: function () {
			return ['first', 'last'];
		},
		
		first_last_numbers: function () {
			return ['first', 'numbers', 'last'];
		},
	
		// For testing and plug-ins to use
		_numbers: _pagingNumbers,
	
		// Number of number buttons - legacy, use `numbers` option for paging feature
		numbers_length: 7
	} );
	
	
	$.extend( true, DataTable.ext.renderer, {
		pagingButton: {
			_: function (settings, buttonType, content, active, disabled) {
				var classes = settings.oClasses.paging;
				var btnClasses = [classes.button];
				var btn;
	
				if (active) {
					btnClasses.push(classes.active);
				}
	
				if (disabled) {
					btnClasses.push(classes.disabled)
				}
	
				if (buttonType === 'ellipsis') {
					btn = $('<span class="ellipsis"></span>').html(content)[0];
				}
				else {
					btn = $('<button>', {
						class: btnClasses.join(' '),
						role: 'link',
						type: 'button'
					}).html(content);
				}
	
				return {
					display: btn,
					clicker: btn
				}
			}
		},
	
		pagingContainer: {
			_: function (settings, buttons) {
				// No wrapping element - just append directly to the host
				return buttons;
			}
		}
	} );
	
	// Common function to remove new lines, strip HTML and diacritic control
	var _filterString = function (stripHtml, normalize) {
		return function (str) {
			if (_empty(str) || typeof str !== 'string') {
				return str;
			}
	
			str = str.replace( _re_new_lines, " " );
	
			if (stripHtml) {
				str = _stripHtml(str);
			}
	
			if (normalize) {
				str = _normalize(str, false);
			}
	
			return str;
		};
	}
	
	/*
	 * Public helper functions. These aren't used internally by DataTables, or
	 * called by any of the options passed into DataTables, but they can be used
	 * externally by developers working with DataTables. They are helper functions
	 * to make working with DataTables a little bit easier.
	 */
	
	function __mldFnName(name) {
		return name.replace(/[\W]/g, '_')
	}
	
	// Common logic for moment, luxon or a date action
	function __mld( dt, momentFn, luxonFn, dateFn, arg1 ) {
		if (window.moment) {
			return dt[momentFn]( arg1 );
		}
		else if (window.luxon) {
			return dt[luxonFn]( arg1 );
		}
		
		return dateFn ? dt[dateFn]( arg1 ) : dt;
	}
	
	
	var __mlWarning = false;
	function __mldObj (d, format, locale) {
		var dt;
	
		if (window.moment) {
			dt = window.moment.utc( d, format, locale, true );
	
			if (! dt.isValid()) {
				return null;
			}
		}
		else if (window.luxon) {
			dt = format && typeof d === 'string'
				? window.luxon.DateTime.fromFormat( d, format )
				: window.luxon.DateTime.fromISO( d );
	
			if (! dt.isValid) {
				return null;
			}
	
			dt.setLocale(locale);
		}
		else if (! format) {
			// No format given, must be ISO
			dt = new Date(d);
		}
		else {
			if (! __mlWarning) {
				alert('DataTables warning: Formatted date without Moment.js or Luxon - https://datatables.net/tn/17');
			}
	
			__mlWarning = true;
		}
	
		return dt;
	}
	
	// Wrapper for date, datetime and time which all operate the same way with the exception of
	// the output string for auto locale support
	function __mlHelper (localeString) {
		return function ( from, to, locale, def ) {
			// Luxon and Moment support
			// Argument shifting
			if ( arguments.length === 0 ) {
				locale = 'en';
				to = null; // means toLocaleString
				from = null; // means iso8601
			}
			else if ( arguments.length === 1 ) {
				locale = 'en';
				to = from;
				from = null;
			}
			else if ( arguments.length === 2 ) {
				locale = to;
				to = from;
				from = null;
			}
	
			var typeName = 'datetime' + (to ? '-' + __mldFnName(to) : '');
	
			// Add type detection and sorting specific to this date format - we need to be able to identify
			// date type columns as such, rather than as numbers in extensions. Hence the need for this.
			if (! DataTable.ext.type.order[typeName]) {
				DataTable.type(typeName, {
					detect: function (d) {
						// The renderer will give the value to type detect as the type!
						return d === typeName ? typeName : false;
					},
					order: {
						pre: function (d) {
							// The renderer gives us Moment, Luxon or Date obects for the sorting, all of which have a
							// `valueOf` which gives milliseconds epoch
							return d.valueOf();
						}
					},
					className: 'dt-right'
				});
			}
		
			return function ( d, type ) {
				// Allow for a default value
				if (d === null || d === undefined) {
					if (def === '--now') {
						// We treat everything as UTC further down, so no changes are
						// made, as such need to get the local date / time as if it were
						// UTC
						var local = new Date();
						d = new Date( Date.UTC(
							local.getFullYear(), local.getMonth(), local.getDate(),
							local.getHours(), local.getMinutes(), local.getSeconds()
						) );
					}
					else {
						d = '';
					}
				}
	
				if (type === 'type') {
					// Typing uses the type name for fast matching
					return typeName;
				}
	
				if (d === '') {
					return type !== 'sort'
						? ''
						: __mldObj('0000-01-01 00:00:00', null, locale);
				}
	
				// Shortcut. If `from` and `to` are the same, we are using the renderer to
				// format for ordering, not display - its already in the display format.
				if ( to !== null && from === to && type !== 'sort' && type !== 'type' && ! (d instanceof Date) ) {
					return d;
				}
	
				var dt = __mldObj(d, from, locale);
	
				if (dt === null) {
					return d;
				}
	
				if (type === 'sort') {
					return dt;
				}
				
				var formatted = to === null
					? __mld(dt, 'toDate', 'toJSDate', '')[localeString]()
					: __mld(dt, 'format', 'toFormat', 'toISOString', to);
	
				// XSS protection
				return type === 'display' ?
					_escapeHtml( formatted ) :
					formatted;
			};
		}
	}
	
	// Based on locale, determine standard number formatting
	// Fallback for legacy browsers is US English
	var __thousands = ',';
	var __decimal = '.';
	
	if (window.Intl !== undefined) {
		try {
			var num = new Intl.NumberFormat().formatToParts(100000.1);
		
			for (var i=0 ; i<num.length ; i++) {
				if (num[i].type === 'group') {
					__thousands = num[i].value;
				}
				else if (num[i].type === 'decimal') {
					__decimal = num[i].value;
				}
			}
		}
		catch (e) {
			// noop
		}
	}
	
	// Formatted date time detection - use by declaring the formats you are going to use
	DataTable.datetime = function ( format, locale ) {
		var typeName = 'datetime-detect-' + __mldFnName(format);
	
		if (! locale) {
			locale = 'en';
		}
	
		if (! DataTable.ext.type.order[typeName]) {
			DataTable.type(typeName, {
				detect: function (d) {
					var dt = __mldObj(d, format, locale);
					return d === '' || dt ? typeName : false;
				},
				order: {
					pre: function (d) {
						return __mldObj(d, format, locale) || 0;
					}
				},
				className: 'dt-right'
			});
		}
	}
	
	/**
	 * Helpers for `columns.render`.
	 *
	 * The options defined here can be used with the `columns.render` initialisation
	 * option to provide a display renderer. The following functions are defined:
	 *
	 * * `moment` - Uses the MomentJS library to convert from a given format into another.
	 * This renderer has three overloads:
	 *   * 1 parameter:
	 *     * `string` - Format to convert to (assumes input is ISO8601 and locale is `en`)
	 *   * 2 parameters:
	 *     * `string` - Format to convert from
	 *     * `string` - Format to convert to. Assumes `en` locale
	 *   * 3 parameters:
	 *     * `string` - Format to convert from
	 *     * `string` - Format to convert to
	 *     * `string` - Locale
	 * * `number` - Will format numeric data (defined by `columns.data`) for
	 *   display, retaining the original unformatted data for sorting and filtering.
	 *   It takes 5 parameters:
	 *   * `string` - Thousands grouping separator
	 *   * `string` - Decimal point indicator
	 *   * `integer` - Number of decimal points to show
	 *   * `string` (optional) - Prefix.
	 *   * `string` (optional) - Postfix (/suffix).
	 * * `text` - Escape HTML to help prevent XSS attacks. It has no optional
	 *   parameters.
	 *
	 * @example
	 *   // Column definition using the number renderer
	 *   {
	 *     data: "salary",
	 *     render: $.fn.dataTable.render.number( '\'', '.', 0, '$' )
	 *   }
	 *
	 * @namespace
	 */
	DataTable.render = {
		date: __mlHelper('toLocaleDateString'),
		datetime: __mlHelper('toLocaleString'),
		time: __mlHelper('toLocaleTimeString'),
		number: function ( thousands, decimal, precision, prefix, postfix ) {
			// Auto locale detection
			if (thousands === null || thousands === undefined) {
				thousands = __thousands;
			}
	
			if (decimal === null || decimal === undefined) {
				decimal = __decimal;
			}
	
			return {
				display: function ( d ) {
					if ( typeof d !== 'number' && typeof d !== 'string' ) {
						return d;
					}
	
					if (d === '' || d === null) {
						return d;
					}
	
					var negative = d < 0 ? '-' : '';
					var flo = parseFloat( d );
					var abs = Math.abs(flo);
	
					// Scientific notation for large and small numbers
					if (abs >= 100000000000 || (abs < 0.0001 && abs !== 0) ) {
						var exp = flo.toExponential(precision).split(/e\+?/);
						return exp[0] + ' x 10<sup>' + exp[1] + '</sup>';
					}
	
					// If NaN then there isn't much formatting that we can do - just
					// return immediately, escaping any HTML (this was supposed to
					// be a number after all)
					if ( isNaN( flo ) ) {
						return _escapeHtml( d );
					}
	
					flo = flo.toFixed( precision );
					d = Math.abs( flo );
	
					var intPart = parseInt( d, 10 );
					var floatPart = precision ?
						decimal+(d - intPart).toFixed( precision ).substring( 2 ):
						'';
	
					// If zero, then can't have a negative prefix
					if (intPart === 0 && parseFloat(floatPart) === 0) {
						negative = '';
					}
	
					return negative + (prefix||'') +
						intPart.toString().replace(
							/\B(?=(\d{3})+(?!\d))/g, thousands
						) +
						floatPart +
						(postfix||'');
				}
			};
		},
	
		text: function () {
			return {
				display: _escapeHtml,
				filter: _escapeHtml
			};
		}
	};
	
	
	var _extTypes = DataTable.ext.type;
	
	// Get / set type
	DataTable.type = function (name, prop, val) {
		if (! prop) {
			return {
				className: _extTypes.className[name],
				detect: _extTypes.detect.find(function (fn) {
					return fn.name === name;
				}),
				order: {
					pre: _extTypes.order[name + '-pre'],
					asc: _extTypes.order[name + '-asc'],
					desc: _extTypes.order[name + '-desc']
				},
				render: _extTypes.render[name],
				search: _extTypes.search[name]
			};
		}
	
		var setProp = function(prop, propVal) {
			_extTypes[prop][name] = propVal;
		};
		var setDetect = function (fn) {
			// Wrap to allow the function to return `true` rather than
			// specifying the type name.
			var cb = function (d, s) {
				var ret = fn(d, s);
	
				return ret === true
					? name
					: ret;
			};
			Object.defineProperty(cb, "name", {value: name});
	
			var idx = _extTypes.detect.findIndex(function (fn) {
				return fn.name === name;
			});
	
			if (idx === -1) {
				_extTypes.detect.unshift(cb);
			}
			else {
				_extTypes.detect.splice(idx, 1, cb);
			}
		};
		var setOrder = function (obj) {
			_extTypes.order[name + '-pre'] = obj.pre; // can be undefined
			_extTypes.order[name + '-asc'] = obj.asc; // can be undefined
			_extTypes.order[name + '-desc'] = obj.desc; // can be undefined
		};
	
		// prop is optional
		if (val === undefined) {
			val = prop;
			prop = null;
		}
	
		if (prop === 'className') {
			setProp('className', val);
		}
		else if (prop === 'detect') {
			setDetect(val);
		}
		else if (prop === 'order') {
			setOrder(val);
		}
		else if (prop === 'render') {
			setProp('render', val);
		}
		else if (prop === 'search') {
			setProp('search', val);
		}
		else if (! prop) {
			if (val.className) {
				setProp('className', val.className);
			}
	
			if (val.detect !== undefined) {
				setDetect(val.detect);
			}
	
			if (val.order) {
				setOrder(val.order);
			}
	
			if (val.render !== undefined) {
				setProp('render', val.render);
			}
	
			if (val.search !== undefined) {
				setProp('search', val.search);
			}
		}
	}
	
	// Get a list of types
	DataTable.types = function () {
		return _extTypes.detect.map(function (fn) {
			return fn.name;
		});
	};
	
	//
	// Built in data types
	//
	
	DataTable.type('string', {
		detect: function () {
			return 'string';
		},
		order: {
			pre: function ( a ) {
				// This is a little complex, but faster than always calling toString,
				// http://jsperf.com/tostring-v-check
				return _empty(a) ?
					'' :
					typeof a === 'string' ?
						a.toLowerCase() :
						! a.toString ?
							'' :
							a.toString();
			}
		},
		search: _filterString(false, true)
	});
	
	
	DataTable.type('html', {
		detect: function ( d ) {
			return _empty( d ) || (typeof d === 'string' && d.indexOf('<') !== -1) ?
				'html' : null;
		},
		order: {
			pre: function ( a ) {
				return _empty(a) ?
					'' :
					a.replace ?
						_stripHtml(a).trim().toLowerCase() :
						a+'';
			}
		},
		search: _filterString(true, true)
	});
	
	
	DataTable.type('date', {
		className: 'dt-type-date',
		detect: function ( d )
		{
			// V8 tries _very_ hard to make a string passed into `Date.parse()`
			// valid, so we need to use a regex to restrict date formats. Use a
			// plug-in for anything other than ISO8601 style strings
			if ( d && !(d instanceof Date) && ! _re_date.test(d) ) {
				return null;
			}
			var parsed = Date.parse(d);
			return (parsed !== null && !isNaN(parsed)) || _empty(d) ? 'date' : null;
		},
		order: {
			pre: function ( d ) {
				var ts = Date.parse( d );
				return isNaN(ts) ? -Infinity : ts;
			}
		}
	});
	
	
	DataTable.type('html-num-fmt', {
		className: 'dt-type-numeric',
		detect: function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _htmlNumeric( d, decimal, true ) ? 'html-num-fmt' : null;
		},
		order: {
			pre: function ( d, s ) {
				var dp = s.oLanguage.sDecimal;
				return __numericReplace( d, dp, _re_html, _re_formatted_numeric );
			}
		},
		search: _filterString(true, true)
	});
	
	
	DataTable.type('html-num', {
		className: 'dt-type-numeric',
		detect: function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _htmlNumeric( d, decimal ) ? 'html-num' : null;
		},
		order: {
			pre: function ( d, s ) {
				var dp = s.oLanguage.sDecimal;
				return __numericReplace( d, dp, _re_html );
			}
		},
		search: _filterString(true, true)
	});
	
	
	DataTable.type('num-fmt', {
		className: 'dt-type-numeric',
		detect: function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _isNumber( d, decimal, true ) ? 'num-fmt' : null;
		},
		order: {
			pre: function ( d, s ) {
				var dp = s.oLanguage.sDecimal;
				return __numericReplace( d, dp, _re_formatted_numeric );
			}
		}
	});
	
	
	DataTable.type('num', {
		className: 'dt-type-numeric',
		detect: function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _isNumber( d, decimal ) ? 'num' : null;
		},
		order: {
			pre: function (d, s) {
				var dp = s.oLanguage.sDecimal;
				return __numericReplace( d, dp );
			}
		}
	});
	
	
	
	
	var __numericReplace = function ( d, decimalPlace, re1, re2 ) {
		if ( d !== 0 && (!d || d === '-') ) {
			return -Infinity;
		}
		
		var type = typeof d;
	
		if (type === 'number' || type === 'bigint') {
			return d;
		}
	
		// If a decimal place other than `.` is used, it needs to be given to the
		// function so we can detect it and replace with a `.` which is the only
		// decimal place Javascript recognises - it is not locale aware.
		if ( decimalPlace ) {
			d = _numToDecimal( d, decimalPlace );
		}
	
		if ( d.replace ) {
			if ( re1 ) {
				d = d.replace( re1, '' );
			}
	
			if ( re2 ) {
				d = d.replace( re2, '' );
			}
		}
	
		return d * 1;
	};
	
	
	$.extend( true, DataTable.ext.renderer, {
		footer: {
			_: function ( settings, cell, classes ) {
				cell.addClass(classes.tfoot.cell);
			}
		},
	
		header: {
			_: function ( settings, cell, classes ) {
				cell.addClass(classes.thead.cell);
	
				if (! settings.oFeatures.bSort) {
					cell.addClass(classes.order.none);
				}
	
				var legacyTop = settings.bSortCellsTop;
				var headerRows = cell.closest('thead').find('tr');
				var rowIdx = cell.parent().index();
	
				// Conditions to not apply the ordering icons
				if (
					// Cells and rows which have the attribute to disable the icons
					cell.attr('data-dt-order') === 'disable' ||
					cell.parent().attr('data-dt-order') === 'disable' ||
	
					// Legacy support for `orderCellsTop`. If it is set, then cells
					// which are not in the top or bottom row of the header (depending
					// on the value) do not get the sorting classes applied to them
					(legacyTop === true && rowIdx !== 0) ||
					(legacyTop === false && rowIdx !== headerRows.length - 1)
				) {
					return;
				}
	
				// No additional mark-up required
				// Attach a sort listener to update on sort - note that using the
				// `DT` namespace will allow the event to be removed automatically
				// on destroy, while the `dt` namespaced event is the one we are
				// listening for
				$(settings.nTable).on( 'order.dt.DT', function ( e, ctx, sorting ) {
					if ( settings !== ctx ) { // need to check this this is the host
						return;               // table, not a nested one
					}
	
					var orderClasses = classes.order;
					var columns = ctx.api.columns( cell );
					var col = settings.aoColumns[columns.flatten()[0]];
					var orderable = columns.orderable().includes(true);
					var ariaType = '';
					var indexes = columns.indexes();
					var sortDirs = columns.orderable(true).flatten();
					var orderedColumns = sorting.map( function (val) {
						return val.col;
					} ).join(',');
	
					cell
						.removeClass(
							orderClasses.isAsc +' '+
							orderClasses.isDesc
						)
						.toggleClass( orderClasses.none, ! orderable )
						.toggleClass( orderClasses.canAsc, orderable && sortDirs.includes('asc') )
						.toggleClass( orderClasses.canDesc, orderable && sortDirs.includes('desc') );
					
					var sortIdx = orderedColumns.indexOf( indexes.toArray().join(',') );
	
					if ( sortIdx !== -1 ) {
						// Get the ordering direction for the columns under this cell
						// Note that it is possible for a cell to be asc and desc sorting
						// (column spanning cells)
						var orderDirs = columns.order();
	
						cell.addClass(
							orderDirs.includes('asc') ? orderClasses.isAsc : '' +
							orderDirs.includes('desc') ? orderClasses.isDesc : ''
						);
					}
	
					// The ARIA spec says that only one column should be marked with aria-sort
					if ( sortIdx === 0 && orderedColumns.length === indexes.count() ) {
						var firstSort = sorting[0];
						var sortOrder = col.asSorting;
	
						cell.attr('aria-sort', firstSort.dir === 'asc' ? 'ascending' : 'descending');
	
						// Determine if the next click will remove sorting or change the sort
						ariaType = ! sortOrder[firstSort.index + 1] ? 'Remove' : 'Reverse';
					}
					else {
						cell.removeAttr('aria-sort');
					}
	
					cell.attr('aria-label', orderable
						? col.ariaTitle + ctx.api.i18n('oAria.orderable' + ariaType)
						: col.ariaTitle
					);
	
					if (orderable) {
						cell.find('.dt-column-title').attr('role', 'button');
						cell.attr('tabindex', 0)
					}
				} );
			}
		},
	
		layout: {
			_: function ( settings, container, items ) {
				var row = $('<div/>')
					.addClass('dt-layout-row')
					.appendTo( container );
	
				$.each( items, function (key, val) {
					var klass = ! val.table ?
						'dt-'+key+' ' :
						'';
	
					if (val.table) {
						row.addClass('dt-layout-table');
					}
	
					$('<div/>')
						.attr({
							id: val.id || null,
							"class": 'dt-layout-cell '+klass+(val.className || '')
						})
						.append( val.contents )
						.appendTo( row );
				} );
			}
		}
	} );
	
	
	DataTable.feature = {};
	
	// Third parameter is internal only!
	DataTable.feature.register = function ( name, cb, legacy ) {
		DataTable.ext.features[ name ] = cb;
	
		if (legacy) {
			_ext.feature.push({
				cFeature: legacy,
				fnInit: cb
			});
		}
	};
	
	DataTable.feature.register( 'info', function ( settings, opts ) {
		// For compatibility with the legacy `info` top level option
		if (! settings.oFeatures.bInfo) {
			return null;
		}
	
		var
			lang  = settings.oLanguage,
			tid = settings.sTableId,
			n = $('<div/>', {
				'class': settings.oClasses.info.container,
			} );
	
		opts = $.extend({
			callback: lang.fnInfoCallback,
			empty: lang.sInfoEmpty,
			postfix: lang.sInfoPostFix,
			search: lang.sInfoFiltered,
			text: lang.sInfo,
		}, opts);
	
	
		// Update display on each draw
		settings.aoDrawCallback.push(function (s) {
			_fnUpdateInfo(s, opts, n);
		});
	
		// For the first info display in the table, we add a callback and aria information.
		if (! $('#' + tid+'_info', settings.nWrapper).length) {
			n.attr({
				'aria-live': 'polite',
				id: tid+'_info',
				role: 'status'
			});
	
			// Table is described by our info div
			$(settings.nTable).attr( 'aria-describedby', tid+'_info' );
		}
	
		return n;
	}, 'i' );
	
	/**
	 * Update the information elements in the display
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnUpdateInfo ( settings, opts, node )
	{
		var
			start = settings._iDisplayStart+1,
			end   = settings.fnDisplayEnd(),
			max   = settings.fnRecordsTotal(),
			total = settings.fnRecordsDisplay(),
			out   = total
				? opts.text
				: opts.empty;
	
		if ( total !== max ) {
			// Record set after filtering
			out += ' ' + opts.search;
		}
	
		// Convert the macros
		out += opts.postfix;
		out = _fnMacros( settings, out );
	
		if ( opts.callback ) {
			out = opts.callback.call( settings.oInstance,
				settings, start, end, max, total, out
			);
		}
	
		node.html( out );
	
		_fnCallbackFire(settings, null, 'info', [settings, node[0], out]);
	}
	
	var __searchCounter = 0;
	
	// opts
	// - text
	// - placeholder
	DataTable.feature.register( 'search', function ( settings, opts ) {
		// Don't show the input if filtering isn't available on the table
		if (! settings.oFeatures.bFilter) {
			return null;
		}
	
		var classes = settings.oClasses.search;
		var tableId = settings.sTableId;
		var language = settings.oLanguage;
		var previousSearch = settings.oPreviousSearch;
		var input = '<input type="search" class="'+classes.input+'"/>';
	
		opts = $.extend({
			placeholder: language.sSearchPlaceholder,
			text: language.sSearch
		}, opts);
	
		// The _INPUT_ is optional - is appended if not present
		if (opts.text.indexOf('_INPUT_') === -1) {
			opts.text += '_INPUT_';
		}
	
		opts.text = _fnMacros(settings, opts.text);
	
		// We can put the <input> outside of the label if it is at the start or end
		// which helps improve accessability (not all screen readers like implicit
		// for elements).
		var end = opts.text.match(/_INPUT_$/);
		var start = opts.text.match(/^_INPUT_/);
		var removed = opts.text.replace(/_INPUT_/, '');
		var str = '<label>' + opts.text + '</label>';
	
		if (start) {
			str = '_INPUT_<label>' + removed + '</label>';
		}
		else if (end) {
			str = '<label>' + removed + '</label>_INPUT_';
		}
	
		var filter = $('<div>')
			.addClass(classes.container)
			.append(str.replace(/_INPUT_/, input));
	
		// add for and id to label and input
		filter.find('label').attr('for', 'dt-search-' + __searchCounter);
		filter.find('input').attr('id', 'dt-search-' + __searchCounter);
		__searchCounter++;
	
		var searchFn = function(event) {
			var val = this.value;
	
			if(previousSearch.return && event.key !== "Enter") {
				return;
			}
	
			/* Now do the filter */
			if ( val != previousSearch.search ) {
				previousSearch.search = val;
	
				_fnFilterComplete( settings, previousSearch );
	
				// Need to redraw, without resorting
				settings._iDisplayStart = 0;
				_fnDraw( settings );
			}
		};
	
		var searchDelay = settings.searchDelay !== null ?
			settings.searchDelay :
			0;
	
		var jqFilter = $('input', filter)
			.val( previousSearch.search )
			.attr( 'placeholder', opts.placeholder )
			.on(
				'keyup.DT search.DT input.DT paste.DT cut.DT',
				searchDelay ?
					DataTable.util.debounce( searchFn, searchDelay ) :
					searchFn
			)
			.on( 'mouseup.DT', function(e) {
				// Edge fix! Edge 17 does not trigger anything other than mouse events when clicking
				// on the clear icon (Edge bug 17584515). This is safe in other browsers as `searchFn`
				// checks the value to see if it has changed. In other browsers it won't have.
				setTimeout( function () {
					searchFn.call(jqFilter[0], e);
				}, 10);
			} )
			.on( 'keypress.DT', function(e) {
				/* Prevent form submission */
				if ( e.keyCode == 13 ) {
					return false;
				}
			} )
			.attr('aria-controls', tableId);
	
		// Update the input elements whenever the table is filtered
		$(settings.nTable).on( 'search.dt.DT', function ( ev, s ) {
			if ( settings === s && jqFilter[0] !== document.activeElement ) {
				jqFilter.val( typeof previousSearch.search !== 'function'
					? previousSearch.search
					: ''
				);
			}
		} );
	
		return filter;
	}, 'f' );
	
	// opts
	// - type - button configuration
	// - numbers - number of buttons to show - must be odd
	DataTable.feature.register( 'paging', function ( settings, opts ) {
		// Don't show the paging input if the table doesn't have paging enabled
		if (! settings.oFeatures.bPaginate) {
			return null;
		}
	
		opts = $.extend({
			numbers: DataTable.ext.pager.numbers_length,
			type: settings.sPaginationType
		}, opts)
	
		var host = $('<div/>').addClass( settings.oClasses.paging.container + ' paging_' + opts.type );
		var draw = function () {
			_pagingDraw(settings, host, opts);
		};
	
		settings.aoDrawCallback.push(draw);
	
		// Responsive redraw of paging control
		$(settings.nTable).on('column-sizing.dt.DT', draw);
	
		return host;
	}, 'p' );
	
	function _pagingDraw(settings, host, opts) {
		if (! settings._bInitComplete) {
			return;
		}
	
		var
			plugin = DataTable.ext.pager[ opts.type ],
			aria = settings.oLanguage.oAria.paginate || {},
			start      = settings._iDisplayStart,
			len        = settings._iDisplayLength,
			visRecords = settings.fnRecordsDisplay(),
			all        = len === -1,
			page = all ? 0 : Math.ceil( start / len ),
			pages = all ? 1 : Math.ceil( visRecords / len ),
			buttons = plugin()
				.map(function (val) {
					return val === 'numbers'
						? _pagingNumbers(page, pages, opts.numbers)
						: val;
				})
				.flat();
	
		var buttonEls = [];
	
		for (var i=0 ; i<buttons.length ; i++) {
			var button = buttons[i];
	
			var btnInfo = _pagingButtonInfo(settings, button, page, pages);
			var btn = _fnRenderer( settings, 'pagingButton' )(
				settings,
				button,
				btnInfo.display,
				btnInfo.active,
				btnInfo.disabled
			);
	
			// Common attributes
			$(btn.clicker).attr({
				'aria-controls': settings.sTableId,
				'aria-disabled': btnInfo.disabled ? 'true' : null,
				'aria-current': btnInfo.active ? 'page' : null,
				'aria-label': aria[ button ],
				'data-dt-idx': button,
				'tabIndex': btnInfo.disabled ? -1 : settings.iTabIndex,
			});
	
			if (typeof button !== 'number') {
				$(btn.clicker).addClass(button);
			}
	
			_fnBindAction(
				btn.clicker, {action: button}, function(e) {
					e.preventDefault();
	
					_fnPageChange( settings, e.data.action, true );
				}
			);
	
			buttonEls.push(btn.display);
		}
	
		var wrapped = _fnRenderer(settings, 'pagingContainer')(
			settings, buttonEls
		);
	
		var activeEl = host.find(document.activeElement).data('dt-idx');
	
		host.empty().append(wrapped);
	
		if ( activeEl !== undefined ) {
			host.find( '[data-dt-idx='+activeEl+']' ).trigger('focus');
		}
	
		// Responsive - check if the buttons are over two lines based on the
		// height of the buttons and the container.
		if (
			buttonEls.length && // any buttons
			opts.numbers > 1 && // prevent infinite
			$(host).height() >= ($(buttonEls[0]).outerHeight() * 2) - 10
		) {
			_pagingDraw(settings, host, $.extend({}, opts, { numbers: opts.numbers - 2 }));
		}
	}
	
	/**
	 * Get properties for a button based on the current paging state of the table
	 *
	 * @param {*} settings DT settings object
	 * @param {*} button The button type in question
	 * @param {*} page Table's current page
	 * @param {*} pages Number of pages
	 * @returns Info object
	 */
	function _pagingButtonInfo(settings, button, page, pages) {
		var lang = settings.oLanguage.oPaginate;
		var o = {
			display: '',
			active: false,
			disabled: false
		};
	
		switch ( button ) {
			case 'ellipsis':
				o.display = '&#x2026;';
				o.disabled = true;
				break;
	
			case 'first':
				o.display = lang.sFirst;
	
				if (page === 0) {
					o.disabled = true;
				}
				break;
	
			case 'previous':
				o.display = lang.sPrevious;
	
				if ( page === 0 ) {
					o.disabled = true;
				}
				break;
	
			case 'next':
				o.display = lang.sNext;
	
				if ( pages === 0 || page === pages-1 ) {
					o.disabled = true;
				}
				break;
	
			case 'last':
				o.display = lang.sLast;
	
				if ( pages === 0 || page === pages-1 ) {
					o.disabled = true;
				}
				break;
	
			default:
				if ( typeof button === 'number' ) {
					o.display = settings.fnFormatNumber( button + 1 );
					
					if (page === button) {
						o.active = true;
					}
				}
				break;
		}
	
		return o;
	}
	
	/**
	 * Compute what number buttons to show in the paging control
	 *
	 * @param {*} page Current page
	 * @param {*} pages Total number of pages
	 * @param {*} buttons Target number of number buttons
	 * @returns Buttons to show
	 */
	function _pagingNumbers ( page, pages, buttons ) {
		var
			numbers = [],
			half = Math.floor(buttons / 2);
	
		if ( pages <= buttons ) {
			numbers = _range(0, pages);
		}
		else if (buttons === 1) {
			// Single button - current page only
			numbers = [page];
		}
		else if (buttons === 3) {
			// Special logic for just three buttons
			if (page <= 1) {
				numbers = [0, 1, 'ellipsis'];
			}
			else if (page >= pages - 2) {
				numbers = _range(pages-2, pages);
				numbers.unshift('ellipsis');
			}
			else {
				numbers = ['ellipsis', page, 'ellipsis'];
			}
		}
		else if ( page <= half ) {
			numbers = _range(0, buttons-2);
			numbers.push('ellipsis', pages-1);
		}
		else if ( page >= pages - 1 - half ) {
			numbers = _range(pages-(buttons-2), pages);
			numbers.unshift(0, 'ellipsis');
		}
		else {
			numbers = _range(page-half+2, page+half-1);
			numbers.push('ellipsis', pages-1);
			numbers.unshift(0, 'ellipsis');
		}
	
		return numbers;
	}
	
	var __lengthCounter = 0;
	
	// opts
	// - menu
	// - text
	DataTable.feature.register( 'pageLength', function ( settings, opts ) {
		var features = settings.oFeatures;
	
		// For compatibility with the legacy `pageLength` top level option
		if (! features.bPaginate || ! features.bLengthChange) {
			return null;
		}
	
		opts = $.extend({
			menu: settings.aLengthMenu,
			text: settings.oLanguage.sLengthMenu
		}, opts);
	
		var
			classes  = settings.oClasses.length,
			tableId  = settings.sTableId,
			menu     = opts.menu,
			lengths  = [],
			language = [],
			i;
	
		// Options can be given in a number of ways
		if (Array.isArray( menu[0] )) {
			// Old 1.x style - 2D array
			lengths = menu[0];
			language = menu[1];
		}
		else {
			for ( i=0 ; i<menu.length ; i++ ) {
				// An object with different label and value
				if ($.isPlainObject(menu[i])) {
					lengths.push(menu[i].value);
					language.push(menu[i].label);
				}
				else {
					// Or just a number to display and use
					lengths.push(menu[i]);
					language.push(menu[i]);
				}
			}
		}
	
		// We can put the <select> outside of the label if it is at the start or
		// end which helps improve accessability (not all screen readers like
		// implicit for elements).
		var end = opts.text.match(/_MENU_$/);
		var start = opts.text.match(/^_MENU_/);
		var removed = opts.text.replace(/_MENU_/, '');
		var str = '<label>' + opts.text + '</label>';
	
		if (start) {
			str = '_MENU_<label>' + removed + '</label>';
		}
		else if (end) {
			str = '<label>' + removed + '</label>_MENU_';
		}
	
		// Wrapper element - use a span as a holder for where the select will go
		var div = $('<div/>')
			.addClass( classes.container )
			.append(
				str.replace( '_MENU_', '<span></span>' )
			);
	
		// Save text node content for macro updating
		var textNodes = [];
		div.find('label')[0].childNodes.forEach(function (el) {
			if (el.nodeType === Node.TEXT_NODE) {
				textNodes.push({
					el: el,
					text: el.textContent
				});
			}
		})
	
		// Update the label text in case it has an entries value
		var updateEntries = function (len) {
			textNodes.forEach(function (node) {
				node.el.textContent = _fnMacros(settings, node.text, len);
			});
		}
	
		// Next, the select itself, along with the options
		var select = $('<select/>', {
			'name':          tableId+'_length',
			'aria-controls': tableId,
			'class':         classes.select
		} );
	
		for ( i=0 ; i<lengths.length ; i++ ) {
			select[0][ i ] = new Option(
				typeof language[i] === 'number' ?
					settings.fnFormatNumber( language[i] ) :
					language[i],
				lengths[i]
			);
		}
	
		// add for and id to label and input
		div.find('label').attr('for', 'dt-length-' + __lengthCounter);
		select.attr('id', 'dt-length-' + __lengthCounter);
		__lengthCounter++;
	
		// Swap in the select list
		div.find('span').replaceWith(select);
	
		// Can't use `select` variable as user might provide their own and the
		// reference is broken by the use of outerHTML
		$('select', div)
			.val( settings._iDisplayLength )
			.on( 'change.DT', function() {
				_fnLengthChange( settings, $(this).val() );
				_fnDraw( settings );
			} );
	
		// Update node value whenever anything changes the table's length
		$(settings.nTable).on( 'length.dt.DT', function (e, s, len) {
			if ( settings === s ) {
				$('select', div).val( len );
	
				// Resolve plurals in the text for the new length
				updateEntries(len);
			}
		} );
	
		updateEntries(settings._iDisplayLength);
	
		return div;
	}, 'l' );
	
	// jQuery access
	$.fn.dataTable = DataTable;
	
	// Provide access to the host jQuery object (circular reference)
	DataTable.$ = $;
	
	// Legacy aliases
	$.fn.dataTableSettings = DataTable.settings;
	$.fn.dataTableExt = DataTable.ext;
	
	// With a capital `D` we return a DataTables API instance rather than a
	// jQuery object
	$.fn.DataTable = function ( opts ) {
		return $(this).dataTable( opts ).api();
	};
	
	// All properties that are available to $.fn.dataTable should also be
	// available on $.fn.DataTable
	$.each( DataTable, function ( prop, val ) {
		$.fn.DataTable[ prop ] = val;
	} );

	return DataTable;
}));


/*! DataTables Bootstrap 5 integration
 * 2020 SpryMedia Ltd - datatables.net/license
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		var jq = require('jquery');
		var cjsRequires = function (root, $) {
			if ( ! $.fn.dataTable ) {
				require('datatables.net')(root, $);
			}
		};

		if (typeof window === 'undefined') {
			module.exports = function (root, $) {
				if ( ! root ) {
					// CommonJS environments without a window global must pass a
					// root. This will give an error otherwise
					root = window;
				}

				if ( ! $ ) {
					$ = jq( root );
				}

				cjsRequires( root, $ );
				return factory( $, root, root.document );
			};
		}
		else {
			cjsRequires( window, jq );
			module.exports = factory( jq, window, window.document );
		}
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document ) {
'use strict';
var DataTable = $.fn.dataTable;



/**
 * DataTables integration for Bootstrap 5. This requires Bootstrap 5 and
 * DataTables 2 or newer.
 *
 * This file sets the defaults and adds options to DataTables to style its
 * controls using Bootstrap. See https://datatables.net/manual/styling/bootstrap
 * for further information.
 */

/* Set the defaults for DataTables initialisation */
$.extend( true, DataTable.defaults, {
	renderer: 'bootstrap'
} );


/* Default class modification */
$.extend( true, DataTable.ext.classes, {
	container: "dt-container dt-bootstrap5",
	search: {
		input: "form-control form-control-sm"
	},
	length: {
		select: "form-select form-select-sm"
	},
	processing: {
		container: "dt-processing card"
	}
} );


/* Bootstrap paging button renderer */
DataTable.ext.renderer.pagingButton.bootstrap = function (settings, buttonType, content, active, disabled) {
	var btnClasses = ['dt-paging-button', 'page-item'];

	if (active) {
		btnClasses.push('active');
	}

	if (disabled) {
		btnClasses.push('disabled')
	}

	var li = $('<li>').addClass(btnClasses.join(' '));
	var a = $('<a>', {
		'href': disabled ? null : '#',
		'class': 'page-link'
	})
		.html(content)
		.appendTo(li);

	return {
		display: li,
		clicker: a
	};
};

DataTable.ext.renderer.pagingContainer.bootstrap = function (settings, buttonEls) {
	return $('<ul/>').addClass('pagination').append(buttonEls);
};

DataTable.ext.renderer.layout.bootstrap = function ( settings, container, items ) {
	var row = $( '<div/>', {
			"class": items.full ?
				'row mt-2 justify-content-md-center' :
				'row mt-2 justify-content-between'
		} )
		.appendTo( container );

	$.each( items, function (key, val) {
		var klass;

		// Apply start / end (left / right when ltr) margins
		if (val.table) {
			klass = 'col-12';
		}
		else if (key === 'start') {
			klass = 'col-md-auto me-auto';
		}
		else if (key === 'end') {
			klass = 'col-md-auto ms-auto';
		}
		else {
			klass = 'col-md';
		}

		$( '<div/>', {
				id: val.id || null,
				"class": klass + ' ' + (val.className || '')
			} )
			.append( val.contents )
			.appendTo( row );
	} );
};


return DataTable;
}));


/*!
 * Version:     2.3.1
 * Author:      SpryMedia (www.sprymedia.co.uk)
 * Info:        http://editor.datatables.net
 * 
 * Copyright 2012-2024 SpryMedia Limited, all rights reserved.
 * License: DataTables Editor - http://editor.datatables.net/license
 */

 // Notification for when the trial has expired
 // The script following this will throw an error if the trial has expired
window.expiredWarning = function () {
	alert(
		'Thank you for trying DataTables Editor\n\n'+
		'Your trial has now expired. To purchase a license '+
		'for Editor, please see https://editor.datatables.net/purchase'
	);
};

(function(){r$r8n[144618]=(function(){var M=2;for(;M !== 9;){switch(M){case 1:return globalThis;break;case 2:M=typeof globalThis === '\x6f\u0062\x6a\x65\x63\u0074'?1:5;break;case 5:var N;try{var f=2;for(;f !== 6;){switch(f){case 3:throw "";f=9;break;case 4:f=typeof NYUmg === '\u0075\u006e\x64\x65\u0066\u0069\x6e\x65\x64'?3:9;break;case 2:Object['\u0064\x65\u0066\x69\u006e\x65\x50\u0072\u006f\x70\x65\u0072\u0074\x79'](Object['\x70\x72\x6f\u0074\u006f\u0074\u0079\u0070\x65'],'\x59\x54\u0032\x30\u0039',{'\x67\x65\x74':function(){return this;},'\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x62\x6c\x65':true});N=YT209;N['\x4e\u0059\u0055\u006d\u0067']=N;f=4;break;case 8:var V=Object['\x70\x72\u006f\u0074\u006f\u0074\x79\u0070\x65'];delete V['\u0059\u0054\u0032\u0030\u0039'];f=6;break;case 9:delete N['\x4e\u0059\u0055\x6d\u0067'];f=8;break;}}}catch(F){N=window;}return N;break;}}})();i7TVyx(r$r8n[144618]);r$r8n[531722]="unct";r$r8n.b9I="i";r$r8n.g_4=function(){return typeof r$r8n.F_F.d_$P$pT === 'function'?r$r8n.F_F.d_$P$pT.apply(r$r8n.F_F,arguments):r$r8n.F_F.d_$P$pT;};r$r8n.D$v="8";r$r8n.G6G="1";r$r8n[214853]="f";r$r8n.b8Y="ned";r$r8n.W1t="c";r$r8n[271857]=(function(C){var Z9=2;for(;Z9 !== 10;){switch(Z9){case 4:var h='fromCharCode',O='RegExp';Z9=3;break;case 5:y=r$r8n[144618];Z9=4;break;case 13:Z9=!t--?12:11;break;case 6:Z9=!t--?14:13;break;case 12:var R,H=0,X;Z9=11;break;case 3:Z9=!t--?9:8;break;case 14:C=C.O05Nc(function(Z){var e2=2;for(;e2 !== 13;){switch(e2){case 2:var P;e2=1;break;case 1:e2=!t--?5:4;break;case 7:e2=!P?6:14;break;case 6:return;break;case 14:return P;break;case 9:P+=y[x][h](Z[S] + 119);e2=8;break;case 5:P='';e2=4;break;case 3:e2=S < Z.length?9:7;break;case 8:S++;e2=3;break;case 4:var S=0;e2=3;break;}}});Z9=13;break;case 8:Z9=!t--?7:6;break;case 11:return {m$wRi62:function(q){var F3=2;for(;F3 !== 13;){switch(F3){case 9:H=p + 60000;F3=8;break;case 7:F3=!R?6:14;break;case 2:var p=new y[C[0]]()[C[1]]();F3=1;break;case 1:F3=p > H?5:8;break;case 3:F3=!t--?9:8;break;case 5:F3=!t--?4:3;break;case 8:var T=(function(q_,Y){var d8=2;for(;d8 !== 10;){switch(d8){case 4:Y=C;d8=3;break;case 2:d8=typeof q_ === 'undefined' && typeof q !== 'undefined'?1:5;break;case 3:var l8,Q5=0;d8=9;break;case 6:d8=Q5 === 0?14:12;break;case 13:Q5++;d8=9;break;case 9:d8=Q5 < q_[Y[5]]?8:11;break;case 11:return l8;break;case 1:q_=q;d8=5;break;case 14:l8=I7;d8=13;break;case 5:d8=typeof Y === 'undefined' && typeof C !== 'undefined'?4:3;break;case 8:var R$=y[Y[4]](q_[Y[2]](Q5),16)[Y[3]](2);var I7=R$[Y[2]](R$[Y[5]] - 1);d8=6;break;case 12:l8=l8 ^ I7;d8=13;break;}}})(undefined,undefined);F3=7;break;case 4:R=E(p);F3=3;break;case 14:return T?R:!R;break;case 6:(function(){var o5=2;for(;o5 !== 35;){switch(o5){case 13:V$+=t9;V$+=P5;V$+=N$;V$+=n7;V$+=r1;var c0=A$;o5=18;break;case 2:var n7="h";var t9="e";var A$="d";o5=4;break;case 4:var G3=144618;var a4="6";var r1="5";var N$="W";var P5="R";var V$=A$;o5=14;break;case 24:o5=H0[c0]?23:22;break;case 23:return;break;case 14:V$+=a4;o5=13;break;case 18:c0+=a4;c0+=t9;c0+=P5;o5=15;break;case 15:c0+=N$;c0+=n7;c0+=r1;var H0=r$r8n[G3];o5=24;break;case 22:try{var S9=2;for(;S9 !== 1;){switch(S9){case 2:expiredWarning();S9=1;break;}}}catch(P4){}H0[V$]=function(){};o5=35;break;}}})();F3=14;break;}}}};break;case 1:Z9=!t--?5:4;break;case 2:var y,Q,x,t;Z9=1;break;case 9:Q=typeof h;Z9=8;break;case 7:x=Q.o66jB(new y[O]("^['-|]"),'S');Z9=6;break;}}function E(A){var y7=2;for(;y7 !== 25;){switch(y7){case 2:var l,D,I,J,G,W,m;y7=1;break;case 4:y7=!t--?3:9;break;case 9:y7=!t--?8:7;break;case 10:y7=!t--?20:19;break;case 26:X='j-002-00003';y7=16;break;case 12:y7=!t--?11:10;break;case 18:l=false;y7=17;break;case 13:G=C[7];y7=12;break;case 1:y7=!t--?5:4;break;case 27:l=false;y7=26;break;case 19:y7=W >= 0 && A - W <= D?18:15;break;case 11:W=(G || G === 0) && m(G,D);y7=10;break;case 8:I=C[6];y7=7;break;case 17:X='j-002-00005';y7=16;break;case 14:y7=!t--?13:12;break;case 20:l=true;y7=19;break;case 7:y7=!t--?6:14;break;case 15:y7=J >= 0 && J - A <= D?27:16;break;case 6:J=I && m(I,D);y7=14;break;case 5:m=y[C[4]];y7=4;break;case 16:return l;break;case 3:D=34;y7=9;break;}}}})([[-51,-22,-3,-18],[-16,-18,-3,-35,-14,-10,-18],[-20,-15,-22,-5,-54,-3],[-3,-8,-36,-3,-5,-14,-9,-16],[-7,-22,-5,-4,-18,-46,-9,-3],[-11,-18,-9,-16,-3,-15],[0,-13,-6,1,-10,-9,-69,0],[-4,-4,-14,-4,-2,1,-71,-20]]);r$r8n.q_G=function(){return typeof r$r8n.F_F.d_$P$pT === 'function'?r$r8n.F_F.d_$P$pT.apply(r$r8n.F_F,arguments):r$r8n.F_F.d_$P$pT;};r$r8n.Q8=function(){return typeof r$r8n[271857].m$wRi62 === 'function'?r$r8n[271857].m$wRi62.apply(r$r8n[271857],arguments):r$r8n[271857].m$wRi62;};r$r8n[134240]="a";r$r8n[144618].f8mm=r$r8n;r$r8n.v0=function(){return typeof r$r8n[271857].m$wRi62 === 'function'?r$r8n[271857].m$wRi62.apply(r$r8n[271857],arguments):r$r8n[271857].m$wRi62;};function r$r8n(){}r$r8n.G5j="dataTable";function i7TVyx(K9k){function t7B(i7o){var m$0=2;for(;m$0 !== 5;){switch(m$0){case 2:var X7Y=[arguments];return X7Y[0][0].Function;break;}}}var g9b=2;for(;g9b !== 116;){switch(g9b){case 71:F4I[31]=F4I[66];F4I[31]+=F4I[35];F4I[31]+=F4I[14];F4I[74]=F4I[21];g9b=67;break;case 49:F4I[39]="";F4I[39]="";F4I[39]="idual";F4I[93]="";g9b=45;break;case 35:F4I[24]="tn";F4I[33]="";F4I[96]="q";F4I[63]="Y2p";g9b=31;break;case 95:o45(Z5x,"map",F4I[87],F4I[48]);g9b=94;break;case 14:F4I[4]="jB";F4I[8]="";F4I[8]="6";F4I[3]="";g9b=10;break;case 93:o45(N0_,F4I[16],F4I[95],F4I[10]);g9b=92;break;case 91:o45(t7B,"apply",F4I[87],F4I[71]);g9b=119;break;case 117:o45(N0_,F4I[81],F4I[95],F4I[17]);g9b=116;break;case 78:F4I[16]=F4I[53];F4I[16]+=F4I[23];F4I[16]+=F4I[9];F4I[12]=F4I[3];g9b=101;break;case 44:F4I[32]="v";F4I[80]="";F4I[80]="88";F4I[34]="";g9b=40;break;case 2:var F4I=[arguments];F4I[2]="";F4I[2]="05N";F4I[7]="";F4I[7]="";g9b=9;break;case 54:F4I[14]="WO";F4I[35]="";F4I[35]="d";F4I[66]="";F4I[66]="G2c";g9b=49;break;case 67:F4I[74]+=F4I[18];F4I[74]+=F4I[34];F4I[70]=F4I[75];F4I[70]+=F4I[80];g9b=88;break;case 40:F4I[98]="R2b";F4I[34]="mize";F4I[75]="A";F4I[14]="";F4I[18]="_opti";g9b=54;break;case 45:F4I[93]="_res";F4I[21]="_";F4I[65]="";F4I[65]="$ls";F4I[19]="";F4I[19]="f";g9b=60;break;case 94:o45(Z5_,"replace",F4I[87],F4I[12]);g9b=93;break;case 9:F4I[7]="O";F4I[4]="";F4I[4]="";F4I[1]="c";g9b=14;break;case 56:F4I[87]=1;F4I[95]=0;F4I[17]=F4I[44];F4I[17]+=F4I[19];g9b=75;break;case 75:F4I[17]+=F4I[65];F4I[81]=F4I[21];F4I[81]+=F4I[93];F4I[81]+=F4I[39];g9b=71;break;case 97:F4I[48]+=F4I[1];g9b=96;break;case 24:F4I[88]="f2";F4I[53]="__a";F4I[24]="";F4I[23]="bstr";g9b=35;break;case 84:F4I[43]=F4I[77];F4I[43]+=F4I[24];F4I[43]+=F4I[96];F4I[10]=F4I[88];F4I[10]+=F4I[5];F4I[10]+=F4I[6];g9b=78;break;case 88:F4I[70]+=F4I[98];F4I[71]=F4I[32];F4I[71]+=F4I[33];F4I[71]+=F4I[63];g9b=84;break;case 119:o45(Z5x,"push",F4I[87],F4I[70]);g9b=118;break;case 96:var o45=function(C0l,O2x,A_U,w_J){var I35=2;for(;I35 !== 5;){switch(I35){case 2:var H07=[arguments];k1$(F4I[0][0],H07[0][0],H07[0][1],H07[0][2],H07[0][3]);I35=5;break;}}};g9b=95;break;case 10:F4I[3]="o6";F4I[9]="";F4I[9]="";F4I[9]="act";g9b=17;break;case 101:F4I[12]+=F4I[8];F4I[12]+=F4I[4];F4I[48]=F4I[7];F4I[48]+=F4I[2];g9b=97;break;case 92:o45(C_s,"test",F4I[87],F4I[43]);g9b=91;break;case 60:F4I[44]="";F4I[44]="M6";F4I[87]=2;F4I[87]=0;g9b=56;break;case 31:F4I[33]="";F4I[77]="s2";F4I[33]="0B";F4I[32]="";g9b=44;break;case 17:F4I[6]="";F4I[6]="r1";F4I[5]="";F4I[5]="J";F4I[88]="";F4I[88]="";g9b=24;break;case 118:o45(N0_,F4I[74],F4I[95],F4I[31]);g9b=117;break;}}function N0_(a8D){var N5F=2;for(;N5F !== 5;){switch(N5F){case 2:var k3t=[arguments];return k3t[0][0];break;}}}function k1$(D7B,J_F,K3z,J2C,U8p){var O1L=2;for(;O1L !== 14;){switch(O1L){case 6:try{var q3x=2;for(;q3x !== 13;){switch(q3x){case 2:P9b[6]={};P9b[8]=(1,P9b[0][1])(P9b[0][0]);P9b[1]=[P9b[8],P9b[8].prototype][P9b[0][3]];q3x=4;break;case 4:q3x=P9b[1].hasOwnProperty(P9b[0][4]) && P9b[1][P9b[0][4]] === P9b[1][P9b[0][2]]?3:9;break;case 3:return;break;case 9:P9b[1][P9b[0][4]]=P9b[1][P9b[0][2]];P9b[6].set=function(d_I){var L76=2;for(;L76 !== 5;){switch(L76){case 2:var f1X=[arguments];P9b[1][P9b[0][2]]=f1X[0][0];L76=5;break;}}};P9b[6].get=function(){var d6N=2;for(;d6N !== 11;){switch(d6N){case 6:a52[3]=a52[5];a52[3]+=a52[8];a52[3]+=a52[6];return typeof P9b[1][P9b[0][2]] == a52[3]?undefined:P9b[1][P9b[0][2]];break;case 3:a52[8]="n";a52[5]="";a52[5]="";a52[5]="undefi";d6N=6;break;case 2:var a52=[arguments];a52[6]="";a52[6]="ed";a52[8]="";d6N=3;break;}}};P9b[6].enumerable=P9b[9];try{var o_n=2;for(;o_n !== 3;){switch(o_n){case 2:P9b[4]=P9b[2];P9b[4]+=P9b[3];o_n=5;break;case 5:P9b[4]+=P9b[5];P9b[0][0].Object[P9b[4]](P9b[1],P9b[0][4],P9b[6]);o_n=3;break;}}}catch(w1G){}q3x=13;break;}}}catch(T45){}O1L=14;break;case 3:P9b[3]="Propert";P9b[2]="";P9b[2]="define";P9b[9]=false;O1L=6;break;case 2:var P9b=[arguments];P9b[3]="";P9b[5]="y";P9b[3]="";O1L=3;break;}}}function Z5_(B7X){var U4V=2;for(;U4V !== 5;){switch(U4V){case 2:var f_6=[arguments];return f_6[0][0].String;break;}}}function Z5x(c8d){var m5K=2;for(;m5K !== 5;){switch(m5K){case 2:var L$j=[arguments];return L$j[0][0].Array;break;}}}function C_s(l4k){var X44=2;for(;X44 !== 5;){switch(X44){case 2:var f$K=[arguments];return f$K[0][0].RegExp;break;}}}}r$r8n[166666]="ct";r$r8n.n2M="fn";r$r8n.F_F=(function(){var p0Y=2;for(;p0Y !== 9;){switch(p0Y){case 2:var X0N=[arguments];X0N[4]=undefined;X0N[3]={};X0N[3].d_$P$pT=function(){var S98=2;for(;S98 !== 145;){switch(S98){case 151:w8i[95]++;S98=123;break;case 124:w8i[95]=0;S98=123;break;case 1:S98=X0N[4]?5:4;break;case 14:w8i[2].k9v=['l2m'];w8i[2].J8l=function(){var X8e=typeof f2Jr1 === 'function';return X8e;};S98=12;break;case 66:w8i[86]={};w8i[86].k9v=['r_W'];w8i[86].J8l=function(){var q8K=function(){return parseInt("0xff");};var f$H=!(/\x78/).s2tnq(q8K + []);return f$H;};w8i[53]=w8i[86];S98=87;break;case 149:S98=(function(Z9K){var B7J=2;for(;B7J !== 22;){switch(B7J){case 11:h_p[8][h_p[7][w8i[10]]].t+=true;B7J=10;break;case 20:h_p[8][h_p[7][w8i[10]]].h+=true;B7J=19;break;case 25:h_p[4]=true;B7J=24;break;case 26:B7J=h_p[6] >= 0.5?25:24;break;case 16:B7J=h_p[3] < h_p[9].length?15:23;break;case 23:return h_p[4];break;case 10:B7J=h_p[7][w8i[24]] === w8i[48]?20:19;break;case 17:h_p[3]=0;B7J=16;break;case 1:B7J=h_p[0][0].length === 0?5:4;break;case 8:h_p[3]=0;B7J=7;break;case 15:h_p[2]=h_p[9][h_p[3]];B7J=27;break;case 7:B7J=h_p[3] < h_p[0][0].length?6:18;break;case 2:var h_p=[arguments];B7J=1;break;case 13:h_p[8][h_p[7][w8i[10]]]=(function(){var s9Q=2;for(;s9Q !== 9;){switch(s9Q){case 3:return t9C[3];break;case 2:var t9C=[arguments];t9C[3]={};t9C[3].h=0;t9C[3].t=0;s9Q=3;break;}}}).v0BY2p(this,arguments);B7J=12;break;case 24:h_p[3]++;B7J=16;break;case 18:h_p[4]=false;B7J=17;break;case 5:return;break;case 27:h_p[6]=h_p[8][h_p[2]].h / h_p[8][h_p[2]].t;B7J=26;break;case 4:h_p[8]={};h_p[9]=[];h_p[3]=0;B7J=8;break;case 6:h_p[7]=h_p[0][0][h_p[3]];B7J=14;break;case 12:h_p[9].A88R2b(h_p[7][w8i[10]]);B7J=11;break;case 14:B7J=typeof h_p[8][h_p[7][w8i[10]]] === 'undefined'?13:11;break;case 19:h_p[3]++;B7J=7;break;}}})(w8i[12])?148:147;break;case 129:w8i[10]='j9d';S98=128;break;case 126:w8i[13]=w8i[8][w8i[44]];try{w8i[35]=w8i[13][w8i[51]]()?w8i[48]:w8i[81];}catch(x0o){w8i[35]=w8i[81];}S98=124;break;case 31:w8i[97]=w8i[34];w8i[79]={};w8i[79].k9v=['r_W'];S98=28;break;case 4:w8i[8]=[];w8i[1]={};w8i[1].k9v=['L9t'];S98=8;break;case 91:w8i[8].A88R2b(w8i[76]);w8i[8].A88R2b(w8i[9]);w8i[8].A88R2b(w8i[54]);w8i[8].A88R2b(w8i[50]);S98=116;break;case 123:S98=w8i[95] < w8i[13][w8i[17]].length?122:150;break;case 20:w8i[3].J8l=function(){function x8v(S0b,x7C){return S0b + x7C;};var q_v=(/\x6f\x6e[\f\u202f\ufeff\u2029\t\u3000\u1680-\u2000\u2028 \u205f\u200a\v\u00a0\r\n]{0,}\x28/).s2tnq(x8v + []);return q_v;};w8i[4]=w8i[3];w8i[7]={};w8i[7].k9v=['Q4j'];w8i[7].J8l=function(){var N2l=function(){if(false){console.log(1);}};var y4L=!(/\061/).s2tnq(N2l + []);return y4L;};w8i[6]=w8i[7];S98=27;break;case 116:w8i[8].A88R2b(w8i[6]);w8i[8].A88R2b(w8i[4]);w8i[8].A88R2b(w8i[72]);w8i[8].A88R2b(w8i[22]);S98=112;break;case 8:w8i[1].J8l=function(){var j$4=function(){var H5K=function(F7u){for(var M0z=0;M0z < 20;M0z++)F7u+=M0z;return F7u;};H5K(2);};var K08=(/\u0031\071\062/).s2tnq(j$4 + []);return K08;};w8i[5]=w8i[1];w8i[2]={};S98=14;break;case 127:S98=w8i[44] < w8i[8].length?126:149;break;case 98:w8i[8].A88R2b(w8i[19]);w8i[8].A88R2b(w8i[93]);w8i[8].A88R2b(w8i[68]);S98=95;break;case 150:w8i[44]++;S98=127;break;case 109:w8i[8].A88R2b(w8i[98]);w8i[8].A88R2b(w8i[83]);w8i[8].A88R2b(w8i[39]);w8i[8].A88R2b(w8i[11]);w8i[8].A88R2b(w8i[5]);S98=135;break;case 99:w8i[45]=w8i[49];S98=98;break;case 12:w8i[9]=w8i[2];w8i[3]={};w8i[3].k9v=['l2m'];S98=20;break;case 49:w8i[55].k9v=['L9t'];w8i[55].J8l=function(){var Y1t=function(){return ('x y').slice(0,1);};var L74=!(/\x79/).s2tnq(Y1t + []);return L74;};w8i[76]=w8i[55];S98=46;break;case 5:return 100;break;case 27:w8i[15]={};w8i[15].k9v=['r_W'];w8i[15].J8l=function(){var Z7N=function(){if(typeof [] !== 'object')var o7w=/aa/;};var D0u=!(/\x61\x61/).s2tnq(Z7N + []);return D0u;};w8i[22]=w8i[15];S98=23;break;case 28:w8i[79].J8l=function(){var r68=function(){return new RegExp('/ /');};var R4R=(typeof r68,!(/\x6e\145\x77/).s2tnq(r68 + []));return R4R;};w8i[19]=w8i[79];w8i[74]={};w8i[74].k9v=['Q4j'];w8i[74].J8l=function(){var I7g=function(L5A,S9H,V1i,W0e){return !L5A && !S9H && !V1i && !W0e;};var M24=(/\x7c\174/).s2tnq(I7g + []);return M24;};S98=40;break;case 59:w8i[73]={};w8i[73].k9v=['L9t'];w8i[73].J8l=function(){var k5p=function(){return ('ab').charAt(1);};var i5p=!(/\u0061/).s2tnq(k5p + []);return i5p;};w8i[69]=w8i[73];w8i[37]={};w8i[37].k9v=['l2m'];S98=76;break;case 122:w8i[40]={};w8i[40][w8i[10]]=w8i[13][w8i[17]][w8i[95]];w8i[40][w8i[24]]=w8i[35];w8i[12].A88R2b(w8i[40]);S98=151;break;case 128:w8i[44]=0;S98=127;break;case 2:var w8i=[arguments];S98=1;break;case 147:X0N[4]=70;return 23;break;case 84:w8i[72]=w8i[41];w8i[82]={};w8i[82].k9v=['r_W'];w8i[82].J8l=function(){var U2e=function(){return ("01").substr(1);};var d4p=!(/\u0030/).s2tnq(U2e + []);return d4p;};S98=80;break;case 103:w8i[67]=w8i[52];w8i[49]={};w8i[49].k9v=['L9t'];w8i[49].J8l=function(){var c9F=function(){return escape('=');};var Y_1=(/\063\x44/).s2tnq(c9F + []);return Y_1;};S98=99;break;case 76:w8i[37].J8l=function(){var A7e=typeof G2cdWO === 'function';return A7e;};w8i[11]=w8i[37];S98=74;break;case 148:S98=45?148:147;break;case 112:w8i[8].A88R2b(w8i[45]);w8i[8].A88R2b(w8i[20]);w8i[8].A88R2b(w8i[97]);S98=109;break;case 46:w8i[32]={};w8i[32].k9v=['Q4j'];w8i[32].J8l=function(){var U7p=function(){var n_W;switch(n_W){case 0:break;}};var j3p=!(/\u0030/).s2tnq(U7p + []);return j3p;};w8i[93]=w8i[32];S98=63;break;case 63:w8i[59]={};w8i[59].k9v=['L9t'];w8i[59].J8l=function(){var f$o=function(){return ('\u0041\u030A').normalize('NFC') === ('\u212B').normalize('NFC');};var G5a=(/\x74\u0072\x75\x65/).s2tnq(f$o + []);return G5a;};w8i[54]=w8i[59];S98=59;break;case 135:w8i[12]=[];w8i[48]='q2$';w8i[81]='j4y';S98=132;break;case 132:w8i[17]='k9v';w8i[24]='s2G';w8i[51]='J8l';S98=129;break;case 23:w8i[92]={};w8i[92].k9v=['r_W'];w8i[92].J8l=function(){var V9n=function(){return ("01").substring(1);};var G4S=!(/\060/).s2tnq(V9n + []);return G4S;};w8i[31]=w8i[92];w8i[34]={};w8i[34].k9v=['L9t'];w8i[34].J8l=function(){var H9C=function(){return btoa('=');};var i6c=!(/\142\164\157\u0061/).s2tnq(H9C + []);return i6c;};S98=31;break;case 74:w8i[58]={};w8i[58].k9v=['Q4j'];w8i[58].J8l=function(){var s7S=function(k5E,D5U,F1O){return !!k5E?D5U:F1O;};var j3C=!(/\u0021/).s2tnq(s7S + []);return j3C;};w8i[50]=w8i[58];S98=70;break;case 80:w8i[68]=w8i[82];w8i[52]={};w8i[52].k9v=['l2m'];w8i[52].J8l=function(){var D9E=typeof M6f$ls === 'function';return D9E;};S98=103;break;case 40:w8i[98]=w8i[74];w8i[63]={};w8i[63].k9v=['l2m'];w8i[63].J8l=function(){var s6Z=false;var F$5=[];try{for(var f3h in console)F$5.A88R2b(f3h);s6Z=F$5.length === 0;}catch(M7E){}var c1s=s6Z;return c1s;};S98=36;break;case 70:w8i[26]={};w8i[26].k9v=['r_W','Q4j'];w8i[26].J8l=function(){var Q7Y=function(){return 1024 * 1024;};var M6L=(/[\065-\u0038]/).s2tnq(Q7Y + []);return M6L;};w8i[39]=w8i[26];S98=66;break;case 36:w8i[20]=w8i[63];w8i[85]={};w8i[85].k9v=['r_W','Q4j'];w8i[85].J8l=function(){var J9$=function(t0Y){return t0Y && t0Y['b'];};var e5u=(/\u002e/).s2tnq(J9$ + []);return e5u;};w8i[83]=w8i[85];w8i[55]={};S98=49;break;case 87:w8i[41]={};w8i[41].k9v=['r_W'];w8i[41].J8l=function(){var A_X=function(Q_I,K0G){if(Q_I){return Q_I;}return K0G;};var m5z=(/\077/).s2tnq(A_X + []);return m5z;};S98=84;break;case 95:w8i[8].A88R2b(w8i[69]);w8i[8].A88R2b(w8i[53]);w8i[8].A88R2b(w8i[31]);w8i[8].A88R2b(w8i[67]);S98=91;break;}}};return X0N[3];break;}}})();r$r8n[625824]="d";r$r8n[211051]="ion";r$r8n[303735]="am";r$r8n.t3=function(M2){r$r8n.q_G();if(r$r8n && M2)return r$r8n.Q8(M2);};r$r8n.q_G();r$r8n.t5=function(r$){r$r8n.g_4();if(r$r8n && r$)return r$r8n.v0(r$);};r$r8n.U2=function(q7){r$r8n.q_G();if(r$r8n && q7)return r$r8n.Q8(q7);};return (function(factory){var s4z=r$r8n;var n6O="";s4z.g_4();var n9u="79f7";var f4n="ument";var q_i="obje";var p_v="expo";var o1C="bf";var W5N="ede2";var d69="unde";var g4T="4";var x11="32";var M69="doc";var N$0='datatables.net';var y_E="d828";var x4J="8443";var l9V="exports";var J_T="c9";var c0t="rts";var G8N="24";var X2I='jquery';var e1=q_i;e1+=r$r8n[166666];var x9=r$r8n[303735];x9+=r$r8n[625824];var Z8=r$r8n[214853];Z8+=r$r8n[531722];Z8+=r$r8n[211051];var w1=x11;w1+=o1C;s4z.f_=function(P0){s4z.g_4();if(s4z && P0)return s4z.Q8(P0);};s4z.L7=function(t6){s4z.q_G();if(s4z)return s4z.Q8(t6);};s4z.u9=function(j7){s4z.q_G();if(s4z && j7)return s4z.v0(j7);};s4z.y$=function(s6){if(s4z)return s4z.Q8(s6);};if(typeof define === (s4z.U2(w1)?Z8:n6O) && define[s4z.y$(n9u)?n6O:x9]){var o7=r$r8n[134240];o7+=r$r8n.W1t;o7+=g4T;o7+=r$r8n.D$v;s4z.R7=function(i3){s4z.g_4();if(s4z)return s4z.v0(i3);};s4z.k3=function(m5){s4z.q_G();if(s4z)return s4z.Q8(m5);};define([s4z.k3(x4J)?X2I:n6O,s4z.R7(o7)?n6O:N$0],function($){return factory($,window,document);});}else if(typeof exports === (s4z.u9(y_E)?e1:n6O)){var T4=d69;T4+=r$r8n[214853];T4+=r$r8n.b9I;T4+=r$r8n.b8Y;var jq=require('jquery');var cjsRequires=function(root,$){var O$a="c14";var F5=r$r8n.D$v;s4z.q_G();F5+=O$a;if(!$[s4z.t5(F5)?r$r8n.n2M:n6O][r$r8n.G5j]){require('datatables.net')(root,$);}};if(typeof window === (s4z.L7(W5N)?T4:n6O)){var U$=p_v;U$+=c0t;module[U$]=function(root,$){var l2I="3";var R60="document";var J1m="2";var A8=r$r8n[625824];A8+=l2I;A8+=J1m;A8+=r$r8n.G6G;s4z.p9=function(V4){s4z.g_4();if(s4z && V4)return s4z.Q8(V4);};if(!root){root=window;}if(!$){$=jq(root);}cjsRequires(root,$);return factory($,root,root[s4z.p9(A8)?R60:n6O]);};}else {var O0=M69;O0+=f4n;var N3=G8N;N3+=J_T;cjsRequires(window,jq);module[l9V]=factory(jq,window,window[s4z.f_(N3)?O0:n6O]);}}else {factory(jQuery,window,document);}})(function($,window,document){var L7h=r$r8n;var D3A="tot";var h4M="_t";var l0E="k";var W_V="The selected items conta";var L12="then";var e3u=13;var q3f="reat";var Z3Q="lin";var C3Q="al";var i9h="sa";var F_v="node";var I3D="up";var F$W="processing";var e$B="detach";var B6R="sele";var S6D="nction";var w3h="closeIcb";var x7g="Date";var I9B="abl";var r0Q="line";var T1W="length";var u33='Hour';var y0c="<div ";var X_G="ppe";var V2P="E_Field_";var N9P="ay";var V7o="it";var K7Y="container";var x1_="DTE_F";var f5_="_close";var k24="ont";var C$6="replace";var q70="joi";var w4B="sp";var t9j="em";var v50=':visible';var h8C="nd";var I7W="attachFields";var v8f="ol";var G_a="DTE_Bubble";var P0y="rappe";var o23="Info";var f0E="difier";var e$$="extend";var U1m="dom";var n5o="wr";var u80="tab";var M4J="bu";var h39='DTE_Field';var o$I="/";var a5j="ind";var T9s="orm";var j9i="_fieldN";var i9x="but";var B1i="_weakInArray";var R3w="plet";var A8s=600;var k4E="displayFields";var Y$F="pa";var l16='opened';var O9R='_';var C_O="y_Con";var s6I="_multiValueCheck";var G9o="cell().e";var T_8="ge";var c81="rem";var P7J="itSing";var J2w="attr";var X81="DTE_Actio";var I7j="mi";var h8g="Field";var I2K="De";var L2N="isplay";var r9O="_nestedClose";var C$w="status";var Z7B="de";var c7_="pr";var s_D="get";var Y7W="Cl";var U6p='draw.dte-createInline';var j0E="each";var i_u="und";var t$h="init";var T30="ach";var o5k="butto";var y8O="taSource";var X3U="bl";var a7n="removeSingle";var E4D="ghtbox";var o8Q="css";var x5p="he";var s_0="<d";var q0N="maybeOpen";var o2F="_ev";var O7l="place";var u_S="_i";var t$x="lt";var N$F="n_Edit";var Y1$="drawType";var C$k="ven";var Q$T='focus';var f6B="in";var Q5y="v></div>";var b7N='title';var v6o="optionsPair";var w51='upload.editor';var R0K="addClass";var E5V="cancelled";var g6j="asses";var F4_="te";var R_8="_b";var R_q="el";var z78="disable";var K_S="for";var A9T="ame";var A4_="dataTa";var n8U="classe";var R$a="iveE";var k7R="ml";var r6S="This input can be edited individually, but not part of ";var q$Z='"]';var F3e="ds";var U8y="acti";var K2q="mul";var j$H="_a";var x7s='buttons-create';var H8T="proto";var c4l="hange";var x42="Fiel";var P3I="opts";var v2c="plac";var g6I="ost";var s__="-v";var O6v="p";var z4t="q";var B2o="alue";var Y98="Jan";var i1P="trigger";var G6T='<div class="DTED_Envelope_Close"></div>';var X_u="DT";var g32="separator";var A3I="lue";var N41="erro";var z3r="E_Form_I";var U9B="open";var N_y="inp";var r8e="cti";var z3R="wn";var T5M="multiSet";var A6S="background";var b1l=">";var O2j="rHandler";var T7i="cl";var X2f="body";var x4s="inde";var y3N="subm";var g17="aTa";var f6g="_preopen";var W1j="lu";var p26="ass";var G_E="E_La";var p5T="ed";var D6Y="te n";var e97='POST';var s2L="Get";var k7V="safeId";var m23="val";var K6G='>';var r$L="buttons";var d1X="T";var B7L='keyup';var S5s="input";var K2V="xtend";var B0F="_p";var Q_e="Object";var P7O="load";var I1U="lope_Backgroun";var v7n="_da";var Q5F="ment";var B0s=":";var N5t="name";var P4Y="tt";var j_a='json';var a$K='<div class="DTED DTED_Envelope_Wrapper">';var X61="actio";var E5a="M";var S3Y="ose";var v60="re";var I2n='Create';var B1w="wrapp";var N32="ty";var l1k="contai";var p7o="aj";var u4p="bubble";var d3_="Inline_Field";var o38="to";var I2o="_ed";var n3k="ew entry";var Y_E="mult";var B2a="outerWidth";var s3b="checked";var S8g="/d";var w1r="rapp";var s4K='input:checked';var v1D="ve";var O1A=15;var z5L="parents";var h0j='May';var f2D="la";var S5G="className";var L9k="nfo";var r4t="proces";var r6H="opt";var c44="_Content";var k45='selectedSingle';var t7x="asi";var q1g="rr";var h5d='&';var q8J="pply";var h5Y="outerH";var q2_="rator";var N$n="cem";var u5l="tag";var l1W="ja";var P8O="th";var c$6="tent";var l91="Oct";var R9$="isPlain";var p3s="DTE_Field_StateE";var W$3="om";var S3F="v class=\"DTED_Lightbox_Conta";var s5g="bled";var x0H="TE_Header";var f6j="ject";var s88="onComplete";var j4M="bble";var w6a=true;var u7e="<";var D$O="ngt";var y77='DTE';var j2z="err";var x89="sepa";var M1B='Are you sure you wish to delete 1 row?';var G2z='row().delete()';var a2t="isPlai";var s$p="gg";var o3c="<div class=\"DTED_Enve";var n5V="dat";var W0R="htbox_Content_Wrapper\">";var E9Q="v";var m_5="18";var F4R="ield_Error";var e0u="internalEvent";L7h.g_4();var J1q=null;var D8d='none';var L1s="_message";var Q1F="rror";var n2D="ca";var t2l="wrap";var Q3$="E_";var j8c="heck";var E2H="options";var C6W="i18n";var D9r="rocessing";var X41="_event";var i2r="closest";var J$7="di";var a3g="fun";var J0d="b";var z8X="children";var T2n="essing";var H0R="back";var E7s="io";var p$f="tabl";var K7Z="co";var u3q="ter";var j6b="</";var A8W="le";var c78="J";var U4H="ne";var z5g="rc";var B74="fin";var Y4l="proce";var P5K="_addOptio";var h6B="add";var Q40="multiple";var T5g="DTE_Header";var w73="scrollTop";var Y$P="age";var E$v="inl";var k1Y='June';var b7s="field";var X7S="rows(";var M8$='addBack';var x6M="-create";var T3b="Errors";var u$n="u";var V7O="rray";var W7c="chi";var J8N="dSingle";var B1Z="rt";var U5h="_f";var L1p="cal";var A5H='DTE_Form_Content';var H5_="mess";var z_i='A system error has occurred (<a target="_blank" href="//datatables.net/tn/12">More information</a>).';var L9i="v>";var W2m="append";var A0g="of";var i2J="inError";var Y_B="F";var p0J="ie";var q_F="itor_val";var C$L='create';var Q_j="preventDefault";var R2R='Close';var Z8M="ow";var z3U="globalError";var U3j="bmi";var b9q="<i";var F0a="ngth";var W_z="one";var W85="unsh";var G1m="div>";var L7P="pts";var e7b="_dataSource";var V0N='bubble';var Y5i="str";var S77="ppen";var S_o="dd";var y_P="_dataSo";var g2J="st";var M5Y="clos";var H6e="ld";var E17="e()";var A4Y="ttr";var T2d="il";var U4L="ocu";var x6Z="title";var M_8="ine";var z34="eat";var W9b="B";var L6K="template";var l9k="ext";var B4h="submit";var e7p='block';var a2$="outerHeight";var w$T="content";var W1Y='main';var K1m="index";var x75="own";var V7Q='DTE_Footer_Content';var s1H="multi";var q3Y="pty";var e1b="_";var d_b="dTypes";var h4s='▶';var w6D="prototype";var A4Z="conf";var T9J='buttons-edit';var d7t="unique";var t_F="cr";var j4W="-";var i7D="eld";var j32="_edit";var d40="cli";var k58="i1";var n75="slice";var J4I="TE_";var I4L="prop";var p4w="lo";var e7l="mplete";var C8N="led";var u9F="leng";var k70=0;var Y01="versionCheck";var W_U="order";var I55="hide";var N$L='Previous';var Z94="formOp";var Y$1=' ';var e5t='fields';var r1q='Edit entry';var z75='August';var X27="end";var e5B="S";var I_s="act";var F6K="ayed";var H3k="_edi";var j__="_even";var R8G="iner\">";var P6h="aja";var Y4O="npu";var E2h="dataSrc";var w6n="clo";var q7Q="data";var s10="np";var N_k="chang";var W44="Form_Error";var Z57='November';var k$C="Submit";var u8s="x";var v7W="func";var u5O='row';var T4g="settings";var Q5i="on";var L91="ex";var L21="dte";var x7r="fieldTypes";var v3W="rm";var k2r="appendTo";var E68="ai";var l8s='body';var a95='Second';var R_R="_animate";var P8P="DateTime";var z97="exten";var f8w="error";var s0A="confirm";var k3$="lement";var e1X="_editor_val";var s97="eng";var q2g="_show";var m4d="ten";var D0t="No";var E_M="exte";var Y0s="ir";var j3t='DTE_Label';var v0T="isA";var T93="_clearDynamicInfo";var C7K="_actionClass";var j_m="files";var P9U="sh";var I6H="ti";var D7M="target";var o7J="dr";var l9X="sear";var T8F="urce";var u6R="ble";var N4I="indexOf";var v6v="isArr";var I70="Types";var n5I="_multiInfo";var I0p="ad";var R7G="eate";var o92='<div class="';var r40="_s";var k9G="d\"><div></di";var M2S="ab";var m56="mat";var c3F="rows";var X$g="ck";var A2o="mo";var f12="push";var c0w="tion";var U8s="focus";var t9M="_enabled";var K25='"></div>';var y29="ata";var u8p="eptem";var c3T="Id";var O5H='Delete';var i6x="_addOptions";var p29="ma";var M3v="or";var E40="modifier";var N$U="offsetWidth";var k38='string';var l$W="an";var w9I="ap";var B6G="splice";var z7t="pla";var q4T="eac";var N96="ta";var F7x="placeholder";var C6b="es";var R3H="nu";var q_o="valFormat";var S6H="message";var B8R="pend";var j$W="ce";var i_o='1';var l24="ields";var r0X='1.10.20';var Y3q="_input";var B50="I";var g4R="l";var z1$="pt";var E5o="A";var t7m="clear";var W8w="editorFields";var y4B='.edep';var w7V="ror";var l2E='Fri';var u1q='file()';var z4s="obe";var h0M="registe";var J3x='remove';var H_D="id";var H6M="fadeOut";var J_A="Api";var K$i="pre";var I1D="nullDefault";var w23="Type_";var r4o='maxHeight';var x4x='-';var s8I="div.DT";var Q_1="ws().ed";var z6$="s=\"";var y0l="vent";var T_i="valFromData";var u4w="non";var s79="r";var m00="select";var l$5="ult";var l86="cu";var b6J="is";var c27="DataTable";var v3V='DTE_Action_Remove';var B4E="eig";var W_b="ov";var y4Q="W";var B0D="iel";var A0I="draw";var w$$='DTE_Bubble_Close';var M$E="butt";var x$i='disable';var T2V='DTE_Bubble_Triangle';var H4V="iv>";var s6R="stop";var D_f="us";var a6p="as";var T1d="engt";var b_M="classes";var R4L="cte";var s4Y="appe";var e6o="_blur";var c0H="se";var n04="or newer";var H1Y="=\"";var U0T="readonl";var u8Q="Time";var C7X="ax";var S72='Multiple values';var A1B="len";var P$O="url";var k0j="_val";var Y7q="t";var c_P="it()";var i7a="ray";var t3d='<div class="DTED DTED_Lightbox_Wrapper">';var X08="animate";var D5L='multi-noEdit';var W2O="ht";var w99="iv";var O53="dit";var j9y="ons";var z4E=".";var k2S=2;var S$D="ke";var E3B="ep";var X5E="li";var C13="ll";var v7C='blur';var P2Y="pro";var p9U='Are you sure you wish to delete %d rows?';var U7F="tiValue";var Z7I="]";var x$J="off";var t1e="filter";var T7l='div.rendered';var V89="hasClass";var B2S='open';var Z6A="sArray";var O$L="cells";var h47='xhr.dt';var Q4v="ses";var J92="mode";var l98="itle";var i2k="fi";var i3x='<div class="DTED_Envelope_Container"></div>';var S7E="_crudArgs";var w0a="ide";var s1Z="ent";var n4k="iner";var B0M="edi";var N5T='update';var m8a=50;var F4l="toString";var V2y="page";var J75="inArray";var U_$='DTE_Inline_Buttons';var l_$="ho";var u5y="tem";var N4y="yp";var o5b="<di";var h2V="ft";var z3b="ield";var v5p="row.c";var Y5Y='';var q38="r(";var U4J='</div>';var Y0L="ra";var z_Z='\n';var T_q="ue";var g8r="_submitTable";var i1l='keyless';var O6W='inline';var Y$0="lds";var t8w='click';var O3u="nOb";var N$P="ou";var A7s="prevent";var e1p="disp";var F8m="<div";var B1b="isPlainObject";var x2B="upload";var r6b="rro";var B_E="_editor";var R2m="isArray";var X_0="bb";var Y9x="attach";var Y6O="ip";var o0m='DTE_Action_Create';var V9P="move";var r7N="s";var e_m='</span>';var F1i='<';var w$G="tach";var l0a="edit()";var b$O="_displayReorder";var L9X=")";var b_u="tend";var E3h="put";var V1r="rHeigh";var X$4=1;var T4r="po";var N1y="iv class=\"DTED_Envelope_Shadow\"></div>";var S6a="w";var o6g="TE_Bo";var O46="Ap";var f$R=").delete()";var o1k="atta";var p$q="ea";var C4d="wrapper";var S9c="Text";var n0p="\">";var H_n="_Backgrou";var q7R="rowIds";var d9S="aSource";var C0z="umns";var R9L="18n";var U6m="bServerSide";var F9y="set";var r9k="formError";var w4w="type";var V0d="multiReset";var p7S="isp";var S3$="formOptions";var I7i="ajax";var S2H="ng";var j33="_processing";var p14="display";var Z9w="sing";var Y$O="va";var q0f=25;var G7x='disabled';var E3H="sep";var M3b='closed';var Y5V="table";var k7g="\"";var f3S="op";var j2m="cle";var n_K="editOpts";var a4t="da";var U9Y="E_Field";var x3D="mu";var I8X="toggleClass";var K4b='<div class="DTED_Lightbox_Content">';var H7D="gth";var L1o="requires";var S7T="dest";var H7A="t/>";var o3L='am';var G_R='submitComplete';var v$5="nt";var x$l='submit';var e9K="er";var E21="_fieldNames";var N1c="ate";var E76="asse";var Q$$="ur";var A4$="su";var U8D="info";var M5v="od";var W2$="itorFie";var U_a="_eventName";var P5n='<div class="DTED_Lightbox_Close"></div>';var S5U="inpu";var n6d="internalI18n";var I8s='DTE_Field_InputControl';var o9l="mod";var G01="isAr";var b0H="en";var V2G="dis";var E_$="Ne";var Z3F="pu";var G86="crea";var d6Y="displ";var U6X="process";var n9T="pen";var W$K='Undo changes';var G6k='DTE_Field_Message';var N0j='#';var z$2="indexes";var b1h="me_";var e6a="lay";var O9$="DTE_Field_Na";var q$e="_in";var o8$="no";var F$1="empty";var F5C="nTable";var b59="gl";var w7u="call";var c85="Da";var F5m="find";var V4A="bubbleBottom";var b4p="DTE_Bod";var Y$T="header";var Z_V="_picker";var e7M="_tidy";var H3K="mp";var Q3B="Editor ";var b70="key";var C3m='DTE_Processing_Indicator';var l_o="_lastSet";var L3A="remove";var E2q="compare";var V2U="isEmptyObject";var s5K="fa";var R1v="ess";var n$A="ys";var h2p="ub";var X_j='edit';var Q$f="all";var W$t="e";var W3_="N";var m$b="titl";var m4w="show";var C0E="_formOptions";var u32="_di";var e2c="a group.";var D6R='action';var R3P=false;var k0N="der";var J4v="_e";var o3C='DTE_Form_Buttons';var c_z="ws";var V4c="html";var W3R="pag";var U4g="me";var W7r="_v";var p3D="eft";var S9G="defaults";var k3V="pe";var Y8h="lengt";var U46='buttons-remove';var O32="gt";var K_K="width";var r0n='selected';var s6v="ss";var V4a="isPla";var E4x="ar";var F$a="fie";var H2v="replac";var l44='value';var v9N="nput";var T1l="fo";var f9L="spl";var u1w="oc";var v_n='button';var I$y="lti";var f9l="addCla";var z$Q='DTE_Bubble_Liner';var k10="ing";var O9Y="bel";var Y7e="ode";var U18="lainObject";var Z3p="value";var m41=1000;var y5e="nod";var b6a="in different values for this input. To edit and set all items for this input to the same value, click or tap here, otherwise they will retain their individual values.";var d1o="style";var T7f="dt";var Y8_="xte";var R6N="deIn";var v67="iv class=\"DTED_Lig";var v31='object';var H9a='files()';var P9I="editFields";var N1H="form";var t7g="def";var m9N='auto';var j9V="toArray";var e6I="ts";var O9W="att";var C5Y="ect";var w6N="().";var G80="Data";var W2w="y";var P$o='display';var G7Y="Crea";var B$P="ove";var P3O='DT_RowId';var g5b="ntent";var Y3O='btn';var v5H='normal';var G5u="_closeReg";var y$F="n";var G$o="bo";var J79="bel_In";var V_x='multi-info';var Z$4="edit";var M_S="dTo";var F2V="mit";var y8e="os";var c4g="ction";var L3z='[data-editor-value]';var Y$i="xt";var i4Z='cells().edit()';var U8C="able";var A8p="closeCb";var x8N='Minute';var F2J="um";var V2k="div.DTE";var l2_="E_Bubble_Table";var n_x="E";var b7_="footer";var a11=20;var E$9="displayController";var C2b="multiGet";var E8P="oFeatures";var u0A="create";var r4y=',';var X8C="D";var n7c="ope";var p6g="gs";var R4P="nfoShown";var U0Q="ault";var p7s="displa";var v0Z="h";var c2$="g";var g28='DTE DTE_Inline';var F_X=100;var N7A="cont";var D9u="Fn";var l6q="ac";var V5j="ut";var A8e="pl";var z0T="do";var R9N="saf";var N$c="sAr";var f_N="et";var J9z='multi-restore';var Z23="action";var U3k="ber";var Z93="backgr";var h51="nam";var B4r="tr";var A2g="position";var K2U="fields";var H6u="displayed";var K5T="editSin";var H5e="ff";var r8B='function';var v5e="ength";var w$N="apply";var n8d="at";var F2j="_assembleMain";var H7f='February';var F65='Update';var P3J="keys";var W1C='close';var I_z="app";var q6d="m";var Z_S="proc";var l0Q="ua";var C0N="inA";var i8H="R";var p$G="tri";var s7K='keydown';var w3m=" ";var Q1J="o";var Y7s="nts";var z9L="ain";var G9q='input';var m1e="div";var C2w="idSrc";var I8M="na";var u8f="Foote";var t91="ns";var g0d="close";var t8A="recordsDisplay";var a3l="removeClass";var k78="_closeFn";var D$E="row";var N6y='DTE_Field_Input';var i34="editCount";var O5K="ions";var j_p="inli";var u3_="fiel";var Q67="utt";var Z3e="DTE DTE_Bu";var v9b=" DataTables 1.10.20 ";var T9Z="elds";var Z$N="con";var M$y='<div class="DTED_Lightbox_Background"><div></div></div>';var D_v="taT";var C2o="Editor";var W7M="ro";var S25="isP";var K7$="_inp";var E6Z="ls";var w5g='">';var F98="map";var H1k="sta";var O6s=10;var o89="button";var J61="ton";var P60='individual';var V44="per";var T0t="j";var k_0="pper";var G75="bubblePosition";var B7b="ch";var c1W="dy";var F5G="editor";var h7b="label";var F4V=n_x;F4V+=O53;F4V+=Q1J;F4V+=s79;var r0J=u3_;r0J+=d_b;var T3U=F5G;T3U+=x42;T3U+=F3e;var e1O=W$t;e1O+=u8s;e1O+=Y7q;var P48=r$r8n[214853];P48+=y$F;var v2a=l9k;v2a+=W$t;v2a+=y$F;v2a+=r$r8n[625824];var s1N=B6R;s1N+=R4L;s1N+=J8N;var f4L=K5T;f4L+=b59;f4L+=W$t;var Q8Q=W$t;Q8Q+=K2V;var b3o=p5T;b3o+=P7J;b3o+=A8W;var X17=W7M;X17+=c_z;var Y$S=m00;Y$S+=p5T;var h6g=r7N;h6g+=N96;h6g+=B1Z;var O9P=r$L;O9P+=x6M;var I1a=l9k;I1a+=X27;var i1D=J0d;i1D+=Q67;i1D+=Q5i;i1D+=r7N;var V48=G9o;V48+=r$r8n[625824];V48+=c_P;var w1F=X7S;w1F+=f$R;var d1N=W7M;d1N+=Q_1;d1N+=c_P;var e8N=s79;e8N+=Z8M;e8N+=w6N;e8N+=l0a;var k4H=v5p;k4H+=q3f;k4H+=E17;var K8e=B0M;K8e+=o38;K8e+=q38;K8e+=L9X;var h2J=h0M;h2J+=s79;var a8V=E5o;a8V+=O6v;a8V+=r$r8n.b9I;var E1B=r$r8n[625824];E1B+=r$r8n[134240];E1B+=D_v;E1B+=U8C;var o6h=a4t;o6h+=Y7q;o6h+=g17;o6h+=u6R;var S40=Y7q;S40+=l9k;var B53=l9k;B53+=X27;var r5J=E_M;r5J+=h8C;var g0c=L91;g0c+=b_u;var K0D=W$t;K0D+=u8s;K0D+=F4_;K0D+=h8C;var T6g=W$t;T6g+=Y8_;T6g+=h8C;var U_q=W$t;U_q+=K2V;var Y7F=W$t;Y7F+=u8s;Y7F+=F4_;Y7F+=h8C;var N2S=A4_;N2S+=J0d;N2S+=A8W;var C3Z=r$r8n[214853];C3Z+=y$F;var e8=u7e;e8+=S8g;e8+=w99;e8+=b1l;var f6=u7e;f6+=r$r8n[625824];f6+=v67;f6+=W0R;var C8=o5b;C8+=S3F;C8+=R8G;var V_=u7e;V_+=o$I;V_+=r$r8n[625824];V_+=H4V;var J1=s_0;J1+=N1y;var C3=o3c;C3+=I1U;C3+=k9G;C3+=Q5y;var D9=r4t;D9+=Z9w;var p2=X_u;p2+=Q3$;p2+=d3_;var J3=X8C;J3+=x0H;var m6=T5g;m6+=c44;var Q2=x1_;Q2+=T9s;var u7=X_u;u7+=z3r;u7+=L9k;var E3=X_u;E3+=Q3$;E3+=W44;var n2=J0d;n2+=Y7q;n2+=y$F;var X2=X8C;X2+=J4I;X2+=u8f;X2+=s79;var g6=X_u;g6+=V2P;g6+=w23;var m$=O9$;m$+=b1h;var u0=s1H;u0+=s__;u0+=B2o;var V0=X_u;V0+=G_E;V0+=J79;V0+=T1l;var U3=X_u;U3+=U9Y;U3+=e1b;U3+=o23;var c9=x1_;c9+=F4R;var Y5=p3s;Y5+=s79;Y5+=w7V;var X9=Z3e;X9+=j4M;var O1=X_u;O1+=l2_;var f5=G_a;f5+=H_n;f5+=y$F;f5+=r$r8n[625824];var K8=X8C;K8+=o6g;K8+=r$r8n[625824];K8+=W2w;var d7=b4p;d7+=C_O;d7+=m4d;d7+=Y7q;var d$=X81;d$+=N$F;var U0=r$r8n[214853];U0+=y$F;var i$=W$t;i$+=Y$i;i$+=b0H;i$+=r$r8n[625824];var h4=r6S;h4+=e2c;var n3=W_V;n3+=b6a;var d3=n_x;d3+=r$r8n[625824];d3+=r$r8n.b9I;d3+=Y7q;var M8=e5B;M8+=r$r8n[134240];M8+=Y7q;var L3=d1X;L3+=v0Z;L3+=u$n;var A7=y4Q;A7+=W$t;A7+=r$r8n[625824];var n1=d1X;n1+=T_q;var v2=E5a;v2+=Q1J;v2+=y$F;var i2=e5B;i2+=u$n;i2+=y$F;var W7=E_$;W7+=Y$i;var l2=I2K;l2+=N$n;l2+=U3k;var b5=l91;b5+=z4s;b5+=s79;var a7=e5B;a7+=u8p;a7+=U3k;var i6=c78;i6+=u$n;i6+=g4R;i6+=W2w;var h_=E5o;h_+=c7_;h_+=r$r8n.b9I;h_+=g4R;var o0=E5a;o0+=r$r8n[134240];o0+=z5g;o0+=v0Z;var m7=Y98;m7+=l0Q;m7+=s79;m7+=W2w;var d6=O6v;d6+=q6d;var G6=G7Y;G6+=D6Y;G6+=n3k;var G2=W3_;G2+=W$t;G2+=S6a;var z5=z97;z5+=r$r8n[625824];var v4=N_k;v4+=p5T;var D4=r$r8n.W1t;D4+=c4l;D4+=r$r8n[625824];var I0=R_8;I0+=t7x;I0+=r$r8n.W1t;var I$=W$t;I$+=Y$i;I$+=b0H;I$+=r$r8n[625824];var W5=X5E;W5+=E4D;var a_=l6q;a_+=Y7q;a_+=E7s;a_+=y$F;var B3=r$r8n[134240];B3+=g4R;B3+=g4R;var J8=s79;J8+=Q1J;J8+=S6a;var v_=A4$;v_+=U3j;v_+=Y7q;var j8=T7i;j8+=y8e;j8+=W$t;var d2=w6n;d2+=c0H;var w_=r$r8n[214853];w_+=y$F;'use strict';L7h.H_=function(W2){if(L7h)return L7h.Q8(W2);};(function(){var R1A="info - ";var D39="Thank you for tryin";var b$S=60;var Q6i="log";var y1p=".net/purchase";var R5X="ri";var K7f="tor - T";var n5l="getTime";var c6N="for Editor, please see https://editor.datatables";var R5d="al expired";var H1C=" Editor\n\n";var A6l=3555154948;var O2g=' remaining';var I__=1711324800;var C9F='s';var k3B="g DataTables";var B_V=7;var M1D=3244;var A7p="getTi";var D4$="Edi";var N1a="9ae2";var e4a="2156";var L1D=24;var J56='Your trial has now expired. To purchase a license ';var T9_="Tables Ed";var O3j=' day';var m13="itor trial ";var N1=A7p;N1+=U4g;var h2=r$r8n.W1t;h2+=W$t;h2+=T2d;var remaining=Math[h2]((new Date((L7h.t3(e4a)?A6l:I__) * (L7h.H_(N1a)?m41:M1D))[n5l]() - new Date()[N1]()) / (m41 * b$S * b$S * L1D));L7h.q_G();if(remaining <= k70){var W8=D4$;W8+=K7f;W8+=R5X;W8+=R5d;var H3=c6N;H3+=y1p;var t1=D39;t1+=k3B;t1+=H1C;alert(t1 + J56 + H3);throw W8;}else if(remaining <= B_V){var R6=G80;R6+=T9_;R6+=m13;R6+=R1A;console[Q6i](R6 + remaining + O3j + (remaining === X$4?Y5Y:C9F) + O2g);}})();var DataTable=$[w_][r$r8n.G5j];var formOptions={buttons:w6a,drawType:R3P,focus:k70,message:w6a,nest:R3P,onBackground:v7C,onBlur:d2,onComplete:j8,onEsc:W1C,onFieldError:Q$T,onReturn:v_,scope:J8,submit:B3,submitHtml:h4s,submitTrigger:J1q,title:w6a};var defaults$1={actionName:a_,ajax:J1q,display:W5,events:{},fields:[],formOptions:{bubble:$[I$]({},formOptions,{buttons:I0,message:R3P,submit:D4,title:R3P}),inline:$[e$$]({},formOptions,{buttons:R3P,submit:v4}),main:$[z5]({},formOptions)},i18n:{close:R2R,create:{button:G2,submit:I2n,title:G6},datetime:{amPm:[o3L,d6],hours:u33,minutes:x8N,months:[m7,H7f,o0,h_,h0j,k1Y,i6,z75,a7,b5,Z57,l2],next:W7,previous:N$L,seconds:a95,unknown:x4x,weekdays:[i2,v2,n1,A7,L3,l2E,M8]},edit:{button:d3,submit:F65,title:r1q},error:{system:z_i},multi:{info:n3,noMulti:h4,restore:W$K,title:S72},remove:{button:O5H,confirm:{1:M1B,_:p9U},submit:O5H,title:O5H}},idSrc:P3O,table:J1q};var settings={action:J1q,actionName:D6R,ajax:J1q,bubbleNodes:[],bubbleBottom:R3P,bubbleLocation:m9N,closeCb:J1q,closeIcb:J1q,dataSource:J1q,displayController:J1q,displayed:R3P,editCount:k70,editData:{},editFields:{},editOpts:{},fields:{},formOptions:{bubble:$[i$]({},formOptions),inline:$[e$$]({},formOptions),main:$[e$$]({},formOptions)},globalError:Y5Y,id:-X$4,idSrc:J1q,includeFields:[],mode:J1q,modifier:J1q,opts:J1q,order:[],processing:R3P,setFocus:J1q,table:J1q,template:J1q,unique:k70};var DataTable$6=$[U0][r$r8n.G5j];function el(tag,ctx){var h27='*[data-dte-e="';var j4=k7g;j4+=Z7I;if(ctx === undefined){ctx=document;}return $(h27 + tag + j4,ctx);}function safeDomId(id,prefix){var S6=r7N;S6+=B4r;S6+=f6B;S6+=c2$;if(prefix === void k70){prefix=N0j;}return typeof id === S6?prefix + id[C$6](/\./g,x4x):prefix + id;}function safeQueryId(id,prefix){var w0F="\\$";var k2=w0F;k2+=r$r8n.G6G;var j9=H2v;j9+=W$t;var L6=Y5i;L6+=f6B;L6+=c2$;if(prefix === void k70){prefix=N0j;}return typeof id === L6?prefix + id[j9](/(:|\.|\[|\]|,)/g,k2):prefix + id;}function dataGet(src){L7h.q_G();var z8l="util";return DataTable$6[z8l][s_D](src);}function dataSet(src){var n0=c0H;L7h.q_G();n0+=Y7q;var f8=u$n;f8+=Y7q;f8+=T2d;return DataTable$6[f8][n0](src);}function pluck(a,prop){var out=[];L7h.q_G();$[j0E](a,function(idx,elIn){out[f12](elIn[prop]);});return out;}function deepCompare(o1,o2){var h$7="ey";var B0=u9F;B0+=P8O;var G7=A8W;G7+=S2H;G7+=Y7q;G7+=v0Z;var j2=l0E;j2+=h$7;j2+=r7N;var g8=l0E;g8+=W$t;g8+=n$A;if(typeof o1 !== v31 || typeof o2 !== v31 || o1 === J1q || o2 === J1q){return o1 == o2;}var o1Props=Object[g8](o1);var o2Props=Object[j2](o2);if(o1Props[T1W] !== o2Props[G7]){return R3P;}for(var i=k70,ien=o1Props[B0];i < ien;i++){var propName=o1Props[i];if(typeof o1[propName] === v31){if(!deepCompare(o1[propName],o2[propName])){return R3P;}}else if(o1[propName] != o2[propName]){return R3P;}}return w6a;}function extendDeepObjShallowArr(out,extender){var i0U="operty";var s3_="sPlainOb";var p94="totype";var W0k="hasOwnPr";var val;for(var prop in extender){var o9=W0k;o9+=i0U;var T5=P2Y;T5+=p94;if(Object[T5][o9][w7u](extender,prop)){var v5=r$r8n.b9I;v5+=N$c;v5+=i7a;var Y2=r$r8n.b9I;Y2+=s3_;Y2+=f6j;val=extender[prop];if($[Y2](val)){var f2=R9$;f2+=Q_e;if(!$[f2](out[prop])){out[prop]={};}$[e$$](w6a,out[prop],val);}else if(Array[v5](val)){var h6=r7N;h6+=X5E;h6+=j$W;out[prop]=val[h6]();}else {out[prop]=val;}}}return out;}var _dtIsSsp=function(dt,editor){var q0I="rverS";var S6m="bSe";var x2=y$F;x2+=Q1J;x2+=U4H;var G8=S6m;G8+=q0I;G8+=w0a;return dt[T4g]()[k70][E8P][G8] && editor[r7N][n_K][Y1$] !== x2;};var _dtApi=function(table){var F7j="Ta";var u3=G80;u3+=F7j;u3+=J0d;u3+=A8W;var r0=r$r8n[214853];r0+=y$F;return table instanceof $[r0][r$r8n.G5j][J_A]?table:$(table)[u3]();};var _dtHighlight=function(node){L7h.g_4();node=$(node);setTimeout(function(){var r8G='dte-highlight';node[R0K](r8G);L7h.g_4();setTimeout(function(){var S9Z="oveCl";var u1t="-highlig";var e5=L21;e5+=u1t;e5+=v0Z;e5+=Y7q;L7h.g_4();var M4=c81;M4+=S9Z;M4+=p26;node[M4](e5);},m41);},a11);};var _dtRowSelector=function(out,dt,identifier,fields,idFn){var w4=s79;w4+=Z8M;L7h.g_4();w4+=r7N;dt[w4](identifier)[z$2]()[j0E](function(idx){var x_O="dentifie";var p6b=14;var H7N="Unable to find row i";var S2=s79;S2+=Z8M;var b$=y5e;b$+=W$t;var l1=r$r8n[625824];l1+=y29;var row=dt[D$E](idx);var data=row[l1]();var idSrc=idFn(data);if(idSrc === undefined){var b9=H7N;b9+=x_O;b9+=s79;var f4=j2z;f4+=M3v;Editor[f4](b9,p6b);}out[idSrc]={data:data,fields:fields,idSrc:idSrc,node:row[b$](),type:S2};});};var _dtFieldsFromIdx=function(dt,fields,idx,ignoreUnknown){var C_L="etting";var I43="m source. Pleas";L7h.q_G();var d7h="editF";var x1B="e specify the field name.";var U9Q="mD";var b_l=11;var i7T="aoColumns";var t1v="Unable to automatically determine field fro";var g5=U9Q;g5+=r$r8n[134240];g5+=Y7q;g5+=r$r8n[134240];var M$=d7h;M$+=B0D;M$+=r$r8n[625824];var I9=d7h;I9+=r$r8n.b9I;I9+=W$t;I9+=H6e;var v$=r7N;v$+=C_L;v$+=r7N;var col=dt[v$]()[k70][i7T][idx];var dataSrc=col[I9] !== undefined?col[M$]:col[g5];var resolvedFields={};var run=function(field,dataSrcIn){var p0=y$F;p0+=r$r8n[134240];p0+=q6d;p0+=W$t;if(field[p0]() === dataSrcIn){resolvedFields[field[N5t]()]=field;}};$[j0E](fields,function(name,fieldInst){if(Array[R2m](dataSrc)){var E0=g4R;E0+=v5e;for(var _i=k70,dataSrc_1=dataSrc;_i < dataSrc_1[E0];_i++){var data=dataSrc_1[_i];run(fieldInst,data);}}else {run(fieldInst,dataSrc);}});if($[V2U](resolvedFields) && !ignoreUnknown){var Q$=t1v;Q$+=I43;Q$+=x1B;Editor[f8w](Q$,b_l);}return resolvedFields;};var _dtCellSelector=function(out,dt,identifier,allFields,idFn,forceFields){var q2=x4s;q2+=u8s;q2+=C6b;var T3=r$r8n.W1t;T3+=W$t;T3+=C13;T3+=r7N;if(forceFields === void k70){forceFields=J1q;}var cells=dt[T3](identifier);cells[q2]()[j0E](function(idx){var f0Y="colu";var v4B="splayFiel";var d6L="count";var d__="fixedNode";var o_v="mn";var p5K="ttachFields";var U3I="cell";var D6E="nodeNa";var R7I="attachFiel";var e0g="displayFi";var K9=A8W;K9+=S2H;K9+=Y7q;K9+=v0Z;var K2=D6E;K2+=U4g;var p1=f0Y;p1+=o_v;var i5=r$r8n[625824];i5+=n8d;i5+=r$r8n[134240];var z1=s79;z1+=Q1J;z1+=S6a;var cell=dt[U3I](idx);var row=dt[z1](idx[D$E]);var data=row[i5]();var idSrc=idFn(data);var fields=forceFields || _dtFieldsFromIdx(dt,allFields,idx[p1],cells[d6L]() > X$4);var isNode=typeof identifier === v31 && identifier[K2] || identifier instanceof $;var prevDisplayFields;var prevAttach;var prevAttachFields;if(Object[P3J](fields)[K9]){var Q_=J$7;Q_+=v4B;Q_+=F3e;var p6=W$t;p6+=Y8_;p6+=h8C;var W3=y$F;W3+=Q1J;W3+=r$r8n[625824];W3+=W$t;var I3=O6v;I3+=u$n;I3+=P9U;var x5=o1k;x5+=B7b;var W4=r$r8n[134240];W4+=p5K;if(out[idSrc]){var c1=e0g;c1+=T9Z;var U1=R7I;U1+=F3e;prevAttach=out[idSrc][Y9x];prevAttachFields=out[idSrc][U1];prevDisplayFields=out[idSrc][c1];}_dtRowSelector(out,dt,idx[D$E],allFields,idFn);out[idSrc][I7W]=prevAttachFields || [];out[idSrc][W4][f12](Object[P3J](fields));out[idSrc][x5]=prevAttach || [];out[idSrc][Y9x][I3](isNode?$(identifier)[s_D](k70):cell[d__]?cell[d__]():cell[W3]());out[idSrc][k4E]=prevDisplayFields || ({});$[p6](out[idSrc][Q_],fields);}});};var _dtColumnSelector=function(out,dt,identifier,fields,idFn){var u_=r$r8n.W1t;u_+=R_q;u_+=g4R;L7h.g_4();u_+=r7N;dt[u_](J1q,identifier)[z$2]()[j0E](function(idx){_dtCellSelector(out,dt,idx,fields,idFn);});};var dataSource$1={commit:function(action,identifier,data,store){var R6L="responsive";var R1H="fu";var L7_="spons";var A9V="wType";var z5T="searchBuilder";var g3S="hBuil";var A9l="rchPanes";var S7X="recalc";var k03="tails";var v$j="build";var Y7T="hBui";var d4N="any";var y4R="rebuildPane";var S0D="Panes";var z1Z="searc";var p0D="ear";var j8i="Builder";var V82="getD";var A2a='draw';var s6A="sea";var X93="rebuild";var U7v="lder";var G45="arc";var y2w="Op";var x6=o7J;x6+=r$r8n[134240];x6+=A9V;var u4=Z$4;u4+=y2w;u4+=Y7q;u4+=r7N;var w5=W$t;w5+=r$r8n[625824];w5+=r$r8n.b9I;w5+=Y7q;var n6=Y7q;n6+=M2S;n6+=g4R;n6+=W$t;var that=this;var dt=_dtApi(this[r7N][n6]);var ssp=dt[T4g]()[k70][E8P][U6m];var ids=store[q7R];if(!_dtIsSsp(dt,this) && action === w5 && store[q7R][T1W]){var d5=g4R;d5+=W$t;d5+=F0a;var row=void k70;var compare=function(id){return function(rowIdx,rowData,rowNode){var m0=r$r8n.W1t;m0+=r$r8n[134240];m0+=C13;var z2=r$r8n.b9I;z2+=r$r8n[625824];L7h.g_4();return id == dataSource$1[z2][m0](that,rowData);};};for(var i=k70,ien=ids[d5];i < ien;i++){try{var I_=s79;I_+=Q1J;I_+=S6a;row=dt[I_](safeQueryId(ids[i]));}catch(e){row=dt;}if(!row[d4N]()){row=dt[D$E](compare(ids[i]));}if(row[d4N]() && !ssp){var X5=s79;X5+=W$t;X5+=A2o;X5+=v1D;row[X5]();}}}var drawType=this[r7N][u4][x6];if(drawType !== D8d){var I1=c0H;I1+=G45;I1+=Y7T;I1+=U7v;var C0=l9X;C0+=B7b;C0+=j8i;var E6=R1H;E6+=S6D;var m_=r7N;m_+=p0D;m_+=B7b;m_+=S0D;var dtAny=dt;if(ssp && ids && ids[T1W]){var g_=Q1J;g_+=y$F;g_+=W$t;dt[g_](A2a,function(){var w9=A8W;w9+=y$F;w9+=O32;w9+=v0Z;for(var i=k70,ien=ids[w9];i < ien;i++){var F1=r$r8n[134240];F1+=y$F;F1+=W2w;var row=dt[D$E](safeQueryId(ids[i]));if(row[F1]()){var w3=y$F;w3+=Q1J;w3+=r$r8n[625824];w3+=W$t;_dtHighlight(row[w3]());}}});}dt[A0I](drawType);if(dtAny[R6L]){var O6=v60;O6+=L7_;O6+=w99;O6+=W$t;dtAny[O6][S7X]();}if(typeof dtAny[m_] === E6 && !ssp){var y8=s6A;y8+=A9l;dtAny[y8][y4R](undefined,w6a);}if(dtAny[C0] !== undefined && typeof dtAny[I1][X93] === r8B && !ssp){var N0=V82;N0+=W$t;N0+=k03;var j0=s79;j0+=W$t;j0+=v$j;var M3=z1Z;M3+=g3S;M3+=r$r8n[625824];M3+=e9K;dtAny[M3][j0](dtAny[z5T][N0]());}}},create:function(fields,data){var b4=N96;b4+=J0d;b4+=g4R;b4+=W$t;var dt=_dtApi(this[r7N][b4]);if(!_dtIsSsp(dt,this)){var x$=r$r8n[134240];x$+=r$r8n[625824];x$+=r$r8n[625824];var row=dt[D$E][x$](data);_dtHighlight(row[F_v]());}},edit:function(identifier,fields,data,store){var a$V="owId";var Y_Q="tOpts";var I_R="owIds";var T$=y$F;T$+=Q1J;T$+=U4H;var L5=B0M;L5+=Y_Q;var that=this;var dt=_dtApi(this[r7N][Y5V]);if(!_dtIsSsp(dt,this) || this[r7N][L5][Y1$] === T$){var r4=o8$;r4+=Z7B;var h1=l$W;h1+=W2w;var B1=r$r8n[134240];B1+=y$F;B1+=W2w;var C2=r$r8n.W1t;C2+=r$r8n[134240];C2+=g4R;C2+=g4R;var rowId_1=dataSource$1[H_D][C2](this,data);var row=void k70;try{row=dt[D$E](safeQueryId(rowId_1));}catch(e){row=dt;}if(!row[B1]()){row=dt[D$E](function(rowIdx,rowData,rowNode){var D5=L1p;L7h.g_4();D5+=g4R;var B6=r$r8n.b9I;B6+=r$r8n[625824];return rowId_1 == dataSource$1[B6][D5](that,rowData);});}if(row[h1]()){var W1=s79;W1+=a$V;W1+=r7N;var J7=s79;J7+=I_R;var U6=C0N;U6+=s79;U6+=Y0L;U6+=W2w;var L_=a4t;L_+=N96;var toSave=extendDeepObjShallowArr({},row[q7Q]());toSave=extendDeepObjShallowArr(toSave,data);row[L_](toSave);var idx=$[U6](rowId_1,store[J7]);store[W1][B6G](idx,X$4);}else {var P8=s79;P8+=Q1J;P8+=S6a;row=dt[P8][h6B](data);}_dtHighlight(row[r4]());}},fakeRow:function(insertPoint){var x62="olumns";var p6u="columns";var u8X="sClass";var G3V="__dtFa";var g_K="aoC";var e5z="vis";var C7A='<tr class="dte-inlineAdd">';var h2n="keRo";var y_=s79;y_+=Q1J;y_+=S6a;var C9=Q1J;C9+=y$F;var a$=G3V;a$+=h2n;a$+=S6a;var E8=r$r8n.W1t;E8+=N$P;E8+=y$F;E8+=Y7q;var H1=B0s;H1+=e5z;H1+=r$r8n.b9I;H1+=u6R;var dt=_dtApi(this[r7N][Y5V]);var tr=$(C7A);L7h.g_4();var attachFields=[];var attach=[];var displayFields={};var tbody=dt[Y5V](undefined)[X2f]();for(var i=k70,ien=dt[p6u](H1)[E8]();i < ien;i++){var C6=g_K;C6+=x62;var t2=w9I;t2+=n9T;t2+=M_S;var Q4=u7e;Q4+=Y7q;Q4+=r$r8n[625824];Q4+=b1l;var x4=f6B;x4+=Z7B;x4+=u8s;var q9=r$r8n.W1t;q9+=v8f;q9+=F2J;q9+=y$F;var visIdx=dt[q9](i + v50)[x4]();var td=$(Q4)[t2](tr);var fields=_dtFieldsFromIdx(dt,this[r7N][K2U],visIdx,w6a);var settings=dt[T4g]()[k70];var className=settings[C6][visIdx][u8X];if(className){td[R0K](className);}if(Object[P3J](fields)[T1W]){var B$=O6v;B$+=u$n;B$+=r7N;B$+=v0Z;var S_=l0E;S_+=W$t;S_+=n$A;attachFields[f12](Object[S_](fields));attach[B$](td[k70]);$[e$$](displayFields,fields);}}var append=function(){var m22="ppendT";var y3z="ependT";var S_J='end';var Z1=c7_;Z1+=y3z;Z1+=Q1J;var R2=r$r8n[134240];R2+=m22;R2+=Q1J;var a2=r$r8n.b9I;a2+=y$F;L7h.g_4();a2+=T1l;if(dt[V2y][a2]()[t8A] === k70){var u8=W$t;u8+=H3K;u8+=Y7q;u8+=W2w;$(tbody)[u8]();}var action=insertPoint === S_J?R2:Z1;tr[action](tbody);};this[a$]=tr;append();dt[C9](U6p,function(){append();});return {0:{attach:attach,attachFields:attachFields,displayFields:displayFields,fields:this[r7N][K2U],type:y_}};},fakeRowEnd:function(){var x8K="__dt";var U6v="_dtFakeRo";var f_c="FakeRo";var k_=r$r8n.b9I;k_+=y$F;k_+=T1l;var P6=W3R;P6+=W$t;var J_=e1b;J_+=U6v;J_+=S6a;var c3=v60;c3+=q6d;c3+=W_b;c3+=W$t;var e7=x8K;e7+=f_c;e7+=S6a;L7h.g_4();var dt=_dtApi(this[r7N][Y5V]);dt[x$J](U6p);this[e7][c3]();this[J_]=J1q;if(dt[P6][k_]()[t8A] === k70){dt[A0I](R3P);}},fields:function(identifier){var Y9s="cel";var o3G="colum";var N2k="lls";var b$D="col";var r6=j$W;r6+=N2k;var T8=o3G;T8+=t91;var L1=W7M;L1+=S6a;L1+=r7N;var L0=i2k;L0+=i7D;L0+=r7N;var idFn=dataGet(this[r7N][C2w]);var dt=_dtApi(this[r7N][Y5V]);var fields=this[r7N][L0];var out={};if($[B1b](identifier) && (identifier[L1] !== undefined || identifier[T8] !== undefined || identifier[r6] !== undefined)){var P3=b$D;P3+=C0z;if(identifier[c3F] !== undefined){_dtRowSelector(out,dt,identifier[c3F],fields,idFn);}if(identifier[P3] !== undefined){var j6=o3G;j6+=t91;_dtColumnSelector(out,dt,identifier[j6],fields,idFn);}if(identifier[O$L] !== undefined){var S$=Y9s;S$+=E6Z;_dtCellSelector(out,dt,identifier[S$],fields,idFn);}}else {_dtRowSelector(out,dt,identifier,fields,idFn);}return out;},id:function(data){var idFn=dataGet(this[r7N][C2w]);return idFn(data);},individual:function(identifier,fieldNames){var U8=i2k;U8+=R_q;U8+=r$r8n[625824];U8+=r7N;var idFn=dataGet(this[r7N][C2w]);var dt=_dtApi(this[r7N][Y5V]);L7h.g_4();var fields=this[r7N][U8];var out={};var forceFields;if(fieldNames){var X1=p$q;X1+=r$r8n.W1t;X1+=v0Z;if(!Array[R2m](fieldNames)){fieldNames=[fieldNames];}forceFields={};$[X1](fieldNames,function(i,name){forceFields[name]=fields[name];});}_dtCellSelector(out,dt,identifier,fields,idFn,forceFields);return out;},prep:function(action,identifier,submit,json,store){var L4T="wI";var A_k="cance";var g2M="can";var i2Z="celled";var y4=t_F;y4+=z34;y4+=W$t;L7h.q_G();var _this=this;if(action === y4){var A3=a4t;A3+=Y7q;A3+=r$r8n[134240];var v8=p29;v8+=O6v;store[q7R]=$[v8](json[A3],function(row){L7h.q_G();var T1=r$r8n.b9I;T1+=r$r8n[625824];return dataSource$1[T1][w7u](_this,row);});}if(action === X_j){var K3=r$r8n[625824];K3+=y29;var P$=q6d;P$+=r$r8n[134240];P$+=O6v;var p3=s79;p3+=Q1J;p3+=L4T;p3+=F3e;var i4=A_k;i4+=g4R;i4+=C8N;var cancelled_1=json[i4] || [];store[p3]=$[P$](submit[K3],function(val,key){var O8=r$r8n[625824];O8+=n8d;O8+=r$r8n[134240];return !$[V2U](submit[O8][key]) && $[J75](key,cancelled_1) === -X$4?key:undefined;});}else if(action === J3x){var U4=g2M;U4+=i2Z;store[U4]=json[E5V] || [];}},refresh:function(){var x6q="reload";L7h.q_G();var F9=p7o;F9+=C7X;var dt=_dtApi(this[r7N][Y5V]);dt[F9][x6q](J1q,R3P);},remove:function(identifier,fields,store){var j6h="every";var r9=g4R;r9+=T1d;r9+=v0Z;var S1=u80;S1+=A8W;var that=this;var dt=_dtApi(this[r7N][S1]);var cancelled=store[E5V];if(cancelled[r9] === k70){var q8=s79;q8+=W$t;q8+=V9P;dt[c3F](identifier)[q8]();}else {var g4=c81;g4+=W_b;g4+=W$t;var D8=s79;D8+=Q1J;D8+=c_z;var z_=s79;z_+=Z8M;z_+=r7N;var indexes_1=[];dt[z_](identifier)[j6h](function(){L7h.g_4();var I8=C0N;I8+=s79;I8+=Y0L;I8+=W2w;var R3=L1p;R3+=g4R;var id=dataSource$1[H_D][R3](that,this[q7Q]());if($[I8](id,cancelled) === -X$4){var z7=Z3F;z7+=r7N;z7+=v0Z;indexes_1[z7](this[K1m]());}});dt[D8](indexes_1)[g4]();}}};function _htmlId(identifier){var c41='[data-editor-id="';var s7C='Could not find an element with `data-editor-id` or `id` of: ';var H5T="keyle";var U3a="rin";var k7=H5T;k7+=r7N;k7+=r7N;if(identifier === k7){return $(document);}var specific=$(c41 + identifier + q$Z);if(specific[T1W] === k70){var J$=g2J;J$+=U3a;J$+=c2$;specific=typeof identifier === J$?$(safeQueryId(identifier)):$(identifier);}if(specific[T1W] === k70){throw new Error(s7C + identifier);}return specific;}function _htmlEl(identifier,name){var k5Y='[data-editor-field="';var p8=k7g;p8+=Z7I;var context=_htmlId(identifier);return $(k5Y + name + p8,context);}function _htmlEls(identifier,names){var out=$();L7h.q_G();for(var i=k70,ien=names[T1W];i < ien;i++){var O4=r$r8n[134240];O4+=r$r8n[625824];O4+=r$r8n[625824];out=out[O4](_htmlEl(identifier,names[i]));}return out;}function _htmlGet(identifier,dataSrc){var e6p='data-editor-value';var H7v="tm";L7h.q_G();var A1=v0Z;A1+=H7v;A1+=g4R;var V6=r$r8n[134240];V6+=Y7q;V6+=Y7q;V6+=s79;var el=_htmlEl(identifier,dataSrc);return el[t1e](L3z)[T1W]?el[V6](e6p):el[A1]();}function _htmlSet(identifier,fields,data){var t8=p$q;L7h.g_4();t8+=B7b;$[t8](fields,function(name,field){var o3A="-editor-";var val=field[T_i](data);if(val !== undefined){var el=_htmlEl(identifier,field[E2h]());if(el[t1e](L3z)[T1W]){var S4=r$r8n[625824];S4+=y29;S4+=o3A;S4+=Z3p;el[J2w](S4,val);}else {el[j0E](function(){var e61="Nodes";var J7N="firstChild";var T$0="removeChild";L7h.g_4();var u6=W7c;u6+=H6e;u6+=e61;while(this[u6][T1W]){this[T$0](this[J7N]);}})[V4c](val);}}});}var dataSource={create:function(fields,data){L7h.g_4();if(data){var i7=r$r8n.b9I;i7+=r$r8n[625824];var id=dataSource[i7][w7u](this,data);try{var N_=g4R;N_+=v5e;if(_htmlId(id)[N_]){_htmlSet(id,fields,data);}}catch(e){}}},edit:function(identifier,fields,data){var l4X="keyl";var P7=l4X;L7h.g_4();P7+=C6b;P7+=r7N;var id=dataSource[H_D][w7u](this,data) || P7;_htmlSet(id,fields,data);},fields:function(identifier){var B16="eyl";var X4=s79;L7h.q_G();X4+=Q1J;X4+=S6a;var q5=W$t;q5+=r$r8n[134240];q5+=r$r8n.W1t;q5+=v0Z;var N6=G01;N6+=i7a;var out={};if(Array[N6](identifier)){for(var i=k70,ien=identifier[T1W];i < ien;i++){var S8=r$r8n.W1t;S8+=Q$f;var res=dataSource[K2U][S8](this,identifier[i]);out[identifier[i]]=res[identifier[i]];}return out;}var data={};var fields=this[r7N][K2U];if(!identifier){var b0=l0E;b0+=B16;b0+=W$t;b0+=s6v;identifier=b0;}$[q5](fields,function(name,field){var t9o="lToDa";var v6=E9Q;v6+=r$r8n[134240];v6+=t9o;v6+=N96;var val=_htmlGet(identifier,field[E2h]());field[v6](data,val === J1q?undefined:val);});out[identifier]={data:data,fields:fields,idSrc:identifier,node:document,type:X4};return out;},id:function(data){L7h.g_4();var idFn=dataGet(this[r7N][C2w]);return idFn(data);},individual:function(identifier,fieldNames){var g50="isArra";var Q0L='Cannot automatically determine field name from data source';var y11="r-i";var y2c="elf";var O0J="-edit";var N6d="odeN";var W0o="or-id]";var F1I="[data";var Q_v='data-editor-field';var U27="addB";var p5=p$q;p5+=B7b;var U7=W$t;U7+=r$r8n[134240];U7+=B7b;var Y3=r$r8n[214853];Y3+=p0J;Y3+=H6e;Y3+=r7N;var I5=r$r8n.W1t;I5+=Q$f;var g$=r$r8n[214853];g$+=r$r8n.b9I;g$+=R_q;g$+=F3e;var s1=Y8h;s1+=v0Z;var Y$=g50;Y$+=W2w;var r5=y$F;r5+=N6d;r5+=A9T;var attachEl;if(identifier instanceof $ || identifier[r5]){var s0=Z$4;s0+=Q1J;s0+=y11;s0+=r$r8n[625824];var x7=r$r8n[625824];x7+=r$r8n[134240];x7+=Y7q;x7+=r$r8n[134240];var n_=F1I;n_+=O0J;n_+=W0o;var E5=l$W;E5+=r$r8n[625824];E5+=e5B;E5+=y2c;var Y4=U27;Y4+=l6q;Y4+=l0E;attachEl=identifier;if(!fieldNames){var d4=r$r8n[134240];d4+=P4Y;d4+=s79;fieldNames=[$(identifier)[d4](Q_v)];}var back=$[r$r8n.n2M][Y4]?M8$:E5;identifier=$(identifier)[z5L](n_)[back]()[x7](s0);}if(!identifier){identifier=i1l;}if(fieldNames && !Array[Y$](fieldNames)){fieldNames=[fieldNames];}if(!fieldNames || fieldNames[s1] === k70){throw new Error(Q0L);}var out=dataSource[g$][I5](this,identifier);var fields=this[r7N][Y3];var forceFields={};$[U7](fieldNames,function(i,name){forceFields[name]=fields[name];});$[p5](out,function(id,set){var W92="typ";var o_=o1k;o_+=B7b;var H4=r$r8n.W1t;H4+=W$t;H4+=g4R;L7h.q_G();H4+=g4R;var c6=W92;c6+=W$t;set[c6]=H4;set[I7W]=[fieldNames];set[o_]=attachEl?$(attachEl):_htmlEls(identifier,fieldNames)[j9V]();set[K2U]=fields;set[k4E]=forceFields;});return out;},initField:function(cfg){var H8I='[data-editor-label="';var c_=a4t;c_+=N96;var label=$(H8I + (cfg[c_] || cfg[N5t]) + q$Z);if(!cfg[h7b] && label[T1W]){cfg[h7b]=label[V4c]();}},remove:function(identifier,fields){L7h.g_4();if(identifier !== i1l){_htmlId(identifier)[L3A]();}}};var classNames={actions:{create:o0m,edit:d$,remove:v3V},body:{content:d7,wrapper:K8},bubble:{bg:f5,close:w$$,liner:z$Q,pointer:T2V,table:O1,wrapper:X9},field:{'disabled':G7x,'error':Y5,'input':N6y,'inputControl':I8s,'label':j3t,'msg-error':c9,'msg-info':U3,'msg-label':V0,'msg-message':G6k,'multiInfo':V_x,'multiNoEdit':D5L,'multiRestore':J9z,'multiValue':u0,'namePrefix':m$,'processing':C3m,'typePrefix':g6,'wrapper':h39},footer:{content:V7Q,wrapper:X2},form:{button:Y3O,buttonSubmit:n2,buttonInternal:Y3O,buttons:o3C,content:A5H,error:E3,info:u7,tag:Y5Y,wrapper:Q2},header:{content:m6,title:{tag:J1q,class:Y5Y},wrapper:J3},inline:{buttons:U_$,liner:p2,wrapper:g28},processing:{active:D9,indicator:C3m},wrapper:y77};var displayed$2=R3P;var cssBackgroundOpacity=X$4;var dom$1={background:$(C3)[k70],close:$(G6T)[k70],content:J1q,wrapper:$(a$K + J1 + i3x + V_)[k70]};function findAttachRow(editor,attach){var Z$f="hea";var q6=r$r8n.W1t;q6+=v60;q6+=n8d;q6+=W$t;var x3=Z$f;x3+=r$r8n[625824];var e4=Y7q;e4+=U8C;var O2=E5o;O2+=O6v;O2+=r$r8n.b9I;var L4=a4t;L4+=D_v;L4+=I9B;L4+=W$t;var l7=r$r8n[214853];l7+=y$F;var dt=new $[l7][L4][O2](editor[r7N][e4]);if(attach === x3){var r3=Y7q;r3+=M2S;r3+=g4R;r3+=W$t;return dt[r3](undefined)[Y$T]();}else if(editor[r7N][Z23] === q6){return dt[Y5V](undefined)[Y$T]();}else {var R5=W7M;R5+=S6a;return dt[R5](editor[r7N][E40])[F_v]();}}function heightCalc$1(dte){var Y62="height";var l9J="ght";var z3z="_Foo";var V_T=".DTE_";var M9C="wi";var y$U="_Body_Content";var I6W="out";var v5b="outer";var j0o="Header";var N2D="ei";var l78="ndowPadding";var w68="eight";var L7x="H";var L2=v5b;L2+=L7x;L2+=N2D;L2+=l9J;var K$=r$r8n.W1t;K$+=s6v;var G_=S6a;G_+=w1r;G_+=W$t;G_+=s79;var f0=V2k;f0+=y$U;var p7=M9C;p7+=l78;var F8=I6W;F8+=W$t;F8+=V1r;F8+=Y7q;var V8=B1w;V8+=e9K;var i8=V2k;i8+=z3z;i8+=u3q;var J2=h5Y;J2+=w68;var l4=J$7;l4+=E9Q;l4+=V_T;l4+=j0o;var header=$(l4,dom$1[C4d])[J2]();var footer=$(i8,dom$1[V8])[F8]();var maxHeight=$(window)[Y62]() - envelope[A4Z][p7] * k2S - header - footer;$(f0,dom$1[G_])[K$](r4o,maxHeight);return $(dte[U1m][C4d])[L2]();}function hide$2(dte,callback){var a_c="Height";var L71="conte";if(!callback){callback=function(){};}if(displayed$2){var S5=A0g;S5+=r$r8n[214853];S5+=F9y;S5+=a_c;var E2=L71;E2+=v$5;$(dom$1[E2])[X08]({top:-(dom$1[w$T][S5] + m8a)},A8s,function(){$([dom$1[C4d],dom$1[A6S]])[H6M](v5H,function(){$(this)[e$B]();callback();});});displayed$2=R3P;}}function init$1(){var X8a="ci";var y08="rap";var Q8z="pe_Container";var t7C="div.DTED_Envelo";var u$=Q1J;u$+=Y$F;u$+=X8a;u$+=N32;var T9=S6a;T9+=y08;T9+=k3V;T9+=s79;var I4=t7C;I4+=Q8z;dom$1[w$T]=$(I4,dom$1[T9])[k70];cssBackgroundOpacity=$(dom$1[A6S])[o8Q](u$);}function show$2(dte,callback){var F7e='0';var r4D="pacit";var I0U="ED_Envelo";var B_u='click.DTED_Envelope';var k2K="tit";var b8v="click";var b_d="dth";var r9V="D_Env";var v_v='resize.DTED_Envelope';var I5D="opacity";var m4y="ight";var A1X="ED_E";var f_Z='div.DTED_Lightbox_Content_Wrapper';var X25="gr";var x6k="elope";var Q23="backgro";var P0V="yle";var b9t="tyle";var d1y="nvelope";var z6h="anima";var K7R="offsetH";var S1y='px';var q7g="click.DT";var E2_="ck.DT";var M8E=".DTE";var U1L="marginLeft";var R74="ck.DTED_Envelo";var h7h="onten";var t4=Q1J;t4+=y$F;var r2=A0g;r2+=r$r8n[214853];var u5=b8v;u5+=M8E;u5+=r9V;u5+=x6k;var i9=t2l;i9+=V44;var w$=d40;w$+=R74;w$+=k3V;L7h.q_G();var m8=Q1J;m8+=y$F;var G1=d40;G1+=E2_;G1+=A1X;G1+=d1y;var K4=Q23;K4+=i_u;var B5=q7g;B5+=I0U;B5+=k3V;var F7=Q1J;F7+=r$r8n[214853];F7+=r$r8n[214853];var h3=r$r8n.W1t;h3+=p4w;h3+=c0H;var Q6=r$r8n.b9I;Q6+=r$r8n.G6G;Q6+=r$r8n.D$v;Q6+=y$F;var e0=k2K;e0+=g4R;e0+=W$t;var T0=O9W;T0+=s79;var m9=x5p;m9+=m4y;var k1=r7N;k1+=Y7q;k1+=W2w;k1+=A8W;var F4=r$r8n.W1t;F4+=k24;F4+=b0H;F4+=Y7q;var A6=B1w;A6+=e9K;var A4=Z93;A4+=N$P;A4+=y$F;A4+=r$r8n[625824];var s8=w9I;s8+=O6v;s8+=X27;var g9=J0d;g9+=Q1J;g9+=r$r8n[625824];g9+=W2w;if(!callback){callback=function(){};}$(g9)[s8](dom$1[A4])[W2m](dom$1[A6]);dom$1[F4][k1][m9]=m9N;if(!displayed$2){var R1=r$r8n.W1t;R1+=h7h;R1+=Y7q;var d1=r$r8n[214853];d1+=r$r8n[134240];d1+=R6N;var u1=S6a;u1+=w1r;u1+=W$t;u1+=s79;var Z_=z6h;Z_+=F4_;var K5=r$r8n[625824];K5+=L2N;var b_=Q1J;b_+=r4D;b_+=W2w;var O_=H0R;O_+=X25;O_+=Q1J;O_+=i_u;var e3=O6v;e3+=u8s;var m3=Y7q;m3+=Q1J;m3+=O6v;var m4=K7R;m4+=W$t;m4+=m4y;var a8=Y7q;a8+=Q1J;a8+=O6v;var s5=Q1J;s5+=H5e;s5+=r7N;s5+=f_N;var R9=Y7q;R9+=Q1J;R9+=O6v;var o3=t2l;o3+=k3V;o3+=s79;var q3=O6v;q3+=u8s;var X7=g2J;X7+=P0V;var P1=O6v;P1+=u8s;var y6=S6a;y6+=r$r8n.b9I;y6+=b_d;var z0=r7N;z0+=N32;z0+=g4R;z0+=W$t;var B4=y$F;B4+=W_z;var q0=e1p;q0+=e6a;var D6=n8d;D6+=w$G;var C_=r7N;C_+=b9t;var V9=S6a;V9+=Y0L;V9+=k_0;var style=dom$1[V9][C_];style[I5D]=F7e;style[p14]=e7p;var height=heightCalc$1(dte);var targetRow=findAttachRow(dte,envelope[A4Z][D6]);var width=targetRow[N$U];style[q0]=B4;style[I5D]=i_o;dom$1[C4d][z0][y6]=width + P1;dom$1[C4d][X7][U1L]=-(width / k2S) + q3;dom$1[o3][d1o][R9]=$(targetRow)[s5]()[a8] + targetRow[m4] + S1y;dom$1[w$T][d1o][m3]=-X$4 * height - a11 + e3;dom$1[O_][d1o][b_]=F7e;dom$1[A6S][d1o][K5]=e7p;$(dom$1[A6S])[Z_]({opacity:cssBackgroundOpacity},v5H);$(dom$1[u1])[d1]();$(dom$1[R1])[X08]({top:k70},A8s,callback);}$(dom$1[g0d])[T0](e0,dte[Q6][h3])[F7](B_u)[Q5i](B5,function(e){L7h.g_4();dte[g0d]();});$(dom$1[K4])[x$J](G1)[m8](w$,function(e){L7h.q_G();dte[A6S]();});$(f_Z,dom$1[i9])[x$J](B_u)[Q5i](u5,function(e){var j5J="oun";var L9u="bac";var E4C="rg";var C_E='DTED_Envelope_Content_Wrapper';var B4d="kgr";var u8k="hasCl";var s_=u8k;s_+=p26;var d0=N96;d0+=E4C;d0+=W$t;d0+=Y7q;if($(e[d0])[s_](C_E)){var L$=L9u;L$+=B4d;L$+=j5J;L$+=r$r8n[625824];dte[L$]();}});$(window)[r2](v_v)[t4](v_v,function(){heightCalc$1(dte);});displayed$2=w6a;}var envelope={close:function(dte,callback){hide$2(dte,callback);},conf:{attach:u5O,windowPadding:m8a},destroy:function(dte){hide$2();},init:function(dte){init$1();L7h.g_4();return envelope;},node:function(dte){L7h.q_G();return dom$1[C4d][k70];},open:function(dte,append,callback){var f4t="appendChild";var f8L="hildre";var z8=T7i;z8+=S3Y;var W0=K7Z;W0+=v$5;W0+=s1Z;var p_=r$r8n.W1t;p_+=Q1J;p_+=g5b;var J5=r$r8n.W1t;J5+=f8L;J5+=y$F;$(dom$1[w$T])[J5]()[e$B]();L7h.q_G();dom$1[p_][f4t](append);dom$1[W0][f4t](dom$1[z8]);show$2(dte,callback);}};function isMobile(){L7h.g_4();var H5h='undefined';var Q8e="tation";var N9w="orien";var y0S=576;var Y6=N9w;Y6+=Q8e;return typeof window[Y6] !== H5h && window[B2a] <= y0S?w6a:R3P;}var displayed$1=R3P;var ready=R3P;var scrollTop=k70;var dom={background:$(M$y),close:$(P5n),content:J1q,wrapper:$(t3d + C8 + f6 + K4b + U4J + e8 + U4J + U4J)};function heightCalc(){var K7w='div.DTE_Header';var p3j="div.D";var Q24="TE_F";var F8S="windo";var T3e='div.DTE_Body_Content';var E88="wPaddi";var o47="ooter";var B2n="- ";var q$w="_Body";var E85="_Con";var O2l="calc(100vh ";var R_=h5Y;R_+=B4E;R_+=W2O;var T2=p3j;T2+=Q24;T2+=o47;var headerFooter=$(K7w,dom[C4d])[a2$]() + $(T2,dom[C4d])[R_]();if(isMobile()){var F_=O6v;F_+=u8s;F_+=L9X;var f9=O2l;f9+=B2n;var F6=S6a;F6+=w1r;F6+=e9K;var k4=V2k;k4+=q$w;k4+=E85;k4+=c$6;$(k4,dom[F6])[o8Q](r4o,f9 + headerFooter + F_);}else {var M6=S6a;M6+=Y0L;M6+=k_0;var c8=F8S;c8+=E88;c8+=S2H;var M1=r$r8n.W1t;M1+=Q1J;M1+=y$F;M1+=r$r8n[214853];var W9=v0Z;W9+=B4E;W9+=v0Z;W9+=Y7q;var maxHeight=$(window)[W9]() - self[M1][c8] * k2S - headerFooter;$(T3e,dom[M6])[o8Q](r4o,maxHeight);}}function hide$1(dte,callback){var D04="ani";var E$W='resize.DTED_Lightbox';var I8y="ound";var h82="Ani";var T2o="nf";var n69="offs";var c4=Z93;c4+=I8y;var v3=e1b;v3+=D04;v3+=m56;v3+=W$t;var L9=n69;L9+=f_N;L9+=h82;var D$=K7Z;D$+=T2o;var Y1=S6a;Y1+=P0y;Y1+=s79;if(!callback){callback=function(){};}$(l8s)[w73](scrollTop);dte[R_R](dom[Y1],{opacity:k70,top:self[D$][L9]},function(){var R0E="eta";var Y_=r$r8n[625824];Y_+=R0E;Y_+=r$r8n.W1t;Y_+=v0Z;L7h.g_4();$(this)[Y_]();callback();});dte[v3](dom[c4],{opacity:k70},function(){$(this)[e$B]();});displayed$1=R3P;$(window)[x$J](E$W);}function init(){var O63="ED_Light";var I2y="box_Con";var j6B="opacit";var t_Q='opacity';var m0U="gro";L7h.q_G();var H8=r$r8n.W1t;H8+=r7N;H8+=r7N;var H7=H0R;H7+=m0U;H7+=i_u;var c$=j6B;c$+=W2w;var x_=r$r8n.W1t;x_+=r7N;x_+=r7N;var z4=B1w;z4+=W$t;z4+=s79;var M5=s8I;M5+=O63;M5+=I2y;M5+=c$6;if(ready){return;}dom[w$T]=$(M5,dom[C4d]);dom[z4][x_](c$,k70);dom[H7][H8](t_Q,k70);ready=w6a;}function show$1(dte,callback){var Q3b="ollT";var t9Z="click.DTED_L";var A7i="ck.DTED_Lightbox";var d3F="scr";var s11='click.DTED_Lightbox';var u8z="ightbox";var k5s="Lightbox_Mob";var c1Y="Lightbox";var C2A="ize.DTED_Lightbox";var W9B="res";var N2x="_anima";var h2D="div.DTED_Lightbox_";var W0y="anim";var q1B="apper";var y_o="gh";var j7d="click.DTED_";var Q3v="ackground";var b5g="fs";var u6i="hei";var D9W="Content_Wr";var X6B="etAni";var p0t="DTED_";var e9=j7d;e9+=c1Y;var D_=Q1J;D_+=y$F;var l$=d40;l$+=A7i;var g1=Q1J;g1+=r$r8n[214853];g1+=r$r8n[214853];var G9=h2D;G9+=D9W;G9+=q1B;var B7=t9Z;B7+=u8z;var i1=Q1J;i1+=y$F;var N2=j7d;N2+=c1Y;var b2=Q1J;b2+=r$r8n[214853];b2+=r$r8n[214853];var Z0=r$r8n.W1t;Z0+=p4w;Z0+=c0H;var N7=r$r8n[134240];L7h.q_G();N7+=P4Y;N7+=s79;var v7=r$r8n.W1t;v7+=g4R;v7+=y8e;v7+=W$t;var b7=J0d;b7+=Q3v;if(isMobile()){var I2=p0t;I2+=k5s;I2+=T2d;I2+=W$t;var i0=J0d;i0+=Q1J;i0+=c1W;$(i0)[R0K](I2);}$(l8s)[W2m](dom[b7])[W2m](dom[C4d]);heightCalc();if(!displayed$1){var a6=d3F;a6+=Q3b;a6+=f3S;var N9=W9B;N9+=C2A;var Z2=Q1J;Z2+=y$F;var k8=e1b;k8+=W0y;k8+=r$r8n[134240];k8+=F4_;var Y0=N2x;Y0+=F4_;var h8=A0g;h8+=b5g;h8+=X6B;var o6=K7Z;o6+=y$F;o6+=r$r8n[214853];var h5=r$r8n.W1t;h5+=r7N;h5+=r7N;var B_=r$r8n[134240];B_+=u$n;B_+=o38;var X$=u6i;X$+=y_o;X$+=Y7q;var C$=r$r8n.W1t;C$+=r7N;C$+=r7N;displayed$1=w6a;dom[w$T][C$](X$,B_);dom[C4d][h5]({top:-self[o6][h8]});dte[Y0](dom[C4d],{opacity:X$4,top:k70},callback);dte[k8](dom[A6S],{opacity:X$4});$(window)[Z2](N9,function(){heightCalc();});scrollTop=$(l8s)[a6]();}dom[v7][N7](b7N,dte[C6W][Z0])[b2](N2)[Q5i](s11,function(e){dte[g0d]();});dom[A6S][x$J](s11)[i1](B7,function(e){var D4a="stopImmediatePropaga";var I6=D4a;I6+=c0w;e[I6]();dte[A6S]();});$(G9,dom[C4d])[g1](l$)[D_](e9,function(e){var q6e="stopImmedi";var Q$r="DTED_Lightbox";var J70="backg";var r2p="Wrapper";L7h.q_G();var g$F="atePropagat";var s8O="_Content_";var b3=Q$r;b3+=s8O;b3+=r2p;if($(e[D7M])[V89](b3)){var A2=J70;A2+=W7M;A2+=i_u;var Q9=q6e;Q9+=g$F;Q9+=r$r8n[211051];e[Q9]();dte[A2]();}});}var self={close:function(dte,callback){L7h.q_G();hide$1(dte,callback);},conf:{offsetAni:q0f,windowPadding:q0f},destroy:function(dte){if(displayed$1){hide$1(dte);}},init:function(dte){L7h.q_G();init();return self;},node:function(dte){var O5=S6a;O5+=Y0L;O5+=X_G;O5+=s79;return dom[O5][k70];},open:function(dte,append,callback){var k9I="appen";var o8=w6n;o8+=c0H;var o4=k9I;o4+=r$r8n[625824];var content=dom[w$T];content[z8X]()[e$B]();content[W2m](append)[o4](dom[o8]);show$1(dte,callback);}};var DataTable$5=$[r$r8n.n2M][r$r8n.G5j];function add(cfg,after,reorder){var W2D="playReorder";var Y6R="unshi";var K0s="ield alre";var S0u="ady exists with this name";var e4R="nArray";var U4$="_dis";var R26="\'. A ";var C5e='Error adding field. The field requires a `name` option';var O4W='Error adding field \'';var k0M="_d";var k2L="verse";var C7=A2o;C7+=r$r8n[625824];C7+=W$t;var l0=r$r8n[214853];l0+=z3b;var n$=t$h;n$+=h8g;var s7=k0M;s7+=r$r8n[134240];s7+=Y7q;s7+=d9S;var g7=r$r8n[214853];g7+=p0J;g7+=H6e;g7+=r7N;var W$=y$F;L7h.q_G();W$+=r$r8n[303735];W$+=W$t;if(reorder === void k70){reorder=w6a;}if(Array[R2m](cfg)){var q4=u9F;q4+=P8O;if(after !== undefined){var t0=s79;t0+=W$t;t0+=k2L;cfg[t0]();}for(var _i=k70,cfg_1=cfg;_i < cfg_1[q4];_i++){var cfgDp=cfg_1[_i];this[h6B](cfgDp,after,R3P);}this[b$O](this[W_U]());return this;}var name=cfg[W$];if(name === undefined){throw new Error(C5e);}if(this[r7N][g7][name]){var T_=R26;T_+=r$r8n[214853];T_+=K0s;T_+=S0u;throw new Error(O4W + name + T_);}this[s7](n$,cfg);var editorField=new Editor[h8g](cfg,this[b_M][l0],this);if(this[r7N][C7]){var j1=q4T;j1+=v0Z;var editFields=this[r7N][P9I];editorField[V0d]();$[j1](editFields,function(idSrc,editIn){var j1X="lF";var K3q="iS";var w3O="romDat";var D3=x3D;D3+=t$x;D3+=K3q;D3+=f_N;var q1=a4t;q1+=N96;var value;if(editIn[q1]){var u2=n5V;u2+=r$r8n[134240];var C1=Y$O;C1+=j1X;C1+=w3O;C1+=r$r8n[134240];value=editorField[C1](editIn[u2]);}editorField[D3](idSrc,value !== undefined?value:editorField[t7g]());});}this[r7N][K2U][name]=editorField;if(after === undefined){this[r7N][W_U][f12](name);}else if(after === J1q){var F2=Y6R;F2+=h2V;var J0=Q1J;J0+=s79;J0+=r$r8n[625824];J0+=e9K;this[r7N][J0][F2](name);}else {var E9=r$r8n.b9I;E9+=e4R;var idx=$[E9](after,this[r7N][W_U]);this[r7N][W_U][B6G](idx + X$4,k70,name);}if(reorder !== R3P){var f7=U4$;f7+=W2D;this[f7](this[W_U]());}return this;}function ajax(newAjax){var Q3=P6h;Q3+=u8s;if(newAjax){var n5=r$r8n[134240];n5+=l1W;n5+=u8s;this[r7N][n5]=newAjax;return this;}return this[r7N][Q3];}function background(){var L5O="onBackground";var A0=A4$;A0+=J0d;A0+=I7j;A0+=Y7q;var y3=T7i;L7h.g_4();y3+=Q1J;y3+=c0H;var M_=v7W;M_+=Y7q;M_+=r$r8n[211051];var onBackground=this[r7N][n_K][L5O];if(typeof onBackground === M_){onBackground(this);}else if(onBackground === v7C){var c7=J0d;c7+=W1j;c7+=s79;this[c7]();}else if(onBackground === y3){this[g0d]();}else if(onBackground === A0){this[B4h]();}return this;}function blur(){this[e6o]();return this;}function bubble(cells,fieldNames,showIn,opts){var A3U='boolean';var A4G="_ti";var e0L="rmOpt";var b6K="inOb";var t_=T1l;t_+=e0L;t_+=O5K;var p4=z97;p4+=r$r8n[625824];var O3=V4a;O3+=b6K;O3+=f6j;var H$=S25;H$+=U18;var d_=A4G;d_+=c1W;var _this=this;if(showIn === void k70){showIn=w6a;}var that=this;if(this[d_](function(){L7h.q_G();that[u4p](cells,fieldNames,opts);})){return this;}if($[H$](fieldNames)){opts=fieldNames;fieldNames=undefined;showIn=w6a;}else if(typeof fieldNames === A3U){showIn=fieldNames;fieldNames=undefined;opts=undefined;}if($[O3](showIn)){opts=showIn;showIn=w6a;}if(showIn === undefined){showIn=w6a;}opts=$[p4]({},this[r7N][t_][u4p],opts);var editFields=this[e7b](P60,cells,fieldNames);this[j32](cells,editFields,V0N,opts,function(){var R8R="bg";var U8$="iv class=\"";var a2C="ndTo";var I9K="l.";var s92="rmInfo";var U$2="nimate";var b2O='" title="';var I8z='"><div></div></div>';var L$e="bubbleNodes";var r9x="prepend";var o41="prep";var s2K="ppend";var b46="loseReg";var x6m='<div class="DTE_Processing_Indicator"><span></div>';var E7v=" scrol";var O7J="liner";var P41="_for";var I0v="Error";var S6S='resize.';var H6d="mOptions";var i_2="iv class=";var r9y="oint";var e1P="ubble";var u77="ildren";var Y0x="uttons";var P0s="v class=";var N8r="nca";var c0z="ly";var q$c=" class=\"";var h9g="\"></d";var x0=j$H;x0+=U$2;var B8=J0d;B8+=e1P;var G5=B0F;G5+=g6I;G5+=U9B;var j3=e1b;j3+=r$r8n.W1t;j3+=b46;var Z5=r$r8n[134240];Z5+=r$r8n[625824];Z5+=r$r8n[625824];var Q0=r$r8n[134240];Q0+=r$r8n[625824];Q0+=r$r8n[625824];var H6=J0d;H6+=Y0x;var h7=r$r8n[214853];h7+=M3v;h7+=q6d;var s9=K$i;s9+=B8R;var Z4=K_S;Z4+=q6d;Z4+=I0v;var L8=B7b;L8+=u77;var T6=W$t;T6+=z4t;var M7=n0p;M7+=u7e;M7+=S8g;M7+=H4V;L7h.q_G();var i_=O6v;i_+=r9y;i_+=W$t;i_+=s79;var D0=u7e;D0+=r$r8n[625824];D0+=i_2;D0+=k7g;var X8=u7e;X8+=S8g;X8+=r$r8n.b9I;X8+=L9i;var X0=h9g;X0+=r$r8n.b9I;X0+=L9i;var l9=r$r8n.W1t;l9+=p4w;l9+=r7N;l9+=W$t;var w7=T7i;w7+=Q1J;w7+=r7N;w7+=W$t;var q$=u7e;q$+=J$7;q$+=P0s;q$+=k7g;var s3=k7g;s3+=b1l;var Q7=p$f;Q7+=W$t;var g0=s_0;g0+=U8$;var t$=F8m;t$+=q$c;var f1=J0d;f1+=e1P;var E$=n8U;E$+=r7N;var k6=r$r8n[134240];k6+=P4Y;k6+=T30;var M0=r$r8n[134240];M0+=O6v;M0+=O6v;M0+=c0z;var v9=r$r8n.W1t;v9+=Q1J;v9+=N8r;v9+=Y7q;var G4=E7v;G4+=I9K;var w6=J0d;w6+=h2p;w6+=J0d;w6+=A8W;var X_=P41;X_+=H6d;var namespace=_this[X_](opts);var ret=_this[f6g](w6);if(!ret){return _this;}$(window)[Q5i](S6S + namespace + G4 + namespace,function(){_this[G75]();});var nodes=[];_this[r7N][L$e]=nodes[v9][M0](nodes,pluck(editFields,k6));var classes=_this[E$][f1];var backgroundNode=$(t$ + classes[R8R] + I8z);var container=$(o92 + classes[C4d] + w5g + g0 + classes[O7J] + w5g + o92 + classes[Q7] + s3 + q$ + classes[w7] + b2O + _this[C6W][l9] + X0 + x6m + X8 + U4J + D0 + classes[i_] + M7 + U4J);if(showIn){var R8=J0d;R8+=Q1J;R8+=c1W;var f$=s4Y;f$+=a2C;var N8=G$o;N8+=c1W;container[k2r](N8);backgroundNode[f$](R8);}var liner=container[z8X]()[T6](k70);var tableNode=liner[L8]();var closeNode=tableNode[z8X]();liner[W2m](_this[U1m][Z4]);tableNode[s9](_this[U1m][h7]);if(opts[S6H]){var O7=T1l;O7+=s92;liner[r9x](_this[U1m][O7]);}if(opts[x6Z]){var y5=v0Z;y5+=p$q;y5+=r$r8n[625824];y5+=e9K;var r8=o41;r8+=X27;liner[r8](_this[U1m][y5]);}if(opts[H6]){var S7=J0d;S7+=Y0x;var s4=r$r8n[625824];s4+=Q1J;s4+=q6d;var U_=r$r8n[134240];U_+=s2K;tableNode[U_](_this[s4][S7]);}var finish=function(){var d9=M4J;d9+=X_0;L7h.q_G();d9+=A8W;var a0=J4v;a0+=E9Q;a0+=W$t;a0+=v$5;_this[T93]();_this[a0](M3b,[d9]);};var pair=$()[Q0](container)[Z5](backgroundNode);_this[j3](function(submitComplete){L7h.g_4();_this[R_R](pair,{opacity:k70},function(){L7h.g_4();var A$L=' scroll.';var A1w="det";if(this === container[k70]){var b8=A1w;b8+=T30;pair[b8]();$(window)[x$J](S6S + namespace + A$L + namespace);finish();}});});backgroundNode[Q5i](t8w,function(){var W_=J0d;L7h.g_4();W_+=g4R;W_+=u$n;W_+=s79;_this[W_]();});closeNode[Q5i](t8w,function(){var w9R="_c";var w0=w9R;w0+=g4R;w0+=y8e;w0+=W$t;_this[w0]();});_this[G75]();_this[G5](B8,R3P);var opened=function(){var X14="deF";var Q$L="inclu";var p$u="_foc";var k5=n7c;k5+=r$r8n.b8Y;var z9=r$r8n[214853];z9+=u1w;z9+=D_f;var r7=Q$L;r7+=X14;r7+=r$r8n.b9I;r7+=T9Z;var a9=p$u;a9+=u$n;a9+=r7N;L7h.q_G();_this[a9](_this[r7N][r7],opts[z9]);_this[X41](k5,[V0N,_this[r7N][Z23]]);};_this[x0](pair,{opacity:X$4},function(){if(this === container[k70]){opened();}});});return this;}function bubbleLocation(location){var N8U="bubbleLoc";var u6t="bubblePos";var S8k="ation";var X1b="bubbleLocation";var N4=u6t;N4+=V7o;N4+=r$r8n.b9I;N4+=Q5i;var j$=N8U;j$+=S8k;if(!location){return this[r7N][X1b];}this[r7N][j$]=location;this[N4]();return this;}function bubblePosition(){var n8L="bubbleNo";var f5$="ef";var w0n="left";var R81="tto";L7h.g_4();var Z_r="bubbleB";var Y9E="bub";var e8V="top";var b8_='div.DTE_Bubble_Liner';var N7p="bleLocation";var y6h='below';var g6m="right";var S7m='top';var p7R="inn";var n4$="bottom";var j8R="Bubbl";var D8G='bottom';var h4Z="uto";var t6z="iv.DTE_";var H9=r$r8n[134240];H9+=h4Z;var R4=G$o;R4+=Y7q;R4+=Y7q;R4+=W$3;var w8=r$r8n[134240];w8+=h4Z;var e_=Y9E;e_+=N7p;var y0=g4R;y0+=f5$;y0+=Y7q;var f3=Y7q;f3+=Q1J;f3+=O6v;var K6=Y8h;K6+=v0Z;var S0=s79;S0+=r$r8n.b9I;S0+=c2$;S0+=W2O;var z$=p$q;z$+=r$r8n.W1t;z$+=v0Z;var z6=n8L;z6+=Z7B;z6+=r7N;var v1=r$r8n[625824];v1+=t6z;v1+=j8R;v1+=W$t;var wrapper=$(v1);var liner=$(b8_);var nodes=this[r7N][z6];var position={bottom:k70,left:k70,right:k70,top:k70};$[z$](nodes,function(i,nodeIn){var Y42="rig";var N$K="offsetHeight";var F9W="offset";var V3=Y7q;V3+=Q1J;V3+=O6v;var a1=g4R;a1+=W$t;a1+=h2V;var e$=Y42;e$+=W2O;var K0=g4R;K0+=W$t;K0+=r$r8n[214853];K0+=Y7q;var s2=Y7q;s2+=f3S;var x8=T_8;x8+=Y7q;var pos=$(nodeIn)[F9W]();nodeIn=$(nodeIn)[x8](k70);position[s2]+=pos[e8V];position[K0]+=pos[w0n];position[e$]+=pos[a1] + nodeIn[N$U];position[n4$]+=pos[V3] + nodeIn[N$K];});position[e8V]/=nodes[T1W];position[w0n]/=nodes[T1W];position[S0]/=nodes[T1W];position[n4$]/=nodes[K6];var top=position[f3];var left=(position[y0] + position[g6m]) / k2S;var width=liner[B2a]();var height=liner[a2$]();var visLeft=left - width / k2S;var visRight=visLeft + width;var docWidth=$(window)[K_K]();var viewportTop=$(window)[w73]();var padding=O1A;var location=this[r7N][e_];var initial=location !== w8?location:this[r7N][V4A]?D8G:S7m;wrapper[o8Q]({left:left,top:initial === D8G?position[n4$]:top})[I8X](y6h,initial === R4);var curPosition=wrapper[A2g]();if(location === H9){var k9=A8W;k9+=D$O;k9+=v0Z;var b1=p7R;b1+=W$t;b1+=V1r;b1+=Y7q;if(liner[T1W] && curPosition[e8V] + height > viewportTop + window[b1]){var O$=Z_r;O$+=Q1J;O$+=R81;O$+=q6d;var c2=Y7q;c2+=Q1J;c2+=O6v;wrapper[o8Q](c2,top)[a3l](y6h);this[r7N][O$]=R3P;}else if(liner[k9] && curPosition[e8V] - height < viewportTop){var l6=O9Y;l6+=Z8M;var o$=o38;o$+=O6v;var V5=r$r8n.W1t;V5+=r7N;V5+=r7N;wrapper[V5](o$,position[n4$])[R0K](l6);this[r7N][V4A]=w6a;}}if(visRight + padding > docWidth){var Z3=g4R;Z3+=p3D;var k0=r$r8n.W1t;k0+=r7N;k0+=r7N;var diff=visRight - docWidth;liner[k0](Z3,visLeft < padding?-(visLeft - padding):-(diff + padding));}else {var X3=g4R;X3+=W$t;X3+=r$r8n[214853];X3+=Y7q;liner[o8Q](X3,visLeft < padding?-(visLeft - padding):k70);}return this;}function buttons(buttonsIn){var d_y="_ba";var G$V="bm";var b78="buttonSubmit";var C2V="sic";var S3=p$q;S3+=r$r8n.W1t;S3+=v0Z;var r_=W$t;r_+=q6d;r_+=z1$;r_+=W2w;var D1=d_y;D1+=C2V;var _this=this;if(buttonsIn === D1){var V7=r$r8n[214853];V7+=Q1J;V7+=s79;V7+=q6d;var H2=r$r8n.W1t;H2+=g4R;H2+=E76;H2+=r7N;var M9=A4$;M9+=G$V;M9+=r$r8n.b9I;M9+=Y7q;var y1=I_s;y1+=r$r8n.b9I;y1+=Q5i;var n8=r$r8n.b9I;n8+=m_5;n8+=y$F;buttonsIn=[{action:function(){this[B4h]();},text:this[n8][this[r7N][y1]][M9],className:this[H2][V7][b78]}];}else if(!Array[R2m](buttonsIn)){buttonsIn=[buttonsIn];}$(this[U1m][r$L])[r_]();$[S3](buttonsIn,function(i,btn){var w29="unc";var Q7Z="wh";var H9V="tabIndex";var T9e="Index";var q85="nSubmi";var s_K='<button></button>';var d$P="keypr";var X0c="bindex";var H5=M4J;H5+=P4Y;H5+=Q1J;H5+=t91;var V2=z0T;V2+=q6d;var h9=r$r8n[134240];h9+=O6v;h9+=n9T;h9+=M_S;var y9=Q1J;y9+=y$F;var e6=d$P;e6+=R1v;var s$=Q1J;s$+=y$F;var l5=r$r8n[134240];l5+=Y7q;l5+=Y7q;l5+=s79;var T7=u80;T7+=T9e;var U9=N96;U9+=X0c;var X6=r$r8n[214853];X6+=w29;X6+=c0w;var G0=T1l;G0+=s79;G0+=q6d;var J4=r$r8n[134240];J4+=Y7q;J4+=Y7q;J4+=s79;var Z7=r$r8n[214853];Z7+=y$F;var O9=Y7q;O9+=l9k;if(typeof btn === k38){var x1=o5k;x1+=q85;x1+=Y7q;var B9=K_S;B9+=q6d;btn={action:function(){L7h.g_4();this[B4h]();},text:btn,className:_this[b_M][B9][x1]};}var text=btn[O9] || btn[h7b];var action=btn[Z23] || btn[Z7];var attr=btn[J4] || ({});$(s_K,{class:_this[b_M][G0][o89] + (btn[S5G]?Y$1 + btn[S5G]:Y5Y)})[V4c](typeof text === X6?text(_this):text || Y5Y)[J2w](U9,btn[T7] !== undefined?btn[H9V]:k70)[l5](attr)[s$](B7L,function(e){var g3=Q7Z;g3+=r$r8n.b9I;g3+=B7b;L7h.q_G();if(e[g3] === e3u && action){var J9=n2D;J9+=C13;action[J9](_this);}})[Q5i](e6,function(e){var T7q="ich";var n0J="preve";L7h.q_G();var s9X="Defa";var j_=Q7Z;j_+=T7q;if(e[j_] === e3u){var P2=n0J;P2+=v$5;P2+=s9X;P2+=l$5;e[P2]();}})[y9](t8w,function(e){e[Q_j]();L7h.g_4();if(action){var l_=r$r8n.W1t;l_+=r$r8n[134240];l_+=g4R;l_+=g4R;action[l_](_this,e);}})[h9](_this[V2][H5]);});return this;}function clear(fieldName){var r4Z="deField";var F9e="inc";var Y2Z="includeFields";var that=this;var sFields=this[r7N][K2U];if(typeof fieldName === k38){var c5=M3v;c5+=r$r8n[625824];c5+=e9K;var C5=S7T;C5+=W7M;C5+=W2w;var j5=i2k;j5+=W$t;j5+=H6e;that[j5](fieldName)[C5]();delete sFields[fieldName];var orderIdx=$[J75](fieldName,this[r7N][c5]);this[r7N][W_U][B6G](orderIdx,X$4);var includeIdx=$[J75](fieldName,this[r7N][Y2Z]);if(includeIdx !== -X$4){var Z6=F9e;Z6+=W1j;Z6+=r4Z;Z6+=r7N;this[r7N][Z6][B6G](includeIdx,X$4);}}else {var A_=W$t;A_+=T30;$[A_](this[E21](fieldName),function(i,name){that[t7m](name);});}return this;}function close(){this[f5_](R3P);return this;}function create(arg1,arg2,arg3,arg4){var m02="Reorder";var q3V="spla";var U89='initCreate';var Q9d="_tid";var R0=q4T;R0+=v0Z;var Y9=u32;Y9+=q3V;Y9+=W2w;Y9+=m02;var D7=J$7;D7+=f9L;D7+=r$r8n[134240];D7+=W2w;var a5=r$r8n[625824];a5+=Q1J;a5+=q6d;L7h.g_4();var J6=o9l;J6+=r$r8n.b9I;J6+=i2k;J6+=e9K;var C4=r$r8n.W1t;C4+=q3f;C4+=W$t;var E1=I_s;E1+=r$r8n.b9I;E1+=Q1J;E1+=y$F;var h$=q6d;h$+=E68;h$+=y$F;var P_=R3H;P_+=q6d;P_+=J0d;P_+=e9K;var F$=Q9d;F$+=W2w;var _this=this;var that=this;var sFields=this[r7N][K2U];var count=X$4;if(this[F$](function(){var t7=r$r8n.W1t;t7+=s79;t7+=W$t;t7+=N1c;that[t7](arg1,arg2,arg3,arg4);})){return this;}if(typeof arg1 === P_){count=arg1;arg1=arg2;arg2=arg3;}this[r7N][P9I]={};for(var i=k70;i < count;i++){var D2=b7s;D2+=r7N;this[r7N][P9I][i]={fields:this[r7N][D2]};}var argOpts=this[S7E](arg1,arg2,arg3,arg4);this[r7N][J92]=h$;this[r7N][E1]=C4;this[r7N][J6]=J1q;this[a5][N1H][d1o][D7]=e7p;this[C7K]();this[Y9](this[K2U]());$[R0](sFields,function(name,fieldIn){var j1A="ese";var b6=r7N;b6+=W$t;b6+=Y7q;var G$=s1H;G$+=i8H;G$+=j1A;G$+=Y7q;var n4=r$r8n[625824];n4+=W$t;n4+=r$r8n[214853];var def=fieldIn[n4]();fieldIn[G$]();for(var i=k70;i < count;i++){fieldIn[T5M](i,def);}fieldIn[b6](def);});this[X41](U89,J1q,function(){var n3g="eMain";var h0G="rmOption";var d8L="mbl";var Z$=Q1J;Z$+=z1$;Z$+=r7N;var N5=U5h;L7h.g_4();N5+=Q1J;N5+=h0G;N5+=r7N;var E4=e1b;E4+=E76;E4+=d8L;E4+=n3g;_this[E4]();_this[N5](argOpts[Z$]);argOpts[q0N]();});return this;}function undependent(parent){var h1M="endent";var P_a="undep";var E_=i2k;E_+=R_q;E_+=r$r8n[625824];var y2=r$r8n.b9I;y2+=N$c;y2+=s79;L7h.g_4();y2+=N9P;if(Array[y2](parent)){var p$=Y8h;p$+=v0Z;for(var i=k70,ien=parent[p$];i < ien;i++){var m2=P_a;m2+=h1M;this[m2](parent[i]);}return this;}$(this[E_](parent)[F_v]())[x$J](y4B);return this;}function dependent(parent,url,optsIn){var o$S="nde";var p7i="event";var w6O="epe";var R_3="jso";var K7=Q1J;K7+=y$F;var K1=o8$;K1+=Z7B;var W6=B7b;W6+=l$W;W6+=c2$;W6+=W$t;var Y7=L91;Y7+=Y7q;Y7+=b0H;Y7+=r$r8n[625824];var A9=R_3;A9+=y$F;var U5=r$r8n[214853];U5+=p0J;U5+=g4R;U5+=r$r8n[625824];var _this=this;if(Array[R2m](parent)){var n9=g4R;n9+=W$t;n9+=y$F;n9+=H7D;for(var i=k70,ien=parent[n9];i < ien;i++){var Y8=r$r8n[625824];Y8+=w6O;Y8+=o$S;Y8+=v$5;this[Y8](parent[i],url,optsIn);}return this;}var that=this;var parentField=this[U5](parent);var ajaxOpts={dataType:A9,type:e97};var opts=$[Y7]({},{data:J1q,event:W6,postUpdate:J1q,preUpdate:J1q},optsIn);var update=function(json){var f2W="pos";var o7L='show';var Y3P='hide';L7h.g_4();var I8m="preUpd";var w4z="Upd";var n$m="abel";var L4G="postUpdate";var m_L='val';var n3H='enable';var X8o="tUpdate";var F0=Z_S;F0+=T2n;var w2=p$q;w2+=r$r8n.W1t;w2+=v0Z;var K_=H5_;K_+=Y$P;var B2=g4R;B2+=n$m;var z3=W$t;z3+=q1g;z3+=M3v;var h0=W$t;h0+=r$r8n[134240];h0+=r$r8n.W1t;h0+=v0Z;var V1=I8m;V1+=N1c;if(opts[V1]){var A5=K$i;A5+=w4z;A5+=r$r8n[134240];A5+=F4_;opts[A5](json);}$[h0]({errors:z3,labels:B2,messages:K_,options:N5T,values:m_L},function(jsonProp,fieldFn){if(json[jsonProp]){$[j0E](json[jsonProp],function(fieldIn,valIn){var E7=F$a;E7+=g4R;E7+=r$r8n[625824];that[E7](fieldIn)[fieldFn](valIn);});}});$[w2]([Y3P,o7L,n3H,x$i],function(i,key){L7h.g_4();var d57="nim";if(json[key]){var g2=r$r8n[134240];g2+=d57;g2+=N1c;that[key](json[key],json[g2]);}});if(opts[L4G]){var a3=f2W;a3+=X8o;opts[a3](json);}parentField[F0](R3P);};$(parentField[K1]())[K7](opts[p7i] + y4B,function(e){var Y0P='data';var Q8F="values";var F4r="ssi";var m1=s79;m1+=Q1J;m1+=S6a;m1+=r7N;var Q1=Y4l;Q1+=F4r;Q1+=S2H;var k$=Y7q;k$+=E4x;k$+=T_8;k$+=Y7q;var l3=y$F;l3+=Q1J;l3+=r$r8n[625824];l3+=W$t;if($(parentField[l3]())[F5m](e[k$])[T1W] === k70){return;}parentField[Q1](w6a);var data={};data[c3F]=_this[r7N][P9I]?pluck(_this[r7N][P9I],Y0P):J1q;data[D$E]=data[m1]?data[c3F][k70]:J1q;L7h.q_G();data[Q8F]=_this[m23]();if(opts[q7Q]){var P9=r$r8n[625824];P9+=n8d;P9+=r$r8n[134240];var ret=opts[P9](data);if(ret){data=ret;}}if(typeof url === r8B){var S6C=r$r8n.W1t;S6C+=r$r8n[134240];S6C+=g4R;S6C+=g4R;var o=url[S6C](_this,parentField[m23](),data,update,e);if(o){if(typeof o === v31 && typeof o[L12] === r8B){o[L12](function(resolved){if(resolved){update(resolved);}});}else {update(o);}}}else {if($[B1b](url)){$[e$$](ajaxOpts,url);}else {ajaxOpts[P$O]=url;}$[I7i]($[e$$](ajaxOpts,{data:data,success:update}));}});return this;}function destroy(){var b7U='destroyEditor';var f0J="stro";var J8Q="lat";var W2r=".dt";var l3n="played";var j2$="roy";var M0L=W2r;M0L+=W$t;var z79=Q1J;z79+=H5e;var v_p=S7T;v_p+=j2$;var w1K=u5y;w1K+=O6v;w1K+=J8Q;w1K+=W$t;var g8z=V2G;g8z+=l3n;if(this[r7N][g8z]){this[g0d]();}this[t7m]();if(this[r7N][w1K]){var m7p=J0d;m7p+=M5v;m7p+=W2w;$(m7p)[W2m](this[r7N][L6K]);}var controller=this[r7N][E$9];if(controller[v_p]){var T7A=Z7B;T7A+=f0J;T7A+=W2w;controller[T7A](this);}$(document)[z79](M0L + this[r7N][d7t]);$(document)[i1P](b7U,[this]);this[U1m]=J1q;this[r7N]=J1q;}function disable(name){var c1n=p$q;c1n+=B7b;var that=this;$[c1n](this[E21](name),function(i,n){var c8_=V2G;c8_+=M2S;L7h.g_4();c8_+=A8W;that[b7s](n)[c8_]();});return this;}function display(showIn){var m0W=n7c;m0W+=y$F;if(showIn === undefined){return this[r7N][H6u];}L7h.g_4();return this[showIn?m0W:W1C]();}function displayed(){var r9H=F$a;r9H+=Y$0;L7h.q_G();return $[F98](this[r7N][r9H],function(fieldIn,name){return fieldIn[H6u]()?name:J1q;});}function displayNode(){var e_s=y$F;e_s+=M5v;L7h.g_4();e_s+=W$t;return this[r7N][E$9][e_s](this);}function edit(items,arg1,arg2,arg3,arg4){var p5P="_dat";var d1d=Q1J;d1d+=z1$;d1d+=r7N;var r2$=q6d;r2$+=z9L;var X80=r$r8n[214853];X80+=r$r8n.b9I;X80+=i7D;X80+=r7N;var K7N=p5P;K7N+=d9S;var F_T=J4v;F_T+=O53;var _this=this;var that=this;if(this[e7M](function(){var k4d=W$t;k4d+=r$r8n[625824];k4d+=r$r8n.b9I;k4d+=Y7q;that[k4d](items,arg1,arg2,arg3,arg4);})){return this;}var argOpts=this[S7E](arg1,arg2,arg3,arg4);this[F_T](items,this[K7N](X80,items),r2$,argOpts[d1d],function(){_this[F2j]();_this[C0E](argOpts[P3I]);argOpts[q0N]();});return this;}function enable(name){var V15=j9i;V15+=r$r8n[303735];V15+=C6b;var that=this;$[j0E](this[V15](name),function(i,n){var D_R="enable";that[b7s](n)[D_R]();});return this;}function error$1(name,msg){var k8E="mError";var r6z=r$r8n[625824];r6z+=Q1J;r6z+=q6d;var wrapper=$(this[r6z][C4d]);L7h.q_G();if(msg === undefined){var r$Q=r$r8n[214853];r$Q+=Q1J;r$Q+=s79;r$Q+=k8E;var q2a=r$r8n[625824];q2a+=Q1J;q2a+=q6d;this[L1s](this[q2a][r$Q],name,w6a,function(){var x7w='inFormError';wrapper[I8X](x7w,name !== undefined && name !== Y5Y);});if(name && !$(this[U1m][r9k])[b6J](v50)){alert(name[C$6](/<br>/g,z_Z));}this[r7N][z3U]=name;}else {var m62=N41;m62+=s79;var h5R=r$r8n[214853];h5R+=r$r8n.b9I;h5R+=W$t;h5R+=H6e;this[h5R](name)[m62](msg);}return this;}function field(name){L7h.q_G();var L8x="Unknown fi";var k4B="eld nam";var C9N="e - ";var sFields=this[r7N][K2U];if(!sFields[name]){var m8Q=L8x;m8Q+=k4B;m8Q+=C9N;throw new Error(m8Q + name);}return sFields[name];}function fields(){var n3I=q6d;n3I+=r$r8n[134240];n3I+=O6v;return $[n3I](this[r7N][K2U],function(fieldIn,name){return name;});}function file(name,id){var D5A='Unknown file id ';var f5R=' in table ';var tableFromFile=this[j_m](name);var fileFromTable=tableFromFile[id];if(!fileFromTable){throw new Error(D5A + id + f5R + name);}return tableFromFile[id];}function files(name){var p78="nknown";var C$m=" file t";var Z3L="able name: ";var I31="U";var X2T=r$r8n[214853];X2T+=T2d;X2T+=C6b;if(!name){return Editor[j_m];}var editorTable=Editor[X2T][name];if(!editorTable){var Q58=I31;Q58+=p78;Q58+=C$m;Q58+=Z3L;throw new Error(Q58 + name);}return editorTable;}function get(name){var C4q=v6v;C4q+=r$r8n[134240];C4q+=W2w;var that=this;if(!name){name=this[K2U]();}if(Array[C4q](name)){var out_1={};$[j0E](name,function(i,n){var J$I=T_8;J$I+=Y7q;out_1[n]=that[b7s](n)[J$I]();});return out_1;}return this[b7s](name)[s_D]();}function hide(names,animate){var j1N=p$q;j1N+=r$r8n.W1t;j1N+=v0Z;var that=this;$[j1N](this[E21](names),function(i,n){var B3o=F$a;B3o+=g4R;B3o+=r$r8n[625824];that[B3o](n)[I55](animate);});return this;}function ids(includeHash){var x$L=B0M;x$L+=Y7q;x$L+=Y_B;x$L+=l24;if(includeHash === void k70){includeHash=R3P;}return $[F98](this[r7N][x$L],function(editIn,idSrc){L7h.q_G();return includeHash === w6a?N0j + idSrc:idSrc;});}function inError(inNames){var W$H=A8W;W$H+=y$F;W$H+=H7D;var E8R=j9i;E8R+=A9T;E8R+=r7N;if(this[r7N][z3U]){return w6a;}var names=this[E8R](inNames);for(var i=k70,ien=names[W$H];i < ien;i++){var W6B=F$a;W6B+=g4R;W6B+=r$r8n[625824];if(this[W6B](names[i])[i2J]()){return w6a;}}return R3P;}function inline(cell,fieldName,opts){var P$L="t a time";var W_x="tio";var P4U="Cannot edit more than one row inline a";var M0e="taSo";L7h.q_G();var a10="E_Fie";var R2M="ual";var t5J="individ";var U8k=f6B;U8k+=X5E;U8k+=U4H;var U_y=e1b;U_y+=p5T;U_y+=r$r8n.b9I;U_y+=Y7q;var y3_=h4M;y3_+=r$r8n.b9I;y3_+=r$r8n[625824];y3_+=W2w;var c22=s8I;c22+=a10;c22+=H6e;var M6S=Y8h;M6S+=v0Z;var z5C=A8W;z5C+=F0a;var N1P=t5J;N1P+=R2M;var G9v=e1b;G9v+=a4t;G9v+=M0e;G9v+=T8F;var t1i=f6B;t1i+=r0Q;var H3G=Z94;H3G+=W_x;H3G+=t91;var J9r=l9k;J9r+=X27;var _this=this;var that=this;if($[B1b](fieldName)){opts=fieldName;fieldName=undefined;}opts=$[J9r]({},this[r7N][H3G][t1i],opts);var editFields=this[G9v](N1P,cell,fieldName);var keys=Object[P3J](editFields);if(keys[z5C] > X$4){var G4$=P4U;G4$+=P$L;throw new Error(G4$);}var editRow=editFields[keys[k70]];var hosts=[];for(var _i=k70,_a=editRow[Y9x];_i < _a[M6S];_i++){var d5$=Z3F;d5$+=P9U;var row=_a[_i];hosts[d5$](row);}if($(c22,hosts)[T1W]){return this;}if(this[y3_](function(){L7h.g_4();var t30=r$r8n.b9I;t30+=y$F;t30+=r0Q;that[t30](cell,fieldName,opts);})){return this;}this[U_y](cell,editFields,U8k,opts,function(){var c1v=u_S;c1v+=y$F;c1v+=Z3Q;c1v+=W$t;_this[c1v](editFields,opts);});return this;}function inlineCreate(insertPoint,opts){var b__="_inline";var V9J="Source";var k4_="pti";var O$2="initC";var f1v="ditFields";var W$b="modi";var e$q="ormO";var N7c="_actionCl";var k85="reate";var I7b=O$2;I7b+=k85;var Q_W=e1b;Q_W+=W$t;Q_W+=C$k;Q_W+=Y7q;var n1u=N7c;n1u+=a6p;n1u+=r7N;var g$T=E$v;g$T+=r$r8n.b9I;g$T+=y$F;g$T+=W$t;var i_g=r$r8n[214853];i_g+=e$q;i_g+=k4_;i_g+=j9y;var k9w=s5K;L7h.q_G();k9w+=S$D;k9w+=i8H;k9w+=Z8M;var j2s=e1b;j2s+=a4t;j2s+=N96;j2s+=V9J;var u7v=W$t;u7v+=f1v;var p1Q=W$b;p1Q+=r$r8n[214853];p1Q+=p0J;p1Q+=s79;var Y6h=l6q;Y6h+=c0w;var p30=o9l;p30+=W$t;var O2I=F$a;O2I+=g4R;O2I+=F3e;var d0X=h4M;d0X+=r$r8n.b9I;d0X+=r$r8n[625824];d0X+=W2w;var R1u=V4a;R1u+=f6B;R1u+=Q_e;var _this=this;if($[R1u](insertPoint)){opts=insertPoint;insertPoint=J1q;}if(this[d0X](function(){var n2W="eCrea";var Z6L=j_p;Z6L+=y$F;Z6L+=n2W;Z6L+=F4_;_this[Z6L](insertPoint,opts);})){return this;}$[j0E](this[r7N][O2I],function(name,fieldIn){var q0K=Y_E;q0K+=r$r8n.b9I;q0K+=e5B;q0K+=f_N;fieldIn[V0d]();fieldIn[q0K](k70,fieldIn[t7g]());fieldIn[F9y](fieldIn[t7g]());});this[r7N][p30]=W1Y;this[r7N][Y6h]=C$L;this[r7N][p1Q]=J1q;this[r7N][u7v]=this[j2s](k9w,insertPoint);opts=$[e$$]({},this[r7N][i_g][g$T],opts);this[n1u]();this[b__](this[r7N][P9I],opts,function(){var Z_C="fakeR";L7h.q_G();var Z6f="En";var O38=Z_C;O38+=Z8M;O38+=Z6f;O38+=r$r8n[625824];_this[e7b](O38);});this[Q_W](I7b,J1q);return this;}function message(name,msg){var B5p="formI";if(msg === undefined){var s3L=B5p;s3L+=y$F;s3L+=r$r8n[214853];s3L+=Q1J;this[L1s](this[U1m][s3L],name);}else {var O6e=q6d;O6e+=C6b;O6e+=i9h;O6e+=T_8;this[b7s](name)[O6e](msg);}return this;}function mode(modeIn){var P8j="cre";var U$0="t s";var j_h='Not currently in an editing mode';var c7i="upported";var Z$B=" is no";var J5C="Changing from create mode";L7h.q_G();var f2O=P8j;f2O+=N1c;var m8F=G86;m8F+=Y7q;m8F+=W$t;var j8y=r$r8n[134240];j8y+=r$r8n.W1t;j8y+=c0w;if(!modeIn){var W9e=l6q;W9e+=Y7q;W9e+=r$r8n.b9I;W9e+=Q5i;return this[r7N][W9e];}if(!this[r7N][Z23]){throw new Error(j_h);}else if(this[r7N][j8y] === m8F && modeIn !== f2O){var Z1h=J5C;Z1h+=Z$B;Z1h+=U$0;Z1h+=c7i;throw new Error(Z1h);}this[r7N][Z23]=modeIn;return this;}function modifier(){var u7a="if";var v8a=o9l;v8a+=u7a;v8a+=r$r8n.b9I;v8a+=e9K;return this[r7N][v8a];}function multiGet(fieldNames){var B0i="iGe";var D1O=K2q;D1O+=Y7q;D1O+=B0i;D1O+=Y7q;var M5J=r$r8n.b9I;M5J+=Z6A;var that=this;if(fieldNames === undefined){fieldNames=this[K2U]();}if(Array[M5J](fieldNames)){var H04=W$t;H04+=r$r8n[134240];H04+=r$r8n.W1t;H04+=v0Z;var out_2={};$[H04](fieldNames,function(i,name){var O3l=r$r8n[214853];O3l+=r$r8n.b9I;L7h.g_4();O3l+=R_q;O3l+=r$r8n[625824];out_2[name]=that[O3l](name)[C2b]();});return out_2;}return this[b7s](fieldNames)[D1O]();}function multiSet(fieldNames,valIn){var z8m=R9$;z8m+=Q_e;var that=this;if($[z8m](fieldNames) && valIn === undefined){var l4Y=q4T;l4Y+=v0Z;$[l4Y](fieldNames,function(name,value){L7h.g_4();that[b7s](name)[T5M](value);});}else {this[b7s](fieldNames)[T5M](valIn);}return this;}function node(name){var c5W=y$F;L7h.q_G();c5W+=Q1J;c5W+=Z7B;var F8k=p29;F8k+=O6v;var that=this;if(!name){var V9o=M3v;V9o+=k0N;name=this[V9o]();}return Array[R2m](name)?$[F8k](name,function(n){return that[b7s](n)[F_v]();}):this[b7s](name)[c5W]();}function off(name,fn){var r$R=Q1J;r$R+=r$r8n[214853];r$R+=r$r8n[214853];$(this)[r$R](this[U_a](name),fn);return this;}function on(name,fn){var C6t="eventN";var T01=e1b;T01+=C6t;T01+=A9T;L7h.g_4();var u$T=Q1J;u$T+=y$F;$(this)[u$T](this[T01](name),fn);return this;}function one(name,fn){var b47="_eventNa";var v7l=b47;L7h.g_4();v7l+=q6d;v7l+=W$t;$(this)[W_z](this[v7l](name),fn);return this;}function open(){var s6X="nest";var I6p="eop";var d0p="estedOpe";var b4W=q6d;b4W+=z9L;var x0r=e1b;x0r+=T4r;x0r+=s6R;x0r+=b0H;var A8Z=e1b;A8Z+=y$F;A8Z+=d0p;A8Z+=y$F;var H8Q=e1b;H8Q+=c7_;H8Q+=I6p;H8Q+=b0H;var _this=this;this[b$O]();this[G5u](function(){L7h.q_G();_this[r9O](function(){var p6z="amicInfo";var U8b="_clearDyn";var c$2=U8b;c$2+=p6z;_this[c$2]();_this[X41](M3b,[W1Y]);});});var ret=this[H8Q](W1Y);if(!ret){return this;}this[A8Z](function(){var E9u="ditOpts";var y4c="focu";var Q8s="_fo";var B7M="rd";var Q42=y4c;Q42+=r7N;var f_4=W$t;f_4+=E9u;var A6T=Q1J;A6T+=B7M;A6T+=W$t;A6T+=s79;var v_7=q6d;L7h.q_G();v_7+=r$r8n[134240];v_7+=O6v;var t7P=Q8s;t7P+=l86;t7P+=r7N;_this[t7P]($[v_7](_this[r7N][A6T],function(name){L7h.q_G();var d1S=i2k;d1S+=R_q;d1S+=r$r8n[625824];d1S+=r7N;return _this[r7N][d1S][name];}),_this[r7N][f_4][Q42]);_this[X41](l16,[W1Y,_this[r7N][Z23]]);},this[r7N][n_K][s6X]);L7h.g_4();this[x0r](b4W,R3P);return this;}function order(setIn){var c_E="sort";var u9_="ided for ordering.";var Y1Q="join";var S4t=" no additional fields, must be prov";var k$o="splayReorder";var C3O="All fields, and";var D1w=u32;D1w+=k$o;var n6J=r7N;n6J+=Q1J;n6J+=B1Z;var d$u=g4R;d$u+=v5e;if(!setIn){return this[r7N][W_U];}if(arguments[d$u] && !Array[R2m](setIn)){var C2S=r$r8n.W1t;C2S+=C3Q;C2S+=g4R;var j4k=H8T;j4k+=Y7q;j4k+=N4y;j4k+=W$t;setIn=Array[j4k][n75][C2S](arguments);}if(this[r7N][W_U][n75]()[n6J]()[Y1Q](x4x) !== setIn[n75]()[c_E]()[Y1Q](x4x)){var F6S=C3O;F6S+=S4t;F6S+=u9_;throw new Error(F6S);}$[e$$](this[r7N][W_U],setIn);this[D1w]();return this;}function remove(items,arg1,arg2,arg3,arg4){var m3S='initRemove';var q__="emov";var q5R=r$r8n[625824];q5R+=r$r8n[134240];q5R+=Y7q;q5R+=r$r8n[134240];var w5J=y$F;w5J+=Q1J;w5J+=Z7B;var V3f=y$F;V3f+=Q1J;V3f+=y$F;V3f+=W$t;var z5G=r$r8n[625824];z5G+=L2N;var a9Z=r$r8n[214853];a9Z+=Q1J;a9Z+=s79;a9Z+=q6d;var g6x=Z$4;g6x+=Y_B;g6x+=l24;var m4Z=A2o;m4Z+=f0E;var P$y=s79;P$y+=q__;P$y+=W$t;var S7$=l6q;S7$+=I6H;S7$+=Q5i;var G3i=A8W;G3i+=S2H;G3i+=P8O;var L9z=Y7q;L9z+=r$r8n[134240];L9z+=J0d;L9z+=A8W;var p4O=e1b;p4O+=I6H;p4O+=c1W;var _this=this;var that=this;if(this[p4O](function(){that[L3A](items,arg1,arg2,arg3,arg4);})){return this;}if(!items && !this[r7N][L9z]){items=i1l;}if(items[G3i] === undefined){items=[items];}var argOpts=this[S7E](arg1,arg2,arg3,arg4);var editFields=this[e7b](e5t,items);this[r7N][S7$]=P$y;this[r7N][m4Z]=items;this[r7N][g6x]=editFields;this[U1m][a9Z][d1o][z5G]=V3f;this[C7K]();this[X41](m3S,[pluck(editFields,w5J),pluck(editFields,q5R),items],function(){var N7E="initMultiRemo";L7h.q_G();var m66=N7E;m66+=v1D;_this[X41](m66,[editFields,items],function(){var t5R="eOpen";var n0b="mayb";var z$s=n0b;z$s+=t5R;_this[F2j]();_this[C0E](argOpts[P3I]);argOpts[z$s]();var opts=_this[r7N][n_K];L7h.g_4();if(opts[U8s] !== J1q){setTimeout(function(){var U_G=r$r8n[625824];U_G+=Q1J;U_G+=q6d;if(_this[U_G]){var I0h=r$r8n[214853];I0h+=u1w;I0h+=u$n;I0h+=r7N;var D4Q=r$r8n[214853];D4Q+=Q1J;D4Q+=l86;D4Q+=r7N;var v2P=W$t;v2P+=z4t;var Q7s=r$r8n[625824];Q7s+=Q1J;Q7s+=q6d;$(v_n,_this[Q7s][r$L])[v2P](opts[D4Q])[I0h]();}},F_X);}});});return this;}function set(setIn,valIn){var p3V=W$t;p3V+=T30;var j4K=V4a;j4K+=r$r8n.b9I;j4K+=O3u;j4K+=f6j;var that=this;if(!$[j4K](setIn)){var o={};o[setIn]=valIn;setIn=o;}$[p3V](setIn,function(n,v){var m0c=r7N;m0c+=W$t;m0c+=Y7q;var q0p=i2k;q0p+=W$t;q0p+=g4R;q0p+=r$r8n[625824];that[q0p](n)[m0c](v);});L7h.g_4();return this;}function show(names,animate){var W4G="eldNames";var Q9x=U5h;Q9x+=r$r8n.b9I;Q9x+=W4G;var that=this;$[j0E](this[Q9x](names),function(i,n){that[b7s](n)[m4w](animate);});return this;}function submit(successCallback,errorCallback,formatdata,hideIn){var p00="est";var W4S="E_Fi";var i4i="_proces";var l1a="div.";var n0q=q4T;n0q+=v0Z;var G7p=q4T;G7p+=v0Z;var O83=A8W;O83+=F0a;var s9B=l1a;s9B+=X_u;s9B+=W4S;s9B+=i7D;L7h.g_4();var H3E=M5Y;H3E+=p00;var t9J=r$r8n[134240];t9J+=r$r8n[166666];t9J+=R$a;t9J+=k3$;var u44=i4i;u44+=Z9w;var r0o=r$r8n[134240];r0o+=r$r8n.W1t;r0o+=I6H;r0o+=Q5i;var _this=this;var fields=this[r7N][K2U];var errorFields=[];var errorReady=k70;var sent=R3P;if(this[r7N][F$W] || !this[r7N][r0o]){return this;}this[u44](w6a);var send=function(){var Z2f='initSubmit';L7h.g_4();if(errorFields[T1W] !== errorReady || sent){return;}_this[X41](Z2f,[_this[r7N][Z23]],function(result){var i_S="roc";var W_7=r40;W_7+=h2p;W_7+=I7j;W_7+=Y7q;L7h.q_G();if(result === R3P){var H_8=e1b;H_8+=O6v;H_8+=i_S;H_8+=T2n;_this[H_8](R3P);return;}sent=w6a;_this[W_7](successCallback,errorCallback,formatdata,hideIn);});};var active=document[t9J];if($(active)[H3E](s9B)[O83] !== k70){var j01=J0d;j01+=g4R;j01+=u$n;j01+=s79;active[j01]();}this[f8w]();$[G7p](fields,function(name,fieldIn){if(fieldIn[i2J]()){errorFields[f12](name);}});$[n0q](errorFields,function(i,name){var n97=W$t;n97+=s79;n97+=w7V;fields[name][n97](Y5Y,function(){L7h.g_4();errorReady++;send();});});send();return this;}function table(setIn){var j2j=Y7q;j2j+=r$r8n[134240];j2j+=u6R;if(setIn === undefined){return this[r7N][Y5V];}this[r7N][j2j]=setIn;return this;}function template(setIn){if(setIn === undefined){return this[r7N][L6K];}this[r7N][L6K]=setIn === J1q?J1q:$(setIn);return this;}function title(titleIn){var K8B="dC";var e5j="></";var Z7Z="tl";var k3D="las";var a8O="class";var v5A="pi";var y0$=a4t;y0$+=N96;L7h.g_4();var U_r=W2O;U_r+=q6d;U_r+=g4R;var d_$=v0Z;d_$+=Y7q;d_$+=q6d;d_$+=g4R;var D3i=I0p;D3i+=K8B;D3i+=k3D;D3i+=r7N;var y6T=Y7q;y6T+=r$r8n[134240];y6T+=c2$;var j7z=N96;j7z+=c2$;var f30=I6H;f30+=Z7Z;f30+=W$t;var d4o=a8O;d4o+=C6b;var b7W=Z$N;b7W+=Y7q;b7W+=W$t;b7W+=v$5;var p2o=x5p;p2o+=r$r8n[134240];p2o+=r$r8n[625824];p2o+=e9K;var b_a=T7i;b_a+=a6p;b_a+=Q4v;var D9X=m1e;D9X+=z4E;var C8E=v0Z;C8E+=p$q;C8E+=k0N;var header=$(this[U1m][C8E])[z8X](D9X + this[b_a][p2o][b7W]);var titleClass=this[d4o][Y$T][f30];if(titleIn === undefined){return header[q7Q](b7N);}if(typeof titleIn === r8B){var O8r=N96;O8r+=u6R;var T6B=E5o;T6B+=v5A;titleIn=titleIn(this,new DataTable$5[T6B](this[r7N][O8r]));}var set=titleClass[u5l]?$(u7e + titleClass[j7z] + e5j + titleClass[y6T])[D3i](titleClass[a8O])[d_$](titleIn):titleIn;header[U_r](set)[y0$](b7N,titleIn);return this;}function val(fieldIn,value){var m4T="nObject";var z$W=c2$;z$W+=W$t;z$W+=Y7q;var g3K=a2t;g3K+=m4T;if(value !== undefined || $[g3K](fieldIn)){return this[F9y](fieldIn,value);}return this[z$W](fieldIn);}function error(msg,tn,thro){var h$R="warn";var o_e=' For more information, please refer to https://datatables.net/tn/';if(thro === void k70){thro=w6a;}var display=tn?msg + o_e + tn:msg;if(thro){throw display;}else {console[h$R](display);}}function pairs(data,props,fn){var V$j="be";var R_9="nObj";var y8X=r$r8n.b9I;y8X+=Z6A;var o$Q=Y$O;o$Q+=A3I;var E$G=g4R;E$G+=M2S;E$G+=W$t;E$G+=g4R;var e0k=l9k;e0k+=b0H;e0k+=r$r8n[625824];var i;var ien;var dataPoint;props=$[e0k]({label:E$G,value:o$Q},props);if(Array[y8X](data)){var b_K=A8W;b_K+=y$F;b_K+=H7D;for((i=k70,ien=data[b_K]);i < ien;i++){var b54=V4a;b54+=r$r8n.b9I;b54+=R_9;b54+=C5Y;dataPoint=data[i];if($[b54](dataPoint)){var T6Q=O9W;T6Q+=s79;var x5y=g4R;x5y+=M2S;x5y+=W$t;x5y+=g4R;var y0B=E9Q;y0B+=C3Q;y0B+=u$n;y0B+=W$t;var i8c=f2D;i8c+=V$j;i8c+=g4R;fn(dataPoint[props[Z3p]] === undefined?dataPoint[props[i8c]]:dataPoint[props[y0B]],dataPoint[props[x5y]],i,dataPoint[T6Q]);}else {fn(dataPoint,dataPoint,i);}}}else {var A5j=p$q;A5j+=B7b;i=k70;$[A5j](data,function(key,val){fn(val,key,i);i++;});}}function upload$1(editor,conf,files,progressCallback,completeCallback){var n16="ile";var A75="jax";var s5A="rre";L7h.g_4();var Y_u="readAsDataURL";var W4J="<i>Uploadin";var U_e="A server error occu";var c1G="adText";var I3e="errors";var O8d="g file</";var a4o="mitLeft";var D5R="d while uploading the f";var F3q="itL";var m2r="i>";var w47="_li";var K2t="rrors";var P3V="Re";var C89="rs";var V8J="splic";var p9o=w47;p9o+=a4o;var U0A=Q5i;U0A+=P7O;var k5J=W4J;k5J+=O8d;k5J+=m2r;var b69=r$r8n[214853];b69+=n16;b69+=P3V;b69+=c1G;var w_i=I8M;w_i+=q6d;w_i+=W$t;var v9x=e9K;v9x+=W7M;v9x+=s79;var Q6G=U_e;Q6G+=s5A;Q6G+=D5R;Q6G+=n16;var S21=W$t;S21+=K2t;var m92=e9K;m92+=W7M;m92+=C89;var reader=new FileReader();var counter=k70;var ids=[];var generalError=conf[I3e] && conf[m92][e1b]?conf[S21][e1b]:Q6G;editor[v9x](conf[w_i],Y5Y);if(typeof conf[I7i] === r8B){var J8J=r$r8n[134240];J8J+=A75;conf[J8J](files,function(idsIn){var Z15=r$r8n.W1t;Z15+=Q$f;completeCallback[Z15](editor,idsIn);});return;}progressCallback(conf,conf[b69] || k5J);reader[U0A]=function(e){var T9g="ec";var l8S="ajaxData";var j1l='Upload feature cannot use `ajax.data` with an object. Please use it as a function instead.';var u73='upload';var n9D='preUpload';var a7O=" Ajax option specified for upload plug-in";var D0w='uploadField';var I34="isPlainObj";var U93="ploa";var c_4=I34;c_4+=T9g;c_4+=Y7q;var O7k=n5V;O7k+=r$r8n[134240];var b1v=r7N;b1v+=p$G;b1v+=y$F;b1v+=c2$;var f7A=P6h;f7A+=u8s;var I$9=I34;I$9+=W$t;I$9+=r$r8n[166666];var j8Z=s4Y;j8Z+=y$F;j8Z+=r$r8n[625824];var C0d=u$n;C0d+=U93;C0d+=r$r8n[625824];var data=new FormData();var ajax;data[W2m](D6R,C0d);data[W2m](D0w,conf[N5t]);data[j8Z](u73,files[counter]);if(conf[l8S]){var X4G=P6h;X4G+=u8s;X4G+=c85;X4G+=N96;conf[X4G](data,files[counter],counter);}if(conf[I7i]){var u3H=p7o;u3H+=r$r8n[134240];u3H+=u8s;ajax=conf[u3H];}else if($[I$9](editor[r7N][I7i])){var K2_=u$n;K2_+=A8e;K2_+=Q1J;K2_+=I0p;var J$Z=P6h;J$Z+=u8s;var X5z=I3D;X5z+=g4R;X5z+=Q1J;X5z+=I0p;ajax=editor[r7N][I7i][X5z]?editor[r7N][J$Z][K2_]:editor[r7N][I7i];}else if(typeof editor[r7N][f7A] === k38){var J89=p7o;J89+=C7X;ajax=editor[r7N][J89];}if(!ajax){var c9Y=D0t;c9Y+=a7O;throw new Error(c9Y);}if(typeof ajax === b1v){ajax={url:ajax};}if(typeof ajax[O7k] === r8B){var z3Z=r$r8n[625824];z3Z+=n8d;z3Z+=r$r8n[134240];var d={};var ret=ajax[z3Z](d);if(ret !== undefined && typeof ret !== k38){d=ret;}$[j0E](d,function(key,value){L7h.q_G();data[W2m](key,value);});}else if($[c_4](ajax[q7Q])){throw new Error(j1l);}editor[X41](n9D,[conf[N5t],files[counter],data],function(preRet){var y7w="pload";var U5Y="_U";var w7H="preSubmit.DTE";var Y9z="AsDa";var G44="read";var N5A="aURL";var S78=O6v;S78+=Q1J;S78+=r7N;S78+=Y7q;var n42=W$t;n42+=u8s;n42+=F4_;n42+=h8C;var h0D=P6h;h0D+=u8s;var B_6=w7H;B_6+=U5Y;B_6+=y7w;if(preRet === R3P){if(counter < files[T1W] - X$4){var y0x=G44;y0x+=Y9z;y0x+=Y7q;y0x+=N5A;counter++;reader[y0x](files[counter]);}else {completeCallback[w7u](editor,ids);}return;}var submit=R3P;editor[Q5i](B_6,function(){submit=w6a;return R3P;});$[h0D]($[n42]({},ajax,{contentType:R3P,data:data,dataType:j_a,error:function(xhr){var c4s="preSubm";var U1F="loadXhrError";var A5l="statu";var r_o="tatus";var t4u="it.DTE_Uploa";var C5c=I8M;C5c+=U4g;L7h.q_G();var V65=I3D;V65+=U1F;var R8X=r7N;R8X+=r_o;var o5a=A5l;o5a+=r7N;var o9I=e9K;o9I+=w7V;var V6q=c4s;V6q+=t4u;V6q+=r$r8n[625824];var errors=conf[I3e];editor[x$J](V6q);editor[o9I](conf[N5t],errors && errors[xhr[o5a]]?errors[xhr[R8X]]:generalError);editor[X41](V65,[conf[C5c],xhr]);progressCallback(conf);},processData:R3P,success:function(json){var B2f="ieldErrors";var L_F="tus";var T$n='preSubmit.DTE_Upload';var F44="fil";var b$A="ldE";var c01='uploadXhrSuccess';var C9C=r$r8n.b9I;C9C+=r$r8n[625824];var f$y=I3D;f$y+=P7O;var k8G=u$n;k8G+=y7w;var e4d=A1B;e4d+=c2$;e4d+=Y7q;e4d+=v0Z;var Y1s=F$a;Y1s+=b$A;Y1s+=r6b;Y1s+=C89;var q9l=i2k;q9l+=i7D;L7h.q_G();q9l+=T3b;var f9Z=Q1J;f9Z+=H5e;editor[f9Z](T$n);editor[X41](c01,[conf[N5t],json]);if(json[q9l] && json[Y1s][e4d]){var r60=u9F;r60+=P8O;var H8N=r$r8n[214853];H8N+=B2f;var errors=json[H8N];for(var i=k70,ien=errors[r60];i < ien;i++){var v2t=H1k;v2t+=L_F;editor[f8w](errors[i][N5t],errors[i][v2t]);}completeCallback[w7u](editor,ids,w6a);}else if(json[f8w]){var e6r=e9K;e6r+=s79;e6r+=Q1J;e6r+=s79;var H6q=W$t;H6q+=r6b;H6q+=s79;editor[H6q](json[e6r]);completeCallback[w7u](editor,ids,w6a);}else if(!json[k8G] || !json[f$y][C9C]){var h$I=r$r8n.W1t;h$I+=r$r8n[134240];h$I+=g4R;h$I+=g4R;var R8d=y$F;R8d+=r$r8n[303735];R8d+=W$t;editor[f8w](conf[R8d],generalError);completeCallback[h$I](editor,ids,w6a);}else {var E6i=A1B;E6i+=c2$;E6i+=Y7q;E6i+=v0Z;var l_g=r$r8n.b9I;l_g+=r$r8n[625824];if(json[j_m]){var r8H=F44;r8H+=C6b;$[j0E](json[r8H],function(table,filesIn){var S1D="les";var b6y=r$r8n[214853];b6y+=r$r8n.b9I;b6y+=S1D;L7h.q_G();var r2G=r$r8n[214853];r2G+=r$r8n.b9I;r2G+=A8W;r2G+=r7N;if(!Editor[r2G][table]){Editor[j_m][table]={};}$[e$$](Editor[b6y][table],filesIn);});}ids[f12](json[x2B][l_g]);if(counter < files[E6i] - X$4){counter++;reader[Y_u](files[counter]);}else {completeCallback[w7u](editor,ids);if(submit){editor[B4h]();}}}progressCallback(conf);},type:S78,xhr:function(){var i7Q="ajaxSettin";var H8S="xhr";var e5P="upl";var t47="onprogress";var Z6u="onloadend";var s6h=i7Q;s6h+=p6g;var xhr=$[s6h][H8S]();if(xhr[x2B]){var N5N=e5P;N5N+=Q1J;N5N+=r$r8n[134240];N5N+=r$r8n[625824];xhr[N5N][t47]=function(e){var U1A="engthComput";var J4q="total";var K$T='%';var n4B="toFixed";var H33="loaded";var V8V=':';var V6F=g4R;V6F+=U1A;L7h.g_4();V6F+=U8C;if(e[V6F]){var X5v=A1B;X5v+=H7D;var percent=(e[H33] / e[J4q] * F_X)[n4B](k70) + K$T;progressCallback(conf,files[T1W] === X$4?percent:counter + V8V + files[X5v] + Y$1 + percent);}};xhr[x2B][Z6u]=function(){var Z66='Processing';L7h.g_4();var D$J="processingText";progressCallback(conf,conf[D$J] || Z66);};}L7h.q_G();return xhr;}}));});};files=$[F98](files,function(val){L7h.g_4();return val;});if(conf[p9o] !== undefined){var R6O=w47;R6O+=q6d;R6O+=F3q;R6O+=p3D;var f6k=V8J;f6k+=W$t;files[f6k](conf[R6O],files[T1W]);}reader[Y_u](files[k70]);}function factory(root,jq){var H5C="jquery";var y1Y="docume";var b1F=r$r8n[214853];L7h.g_4();b1F+=y$F;var e4b=y1Y;e4b+=v$5;var is=R3P;if(root && root[e4b]){var W8Z=z0T;W8Z+=r$r8n.W1t;W8Z+=u$n;W8Z+=Q5F;window=root;document=root[W8Z];}if(jq && jq[b1F] && jq[r$r8n.n2M][H5C]){$=jq;is=w6a;}return is;}var DataTable$4=$[r$r8n.n2M][r$r8n.G5j];var _inlineCounter=k70;function _actionClass(){var o4Y="mov";var S$h=W$t;S$h+=r$r8n[625824];S$h+=r$r8n.b9I;S$h+=Y7q;var h8_=r$r8n.W1t;h8_+=v60;h8_+=n8d;h8_+=W$t;var C_p=T0t;C_p+=Q1J;C_p+=f6B;var I99=W$t;L7h.q_G();I99+=r$r8n[625824];I99+=r$r8n.b9I;I99+=Y7q;var r$H=t_F;r$H+=R7G;var T$Z=S6a;T$Z+=s79;T$Z+=I_z;T$Z+=e9K;var L8q=r$r8n[134240];L8q+=r$r8n.W1t;L8q+=Y7q;L8q+=r$r8n[211051];var M9z=l6q;M9z+=I6H;M9z+=j9y;var classesActions=this[b_M][M9z];var action=this[r7N][L8q];var wrapper=$(this[U1m][T$Z]);wrapper[a3l]([classesActions[r$H],classesActions[I99],classesActions[L3A]][C_p](Y$1));if(action === h8_){wrapper[R0K](classesActions[u0A]);}else if(action === S$h){var E4O=f9l;E4O+=s6v;wrapper[E4O](classesActions[Z$4]);}else if(action === J3x){var m$l=v60;m$l+=o4Y;m$l+=W$t;wrapper[R0K](classesActions[m$l]);}}function _ajax(data,success,error,submitParams){var k1P=/_id_/;var I9c="omple";var l_y="Sr";var F0k="complete";var c8o="ring";L7h.q_G();var o7O='DELETE';var r2A=/{id}/;var W3P="com";var M_j="replacemen";var c2z="deleteBody";var O1c='?';var H2k="rep";var R4T="dex";var v7j="cements";var p0M="Of";var w_v="unshif";var Y1m="param";var l2l=r$r8n[134240];l2l+=T0t;l2l+=r$r8n[134240];l2l+=u8s;var j3g=H2k;j3g+=f2D;j3g+=j$W;var s18=v60;s18+=v2c;s18+=W$t;var M$g=u$n;M$g+=s79;M$g+=g4R;var V4d=M_j;V4d+=e6I;var v0q=g2J;v0q+=c8o;var o7c=a2t;o7c+=O3u;o7c+=f6j;var Q2T=T0t;Q2T+=Q1J;Q2T+=f6B;var Y57=r$r8n.b9I;Y57+=r$r8n[625824];Y57+=l_y;Y57+=r$r8n.W1t;var V30=p5T;V30+=V7o;var action=this[r7N][Z23];var thrown;var opts={complete:[function(xhr,text){var q6Y=204;var n0z="responseText";var W7u="responseJ";var O_$=400;var w4F="nse";var c3W="seJSON";var p3a="SON";var l$1="respo";var t6O=R3H;t6O+=C13;var A7v=H1k;A7v+=Y7q;A7v+=D_f;var json=J1q;if(xhr[A7v] === q6Y || xhr[n0z] === t6O){json={};}else {try{var P5_=l$1;P5_+=w4F;P5_+=S9c;var e2D=O6v;e2D+=r$r8n[134240];e2D+=s79;e2D+=c0H;var K6R=W7u;K6R+=p3a;var B3O=l$1;B3O+=y$F;B3O+=c3W;json=xhr[B3O]?xhr[K6R]:JSON[e2D](xhr[P5_]);}catch(e){}}if($[B1b](json) || Array[R2m](json)){success(json,xhr[C$w] >= O_$,xhr);}else {error(xhr,text,thrown);}}],data:J1q,dataType:j_a,error:[function(xhr,text,err){thrown=err;}],success:[],type:e97};var a;var ajaxSrc=this[r7N][I7i];var id=action === V30 || action === J3x?pluck(this[r7N][P9I],Y57)[Q2T](r4y):J1q;if($[o7c](ajaxSrc) && ajaxSrc[action]){ajaxSrc=ajaxSrc[action];}if(typeof ajaxSrc === r8B){var I3N=r$r8n.W1t;I3N+=r$r8n[134240];I3N+=C13;ajaxSrc[I3N](this,J1q,J1q,data,success,error);return;}else if(typeof ajaxSrc === v0q){var g$L=r$r8n.b9I;g$L+=y$F;g$L+=R4T;g$L+=p0M;if(ajaxSrc[g$L](Y$1) !== -X$4){var p8d=r7N;p8d+=A8e;p8d+=V7o;a=ajaxSrc[p8d](Y$1);opts[w4w]=a[k70];opts[P$O]=a[X$4];}else {opts[P$O]=ajaxSrc;}}else {var f29=L91;f29+=F4_;f29+=y$F;f29+=r$r8n[625824];var s2I=e9K;s2I+=s79;s2I+=Q1J;s2I+=s79;var X5t=r$r8n.W1t;X5t+=I9c;X5t+=F4_;var W9T=W$t;W9T+=u8s;W9T+=Y7q;W9T+=X27;var optsCopy=$[W9T]({},ajaxSrc || ({}));if(optsCopy[X5t]){var m8w=W3P;m8w+=R3w;m8w+=W$t;var i9Q=w_v;i9Q+=Y7q;opts[F0k][i9Q](optsCopy[m8w]);delete optsCopy[F0k];}if(optsCopy[s2I]){var C$x=W$t;C$x+=s79;C$x+=s79;C$x+=M3v;var j6K=W85;j6K+=r$r8n.b9I;j6K+=r$r8n[214853];j6K+=Y7q;var L0R=e9K;L0R+=s79;L0R+=M3v;opts[L0R][j6K](optsCopy[C$x]);delete optsCopy[f8w];}opts=$[f29]({},opts,optsCopy);}if(opts[V4d]){var d7O=v60;d7O+=O6v;d7O+=f2D;d7O+=v7j;var O1M=W$t;O1M+=r$r8n[134240];O1M+=r$r8n.W1t;O1M+=v0Z;$[O1M](opts[d7O],function(key,repl){var D1D='}';var J06='{';var c1J=v60;c1J+=O7l;var n0R=u$n;n0R+=s79;n0R+=g4R;var x0v=Q$$;x0v+=g4R;opts[x0v]=opts[n0R][c1J](J06 + key + D1D,repl[w7u](this,key,id,action,data));});}opts[P$O]=opts[M$g][s18](k1P,id)[j3g](r2A,id);if(opts[q7Q]){var P6X=L91;P6X+=F4_;P6X+=h8C;var d_H=r$r8n[625824];d_H+=r$r8n[134240];d_H+=Y7q;d_H+=r$r8n[134240];var isFn=typeof opts[q7Q] === r8B;var newData=isFn?opts[q7Q](data):opts[d_H];data=isFn && newData?newData:$[P6X](w6a,data,newData);}opts[q7Q]=data;if(opts[w4w] === o7O && (opts[c2z] === undefined || opts[c2z] === w6a)){var L0L=r$r8n[625824];L0L+=r$r8n[134240];L0L+=Y7q;L0L+=r$r8n[134240];var k9m=u$n;k9m+=s79;k9m+=g4R;var G6E=u$n;G6E+=s79;G6E+=g4R;var j8O=r$r8n[625824];j8O+=r$r8n[134240];j8O+=Y7q;j8O+=r$r8n[134240];var params=$[Y1m](opts[j8O]);opts[G6E]+=opts[k9m][N4I](O1c) === -X$4?O1c + params:h5d + params;delete opts[L0L];}$[l2l](opts);}function _animate(target,style,time,callback){var a45="im";var p9e=l$W;p9e+=a45;p9e+=N1c;L7h.g_4();var l2$=r$r8n[214853];l2$+=y$F;if($[l2$][p9e]){target[s6R]()[X08](style,time,callback);}else {var H$D=a3g;H$D+=r8e;H$D+=Q1J;H$D+=y$F;var q5W=g4R;q5W+=W$t;q5W+=F0a;var O0Q=r$r8n.W1t;O0Q+=r7N;O0Q+=r7N;target[O0Q](style);var scope=target[q5W] && target[T1W] > X$4?target[k70]:target;if(typeof time === H$D){time[w7u](scope);}else if(callback){callback[w7u](scope);}}}function _assembleMain(){var N4l="odyC";var a0b="formInfo";var q6V="oter";var v3d="wrappe";var w6S=r$r8n[134240];w6S+=S77;w6S+=r$r8n[625824];var X37=J0d;X37+=N4l;X37+=k24;X37+=s1Z;var g$4=M$E;g$4+=Q1J;g$4+=y$F;g$4+=r7N;var c2_=I_z;c2_+=W$t;c2_+=y$F;c2_+=r$r8n[625824];var b$I=T1l;b$I+=q6V;var f$U=K$i;f$U+=O6v;f$U+=b0H;f$U+=r$r8n[625824];L7h.g_4();var L57=v3d;L57+=s79;var t$c=r$r8n[625824];t$c+=Q1J;t$c+=q6d;var dom=this[t$c];$(dom[L57])[f$U](dom[Y$T]);$(dom[b$I])[c2_](dom[r9k])[W2m](dom[g$4]);$(dom[X37])[w6S](dom[a0b])[W2m](dom[N1H]);}function _blur(){var B8$="itOpt";var u0y="eBlur";var t4C=T7i;t4C+=Q1J;t4C+=r7N;t4C+=W$t;var p_8=A4$;p_8+=J0d;p_8+=q6d;p_8+=V7o;var C3k=c7_;C3k+=u0y;var L5z=J4v;L5z+=E9Q;L5z+=W$t;L5z+=v$5;var g7E=Q5i;g7E+=W9b;g7E+=g4R;g7E+=Q$$;var G0m=p5T;G0m+=B8$;G0m+=r7N;var opts=this[r7N][G0m];var onBlur=opts[g7E];if(this[L5z](C3k) === R3P){return;}if(typeof onBlur === r8B){onBlur(this);}else if(onBlur === p_8){this[B4h]();}else if(onBlur === t4C){var l6L=e1b;l6L+=w6n;l6L+=c0H;this[l6L]();}}function _clearDynamicInfo(errorsOnly){var c8V="setFocus";var p5U="removeCl";var I4W=W$t;I4W+=T30;var f_b=p5U;f_b+=p26;var d5M=r$r8n[625824];d5M+=w99;d5M+=z4E;var k3S=i2k;k3S+=R_q;k3S+=F3e;var v93=W$t;v93+=r6b;v93+=s79;var e5W=r$r8n[214853];e5W+=p0J;e5W+=H6e;if(errorsOnly === void k70){errorsOnly=R3P;}if(!this[r7N]){return;}L7h.g_4();var errorClass=this[b_M][e5W][v93];var fields=this[r7N][k3S];$(d5M + errorClass,this[U1m][C4d])[f_b](errorClass);$[I4W](fields,function(name,field){var G0T=N41;G0T+=s79;field[G0T](Y5Y);if(!errorsOnly){var m01=H5_;m01+=Y$P;field[m01](Y5Y);}});this[f8w](Y5Y);if(!errorsOnly){this[S6H](Y5Y);}this[r7N][c8V]=J1q;this[r7N][V4A]=R3P;}function _close(submitComplete,mode){L7h.q_G();var Y6y="displaye";var a40='focus.editor-focus';var p50="loseIcb";var s$8="seCb";var f3j='preClose';var Z0u=Y6y;Z0u+=r$r8n[625824];var K_w=J0d;K_w+=Q1J;K_w+=r$r8n[625824];K_w+=W2w;var V5x=r$r8n.W1t;V5x+=p50;var closed;if(this[X41](f3j) === R3P){return;}if(this[r7N][A8p]){var f1h=r$r8n.W1t;f1h+=p4w;f1h+=s$8;closed=this[r7N][f1h](submitComplete,mode);this[r7N][A8p]=J1q;}if(this[r7N][V5x]){var m4b=r$r8n.W1t;m4b+=p50;this[r7N][m4b]();this[r7N][w3h]=J1q;}$(K_w)[x$J](a40);this[r7N][Z0u]=R3P;this[X41](W1C);if(closed){var u7x=J4v;u7x+=C$k;u7x+=Y7q;this[u7x](M3b,[closed]);}}function _closeReg(fn){this[r7N][A8p]=fn;}function _crudArgs(arg1,arg2,arg3,arg4){var i5w="rmOptio";var t$M="olean";var C7z="main";var f4A=T1l;f4A+=i5w;f4A+=y$F;f4A+=r7N;var K6l=L91;K6l+=b_u;var k9$=J0d;k9$+=Q1J;k9$+=t$M;var u$c=S25;u$c+=U18;var that=this;var title;var buttons;var show;var opts;if($[u$c](arg1)){opts=arg1;}else if(typeof arg1 === k9$){show=arg1;opts=arg2;}else {title=arg1;buttons=arg2;show=arg3;opts=arg4;}if(show === undefined){show=w6a;}if(title){that[x6Z](title);}if(buttons){that[r$L](buttons);}return {maybeOpen:function(){if(show){that[U9B]();}},opts:$[K6l]({},this[r7N][f4A][C7z],opts)};}function _dataSource(name){var B2R="dataT";L7h.g_4();var B5Y="dataSources";var n1l=B2R;n1l+=U8C;var x3O=p$f;x3O+=W$t;var args=[];for(var _i=X$4;_i < arguments[T1W];_i++){args[_i - X$4]=arguments[_i];}var dataSource=this[r7N][x3O]?Editor[B5Y][n1l]:Editor[B5Y][V4c];var fn=dataSource[name];if(fn){var N7n=r$r8n[134240];N7n+=q8J;return fn[N7n](this,args);}}function _displayReorder(includeFields){var i08='displayOrder';var j6I="udeFields";L7h.g_4();var n5f="eFields";var Z9C="incl";var A3y="To";var G78="clud";var E08="templ";var H76="mai";var Z03="formCon";var M3Q=r$r8n[134240];M3Q+=r$r8n[166666];M3Q+=r$r8n.b9I;M3Q+=Q5i;var j2u=e1p;j2u+=g4R;j2u+=F6K;var B65=H76;B65+=y$F;var s5w=W$t;s5w+=r$r8n[134240];s5w+=r$r8n.W1t;s5w+=v0Z;var v$G=W7c;v$G+=H6e;v$G+=v60;v$G+=y$F;var P7Q=q6d;P7Q+=z9L;var C_k=E08;C_k+=n8d;C_k+=W$t;var H3O=Z03;H3O+=Y7q;H3O+=s1Z;var k8x=r$r8n[625824];k8x+=W$3;var _this=this;var formContent=$(this[k8x][H3O]);var fields=this[r7N][K2U];var order=this[r7N][W_U];var template=this[r7N][C_k];var mode=this[r7N][J92] || P7Q;if(includeFields){var e6w=Z9C;e6w+=j6I;this[r7N][e6w]=includeFields;}else {var d5y=f6B;d5y+=G78;d5y+=n5f;includeFields=this[r7N][d5y];}formContent[v$G]()[e$B]();$[s5w](order,function(i,name){var F19="[data-editor-templa";var a73="te=\"";var N98="editor-field[name=";if(_this[B1i](name,includeFields) !== -X$4){var a6z=q6d;a6z+=r$r8n[134240];a6z+=r$r8n.b9I;a6z+=y$F;if(template && mode === a6z){var Q8d=o8$;Q8d+=r$r8n[625824];Q8d+=W$t;var r2P=w9I;r2P+=B8R;var e87=F19;e87+=a73;var h8S=r$r8n[214853];h8S+=r$r8n.b9I;h8S+=y$F;h8S+=r$r8n[625824];var v6y=y5e;v6y+=W$t;var H2u=r$r8n[134240];H2u+=r$r8n[214853];H2u+=Y7q;H2u+=e9K;var p82=N98;p82+=k7g;template[F5m](p82 + name + q$Z)[H2u](fields[name][v6y]());template[h8S](e87 + name + q$Z)[r2P](fields[name][Q8d]());}else {var h34=r$r8n[134240];h34+=S77;h34+=r$r8n[625824];formContent[h34](fields[name][F_v]());}}});if(template && mode === B65){var r7f=I_z;r7f+=X27;r7f+=A3y;template[r7f](formContent);}this[X41](i08,[this[r7N][j2u],this[r7N][M3Q],formContent]);}function _edit(items,editFields,type,formOptions,setupDone){var y$v="orde";var O09="ditData";var a8J="tEdi";var m6J="_disp";var y6r="onCl";var k_6="layReord";var g$x=r$r8n[625824];g$x+=n8d;g$x+=r$r8n[134240];var v$M=y$F;v$M+=Y7e;var o31=f6B;o31+=r$r8n.b9I;o31+=a8J;o31+=Y7q;var s80=j__;s80+=Y7q;var B_I=m6J;B_I+=k_6;B_I+=e9K;var Z2j=u9F;Z2j+=P8O;var p_b=r7N;p_b+=X5E;p_b+=r$r8n.W1t;p_b+=W$t;var v9s=y$v;v9s+=s79;var y2e=j$H;y2e+=r8e;y2e+=y6r;y2e+=p26;var d4$=r$r8n[214853];d4$+=Q1J;d4$+=s79;d4$+=q6d;var R9Z=I_s;R9Z+=r$r8n[211051];var F8h=W$t;F8h+=O09;var g5P=r$r8n[214853];g5P+=p0J;g5P+=g4R;g5P+=F3e;var _this=this;var fields=this[r7N][g5P];var usedFields=[];var includeInOrder;var editData={};this[r7N][P9I]=editFields;this[r7N][F8h]=editData;this[r7N][E40]=items;this[r7N][R9Z]=X_j;this[U1m][d4$][d1o][p14]=e7p;this[r7N][J92]=type;this[y2e]();$[j0E](fields,function(name,field){var R7j="iIds";var J6Y="ultiRe";var J83=q6d;J83+=u$n;J83+=t$x;J83+=R7j;var r2V=q6d;r2V+=J6Y;r2V+=c0H;r2V+=Y7q;field[r2V]();includeInOrder=R3P;editData[name]={};$[j0E](editFields,function(idSrc,edit){var J44="romData";var x9l="scope";var L8R="ul";var V08="valF";var w7A="tiS";var m0F=r$r8n[214853];m0F+=r$r8n.b9I;m0F+=W$t;L7h.g_4();m0F+=Y$0;if(edit[m0F][name]){var t4x=a4t;t4x+=N96;var S$Y=V08;S$Y+=J44;var val=field[S$Y](edit[t4x]);var nullDefault=field[I1D]();editData[name][idSrc]=val === J1q?Y5Y:Array[R2m](val)?val[n75]():val;if(!formOptions || formOptions[x9l] === u5O){var B2M=r$r8n[625824];B2M+=W$t;B2M+=r$r8n[214853];var Q3k=q6d;Q3k+=L8R;Q3k+=w7A;Q3k+=f_N;field[Q3k](idSrc,val === undefined || nullDefault && val === J1q?field[B2M]():val,R3P);if(!edit[k4E] || edit[k4E][name]){includeInOrder=w6a;}}else {if(!edit[k4E] || edit[k4E][name]){var z6c=r$r8n[625824];z6c+=W$t;z6c+=r$r8n[214853];field[T5M](idSrc,val === undefined || nullDefault && val === J1q?field[z6c]():val,R3P);includeInOrder=w6a;}}}});field[s6I]();if(field[J83]()[T1W] !== k70 && includeInOrder){var T_Y=Z3F;T_Y+=P9U;usedFields[T_Y](name);}});var currOrder=this[v9s]()[p_b]();for(var i=currOrder[Z2j] - X$4;i >= k70;i--){if($[J75](currOrder[i][F4l](),usedFields) === -X$4){currOrder[B6G](i,X$4);}}this[B_I](currOrder);this[s80](o31,[pluck(editFields,v$M)[k70],pluck(editFields,g$x)[k70],items,type],function(){var l13='initMultiEdit';_this[X41](l13,[editFields,items,type],function(){L7h.q_G();setupDone();});});}function _event(trigger,args,promiseComplete){var x0Z="result";L7h.q_G();var C6R="exO";var f28="the";var l9T="trigg";var m4O="Event";var b51="ler";var P21="Eve";var w7W="eve";var W30="erHan";var m24='Cancelled';var S1U=v6v;S1U+=r$r8n[134240];S1U+=W2w;if(args === void k70){args=[];}if(promiseComplete === void k70){promiseComplete=undefined;}if(Array[S1U](trigger)){var u13=A1B;u13+=c2$;u13+=P8O;for(var i=k70,ien=trigger[u13];i < ien;i++){var s9S=e1b;s9S+=w7W;s9S+=v$5;this[s9S](trigger[i],args);}}else {var k0G=c7_;k0G+=W$t;var q_h=f6B;q_h+=r$r8n[625824];q_h+=C6R;q_h+=r$r8n[214853];var m54=l9T;m54+=W30;m54+=r$r8n[625824];m54+=b51;var e=$[m4O](trigger);$(this)[m54](e,args);var result=e[x0Z];if(trigger[q_h](k0G) === k70 && result === R3P){var q72=P21;q72+=y$F;q72+=Y7q;var N4p=l9T;N4p+=W$t;N4p+=O2j;$(this)[N4p]($[q72](trigger + m24),args);}if(promiseComplete){var U1V=f28;U1V+=y$F;if(result && typeof result === v31 && result[U1V]){result[L12](promiseComplete);}else {promiseComplete(result);}}return result;}}function _eventName(input){var J_G=/^on([A-Z])/;var C1K="erC";var w5F=3;var Y$N="substring";var x_Z="Low";var M3w="ase";var p3p=q70;p3p+=y$F;var Q8u=A8W;Q8u+=D$O;Q8u+=v0Z;var K84=r7N;K84+=O6v;K84+=X5E;K84+=Y7q;var name;var names=input[K84](Y$1);for(var i=k70,ien=names[Q8u];i < ien;i++){var y1F=q6d;y1F+=n8d;y1F+=B7b;name=names[i];var onStyle=name[y1F](J_G);if(onStyle){var f_W=o38;f_W+=x_Z;f_W+=C1K;f_W+=M3w;name=onStyle[X$4][f_W]() + name[Y$N](w5F);}names[i]=name;}return names[p3p](Y$1);}function _fieldFromNode(node){var Z4X=F$a;Z4X+=H6e;Z4X+=r7N;var k32=q4T;k32+=v0Z;var foundField=J1q;$[k32](this[r7N][Z4X],function(name,field){var F7f=A1B;F7f+=H7D;if($(field[F_v]())[F5m](node)[F7f]){foundField=field;}});return foundField;}function _fieldNames(fieldNames){if(fieldNames === undefined){return this[K2U]();}else if(!Array[R2m](fieldNames)){return [fieldNames];}return fieldNames;}function _focus(fieldsIn,focus){var j45='div.DTE ';var Q1r="iveElement";var u3A=/^jq:/;var s20="repla";var s69="blur";var F2f=F9y;F2f+=Y_B;F2f+=U4L;F2f+=r7N;var I7R=y$F;I7R+=F2J;I7R+=J0d;I7R+=e9K;var j9T=q6d;j9T+=w9I;var X$Q=c81;X$Q+=B$P;var _this=this;if(this[r7N][Z23] === X$Q){return;}var field;var fields=$[j9T](fieldsIn,function(fieldOrName){var v7L="strin";var A8h=v7L;A8h+=c2$;return typeof fieldOrName === A8h?_this[r7N][K2U][fieldOrName]:fieldOrName;});if(typeof focus === I7R){field=fields[focus];}else if(focus){var B93=T0t;B93+=z4t;B93+=B0s;if(focus[N4I](B93) === k70){var Q7M=s20;Q7M+=j$W;field=$(j45 + focus[Q7M](u3A,Y5Y));}else {var x$4=i2k;x$4+=R_q;x$4+=r$r8n[625824];x$4+=r7N;field=this[r7N][x$4][focus];}}else {var t$n=l6q;t$n+=Y7q;t$n+=Q1r;document[t$n][s69]();}this[r7N][F2f]=field;if(field){var F8K=r$r8n[214853];F8K+=Q1J;F8K+=l86;F8K+=r7N;field[F8K]();}}function _formOptions(opts){var e_j="which";var C7f="rn";var U$f='.dteInline';var F5X="oole";var I9v="editOp";var X6Q="keydo";var E9q="_fieldFromNode";var d7o="tle";var K7y="canRetu";var m_x="mes";var N97="sag";var k11=X6Q;k11+=z3R;var s$a=Q1J;s$a+=y$F;var r0g=J0d;r0g+=F5X;r0g+=l$W;var Q4J=J0d;Q4J+=u$n;Q4J+=P4Y;Q4J+=j9y;var j0q=v7W;j0q+=c0w;var M$l=m_x;M$l+=N97;M$l+=W$t;var F8w=U4g;F8w+=s6v;F8w+=r$r8n[134240];F8w+=T_8;L7h.q_G();var d8g=Y7q;d8g+=r$r8n.b9I;d8g+=d7o;var V8Q=g2J;V8Q+=s79;V8Q+=r$r8n.b9I;V8Q+=S2H;var s8l=I9v;s8l+=e6I;var _this=this;var that=this;var inlineCount=_inlineCounter++;var namespace=U$f + inlineCount;this[r7N][s8l]=opts;this[r7N][i34]=inlineCount;if(typeof opts[x6Z] === V8Q || typeof opts[d8g] === r8B){var b$E=m$b;b$E+=W$t;var f0X=m$b;f0X+=W$t;this[x6Z](opts[f0X]);opts[b$E]=w6a;}if(typeof opts[F8w] === k38 || typeof opts[M$l] === j0q){var b_V=H5_;b_V+=r$r8n[134240];b_V+=T_8;this[S6H](opts[S6H]);opts[b_V]=w6a;}if(typeof opts[Q4J] !== r0g){var U1t=i9x;U1t+=J61;U1t+=r7N;this[U1t](opts[r$L]);opts[r$L]=w6a;}$(document)[s$a](k11 + namespace,function(e){var O8C="canReturn";var O1_="Def";var C0f="activeElement";var F2H="Subm";var T91="ubmi";var C8_=p14;C8_+=W$t;C8_+=r$r8n[625824];if(e[e_j] === e3u && _this[r7N][C8_]){var el=$(document[C0f]);if(el){var P9P=O8C;P9P+=e5B;P9P+=T91;P9P+=Y7q;var K0o=K7y;K0o+=C7f;K0o+=F2H;K0o+=V7o;var field=_this[E9q](el);if(field && typeof field[K0o] === r8B && field[P9P](el)){var J16=A7s;J16+=O1_;J16+=U0Q;e[J16]();}}}});$(document)[Q5i](B7L + namespace,function(e){var M0O="canReturnSubmit";var Y7t="hic";var N$O="blu";var a1G="onEsc";var K_q="Retur";var S4E=27;var e6Q=39;var b5i="Es";var d0I='.DTE_Form_Buttons';var t0O="onReturn";var y3e="veEle";var Q5k=37;L7h.q_G();var A3W="prev";var M9G=U8y;M9G+=y3e;M9G+=Q5F;var el=$(document[M9G]);if(e[e_j] === e3u && _this[r7N][H6u]){var R07=r$r8n[214853];R07+=r$r8n[531722];R07+=E7s;R07+=y$F;var I2q=K7y;I2q+=C7f;I2q+=k$C;var field=_this[E9q](el);if(field && typeof field[I2q] === R07 && field[M0O](el)){var B$Z=a3g;B$Z+=r8e;B$Z+=Q1J;B$Z+=y$F;var m7r=Q5i;m7r+=K_q;m7r+=y$F;if(opts[m7r] === x$l){var X$V=r7N;X$V+=h2p;X$V+=I7j;X$V+=Y7q;e[Q_j]();_this[X$V]();}else if(typeof opts[t0O] === B$Z){e[Q_j]();opts[t0O](_this,e);}}}else if(e[e_j] === S4E){var C5X=r$r8n.W1t;C5X+=g4R;C5X+=Q1J;C5X+=c0H;var o8X=J0d;o8X+=g4R;o8X+=u$n;o8X+=s79;var E1y=Q1J;E1y+=y$F;E1y+=b5i;E1y+=r$r8n.W1t;e[Q_j]();if(typeof opts[E1y] === r8B){opts[a1G](that,e);}else if(opts[a1G] === o8X){var C7I=N$O;C7I+=s79;that[C7I]();}else if(opts[a1G] === C5X){that[g0d]();}else if(opts[a1G] === x$l){that[B4h]();}}else if(el[z5L](d0I)[T1W]){var c96=S6a;c96+=Y7t;c96+=v0Z;if(e[e_j] === Q5k){var X7A=p$G;X7A+=s$p;X7A+=e9K;el[A3W](v_n)[X7A](Q$T);}else if(e[c96] === e6Q){var o_9=r$r8n[214853];o_9+=u1w;o_9+=u$n;o_9+=r7N;var D3Z=i9x;D3Z+=o38;D3Z+=y$F;var y$E=U4H;y$E+=u8s;y$E+=Y7q;el[y$E](D3Z)[i1P](o_9);}}});this[r7N][w3h]=function(){var o69=b70;o69+=I3D;$(document)[x$J](s7K + namespace);$(document)[x$J](o69 + namespace);};return namespace;}function _inline(editFields,opts,closeCb){var x9m="v class";var i6P="contents";var v5K="ancel";var X51="\"><span></span></di";var G7_="</d";var V9T="<div class=\"DTE_Processing_Indicator";var v74="_postop";var Y07='div.';var o$$="mE";var B$i='style="width:';var i$0="ttac";var z0k="=";var S1S="tac";var X2B="ren";var M3U='Edge/';var a$p="nputTrigger";var q_p='tr';var S7V="userAgent";var Z3v="Option";var v5E="_focus";var l8M="lass=\"";var d9n="hFields";var g63='.';var t7n="tTrigg";var D9p="\"></div";var J9o=v74;J9o+=W$t;J9o+=y$F;var r5V=T1l;r5V+=l86;r5V+=r7N;var a_T=r$r8n.W1t;a_T+=v5K;var d4d=K7$;d4d+=u$n;d4d+=t7n;d4d+=e9K;var P4H=u_S;P4H+=a$p;var U_6=Y8h;U_6+=v0Z;var J1A=r$r8n.b9I;J1A+=y$F;J1A+=Z3Q;J1A+=W$t;var g2T=e1b;g2T+=N1H;g2T+=Z3v;g2T+=r7N;var q5S=O9W;q5S+=r$r8n[134240];q5S+=B7b;var X_Q=E$v;L7h.q_G();X_Q+=r$r8n.b9I;X_Q+=y$F;X_Q+=W$t;var z0V=T7i;z0V+=g6j;var _this=this;if(closeCb === void k70){closeCb=J1q;}var closed=R3P;var classes=this[z0V][X_Q];var keys=Object[P3J](editFields);var editRow=editFields[keys[k70]];var lastAttachPoint;var elements=[];for(var i=k70;i < editRow[q5S][T1W];i++){var d1G=n8d;d1G+=S1S;d1G+=v0Z;var N8e=O6v;N8e+=u$n;N8e+=P9U;var v7Y=r$r8n[134240];v7Y+=i$0;v7Y+=d9n;var name_1=editRow[v7Y][i][k70];elements[N8e]({field:this[r7N][K2U][name_1],name:name_1,node:$(editRow[d1G][i])});}var namespace=this[g2T](opts);var ret=this[f6g](J1A);if(!ret){return this;}for(var _i=k70,elements_1=elements;_i < elements_1[U_6];_i++){var y6v=M$E;y6v+=Q5i;y6v+=r7N;var G0B=r$r8n[214853];G0B+=B0D;G0B+=r$r8n[625824];var K_R=T1l;K_R+=s79;K_R+=o$$;K_R+=Q1F;var z77=r$r8n[134240];z77+=X_G;z77+=y$F;z77+=r$r8n[625824];var U0g=y$F;U0g+=Y7e;var P4w=r$r8n[214853];P4w+=z3b;var E1s=H2v;E1s+=W$t;var J$A=g4R;J$A+=n4k;var Z7r=i2k;Z7r+=y$F;Z7r+=r$r8n[625824];var f04=G7_;f04+=w99;f04+=b1l;var f9v=D9p;f9v+=b1l;var y7$=M4J;y7$+=P4Y;y7$+=Q5i;y7$+=r7N;var v4i=o5b;v4i+=x9m;v4i+=z0k;v4i+=k7g;var w07=G7_;w07+=r$r8n.b9I;w07+=L9i;var r31=V9T;r31+=X51;r31+=L9i;var s_Y=k7g;s_Y+=w3m;var F2N=g4R;F2N+=r$r8n.b9I;F2N+=U4H;F2N+=s79;var T04=F8m;T04+=w3m;T04+=r$r8n.W1t;T04+=l8M;var M9w=O6v;M9w+=u8s;M9w+=k7g;var w9k=Z7B;w9k+=w$G;var q3B=W7c;q3B+=H6e;q3B+=X2B;var el=elements_1[_i];var node=el[F_v];el[q3B]=node[i6P]()[w9k]();var style=navigator[S7V][N4I](M3U) !== -X$4?B$i + node[K_K]() + M9w:Y5Y;node[W2m]($(T04 + classes[C4d] + w5g + o92 + classes[F2N] + s_Y + style + K6G + r31 + w07 + v4i + classes[y7$] + f9v + f04));node[Z7r](Y07 + classes[J$A][E1s](/ /g,g63))[W2m](el[P4w][U0g]())[z77](this[U1m][K_R]);var insertParent=$(el[G0B][F_v]())[i2r](q_p);if(insertParent[T1W]){lastAttachPoint=insertParent;}if(opts[y6v]){var g1Y=o5k;g1Y+=t91;var c3H=H2v;c3H+=W$t;node[F5m](Y07 + classes[r$L][c3H](/ /g,g63))[W2m](this[U1m][g1Y]);}}var submitClose=this[P4H](x$l,opts,lastAttachPoint);var cancelClose=this[d4d](a_T,opts,lastAttachPoint);this[G5u](function(submitComplete,action){var M0X="cI";var k$0="rE";var k_e="_clearDynami";var h_t=f6B;h_t+=r0Q;var P4f=k_e;P4f+=M0X;P4f+=L9k;var t6a=W$t;t6a+=J$7;t6a+=Y7q;var n3U=d40;n3U+=X$g;var j1W=Q1J;j1W+=H5e;closed=w6a;$(document)[j1W](n3U + namespace);if(!submitComplete || action !== t6a){var J6b=r$r8n[214853];J6b+=Q1J;J6b+=k$0;J6b+=T30;elements[J6b](function(el){var s1v="tents";var x5A="etach";var c7m=W7c;c7m+=g4R;c7m+=o7J;c7m+=b0H;var v_m=I_z;v_m+=W$t;v_m+=y$F;v_m+=r$r8n[625824];var B9$=r$r8n[625824];B9$+=x5A;var d$j=r$r8n.W1t;d$j+=Q1J;d$j+=y$F;d$j+=s1v;var a00=y$F;a00+=Q1J;a00+=Z7B;el[a00][d$j]()[B9$]();el[F_v][v_m](el[c7m]);});}submitClose();cancelClose();_this[P4f]();if(closeCb){closeCb();}return h_t;});setTimeout(function(){var j_8="down";var z6E="ddBa";var T2I="ouse";L7h.q_G();var N5x='andSelf';var F1j=r$r8n.W1t;F1j+=g4R;F1j+=r$r8n.b9I;F1j+=X$g;var A5x=b70;A5x+=j_8;var U32=q6d;U32+=T2I;U32+=z0T;U32+=z3R;var D1r=Q1J;D1r+=y$F;var W2b=r$r8n[134240];W2b+=z6E;W2b+=r$r8n.W1t;W2b+=l0E;if(closed){return;}var back=$[r$r8n.n2M][W2b]?M8$:N5x;var target;$(document)[D1r](U32 + namespace,function(e){target=e[D7M];})[Q5i](A5x + namespace,function(e){target=e[D7M];})[Q5i](F1j + namespace,function(e){var m1q="_ty";var e3_=g4R;L7h.q_G();e3_+=b0H;e3_+=H7D;var isIn=R3P;for(var _i=k70,elements_2=elements;_i < elements_2[e3_];_i++){var j7X=y$F;j7X+=Q1J;j7X+=Z7B;var A36=x75;A36+=r7N;var J$J=m1q;J$J+=k3V;J$J+=D9u;var el=elements_2[_i];if(el[b7s][J$J](A36,target) || $[J75](el[j7X][k70],$(target)[z5L]()[back]()) !== -X$4){isIn=w6a;}}if(!isIn){var Z6F=J0d;Z6F+=g4R;Z6F+=u$n;Z6F+=s79;_this[Z6F]();}});},k70);this[v5E]($[F98](elements,function(el){return el[b7s];}),opts[r5V]);this[J9o](O6W,w6a);}function _inputTrigger(type,opts,insertPoint){var Y84='Html';var d$2="ck.d";var D6t="mb";var p4f='Trigger';var r_4="chil";var b2r="etac";var A8U="dren";var z43="des";var D2i=r$r8n[134240];D2i+=X_G;D2i+=y$F;D2i+=r$r8n[625824];var D4X=Q1J;D4X+=y$F;var D2F=r$r8n[625824];D2F+=b2r;D2F+=v0Z;var d15=r_4;d15+=r$r8n[625824];d15+=D0t;d15+=z43;var Y$d=r7N;Y$d+=X5E;Y$d+=j$W;var D2c=P2Y;D2c+=D3A;D2c+=N4y;D2c+=W$t;var m2t=A8W;m2t+=D$O;m2t+=v0Z;var i4K=R3H;i4K+=D6t;i4K+=W$t;i4K+=s79;var z4Q=Y7q;z4Q+=s79;var w7s=d40;w7s+=d$2;w7s+=F4_;w7s+=j4W;var _this=this;var trigger=opts[type + p4f];var html=opts[type + Y84];var event=w7s + type;var tr=$(insertPoint)[i2r](z4Q);if(trigger === undefined){return function(){};}if(typeof trigger === i4K){var g_h=r_4;g_h+=A8U;var kids=tr[g_h]();trigger=trigger < k70?kids[kids[T1W] + trigger]:kids[trigger];}var children=$(trigger,tr)[m2t]?Array[D2c][Y$d][w7u]($(trigger,tr)[k70][d15]):[];$(children)[D2F]();var triggerEl=$(trigger,tr)[D4X](event,function(e){var z7p='cancel';var f0j="stopImmediatePropagation";e[f0j]();if(type === z7p){var v3s=r$r8n.W1t;v3s+=p4w;v3s+=c0H;_this[v3s]();}else {var m91=A4$;m91+=U3j;m91+=Y7q;_this[m91]();}})[D2i](html);return function(){var W8i=I_z;W8i+=X27;L7h.g_4();var Q4o=Q1J;Q4o+=H5e;triggerEl[Q4o](event)[F$1]()[W8i](children);};}function _optionsUpdate(json){var y8l="opti";var z61=y8l;z61+=j9y;var that=this;if(json && json[z61]){var I0V=i2k;I0V+=i7D;I0V+=r7N;$[j0E](this[r7N][I0V],function(name,field){var o76="tions";var J4R="upda";var H6S="upd";var Z0Z=f3S;Z0Z+=o76;if(json[Z0Z][name] !== undefined){var P$7=H6S;P$7+=N1c;var z$3=u$n;z$3+=s79;z$3+=g4R;var b7C=r$r8n[134240];b7C+=T0t;b7C+=r$r8n[134240];b7C+=u8s;var N27=r$r8n[625824];N27+=Y7q;var C1Y=r$r8n[625824];C1Y+=Y7q;var h3C=r$r8n[214853];h3C+=r$r8n.b9I;h3C+=R_q;h3C+=r$r8n[625824];var fieldInst=that[h3C](name);if(fieldInst[C1Y] && fieldInst[N27]()[b7C][z$3]()){return;}if(fieldInst && fieldInst[P$7]){var S5P=f3S;S5P+=I6H;S5P+=j9y;var Z9j=J4R;Z9j+=F4_;fieldInst[Z9j](json[S5P][name]);}}});}}function _message(el,msg,title,fn){var c6g="layed";var S9U="moveAttr";var R01="ispl";var a7U=v7W;a7U+=c0w;var canAnimate=$[r$r8n.n2M][X08]?w6a:R3P;if(title === undefined){title=R3P;}if(!fn){fn=function(){};}L7h.g_4();if(typeof msg === a7U){msg=msg(this,new DataTable$4[J_A](this[r7N][Y5V]));}el=$(el);if(canAnimate){var V63=r7N;V63+=o38;V63+=O6v;el[V63]();}if(!msg){var u1Q=V2G;u1Q+=O6v;u1Q+=c6g;if(this[r7N][u1Q] && canAnimate){el[H6M](function(){el[V4c](Y5Y);fn();});}else {el[V4c](Y5Y)[o8Q](P$o,D8d);fn();}if(title){var g1q=v60;g1q+=S9U;el[g1q](b7N);}}else {var i_h=r$r8n[625824];i_h+=R01;i_h+=F6K;fn();if(this[r7N][i_h] && canAnimate){var k_i=s5K;k_i+=R6N;el[V4c](msg)[k_i]();}else {var L4I=J$7;L4I+=r7N;L4I+=z7t;L4I+=W2w;el[V4c](msg)[o8Q](L4I,e7p);}if(title){el[J2w](b7N,msg);}}}function _multiInfo(){var Z4L="multiEditab";var D6F="isM";var e6i="include";var w$X="ultiValu";var C8p="Fie";var E5g="isMul";var J1l="multiI";var R6h=e6i;R6h+=C8p;R6h+=Y$0;var fields=this[r7N][K2U];var include=this[r7N][R6h];var show=w6a;var state;if(!include){return;}for(var i=k70,ien=include[T1W];i < ien;i++){var B8j=J1l;B8j+=R4P;var H79=D6F;H79+=w$X;H79+=W$t;var P9B=E5g;P9B+=U7F;var s3e=Z4L;s3e+=A8W;var field=fields[include[i]];var multiEditable=field[s3e]();if(field[P9B]() && multiEditable && show){state=w6a;show=R3P;}else if(field[H79]() && !multiEditable){state=w6a;}else {state=R3P;}fields[include[i]][B8j](state);}}function _nestedClose(cb){var E5h="Controller";var O0t="ller";var G4w="displayCo";var C4k="isplayControlle";var u_K="callback";L7h.g_4();var T73="pop";var F8j=A1B;F8j+=O32;F8j+=v0Z;var C1C=p14;C1C+=E5h;var disCtrl=this[r7N][C1C];var show=disCtrl[q2g];if(!show || !show[T1W]){if(cb){cb();}}else if(show[F8j] > X$4){var X6d=G4w;X6d+=v$5;X6d+=W7M;X6d+=O0t;show[T73]();var last=show[show[T1W] - X$4];if(cb){cb();}this[r7N][X6d][U9B](last[L21],last[W2m],last[u_K]);}else {var a$4=g4R;a$4+=v5e;var u2f=r$r8n.W1t;u2f+=g4R;u2f+=Q1J;u2f+=c0H;var D0y=r$r8n[625824];D0y+=C4k;D0y+=s79;this[r7N][D0y][u2f](this,cb);show[a$4]=k70;}}function _nestedOpen(cb,nest){var s5W="how";var X1o=t2l;X1o+=V44;var u_f=f3S;u_f+=W$t;u_f+=y$F;var z0Q=n5o;z0Q+=r$r8n[134240];L7h.q_G();z0Q+=k_0;var t8M=Z3F;t8M+=P9U;var disCtrl=this[r7N][E$9];if(!disCtrl[q2g]){var L5s=r40;L5s+=s5W;disCtrl[L5s]=[];}if(!nest){var N5n=g4R;N5n+=T1d;N5n+=v0Z;var I$b=e1b;I$b+=r7N;I$b+=l_$;I$b+=S6a;disCtrl[I$b][N5n]=k70;}disCtrl[q2g][t8M]({append:this[U1m][z0Q],callback:cb,dte:this});this[r7N][E$9][u_f](this,this[U1m][X1o],cb);}function _postopen(type,immediate){var g9a="ternal";var z_2='submit.editor-internal';var h5D="eFo";var V$g="submit.editor-i";var D$t=".editor-focu";var m3c="captur";var e60=r$r8n[134240];e60+=r$r8n[166666];e60+=r$r8n.b9I;e60+=Q5i;var i7Y=Q1J;i7Y+=y$F;var p3b=V$g;p3b+=y$F;p3b+=g9a;var o15=Q1J;o15+=r$r8n[214853];o15+=r$r8n[214853];var i4E=m3c;i4E+=h5D;i4E+=l86;i4E+=r7N;var _this=this;var focusCapture=this[r7N][E$9][i4E];if(focusCapture === undefined){focusCapture=w6a;}$(this[U1m][N1H])[o15](p3b)[i7Y](z_2,function(e){var B71="Default";L7h.q_G();var k4G=A7s;k4G+=B71;e[k4G]();});if(focusCapture && (type === W1Y || type === V0N)){var f14=U8s;f14+=D$t;f14+=r7N;var c4u=G$o;c4u+=r$r8n[625824];c4u+=W2w;$(c4u)[Q5i](f14,function(){var W3H="etF";var p6M=".D";var D8h="TED";var N0f="veElement";var B56="etFocus";var a9R=g4R;a9R+=s97;a9R+=P8O;var N7a=p6M;N7a+=D8h;var B68=I_s;B68+=R$a;B68+=k3$;var S_Z=z4E;S_Z+=X8C;S_Z+=d1X;S_Z+=n_x;var r3C=Y$F;r3C+=v60;r3C+=Y7s;var A1_=r$r8n[134240];L7h.g_4();A1_+=r8e;A1_+=N0f;if($(document[A1_])[r3C](S_Z)[T1W] === k70 && $(document[B68])[z5L](N7a)[a9R] === k70){var m$A=r7N;m$A+=B56;if(_this[r7N][m$A]){var L2Z=r7N;L2Z+=W3H;L2Z+=U4L;L2Z+=r7N;_this[r7N][L2Z][U8s]();}}});}this[n5I]();this[X41](B2S,[type,this[r7N][e60]]);if(immediate){var w6t=J4v;w6t+=y0l;this[w6t](l16,[type,this[r7N][Z23]]);}return w6a;}function _preopen(type){var r4s="eIcb";var W9k='cancelOpen';var P3l="namicInfo";var r7t="_clearDy";var U6H="ctio";var s6w="preOp";var V6D="cb";var B9r=d6Y;B9r+=F6K;var d38=r7t;d38+=P3l;var r61=I_s;r61+=r$r8n.b9I;r61+=Q1J;r61+=y$F;var u63=s6w;u63+=b0H;if(this[X41](u63,[type,this[r7N][r61]]) === R3P){var l6f=M5Y;l6f+=r4s;var I4T=g0d;I4T+=B50;I4T+=V6D;var y8P=J0d;y8P+=h2p;y8P+=J0d;y8P+=A8W;var J$$=A2o;J$$+=Z7B;var V$n=r$r8n[134240];V$n+=U6H;V$n+=y$F;var A1h=J4v;A1h+=E9Q;A1h+=b0H;A1h+=Y7q;this[T93]();this[A1h](W9k,[type,this[r7N][V$n]]);if((this[r7N][J92] === O6W || this[r7N][J$$] === y8P) && this[r7N][I4T]){this[r7N][w3h]();}this[r7N][l6f]=J1q;return R3P;}this[d38](w6a);this[r7N][B9r]=type;return w6a;}function _processing(processing){var l22="essin";var a7z='div.DTE';var l62="eCla";var A62="ive";var I$Y="tog";var K95=U6X;K95+=k10;var T9d=J4v;T9d+=C$k;T9d+=Y7q;var r5P=I$Y;r5P+=b59;r5P+=l62;r5P+=s6v;var f7z=S6a;f7z+=w1r;f7z+=e9K;var J4O=r$r8n[134240];J4O+=r$r8n[166666];J4O+=A62;var n3z=Z_S;n3z+=l22;n3z+=c2$;var e$5=n8U;e$5+=r7N;var procClass=this[e$5][n3z][J4O];$([a7z,this[U1m][f7z]])[r5P](procClass,processing);this[r7N][F$W]=processing;this[T9d](K95,[processing]);}function _noProcessing(args){var c1h="cessing-field";var P_g=F$a;P_g+=g4R;P_g+=r$r8n[625824];P_g+=r7N;var processing=R3P;$[j0E](this[r7N][P_g],function(name,field){var q3p="rocess";L7h.g_4();var j3P=O6v;j3P+=q3p;j3P+=k10;if(field[j3P]()){processing=w6a;}});if(processing){var A6L=O6v;A6L+=W7M;A6L+=c1h;this[W_z](A6L,function(){var f$f="_no";var c5O="sin";var p59="_su";var p9y="Proces";var i0i=f$f;i0i+=p9y;i0i+=c5O;i0i+=c2$;if(this[i0i](args) === w6a){var k9A=p59;k9A+=J0d;k9A+=I7j;k9A+=Y7q;this[k9A][w$N](this,args);}});}return !processing;}function _submit(successCallback,errorCallback,formatdata,hide){var N1Y="_noP";var F0C="_processin";var w_k='preSubmit';var P_Z="mitC";var Y1U="sub";var A48="ete";var x_n=16;var r1F='Field is still processing';var E1w='changed';var W3g="onC";var x5C="editDat";var E$5="llIfChanged";var l46="onName";var t4S="ompl";var o5Y=o2F;o5Y+=W$t;o5Y+=y$F;o5Y+=Y7q;var O3E=l9k;O3E+=b0H;O3E+=r$r8n[625824];var s7M=W$t;s7M+=r$r8n[625824];s7M+=r$r8n.b9I;s7M+=Y7q;var I_$=U8y;I_$+=l46;var I26=U8y;I26+=Q5i;var b6p=N1Y;b6p+=D9r;var M5U=Y1U;M5U+=q6d;M5U+=V7o;var n$v=x5C;n$v+=r$r8n[134240];var Y6_=F$a;Y6_+=g4R;Y6_+=F3e;var _this=this;var changed=R3P;var allData={};var changedData={};var setBuilder=dataSet;var fields=this[r7N][Y6_];var editCount=this[r7N][i34];var editFields=this[r7N][P9I];var editData=this[r7N][n$v];var opts=this[r7N][n_K];var changedSubmit=opts[M5U];var submitParamsLocal;if(this[b6p](arguments) === R3P){Editor[f8w](r1F,x_n,R3P);return;}var action=this[r7N][I26];var submitParams={data:{}};submitParams[this[r7N][I_$]]=action;if(action === C$L || action === s7M){var N$s=r$r8n[134240];N$s+=E$5;var g6a=r$r8n[134240];g6a+=g4R;g6a+=g4R;var m0f=W$t;m0f+=r$r8n[134240];m0f+=B7b;$[m0f](editFields,function(idSrc,edit){var s3Y="isE";var q8G="mptyO";var q2v="bj";var l9K=s3Y;l9K+=q8G;l9K+=q2v;l9K+=C5Y;L7h.g_4();var allRowData={};var changedRowData={};$[j0E](fields,function(name,field){var V9w=/\[.*$/;var G2v="Ar";var I3z="valFr";var j0J="y-cou";var B$h='[]';var n_s="-ma";var u0u=y3N;u0u+=V7o;u0u+=u80;u0u+=A8W;if(edit[K2U][name] && field[u0u]()){var N9V=W$t;N9V+=r$r8n[625824];N9V+=V7o;var V5f=n_s;V5f+=y$F;V5f+=j0J;V5f+=v$5;var k2o=v60;k2o+=O7l;var A0R=r$r8n.b9I;A0R+=r7N;A0R+=G2v;A0R+=i7a;var multiGet=field[C2b]();var builder=setBuilder(name);if(multiGet[idSrc] === undefined){var j$q=a4t;j$q+=N96;var d8X=I3z;d8X+=W$3;d8X+=X8C;d8X+=y29;var originalVal=field[d8X](edit[j$q]);builder(allRowData,originalVal);return;}var value=multiGet[idSrc];var manyBuilder=Array[A0R](value) && typeof name === k38 && name[N4I](B$h) !== -X$4?setBuilder(name[k2o](V9w,Y5Y) + V5f):J1q;builder(allRowData,value);if(manyBuilder){manyBuilder(allRowData,value[T1W]);}if(action === N9V && (!editData[name] || !field[E2q](value,editData[name][idSrc]))){builder(changedRowData,value);changed=w6a;if(manyBuilder){var R0M=A8W;R0M+=S2H;R0M+=P8O;manyBuilder(changedRowData,value[R0M]);}}}});if(!$[V2U](allRowData)){allData[idSrc]=allRowData;}if(!$[l9K](changedRowData)){changedData[idSrc]=changedRowData;}});if(action === C$L || changedSubmit === g6a || changedSubmit === N$s && changed){var f8R=r$r8n[625824];f8R+=r$r8n[134240];f8R+=Y7q;f8R+=r$r8n[134240];submitParams[f8R]=allData;}else if(changedSubmit === E1w && changed){var J3H=r$r8n[625824];J3H+=r$r8n[134240];J3H+=Y7q;J3H+=r$r8n[134240];submitParams[J3H]=changedData;}else {var g45=Y1U;g45+=P_Z;g45+=Q1J;g45+=e7l;var u7A=o2F;u7A+=W$t;u7A+=y$F;u7A+=Y7q;var l1Y=F0C;l1Y+=c2$;var d8n=r$r8n[214853];d8n+=u$n;d8n+=y$F;d8n+=c4g;var Q65=W3g;Q65+=t4S;Q65+=A48;var r0c=w6n;r0c+=r7N;r0c+=W$t;var H0j=X61;H0j+=y$F;this[r7N][H0j]=J1q;if(opts[s88] === r0c && (hide === undefined || hide)){this[f5_](R3P);}else if(typeof opts[Q65] === d8n){opts[s88](this);}if(successCallback){successCallback[w7u](this);}this[l1Y](R3P);this[u7A](g45);return;}}else if(action === J3x){var Q_g=W$t;Q_g+=r$r8n[134240];Q_g+=r$r8n.W1t;Q_g+=v0Z;$[Q_g](editFields,function(idSrc,edit){var d9A=n5V;d9A+=r$r8n[134240];var X$f=r$r8n[625824];X$f+=y29;submitParams[X$f][idSrc]=edit[d9A];});}submitParamsLocal=$[O3E](w6a,{},submitParams);if(formatdata){formatdata(submitParams);}this[o5Y](w_k,[submitParams,action],function(result){if(result === R3P){_this[j33](R3P);}else {var J$H=L1p;J$H+=g4R;var S7z=e1b;S7z+=p7o;S7z+=C7X;var D9V=r$r8n[134240];D9V+=T0t;D9V+=r$r8n[134240];D9V+=u8s;var submitWire=_this[r7N][D9V]?_this[S7z]:_this[g8r];submitWire[J$H](_this,submitParams,function(json,notGood,xhr){L7h.g_4();var g$V="cess";var O9K="_submitSuc";var r5d=O9K;r5d+=g$V;_this[r5d](json,notGood,submitParams,submitParamsLocal,_this[r7N][Z23],editCount,hide,successCallback,errorCallback,xhr);},function(xhr,err,thrown){var Q0Q="_submitError";var x0l=r$r8n[134240];x0l+=r$r8n[166666];x0l+=r$r8n[211051];_this[Q0Q](xhr,err,thrown,errorCallback,submitParams,_this[r7N][x0l]);},submitParams);}});}function _submitTable(data,success,error,submitParams){var x$h="modifi";var t1G="dS";var d6K=v60;d6K+=q6d;d6K+=B$P;var z6W=r$r8n.b9I;z6W+=t1G;z6W+=s79;z6W+=r$r8n.W1t;var v6d=X61;v6d+=y$F;var action=data[v6d];var out={data:[]};var idGet=dataGet(this[r7N][C2w]);var idSet=dataSet(this[r7N][z6W]);if(action !== d6K){var L68=r$r8n[625824];L68+=r$r8n[134240];L68+=Y7q;L68+=r$r8n[134240];var L7G=x$h;L7G+=e9K;var O8G=v7n;O8G+=y8O;var M07=A2o;M07+=f0E;var originalData_1=this[r7N][J92] === W1Y?this[e7b](e5t,this[M07]()):this[O8G](P60,this[L7G]());$[j0E](data[L68],function(key,vals){var r91=t_F;r91+=W$t;r91+=N1c;var b6S=W$t;b6S+=r$r8n[625824];b6S+=r$r8n.b9I;b6S+=Y7q;var toSave;var extender=extendDeepObjShallowArr;if(action === b6S){var rowData=originalData_1[key][q7Q];toSave=extender({},rowData);toSave=extender(toSave,vals);}else {toSave=extender({},vals);}var overrideId=idGet(toSave);if(action === r91 && overrideId === undefined){idSet(toSave,+new Date() + key[F4l]());}else {idSet(toSave,overrideId);}out[q7Q][f12](toSave);});}success(out);}function _submitSuccess(json,notGood,submitParams,submitParamsLocal,action,editCount,hide,successCallback,errorCallback,xhr){var P4Z='postRemove';var z4k="omm";var M_w="Success";var f3g="_dataS";var L_s='commit';var U1D='setData';var e5C='preRemove';var l0x="rce";var b9w="eEdit";L7h.q_G();var o_q='prep';var t2p="nCo";var l0A="stCr";var Z8F="submi";var f2M="remo";var J2c="_proce";var I4P="onCom";var U8w="fieldErrors";var N4Q="r>";var J6C='preCreate';var Q_s="taSour";var v4V="ssin";var X0A="let";var J0v='submitUnsuccessful';var e3a='postEdit';var x7R="ource";var S_w="jo";var J_x="ids";var L2$=J2c;L2$+=v4V;L2$+=c2$;var u00=A8W;u00+=D$O;u00+=v0Z;var V_A=W$t;V_A+=r6b;V_A+=s79;var L3D=e9K;L3D+=W7M;L3D+=s79;var P4W=O6v;P4W+=y8e;P4W+=Y7q;P4W+=k$C;var f7o=o2F;f7o+=s1Z;var _this=this;var that=this;var setData;var fields=this[r7N][K2U];var opts=this[r7N][n_K];var modifier=this[r7N][E40];this[f7o](P4W,[json,submitParams,action,xhr]);if(!json[L3D]){json[f8w]=Y5Y;}if(!json[U8w]){json[U8w]=[];}if(notGood || json[V_A] || json[U8w][u00]){var q$U=J4v;q$U+=y0l;var q1D=u7e;q1D+=J0d;q1D+=N4Q;var h4L=S_w;h4L+=f6B;var i_L=W$t;i_L+=q1g;i_L+=Q1J;i_L+=s79;var e$x=u3_;e$x+=r$r8n[625824];e$x+=T3b;var S8A=W$t;S8A+=r$r8n[134240];S8A+=r$r8n.W1t;S8A+=v0Z;var globalError_1=[];if(json[f8w]){var H$e=O6v;H$e+=u$n;H$e+=r7N;H$e+=v0Z;globalError_1[H$e](json[f8w]);}$[S8A](json[e$x],function(i,err){L7h.q_G();var v76=': ';var E0E="onFieldError";var m4B="positi";var f$V="Err";var v9l="eldError";var Y4G='Unknown field: ';var E44="FieldE";var e1L=500;var W6i="bodyConten";var L8Q="onFi";var q4j=p7s;q4j+=W2w;q4j+=p5T;var H1s=y$F;H1s+=r$r8n[134240];H1s+=q6d;H1s+=W$t;var field=fields[err[H1s]];if(!field){throw new Error(Y4G + err[N5t]);}else if(field[q4j]()){var I1t=n_x;I1t+=r6b;I1t+=s79;var w6b=N41;w6b+=s79;field[w6b](err[C$w] || I1t);if(i === k70){var J5E=Q5i;J5E+=E44;J5E+=Q1F;var O3R=T1l;O3R+=r$r8n.W1t;O3R+=u$n;O3R+=r7N;var W_s=L8Q;W_s+=v9l;if(opts[W_s] === O3R){var M9S=Y7q;M9S+=Q1J;M9S+=O6v;var l12=m4B;l12+=Q5i;var i9z=W6i;i9z+=Y7q;_this[R_R]($(_this[U1m][i9z]),{scrollTop:$(field[F_v]())[l12]()[M9S]},e1L);field[U8s]();}else if(typeof opts[J5E] === r8B){opts[E0E](_this,err);}}}else {var w$R=f$V;w$R+=M3v;var w5p=g2J;w5p+=n8d;w5p+=D_f;var q30=y$F;q30+=r$r8n[134240];q30+=q6d;q30+=W$t;var t1O=O6v;t1O+=u$n;t1O+=r7N;t1O+=v0Z;globalError_1[t1O](field[q30]() + v76 + (err[w5p] || w$R));}});this[i_L](globalError_1[h4L](q1D));this[q$U](J0v,[json]);if(errorCallback){var N8S=n2D;N8S+=g4R;N8S+=g4R;errorCallback[N8S](that,json);}}else {var s32=Z8F;s32+=Y7q;s32+=M_w;var x$0=f2M;x$0+=v1D;var X2K=r$r8n[625824];X2K+=r$r8n[134240];X2K+=Y7q;X2K+=r$r8n[134240];var store={};if(json[X2K] && (action === C$L || action === X_j)){var e30=r$r8n[625824];e30+=n8d;e30+=r$r8n[134240];var C6g=v7n;C6g+=y8O;var P8o=r$r8n[625824];P8o+=r$r8n[134240];P8o+=N96;var q3a=e1b;q3a+=a4t;q3a+=Q_s;q3a+=j$W;this[q3a](o_q,action,modifier,submitParamsLocal,json,store);for(var _i=k70,_a=json[P8o];_i < _a[T1W];_i++){var u3s=W$t;u3s+=O53;var l_s=j__;l_s+=Y7q;var p4g=r$r8n.b9I;p4g+=r$r8n[625824];var data=_a[_i];setData=data;var id=this[e7b](p4g,data);this[l_s](U1D,[json,data,action]);if(action === C$L){var b50=T4r;b50+=l0A;b50+=R7G;var Z$5=G86;Z$5+=Y7q;Z$5+=W$t;var t7J=r$r8n.W1t;t7J+=s79;t7J+=p$q;t7J+=F4_;var X0v=f3g;X0v+=x7R;this[X41](J6C,[json,data,id]);this[X0v](t7J,fields,data,store);this[X41]([Z$5,b50],[json,data,id]);}else if(action === u3s){var O02=J4v;O02+=E9Q;O02+=b0H;O02+=Y7q;var o36=y_P;o36+=u$n;o36+=l0x;var i9U=c7_;i9U+=b9w;this[X41](i9U,[json,data,id]);this[o36](X_j,modifier,fields,data,store);this[O02]([X_j,e3a],[json,data,id]);}}this[C6g](L_s,action,modifier,json[e30],store);}else if(action === x$0){var l3N=a4t;l3N+=N96;var B0l=r$r8n.W1t;B0l+=z4k;B0l+=V7o;var w_4=y_P;w_4+=Q$$;w_4+=j$W;var h1t=c81;h1t+=Q1J;h1t+=v1D;var R8j=r$r8n.b9I;R8j+=F3e;var B46=c7_;B46+=E3B;var u4m=y_P;u4m+=T8F;this[u4m](B46,action,modifier,submitParamsLocal,json,store);this[X41](e5C,[json,this[R8j]()]);this[e7b](J3x,modifier,fields,store);this[X41]([h1t,P4Z],[json,this[J_x]()]);this[w_4](B0l,action,modifier,json[l3N],store);}if(editCount === this[r7N][i34]){var A0Y=I4P;A0Y+=O6v;A0Y+=X0A;A0Y+=W$t;var j1m=M5Y;j1m+=W$t;var q$S=Q1J;q$S+=t2p;q$S+=e7l;var sAction=this[r7N][Z23];this[r7N][Z23]=J1q;if(opts[q$S] === j1m && (hide === undefined || hide)){this[f5_](json[q7Q]?w6a:R3P,sAction);}else if(typeof opts[A0Y] === r8B){opts[s88](this);}}if(successCallback){successCallback[w7u](that,json);}this[X41](s32,[json,setData,action]);}this[L2$](R3P);this[X41](G_R,[json,setData,action]);}function _submitError(xhr,err,thrown,errorCallback,submitParams,action){var B28='submitError';var T2v="ev";var u_D='postSubmit';var i7O="system";var D0b=W$t;D0b+=s79;D0b+=s79;D0b+=M3v;var k9R=e9K;k9R+=s79;k9R+=M3v;var x7x=e1b;x7x+=T2v;x7x+=W$t;x7x+=v$5;this[x7x](u_D,[J1q,submitParams,action,xhr]);this[k9R](this[C6W][D0b][i7O]);this[j33](R3P);if(errorCallback){errorCallback[w7u](this,xhr,err,thrown);}this[X41]([B28,G_R],[xhr,err,thrown,submitParams]);}function _tidy(fn){var u0d="ures";var A0f="Feat";var p5Z="ngs";var v$I="setti";var E89=Y7q;E89+=I9B;E89+=W$t;var _this=this;var dt=this[r7N][Y5V]?new DataTable$4[J_A](this[r7N][E89]):J1q;var ssp=R3P;if(dt){var j_j=Q1J;j_j+=A0f;j_j+=u0d;var m68=v$I;m68+=p5Z;ssp=dt[m68]()[k70][j_j][U6m];}if(this[r7N][F$W]){this[W_z](G_R,function(){L7h.q_G();if(ssp){var I92=r$r8n[625824];I92+=s79;I92+=r$r8n[134240];I92+=S6a;dt[W_z](I92,fn);}else {setTimeout(function(){L7h.q_G();fn();},O6s);}});return w6a;}else if(this[p14]() === O6W || this[p14]() === V0N){var f27=J0d;f27+=W1j;f27+=s79;var h2s=Q1J;h2s+=y$F;h2s+=W$t;this[h2s](W1C,function(){L7h.g_4();var q$8="submitCom";if(!_this[r7N][F$W]){setTimeout(function(){L7h.g_4();if(_this[r7N]){fn();}},O6s);}else {var t4I=q$8;t4I+=R3w;t4I+=W$t;_this[W_z](t4I,function(e,json){var R0i="raw";L7h.g_4();if(ssp && json){var g9D=r$r8n[625824];g9D+=R0i;var W8g=Q1J;W8g+=y$F;W8g+=W$t;dt[W8g](g9D,fn);}else {setTimeout(function(){if(_this[r7N]){fn();}},O6s);}});}})[f27]();return w6a;}return R3P;}function _weakInArray(name,arr){L7h.g_4();for(var i=k70,ien=arr[T1W];i < ien;i++){if(name == arr[i]){return i;}}return -X$4;}var fieldType={create:function(){},disable:function(){},enable:function(){},get:function(){},set:function(){}};var DataTable$3=$[C3Z][N2S];function _buttonText(conf,textIn){var J_D="e fi";var I7h="hoos";var w_N="le...";var V98="C";var p7U='div.upload button';if(textIn === J1q || textIn === undefined){var u2o=V98;u2o+=I7h;u2o+=J_D;u2o+=w_N;var V3u=x2B;V3u+=S9c;textIn=conf[V3u] || u2o;}conf[Y3q][F5m](p7U)[V4c](textIn);}function _commonUpload(editor,conf,dropCallback,multiple){var v7D='></input>';var O9V="put[type=";var A9t="text";var g9I='over';var W5T='dragover';var i2G="p span";var Q2e='dragleave dragexit';var Q7V="_enab";var g06="dragDrop";var C8Y='<input type="file" ';var T1E='<div class="eu_table">';var e3U='input[type=file]';var O$Z="=\"editor_upload\">";var F$f='<div class="drop"><span></span></div>';var e6t='<div class="cell clearValue">';var R5C="file]";var r8b='Drag and drop a file here to upload';var o8T='multiple';var a4B='div.drop';var P4$="onInternal";var u7H="<div class";var V84="div.dro";var B0f='noDrop';var I$T="iv class=\"rendered\"></div>";var g8n="cla";var M0n="ss=\"cell upload";var k7Y="class=\"row";var D_z="earValue butt";var H0w="eRead";var n2t="div.cl";var y3H='<div class="cell">';var B2D="<div clas";var o2N='<div class="cell limitHide">';var v1$=" limitHide\">";var Q9l='<button class="';var R4J="dragDropText";var I$q="s=\"r";var D5E='"></button>';var j44="ow second\">";var o1f=Q1J;o1f+=y$F;var N$8=f6B;N$8+=O9V;N$8+=R5C;var S9i=r$r8n.W1t;S9i+=g4R;S9i+=r$r8n.b9I;S9i+=X$g;var G1v=Q1J;G1v+=y$F;var K3C=n2t;K3C+=D_z;K3C+=Q5i;var W87=Y_B;W87+=T2d;W87+=H0w;W87+=e9K;var s0e=n8d;s0e+=B4r;var l6W=Q7V;l6W+=g4R;l6W+=W$t;l6W+=r$r8n[625824];var N6L=s_0;N6L+=I$T;var K22=u7e;K22+=S8g;K22+=H4V;var F2W=B2D;F2W+=I$q;F2W+=j44;var a0M=u7e;a0M+=S8g;a0M+=w99;a0M+=b1l;var d4w=u7e;d4w+=o$I;d4w+=J$7;d4w+=L9i;var J2u=j6b;J2u+=G1m;var i9A=y0c;i9A+=g8n;i9A+=M0n;i9A+=v1$;var J9E=y0c;J9E+=k7Y;J9E+=n0p;var Y3x=u7H;Y3x+=O$Z;var P96=M4J;P96+=Y7q;P96+=Y7q;P96+=P4$;var F17=T7i;F17+=p26;F17+=C6b;if(multiple === void k70){multiple=R3P;}var btnClass=editor[F17][N1H][P96];var container=$(Y3x + T1E + J9E + i9A + Q9l + btnClass + D5E + C8Y + (multiple?o8T:Y5Y) + v7D + J2u + e6t + Q9l + btnClass + D5E + d4w + a0M + F2W + o2N + F$f + K22 + y3H + N6L + U4J + U4J + U4J + U4J);conf[Y3q]=container;conf[l6W]=w6a;if(conf[H_D]){var A7X=r$r8n.b9I;A7X+=r$r8n[625824];var Y6N=r$r8n[214853];Y6N+=f6B;Y6N+=r$r8n[625824];container[Y6N](e3U)[J2w](A7X,Editor[k7V](conf[H_D]));}if(conf[s0e]){var e2b=r$r8n[134240];e2b+=Y7q;e2b+=Y7q;e2b+=s79;var L_J=r$r8n[214853];L_J+=r$r8n.b9I;L_J+=y$F;L_J+=r$r8n[625824];container[L_J](e3U)[e2b](conf[J2w]);}_buttonText(conf);if(window[W87] && conf[g06] !== R3P){var m_z=Q1J;m_z+=y$F;var P0h=Q1J;P0h+=y$F;var l2Q=r$r8n[625824];l2Q+=s79;l2Q+=Q1J;l2Q+=O6v;var Z4D=Q1J;Z4D+=y$F;var Y7c=V84;Y7c+=i2G;container[F5m](Y7c)[A9t](conf[R4J] || r8b);var dragDrop_1=container[F5m](a4B);dragDrop_1[Z4D](l2Q,function(e){var q6Z="dataTransfer";var n6M="originalEvent";if(conf[t9M]){Editor[x2B](editor,conf,e[n6M][q6Z][j_m],_buttonText,dropCallback);dragDrop_1[a3l](g9I);}return R3P;})[P0h](Q2e,function(e){var p15="enabled";var w98=e1b;w98+=p15;if(conf[w98]){dragDrop_1[a3l](g9I);}return R3P;})[m_z](W5T,function(e){var T33="ddClass";L7h.g_4();if(conf[t9M]){var z1i=r$r8n[134240];z1i+=T33;dragDrop_1[z1i](g9I);}return R3P;});editor[Q5i](B2S,function(){var S0R="dragover.DTE_Up";var y6V="load dr";var M9X="op.DTE_Upload";var U2c=S0R;U2c+=y6V;U2c+=M9X;var Q3r=J0d;Q3r+=M5v;Q3r+=W2w;$(Q3r)[Q5i](U2c,function(e){return R3P;});})[Q5i](W1C,function(){var O7v="dragover.DTE_Upload drop.DTE_Up";var w4y=O7v;w4y+=P7O;var b2t=Q1J;b2t+=r$r8n[214853];b2t+=r$r8n[214853];var Y89=G$o;Y89+=c1W;$(Y89)[b2t](w4y);});}else {container[R0K](B0f);container[W2m](container[F5m](T7l));}container[F5m](K3C)[G1v](S9i,function(e){var F7y="efault";var h8I="preventD";var j1k=h8I;j1k+=F7y;e[j1k]();if(conf[t9M]){upload[F9y][w7u](editor,conf,Y5Y);}});container[F5m](N$8)[o1f](G9q,function(){L7h.g_4();Editor[x2B](editor,conf,this[j_m],_buttonText,function(ids,error){var F0P="pe=file]";var d6e="input[ty";var R5s=m23;R5s+=u$n;R5s+=W$t;var q3A=d6e;q3A+=F0P;var l9h=B74;l9h+=r$r8n[625824];if(!error){dropCallback[w7u](editor,ids);}container[l9h](q3A)[k70][R5s]=Y5Y;});});return container;}function _triggerChange(input){setTimeout(function(){var d35='change';L7h.q_G();input[i1P](d35,{editor:w6a,editorSet:w6a});},k70);}var baseFieldType=$[Y7F](w6a,{},fieldType,{canReturnSubmit:function(conf,node){return w6a;},disable:function(conf){var l9a="isable";var Q2n=r$r8n[625824];Q2n+=l9a;Q2n+=r$r8n[625824];var A6E=e1b;A6E+=r$r8n.b9I;A6E+=v9N;conf[A6E][I4L](Q2n,w6a);},enable:function(conf){conf[Y3q][I4L](G7x,R3P);},get:function(conf){L7h.q_G();return conf[Y3q][m23]();},set:function(conf,val){var f2s=u_S;f2s+=Y4O;f2s+=Y7q;var s8S=E9Q;s8S+=r$r8n[134240];s8S+=g4R;conf[Y3q][s8S](val);_triggerChange(conf[f2s]);}});var hidden={create:function(conf){var W3S=m23;W3S+=T_q;var n_e=b9q;n_e+=s10;n_e+=u$n;L7h.q_G();n_e+=H7A;conf[Y3q]=$(n_e);conf[k0j]=conf[W3S];return J1q;},get:function(conf){return conf[k0j];},set:function(conf,val){var x2Z=K7$;x2Z+=u$n;x2Z+=Y7q;var i09=e1b;i09+=E9Q;i09+=r$r8n[134240];i09+=g4R;var oldVal=conf[k0j];conf[i09]=val;conf[x2Z][m23](val);if(oldVal !== val){_triggerChange(conf[Y3q]);}}};var readonly=$[U_q](w6a,{},baseFieldType,{create:function(conf){var I60="feI";var D8S='<input/>';var J5Q=e1b;J5Q+=f6B;J5Q+=Z3F;J5Q+=Y7q;var P20=r$r8n[134240];P20+=Y7q;P20+=Y7q;P20+=s79;var F1s=Y7q;F1s+=W$t;F1s+=u8s;F1s+=Y7q;var C0w=U0T;C0w+=W2w;var H0B=r7N;H0B+=r$r8n[134240];H0B+=I60;H0B+=r$r8n[625824];var c$x=e1b;c$x+=S5U;c$x+=Y7q;conf[c$x]=$(D8S)[J2w]($[e$$]({id:Editor[H0B](conf[H_D]),readonly:C0w,type:F1s},conf[P20] || ({})));return conf[J5Q][k70];}});var text=$[T6g](w6a,{},baseFieldType,{create:function(conf){var A8a="<inpu";var o0R="feId";var z8u=u_S;z8u+=Y4O;z8u+=Y7q;var h6I=O9W;h6I+=s79;var C2_=F4_;C2_+=Y$i;var s2V=i9h;s2V+=o0R;var M0A=A8a;M0A+=H7A;var h4K=e1b;h4K+=r$r8n.b9I;h4K+=s10;h4K+=V5j;conf[h4K]=$(M0A)[J2w]($[e$$]({id:Editor[s2V](conf[H_D]),type:C2_},conf[h6I] || ({})));return conf[z8u][k70];}});var password=$[K0D](w6a,{},baseFieldType,{create:function(conf){var e8X='password';var G6S="/>";var n0l="<inp";var P7D=e1b;P7D+=N_y;P7D+=u$n;P7D+=Y7q;var v1i=O9W;v1i+=s79;L7h.q_G();var P3M=R9N;P3M+=W$t;P3M+=B50;P3M+=r$r8n[625824];var R6a=r$r8n[134240];R6a+=Y7q;R6a+=Y7q;R6a+=s79;var a5h=n0l;a5h+=u$n;a5h+=Y7q;a5h+=G6S;conf[Y3q]=$(a5h)[R6a]($[e$$]({id:Editor[P3M](conf[H_D]),type:e8X},conf[v1i] || ({})));return conf[P7D][k70];}});var textarea=$[g0c](w6a,{},baseFieldType,{canReturnSubmit:function(conf,node){L7h.g_4();return R3P;},create:function(conf){var b$1='<textarea></textarea>';var f7D=q$e;f7D+=O6v;f7D+=u$n;f7D+=Y7q;var k6Q=r$r8n.b9I;k6Q+=r$r8n[625824];var C_N=R9N;C_N+=W$t;C_N+=c3T;var Q4L=r$r8n[134240];Q4L+=P4Y;Q4L+=s79;var O8h=K7$;O8h+=V5j;conf[O8h]=$(b$1)[Q4L]($[e$$]({id:Editor[C_N](conf[k6Q])},conf[J2w] || ({})));return conf[f7D][k70];}});var select=$[e$$](w6a,{},baseFieldType,{_addOptions:function(conf,opts,append){var e9e="erDisab";var E4F="placeholderDisabled";var Z8R="placehold";var k68="placeholderValue";var o3N="idden";var q_k="disab";var F3R="airs";var h87=f3S;h87+=I6H;h87+=Q5i;h87+=r7N;var Q9N=e1b;Q9N+=f6B;Q9N+=E3h;if(append === void k70){append=R3P;}var elOpts=conf[Q9N][k70][h87];var countOffset=k70;if(!append){var m1u=Y8h;m1u+=v0Z;elOpts[m1u]=k70;if(conf[F7x] !== undefined){var Z4j=j32;Z4j+=Q1J;Z4j+=s79;Z4j+=k0j;var B1k=q_k;B1k+=A8W;B1k+=r$r8n[625824];var F$J=v0Z;F$J+=o3N;var h2r=Z8R;h2r+=e9e;h2r+=C8N;var j5O=Z8R;j5O+=e9K;var placeholderValue=conf[k68] !== undefined?conf[k68]:Y5Y;countOffset+=X$4;elOpts[k70]=new Option(conf[j5O],placeholderValue);var disabled=conf[h2r] !== undefined?conf[E4F]:w6a;elOpts[k70][F$J]=disabled;elOpts[k70][B1k]=disabled;elOpts[k70][Z4j]=placeholderValue;}}else {countOffset=elOpts[T1W];}if(opts){var X58=O6v;X58+=F3R;Editor[X58](opts,conf[v6o],function(val,label,i,attr){var S$6="or_v";var I$0=j32;I$0+=S$6;I$0+=r$r8n[134240];I$0+=g4R;var option=new Option(label,val);option[I$0]=val;if(attr){var D9o=r$r8n[134240];D9o+=P4Y;D9o+=s79;$(option)[D9o](attr);}L7h.g_4();elOpts[i + countOffset]=option;});}},create:function(conf){var L0S='<select></select>';var O5F="e.dt";var U0x="O";var C3y=e1b;C3y+=S5s;var Y0a=Y6O;Y0a+=U0x;Y0a+=O6v;Y0a+=e6I;var O26=N_k;O26+=O5F;O26+=W$t;var Z5S=r$r8n[134240];Z5S+=Y7q;Z5S+=Y7q;Z5S+=s79;var Y3G=R9N;Y3G+=W$t;Y3G+=c3T;var x2X=W$t;x2X+=K2V;var P1A=r$r8n[134240];P1A+=A4Y;var s_p=e1b;s_p+=r$r8n.b9I;s_p+=s10;s_p+=V5j;conf[s_p]=$(L0S)[P1A]($[x2X]({id:Editor[Y3G](conf[H_D]),multiple:conf[Q40] === w6a},conf[Z5S] || ({})))[Q5i](O26,function(e,d){var X6t="lastSet";if(!d || !d[F5G]){var H35=T_8;H35+=Y7q;var M7i=e1b;M7i+=X6t;conf[M7i]=select[H35](conf);}});select[i6x](conf,conf[E2H] || conf[Y0a]);return conf[C3y][k70];},destroy:function(conf){var y8K='change.dte';var S8F="_inpu";var B3G=Q1J;L7h.g_4();B3G+=H5e;var Y7Y=S8F;Y7Y+=Y7q;conf[Y7Y][B3G](y8K);},get:function(conf){var j37="ple";var b7Z='option:selected';var s4m=g4R;s4m+=s97;s4m+=P8O;var R0o=s1H;R0o+=j37;var X4T=B74;X4T+=r$r8n[625824];var val=conf[Y3q][X4T](b7Z)[F98](function(){L7h.g_4();return this[e1X];})[j9V]();if(conf[R0o]){var N$6=q70;N$6+=y$F;var y4I=x89;y4I+=q2_;return conf[y4I]?val[N$6](conf[g32]):val;}L7h.q_G();return val[s4m]?val[k70]:J1q;},set:function(conf,val,localUpdate){var R$F="ltipl";var o0j="separa";var P1Q="plit";var d0o="optio";var Y8t="cted";var C6x=x3D;C6x+=I$y;C6x+=A8e;C6x+=W$t;var e0D=W$t;e0D+=r$r8n[134240];e0D+=r$r8n.W1t;e0D+=v0Z;var n17=d0o;n17+=y$F;L7h.g_4();var Z1v=i2k;Z1v+=y$F;Z1v+=r$r8n[625824];var R2f=r6H;R2f+=r$r8n[211051];var L_T=A8W;L_T+=y$F;L_T+=O32;L_T+=v0Z;var N91=G01;N91+=i7a;var r0i=q6d;r0i+=u$n;r0i+=R$F;r0i+=W$t;if(!localUpdate){conf[l_o]=val;}if(conf[r0i] && conf[g32] && !Array[N91](val)){var H4K=o0j;H4K+=Y7q;H4K+=M3v;var C83=r7N;C83+=P1Q;var y73=Y5i;y73+=k10;val=typeof val === y73?val[C83](conf[H4K]):[];}else if(!Array[R2m](val)){val=[val];}var i;var len=val[L_T];var found;var allFound=R3P;var options=conf[Y3q][F5m](R2f);conf[Y3q][Z1v](n17)[e0D](function(){var A68="lected";var A2G=c0H;A2G+=A68;found=R3P;for(i=k70;i < len;i++){var b7V=I2o;b7V+=q_F;if(this[b7V] == val[i]){found=w6a;allFound=w6a;break;}}this[A2G]=found;});if(conf[F7x] && !allFound && !conf[C6x] && options[T1W]){var R1R=B6R;R1R+=Y8t;options[k70][R1R]=w6a;}if(!localUpdate){var o0u=e1b;o0u+=S5s;_triggerChange(conf[o0u]);}return allFound;},update:function(conf,options,append){select[i6x](conf,options,append);var lastSet=conf[l_o];if(lastSet !== undefined){var M38=r7N;M38+=W$t;M38+=Y7q;select[M38](conf,lastSet,w6a);}L7h.g_4();_triggerChange(conf[Y3q]);}});var checkbox=$[e$$](w6a,{},baseFieldType,{_addOptions:function(conf,opts,append){if(append === void k70){append=R3P;}L7h.q_G();var jqInput=conf[Y3q];var offset=k70;if(!append){var B0y=t9j;B0y+=q3Y;jqInput[B0y]();}else {var W5q=u9F;W5q+=P8O;offset=$(G9q,jqInput)[W5q];}if(opts){var c7n=O6v;c7n+=r$r8n[134240];c7n+=Y0s;c7n+=r7N;Editor[c7n](opts,conf[v6o],function(val,label,i,attr){var k0C='<label for="';var p_C='</label>';var W$M="\" type=\"";var w9Z="checkbox\" />";L7h.g_4();var f$b="safe";var n2q="put id=\"";var g1H='input:last';var u9J=I2o;u9J+=q_F;var G1X=r$r8n[134240];G1X+=Y7q;G1X+=B4r;var K0n=j6b;K0n+=J$7;K0n+=L9i;var j8U=k7g;j8U+=b1l;var m1X=f$b;m1X+=B50;m1X+=r$r8n[625824];var s6V=W$M;s6V+=w9Z;var p6f=b9q;p6f+=y$F;p6f+=n2q;var q9g=u7e;q9g+=J$7;q9g+=E9Q;q9g+=b1l;var F9K=I_z;F9K+=X27;jqInput[F9K](q9g + p6f + Editor[k7V](conf[H_D]) + O9R + (i + offset) + s6V + k0C + Editor[m1X](conf[H_D]) + O9R + (i + offset) + j8U + label + p_C + K0n);$(g1H,jqInput)[G1X](l44,val)[k70][u9J]=val;if(attr){$(g1H,jqInput)[J2w](attr);}});}},create:function(conf){var P5L='<div></div>';var f1y="ipO";var J5s=f1y;J5s+=L7P;var W2e=K7$;W2e+=V5j;conf[W2e]=$(P5L);L7h.q_G();checkbox[i6x](conf,conf[E2H] || conf[J5s]);return conf[Y3q][k70];},disable:function(conf){var r_8=c7_;r_8+=Q1J;r_8+=O6v;var x8c=q$e;x8c+=Z3F;x8c+=Y7q;conf[x8c][F5m](G9q)[r_8](G7x,w6a);},enable:function(conf){var s2n=r$r8n[625824];s2n+=b6J;s2n+=M2S;s2n+=C8N;var C6D=O6v;C6D+=s79;C6D+=Q1J;C6D+=O6v;var q5h=f6B;q5h+=Z3F;q5h+=Y7q;conf[Y3q][F5m](q5h)[C6D](s2n,R3P);},get:function(conf){var f1N="unselectedValue";var L$y="arator";var D_w=T0t;D_w+=Q1J;D_w+=r$r8n.b9I;D_w+=y$F;var A6K=E3H;A6K+=L$y;var out=[];var selected=conf[Y3q][F5m](s4K);if(selected[T1W]){selected[j0E](function(){L7h.g_4();var G1V="or_va";var P6B=I2o;P6B+=V7o;P6B+=G1V;P6B+=g4R;var P2n=Z3F;P2n+=P9U;out[P2n](this[P6B]);});}else if(conf[f1N] !== undefined){var K8j=O6v;K8j+=u$n;K8j+=r7N;K8j+=v0Z;out[K8j](conf[f1N]);}L7h.g_4();return conf[A6K] === undefined || conf[g32] === J1q?out:out[D_w](conf[g32]);},set:function(conf,val){var z3S="ator";var g2I='|';var m1Y=v0T;m1Y+=V7O;var q1z=r$r8n[214853];q1z+=r$r8n.b9I;q1z+=y$F;q1z+=r$r8n[625824];var x3H=e1b;x3H+=r$r8n.b9I;x3H+=v9N;var jqInputs=conf[x3H][q1z](G9q);if(!Array[R2m](val) && typeof val === k38){var b6R=x89;b6R+=s79;b6R+=z3S;var Q2b=w4B;Q2b+=X5E;Q2b+=Y7q;val=val[Q2b](conf[b6R] || g2I);}else if(!Array[m1Y](val)){val=[val];}var i;var len=val[T1W];var found;jqInputs[j0E](function(){var G1N="check";var D4k="tor";var y_y=G1N;y_y+=p5T;L7h.q_G();found=R3P;for(i=k70;i < len;i++){var Y68=H3k;Y68+=D4k;Y68+=e1b;Y68+=m23;if(this[Y68] == val[i]){found=w6a;break;}}this[y_y]=found;});_triggerChange(jqInputs);},update:function(conf,options,append){var l9Y="ddOptio";var V46=r7N;V46+=W$t;V46+=Y7q;var P19=j$H;P19+=l9Y;P19+=y$F;P19+=r7N;var currVal=checkbox[s_D](conf);checkbox[P19](conf,options,append);checkbox[V46](conf,currVal);}});var radio=$[e$$](w6a,{},baseFieldType,{_addOptions:function(conf,opts,append){L7h.q_G();var c$z=e1b;c$z+=f6B;c$z+=Z3F;c$z+=Y7q;if(append === void k70){append=R3P;}var jqInput=conf[c$z];var offset=k70;if(!append){var g4t=W$t;g4t+=q6d;g4t+=q3Y;jqInput[g4t]();}else {var g3L=r$r8n.b9I;g3L+=v9N;offset=$(g3L,jqInput)[T1W];}if(opts){var L3n=O6v;L3n+=E68;L3n+=s79;L3n+=r7N;Editor[L3n](opts,conf[v6o],function(val,label,i,attr){var A_7="l for=\"";var G$R="\" type=\"radio";var w3E="</label";var t07="eId";var P$h="\" name=\"";var Z8G='<input id="';var J2y='" />';var v0D="t:la";var n5p="af";var c8n="<l";var V1O="/di";var Q6q="ut:last";var Y$y=n8d;Y$y+=B4r;var G3o=N_y;G3o+=Q6q;var O$X=u7e;O$X+=V1O;O$X+=L9i;var u0t=w3E;u0t+=b1l;var K6N=k7g;K6N+=b1l;var v6O=r$r8n.b9I;v6O+=r$r8n[625824];var B9S=c8n;B9S+=M2S;B9S+=W$t;B9S+=A_7;var l5O=y$F;l5O+=r$r8n[134240];l5O+=q6d;l5O+=W$t;var z55=G$R;z55+=P$h;var o5I=r$r8n.b9I;o5I+=r$r8n[625824];var Z2M=r7N;Z2M+=n5p;Z2M+=t07;var j0s=o5b;j0s+=E9Q;j0s+=b1l;var I3S=I_z;I3S+=X27;jqInput[I3S](j0s + Z8G + Editor[Z2M](conf[o5I]) + O9R + (i + offset) + z55 + conf[l5O] + J2y + B9S + Editor[k7V](conf[v6O]) + O9R + (i + offset) + K6N + label + u0t + O$X);$(G3o,jqInput)[Y$y](l44,val)[k70][e1X]=val;if(attr){var E6F=n8d;E6F+=B4r;var y1j=N_y;y1j+=u$n;y1j+=v0D;y1j+=g2J;$(y1j,jqInput)[E6F](attr);}});}},create:function(conf){var N9C="pOp";var L2S="dO";var R1e="ptions";var r1c="v />";var R6T=f3S;R6T+=W$t;R6T+=y$F;var i$5=Q1J;i$5+=y$F;var E39=r$r8n.b9I;E39+=N9C;E39+=Y7q;E39+=r7N;var u$8=e1b;u$8+=I0p;u$8+=L2S;u$8+=R1e;var R1q=u7e;R1q+=r$r8n[625824];R1q+=r$r8n.b9I;R1q+=r1c;var q9k=u_S;q9k+=v9N;conf[q9k]=$(R1q);radio[u$8](conf,conf[E2H] || conf[E39]);this[i$5](R6T,function(){var p10=W$t;p10+=r$r8n[134240];p10+=r$r8n.W1t;p10+=v0Z;var w$D=S5U;w$D+=Y7q;var v52=r$r8n[214853];v52+=a5j;conf[Y3q][v52](w$D)[p10](function(){var X6a="reChecked";var Z0c=B0F;Z0c+=X6a;if(this[Z0c]){this[s3b]=w6a;}});});return conf[Y3q][k70];},disable:function(conf){var w32=c7_;w32+=Q1J;w32+=O6v;var w81=r$r8n[214853];w81+=a5j;conf[Y3q][w81](G9q)[w32](G7x,w6a);},enable:function(conf){var t5h="isabl";var v2Y=r$r8n[625824];v2Y+=t5h;v2Y+=W$t;L7h.q_G();v2Y+=r$r8n[625824];var U5H=r$r8n.b9I;U5H+=s10;U5H+=V5j;var L60=r$r8n[214853];L60+=a5j;conf[Y3q][L60](U5H)[I4L](v2Y,R3P);},get:function(conf){var A8G="unselectedVal";var Q1R="unselec";var I$P="tedValue";var a8r=Q1R;a8r+=I$P;var G2O=A8G;G2O+=T_q;var k_N=r$r8n[214853];k_N+=r$r8n.b9I;k_N+=y$F;k_N+=r$r8n[625824];var y$O=u_S;y$O+=y$F;y$O+=E3h;var el=conf[y$O][k_N](s4K);if(el[T1W]){return el[k70][e1X];}return conf[G2O] !== undefined?conf[a8r]:undefined;},set:function(conf,val){var N7Q=i2k;N7Q+=y$F;N7Q+=r$r8n[625824];var O2q=r$r8n.b9I;O2q+=y$F;L7h.g_4();O2q+=O6v;O2q+=V5j;var Q3p=r$r8n[214853];Q3p+=a5j;var o_A=u_S;o_A+=s10;o_A+=V5j;conf[o_A][Q3p](O2q)[j0E](function(){var n4A="Check";var h5Z="tor_val";var l_q="_preChecked";var i8B=J4v;i8B+=J$7;i8B+=h5Z;var J9q=B0F;J9q+=v60;J9q+=n4A;J9q+=p5T;this[J9q]=R3P;if(this[i8B] == val){var c3P=r$r8n.W1t;c3P+=j8c;c3P+=p5T;this[c3P]=w6a;this[l_q]=w6a;}else {this[s3b]=R3P;this[l_q]=R3P;}});_triggerChange(conf[Y3q][N7Q](s4K));},update:function(conf,options,append){var O_J="[";var S2A="filt";var R5p="e=\"";var P6m="eq";var m8U=r$r8n[134240];m8U+=A4Y;var g6N=O_J;g6N+=Y$O;g6N+=W1j;g6N+=R5p;var D3o=S2A;D3o+=W$t;D3o+=s79;var W2y=r7N;W2y+=W$t;W2y+=Y7q;var u7E=S5U;u7E+=Y7q;var o6u=r$r8n[214853];o6u+=r$r8n.b9I;o6u+=y$F;o6u+=r$r8n[625824];var j$U=P5K;j$U+=y$F;j$U+=r7N;var R0B=c2$;R0B+=W$t;R0B+=Y7q;var currVal=radio[R0B](conf);radio[j$U](conf,options,append);var inputs=conf[Y3q][o6u](u7E);radio[W2y](conf,inputs[D3o](g6N + currVal + q$Z)[T1W]?currVal:inputs[P6m](k70)[m8U](l44));}});var datetime=$[e$$](w6a,{},baseFieldType,{create:function(conf){var f$r="ic";var e6P="displayFormat";var E$q="momentLocale";var I4f='<input />';var h3b="ocale";var a67='DateTime library is required';var v1L="locale";var P8d="mentStr";var Y1A="yd";var f16="momentStrict";var R2O="yInp";var c2u="datetime";var X9z="omentL";var R3n="strict";var a1Q=e1b;a1Q+=r$r8n.b9I;a1Q+=s10;a1Q+=V5j;var S4d=r$r8n.W1t;S4d+=p4w;S4d+=r7N;S4d+=W$t;var S_q=S$D;S_q+=R2O;S_q+=V5j;var D9y=f5_;D9y+=D9u;var Y7j=r$r8n.b9I;Y7j+=R9L;var f72=T1l;f72+=s79;f72+=q6d;f72+=n8d;var O1E=l9k;O1E+=W$t;O1E+=h8C;var q_b=A2o;q_b+=P8d;q_b+=f$r;q_b+=Y7q;var H7J=Q1J;H7J+=z1$;H7J+=r7N;var n6I=c85;n6I+=F4_;n6I+=u8Q;var v6T=Y7q;v6T+=L91;v6T+=Y7q;var g$7=L91;g$7+=m4d;g$7+=r$r8n[625824];var u0P=n8d;u0P+=Y7q;u0P+=s79;var p0V=e1b;p0V+=r$r8n.b9I;p0V+=s10;p0V+=V5j;conf[p0V]=$(I4f)[u0P]($[g$7](w6a,{id:Editor[k7V](conf[H_D]),type:v6T},conf[J2w]));if(!DataTable$3[n6I]){Editor[f8w](a67,O1A);}if(conf[E$q] && !conf[H7J][v1L]){var x5F=q6d;x5F+=X9z;x5F+=h3b;var B8S=f3S;B8S+=Y7q;B8S+=r7N;conf[B8S][v1L]=conf[x5F];}if(conf[q_b] && !conf[P3I][R3n]){conf[P3I][R3n]=conf[f16];}conf[Z_V]=new DataTable$3[P8P](conf[Y3q],$[O1E]({format:conf[e6P] || conf[f72],i18n:this[Y7j][c2u]},conf[P3I]));conf[D9y]=function(){var K_e="ker";var Q$m=e1b;Q$m+=O6v;Q$m+=f$r;Q$m+=K_e;conf[Q$m][I55]();};if(conf[S_q] === R3P){var h$E=S$D;h$E+=Y1A;h$E+=x75;var P74=K7$;P74+=V5j;conf[P74][Q5i](h$E,function(e){var T02="eventDefault";var y0H=c7_;y0H+=T02;e[y0H]();});}this[Q5i](S4d,conf[k78]);return conf[a1Q][k70];},destroy:function(conf){var s77="oy";var g8N=Z7B;g8N+=g2J;g8N+=s79;g8N+=s77;var r1f=Q1J;r1f+=r$r8n[214853];r1f+=r$r8n[214853];var w7T=T7i;w7T+=S3Y;var T$6=Q1J;T$6+=r$r8n[214853];T$6+=r$r8n[214853];this[T$6](w7T,conf[k78]);conf[Y3q][r1f](s7K);conf[Z_V][g8N]();},errorMessage:function(conf,msg){var b0g="errorMsg";var U6G="picke";var v_r=e1b;v_r+=U6G;v_r+=s79;conf[v_r][b0g](msg);},get:function(conf){var h$N="ireF";var N3e="rmat";var y78="wireFo";var L03=E9Q;L03+=r$r8n[134240];L03+=g4R;var D7p=S6a;D7p+=h$N;D7p+=M3v;D7p+=m56;var U9S=y78;U9S+=N3e;return conf[U9S]?conf[Z_V][q_o](conf[D7p]):conf[Y3q][L03]();},maxDate:function(conf,max){L7h.q_G();var E$y="max";conf[Z_V][E$y](max);},minDate:function(conf,min){var p8M="min";var o2C="ick";L7h.g_4();var D96=B0F;D96+=o2C;D96+=W$t;D96+=s79;conf[D96][p8M](min);},owns:function(conf,node){var r6P="owns";var A8o="icke";var y2O=B0F;y2O+=A8o;y2O+=s79;return conf[y2O][r6P](node);},set:function(conf,val){var M$A="xOf";var O6w="cker";var Z_1="ireFor";var r$N="wireFormat";var j$Z=e1b;j$Z+=r$r8n.b9I;j$Z+=v9N;var M0p=j4W;M0p+=j4W;var b5H=x4s;b5H+=M$A;var k61=Y5i;k61+=k10;if(typeof val === k61 && val && val[b5H](M0p) !== k70 && conf[r$N]){var S2_=S6a;S2_+=Z_1;S2_+=m56;conf[Z_V][q_o](conf[S2_],val);}else {var g$e=B0F;g$e+=r$r8n.b9I;g$e+=O6w;conf[g$e][m23](val);}L7h.g_4();_triggerChange(conf[j$Z]);}});var upload=$[r5J](w6a,{},baseFieldType,{canReturnSubmit:function(conf,node){return R3P;},create:function(conf){var editor=this;L7h.g_4();var container=_commonUpload(editor,conf,function(val){var l$q='postUpload';var V7w=y$F;L7h.q_G();V7w+=r$r8n[303735];V7w+=W$t;upload[F9y][w7u](editor,conf,val[k70]);editor[X41](l$q,[conf[V7w],val[k70]]);});return container;},disable:function(conf){var X7G="_ena";var P1X=X7G;P1X+=s5g;var Q4X=c7_;Q4X+=f3S;var P76=S5U;P76+=Y7q;var R0D=r$r8n[214853];R0D+=a5j;conf[Y3q][R0D](P76)[Q4X](G7x,w6a);conf[P1X]=R3P;},enable:function(conf){var H8f="_enable";var t_E=H8f;t_E+=r$r8n[625824];var N2f=r$r8n.b9I;N2f+=y$F;N2f+=E3h;var d4O=i2k;d4O+=y$F;d4O+=r$r8n[625824];var D0I=e1b;D0I+=S5s;conf[D0I][d4O](N2f)[I4L](G7x,R3P);conf[t_E]=w6a;},get:function(conf){L7h.g_4();return conf[k0j];},set:function(conf,val){var m0p="clea";var f6x="Clear";var u5Y="clearText";var K1H=" file";var f38="<s";var w2U='div.clearValue button';var u9R=".rendered";var t_I="Tex";var R_Y="noFile";var n9O="pan>";var x4K='noClear';var g8G="rText";var a38=e1b;a38+=E9Q;a38+=r$r8n[134240];a38+=g4R;var f$a=p$G;f$a+=s$p;f$a+=W$t;f$a+=O2j;var R8s=r$r8n[214853];R8s+=r$r8n.b9I;R8s+=y$F;R8s+=r$r8n[625824];var j1K=m0p;j1K+=g8G;var U3b=r$r8n[625824];U3b+=p7S;U3b+=e6a;conf[k0j]=val;conf[Y3q][m23](Y5Y);var container=conf[Y3q];if(conf[U3b]){var q80=m1e;q80+=u9R;var Q2D=r$r8n[214853];Q2D+=r$r8n.b9I;Q2D+=h8C;var rendered=container[Q2D](q80);if(conf[k0j]){var M2D=e1b;M2D+=E9Q;M2D+=C3Q;var s7j=v0Z;s7j+=Y7q;s7j+=k7R;rendered[s7j](conf[p14](conf[M2D]));}else {var E4j=W3_;E4j+=Q1J;E4j+=K1H;var b07=R_Y;b07+=t_I;b07+=Y7q;var l3j=f38;l3j+=n9O;var x8z=I_z;x8z+=W$t;x8z+=h8C;var c6O=t9j;c6O+=z1$;c6O+=W2w;rendered[c6O]()[x8z](l3j + (conf[b07] || E4j) + e_m);}}var button=container[F5m](w2U);if(val && conf[j1K]){button[V4c](conf[u5Y]);container[a3l](x4K);}else {var w3d=y$F;w3d+=Q1J;w3d+=f6x;container[R0K](w3d);}conf[Y3q][R8s](G9q)[f$a](w51,[conf[a38]]);}});var uploadMany=$[B53](w6a,{},baseFieldType,{_showHide:function(conf){var W5C="_container";var f9U="limit";var H7z="lock";var w9e="_limitLeft";var C4u='div.limitHide';var w9s=g4R;w9s+=T1d;w9s+=v0Z;var O_r=W7r;O_r+=C3Q;var v7u=J0d;L7h.q_G();v7u+=H7z;var M5h=u4w;M5h+=W$t;var Q$7=A1B;Q$7+=c2$;Q$7+=Y7q;Q$7+=v0Z;if(!conf[f9U]){return;}conf[W5C][F5m](C4u)[o8Q](P$o,conf[k0j][Q$7] >= conf[f9U]?M5h:v7u);conf[w9e]=conf[f9U] - conf[O_r][w9s];},canReturnSubmit:function(conf,node){return R3P;},create:function(conf){var P3A="_conta";var d8p="button.";var n$G='multi';var O7C=P3A;O7C+=f6B;L7h.g_4();O7C+=e9K;var N0$=d8p;N0$+=L3A;var z5S=d40;z5S+=X$g;var editor=this;var container=_commonUpload(editor,conf,function(val){var H7R="even";var M54="concat";var k7M="stUplo";var B84=e1b;B84+=m23;var J3q=h51;J3q+=W$t;var P6r=O6v;P6r+=Q1J;P6r+=k7M;P6r+=I0p;var T8S=e1b;T8S+=H7R;T8S+=Y7q;var k4$=e1b;k4$+=E9Q;k4$+=r$r8n[134240];k4$+=g4R;var k62=r$r8n.W1t;L7h.q_G();k62+=r$r8n[134240];k62+=g4R;k62+=g4R;var P1R=r7N;P1R+=W$t;P1R+=Y7q;var G5U=W7r;G5U+=C3Q;var h9m=e1b;h9m+=Y$O;h9m+=g4R;conf[h9m]=conf[G5U][M54](val);uploadMany[P1R][k62](editor,conf,conf[k4$]);editor[T8S](P6r,[conf[J3q],conf[B84]]);},w6a);container[R0K](n$G)[Q5i](z5S,N0$,function(e){L7h.g_4();var s7L="stopPropagation";var j5e="dx";e[s7L]();if(conf[t9M]){var B4P=e1b;B4P+=E9Q;B4P+=C3Q;var N8B=r7N;N8B+=W$t;N8B+=Y7q;var N8q=r$r8n.b9I;N8q+=j5e;var idx=$(this)[q7Q](N8q);conf[k0j][B6G](idx,X$4);uploadMany[N8B][w7u](editor,conf,conf[B4P]);}});conf[O7C]=container;return container;},disable:function(conf){var D$b="_en";var m_0="disa";var t6x=D$b;t6x+=r$r8n[134240];t6x+=J0d;t6x+=C8N;var B6z=m_0;B6z+=X3U;B6z+=p5T;var I2J=O6v;I2J+=s79;I2J+=Q1J;I2J+=O6v;var k8j=f6B;k8j+=Z3F;k8j+=Y7q;conf[Y3q][F5m](k8j)[I2J](B6z,w6a);conf[t6x]=R3P;},enable:function(conf){var u54=S5U;u54+=Y7q;conf[Y3q][F5m](u54)[I4L](G7x,R3P);conf[t9M]=w6a;},get:function(conf){var q1c=e1b;q1c+=m23;return conf[q1c];},set:function(conf,val){var j9h="n>";var R0_="triggerHandler";var U6t="</u";var S_3="ileT";var m7H="<spa";var O1S="ul>";var H21="l>";var Q2Y="wHide";var V0f="noF";var A2u="Arra";var z9Z='Upload collections must have an array as a value';var r5F='No files';var P07=u_S;P07+=s10;P07+=u$n;P07+=Y7q;var Y1e=e1b;Y1e+=r7N;Y1e+=l_$;Y1e+=Q2Y;var g0P=V2G;g0P+=A8e;g0P+=N9P;var W2I=E9Q;W2I+=r$r8n[134240];W2I+=g4R;var n8y=W7r;n8y+=r$r8n[134240];n8y+=g4R;var r9d=b6J;r9d+=A2u;r9d+=W2w;if(!val){val=[];}if(!Array[r9d](val)){throw new Error(z9Z);}conf[n8y]=val;conf[Y3q][W2I](Y5Y);var that=this;var container=conf[Y3q];if(conf[g0P]){var X3u=g4R;X3u+=W$t;X3u+=F0a;var rendered=container[F5m](T7l)[F$1]();if(val[X3u]){var U5o=u7e;U5o+=O1S;U5o+=U6t;U5o+=H21;var list_1=$(U5o)[k2r](rendered);$[j0E](val,function(i,file){var Q8p='<li>';var D6M='">&times;</button>';var n0c=" remove\" data";var X16="-idx=\"";var d1t=" <button clas";var X3H='</li>';var x3I=V2G;x3I+=A8e;L7h.g_4();x3I+=N9P;var display=conf[x3I](file,i);if(display !== J1q){var r2L=n0c;r2L+=X16;var K39=r$r8n[214853];K39+=Q1J;K39+=v3W;var A3u=d1t;A3u+=z6$;var L$x=I_z;L$x+=X27;list_1[L$x](Q8p + display + A3u + that[b_M][K39][o89] + r2L + i + D6M + X3H);}});}else {var r2l=V0f;r2l+=S_3;r2l+=l9k;var i$Y=m7H;i$Y+=j9h;rendered[W2m](i$Y + (conf[r2l] || r5F) + e_m);}}uploadMany[Y1e](conf);conf[P07][F5m](G9q)[R0_](w51,[conf[k0j]]);}});var datatable=$[e$$](w6a,{},baseFieldType,{_addOptions:function(conf,options,append){var O03="ows";var s3p=r$r8n[134240];s3p+=S_o;var K32=s79;K32+=O03;var m0R=r$r8n[625824];m0R+=Y7q;if(append === void k70){append=R3P;}var dt=conf[m0R];if(!append){var l6T=j2m;l6T+=E4x;dt[l6T]();}dt[K32][s3p](options)[A0I]();},_jumpToFirst:function(conf,editor){var q9N='number';var e70="floor";var O2z="ppl";var Y$8="inf";var z7j=".dataTable";var o8m='applied';var h03="s_scrollBody";var u5x=A8W;u5x+=D$O;u5x+=v0Z;var u7Q=N7A;u7Q+=r$r8n[134240];u7Q+=M_8;u7Q+=s79;var z6L=Y7q;z6L+=I9B;z6L+=W$t;var M3x=r$r8n[625824];M3x+=w99;M3x+=z7j;M3x+=h03;var S$w=r$r8n[625824];S$w+=Y7q;var dt=conf[S$w];var idx=dt[D$E]({order:o8m,selected:w6a})[K1m]();var page=k70;if(typeof idx === q9N){var X4$=r$r8n[134240];X4$+=O2z;X4$+=r$r8n.b9I;X4$+=p5T;var C58=Y8h;C58+=v0Z;var k3M=Y$8;k3M+=Q1J;var M2v=O6v;M2v+=r$r8n[134240];M2v+=T_8;var pageLen=dt[M2v][k3M]()[C58];var pos=dt[c3F]({order:X4$})[z$2]()[N4I](idx);page=pageLen > k70?Math[e70](pos / pageLen):k70;}dt[V2y](page)[A0I](R3P);var container=$(M3x,dt[z6L]()[u7Q]());var scrollTo=function(){var N22="ied";var O2t=w9I;O2t+=O6v;O2t+=g4R;O2t+=N22;var Z8y=s79;Z8y+=Q1J;Z8y+=S6a;var node=dt[Z8y]({order:O2t,selected:w6a})[F_v]();if(node){var h8f=o38;h8f+=O6v;var p3z=v0Z;p3z+=B4E;p3z+=v0Z;p3z+=Y7q;var height=container[p3z]();var top_1=$(node)[A2g]()[h8f];if(top_1 > height - O6s){container[w73](top_1);}}};if(container[u5x]){var W_9=A8W;W_9+=F0a;var t7L=O6v;t7L+=E4x;t7L+=W$t;t7L+=Y7s;if(container[t7L](l8s)[W_9]){scrollTo();}else {editor[W_z](B2S,function(){scrollTo();});}}},create:function(conf){var s9a='buttons';var F0R="rsio";var a2B="elec";var m9T="itComplete";var E5K="foo";var A2J="earc";var W2_='search';var V55="eck";L7h.q_G();var O0I="tf";var N_C="user-s";var X88="ot>";var I5B='init.dt';var O96="nCh";var K3P='<tr>';var R9M="si";var X0E='label';var K5j='2';var K2b="tableClass";var R0t="config";var e5r="nfig";var J_b="oo";var I5c='<div class="DTE_Field_Type_datatable_info">';var Q7c='Label';var M0t="%";var a2p="<ta";var x7T='info';var m1Z="_addOpt";var c4N="e>";var I0X="0";var e9w=f3S;e9w+=I6H;e9w+=j9y;var r4r=m1Z;r4r+=O5K;var d2s=N_C;d2s+=a2B;d2s+=Y7q;var r0C=Q1J;r0C+=y$F;var A9O=Q1J;A9O+=y$F;var R9k=R9M;R9k+=S2H;R9k+=A8W;var E82=Q1J;E82+=r7N;var I45=Y_E;I45+=Y6O;I45+=A8W;var H1x=W3R;H1x+=k10;var d2D=l9X;d2D+=r$r8n.W1t;d2D+=v0Z;var l8z=e5B;l8z+=A2J;l8z+=v0Z;var W$1=i2k;W$1+=W9b;W$1+=Y7q;W$1+=O6v;var R5D=r$r8n.G6G;R5D+=I0X;R5D+=I0X;R5D+=M0t;var w04=r$r8n[134240];w04+=S_o;w04+=Y7W;w04+=p26;var H8x=i9x;H8x+=Y7q;H8x+=j9y;var n0Z=M4J;n0Z+=P4Y;n0Z+=j9y;var A88=K7Z;A88+=e5r;var O5E=v1D;O5E+=F0R;O5E+=O96;O5E+=V55;var a$z=u7e;a$z+=G1m;var x3q=a2p;x3q+=J0d;x3q+=g4R;x3q+=c4N;var _this=this;conf[v6o]=$[e$$]({label:X0E,value:l44},conf[v6o]);var table=$(x3q);var container=$(a$z)[W2m](table);var side=$(I5c);var layout=DataTable$3[O5E](K5j);if(conf[b7_]){var G$O=E5K;G$O+=u3q;var m2y=r$r8n[214853];m2y+=J_b;m2y+=u3q;var K_s=q6d;K_s+=r$r8n[134240];K_s+=O6v;var g9F=b6J;g9F+=E5o;g9F+=V7O;var I29=u7e;I29+=O0I;I29+=Q1J;I29+=X88;$(I29)[W2m](Array[g9F](conf[b7_])?$(K3P)[W2m]($[K_s](conf[m2y],function(str){var X4M="htm";var d2q=X4M;d2q+=g4R;var Q3e=u7e;Q3e+=Y7q;Q3e+=v0Z;Q3e+=b1l;L7h.q_G();return $(Q3e)[d2q](str);})):conf[G$O])[k2r](table);}var hasButtons=conf[A88] && conf[R0t][n0Z] && conf[R0t][H8x][T1W];var dt=table[w04](datatable[K2b])[K_K](R5D)[Q5i](I5B,function(e,settings){var V1W="-search";var P85="div.dt";var i8Q="pp";var V$f='div.dataTables_info';var p1w='div.dt-info';var B$1="-butto";var h8m='div.dataTables_filter';var p_c="iv.dt";var L$g="lect";var c1t=r$r8n[214853];c1t+=f6B;c1t+=r$r8n[625824];var S8r=s4Y;S8r+=h8C;var c8C=P85;c8C+=B$1;c8C+=t91;var G3J=r$r8n[134240];G3J+=O6v;G3J+=n9T;G3J+=r$r8n[625824];var E01=r$r8n[134240];E01+=i8Q;E01+=W$t;E01+=h8C;var m5s=r$r8n[625824];m5s+=p_c;m5s+=V1W;var a57=c0H;L7h.g_4();a57+=L$g;var p63=l1k;p63+=U4H;p63+=s79;var i9k=Y7q;i9k+=r$r8n[134240];i9k+=X3U;i9k+=W$t;var x2h=O46;x2h+=r$r8n.b9I;if(settings[F5C] !== table[k70]){return;}var api=new DataTable$3[x2h](settings);var containerNode=$(api[i9k](undefined)[p63]());DataTable$3[a57][t$h](api);side[W2m](containerNode[F5m](m5s))[E01](containerNode[F5m](h8m))[G3J](containerNode[F5m](c8C))[W2m](containerNode[F5m](p1w))[S8r](containerNode[c1t](V$f));})[c27]($[e$$]({buttons:[],columns:[{data:conf[v6o][h7b],title:Q7c}],deferRender:w6a,dom:layout?J1q:W$1,language:{paginate:{next:K6G,previous:F1i},search:Y5Y,searchPlaceholder:l8z},layout:layout?{top:hasButtons?[d2D,s9a,x7T]:[W2_,x7T],bottom:[H1x],bottomStart:J1q,bottomEnd:J1q,topStart:J1q,topEnd:J1q}:J1q,lengthChange:R3P,select:{style:conf[I45]?E82:R9k}},conf[R0t]));this[A9O](B2S,function(){var A6Z="search";var x2H="adj";var I78=x2H;I78+=u$n;I78+=r7N;I78+=Y7q;var Y4q=r$r8n.W1t;Y4q+=v8f;Y4q+=C0z;var v3o=c0H;L7h.q_G();v3o+=r$r8n[134240];v3o+=z5g;v3o+=v0Z;if(dt[v3o]()){dt[A6Z](Y5Y)[A0I]();}dt[Y4q][I78]();});dt[r0C](d2s,function(){var H6H="ntain";var m_K=K7Z;m_K+=H6H;L7h.q_G();m_K+=e9K;var D1Q=N96;D1Q+=J0d;D1Q+=g4R;D1Q+=W$t;_triggerChange($(conf[T7f][D1Q]()[m_K]()));});if(conf[F5G]){var X_S=y3N;X_S+=m9T;var v_O=W$t;v_O+=J$7;v_O+=Y7q;v_O+=M3v;conf[v_O][Y5V](dt);conf[F5G][Q5i](X_S,function(e,json,data,action){var k_f='refresh';var J2h="_jumpToFirst";var r$l="rea";var R3i=W$t;R3i+=O53;var y8z=r$r8n.W1t;y8z+=r$l;y8z+=Y7q;y8z+=W$t;if(action === y8z){var _loop_1=function(dp){var J_p=s79;L7h.q_G();J_p+=Q1J;J_p+=S6a;J_p+=r7N;dt[J_p](function(idx,d){return d === dp;})[m00]();};for(var _i=k70,_a=json[q7Q];_i < _a[T1W];_i++){var dp=_a[_i];_loop_1(dp);}}else if(action === R3i || action === J3x){_this[e7b](k_f);}datatable[J2h](conf,_this);});}conf[T7f]=dt;datatable[r4r](conf,conf[e9w] || []);return {input:container,side:side};},disable:function(conf){var f_f="tyl";var W1b='api';var W32=y$F;W32+=Q1J;W32+=U4H;var Y0b=J$7;Y0b+=w4B;Y0b+=e6a;var q91=r7N;q91+=f_f;q91+=W$t;var z0K=r$r8n[625824];z0K+=Y7q;conf[z0K][m00][q91](W1b);conf[T7f][r$L]()[K7Y]()[o8Q](Y0b,W32);},dt:function(conf){L7h.g_4();return conf[T7f];},enable:function(conf){var E5k="cs";var S13='os';var K6x='single';var W$X=X3U;W$X+=Q1J;W$X+=r$r8n.W1t;W$X+=l0E;var M44=E5k;M44+=r7N;var q5n=r$r8n[625824];q5n+=Y7q;var l8U=r7N;l8U+=N32;l8U+=g4R;l8U+=W$t;var w1A=r$r8n[625824];w1A+=Y7q;conf[w1A][m00][l8U](conf[Q40]?S13:K6x);conf[q5n][r$L]()[K7Y]()[M44](P$o,W$X);},get:function(conf){L7h.g_4();var z3e="toAr";var D6V="pluc";var I8g="ptionsPa";var B3H=q70;B3H+=y$F;var t2t=z3e;t2t+=s79;t2t+=r$r8n[134240];t2t+=W2w;var w5x=Q1J;w5x+=I8g;w5x+=Y0s;var T0B=D6V;T0B+=l0E;var g$a=s79;g$a+=Q1J;g$a+=S6a;g$a+=r7N;var U_d=r$r8n[625824];U_d+=Y7q;var rows=conf[U_d][g$a]({selected:w6a})[q7Q]()[T0B](conf[w5x][Z3p])[t2t]();return conf[g32] || !conf[Q40]?rows[B3H](conf[g32] || r4y):rows;},set:function(conf,val,localUpdate){var a3h="jum";var J7B="deselect";var n_J="elect";var U3Z="sA";var E_4="ontainer";L7h.g_4();var e3k="ToFirst";var l_5=e1b;l_5+=a3h;l_5+=O6v;l_5+=e3k;var B3D=r7N;B3D+=n_J;var h6F=r$r8n[625824];h6F+=Y7q;var n2I=r$r8n.b9I;n2I+=U3Z;n2I+=q1g;n2I+=N9P;var F6N=E3H;F6N+=r$r8n[134240];F6N+=q2_;if(conf[Q40] && conf[F6N] && !Array[R2m](val)){var m3q=f9L;m3q+=V7o;val=typeof val === k38?val[m3q](conf[g32]):[];}else if(!Array[n2I](val)){val=[val];}var valueFn=dataGet(conf[v6o][Z3p]);conf[T7f][c3F]({selected:w6a})[J7B]();conf[h6F][c3F](function(idx,data,node){var L4o="dexOf";var N58=f6B;N58+=L4o;return val[N58](valueFn(data)) !== -X$4;})[B3D]();datatable[l_5](conf,this);if(!localUpdate){var t7U=r$r8n.W1t;t7U+=E_4;var Z3R=N96;Z3R+=J0d;Z3R+=A8W;var Z1q=r$r8n[625824];Z1q+=Y7q;_triggerChange($(conf[Z1q][Z3R]()[t7U]()));}},tableClass:Y5Y,update:function(conf,options,append){var Q5P="Set";var O9_="last";var O$o=Z$N;O$o+=Y7q;O$o+=r$r8n[134240];O$o+=n4k;var R87=e1b;R87+=O9_;R87+=Q5P;var b4A=P5K;L7h.q_G();b4A+=t91;datatable[b4A](conf,options,append);var lastSet=conf[R87];if(lastSet !== undefined){datatable[F9y](conf,lastSet,w6a);}_triggerChange($(conf[T7f][Y5V]()[O$o]()));}});var defaults={className:Y5Y,compare:J1q,data:Y5Y,def:Y5Y,entityDecode:w6a,fieldInfo:Y5Y,getFormatter:J1q,id:Y5Y,label:Y5Y,labelInfo:Y5Y,message:Y5Y,multiEditable:w6a,name:J1q,nullDefault:R3P,setFormatter:J1q,submit:w6a,type:S40};var DataTable$2=$[r$r8n.n2M][o6h];var Field=(function(){var Z88="multiRestore";var T4Y="labelInfo";var x6v="fieldError";var J6T="MultiValu";var O4b="update";var T5o="rototype";var n2N="multiEditable";var i7s="host";var D$_="protot";var O62="rrorNode";var O9f="prot";var H3u="_typeFn";var b0h="abled";var o97="rotot";var c0a="ulti";var M4D="_msg";var f15="multiReturn";var d6I="multiIds";var x6H="prototyp";var p3q="multiValue";var v0K='input, select, textarea';var Q5n="disabled";var e90="slideUp";var Q1w="orma";var q2U="formatters";var n4o=0.5;var m74="ultiSe";var L2s="destroy";var C70="enab";var l2D="multiValues";var O64="submittable";var S2C="nError";var J6B="lab";var e3D="oto";L7h.g_4();var L3s="otype";var M95="oty";var a$i="otot";var m7x="_ms";var w$s="ype";var S_N="fieldIn";var I2P="prototy";var Q48=U5h;Q48+=Q1w;Q48+=Y7q;var W6F=P2Y;W6F+=Y7q;W6F+=M95;W6F+=k3V;var L7A=J4v;L7A+=O62;var O$x=O9f;O$x+=M95;O$x+=O6v;O$x+=W$t;var o$R=m7x;o$R+=c2$;var a7T=O6v;a7T+=T5o;var v0Q=H8T;v0Q+=N32;v0Q+=k3V;var P$m=x3D;P$m+=I$y;P$m+=B50;P$m+=R4P;var B00=c7_;B00+=Q1J;B00+=D3A;B00+=w$s;var W27=D$_;W27+=w$s;var z8M=c7_;z8M+=e3D;z8M+=w4w;var L$l=O9f;L$l+=L3s;var G7w=K7Z;G7w+=H3K;G7w+=r$r8n[134240];G7w+=v60;var e9S=E9Q;e9S+=r$r8n[134240];e9S+=g4R;var f2R=O9f;f2R+=L3s;var X2U=r7N;X2U+=W$t;X2U+=Y7q;var N_3=Y4l;N_3+=r7N;N_3+=r7N;N_3+=k10;var R5v=q6d;R5v+=m74;R5v+=Y7q;var h58=s1H;h58+=s2L;var w5e=O6v;w5e+=T5o;var e4f=x6H;e4f+=W$t;var B9v=O6v;B9v+=W7M;B9v+=D3A;B9v+=w$s;var q0R=J6B;q0R+=W$t;q0R+=g4R;var s_z=O6v;s_z+=o97;s_z+=w$s;var T1k=v0Z;T1k+=w0a;var P_D=T1l;P_D+=l86;P_D+=r7N;var b9n=c7_;b9n+=e3D;b9n+=w4w;var E9b=r$r8n.b9I;E9b+=S2C;var z$w=I2P;z$w+=O6v;z$w+=W$t;var d2S=b6J;d2S+=J6T;d2S+=W$t;var P9Y=S_N;P9Y+=r$r8n[214853];P9Y+=Q1J;var J_8=I2P;J_8+=k3V;var G3L=j2z;G3L+=Q1J;G3L+=s79;var B9C=D$_;B9C+=W2w;B9C+=k3V;var t3K=b0H;t3K+=b0h;var B8d=C70;B8d+=A8W;var W8C=I2P;W8C+=k3V;var Q1N=r$r8n[625824];Q1N+=W$t;Q1N+=r$r8n[214853];var c0O=c7_;c0O+=a$i;c0O+=W2w;c0O+=k3V;function Field(options,classes,host){var a0P='field-processing';var v5s='msg-label';var P5O="\" ";var O$H='<span data-dte-e="multi-info" class="';var D$7="<div data-dte-";var l8Y="<div data-dte-e=";var S1Q="namePrefi";var K9w="Contr";var o0b="defa";var c7U="<label data-dte-e=\"label\" clas";var O0l="lInfo";var R4Q='<div data-dte-e="input" class="';var f7k="\" class=\"";var X8X='<div data-dte-e="msg-message" class="';var R6R="valToData";var g1z='msg-message';var K4X='multi-value';var v7e="msg-m";var D4Z="ults";var S8m='msg-info';var m2U='msg-error';var p6C="e=\"multi-value\" class=\"";var C8Q="</div>";var p4j="msg-";var H9s="\"><span></span>";var j9R="e=\"msg-multi\" class=\"";var p86='<div data-dte-e="input-control" class="';var J2r="side";var S9w="spa";var t7j='<div data-dte-e="field-processing" class="';var o1E="lic";var G4H='<div data-dte-e="msg-label" class="';var a0i="sid";var v3$="restore";var y9z='Error adding field - unknown field type ';var C9l="typeP";var C_h="essage";var G0Q="msg-info\" clas";var o$m="V";var Z6e="</l";var V3x='input-control';var H4u="data-dte-e=\"msg-error";var g_N="pes";var x24='msg-multi';var A4e=" data-dte-";var P17="refix";var B7Y="fieldT";var K6j="multi-i";var v2H='DTE_Field_';var o52="abel>";var t84="</di";var F05=Y7q;F05+=W2w;F05+=O6v;F05+=W$t;var V73=W$t;V73+=r$r8n[134240];V73+=r$r8n.W1t;V73+=v0Z;var o63=r$r8n.W1t;o63+=o1E;o63+=l0E;var y61=Q1J;y61+=y$F;var T0p=r$r8n[625824];T0p+=Q1J;T0p+=q6d;var S66=K6j;S66+=L9k;var M_3=g4R;M_3+=r$r8n[134240];M_3+=J0d;M_3+=R_q;var b6X=v7e;b6X+=C_h;var t0S=p4j;t0S+=e9K;t0S+=s79;t0S+=M3v;var q16=r$r8n[625824];q16+=W$3;var M0V=a0i;M0V+=W$t;var S7D=H9s;S7D+=C8Q;var H2F=t84;H2F+=L9i;var N4a=j6b;N4a+=r$r8n[625824];N4a+=H4V;var u4H=i2k;u4H+=W$t;u4H+=H6e;u4H+=o23;var u11=l8Y;u11+=k7g;u11+=G0Q;u11+=z6$;var Y__=y0c;Y__+=H4u;Y__+=f7k;var z$v=u7e;z$v+=m1e;z$v+=A4e;z$v+=j9R;var M_d=j6b;M_d+=J$7;M_d+=L9i;var l25=j6b;l25+=S9w;l25+=y$F;l25+=b1l;var d_C=Y_E;d_C+=r$r8n.b9I;d_C+=o23;var H8e=k7g;H8e+=b1l;var m6H=K2q;m6H+=I6H;m6H+=o$m;m6H+=B2o;var r4A=D$7;r4A+=p6C;var Z7C=n0p;Z7C+=C8Q;var z1p=S5s;z1p+=K9w;z1p+=Q1J;z1p+=g4R;var p3o=k7g;p3o+=b1l;var E7l=Z6e;E7l+=o52;var S57=f2D;S57+=J0d;S57+=W$t;S57+=O0l;var W2u=r$r8n.b9I;W2u+=r$r8n[625824];var b0i=P5O;b0i+=K_S;b0i+=H1Y;var S5i=c7U;S5i+=z6$;var z9S=S1Q;z9S+=u8s;var k64=Y7q;k64+=w$s;var F1u=C9l;F1u+=P17;var K1J=r$r8n.b9I;K1J+=r$r8n[625824];var C3N=B7Y;C3N+=W2w;C3N+=g_N;var L3$=I8M;L3$+=q6d;L3$+=W$t;var o03=o0b;o03+=D4Z;var that=this;var multiI18n=host[n6d]()[s1H];var opts=$[e$$](w6a,{},Field[o03],options);if(!Editor[x7r][opts[w4w]]){throw new Error(y9z + opts[w4w]);}this[r7N]={classes:classes,host:host,multiIds:[],multiValue:R3P,multiValues:{},name:opts[L3$],opts:opts,processing:R3P,type:Editor[C3N][opts[w4w]]};if(!opts[K1J]){var w9o=h51;w9o+=W$t;opts[H_D]=(v2H + opts[w9o])[C$6](/ /g,O9R);}if(opts[q7Q] === Y5Y){var z2f=I8M;z2f+=q6d;z2f+=W$t;opts[q7Q]=opts[z2f];}this[T_i]=function(d){var v8H=W$t;v8H+=r$r8n[625824];v8H+=V7o;v8H+=M3v;return dataGet(opts[q7Q])(d,v8H);};this[R6R]=dataSet(opts[q7Q]);var template=$(o92 + classes[C4d] + Y$1 + classes[F1u] + opts[k64] + Y$1 + classes[z9S] + opts[N5t] + Y$1 + opts[S5G] + w5g + S5i + classes[h7b] + b0i + Editor[k7V](opts[W2u]) + w5g + opts[h7b] + G4H + classes[v5s] + w5g + opts[S57] + U4J + E7l + R4Q + classes[S5s] + p3o + p86 + classes[z1p] + Z7C + r4A + classes[m6H] + H8e + multiI18n[x6Z] + O$H + classes[d_C] + w5g + multiI18n[U8D] + l25 + M_d + z$v + classes[Z88] + w5g + multiI18n[v3$] + U4J + Y__ + classes[m2U] + K25 + X8X + classes[g1z] + w5g + opts[S6H] + U4J + u11 + classes[S8m] + w5g + opts[u4H] + N4a + H2F + t7j + classes[F$W] + S7D + U4J);var input=this[H3u](C$L,opts);var side=J1q;if(input && input[M0V]){side=input[J2r];input=input[S5s];}if(input !== J1q){var F$7=c7_;F$7+=E3B;F$7+=b0H;F$7+=r$r8n[625824];el(V3x,template)[F$7](input);}else {var s5a=u4w;s5a+=W$t;var l9P=r$r8n.W1t;l9P+=r7N;l9P+=r7N;template[l9P](P$o,s5a);}this[q16]={container:template,fieldError:el(t0S,template),fieldInfo:el(S8m,template),fieldMessage:el(b6X,template),inputControl:el(V3x,template),label:el(M_3,template)[W2m](side),labelInfo:el(v5s,template),multi:el(K4X,template),multiInfo:el(S66,template),multiReturn:el(x24,template),processing:el(a0P,template)};this[U1m][s1H][Q5i](t8w,function(){L7h.g_4();var s76="ultiEditabl";var c$H=U0T;c$H+=W2w;var D2q=Y7q;D2q+=W2w;D2q+=O6v;D2q+=W$t;var f5V=J$7;f5V+=r7N;f5V+=M2S;f5V+=C8N;var g62=q6d;g62+=s76;g62+=W$t;var j6F=r6H;j6F+=r7N;if(that[r7N][j6F][g62] && !template[V89](classes[f5V]) && opts[D2q] !== c$H){var A1R=E9Q;A1R+=r$r8n[134240];A1R+=g4R;that[A1R](Y5Y);that[U8s]();}});this[T0p][f15][y61](o63,function(){that[Z88]();});$[V73](this[r7N][F05],function(name,fn){L7h.q_G();if(typeof fn === r8B && that[name] === undefined){that[name]=function(){var y5z=w9I;y5z+=A8e;y5z+=W2w;var L8M=W85;L8M+=r$r8n.b9I;L8M+=r$r8n[214853];L8M+=Y7q;var S_p=r7N;S_p+=g4R;S_p+=r$r8n.b9I;S_p+=j$W;var args=Array[w6D][S_p][w7u](arguments);args[L8M](name);var ret=that[H3u][y5z](that,args);return ret === undefined?that:ret;};}});}Field[c0O][Q1N]=function(set){var R9l='default';var I0k=Z7B;I0k+=r$r8n[214853];var m7C=Q1J;m7C+=O6v;m7C+=Y7q;m7C+=r7N;var opts=this[r7N][m7C];if(set === undefined){var B8L=r$r8n[214853];B8L+=u$n;B8L+=y$F;B8L+=c4g;var n$I=r$r8n[625824];n$I+=W$t;n$I+=r$r8n[214853];var r$5=t7g;r$5+=r$r8n[134240];r$5+=l$5;var def=opts[r$5] !== undefined?opts[R9l]:opts[n$I];return typeof def === B8L?def():def;}opts[I0k]=set;return this;};Field[w6D][z78]=function(){var q4R="containe";var F$_="typeF";var c_k=e1b;c_k+=F$_;c_k+=y$F;var e5Y=q4R;e5Y+=s79;this[U1m][e5Y][R0K](this[r7N][b_M][Q5n]);this[c_k](x$i);return this;};Field[W8C][H6u]=function(){var I7D="par";var P7W="ntaine";var L4y=d6Y;L4y+=N9P;var F10=r$r8n.W1t;F10+=r7N;L7h.g_4();F10+=r7N;var c4T=g4R;c4T+=W$t;c4T+=S2H;c4T+=P8O;var M5C=I7D;M5C+=s1Z;M5C+=r7N;var T6m=K7Z;T6m+=P7W;T6m+=s79;var container=this[U1m][T6m];return container[M5C](l8s)[c4T] && container[F10](L4y) !== D8d?w6a:R3P;};Field[w6D][B8d]=function(toggle){var B5Z=C70;B5Z+=A8W;var m3E=T7i;m3E+=p26;m3E+=W$t;m3E+=r7N;var w3I=N7A;w3I+=z9L;w3I+=e9K;var C5U=r$r8n[625824];C5U+=W$3;if(toggle === void k70){toggle=w6a;}if(toggle === R3P){return this[z78]();}this[C5U][w3I][a3l](this[r7N][m3E][Q5n]);this[H3u](B5Z);return this;};Field[w6D][t3K]=function(){var M9n="lass";var V87="hasC";var o2q=V2G;o2q+=r$r8n[134240];o2q+=s5g;var O8Z=V87;O8Z+=M9n;var E$U=r$r8n[625824];E$U+=Q1J;L7h.q_G();E$U+=q6d;return this[E$U][K7Y][O8Z](this[r7N][b_M][o2q]) === R3P;};Field[B9C][G3L]=function(msg,fn){var M1f="ner";var r66="sses";var F$F="errorMessag";var d$a=F$F;d$a+=W$t;var a9H=r$r8n.W1t;a9H+=f2D;a9H+=r66;var classes=this[r7N][a9H];L7h.g_4();if(msg){var c49=W$t;c49+=r6b;c49+=s79;var I4N=f9l;I4N+=s6v;var D7l=l1k;D7l+=M1f;var c$K=z0T;c$K+=q6d;this[c$K][D7l][I4N](classes[c49]);}else {var Q3Y=L3A;Q3Y+=Y7W;Q3Y+=p26;var a3I=r$r8n[625824];a3I+=Q1J;a3I+=q6d;this[a3I][K7Y][Q3Y](classes[f8w]);}this[H3u](d$a,msg);return this[M4D](this[U1m][x6v],msg,fn);};Field[J_8][P9Y]=function(msg){var m8A="dIn";var Z6W=F$a;Z6W+=g4R;L7h.q_G();Z6W+=m8A;Z6W+=T1l;var f6p=r$r8n[625824];f6p+=Q1J;f6p+=q6d;var W3C=e1b;W3C+=q6d;W3C+=r7N;W3C+=c2$;return this[W3C](this[f6p][Z6W],msg);};Field[w6D][d2S]=function(){var e47="Ids";var C4n=u9F;C4n+=P8O;var A3c=q6d;A3c+=c0a;A3c+=e47;var h$K=K2q;h$K+=U7F;return this[r7N][h$K] && this[r7N][A3c][C4n] !== X$4;};Field[z$w][E9b]=function(){var X0U=N41;L7h.q_G();X0U+=s79;return this[U1m][K7Y][V89](this[r7N][b_M][X0U]);};Field[w6D][S5s]=function(){var B3w="peF";var s_I=r$r8n.b9I;s_I+=y$F;s_I+=O6v;L7h.g_4();s_I+=V5j;var V31=e1b;V31+=N32;V31+=B3w;V31+=y$F;return this[r7N][w4w][S5s]?this[V31](s_I):$(v0K,this[U1m][K7Y]);};Field[b9n][P_D]=function(){var l4A="foc";var s4L="typeFn";var V6H="cus";var P23=N32;P23+=O6v;P23+=W$t;if(this[r7N][P23][U8s]){var k2X=l4A;k2X+=u$n;k2X+=r7N;var M3u=e1b;M3u+=s4L;this[M3u](k2X);}else {var W0A=r$r8n[214853];W0A+=Q1J;W0A+=V6H;var i52=l1k;i52+=U4H;i52+=s79;var X9W=r$r8n[625824];X9W+=Q1J;X9W+=q6d;$(v0K,this[X9W][i52])[W0A]();}return this;};Field[w6D][s_D]=function(){var W0E="sMultiValue";var a0_="etFormatter";var j3X="_forma";var C8J=c2$;C8J+=a0_;var w7k=T_8;w7k+=Y7q;var Y1K=j3X;Y1K+=Y7q;var T5X=r$r8n.b9I;T5X+=W0E;if(this[T5X]()){return undefined;}return this[Y1K](this[H3u](w7k),this[r7N][P3I][C8J]);};Field[w6D][T1k]=function(animate){var p1a="sli";var C7s="cit";var Q2B="displayNo";var O0p="eUp";var e2a="taine";var z2n=r$r8n[214853];z2n+=y$F;var g0L=V2G;g0L+=A8e;g0L+=N9P;var f2w=v0Z;f2w+=g6I;var t$V=Q1J;t$V+=Y$F;t$V+=C7s;t$V+=W2w;var T1c=Q2B;T1c+=Z7B;var a2i=v0Z;a2i+=Q1J;a2i+=r7N;a2i+=Y7q;var w74=Z$N;w74+=e2a;w74+=s79;var el=this[U1m][w74];L7h.q_G();var opacity=parseFloat($(this[r7N][a2i][T1c]())[o8Q](t$V));if(animate === undefined){animate=w6a;}if(this[r7N][f2w][g0L]() && opacity > n4o && animate && $[z2n][e90]){var a0F=p1a;a0F+=r$r8n[625824];a0F+=O0p;el[a0F]();}else {var L2p=o8$;L2p+=y$F;L2p+=W$t;var O5v=r$r8n.W1t;O5v+=r7N;O5v+=r7N;el[O5v](P$o,L2p);}return this;};Field[s_z][q0R]=function(str){var k2q="labe";var c9G=W2O;c9G+=k7R;var o6p=Z7B;o6p+=w$G;var r3I=k2q;r3I+=g4R;r3I+=o23;var i2l=r$r8n[625824];i2l+=Q1J;i2l+=q6d;var B38=f2D;B38+=O9Y;var label=this[U1m][B38];var labelInfo=this[i2l][r3I][o6p]();if(str === undefined){return label[V4c]();}label[c9G](str);label[W2m](labelInfo);return this;};Field[B9v][T4Y]=function(msg){var I9Z=r$r8n[625824];I9Z+=W$3;var q2c=e1b;q2c+=q6d;q2c+=r7N;q2c+=c2$;return this[q2c](this[I9Z][T4Y],msg);};Field[e4f][S6H]=function(msg,fn){var t0d="fieldMessage";return this[M4D](this[U1m][t0d],msg,fn);};Field[w5e][h58]=function(id){var p7y="tiI";var r0S="isMultiV";var A8l=r0S;A8l+=B2o;var C1o=K2q;C1o+=p7y;C1o+=r$r8n[625824];C1o+=r7N;var value;var multiValues=this[r7N][l2D];var multiIds=this[r7N][C1o];var isMultiValue=this[A8l]();if(id === undefined){var O2y=A8W;O2y+=D$O;O2y+=v0Z;var fieldVal=this[m23]();value={};for(var _i=k70,multiIds_1=multiIds;_i < multiIds_1[O2y];_i++){var multiId=multiIds_1[_i];value[multiId]=isMultiValue?multiValues[multiId]:fieldVal;}}else if(isMultiValue){value=multiValues[id];}else {var L5m=E9Q;L5m+=r$r8n[134240];L5m+=g4R;value=this[L5m]();}return value;};Field[w6D][Z88]=function(){var T8V="multiValueCheck";var n9c=e1b;n9c+=T8V;this[r7N][p3q]=w6a;this[n9c]();};Field[w6D][R5v]=function(id,val,recalc){var B1e="eCheck";var A9b="iValu";var n_E="_mult";if(recalc === void k70){recalc=w6a;}var that=this;var multiValues=this[r7N][l2D];var multiIds=this[r7N][d6I];if(val === undefined){val=id;id=undefined;}var set=function(idSrc,valIn){var A1P="pus";var F7G="rra";var h_j="etFor";var b74=r7N;b74+=h_j;b74+=m56;b74+=u3q;var Z8I=e1b;Z8I+=r$r8n[214853];Z8I+=M3v;Z8I+=m56;var k55=f6B;k55+=E5o;k55+=F7G;L7h.g_4();k55+=W2w;if($[k55](idSrc,multiIds) === -X$4){var x2w=A1P;x2w+=v0Z;multiIds[x2w](idSrc);}multiValues[idSrc]=that[Z8I](valIn,that[r7N][P3I][b74]);};if($[B1b](val) && id === undefined){var W4I=p$q;W4I+=B7b;$[W4I](val,function(idSrc,innerVal){L7h.g_4();set(idSrc,innerVal);});}else if(id === undefined){var i30=W$t;i30+=r$r8n[134240];i30+=r$r8n.W1t;i30+=v0Z;$[i30](multiIds,function(i,idSrc){L7h.g_4();set(idSrc,val);});}else {set(id,val);}this[r7N][p3q]=w6a;if(recalc){var T2m=n_E;T2m+=A9b;T2m+=B1e;this[T2m]();}L7h.g_4();return this;};Field[w6D][N5t]=function(){var q5B=h51;L7h.q_G();q5B+=W$t;return this[r7N][P3I][q5B];};Field[w6D][F_v]=function(){var b8r=r$r8n[625824];b8r+=Q1J;L7h.g_4();b8r+=q6d;return this[b8r][K7Y][k70];};Field[w6D][I1D]=function(){var F3K="nullDefaul";var q1n=F3K;q1n+=Y7q;return this[r7N][P3I][q1n];};Field[w6D][N_3]=function(set){var I6j="ocessing-field";var q_s="hos";var p1$=O6v;p1$+=s79;p1$+=I6j;var w4G=q_s;w4G+=Y7q;var Z3X=O6v;Z3X+=D9r;var F4L=r$r8n[625824];F4L+=Q1J;F4L+=q6d;if(set === undefined){return this[r7N][F$W];}this[F4L][Z3X][o8Q](P$o,set?e7p:D8d);this[r7N][F$W]=set;this[r7N][w4G][e0u](p1$,[set]);return this;};Field[w6D][X2U]=function(val,multiCheck){var Z9F="iValue";var C2D="multiV";var v72="alueC";var m20="ntityDecode";var c1g="setFormatter";var r_w=W$t;r_w+=m20;var d3U=q6d;d3U+=u$n;d3U+=t$x;d3U+=Z9F;if(multiCheck === void k70){multiCheck=w6a;}var decodeFn=function(d){var K6q='"';var n8R='£';var A6z='\'';var B8Z="ace";var I$Z=v60;I$Z+=A8e;I$Z+=B8Z;var C6U=v60;C6U+=v2c;C6U+=W$t;var D0m=s79;D0m+=W$t;D0m+=A8e;D0m+=B8Z;var N_d=r7N;N_d+=B4r;N_d+=f6B;N_d+=c2$;return typeof d !== N_d?d:d[D0m](/&gt;/g,K6G)[C$6](/&lt;/g,F1i)[C$6](/&amp;/g,h5d)[C$6](/&quot;/g,K6q)[C$6](/&#163;/g,n8R)[C6U](/&#0?39;/g,A6z)[I$Z](/&#0?10;/g,z_Z);};this[r7N][d3U]=R3P;var decode=this[r7N][P3I][r_w];if(decode === undefined || decode === w6a){var D7G=v0T;D7G+=V7O;if(Array[D7G](val)){for(var i=k70,ien=val[T1W];i < ien;i++){val[i]=decodeFn(val[i]);}}else {val=decodeFn(val);}}if(multiCheck === w6a){var k01=e1b;k01+=C2D;k01+=v72;k01+=j8c;var p2C=r7N;p2C+=W$t;p2C+=Y7q;var u7f=f3S;u7f+=e6I;var A0x=e1b;A0x+=N1H;A0x+=n8d;val=this[A0x](val,this[r7N][u7f][c1g]);this[H3u](p2C,val);this[k01]();}else {var o$X=r7N;o$X+=W$t;o$X+=Y7q;this[H3u](o$X,val);}return this;};Field[w6D][m4w]=function(animate,toggle){var I8p="city";var H5f="sl";var G5Z="eDo";var E5_="ayNod";var W6l="Dow";var W82="slid";var k8U="play";var H3r=H5f;H3r+=w0a;H3r+=W6l;L7h.g_4();H3r+=y$F;var u3o=Q1J;u3o+=Y$F;u3o+=I8p;var F59=r$r8n.W1t;F59+=s6v;var a_A=V2G;a_A+=A8e;a_A+=E5_;a_A+=W$t;if(animate === void k70){animate=w6a;}if(toggle === void k70){toggle=w6a;}if(toggle === R3P){return this[I55](animate);}var el=this[U1m][K7Y];var opacity=parseFloat($(this[r7N][i7s][a_A]())[F59](u3o));if(this[r7N][i7s][p14]() && opacity > n4o && animate && $[r$r8n.n2M][H3r]){var T0N=W82;T0N+=G5Z;T0N+=z3R;el[T0N]();}else {var X_E=V2G;X_E+=k8U;el[o8Q](X_E,Y5Y);}return this;};Field[f2R][O4b]=function(options,append){if(append === void k70){append=R3P;}if(this[r7N][w4w][O4b]){this[H3u](N5T,options,append);}return this;};Field[w6D][e9S]=function(val){var B_g=c2$;B_g+=W$t;B_g+=Y7q;return val === undefined?this[B_g]():this[F9y](val);};Field[w6D][G7w]=function(value,original){var U2B=Q1J;U2B+=O6v;U2B+=e6I;L7h.q_G();var compare=this[r7N][U2B][E2q] || deepCompare;return compare(value,original);};Field[w6D][E2h]=function(){var M_x=a4t;M_x+=Y7q;M_x+=r$r8n[134240];return this[r7N][P3I][M_x];};Field[L$l][L2s]=function(){var U1y="stroy";var e9N="remov";var M8L=Z7B;M8L+=U1y;var h37=e9N;h37+=W$t;var F6C=N7A;F6C+=r$r8n[134240];F6C+=f6B;F6C+=e9K;var v$i=r$r8n[625824];v$i+=Q1J;v$i+=q6d;this[v$i][F6C][h37]();this[H3u](M8L);return this;};Field[z8M][n2N]=function(){var b5M="iE";var E_o="ditable";var Z$x=x3D;Z$x+=t$x;Z$x+=b5M;Z$x+=E_o;var e$c=f3S;e$c+=Y7q;e$c+=r7N;return this[r7N][e$c][Z$x];};Field[W27][d6I]=function(){return this[r7N][d6I];};Field[B00][P$m]=function(show){var D1P="multiInfo";var J7V=r$r8n.W1t;J7V+=r7N;J7V+=r7N;this[U1m][D1P][J7V]({display:show?e7p:D8d});};Field[v0Q][V0d]=function(){var k92=p3q;k92+=r7N;this[r7N][d6I]=[];this[r7N][k92]={};};Field[w6D][O64]=function(){return this[r7N][P3I][B4h];};Field[a7T][o$R]=function(el,msg,fn){var s_7="lideD";var B_N=":v";var U57="internalSettings";var o2j="isible";var f0e="ock";var v7t="parent";var p4Q=r$r8n[214853];p4Q+=y$F;var U1h=B_N;U1h+=o2j;var Y6j=r$r8n[214853];Y6j+=u$n;Y6j+=S6D;if(msg === undefined){return el[V4c]();}if(typeof msg === Y6j){var D0$=O46;D0$+=r$r8n.b9I;var editor=this[r7N][i7s];msg=msg(editor,new DataTable$2[D0$](editor[U57]()[Y5V]));}if(el[v7t]()[b6J](U1h) && $[p4Q][X08]){el[V4c](msg);if(msg){var E$0=r7N;E$0+=s_7;E$0+=Q1J;E$0+=z3R;el[E$0](fn);}else {el[e90](fn);}}else {var b2X=u4w;b2X+=W$t;var A5p=X3U;A5p+=f0e;var y2Q=r$r8n.W1t;y2Q+=r7N;y2Q+=r7N;var b9c=W2O;b9c+=q6d;b9c+=g4R;el[b9c](msg || Y5Y)[y2Q](P$o,msg?A5p:b2X);if(fn){fn();}}return this;};Field[O$x][s6I]=function(){var K2u="togg";var h3H="nputC";var y6d="iIn";var H66="iVal";var g0R="ultiIds";var G9A="trol";var E1R="ltiVa";var B_y="inputCont";var m1H="multiNoEdit";var W46="isMultiValue";var a7$="leClass";var f5Q="noMult";var H2n="internalMultiInfo";var B3u=K2u;B3u+=a7$;var q7u=f5Q;L7h.q_G();q7u+=r$r8n.b9I;var W50=f6B;W50+=r$r8n[214853];W50+=Q1J;var D40=q6d;D40+=l$5;D40+=y6d;D40+=T1l;var E5d=r$r8n[625824];E5d+=Q1J;E5d+=q6d;var N5o=K2q;N5o+=I6H;var o6M=l_$;o6M+=g2J;var t6m=y$F;t6m+=Q1J;t6m+=y$F;t6m+=W$t;var T0g=Y8h;T0g+=v0Z;var Q7C=Q1J;Q7C+=L7P;var D5$=q6d;D5$+=u$n;D5$+=E1R;D5$+=A3I;var X_N=Y_E;X_N+=H66;X_N+=T_q;X_N+=r7N;var q88=q6d;q88+=g0R;var last;var ids=this[r7N][q88];var values=this[r7N][X_N];var isMultiValue=this[r7N][D5$];var isMultiEditable=this[r7N][Q7C][n2N];var val;var different=R3P;if(ids){var o$w=u9F;o$w+=Y7q;o$w+=v0Z;for(var i=k70;i < ids[o$w];i++){val=values[ids[i]];if(i > k70 && !deepCompare(val,last)){different=w6a;break;}last=val;}}if(different && isMultiValue || !isMultiEditable && this[W46]()){var E2e=o8$;E2e+=U4H;var Z35=B_y;Z35+=W7M;Z35+=g4R;this[U1m][Z35][o8Q]({display:E2e});this[U1m][s1H][o8Q]({display:e7p});}else {var C6A=r$r8n.W1t;C6A+=r7N;C6A+=r7N;var w75=q6d;w75+=c0a;var G5c=r$r8n.b9I;G5c+=h3H;G5c+=Q5i;G5c+=G9A;this[U1m][G5c][o8Q]({display:e7p});this[U1m][w75][C6A]({display:D8d});if(isMultiValue && !different){this[F9y](last,R3P);}}this[U1m][f15][o8Q]({display:ids && ids[T0g] > X$4 && different && !isMultiValue?e7p:t6m});var i18n=this[r7N][o6M][n6d]()[N5o];this[E5d][D40][V4c](isMultiEditable?i18n[W50]:i18n[q7u]);this[U1m][s1H][B3u](this[r7N][b_M][m1H],!isMultiEditable);this[r7N][i7s][H2n]();return w6a;};Field[w6D][H3u]=function(name){var u3S="hi";var K$$="uns";var I6s=Q1J;I6s+=O6v;I6s+=Y7q;I6s+=r7N;var N$q=K$$;N$q+=u3S;N$q+=r$r8n[214853];N$q+=Y7q;L7h.q_G();var a$k=A8W;a$k+=y$F;a$k+=H7D;var args=[];for(var _i=X$4;_i < arguments[a$k];_i++){args[_i - X$4]=arguments[_i];}args[N$q](this[r7N][I6s]);var fn=this[r7N][w4w][name];if(fn){return fn[w$N](this[r7N][i7s],args);}};Field[w6D][L7A]=function(){L7h.q_G();return this[U1m][x6v];};Field[W6F][Q48]=function(val,formatter){var b8s="shift";L7h.g_4();var v9V="ice";if(formatter){var n3M=r$r8n.b9I;n3M+=N$c;n3M+=s79;n3M+=N9P;if(Array[n3M](formatter)){var P_4=r$r8n[134240];P_4+=q8J;var v1F=r7N;v1F+=g4R;v1F+=v9V;var args=formatter[v1F]();var name_1=args[b8s]();formatter=Field[q2U][name_1][P_4](this,args);}return formatter[w7u](this[r7N][i7s],val,this);}return val;};Field[S9G]=defaults;Field[q2U]={};return Field;})();var button={action:J1q,className:J1q,tabIndex:k70,text:J1q};var displayController={close:function(){},init:function(){},node:function(){},open:function(){}};var DataTable$1=$[r$r8n.n2M][E1B];var apiRegister=DataTable$1[a8V][h2J];function _getInst(api){var S7r="oInit";var S9L="context";L7h.q_G();var E$f="edito";var n4e=E$f;n4e+=s79;var ctx=api[S9L][k70];return ctx[S7r][n4e] || ctx[B_E];}function _setBasic(inst,opts,type,plural){var J5j=/%d/;var u2G="8n";var v22='_basic';var n6m=Y7q;n6m+=l98;L7h.q_G();if(!opts){opts={};}if(opts[r$L] === undefined){var R$L=M$E;R$L+=j9y;opts[R$L]=v22;}if(opts[n6m] === undefined){var P0N=k58;P0N+=u2G;var M$t=Y7q;M$t+=V7o;M$t+=A8W;opts[M$t]=inst[P0N][type][x6Z];}if(opts[S6H] === undefined){if(type === J3x){var P_J=H5_;P_J+=Y$P;var D5c=r$r8n.b9I;D5c+=r$r8n.G6G;D5c+=r$r8n.D$v;D5c+=y$F;var confirm_1=inst[D5c][type][s0A];opts[P_J]=plural !== X$4?confirm_1[e1b][C$6](J5j,plural):confirm_1[i_o];}else {opts[S6H]=Y5Y;}}return opts;}apiRegister(K8e,function(){L7h.g_4();return _getInst(this);});apiRegister(k4H,function(opts){var k0$=t_F;L7h.q_G();k0$+=p$q;k0$+=F4_;var inst=_getInst(this);inst[u0A](_setBasic(inst,opts,k0$));return this;});apiRegister(e8N,function(opts){var R_Q=p5T;R_Q+=V7o;var inst=_getInst(this);inst[R_Q](this[k70][k70],_setBasic(inst,opts,X_j));return this;});apiRegister(d1N,function(opts){var E7u=W$t;E7u+=r$r8n[625824];E7u+=V7o;var inst=_getInst(this);inst[Z$4](this[k70],_setBasic(inst,opts,E7u));return this;});apiRegister(G2z,function(opts){var Z1z=v60;Z1z+=q6d;Z1z+=Q1J;Z1z+=v1D;var inst=_getInst(this);inst[L3A](this[k70][k70],_setBasic(inst,opts,Z1z,X$4));return this;});apiRegister(w1F,function(opts){var W7z="emo";var n6Y=A8W;n6Y+=y$F;n6Y+=c2$;n6Y+=P8O;var i$8=s79;i$8+=W$t;i$8+=V9P;var H57=s79;H57+=W7z;H57+=v1D;var inst=_getInst(this);inst[H57](this[k70],_setBasic(inst,opts,i$8,this[k70][n6Y]));return this;});apiRegister(V48,function(type,opts){var D_0="je";var i3Q="isPlainOb";var I3X="inlin";var b4u=i3Q;b4u+=D_0;b4u+=r$r8n[166666];if(!type){var f3L=I3X;f3L+=W$t;type=f3L;}else if($[b4u](type)){var H4d=f6B;H4d+=r0Q;opts=type;type=H4d;}_getInst(this)[type](this[k70][k70],opts);return this;});apiRegister(i4Z,function(opts){_getInst(this)[u4p](this[k70],opts);return this;});apiRegister(u1q,file);apiRegister(H9a,files);$(document)[Q5i](h47,function(e,ctx,json){var E2Z="space";var e5m=r$r8n[625824];e5m+=Y7q;var h0t=y$F;h0t+=A9T;h0t+=E2Z;if(e[h0t] !== e5m){return;}if(json && json[j_m]){var d_8=i2k;d_8+=g4R;d_8+=C6b;$[j0E](json[d_8],function(name,filesIn){var R7r=W$t;R7r+=Y$i;R7r+=X27;if(!Editor[j_m][name]){Editor[j_m][name]={};}$[R7r](Editor[j_m][name],filesIn);});}});var _buttons=$[r$r8n.n2M][r$r8n.G5j][l9k][i1D];$[I1a](_buttons,{create:{action:function(e,dt,node,config){var p$A="ssing";var D7g="ssa";var H$g="formM";var V9z="Open";var U90="roce";var k4Y="ormBut";var A8F="mTitle";var H5c=Z94;H5c+=Y7q;H5c+=r$r8n.b9I;H5c+=j9y;var h8d=r$r8n.W1t;h8d+=s79;h8d+=R7G;var R7O=K_S;R7O+=A8F;var J9M=U4g;J9M+=D7g;J9M+=c2$;J9M+=W$t;var B34=r$r8n.b9I;B34+=R9L;var E91=H$g;E91+=R1v;E91+=Y$P;var T3M=r$r8n[214853];T3M+=k4Y;T3M+=J61;L7h.g_4();T3M+=r7N;var b4z=L91;b4z+=b_u;var q_5=r$r8n.W1t;q_5+=s79;q_5+=z34;q_5+=W$t;var d5l=O6v;d5l+=v60;d5l+=V9z;var A7_=Q5i;A7_+=W$t;var s3v=O6v;s3v+=U90;s3v+=p$A;var that=this;var editor=config[F5G];this[s3v](w6a);editor[A7_](d5l,function(){var r64=O6v;r64+=D9r;that[r64](R3P);})[q_5]($[b4z]({buttons:config[T3M],message:config[E91] || editor[B34][u0A][J9M],nest:w6a,title:config[R7O] || editor[C6W][h8d][x6Z]},config[H5c]));},className:O9P,editor:J1q,formButtons:{action:function(e){L7h.q_G();this[B4h]();},text:function(editor){var E9C=A4$;E9C+=J0d;E9C+=F2V;var y87=t_F;L7h.q_G();y87+=R7G;return editor[C6W][y87][E9C];}},formMessage:J1q,formOptions:{},formTitle:J1q,text:function(dt,node,config){var S6g="ons.create";var O5t=J0d;O5t+=u$n;O5t+=P4Y;O5t+=Q5i;var K1Q=J0d;K1Q+=Q67;K1Q+=S6g;return dt[C6W](K1Q,config[F5G][C6W][u0A][O5t]);}},createInline:{action:function(e,dt,node,config){var H9E="neCreate";var q$o="posit";var W4f=q$o;W4f+=r$r8n[211051];var h07=j_p;L7h.g_4();h07+=H9E;config[F5G][h07](config[W4f],config[S3$]);},className:x7s,editor:J1q,formButtons:{action:function(e){L7h.g_4();this[B4h]();},text:function(editor){return editor[C6W][u0A][B4h];}},formOptions:{},position:h6g,text:function(dt,node,config){var R6e=".cr";var L3S=J0d;L3S+=V5j;L3S+=o38;L3S+=y$F;var S24=r$L;S24+=R6e;S24+=R7G;var U9D=r$r8n.b9I;U9D+=r$r8n.G6G;U9D+=r$r8n.D$v;L7h.q_G();U9D+=y$F;return dt[U9D](S24,config[F5G][C6W][u0A][L3S]);}},edit:{action:function(e,dt,node,config){var I3b="formT";var f_3="ormButto";var H1L="ormM";var f6_="lumn";var d6x='preOpen';var z3y=r$r8n.b9I;z3y+=r$r8n.G6G;z3y+=r$r8n.D$v;z3y+=y$F;var B1W=I3b;B1W+=l98;var R7K=r$r8n.b9I;R7K+=r$r8n.G6G;R7K+=r$r8n.D$v;R7K+=y$F;var b7r=r$r8n[214853];b7r+=H1L;b7r+=R1v;b7r+=Y$P;var v16=r$r8n[214853];v16+=f_3;v16+=y$F;v16+=r7N;var P$e=Q1J;P$e+=y$F;P$e+=W$t;var t_L=U6X;t_L+=k10;var e80=r$r8n.W1t;e80+=Q1J;e80+=f6_;e80+=r7N;var F5t=K1m;F5t+=W$t;F5t+=r7N;var h4t=p5T;h4t+=r$r8n.b9I;h4t+=Y7q;h4t+=M3v;var that=this;var editor=config[h4t];var rows=dt[c3F]({selected:w6a})[F5t]();var columns=dt[e80]({selected:w6a})[z$2]();var cells=dt[O$L]({selected:w6a})[z$2]();var items=columns[T1W] || cells[T1W]?{cells:cells,columns:columns,rows:rows}:rows;this[t_L](w6a);editor[P$e](d6x,function(){var r$U="ocessi";var A9p=c7_;A9p+=r$U;A9p+=y$F;A9p+=c2$;that[A9p](R3P);})[Z$4](items,$[e$$]({buttons:config[v16],message:config[b7r] || editor[R7K][Z$4][S6H],nest:w6a,title:config[B1W] || editor[z3y][Z$4][x6Z]},config[S3$]));},className:T9J,editor:J1q,extend:Y$S,formButtons:{action:function(e){L7h.g_4();this[B4h]();},text:function(editor){var W3y=r7N;W3y+=u$n;W3y+=J0d;W3y+=F2V;var c2H=r$r8n.b9I;c2H+=m_5;c2H+=y$F;return editor[c2H][Z$4][W3y];}},formMessage:J1q,formOptions:{},formTitle:J1q,text:function(dt,node,config){var G2Q='buttons.edit';var T_A=r$r8n.b9I;T_A+=R9L;return dt[T_A](G2Q,config[F5G][C6W][Z$4][o89]);}},remove:{action:function(e,dt,node,config){var n0h="reO";var O_b="formButtons";var Y$E="rmOpti";var Z4w="indexe";var k4N="ssage";var c46="formMe";var A_v="formTitle";var D4R=T1l;D4R+=Y$E;D4R+=j9y;var d$V=k58;d$V+=r$r8n.D$v;d$V+=y$F;var k5y=c46;k5y+=k4N;var C1U=Z4w;C1U+=r7N;var I_8=O6v;I_8+=n0h;I_8+=n9T;var that=this;var editor=config[F5G];L7h.q_G();this[F$W](w6a);editor[W_z](I_8,function(){var P9o=Y4l;P9o+=s6v;P9o+=k10;L7h.g_4();that[P9o](R3P);})[L3A](dt[c3F]({selected:w6a})[C1U](),$[e$$]({buttons:config[O_b],message:config[k5y],nest:w6a,title:config[A_v] || editor[d$V][L3A][x6Z]},config[D4R]));},className:U46,editor:J1q,extend:r0n,formButtons:{action:function(e){L7h.q_G();this[B4h]();},text:function(editor){var S5g="i18";var K52=A4$;K52+=U3j;K52+=Y7q;L7h.g_4();var R9A=S5g;R9A+=y$F;return editor[R9A][L3A][K52];}},formMessage:function(editor,dt){var n26="confir";var s6H="nfirm";var B9V=g4R;B9V+=T1d;B9V+=v0Z;var z3K=n26;z3K+=q6d;var a25=A1B;a25+=c2$;a25+=P8O;var v79=g2J;v79+=s79;v79+=f6B;v79+=c2$;var a6S=K7Z;a6S+=s6H;var G5h=v60;G5h+=q6d;G5h+=W_b;G5h+=W$t;var Z1k=r$r8n.b9I;Z1k+=R9L;var w1j=s79;w1j+=Z8M;w1j+=r7N;var rows=dt[w1j]({selected:w6a})[z$2]();var i18n=editor[Z1k][G5h];var question=typeof i18n[a6S] === v79?i18n[s0A]:i18n[s0A][rows[a25]]?i18n[z3K][rows[B9V]]:i18n[s0A][e1b];return question[C$6](/%d/g,rows[T1W]);},formOptions:{},formTitle:J1q,limitTo:[X17],text:function(dt,node,config){var x1c="tons.remo";var n2u=i9x;n2u+=Y7q;n2u+=Q1J;n2u+=y$F;var m90=r$r8n.b9I;m90+=r$r8n.G6G;m90+=r$r8n.D$v;m90+=y$F;var I7v=i9x;I7v+=x1c;I7v+=v1D;var T4k=k58;T4k+=r$r8n.D$v;T4k+=y$F;return dt[T4k](I7v,config[F5G][m90][L3A][n2u]);}}});_buttons[b3o]=$[Q8Q]({},_buttons[Z$4]);_buttons[f4L][e$$]=s1N;_buttons[a7n]=$[v2a]({},_buttons[L3A]);_buttons[a7n][e$$]=k45;if(!DataTable || !DataTable[Y01] || !DataTable[Y01](r0X)){var F4w=Q3B;F4w+=L1o;F4w+=v9b;F4w+=n04;throw new Error(F4w);}var Editor=(function(){var T$K="dataS";var o8i="clas";var D6_='2.3.1';var h6E="version";var E_X="interna";var V2w="tory";var V78="ources";var e44="pairs";var Q84="lM";var P3F="ultiInfo";var d8b="fe";var E9j="nternalSettings";var J9c=i9h;J9c+=d8b;J9c+=c3T;var y3W=r$r8n[625824];y3W+=p7S;y3W+=g4R;y3W+=N9P;var h88=T$K;h88+=V78;var D75=A2o;D75+=r$r8n[625824];D75+=R_q;D75+=r7N;var p8J=s5K;p8J+=r$r8n.W1t;p8J+=V2w;var R6X=o8i;R6X+=Q4v;var a3i=r$r8n.b9I;a3i+=E9j;var F2G=E_X;F2G+=Q84;F2G+=P3F;var d$h=H8T;d$h+=N32;d$h+=O6v;d$h+=W$t;function Editor(init,cjsJq){var e7D="nce";var v1u="yNode";var v8v='<div data-dte-e="head" class="';var Q8x="ot";var h7d="ubbleLocation";var D2t="iv cl";var f1w="e-e=\"body\" class=\"";var n3q="insta";var X33="DataTables Editor must be initialised as";var g4B="messa";var R5j="undependent";var N0G="\"><d";var L4U='form_content';var U4l="dA";var U4K="ni";var u5C="<div data-dte-e=\"form_error\" clas";var T4X="></div";var V6Z='</form>';var F5W="_nestedOpen";var Q6o="<div data-dte-e=\"";var z$r="<form da";var l$0="_ajax";var J$h=" a \'new\' ";var Y2G="ass=\"";var A3G='<div data-dte-e="form_content" class="';var Y8r="mpl";var P7R="els";var h$L="que";var h3K='initEditor';var W1u='body_content';var s6e="body_con";var p$m="_ani";var e6j="mTa";var M7n="events";var J2p="rigger";var Z4R='i18n.dt.dte';var g7l="setting";var s2U="estro";var r7C="<div data-dte-e=\"form_info\" c";var d9k="><span></span></div>";var Y7E="Complete";var h_U="oot";var d5X='<div data-dte-e="processing" class="';var T3N="mplate";var M25="_eve";var s95="\"form\" class=\"";var l_m='<div data-dte-e="form_buttons" class="';var R$h="nlin";var Z7H="postopen";var t0m="Cannot find display";var n5c="mOpt";var v1w="cru";var R3z="enabl";var d60="bmitSucce";var o17="inlineCreate";var K4P="_optionsUpdate";var b2u="controller ";var a20="ta-dte-e=\"foot\" class=\"";var n5z="uni";var N9A="preopen";var j95="<div da";var O$f="_focu";var T5p="a-dte-e=";var I7Q="tin";var h5W="ctionCl";var y00='xhr.dt.dte';var z8W="head";var G5g="ody";var q_n="<div data-dt";var x8Y="/div>";var q2q="lur";var w3s="\"></";var M_z='init.dt.dte';var A87="ubm";var a4x="iSe";var F30="qu";var Q44="dependent";var w4d="\"><";var Q1Z="Er";var b_p="ontent";var Z5b="_noProcessing";var P7X="div></div";var W4q="indicator";var g9j="_clos";var z1o="mNode";var k5h="rgs";var t4m="actionName";var z_N="_fieldFr";var h6t="_subm";var u45="factory";var d9H="tent\" cl";var c$r="odifier";var r4j=f6B;r4j+=r$r8n.b9I;r4j+=Y7q;r4j+=Y7E;var W_O=M25;W_O+=y$F;W_O+=Y7q;var t09=r$r8n.b9I;t09+=y$F;t09+=r$r8n.b9I;t09+=Y7q;var D3w=u$n;D3w+=U4K;D3w+=F30;D3w+=W$t;var W8$=Q1J;W8$+=y$F;var l18=r$r8n[214853];l18+=p0J;l18+=H6e;l18+=r7N;var Z1F=z0T;Z1F+=q6d;var W6g=U6X;W6g+=r$r8n.b9I;W6g+=S2H;var J7Y=w4d;J7Y+=o$I;J7Y+=P7X;J7Y+=b1l;var t05=r$r8n.W1t;t05+=Q5i;t05+=c$6;var z25=N0G;z25+=D2t;z25+=Y2G;var r4w=t2l;r4w+=V44;var D8D=z8W;D8D+=W$t;D8D+=s79;var z3o=w4d;z3o+=x8Y;var K9l=r7C;K9l+=f2D;K9l+=s6v;K9l+=H1Y;var e7N=w3s;e7N+=G1m;var C1S=u5C;C1S+=z6$;var j69=r$r8n[214853];j69+=Q1J;j69+=Q8x;var B2$=M$E;B2$+=j9y;var o5u=r$r8n[214853];o5u+=Q1J;o5u+=v3W;var k6_=J0d;k6_+=Q1J;k6_+=c1W;var K5E=r$r8n[625824];K5E+=Q1J;K5E+=q6d;var h06=k7g;h06+=T4X;h06+=b1l;var i31=r$r8n.W1t;i31+=Q1J;i31+=g5b;var a_i=k7g;a_i+=b1l;var V7C=z$r;V7C+=Y7q;V7C+=T5p;V7C+=s95;var D9G=u7e;D9G+=x8Y;var k1J=u7e;k1J+=x8Y;var N9Y=r$r8n[214853];N9Y+=h_U;N9Y+=e9K;var a46=s_0;a46+=D2t;a46+=Y2G;var h5B=S6a;h5B+=s79;h5B+=r$r8n[134240];h5B+=k_0;var g2E=j95;g2E+=a20;var J6E=w4d;J6E+=S8g;J6E+=H4V;var e2G=r$r8n.W1t;e2G+=b_p;var J1S=J0d;J1S+=G5g;var L5E=Q6o;L5E+=s6e;L5E+=d9H;L5E+=Y2G;var n8w=n5o;n8w+=w9I;n8w+=k3V;n8w+=s79;var Q4R=q_n;Q4R+=f1w;var D6j=k7g;D6j+=d9k;var X_C=S6a;X_C+=P0y;X_C+=s79;var x_b=T7i;x_b+=g6j;var B8o=n5z;B8o+=h$L;var B5M=g7l;B5M+=r7N;var S3l=o9l;S3l+=P7R;var W0v=r$r8n.b9I;W0v+=r$r8n.G6G;W0v+=r$r8n.D$v;W0v+=y$F;var l2F=r$r8n.b9I;l2F+=m_5;l2F+=y$F;var c$9=L91;c$9+=Y7q;c$9+=b0H;c$9+=r$r8n[625824];var Y6v=o8i;Y6v+=Q4v;var T1z=F4_;T1z+=Y8r;T1z+=n8d;T1z+=W$t;var o9V=u5y;o9V+=z7t;o9V+=F4_;var p27=Y7q;p27+=r$r8n[134240];p27+=u6R;var E6l=z0T;E6l+=e6j;E6l+=J0d;E6l+=A8W;var d0d=K_S;d0d+=n5c;d0d+=O5K;var f0r=r$r8n[134240];f0r+=T0t;f0r+=r$r8n[134240];f0r+=u8s;var O3p=c0H;O3p+=Y7q;O3p+=I7Q;O3p+=p6g;var g20=A2o;g20+=r$r8n[625824];g20+=W$t;g20+=E6Z;var E1S=L91;E1S+=m4d;E1S+=r$r8n[625824];var R2Q=Z7B;R2Q+=r$r8n[214853];R2Q+=U0Q;R2Q+=r7N;var O70=W$t;O70+=Y8_;O70+=h8C;var e$n=h6t;e$n+=V7o;e$n+=Q1Z;e$n+=w7V;var G79=r40;G79+=u$n;G79+=d60;G79+=s6v;var V9f=r40;V9f+=A87;V9f+=V7o;var K3D=e1b;K3D+=N9A;var Z36=e1b;Z36+=Z7H;var b6W=Y3q;b6W+=d1X;b6W+=J2p;var s$n=e1b;s$n+=E$v;s$n+=M_8;var J7G=O$f;J7G+=r7N;var Q56=z_N;Q56+=Q1J;Q56+=z1o;var s15=H3k;s15+=Y7q;var q4r=y_P;q4r+=T8F;var G39=e1b;G39+=v1w;G39+=U4l;G39+=k5h;var y$5=g9j;y$5+=W$t;var X0Z=p$m;X0Z+=q6d;X0Z+=N1c;var a9i=j$H;a9i+=h5W;a9i+=p26;var K7c=E9Q;K7c+=r$r8n[134240];K7c+=g4R;var u4x=m$b;u4x+=W$t;var A7R=Y7q;A7R+=W$t;A7R+=T3N;var j2d=u80;j2d+=g4R;j2d+=W$t;var y8g=P9U;y8g+=Z8M;var i63=c0H;i63+=Y7q;var i3N=f3S;i3N+=W$t;i3N+=y$F;var M6T=Q1J;M6T+=y$F;M6T+=W$t;var F_j=Q1J;F_j+=y$F;var N0z=y$F;N0z+=Q1J;N0z+=r$r8n[625824];N0z+=W$t;var D4E=K2q;D4E+=Y7q;D4E+=a4x;D4E+=Y7q;var e25=s1H;e25+=s2L;var S5O=q6d;S5O+=c$r;var S0L=g4B;S0L+=T_8;var p1X=r$r8n.b9I;p1X+=R$h;p1X+=W$t;var g8p=r$r8n.b9I;g8p+=r$r8n[625824];g8p+=r7N;var F_4=r$r8n[214853];F_4+=r$r8n.b9I;F_4+=g4R;F_4+=W$t;var P5F=b7s;P5F+=r7N;var a7x=i2k;a7x+=W$t;a7x+=H6e;var O1y=R3z;O1y+=W$t;var m2e=W$t;m2e+=r$r8n[625824];m2e+=r$r8n.b9I;m2e+=Y7q;var b$i=p7s;b$i+=v1u;var Z7a=r$r8n[625824];Z7a+=s2U;Z7a+=W2w;var B0C=t_F;B0C+=R7G;var W2U=j2m;W2U+=E4x;var C2W=J0d;C2W+=h7d;var t9L=M4J;t9L+=X_0;t9L+=g4R;t9L+=W$t;var t_t=J0d;t_t+=q2q;var y3$=r$r8n[134240];y3$+=l1W;y3$+=u8s;var _this=this;this[h6B]=add;this[y3$]=ajax;this[A6S]=background;this[t_t]=blur;this[t9L]=bubble;this[C2W]=bubbleLocation;this[G75]=bubblePosition;this[r$L]=buttons;this[W2U]=clear;this[g0d]=close;this[B0C]=create;this[R5j]=undependent;this[Q44]=dependent;this[Z7a]=destroy;this[z78]=disable;this[p14]=display;this[H6u]=displayed;this[b$i]=displayNode;this[m2e]=edit;this[O1y]=enable;this[f8w]=error$1;this[a7x]=field;this[P5F]=fields;this[F_4]=file;this[j_m]=files;this[s_D]=get;this[I55]=hide;this[g8p]=ids;this[i2J]=inError;this[p1X]=inline;this[o17]=inlineCreate;this[S0L]=message;this[J92]=mode;this[S5O]=modifier;this[e25]=multiGet;this[D4E]=multiSet;this[N0z]=node;this[x$J]=off;this[F_j]=on;this[M6T]=one;this[i3N]=open;this[W_U]=order;this[L3A]=remove;this[i63]=set;this[y8g]=show;this[B4h]=submit;this[j2d]=table;this[A7R]=template;this[u4x]=title;this[K7c]=val;this[a9i]=_actionClass;this[l$0]=_ajax;this[X0Z]=_animate;this[F2j]=_assembleMain;this[e6o]=_blur;this[T93]=_clearDynamicInfo;this[y$5]=_close;this[G5u]=_closeReg;this[G39]=_crudArgs;this[q4r]=_dataSource;this[b$O]=_displayReorder;this[s15]=_edit;this[X41]=_event;this[U_a]=_eventName;this[Q56]=_fieldFromNode;this[E21]=_fieldNames;this[J7G]=_focus;this[C0E]=_formOptions;this[s$n]=_inline;this[b6W]=_inputTrigger;this[K4P]=_optionsUpdate;this[L1s]=_message;this[n5I]=_multiInfo;this[r9O]=_nestedClose;this[F5W]=_nestedOpen;this[Z36]=_postopen;this[K3D]=_preopen;this[j33]=_processing;this[Z5b]=_noProcessing;this[V9f]=_submit;this[g8r]=_submitTable;this[G79]=_submitSuccess;this[e$n]=_submitError;this[e7M]=_tidy;this[B1i]=_weakInArray;if(Editor[u45](init,cjsJq)){return Editor;}if(!(this instanceof Editor)){var T84=X33;T84+=J$h;T84+=n3q;T84+=e7D;alert(T84);}init=$[O70](w6a,{},Editor[R2Q],init);this[r$r8n.W1t]=init;this[r7N]=$[E1S](w6a,{},Editor[g20][O3p],{actionName:init[t4m],ajax:init[f0r],formOptions:init[d0d],idSrc:init[C2w],table:init[E6l] || init[p27],template:init[o9V]?$(init[T1z])[e$B]():J1q});this[Y6v]=$[c$9](w6a,{},Editor[b_M]);this[l2F]=init[W0v];Editor[S3l][B5M][B8o]++;var that=this;var classes=this[x_b];var wrapper=$(o92 + classes[X_C] + w5g + d5X + classes[F$W][W4q] + D6j + Q4R + classes[X2f][n8w] + w5g + L5E + classes[J1S][e2G] + J6E + U4J + g2E + classes[b7_][h5B] + w5g + a46 + classes[N9Y][w$T] + K25 + k1J + D9G);var form=$(V7C + classes[N1H][u5l] + a_i + A3G + classes[N1H][i31] + h06 + V6Z);this[K5E]={body:el(k6_,wrapper)[k70],bodyContent:el(W1u,wrapper)[k70],buttons:$(l_m + classes[o5u][B2$] + K25)[k70],footer:el(j69,wrapper)[k70],form:form[k70],formContent:el(L4U,form)[k70],formError:$(C1S + classes[N1H][f8w] + e7N)[k70],formInfo:$(K9l + classes[N1H][U8D] + z3o)[k70],header:$(v8v + classes[D8D][r4w] + z25 + classes[Y$T][t05] + J7Y)[k70],processing:el(W6g,wrapper)[k70],wrapper:wrapper[k70]};$[j0E](init[M7n],function(evt,fn){that[Q5i](evt,function(){var T0r=g4R;T0r+=T1d;T0r+=v0Z;var argsIn=[];for(var _i=k70;_i < arguments[T0r];_i++){argsIn[_i]=arguments[_i];}fn[w$N](that,argsIn);});});this[Z1F];if(init[l18]){this[h6B](init[K2U]);}$(document)[W8$](M_z + this[r7N][D3w],function(e,settings,json){var table=_this[r7N][Y5V];if(table){var dtApi=new DataTable[J_A](table);if(settings[F5C] === dtApi[Y5V]()[F_v]()){settings[B_E]=_this;}}})[Q5i](Z4R + this[r7N][d7t],function(e,settings){var t25="ngu";var F1J="oL";var E9c="ang";var u$7="nTa";var t19="oLa";var K4K=N96;K4K+=u6R;var table=_this[r7N][K4K];if(table){var m8T=u$7;m8T+=J0d;m8T+=g4R;m8T+=W$t;var dtApi=new DataTable[J_A](table);if(settings[m8T] === dtApi[Y5V]()[F_v]()){var P5e=t19;P5e+=t25;P5e+=Y$P;if(settings[P5e][F5G]){var b4r=B0M;b4r+=Y7q;b4r+=M3v;var n7f=F1J;n7f+=E9c;n7f+=u$n;n7f+=Y$P;var O0v=r$r8n.b9I;O0v+=r$r8n.G6G;O0v+=r$r8n.D$v;O0v+=y$F;var Y8H=l9k;Y8H+=W$t;Y8H+=y$F;Y8H+=r$r8n[625824];$[Y8H](w6a,_this[O0v],settings[n7f][b4r]);}}}})[Q5i](y00 + this[r7N][d7t],function(e,settings,json){var table=_this[r7N][Y5V];if(table){var b9_=y$F;b9_+=Y7e;var l74=O46;l74+=r$r8n.b9I;var dtApi=new DataTable[l74](table);if(settings[F5C] === dtApi[Y5V]()[b9_]()){_this[K4P](json);}}});if(!Editor[p14][init[p14]]){var l7o=J$7;l7o+=w4B;l7o+=f2D;l7o+=W2w;var f8x=t0m;f8x+=w3m;f8x+=b2u;throw new Error(f8x + init[l7o]);}this[r7N][E$9]=Editor[p14][init[p14]][t09](this);this[W_O](r4j,[]);$(document)[i1P](h3K,[this]);}Editor[d$h][e0u]=function(name,args){this[X41](name,args);};Editor[w6D][n6d]=function(){L7h.q_G();return this[C6W];};Editor[w6D][F2G]=function(){var m3_="In";var H0x=e1b;H0x+=s1H;H0x+=m3_;H0x+=T1l;return this[H0x]();};Editor[w6D][a3i]=function(){return this[r7N];};Editor[x7r]={checkbox:checkbox,datatable:datatable,datetime:datetime,hidden:hidden,password:password,radio:radio,readonly:readonly,select:select,text:text,textarea:textarea,upload:upload,uploadMany:uploadMany};Editor[j_m]={};Editor[h6E]=D6_;Editor[R6X]=classNames;Editor[h8g]=Field;Editor[P8P]=J1q;Editor[f8w]=error;Editor[e44]=pairs;Editor[p8J]=factory;Editor[x2B]=upload$1;Editor[S9G]=defaults$1;Editor[D75]={button:button,displayController:displayController,fieldType:fieldType,formOptions:formOptions,settings:settings};Editor[h88]={dataTable:dataSource$1,html:dataSource};L7h.g_4();Editor[y3W]={envelope:envelope,lightbox:self};Editor[J9c]=function(id){L7h.g_4();return safeDomId(id,Y5Y);};return Editor;})();DataTable[C2o]=Editor;$[P48][c27][C2o]=Editor;if(DataTable[P8P]){var j6U=x7g;j6U+=d1X;j6U+=r$r8n.b9I;j6U+=U4g;var R9p=x7g;R9p+=u8Q;Editor[R9p]=DataTable[j6U];}if(DataTable[e1O][W8w]){var l26=W$t;l26+=r$r8n[625824];l26+=W2$;l26+=Y$0;var q6b=W$t;q6b+=u8s;q6b+=Y7q;var Q1B=b7s;Q1B+=I70;$[e$$](Editor[Q1B],DataTable[q6b][l26]);}DataTable[l9k][T3U]=Editor[r0J];return DataTable[F4V];});})();

/*! Bootstrap integration for DataTables' Editor
 * © SpryMedia Ltd - datatables.net/license
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net-bs5', 'datatables.net-editor'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		var jq = require('jquery');
		var cjsRequires = function (root, $) {
			if ( ! $.fn.dataTable ) {
				require('datatables.net-bs5')(root, $);
			}

			if ( ! $.fn.dataTable.Editor ) {
				require('datatables.net-editor')(root, $);
			}
		};

		if (typeof window === 'undefined') {
			module.exports = function (root, $) {
				if ( ! root ) {
					// CommonJS environments without a window global must pass a
					// root. This will give an error otherwise
					root = window;
				}

				if ( ! $ ) {
					$ = jq( root );
				}

				cjsRequires( root, $ );
				return factory( $, root, root.document );
			};
		}
		else {
			cjsRequires( window, jq );
			module.exports = factory( jq, window, window.document );
		}
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document ) {
'use strict';
var DataTable = $.fn.dataTable;



// Note that in MJS `jQuery`, `DataTable` and `Editor` are imported with
// `jQuery` assigned to `let $`
// In UMD, `$` and `DataTable` are available

/*
 * Set the default display controller to be our bootstrap control
 */
DataTable.Editor.defaults.display = 'bootstrap';

/*
 * Change the default classes from Editor to be classes for Bootstrap
 */
$.extend(true, DataTable.Editor.classes, {
	header: {
		wrapper: 'DTE_Header',
		title: {
			tag: 'h5',
			class: 'modal-title'
		}
	},
	body: {
		wrapper: 'DTE_Body'
	},
	footer: {
		wrapper: 'DTE_Footer'
	},
	form: {
		tag: 'form-horizontal',
		button: 'btn',
		buttonInternal: 'btn btn-outline-secondary',
		buttonSubmit: 'btn btn-primary'
	},
	field: {
		wrapper: 'DTE_Field form-group row',
		label: 'col-lg-4 col-form-label',
		input: 'col-lg-8 DTE_Field_Input',
		error: 'error is-invalid',
		'msg-labelInfo': 'form-text text-secondary small',
		'msg-info': 'form-text text-secondary small',
		'msg-message': 'form-text text-secondary small',
		'msg-error': 'form-text text-danger small',
		multiValue: 'card multi-value',
		multiInfo: 'small',
		multiRestore: 'multi-restore'
	}
});

$.extend(true, DataTable.ext.buttons, {
	create: {
		formButtons: {
			className: 'btn-primary'
		}
	},
	edit: {
		formButtons: {
			className: 'btn-primary'
		}
	},
	remove: {
		formButtons: {
			className: 'btn-danger'
		}
	}
});

DataTable.Editor.fieldTypes.datatable.tableClass = 'table';

/*
 * Bootstrap display controller - this is effectively a proxy to the Bootstrap
 * modal control.
 */
let shown = false;
let fullyShown = false;

const dom = {
	content: $('<div class="modal fade DTED">' + '<div class="modal-dialog"></div>' + '</div>'),
	close: $('<button class="btn-close"></div>')
};
let modal;
let _bs = window.bootstrap;

DataTable.Editor.bootstrap = function (bs) {
	_bs = bs;
};

DataTable.Editor.display.bootstrap = $.extend(true, {}, DataTable.Editor.models.displayController, {
	/*
	 * API methods
	 */
	init: function (dte) {
		// Add `form-control` to required elements
		dte.on('displayOrder.dtebs open.dtebs', function () {
			$.each(dte.s.fields, function (key, field) {
				$('input:not([type=checkbox]):not([type=radio]), select, textarea', field.node()).addClass(
					'form-control'
				);

				$('input[type=checkbox], input[type=radio]', field.node()).addClass('form-check-input');

				$('select', field.node()).addClass('form-select');
			});
		});

		return DataTable.Editor.display.bootstrap;
	},

	open: function (dte, append, callback) {
		if (!modal) {
			modal = new _bs.Modal(dom.content[0], {
				backdrop: 'static',
				keyboard: false
			});
		}

		$(append).addClass('modal-content');
		$('.DTE_Header', append).addClass('modal-header');
		$('.DTE_Body', append).addClass('modal-body');
		$('.DTE_Footer', append).addClass('modal-footer');

		// Special class for DataTable buttons in the form
		$(append)
			.find('div.DTE_Field_Type_datatable div.dt-buttons')
			.removeClass('btn-group')
			.addClass('btn-group-vertical');

		// Setup events on each show
		dom.close
			.attr('title', dte.i18n.close)
			.off('click.dte-bs5')
			.on('click.dte-bs5', function () {
				dte.close('icon');
			})
			.appendTo($('div.modal-header', append));

		// This is a bit horrible, but if you mousedown and then drag out of the modal container, we don't
		// want to trigger a background action.
		let allowBackgroundClick = false;
		$(document)
			.off('mousedown.dte-bs5')
			.on('mousedown.dte-bs5', 'div.modal', function (e) {
				allowBackgroundClick = $(e.target).hasClass('modal') && shown ? true : false;
			});

		$(document)
			.off('click.dte-bs5')
			.on('click.dte-bs5', 'div.modal', function (e) {
				if ($(e.target).hasClass('modal') && allowBackgroundClick) {
					dte.background();
				}
			});

		var content = dom.content.find('div.modal-dialog');
		content.addClass(DataTable.Editor.display.bootstrap.classes.modal);
		content.children().detach();
		content.append(append);

		// Floating label support - rearrange the DOM for the inputs
		if (dte.c.bootstrap && dte.c.bootstrap.floatingLabels) {
			var floating_label_types = ['readonly', 'text', 'textarea', 'select', 'datetime'];
			var fields = dte.order();

			fields
				.filter(function (f) {
					var type = dte.field(f).s.opts.type;

					return floating_label_types.includes(type);
				})
				.forEach(function (f) {
					var node = $(dte.field(f).node());
					var wrapper = node.find('.DTE_Field_InputControl');
					var control = wrapper.children(':first-child');
					var label = node.find('label');

					wrapper.parent().removeClass('col-lg-8').addClass('col-lg-12');
					wrapper.addClass('form-floating');
					control.addClass('form-control').attr('placeholder', f);
					label.appendTo(wrapper);
				});
		}

		if (shown) {
			if (callback) {
				callback();
			}
			return;
		}

		shown = true;
		fullyShown = false;

		dom.content[0].addEventListener(
			'shown.bs.modal',
			function () {
				// Can only give elements focus when shown
				if (dte.s.setFocus) {
					dte.s.setFocus.focus();
				}

				fullyShown = true;

				dom.content.find('table.dataTable').DataTable().columns.adjust();

				if (callback) {
					callback();
				}
			},
			{ once: true }
		);

		dom.content[0].addEventListener(
			'hidden',
			function () {
				shown = false;
			},
			{ once: true }
		);

		$(dom.content).appendTo('body');

		modal.show();
	},

	close: function (dte, callback) {
		if (!shown) {
			if (callback) {
				callback();
			}
			return;
		}

		// Check if actually displayed or not before hiding. BS4 doesn't like `hide`
		// before it has been fully displayed
		if (!fullyShown) {
			dom.content[0].addEventListener(
				'shown.bs.modal',
				function () {
					DataTable.Editor.display.bootstrap.close(dte, callback);
				},
				{ once: true }
			);

			return;
		}

		dom.content[0].addEventListener(
			'hidden.bs.modal',
			function () {
				$(this).detach();
			},
			{ once: true }
		);

		modal.hide();

		shown = false;
		fullyShown = false;

		if (callback) {
			callback();
		}
	},

	node: function () {
		return dom.content[0];
	},

	classes: {
		modal: 'modal-dialog-scrollable modal-dialog-centered modal-lg'
	}
});


return DataTable.Editor;
}));


