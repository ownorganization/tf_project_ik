String.prototype.format = function() {
    var formatted = this;
    for(arg in arguments) {
        formatted = formatted.replace("{" + arg + "}", arguments[arg]);
    }
    return formatted;
};

var DEV = {
	output: function(inp) {
		inp = JSON.stringify(inp, undefined, 4);
	    $("#sql_result").html("<pre>" + DEV.syntaxHighlight(inp) + "</pre>");
	},
	syntaxHighlight: function(json) {
	    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
	        var cls = 'number';
	        if (/^"/.test(match)) {
	            if (/:$/.test(match)) {
	                cls = 'key';
	            } else {
	                cls = 'string';
	            }
	        } else if (/true|false/.test(match)) {
	            cls = 'boolean';
	        } else if (/null/.test(match)) {
	            cls = 'null';
	        }
	        return '<span class="' + cls + '">' + match + '</span>';
	    });
	}
}
/**
 * Help to work with database
 * @exec: execute direct SQL query string and return result
 * @execMethod: request specific method which return result according to php logic
*/
var DB = {
	exec: function(query, callback) {
		$.post("ajax.php", { request: { query: query } }, function(data) {
			var response = JSON.parse(data);
			console.log(query, response);
			DEV.output({
				query: query,
				response: response
			});
			callback( response );
		});
	},
	execMethod: function(data, callback) {
		$.post("ajax.php", { request: data }, function(response) {

			try {
				response = JSON.parse(response);
				console.log("AJAX", data, response);
				callback( response );
			} catch(e) {
				console.log(response);
			} 
		});
	}
}

/**
 * Helps to work with HTML
 * @updateSelect: update select with given data object
*/
var Helper = {
	updateElement: function(elementID, object, wrap) {
		var $elementBody = $( "#"+elementID );
		var elementRowTemp = "";
		var collectedHtml = "";

		$elementBody.html("");
		$.each(object, function(i, val){
			console.log(i, val)
			elementRowTemp = "";

			$.each(val, function(key, value) {
				elementRowTemp += wrap.column.format( value, wrap.columnClass + '_' + ( ( wrap.rowClass ) ? value[wrap.columnClass] : value ), ( wrap.rowClass ) ? value[wrap.columnClass] : value );
			});

			if( wrap.row ) {
				var elementRow = wrap.row;
				collectedHtml += elementRow.format( elementRowTemp, wrap.rowClass + '_' + val[wrap.rowClass] );
			} else {
				collectedHtml += elementRowTemp;
			}

		});

		$elementBody.append( collectedHtml );
	},
	updateTable: function(tableID, object) {
		var $tableBody = $("#"+tableID+" tbody");
		var tableRow = "";
		var tableRowTemp = "";
		var tempValueGroupTL = "<div class='group_wrap' value='{0}'><div class='group_name'>{1}</div>{2}</div>";

		$tableBody.html("");
		$.each(object, function(i, val){
			tableRow = "<tr>{0}</tr>";
			tableRowTemp = "";

			$.each(val, function(key, value) {
				
				if(typeof value == 'object') {
					console.log(value);
					var tempValue = "";
					var tempGroupValue = "";
					$.each(value, function(index, v) {
						tempValue += "<div value=" + v.id + ">" + v.name + "</div>";
						if(v.group_name && v.group_id) {
							tempGroupValue += tempValueGroupTL.format(v.group_id, v.group_name, tempValue);
							tempValue = "";
						}
					});
					value = (tempGroupValue) ? tempGroupValue : tempValue;
				}

				tableRowTemp += '<td>' + value + '</td>';
			});
			tableRow = tableRow.format( tableRowTemp );

			$tableBody.append( tableRow );
		});
	}
}
$(function() {
	$.fn.updateSelect = function(params, callback, default_callback) {
		var $select = $(this);
		var selectOption = "<option value='{0}' {2}>{1}</option>";
		var collectedHtml = params.default_text ? selectOption.format( 0, params.default_text, "" ) : "";
		var hasSelected = (params.default_changeable) ? true : false;


		$select.html("");
		$.each(params.data, function(i, value){
			collectedHtml += selectOption.format( value[params.value], value[params.text], (value[params.selected] == 1) ? "selected" : "" );
			if(value[params.selected] == 1)
				hasSelected = true;
		});
		$select.append( collectedHtml );

		//init select
		if(hasSelected) {
			callback.apply($select);
		}

		//update select
		$select.change( function(e) {
			if($(this).val() != 0 || params.default_changeable)
				callback.apply(this, e);
			else if(default_callback)
				default_callback.apply(this, e);
		});
	}
});

