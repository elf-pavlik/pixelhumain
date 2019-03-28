<?php $themeParams=Yii::app()->session['paramsConfig']; ?>
<style>
    
</style>
<!-- Navigation -->
<nav id="mainNav" class="navbar-default col-xs-12 navbar-custom menuTop <?php echo @$menuApp ?>">
<?php if(@$themeParams["header"]["menuTop"] && is_string($themeParams["header"]["menuTop"])){
    $this->renderPartial( $themeParams["header"]["menuTop"]  ); 
}else{ ?>
    <div>
    <!-- //////////////// CONSTRUCTION OF LEFT NAV //////////////////// --> 
    <?php 
    if(isset($themeParams["header"]["menuTop"]) && isset($themeParams["header"]["menuTop"]["navLeft"])){ ?>
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
        <?php } else if($key=="app"){ ?>
            <div class="pull-left menu-app-top">
                <?php echo ButtonCtk::app($value); ?>
            </div>
        <?php
        // END LOGO HTML NAV BAR
        }else if($key=="searchBar"){ 
            $value["dropdownResult"]=$dropdownResult;
            echo ButtonCtk::searchBar($value);    
        // END INPUT SEARCH BAR IN NAV -->
        }else if($key=="useFilter" && isset($useFilter) && !empty($useFilter)){   
            $showScopeFilter=(@$value["scopeFilter"] && $value["scopeFilter"] && (!isset($useFilter["scope"]) || $useFilter["scope"])) ? true : false;
            $showFilters=(@$value["showFilter"] && $value["showFilter"] && (!isset($useFilter["filters"]) || $useFilter["filters"])) ? true : false;
            if($showScopeFilter){ ?> 
            <button class="btn hidden-xs pull-left menu-btn-scope-filter text-red elipsis margin-right-10 navbar-item-left"
                    data-type="<?php echo @$type; ?>">
                    <i class="fa fa-map-marker"></i> <span class="header-label-scope"><?php echo Yii::t("common","where ?") ?></span>
            </button>
            <?php } 
            if($showFilters){ ?>
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
                        <i class="fa fa-<?php echo $value["icon"] ?>"></i> 
                        <span class="hidden-xs"><small style="width:70%;"><?php echo Yii::t("login", $value["label"]) ?></small></span>
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
                                if(Yii::app()->session["userIsAdmin"] || Yii::app()->session[ "userIsAdminPublic" ] || Yii::app()->session["isCostumAdmin"]){
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
$this->renderPartial($layoutPath.'loginRegister', array("subdomain" => @$subdomain)); 

$this->renderPartial($layoutPath.'formCreateElement'); ?>

