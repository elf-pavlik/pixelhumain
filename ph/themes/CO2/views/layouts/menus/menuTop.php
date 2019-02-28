<?php $themeParams=Yii::app()->session['paramsConfig']; ?>
<style>
    a.link-submenu-header{
        /*background-color: rgba(255, 255, 255, 0.8);
        border-radius: 10px;*/
        padding: 11px 10px;
        font-size: 12px;
        font-weight: bold;
    }
    a.link-submenu-header.active, 
    a.link-submenu-header:hover, 
    a.link-submenu-header:active{  
        border-bottom: 2px solid #ea4335;
        /*background-color: rgba(255, 255, 255, 1);*/
        color:#ea4335 !important;
        text-decoration: none;
    }

/*    .dropdown-menu.arrow_box{
        position: absolute !important;
        top: 51px;
        right: -65px;
        left: inherit;
        background-color: white;
        border: 1px solid transparent;
        -webkit-box-shadow: 0 6px 12px rgba(0,0,0,.175);
        box-shadow: 0 6px 12px rgba(0,0,0,.175);
    }*/

    .btn-language{
        height: 35px;
        /*border-radius: 0% 50%;*/
        border:none;
        width: 50px;
    }


    .btn-star-fav {
        font-size: 18px;
        margin-top: 5px;
    }

    .menu-name-profil{
        margin-left:10px;
    }

    .navbar-nav .menu-button{
        width: 45px !important;
        margin-right: 0px;
        height: 30px;
        margin-top: 10px;
        font-size: 18px !important;
        padding:5px;
        position: relative;
    }
    .navbar-nav .menu-button:hover{
        color:grey !important;
    }
    #mainNav.vertical{
        box-shadow: 0px 2px 3px -3px rgba(0,0,0,0.5);
        border-bottom: 1px solid #dadada;
        z-index: 100000;
        position: fixed;
        left: 0;
    }
    #header-banner{
        position: absolute;
        top: 0px;
        left: 0px;
        right: 0px;
    }
