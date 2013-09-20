<?php

$mysqli = new mysqli("localhost", "root", "BnMZFZwX59", "tf_db");

/* check connection */
if (mysqli_connect_errno()) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}

$switch=0;

if ($switch == 0) {

	/*--------PRE INSERT INFO------------*/

	$brand_id=1; // BRAND_ID FROM MYSQL

	$features_arr = array(
	  array(
	    "feature_id" => 10,
	    "feature_is_checked" => 0
	  ),
	  array(
	    "feature_id" => 11,
	    "feature_is_checked" => 1
	  )
	);

	$langs_arr = array(
	  array(
	    "lang_id" => 4
	  ),
	  array(
	    "lang_id" => 5
	  )
	);

	/*--------brand_feature_rel TOOLS------------*/
    foreach( $features_arr as $row_f ) {
    	$insert_features[] = '(@id_brand_var, ' .$row_f['feature_id'].',' .$row_f['feature_is_checked'].')';
	}
	/*--------barnd_lang_rel TOOLS------------*/
    foreach( $langs_arr as $row_l ) {
    	$insert_langs[] = '(@id_brand_var, ' .$row_l['lang_id'].')';
	}	
	/*-----------DB INSERT START-----------*/
	/* set autocommit to off */
	$mysqli->autocommit(FALSE);

	$query = "INSERT INTO brands (brand_id, brand_name, brand_url) VALUES (240, 'Insert Brand name', 'url'); ";
	$query.= "SELECT @id_brand_var:=id FROM brands WHERE brand_id = 240; ";
	$query.= "INSERT INTO brand_type_rel (brand_id, type_id) VALUES (@id_brand_var, 2); ";
	$query.= "INSERT INTO brand_version_rel (brand_id, version_id) VALUES (@id_brand_var, 7); ";
	$query.= 'INSERT INTO brand_lang_rel (brand_id, lang_id) VALUES '.implode(',', $insert_langs).'; ';
	$query.= 'INSERT INTO brand_feature_rel (brand_id, feature_id, feature_is_checked) VALUES '.implode(',', $insert_features).'; ';
	
	/* commit transaction */
	$mysqli->commit();

	/* turn autocommit on */
	$mysqli->autocommit(TRUE);

	$result = $mysqli->multi_query($query);

	/*-----------DB INSERT END-----------*/

	$switch == 1;

	if ($result==TRUE){ 
		echo "GOOD ".'<br>';
		echo ($query);
	}	
	else
	{
	echo "BAD ".mysqli_error($mysqli).'<br>';
	echo ($query);
	}
}

?>