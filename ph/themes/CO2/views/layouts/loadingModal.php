<?php   
    $styleRing1="border-color: transparent #354c57 transparent #354c57;border-width:2px;";
    $styleRing2="border-color: transparent #e6344d transparent #e6344d;border-width:2px;";
    $background="background:white";
    $refBiggerRing=320;
    $refSmallerRing=300;
    $logoLoader=Yii::app()->theme->baseUrl.'/assets/img/LOGOS/'.Yii::app()->params["CO2DomainName"].'/logo.png';
    if(isset(Yii::app()->session['costum'])){
        if(isset(Yii::app()->session['costum']["logo"]))
            $logoLoader= Yii::app()->session['costum']["logo"];
        if(isset(Yii::app()->session['costum']["css"]) && isset(Yii::app()->session['costum']["css"]["loader"])){
            if(isset(Yii::app()->session['costum']["css"]["loader"]["background"]))
                $background="background:".Yii::app()->session['costum']["css"]["loader"]["background"];
            if(isset(Yii::app()->session['costum']["css"]["loader"]["ring1"])){
                $ring1=Yii::app()->session['costum']["css"]["loader"]["ring1"];
                if(isset($ring1["height"])){ 
                    if($ring1["height"] > $refBiggerRing)
                        $refBiggerRing=$ring1["height"];
                    else
                        $refSmallerRing=$ring1["height"];
                }
                $styleRing1=setLoader($ring1);
            }
            if(isset(Yii::app()->session['costum']["css"]["loader"]["ring2"])){
                $ring2=Yii::app()->session['costum']["css"]["loader"]["ring2"];
                if(isset($ring2["height"])){ 
                    if($ring2["height"] > $refBiggerRing)
                        $refBiggerRing=$ring2["height"];
                    else
                        $refSmallerRing=$ring2["height"];
                }
                $styleRing2=setLoader($ring2);
            }
        }
    } 
    function setLoader($p){
        $style="";    
        foreach($p as $k => $v){
            if($k=="color")
                $style.="border-color: transparent ".$v." transparent ".$v.";";
            else if($k=="borderWidth")
                $style.="border-width:".$v."px;";
        }
        return $style;
    }
    $diffPos=($refBiggerRing-$refSmallerRing)/2;
    $marginImg=($refSmallerRing-100)/2;
?>
<style type="text/css">
    <?php 
        for ($i = 300; $i <= 2000;$i=$i+100) {
            $top=($i-$refBiggerRing)/2;
            ?>
           @media (min-height:<?php echo $i ?>px) and (max-height:<?php echo $i+100 ?>px){
                .contentFirstLoading .lds-css{
                    margin-top: <?php echo $top ?>px;
                }
            }
            <?php
        }
    ?>
</style>
<div id="loadingModal" style="<?php echo $background ?>">
</div>
<div class="contentFirstLoading">
    <div class="lds-css ng-scope" style="width:<?php echo $refBiggerRing; ?>px;height:<?php echo $refBiggerRing; ?>px;">
        <div style="width:<?php echo $refSmallerRing; ?>px;height:<?php echo $refSmallerRing; ?>px;top:<?php echo $diffPos;?>px;left:<?php echo $diffPos;?>px; <?php echo $background ?>; border-radius: 100%;position:absolute;">
            <img src="<?php echo $logoLoader ?>" class="loadingPageImg" style="margin-top: <?php echo $marginImg ?>px;">
        </div>
        <div class="lds-dual-ring">
            <div class="ring2" style="<?php echo $styleRing2 ?>width:<?php echo $refBiggerRing; ?>px;height:<?php echo $refBiggerRing; ?>px;top: 0px;"></div>
            <div class="ring1" 
                style="<?php echo $styleRing1 ?>width:<?php echo $refSmallerRing; ?>px;height:<?php echo $refSmallerRing; ?>px;top:<?php echo $diffPos;?>px;left:<?php echo $diffPos;?>px;"></div>
        </div>
    </div>
</div>
<script type="text/javascript">
    var heightBigger=<?php echo json_encode($refBiggerRing) ?>;
    jQuery(document).ready(function() { 
        //topImg=($(window).height()-heightBigger)/2;
        //$(".contentFirstLoading .lds-css").css({"margin-top":topImg+"px"});
        /*heightR1=$("#contentFirstLoading .ring1").outerHeight();
        heightR2=$("#contentFirstLoading .ring2").outerHeight();
        refBiggerRing=heightR2;
        refSmallerRing=heightR1;
        posInc="2";
        if(heightR1 > heightR2){
            refBiggerRing= heightR1;
            refSmallerRing=heightR2;
            posInc="1";
        }*/
        //$("#contentFirstLoading .lds-css").css({"width":refBiggerRing+"px", "height":refBiggerRing+"px"});
        //diffPos=(refBiggerRing-refSmallerRing)/2;
        //$("#contentFirstLoading .ring"+posInc).css({"top":diffPos+"px","left":diffPos+"px", });
        
    });
</script>