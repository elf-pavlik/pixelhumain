<style type="text/css">
    .footer-menu-vertical{
        z-index:200000;
    }

    .footer-menu-vertical .toolbar-bottom.bottom-left{
        bottom:10px;
        left: 1px;
    }
    .footer-menu-vertical .toolbar-bottom{
        z-index: 10000;
    }
    .footer-menu-vertical .toolbar-bottom.bottom-left #donation-btn{
        background-color: white !important;
        color:#E5344D !important;
    }
    .footer-menu-vertical .toolbar-bottom.bottom-right{
        bottom:60px;
        left: 1px;
        right: inherit;
    }

    .footer-menu-vertical .toolbar-bottom.bottom-right #show-bottom-add{
        background-color: white !important;
        color:#34a853 !important;
    }
    .footer-menu-vertical .toolbar-bottom.bottom-right #show-bottom-add:hover, .footer-menu-vertical .toolbar-bottom.bottom-left #donation-btn:hover{
        box-shadow: none;
    }
    .footer-menu-vertical .toolbar-bottom.bottom-right #show-bottom-add i{
        font-size: 28px;
    }
    .footer-menu-vertical .toolbar-bottom.bottom-right #show-bottom-add:hover i{
        font-size: 30px;
    }
    .footer-menu-vertical .toolbar-bottom.bottom-left #donation-btn:hover i{
        font-size: 25px;
    }
    .footer-menu-vertical .toolbar-bottom-adds{
        bottom: 68px;
        left: 53px;
    }
    .footer-menu-vertical .toolbar-bottom-adds a.addBtnFoot{
        text-transform: capitalize;
        margin-bottom: 0px !important;
        border-radius: 0px;
    }

    .footer-menu-vertical .toolbar-bottom-adds a.addBtnFoot{
        margin-bottom: 0px !important;
        border-radius: 0px;
    }
    .footer-menu-vertical .toolbar-bottom-adds a:first-child{
        border-radius: 0px 10px 0px 0px;
    }

    .footer-menu-vertical .toolbar-bottom-adds a:last-child{
        border-radius: 0px 0px 10px 0px;
    }
    .footer-menu-vertical .toolbar-bottom-adds a:hover{
        box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.3);
        font-size: 16px;
    }
</style>
<?php 
    $canCreate=false;

    if(Yii::app()->session["userIsAdmin"] || Yii::app()->session[ "userIsAdminPublic" ] || Yii::app()->session["isCostumAdmin"]){
        $canCreate=true;
        $label=(Yii::app()->session["userIsAdmin"]) ? Yii::t("common", "Admin") : Yii::t("common", "Admin public");
    }

    var_dump($canCreate);
    $menuApp=(@$themeParams["appRendering"]) ? $themeParams["appRendering"] : "horizontal"; 

?>
<div class="footer-menu-<?php echo $menuApp ?>">
    <?php if(!@$themeParams["menuBottom"] || (@$themeParams["menuBottom"]["donate"] && !empty($themeParams["menuBottom"]["donate"]))){ 
        $label=(@$themeParams["menuBottom"]["donate"]["label"]) ? $themeParams["menuBottom"]["donate"]["label"] : Yii::t("common","Be aCOeur");
        $url=(@$themeParams["menuBottom"]["donate"]["url"]) ? $themeParams["menuBottom"]["donate"]["url"] : "https://www.helloasso.com/associations/open-atlas/collectes/communecter/don";
    ?> 
    <a href="<?php echo $url ?>" target="_blank" id="donation-btn" class="btn btn-default donation-btn btn-menu-vertical">
        <i class="fa fa-heart"></i> 
        <span class="tooltips-menu-btn"><?php echo $label ?></span>
    </a>
    <?php } ?>
   <!-- <button class="btn btn-link btn-sm letter-red tooltips font-montserrat no-padding hidden" 
        id="btn-open-radio" 
        data-placement="top" title="Radio-Pixel-Humain is on air, listen now !">
        <img src="<?php echo Yii::app()->theme->baseUrl; ?>/assets/img/radios/radio-ico-close.png" height="60">
    </button>-->
    <?php if(@Yii::app()->session["userId"] && (!@$themeParams["menuBottom"] || (@$themeParams["menuBottom"]["add"] && !empty($themeParams["menuBottom"]["add"])))) { ?>
        <button class="btn btn-default no-padding btn-menu-vertical" id="show-bottom-add">
            <i class="fa fa-plus-circle"></i>
            <span class="tooltips-menu-btn"><?php echo Yii::t("common","Add something") ?></span>
        </button>
    <?php } ?>



    <div class="toolbar-bottom-adds toolbar-bottom-fullwidth font-montserrat hidden">
        <!--
        <?php 
        if( Yii::app()->params['rocketchatMultiEnabled'] )
        {
        ?>
        <a href="javascript:;" data-form-type="chat" class="addBtnFoot addBtnFootChat addBtnFoot_orga addBtnFoot_project addBtnFoot_event btn-open-form btn btn-default bg-red-k margin-bottom-10"> 
            <i class="fa fa-comments"></i> 
            <span><?php echo Yii::t("common","Chat") ?></span>
        </a>
        <?php } ?>-->
    </div>
</div>
<script type="text/javascript">
var canCreate=<?php echo json_encode($canCreate) ?>;
jQuery(document).ready(function() {
    $(".toolbar-bottom-adds").hide().removeClass("hidden");
    $('#show-bottom-add').off().click(function(){
        if(!$(this).hasClass("opened")){
            $(this).addClass("opened");
            $(".toolbar-bottom-apps").hide(200);
            $(".toolbar-bottom-adds").toggle(100);
            $('.toolbar-bottom-adds .btn').click(function(){
                $(".toolbar-bottom-adds").hide(200);
                $(this).removeClass("opened");
            });
        }else{
            $(".toolbar-bottom-adds").hide(200);
            $(this).removeClass("opened");
        }
    });
    $('.toolbar-bottom-adds').unbind("mouseleave").mouseleave(function(){
        console.log(".toolbar-bottom-adds mouseleave");
        $('#show-bottom-add').removeClass("opened");
        $(".toolbar-bottom-adds").hide(200);

    });
});

function addBtnSwitch(){ 
    /*$(".addBtnFoot").addClass("hidden");
    $(".addBtnAll").removeClass("hidden");
    

    var fname = "<?php echo Yii::t("common", "as") ?> ";
    if ( contextData != null && contextData.type && inArray( contextData.type,[ "organizations","citoyens","events","projects" ] ) )
        fname += contextData.name;
    else if(userConnected) {
        fname += userConnected.name;
    }

    $("#addFootTitle").html('<i class="fa fa-plus-circle"></i> <?php echo Yii::t("common", "Add something") ?> '+fname);

    if( (contextData != null && contextData.type == "citoyens") || contextData == null){
        $(".addBtnFoot").removeClass("hidden");
        $(".addBtnFootChat").addClass("hidden");
        $(".hideBtnFoot_person").addClass("hidden");
    }
    else if(contextData.type == "organizations" )
        $(".addBtnFoot_orga").removeClass("hidden");
    else if(contextData.type == "projects" )
        $(".addBtnFoot_project").removeClass("hidden");
    else if(contextData.type == "events" )
        $(".addBtnFoot_event").removeClass("hidden");*/

}

</script>