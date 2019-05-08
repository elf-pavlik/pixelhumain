<?php   
    $color1="#354c57";
    $color2="#e6344d";
    $background="background:white";
    $logoLoader=Yii::app()->theme->baseUrl.'/assets/img/LOGOS/'.Yii::app()->params["CO2DomainName"].'/logo.png';
    if(isset(Yii::app()->session['costum'])){
        if(isset(Yii::app()->session['costum']["logo"]))
            $logoLoader= Yii::app()->session['costum']["logo"];
        if(isset(Yii::app()->session['costum']["css"]) && isset(Yii::app()->session['costum']["css"]["loader"])){
            if(isset(Yii::app()->session['costum']["css"]["loader"]["background"]))
                $background="background:".Yii::app()->session['costum']["css"]["loader"]["background"];
            if(isset(Yii::app()->session['costum']["css"]["loader"]["ring1"]))
                $styleRing1=setLoader(Yii::app()->session['costum']["css"]["loader"]["ring1"]);
            if(isset(Yii::app()->session['costum']["css"]["loader"]["ring2"]))
                $styleRing2=setLoader(Yii::app()->session['costum']["css"]["loader"]["ring2"]);
        }
    } 
    function setLoader($p){
        $style="";    
        foreach($p as $k => $v){
            if($k=="color")
                $style.="border-color: transparent ".$v." transparent ".$v.";";
            else if($k=="borderWidth")
                $style.="border-width:".$v."px;";
            else
                $style.=$k.":".$v."px;";
        }
        return $style;
    }
?>
<div id="loadingModal" style="<?php echo $background ?>">
    <div class="lds-css ng-scope">
        <div style="width:100%;height:100%" class="lds-dual-ring">
            <img src="<?php echo $logoLoader ?>" class="loadingPageImg" height=80>
            <div style="<?php echo $styleRing2 ?>"></div>
            <div style="<?php echo $styleRing1 ?>"></div>
        </div>
    </div>
</div>
<script type="text/javascript">
    jQuery(document).ready(function() { 
        topImg=($(window).height()-$("#loadingModal .lds-css").outerHeight())/2;
        $("#loadingModal .lds-css").css({"top":topImg+"px"});
    });
</script>