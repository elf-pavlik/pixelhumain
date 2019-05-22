<style type="text/css">
<?php if(isset(Yii::app()->session["costum"]) 
		&& isset(Yii::app()->session["costum"]["css"]) 
		&& isset(Yii::app()->session["costum"]["css"]["progress"])){
    		if(isset(Yii::app()->session["costum"]["css"]["progress"]["bar"]) ){ ?>
    			.progressTop::-webkit-progress-bar { background: <?php echo Yii::app()->session["costum"]["css"]["progress"]["bar"]["background"] ?>;}
    		<?php }
    		if(isset(Yii::app()->session["costum"]["css"]["progress"]["value"]) ){ ?>
        		.progressTop::-webkit-progress-value{background: <?php echo Yii::app()->session["costum"]["css"]["progress"]["value"]["background"] ?>;}
        		.progressTop::-moz-progress-bar{background: <?php echo Yii::app()->session["costum"]["css"]["progress"]["value"]["background"] ?>;}
        	<?php }
} ?>
</style>
<progress class="progressTop" max="100" value="20"></progress>   
       