(function($) {

    var methods = {
        init : function(options) {
        	if(!this.data("initiated")) {
        		console.log("Initating ", this.attr("id"))
	            if(options) {
	                var params = $.extend({
						text: "", 
						value: "",
						type: "",
						initFunction : function(){}
					}, options);
	            }

	            params.selectOptionTL = (params.type == 'select') ? "<option value='{0}'>{1}</option>" : "<div value='{0}' class='list_item{2}'>{1}</div>";
				params.selectGroupTL = (params.type == 'select') ? "<div class='group_list_item{2}' value='{0}'><div class='group_name'>{1}</div><select class='list_select'><option value='0'>Not Selected</option>{3}</select></div>" : "<div class='group_list_item{2}' value='{0}'><div class='group_name'>{1}</div>{3}</div>";
	           	
	           	this.data("data", params.data);
	           	this.data("work", params);
	           	this.data("initiated", true);

	           	var _$thisObject = this;
        		this.data("work").initFunction.call(this, function(ajaxDataObject) {

					if(params.onUpdateFunction) {
						params.onUpdateFunction.call(_$thisObject, function(updatedObject) {
							_$thisObject.data("data", updatedObject);
							methods.generate.apply(_$thisObject);
						}, ajaxDataObject);
					} else {
						_$thisObject.data("data", ajaxDataObject);
						methods.generate.apply(_$thisObject);
					}
					_$thisObject.data("data", ajaxDataObject);
					methods.generate.apply(_$thisObject);

				}, this.data("initiated"));

        	} else {
        		var _listData = this.data("data");
        		var _workData = this.data("work");
        		var _$thisObject = this;

        		if(_workData.onUpdateFunction) {
					_workData.onUpdateFunction.call(this, function(updatedObject) {
						_$thisObject.data("data", updatedObject);
						methods.generate.apply(_$thisObject);
					}, _listData);
				}
        	}
        }, 
        getData: function(values, returnedData) {
        	var _listData = this.data("data");
        	returnedData = [];

        	$.each(_listData, function(i, listDataItem) {
        		returnedData[i] = {};
        		 $.each(values, function(index, val) {
        		 	 returnedData[i][val] = listDataItem[val];
        		 });
        	});

        	return returnedData;
        },
        generate: function() {
        	var _listData = this.data("data");
        	var _workData = this.data("work");
        	//console.log("generate",_listData, this.data("data"), _workData, this.data("work") )

        	var selectOption = "";
			var selectGroup = "";
			var prevGroup = 0;
			var collectedHtml = "";
        	
        	this.html("");
			$.each(_listData, function(i, value){
				if( _workData.group_by && _workData.group_text ) {
					if(prevGroup != 0 && prevGroup != value[_workData.group_by]) {
						selectGroup = selectGroup.format("", "", "", selectOption );
						collectedHtml += selectGroup;
						selectOption = "";
					}
					selectGroup = _workData.selectGroupTL.format( value[_workData.group_value], value[_workData.group_text], (value[_workData.available] == "1" || !_workData.available) ? " available": "" );

					prevGroup = value[_workData.group_by];
				} else {
					collectedHtml += _workData.selectOptionTL.format( value[_workData.value], value[_workData.text], ((value[_workData.checked] == "1") ? " checked": "") );
				}
				selectOption += _workData.selectOptionTL.format( value[_workData.value], value[_workData.text], ((value[_workData.checked] == "1") ? " checked": "") );

				if(i == _listData.length - 1) {
					selectGroup = selectGroup.format("", "", "", selectOption );
					collectedHtml += selectGroup;
				}
			});

			this.append( collectedHtml );

			var _$thisObject = this;
			this.find( ((_workData.group_by && _workData.group_text) ? ".available " : "") + ".list_item").on("click", function(){
				$(this).toggleClass("checked");

				var _listData = _$thisObject.data("data");
				var _workData = _$thisObject.data("work");
				var checkedValue = $(this).attr("value");
				var isChecked = $(this).hasClass("checked") ? "1" : "0";

				$.each(_listData, function(i, value) {
					if(value[_workData.value] == checkedValue) {
						_listData[i].checked = isChecked;
					}
				});

				_$thisObject.data("data", _listData);
			});
        }
    };
    $.fn.customList = function(method) {
        var outerArguments = arguments;

        if ( methods[method] ) {
            return methods[method].apply( $(this), Array.prototype.slice.call( outerArguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( $(this), Array.prototype.slice.call( outerArguments, 0 ) );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.plugin' );
        }  
    };

}(jQuery));

function initCreateSetion() {
	DB.execMethod({ 
		method: "selectTableFields",
		table: "brand_types",
		fileds: ["id", "type_name"] 
	}, function(dataObject) {
		$("#brand_type").updateSelect({
			data: dataObject, 
			text: "type_name", 
			value: "id" 
		}, function(e) {
			
		});
	});

	DB.execMethod({ 
		method: "selectTableFields",
		table: "brand_versions",
		fileds: ["id", "version_name"],
		order_by: {
			field: "version_order_index",
			type: "DESC"
		} 
	}, function(dataObject) {

		var initiated = 0;
		$("#brand_version").updateSelect({
			data: dataObject, 
			text: "version_name", 
			value: "id",
			default_text: "Select Version",
			default_changeable: true 
		}, function(e) {
			var $this = $(this);

			$("#brand_features").customList("init", {
				text: "feature_name", 
				value: "feature_id",
				group_by: "version_id",
				group_value: "version_id",
				group_text: "version_name",
				checked: "checked",
				available: "available",
				initFunction: function(return_function, initiated) {
					if(initiated) {
						DB.execMethod({ 
							method: "selectFeaturesList"
						}, function(dataObject) {
							return_function(dataObject);
						});
					}
				},
				onUpdateFunction: function(return_function, dataObject) {
					var selected_version_id = $this.val();

					var available = 0;
					$.each(dataObject, function(i, value){
						if(!available && selected_version_id == value.version_id) 
							available = 1;

						dataObject[i]["available"] = available;
					});

					return_function(dataObject);
				}
			});

		}, function(e) {
			$("#brand_features").html("");
		});
	});

	$("#brand_persones").customList("init", {
		text: "member_name", 
		value: "member_id",
		group_by: "id",
		group_text: "role_name",
		type: "select",
		initFunction: function(return_function, initiated) {
			if(initiated) {
				DB.execMethod({ 
					method: "selectPersones"
				}, function(dataObject) {
					return_function(dataObject);
				});
			}
		}
	})

	$("#brand_langs").customList("init", { 
		text: "lang_name", 
		value: "id", 
		initFunction: function(return_function, initiated) {
			if(initiated) {
				DB.execMethod({ 
					method: "selectTableFields",
					table: "brand_langs",
					fileds: ["id", "lang_name", "lang_code"] 
				}, function(dataObject) {
					return_function(dataObject);
				});
			}
		}
	});

	$("#update").on("click", function() {
		var brand_id = $(this).val();
		
		DB.execMethod({ 
			method: "updateBrandInfo",
			brand_id: brand_id
		}, function(dataObject) {
			Helper.updateTable("brands", dataObject);
		});
	});

	$("#add_new").on("click", function() {
		//alert("Add New");
		//Collect all data for new brand

		var features = $("#brand_features").customList("getData", ["feature_id", "checked"]);

		DEV.output(features);
	});
}

$(function() {

	DB.execMethod({ 
		method: "selectTableFields", 
		table: "brands", 
		fileds: ["id", "brand_name"] 
	}, function(dataObject) {
		$("#brands_select").updateSelect({
			data: dataObject, 
			text: "brand_name", 
			value: "id" 
		}, function(e){
			var brand_id = $(this).val();

			DB.execMethod({ 
				method: "selectBrandInfo",
				brand_id: brand_id
			}, function(dataObject) {
				Helper.updateTable("brands", dataObject);
			});

			console.log( brand_id );
		});
	});

	initCreateSetion();

	$("#sql_test").on("click", function(){
		var query = $("#sql_test_query").val();
		DB.exec(query, function(dataObject) {
			
		});
	});
});