</style>
<!-- Navigation -->
<nav id="mainNav" class="navbar navbar-default col-xs-12 navbar-custom menuTop <?php echo @$menuApp ?>">
<?php if(@$themeParams["header"]["menuTop"] && is_string($themeParams["header"]["menuTop"])){
    $this->renderPartial( $themeParams["header"]["menuTop"]  ); 
}else{ ?>
    <div>
    <!-- //////////////// CONSTRUCTION OF LEFT NAV //////////////////// --> 
    <?php if(@$themeParams["header"]["menuTop"] && @$themeParams["header"]["menuTop"]["navLeft"]){ ?>
    <div class="navLeft margin-left-10">
        <?php foreach(@$themeParams["header"]["menuTop"]["navLeft"] as $key => $value){
        // LOGO HTML NAV BAR 
        if($key=="logo"){ ?>
        <a href="#welcome" class="btn btn-link menu-btn-back-category pull-left no-padding lbh menu-btn-top" >
            <?php 
            $logo = (@Yii::app()->session['costum']["logo"]) ? Yii::app()->session['costum']["logo"] : Yii::app()->theme->baseUrl.$value["url"];
            $logoMin = (@Yii::app()->session['costum']["logoMin"]) ? Yii::app()->session['costum']["logoMin"] : $logo;
            $height = (@$value["height"]) ? $value["height"] : 30;
            ?>
            <img src="<?php echo $logo;?>" class="logo-menutop pull-left hidden-xs" height="<?php echo $height ?>">
            <img src="<?php echo $logoMin;?>" class="logo-menutop pull-left visible-xs" height="40">
        </a>
        <?php }
        // END LOGO HTML NAV BAR
        else if($key=="searchBar" && $value){ 
            $searchBar=(@$useFilter && $useFilter) ? $value["useFilter"] : $value["noUseFilter"]; ?>
            <!-- INPUT SEARCH BAR IN NAV -->
             <div class="hidden-xs <?php echo $searchBar["classes"]["container"] ?> navbar-item-left">
                <input type="text" class="form-control pull-left <?php echo $searchBar["classes"]["input"] ?>" id="<?php echo $searchBar["ids"]["input"] ?>" placeholder="<?php echo Yii::t("common", $placeholderMainSearch) ?>">
                <span class="text-white input-group-addon pull-left <?php echo $searchBar["classes"]["spanAddon"] ?>" id="<?php echo $searchBar["ids"]["spanAddon"] ?>">
                    <i class="fa fa-arrow-circle-right"></i>
                </span>
                <?php if(@$searchBar["dropdownResult"]){ ?>
                 <div class="dropdown-result-global-search hidden-xs col-sm-6 col-md-5 col-lg-5 no-padding"></div> 
                <?php } ?>
            </div>
            <?php if(@$searchBar["dropdownApp"]
                && !empty($menuApp) && $menuApp!="vertical" 
                && @$themeParams["numberOfApp"]==1 
                && @$themeParams["pages"]){
             foreach (@$themeParams["pages"] as $key => $value) {
                if(@$value["inMenu"]==true && @$value["open"]==true){ ?>
                    <a href="javascript:;" data-hash="<?php echo $key; ?>" 
                    class="<?php echo $key; ?>ModBtn lbh-menu-app btn btn-link pull-left navbar-item-left btn-menu-to-app hidden-xs hidden-top link-submenu-header <?php if($subdomainName==$value["subdomainName"]) echo 'active'; ?>" style="line-height:27px;border:none;">
                            
                    <i class="fa fa-<?php echo $value["icon"]; ?>"></i>
                    <span class="<?php echo str_replace("#","",$key); ?>ModSpan"><?php echo Yii::t("common", $value["subdomainName"]); ?></span>
                    </a>  
            <?php   }
                } 
            } ?>
            <!-- END INPUT SEARCH BAR IN NAV -->
        <?php }else if($key=="useFilter" && @$useFilter && $useFilter){   
            $showScopeFilter=(@$value["scopeFilter"] && $value["scopeFilter"]) ? true : false;
            $showFilters=(@$value["showFilter"] && $value["showFilter"]) ? true : false;
            ?>
           
            <?php if($showScopeFilter){ ?> 
            <button class="btn hidden-xs pull-left menu-btn-scope-filter text-red elipsis margin-right-10 navbar-item-left"
                    data-type="<?php echo @$type; ?>">
                    <i class="fa fa-map-marker"></i> <span class="header-label-scope"><?php echo Yii::t("common","where ?") ?></span>
            </button>
            <?php } ?>
            <?php if($showFilters){ ?>
             <button class="btn btn-show-filters pull-left hidden-xs navbar-item-left"> <i class="fa fa-filter visible-sm pull-left" style="font-size:18px;"></i><span class="hidden-sm"><?php echo Yii::t("common", "Filters") ?></span> <span class="topbar-badge badge animated bounceIn badge-warning"></span> <i class="fa fa-angle-down"></i></button>
            <?php }
            
        } 
    } ?>
    </div> 
    <?php }
    ///////////////////////////////////////////////////////////////
    //////////////// END CONSTRUCT OF LEFT NAV ////////////////////
    ///////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////////
    //////////////// CONSTRUCT OF RIGHT NAV ////////////////////
    ///////////////////////////////////////////////////////////////
    if(@$themeParams["header"]["menuTop"] && @$themeParams["header"]["menuTop"]["navRight"]){ 
        $menuRight=(@Yii::app()->session['userId']) ? $themeParams["header"]["menuTop"]["navRight"]["connected"] : $themeParams["header"]["menuTop"]["navRight"]["disconnected"]; ?> 
    <div id="navbar" class="navbar-collapse pull-right navbar-right margin-right-15">
        <?php foreach($menuRight as $key => $value){
            if($key=="map"){ ?>
                <button class="btn-show-map pull-right"
                        title="<?php echo Yii::t("common", "Show the map"); ?>"
                        alt="<?php echo Yii::t("common", "Show the map"); ?>"
                        >
                    <i class="fa fa-map-marker"></i>
                </button>
            <?php } 
            if($key=="languages"){ ?>
                <ul class="nav navbar-nav pull-right">
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle btn btn-default btn-language padding-5" style="padding-top: 7px !important" data-toggle="dropdown" role="button">
                        <img src="<?php echo Yii::app()->getRequest()->getBaseUrl(true); ?>/images/flags/<?php echo Yii::app()->language ?>.png" width="22"/> <span class="caret"></span></a>
                        <ul class="dropdown-menu arrow_box dropdown-languages-nouser" role="menu" style="">
                            <?php foreach($themeParams["languages"] as $lang => $label){ ?>
                                    <li><a href="javascript:;" onclick="setLanguage('<?php echo $lang ?>')"><img src="<?php echo Yii::app()->getRequest()->getBaseUrl(true); ?>/images/flags/<?php echo $lang ?>.png" width="25"/> <?php echo Yii::t("common",$label) ?></a></li>
                                <?php } ?>
                        </ul>
                    </li>
                </ul> 
            <?php }
            if($key=="login"){ ?>
                <button class="letter-green font-montserrat btn-menu-connect margin-left-10 margin-right-10 menu-btn-top" 
                        data-toggle="modal" data-target="#modalLogin" style="font-size: 17px;">
                        <i class="fa fa-sign-in"></i> 
                        <span class="hidden-xs"><small style="width:70%;"><?php echo Yii::t("login", "LOG IN") ?></small></span>
                </button>
            <?php }
            if($key=="dropdownUser"){ ?>
                <button class="btn-show-mainmenu btn btn-link btn-menu-tooltips pull-right menu-btn-top" 
                        data-toggle="tooltip" data-placement="top" title="<?php echo Yii::t("common","Menu") ?>">
                    <i class="fa fa-bars tooltips" ></i>
                    <span class="tooltips-top-menu-btn"><?php echo Yii::t("common", "Menu"); ?></span>
                </button>
                <div class="dropdown pull-right" id="dropdown-user">
                    <div class="dropdown-main-menu">
                        <ul class="dropdown-menu arrow_box">
                        <?php 
                        $nbLi=count($value);
                        $i=0;
                        foreach($value as $k => $v){ 
                            $i++;
                            $label=@$v["label"];
                            $show=true;
                            $href=($k=="logout") ? Yii::app()->createUrl($v["href"]) : $v["href"];
                            $blank=(@$blank) ? "target='_blank'" : "";
                            if($k=="admin"){ 
                                if(Yii::app()->session["userIsAdmin"] || Yii::app()->session[ "userIsAdminPublic" ]){
                                    $show=true;
                                    $label=(Yii::app()->session["userIsAdmin"]) ? Yii::t("common", "Admin") : Yii::t("common", "Admin public");
                                }else if(@Yii::app()->session["userId"] 
                                    && @Yii::app()->session["costum"]
                                    && @Yii::app()->session["costum"]["admins"]
                                    && @Yii::app()->session["costum"]["admins"][Yii::app()->session["userId"]]){
                                    $show=true;
                                    $label=(Yii::app()->session["userIsAdmin"]) ? Yii::t("common", "Admin") : Yii::t("common", "Admin public");
                                }else
                                    $show=false;
                            }
                            if($show){
                        ?>
                            <li class="<?php echo @$v["liClass"] ?>">
                                <a href="<?php echo @$href ?>" class="bg-white <?php echo @$v["aClass"] ?>" <?php echo $blank ?>>
                                    <i class="fa fa-<?php echo @$v["icon"] ?>"></i> <?php echo Yii::t("common", $label) ; ?>
                                </a>
                                <?php if($k=="languages"){ ?>
                                    <ul class="dropdown-menu">
                                    <?php foreach($themeParams["languages"] as $lang => $label){ ?>
                                        <li><a href="javascript:;" onclick="setLanguage('<?php echo $lang ?>')"><img src="<?php echo Yii::app()->getRequest()->getBaseUrl(true); ?>/images/flags/<?php echo $lang ?>.png"/><span class="hidden-xs"><?php echo Yii::t("common",$label) ?></span></a></li>
                                    <?php } ?>
                                    </ul>
                                <?php } ?>
                            </li>
                            <?php if($i<$nbLi){ ?>
                            <li role="separator" class="divider"></li>
                            <?php }
                            } 
                        } ?>
                        </ul>
                    </div>
                </div>
            <?php }
            if($key=="userProfil"){
                  $profilThumbImageUrl = Element::getImgProfil($me, "profilThumbImageUrl", $this->module->getParentAssetsUrl()); ?> 
                <a  href="#page.type.citoyens.id.<?php echo Yii::app()->session['userId']; ?>"
                        class="menu-name-profil lbh text-dark pull-right shadow2 btn-menu-tooltips" 
                        data-toggle="dropdown">
                        <?php if(@$value["name"]){ ?> 
                        <small class="hidden-xs hidden-sm margin-left-10" id="menu-name-profil">
                            <?php echo @$me["name"] ? $me["name"] : @$me["username"]; ?>
                        </small> 
                        <?php } 
                        if(@$value["img"]){ ?>
                        <img class="img-circle" id="menu-thumb-profil" 
                             width="40" height="40" src="<?php echo $profilThumbImageUrl; ?>" alt="image" >
                        <?php } ?>
                    <span class="tooltips-top-menu-btn"><?php echo Yii::t("common", "My page"); ?></span>
                </a>
            <?php } 
            if($key=="networkFloop"){ ?>
                <button class="menu-button btn-menu btn-link btn-open-floopdrawer text-dark pull-right hidden-xs btn-menu-tooltips menu-btn-top" 
                      data-toggle="tooltip" data-placement="bottom" title="<?php echo Yii::t("common","My network") ?>" 
                      alt="<?php echo Yii::t("common","My network") ?>">
                    <i class="fa fa-users"></i>
                    <span class="tooltips-top-menu-btn"><?php echo Yii::t("common", "My network"); ?></span>
                </button>
            <?php }
            if($key=="notifications"){ 
                $countNotifElement = ActivityStream::countUnseenNotifications(Yii::app()->session["userId"], Person::COLLECTION, Yii::app()->session["userId"]); ?>
                <button class="menu-button btn-menu btn-menu-notif text-dark pull-right btn-menu-tooltips menu-btn-top" 
                      data-toggle="tooltip" data-placement="bottom" title="<?php echo Yii::t("common","Notifications") ?>" alt="<?php echo Yii::t("common","Notifications") ?>">
                  <i class="fa fa-bell"></i>
                  <span class="notifications-count topbar-badge badge animated bounceIn 
                          <?php if(!@$countNotifElement || (@$countNotifElement && $countNotifElement=="0")) 
                          echo 'badge-transparent hide'; else echo 'badge-success'; ?>">
                        <?php echo @$countNotifElement ?>
                    </span>
                    <span class="tooltips-top-menu-btn"><?php echo Yii::t("common", "My notifications"); ?></span>
                </button>
            <?php }
            if($key=="dda"){
                if(@$me && @$me["links"] && (@$me["links"]["memberOf"] || @$me["links"]["contributors"])){ ?>
                    <button class="menu-button btn-menu btn-dashboard-dda text-dark pull-right hidden-xs menu-btn-top" 
                          data-toggle="tooltip" data-placement="bottom" title="<?php echo Yii::t("common","Cooperation") ?>" 
                          alt="<?php echo Yii::t("common","Cooperation") ?>">
                      <i class="fa fa-inbox"></i>
                      <span class="coopNotifs topbar-badge badge animated bounceIn badge-warning"></span>
                    </button>
            <?php } 
            } 
            if($key=="chat"){ ?>                    
                <button class="menu-button btn-menu btn-menu-chat text-dark pull-right hidden-xs btn-menu-tooltips menu-btn-top" 
                      onClick='rcObj.loadChat("","citoyens", true, true)' data-toggle="tooltip" data-placement="bottom" 
                      title="<?php echo Yii::t("common","Messaging") ?>" alt="<?php echo Yii::t("common","Messaging") ?>">
                  <i class="fa fa-comments"></i>
                  <span class="chatNotifs topbar-badge badge animated bounceIn badge-warning"></span>
                  <span class="tooltips-top-menu-btn"><?php echo Yii::t("common", "My chat"); ?></span>
                </button>
            <?php } 
            if($key=="home"){ ?>
                <a href="#myhome" class="lbh menu-button btn-menu btn-menu-home text-dark pull-right btn-menu-tooltips menu-btn-top" 
                       data-toggle="tooltip" data-placement="bottom" 
                      title="<?php echo Yii::t("common","Home") ?>" alt="<?php echo Yii::t("common","Home") ?>" style="width: inherit !important;text-transform: capitalize;">
                  <i class="fa fa-home"></i> <span class="hidden-xs hidden-sm" style="font-size: 16px;"><?php echo Yii::t("common","Home") ?></span>
                  <span class="tooltips-top-menu-btn"><?php echo Yii::t("common", "My home"); ?></span>
                </a>
            <?php }
        } ?>
        </div>
    <?php } ?>
    </div>
    <?php } ?>
