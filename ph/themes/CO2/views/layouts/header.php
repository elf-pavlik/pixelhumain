<?php   HtmlHelper::registerCssAndScriptsFiles(array('/assets/css/menus/multi_tags_scopes.css'), Yii::app()->theme->baseUrl); 
    $themeParams = Yii::app()->session['paramsConfig'];  
    if(@$type=="cities")    { 
        $lblCreate = "";
        $themeParams["pages"]["#".$page]["mainTitle"] = "Rechercher une commune"; 
        $themeParams["pages"]["#".$page]["placeholderMainSearch"] = "Rechercher une commune"; 
    }
    //var_dump($page); exit;
    $useHeader              = $themeParams["pages"]["#".$page]["useHeader"];
    $useFilter              = $themeParams["pages"]["#".$page]["useFilter"];
    $subdomain              = @$themeParams["pages"]["#".$page]["subdomain"];
    $subdomainName          = $themeParams["pages"]["#".$page]["subdomainName"];
    $icon                   = $themeParams["pages"]["#".$page]["icon"];
    $mainTitle              = @$themeParams["pages"]["#".$page]["mainTitle"];
    $placeholderMainSearch  = (@$themeParams["pages"]["#".$page]["placeholderMainSearch"]) ? $themeParams["pages"]["#".$page]["placeholderMainSearch"] : "what are you looking for ?";
    $type = @$themeParams["pages"]["#".$page]["type"];
    $menuApp=(@$themeParams["appRendering"]) ? $themeParams["appRendering"] : "horizontal";
    //$menuFilters=(@$themeParams[["appRendering"]) ? $themeParams["appRendering"] : "horizontal";
    $CO2DomainName = Yii::app()->params["CO2DomainName"];
    $me = isset(Yii::app()->session['userId']) ? Person::getById(Yii::app()->session['userId']) : null;
    $cities = []; ?>
<?php if(@$useHeader != false){ ?>
<!-- Header -->
<header id="<?php echo $menuApp; ?>">   
    <?php if(isset($themeParams["header"]["banner"]) && is_string($themeParams["header"]["banner"])){ ?>
        <div id="header-banner" class="banner-<?php echo $menuApp ?>">
            <?php $this->renderPartial( $themeParams["header"]["banner"]  ); ?>
        </div>
    <?php }   
    $this->renderPartial($layoutPath.'menus/menuTop', 
        array( "layoutPath"=>$layoutPath , 
            "subdomain"=>$subdomain,
            "subdomainName"=>$subdomainName,
            "mainTitle"=>$mainTitle,
            "placeholderMainSearch"=>$placeholderMainSearch,
            "menuApp"=>$menuApp,
            "useFilter"=>$useFilter,
            "type"=>@$type,
            "me" => $me) ); 
    ?>
</header>
 <?php 
    // Menu of scope filtering
    if(isset($useFilter) 
        && !empty($useFilter) 
        && (!isset($useFilter["scope"]) || !empty($useFilter["scope"]) ) ){ ?>
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
    <?php } 
    // Menu Left Or Menu top (container of applications and other)
    $subMenu=($menuApp == "vertical") ? "menuLeft" : "subMenuTop";
    $this->renderPartial($layoutPath.'menus/'.$subMenu, array("params"=>$themeParams, "subdomainName"=>$subdomainName, "useFilter"=>@$useFilter )); 
    // FIlter toolBar subMenu
    if(@$useFilter != false
        && (!isset($useFilter["filters"]) || !empty($useFilter["filters"]) ))
        $this->renderPartial($layoutPath.'menus/menuFilters', array("params"=>$themeParams)); 
?>
    <!-- View xs bar with search and button app -->
    <div id="affix-sub-menu" class="affix menu-xs-accessibility">
        <div id="text-search-menu" class="col-md-12 col-sm-12 col-xs-12 no-padding">
            <?php $addonXs="main-search-xs-bar-addon";
                $searchXs="main-search-xs-bar";
                $appPadding="";
            if( in_array($subdomain, ["welcome", "page", "home"])){ 
                $addonXs="second-search-xs-bar-addon";
                $searchXs="second-search-xs-bar"; 
                $appPadding="padding";
            } ?>
            <span class="dropdown dropdownApps text-center <?php echo $appPadding ?>" id="dropdown-apps">
                <button class="dropdown-toggle" type="button" id="dropdownApps" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-placement="bottom" title="Applications" alt="Applications">
                      <i class="fa fa-th"></i>
                </button>
            </span>
            <input type="text" class="form-control main-search-bar pull-left" id="<?php echo $searchXs ?>" placeholder="<?php echo Yii::t("common", "What are you looking for")." ?"; ?>">
            <span class="text-white input-group-addon input-group-addon-xs pull-left main-search-bar-addon" id="<?php echo $addonXs ?>" style="border-radius:0px !important;">
                <i class="fa fa-arrow-circle-right"></i>
            </span>
            <?php if( in_array($subdomain, ["welcome", "page", "home", "info"])){ ?>
                <div class="dropdown-result-global-search col-xs-12 no-padding"></div>
            <?php } ?>
        </div>
        <?php if(@$useFilter && $useFilter!=false){ 
            if(!isset($useFilter["filters"]) || !empty($useFilter["filters"])){ ?>
                <button class="btn btn-show-filters visible-xs">
                    <?php echo Yii::t("common", "Filters") ?> 
                    <span class="topbar-badge badge animated bounceIn badge-warning bg-green"></span> 
                    <i class="fa fa-angle-down"></i>
                </button>
            <?php } ?>
            <button class="btn visible-xs pull-left menu-btn-scope-filter text-red elipsis"
                    data-type="<?php echo @$type; ?>">
                    <i class="fa fa-map-marker"></i> <span class="header-label-scope"><?php echo Yii::t("common","where ?") ?></span>
            </button>

        <?php } ?>
    </div>      
  
<?php } ?>
     
