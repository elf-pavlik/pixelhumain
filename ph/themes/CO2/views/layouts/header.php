<?php   

HtmlHelper::registerCssAndScriptsFiles(array('/assets/css/menus/multi_tags_scopes.css'), Yii::app()->theme->baseUrl); 
    $themeParams = Yii::app()->session['paramsConfig'];  
    if(@$type=="cities")    { 
        $lblCreate = "";
        $themeParams["pages"]["#".$page]["mainTitle"] = "Rechercher une commune"; 
        $themeParams["pages"]["#".$page]["placeholderMainSearch"] = "Rechercher une commune"; 
    }
    //var_dump($page); exit;
    //$useHeader              = $themeParams["pages"]["#".$page]["useHeader"];
    //$useFilter              = $themeParams["pages"]["#".$page]["useFilter"];
   // $subdomain              = @$themeParams["pages"]["#".$page]["subdomain"];
   // $subdomainName          = $themeParams["pages"]["#".$page]["subdomainName"];
   // $icon                   = $themeParams["pages"]["#".$page]["icon"];
   // $mainTitle              = @$themeParams["pages"]["#".$page]["mainTitle"];
   // $dropdownResult              = @$themeParams["pages"]["#".$page]["dropdownResult"];
    //$placeholderMainSearch  = (@$themeParams["pages"]["#".$page]["placeholderMainSearch"]) ? $themeParams["pages"]["#".$page]["placeholderMainSearch"] : "what are you looking for ?";
    //$type = @$themeParams["pages"]["#".$page]["type"];
    $menuApp=(@$themeParams["appRendering"]) ? $themeParams["appRendering"] : "horizontal";
    //$menuFilters=(@$themeParams[["appRendering"]) ? $themeParams["appRendering"] : "horizontal";
    $CO2DomainName = Yii::app()->params["CO2DomainName"];
    $me = isset(Yii::app()->session['userId']) ? Person::getById(Yii::app()->session['userId']) : null;
    $cities = []; ?> 
<!-- Header -->
<header id="<?php echo $menuApp; ?>">   
    <?php 
    if(isset($themeParams["header"]["banner"]) && is_string($themeParams["header"]["banner"])){ ?>
        <div id="headerBand" class="banner-<?php echo $menuApp ?>">
            <?php $this->renderPartial( $themeParams["header"]["banner"]  ); ?>
        </div>
    <?php }   

    $this->renderPartial($layoutPath.'menus/menuTop', 
        array( "layoutPath"=>$layoutPath , 
            //"subdomain"=>$subdomain,
            //"subdomainName"=>$subdomainName,
            //"mainTitle"=>$mainTitle,
            //"placeholderMainSearch"=>$placeholderMainSearch,
            "menuApp"=>$menuApp,
            //"useFilter"=>$useFilter,
            //"dropdownResult"=> $dropdownResult,
            //"type"=>@$type,
            "me" => $me) ); 
    ?>
</header>
<div id="filter-scopes-menu" class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="display: none;">
    <div id="scope-container" class="scope-menu no-padding">
        <div id="input-sec-search" class="col-xs-8 col-md-6 col-sm-6 col-lg-6">
            <div class="input-group shadow-input-header">
                  <span class="input-group-addon scope-search-trigger">
                    <i class="fa fa-map-marker fa-fw" aria-hidden="true"></i>
                  </span>
                  <input type="text" class="form-control input-global-search" autocomplete="off"
                         id="searchOnCity" placeholder="<?php echo Yii::t("common","where ?") ?> ...">
                    <input id="searchTags" type="hidden" />
            </div>
            <div class="dropdown-result-global-search col-xs-12 col-sm-5 col-md-5 col-lg-5 no-padding" 
                style="max-height: 70%; display: none;">
                <div class="text-center" id="footerDropdownGS">
                <label class="text-dark"><i class="fa fa-ban"></i> Aucun résultat</label>
                    <br>
                </div>
            </div>
        </div>
        <button id="multiscopes-btn" class="btn btn-link letter-red btn-menu-scopes pull-left" data-type="multiscopes">
            <i class="fa fa-star"></i> 
            <span class="hidden-xs">
                <?php echo Yii::t("common","My favorites places"); ?> 
                (<span class="count-favorite"></span>)
            </span>
        </button>
        <button id="communexion-btn" class="btn btn-link letter-red btn-menu-scopes pull-left" data-type="communexion">
            <i class="fa fa-home"></i> 
            <span class="communexion-btn-label hidden-xs">
            </span> 
        </button>
        <div class="scopes-container col-md-12 col-sm-12 col-xs-12 no-padding margin-top-5">
        </div>
    </div>
