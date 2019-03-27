<?php

Yii::import("parsedown.Parsedown", true);
$Parsedown = new Parsedown();

?>
<style type="text/css">
	
h1 {
	font-size: 16px;
}

.blue{
	color : #195391;
}

.lightgreen{
	color : #a9ce3f;
}

.darkgreen{
	color : #4db88c;
}

.body { 
	font-family: Arial,Helvetica Neue,Helvetica,sans-serif; 
}

table.first {
        color: #003300;
        font-family: helvetica;
        border: 3px solid black;
    }

table.first td {
        border: 1px solid black;
        font-size: 8pt;
    }

table.first td .entete {
         font-size: 10pt;
         font-weight: bold;
    }

</style>

<div class="body">
	<span style="text-align: center;">
		<h1 class="blue"> <?php echo $elt["name"] ?> </h1>
		<span class="darkgreen">Identifiant :</span>
		<span class="lightgreen"><?php echo (String) $elt["_id"]; ?>
		</span>
	</span>


	<div class='col-xs-12'>
		<?php 
		$exept  = array('_id', 'name');
		$str = "";
		foreach ($elt as $key => $value) {

			if(!in_array($key, $exept)){
				$str .= '<h4 class="padding-20 blue" style="">'.$key.'</h4>'.is_array($value);
			 	if(!empty($value)){
			 		if(is_string($value) === true){
			 			//$str .= $value;
			 			$str .= '<span>'.$Parsedown->text($value).'</span>';
			 		}else if(is_array($value) === true){
				 			
			 			foreach ($value as $keyV => $valV) {
			 				if(is_string($valV) === true){
					 			$str .= '<span>'.$Parsedown->text($valV).'</span>';
					 		}
			 			}
				 		 
			 		} 
					
				} else
					$str .= "<i> Pas renseigner </i>";
				$str .= '<br/>';
			}
		}

		echo $str ;

		?>
	</div>
</div>