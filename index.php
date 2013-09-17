<!DOCTYPE>
<html>
	<head>
		<title>Brand Information</title>
		<link rel="stylesheet/less" type="text/css" href="css/styles.less">

		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
		<script src="scripts/less-1.3.3.min.js" type="text/javascript"></script>
		<script src="scripts/script.js"></script>
	</head>
	<body>
		<select id="brands_select"></select>
		<table id="brands" border="1">
			<thead>
				<tr>
					<td>ID</td>
					<td>Brand ID</td>
					<td>Brand Name</td>
					<td>Brand URL</td>
					<td>Brand Type</td>
					<td>Brand Version</td>
					<td>Brand Features</td>
					<td>Account Manager</td>
					<td>Brand Langs</td>
				</tr>
			</thead>
			<tbody>
			</tbody>
		</table>
		<div class="container">
			<div class="header">
				<div class="field">Brand ID</div>
				<div class="field">Brand Name</div>
				<div class="field">Brand URL</div>
				<div class="field">Brand Type</div>
				<div class="field">Brand Version</div>
				<div class="field with_select">Brand Features</div>
				<div class="field">Account Manager</div>
				<div class="field with_select">Brand Langs</div>
			</div>
			<div class="main">
				<div class="field">
					<input type="text" value=""/>
				</div>
				<div class="field">
					<input type="text" value=""/>
				</div>
				<div class="field">
					<input type="text" value=""/>
				</div>
				<div class="field">
					<select id="brand_type" name="brand_type"></select>
				</div>
				<div class="field">
					<select id="brand_version" name="brand_version"></select>
				</div>
				<div class="field with_select">
					<div id="brand_features" class="custom_list"></div>
				</div>
				<div class="field">
					<select id="brand_account_manager" name="brand_account_manager"></select>
				</div>
				<div class="field with_select">
					<div id="brand_langs" class="custom_list"></div>
				</div>
			</div>	
		</div>
		<div id="update" class="button">Update</div>
		<div id="add_new" class="button">Add New Brand</div>
		<div class="develop">
			<textarea name="sql" id="sql_test_query" cols="30" rows="10" style="width:400px;"></textarea>
			<div id="sql_test" class="button">SQL Execute</div>
			<div id="sql_result"></div>
		</div>
	</body>
</html>