</nav>
<!-- DROPDOWNS OF MENUTOP -->
<div class="dropdown dropdownApps-menuTop" aria-labelledby="dropdownApps">
        <div class="dropdown-menu arrow_box">
            <?php   
            if(@Yii::app()->session["paramsConfig"]["pages"]){
                foreach (@Yii::app()->session["paramsConfig"]["pages"] as $key => $value) {
                    if(@$value["inMenu"]==true && @$value["open"]==true){ ?>
                    <a class="dropdown-item padding-5 text-center col-xs-6 lbh-menu-app" href="javascript:;" data-hash="<?php echo $key; ?>" data-toggle="tooltip" data-placement="bottom" ><i class="fa fa-<?php echo $value["icon"]; ?> fa-2x"></i><br/><span class="<?php echo str_replace("#","",$key); ?>ModSpan"><?php echo Yii::t("common", @$value["subdomainName"]); ?></span></a>
                <?php } 
                }
            } ?>
        </div>
</div>
 <div class="dropdown pull-right" id="dropdown-dda">
    <div class="dropdown-main-menu">
        <ul class="dropdown-menu arrow_box menuCoop" id="list-dashboard-dda">
            
        </ul>
    </div>
</div>
<?php 
$this->renderPartial($layoutPath.'loginRegister', array("subdomain" => $subdomain)); 

$this->renderPartial($layoutPath.'formCreateElement'); ?>

