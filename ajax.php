<?
	function ajax_error($error_text) {
		return "Custom ajax ERROR: " . $error_text;
	}

	function execQuery($query, $con, $onerow = false) {
		$result = mysql_query($query, $con);

		$objJSON = array();
		if($result) {
			while($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
				if($onerow) {
					$objJSON = $row;
				} else {
					$objJSON[] = $row;
				}
			}
		}
		return $objJSON;
	}

	$request = $_POST['request'];

	//connection to DB
	$con = mysql_connect("localhost", "root", "BnMZFZwX59");
	if (!$con) {
	    die(ajax_error(mysql_error()));
	}

	mysql_select_db("tf_db", $con);

	//Choose what SQL should be executed
	if(array_key_exists("query", $request)) {
		$query = $request["query"];
		echo json_encode(execQuery($query, $con));
	} else {
		switch($request["method"]) {
			case "selectTableFields":
				$query = "SELECT " . (array_key_exists("fields", $request) ? implode(",", $request["fields"]) : "*") . " FROM " . $request["table"] . ((!empty($request["order_by"]) ? " ORDER BY " . $request["order_by"]["field"] . " " . $request["order_by"]["type"] : ""));
				echo json_encode(execQuery($query, $con));
				break;
			case "selectPersonesList":
				$query = "SELECT br_m_r_r.brand_id, tf_m.member_name, tf_m_r.id, tf_m_r.role_name
						  FROM tf_members AS tf_m
						  INNER JOIN brand_member_role_rel AS br_m_r_r
							ON tf_m.id=br_m_r_r.member_id
						  INNER JOIN tf_member_roles AS tf_m_r
							ON br_m_r_r.role_id=tf_m_r.id
						  WHERE br_m_r_r.brand_id=" . $request["brand_id"];
				echo json_encode(execQuery($query, $con));
				break;
			case "selectLangs":
				$query = "SELECT id,lang_name,brand_id IS NOT NULL AS checked from brand_langs LEFT JOIN brand_lang_rel on brand_id = " . $request["brand_id"] . " AND brand_lang_rel.lang_id = brand_langs.id";
				echo json_encode(execQuery($query, $con));
				break;
			case "selectPersones": 
				$query = "SELECT tf_m_r.id, tf_m_r.role_name, tf_m.id AS member_id, tf_m.member_name FROM tf_member_roles AS tf_m_r INNER JOIN tf_members AS tf_m ORDER BY tf_m_r.id";
				echo json_encode(execQuery($query, $con));
				break;	
			case "selectFeaturesList":
				$query = "SELECT bf.id as feature_id, bf.version_id, version_name, feature_name, feature_is_default as checked
						  FROM brand_versions AS bv
						  INNER JOIN brand_features AS bf
    					  ON bv.id=bf.version_id ORDER BY version_order_index DESC";
				echo json_encode(execQuery($query, $con));
				break;	
			case "selectBrandInfo":
				$query = "SELECT * FROM brands where id=" . $request["brand_id"];
				$result = execQuery($query, $con);

				$query = "SELECT type_name FROM brand_types where id=(SELECT type_id FROM brand_type_rel WHERE brand_id=" . $request["brand_id"] .")";
				$brand_type = execQuery($query, $con, true);
				$brand_type = array_key_exists("type_name", $brand_type) ? $brand_type["type_name"] : "undefined";
				$result[0]["type"] = $brand_type;

				$query = "SELECT version_name FROM brand_versions where id=(SELECT version_id FROM brand_version_rel WHERE brand_id=" . $request["brand_id"] .")";
				$brand_version = execQuery($query, $con, true);
				$brand_version = array_key_exists("version_name", $brand_version) ? $brand_version["version_name"] : "undefined";
				$result[0]["version"] = $brand_version;

				$query = "SELECT id,feature_name AS name FROM brand_features where id in (SELECT feature_id FROM brand_feature_rel WHERE brand_id=" . $request["brand_id"] . " and feature_is_checked=1)";
				$brand_features = execQuery($query, $con);
				$result[0]["features"] = $brand_features;

				/*$query = "SELECT member_name FROM tf_members where id=(SELECT member_id FROM brand_member_role_rel WHERE brand_id=" . $request["brand_id"] . " and role_id='1' )";
				$brand_account_manager = execQuery($query, $con, true);
				$brand_account_manager = array_key_exists("member_name", $brand_account_manager) ? $brand_account_manager["member_name"] : "undefined";
				$result[0]["account_manager"] = $brand_account_manager;*/

				$query = "SELECT tf_m.id AS id, tf_m.member_name AS name, tf_m_r.id AS group_id, tf_m_r.role_name AS group_name
						  FROM tf_members AS tf_m
						  INNER JOIN brand_member_role_rel AS br_m_r_r
							ON tf_m.id=br_m_r_r.member_id
						  INNER JOIN tf_member_roles AS tf_m_r
							ON br_m_r_r.role_id=tf_m_r.id
						  WHERE br_m_r_r.brand_id=" . $request["brand_id"];
				$brand_persones = execQuery($query, $con);
				$result[0]["brand_persones"] = $brand_persones;

				$query = "SELECT id,lang_name AS name FROM brand_langs where id in (SELECT lang_id FROM brand_lang_rel WHERE brand_id=" . $request["brand_id"] . " )";
				$brand_langs = execQuery($query, $con);
				$result[0]["langs"] = $brand_langs;
				
				echo json_encode($result);
				break;
			case "UpdateBrandInfo":
			
				break;
			case "CreateBrandInfo":
			
				break;		
			default:
				die(ajax_error("Unknown request"));
				break;
		}
	}

	mysql_close($con);
?>