</div>
<?php  
// Menu Left Or Menu top (container of applications and other)
if(isset($themeParams["subMenu"]) && !empty($themeParams["subMenu"])){
    $subMenu=($menuApp == "vertical") ? "menuLeft" : "subMenuTop";
    $this->renderPartial($layoutPath.'menus/'.$subMenu, array("params"=>$themeParams)); 
} ?> 
<!-- FIlter toolBar subMenu-->
<div id="filters-nav" class="menuFilters menuFilters-<?php echo $themeParams["appRendering"] ?> col-xs-12" style="min-height:40px;display:none;">
    <?php $this->renderPartial($layoutPath.'menus/menuFilters', array("themeParams"=>$themeParams)); ?>
</div>
<!-- View xs bar with search and button app -->
<div id="affix-sub-menu" class="affix menu-xs-accessibility">
    <div id="text-search-menu" class="col-md-12 col-sm-12 col-xs-12 no-padding">
        <?php //if( in_array($subdomain, ["welcome", "page", "home"])){ 
            $addonXs="second-search-xs-bar-addon";
            $searchXs="second-search-xs-bar"; 
        //} ?>
        <span class="dropdown dropdownApps text-center" id="dropdown-apps">
            <button class="dropdown-toggle" type="button" id="dropdownApps" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-placement="bottom" title="Applications" alt="Applications">
                  <i class="fa fa-th"></i>
            </button>
        </span>
        
        <input type="text" class="form-control main-search-bar pull-left" id="<?php echo $searchXs ?>" placeholder="<?php echo Yii::t("common", "What are you looking for")." ?"; ?>">
        <span class="text-white input-group-addon input-group-addon-xs pull-left main-search-bar-addon" id="<?php echo $addonXs ?>" style="border-radius:0px !important;">
            <i class="fa fa-arrow-circle-right"></i>
        </span>
        <div class="dropdown-result-global-search col-xs-12 no-padding"></div>
    </div>
    <button class="btn btn-show-filters visible-xs" style="display:none;">
        <?php echo Yii::t("common", "Filters") ?> 
        <span class="topbar-badge badge animated bounceIn badge-warning bg-green"></span> 
        <i class="fa fa-angle-down"></i>
    </button>
    <button class="btn visible-xs pull-left menu-btn-scope-filter text-red elipsis"
                data-type="<?php echo @$type; ?>" style="display:none;">
                <i class="fa fa-map-marker"></i> <span class="header-label-scope"><?php echo Yii::t("common","where ?") ?></span>
    </button>

</div>      
     
<script type="text/javascript">
    var filliaireCategories = <?php echo json_encode(@$filliaireCategories); ?>;
   // var page="<?php echo $page ?>";
    var headerScaling=false;
  //  var titlePage = "<?php echo Yii::t("common",@$themeParams["pages"]["#".$page]["subdomainName"]); ?>";
    var infScroll=true;
    jQuery(document).ready(function() {
    //    setTitle(titlePage, "", titlePage);
        initScopeMenu();
        //resetNotifTimestamp();

        //headerHeightPos(true);
    });


    /*function showWhere(show){
        mylog.log("showWhere", show);
        if(show == false){
            $(".menu-btn-scope-filter").removeClass("visible");
            $("#filter-scopes-menu").hide(300);
            headerHeightPos(true);
        }else{
            $(".menu-btn-scope-filter").addClass("visible");
            $("#filter-scopes-menu").show(400);
            headerHeightPos(true);
        }
    }*/

    
    function initScopeMenu(type){   
        bindSearchCity();
        bindScopesInputEvent();
        countFavoriteScope();
        getCommunexionLabel();
    }
</script>