<script type="text/javascript">
    var filliaireCategories = <?php echo json_encode(@$filliaireCategories); ?>;
    var page="<?php echo $page ?>";
    var headerScaling=false;
    var titlePage = "<?php echo Yii::t("common",@$themeParams["pages"]["#".$page]["subdomainName"]); ?>";
    var infScroll=true;
    jQuery(document).ready(function() {
        setTitle(titlePage, "", titlePage);
        initScopeMenu();
        initPositionInterface();
        //resetNotifTimestamp();
        if( typeof custom != "undefined" && custom.logo ){
            custom.initMenu("mainSearch");
        }
        $(".btn-menu-vertical").mouseenter(function(){
            $(this).find(".tooltips-menu-btn").show();
        }).mouseleave(function(){
            $(this).find(".tooltips-menu-btn").hide();
        });
        $(".btn-menu-tooltips").mouseenter(function(){
            $(this).find(".tooltips-top-menu-btn").show();
        }).mouseleave(function(){
            $(this).find(".tooltips-top-menu-btn").hide();
        });
        $("#filters-nav a.dropdown-toggle").click(function(){
            filterContain=$(this).data("label-xs");
            $(".dropdown-xs-view .dropdown").removeClass("open");
            $(".dropdown-xs-view .dropdown-"+filterContain).addClass("open");
        });
        $(".tagsFilterInput").select2({tags:[]});
        $(".tooltips").tooltip();
        $(".btn-show-filters").click(function(){
            if(!$("#filters-nav").is(":visible")){
                //$("#vertical .btn-show-filters.hidden-xs").hide(350);
                $("#filters-nav").show(200);
                if(typeof themeParams.numberOfApp != "undefined" && themeParams.numberOfApp<=1)
                    $("#mainNav").removeClass("borderShadow");
                else
                    $("#menuApp.subMenuTop").removeClass("borderShadow")
                 
            }else{
                $("#filters-nav").hide(200);
                if(typeof themeParams.numberOfApp != "undefined" && themeParams.numberOfApp<=1)
                    $("#mainNav").addClass("borderShadow");
                else
                    $("#menuApp.subMenuTop").addClass("borderShadow");
                //$("#vertical .btn-show-filters.hidden-xs").show(200);
            }
            setTimeout(function(){headerHeightPos(true)},250);
        });
        $(".menu-btn-scope-filter").click(function(){
            if($("#filter-scopes-menu").is(":visible")){
                $(".menu-btn-scope-filter").removeClass("visible");
                $("#filter-scopes-menu").hide(200);
              //  headerHeightPos(true);
            }else{
                 $(".menu-btn-scope-filter").addClass("visible");
                $("#filter-scopes-menu").show(200);
                
               // showWhere(true);
            }
            setTimeout(function(){headerHeightPos(true)},250);
        });

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

    function initPositionInterface(){
        $(window).off();
        setTimeout(function(){
            //setDomHtmlPosition(intiHeight);
          /*  $(".main-container.vertical .headerSearchContainer").affix({
          offset: {
              top: 10
          }
    });*/
            if($("#header-banner").length > 0){
                setDomHtmlPosition($("#header-banner").outerHeight());
                $("#affix-sub-menu, #mainNav, #filters-nav, #menuApp").addClass("position-absolute");
            }else
               setDomHtmlPosition(0); heightTopMenu=$("#mainNav").outerHeight();
            $(window).bind("scroll",function(){ 
                if($("#header-banner").length > 0){
                    console.log($(this).scrollTop(), $("#header-banner").outerHeight(), infScroll);
                    if($(this).scrollTop() > $("#header-banner").outerHeight() && infScroll){
                        setDomHtmlPosition(0);
                        $("#affix-sub-menu, #mainNav, #menuApp, #filters-nav").removeClass("position-absolute");
                        $(".main-container.vertical .headerSearchContainer").addClass("affix");
                        infScroll=false;
                    }else if($(this).scrollTop()<=$("#header-banner").outerHeight() && !infScroll){
                        setDomHtmlPosition($("#header-banner").outerHeight());
                        $("#affix-sub-menu, #mainNav, #filters-nav, #menuApp").addClass("position-absolute");
                        infScroll=true;
                        
                    }
                }else{
                    if($(this).scrollTop()<=10){
                        infScroll=true;
                        $(".main-container.vertical .headerSearchContainer").removeClass("affix");
                        headerHeightPos(true);
                    }
                    if( $(this).scrollTop() > 10 && !headerScaling && typeof infScroll != "undefined" && infScroll && (typeof networkJson == "undefined" || networkJson == null) ) {
                        $(".main-container.vertical .headerSearchContainer").addClass("affix");
                        $("#filter-scopes-menu, #filters-nav").hide(200);
                        $(".menu-btn-scope-filter").removeClass("active");
                        //$("#vertical .btn-show-filters.hidden-xs").show(200);
                        setTimeout(function(){headerHeightPos(true)},250);
                        if(typeof themeParams.numberOfApp != "undefined" && themeParams.numberOfApp<=1)
                            $("#mainNav").addClass("borderShadow");
                        else
                            $("#menuApp.subMenuTop").addClass("borderShadow");
                        headerScaling=false;
                        infScroll=false;
                    }
                }
                //else
                //  $("#filter-scopes-menu, #filters-nav").show();

            });
        }, 400);
    }
    function setDomHtmlPosition(initHeight){
        $("#mainNav").css("top",initHeight);
        heightNav=$("#mainNav").outerHeight();
        heightTopMenu=heightNav+initHeight;
        $("#menuApp, #affix-sub-menu").css("top",heightTopMenu);
        $("#notificationPanelSearch.vertical.arrow_box, #floopDrawerDirectory, .main-container .dropdown-main-menu, #mainNav .dropdown-result-global-search, .main-container.vertical .portfolio-modal.modal, .portfolio-modal.modal.vertical").css("top",heightTopMenu);
        $(".dropdownApps-menuTop .dropdown-menu").css("top", (heightTopMenu+$("#text-search-menu").height()));
        headerHeightPos(false, initHeight);
        if(heightNav > 70){
            marginTop=(heightNav-55);
            $("#mainNav .navbar-right, #mainNav .navbar-item-left").css("margin-top", marginTop); 
          //  heightTopMenu=$("#mainNav").outerHeight()+initHeight;
        }
            
    }
    function headerHeightPos(bool,initHeight){
        //setTimeout(function(){     
            headerScaling=bool; 
            heightPos=$("#mainNav").outerHeight();
            if(notNull(initHeight))
                heightPos=heightPos+initHeight;
            if($("#affix-sub-menu").is(":visible"))
                heightPos=heightPos+$("#affix-sub-menu").outerHeight();
            $("#filter-scopes-menu").css("top",heightPos);
            if($("#filter-scopes-menu").is(":visible"))
                heightPos=heightPos+$("#filter-scopes-menu").outerHeight();
            if($("#menuApp").hasClass("subMenuTop")){
                $("#menuApp").css("top",heightPos);    
                heightPos=heightPos+$("#menuApp").outerHeight();
            }
            $("#filters-nav").css("top",heightPos);
            if($("#filters-nav").is(":visible"))
                heightPos=heightPos+$("#filters-nav").outerHeight(); 
            if($(".main-container.vertical .headerSearchContainer").hasClass("affix")){
                $(".main-container.vertical .headerSearchContainer").css("top",heightPos);
                heightPos=heightPos+$(".main-container.vertical .headerSearchContainer").outerHeight(); 
            }else{
                $(".main-container.vertical .headerSearchContainer").css("top","inherit");
            }
            if($("#header-banner").length > 0 && initHeight==0)
                heightPos=heightPos+$("#header-banner").outerHeight();
            $(".main-container").css("padding-top",heightPos);
            //$("header").height($("#affix-sub-menu").height());
            setTimeout(function(){headerScaling=false;},300);
        //}, 50);
    }
    function initScopeMenu(type){   
        bindSearchCity();
        bindScopesInputEvent();
        countFavoriteScope();
        getCommunexionLabel();
    }
</script>