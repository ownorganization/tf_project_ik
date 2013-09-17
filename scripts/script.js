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

		$tableBody.html("");
		$.each(object, function(i, val){
			tableRow = "<tr>{0}</tr>";
			tableRowTemp = "";

			$.each(val, function(key, value) {
				
				if(typeof value == 'object') {
					console.log(value);
					var tempValue = "";
					$.each(value, function(index, v) {
						tempValue += "<div value=" + v.id + ">" + v.name + "</div>";
					});
					value = tempValue;	
				}
				tableRowTemp += '<td>' + value + '</td>';
			});
			tableRow = tableRow.format( tableRowTemp );

			$tableBody.append( tableRow );
		});
	}
}

$.fn.updateSelect = function(params, callback, default_callback) {
	var $select = $(this);
	var selectOption = "<option value='{0}'>{1}</option>";
	var collectedHtml = params.default_text ? selectOption.format( 0, params.default_text ) : "";


	$select.html("");
	$.each(params.data, function(i, value){
		collectedHtml += selectOption.format( value[params.value], value[params.text] );
	});
	$select.append( collectedHtml );

	$select.change( function(e) {
		if($(this).val() != 0)
			callback.apply(this, e);
		else if(default_callback)
			default_callback.apply(this, e);
	});
}

$.fn.selectWithCheckbox = function(params, callback) {
	var $select = $(this);
	var selectOptionTL = "<div value='{0}' class='list_item{2}'>{1}</div>";
	var selectGroupTL = "<div class='group_list_item{1}'><div class='group_name'>{0}</div>{2}</div>";
	var selectOption = "";
	var selectGroup = "";
	var prevGroup = 0;
	var collectedHtml = "";


	$select.html("");
	$.each(params.data, function(i, value){
		if( params.group_by && params.group_name ) {
			if(prevGroup != 0 && prevGroup != value[params.group_by]) {
				selectGroup = selectGroup.format( "", "", selectOption );
				collectedHtml += selectGroup;
				selectOption = "";
			}
			selectGroup = selectGroupTL.format( value[params.group_name], (value[params.available] == "1" || !params.available) ? " available": "" );

			prevGroup = value[params.group_by];
		} else {
			collectedHtml += selectOptionTL.format( value[params.value], value[params.text], ((value[params.checked] == "1") ? " checked": "") );
		}
		selectOption += selectOptionTL.format( value[params.value], value[params.text], ((value[params.checked] == "1") ? " checked": "") );

		if(i == params.data.length - 1) {
			selectGroup = selectGroup.format( "", "", selectOption );
			collectedHtml += selectGroup;
		}
	});
	$select.append( collectedHtml );

	$select.find( ((params.group_by && params.group_name) ? ".available " : "") + ".list_item").on("click", function(){
		$(this).toggleClass("checked");
	});
	$select.change( function(e) {
		callback.apply(this, e);
	});
}

function initUpdateSetion() {
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
		fileds: ["id", "version_name"] 
	}, function(dataObject) {
		$("#brand_version").updateSelect({
			data: dataObject, 
			text: "version_name", 
			value: "id",
			default_text: "Select Version" 
		}, function(e) {
			DB.execMethod({ 
				method: "selectFeaturesList",
				version_id: $(this).val()
			}, function(dataObject) {
				$("#brand_features").selectWithCheckbox({
					data: dataObject, 
					text: "feature_name", 
					value: "id",
					group_by: "version_order_index",
					group_name: "version_name",
					checked: "checked",
					available: "available"
				}, function(e) {
					
				});
			});
		}, function(e) {
			$("#brand_features").html("");
		});
	});

	DB.execMethod({ 
		method: "selectTableFields",
		table: "tf_members",
		fileds: ["id", "member_id"] 
	}, function(dataObject) {
		$("#brand_account_manager").updateSelect({
			data: dataObject, 
			text: "member_name", 
			value: "id" 
		}, function(e) {
			
		});
	});

	DB.execMethod({ 
		method: "selectTableFields",
		table: "brand_langs",
		fileds: ["id", "lang_name", "lang_code"] 
	}, function(dataObject) {
		$("#brand_langs").selectWithCheckbox({
			data: dataObject, 
			text: "lang_name", 
			value: "id" 
		}, function(e) {
			
		});
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

	DB.exec("SELECT * FROM brands", function(dataObject) {
		Helper.updateTable("brands", dataObject);
	});

	$("#add_new").on("click", function() {
		alert("Add New");
		console.log("select id,lang_name,brand_id IS NOT NULL AS checked from brand_langs LEFT JOIN brand_lang_rel on brand_id = 1 and brand_lang_rel.lang_id = brand_langs.id");
		console.log("SELECT distinct bv2.version_order_index is not null as available, bv.version_order_index, bv.version_name, bf.feature_name, bf.feature_is_default FROM brand_versions AS bv inner JOIN brand_features AS bf ON bv.id=bf.version_id left JOIN brand_versions AS bv2 ON bv2.version_order_index<=(SELECT version_order_index FROM brand_versions WHERE id=3) and bv2.id=bf.version_id ORDER BY bv.version_order_index DESC");
	});

	initUpdateSetion();

	$("#sql_test").on("click", function(){
		var query = $("#sql_test_query").val();
		DB.exec(query, function(dataObject) {
			
		});
	});
});