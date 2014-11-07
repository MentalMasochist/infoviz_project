<html>
<body>

<?php

print_r($_POST);

// define variables
$form_subjects = $_POST["subjects"];
$form_authors = $_POST["authors"];
$form_keywords = $_POST["keywords"];

// check if inputs exist
if (empty($form_subjects)) {
	$active_subjects = FALSE; 
} else {
	$active_subjects = TRUE;
	$arr_subjects = explode(",", $form_subjects);
}

if (empty($form_authors)) {
	$active_authors = FALSE;
} 	else {
	$active_authors = TRUE;
	$arr_authors = explode(",", $form_authors);
}

if (empty($form_keywords)) {
	$active_keywords = FALSE;
} else {
	$active_keywords = TRUE;
	$arr_keywords = explode(",", $form_keywords);
	foreach ($arr_keywords as &$value) {
		$value = '+'.trim($value);
	}
	foreach ($arr_keywords as &$value) {
		echo $value.'<br>';
	}
}

/////////////////////////////////////////
// trim data
// check for spaces
// check for phrases
//
?>

</body>
</html>