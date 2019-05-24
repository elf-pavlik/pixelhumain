<!DOCTYPE html>

<!-- ****************************** THEME CO2 : mainSearch 2 ******************************-->
<?php 

    $layoutPath = 'webroot.themes.'.Yii::app()->theme->name.'.views.layouts.';
    $themeAssetsUrl = Yii::app()->theme->baseUrl. '/assets';
    $parentModuleId = ( @Yii::app()->params["module"]["parent"] ) ?  Yii::app()->params["module"]["parent"] : $this->module->id;
    $modulePath = ( @Yii::app()->params["module"]["parent"] ) ?  "../../../".$parentModuleId."/views"  : "..";

    $cs = Yii::app()->getClientScript();

    $CO2DomainName = isset(Yii::app()->params["CO2DomainName"]) ? Yii::app()->params["CO2DomainName"] : "CO2";

    //Network::getNetworkJson(Yii::app()->params['networkParams']);

    if(!@Yii::app()->session['paramsConfig']) 
        Yii::app()->session['paramsConfig'] = CO2::getThemeParams(); 
    $metaTitle = (isset($this->module->pageTitle)) ? $this->module->pageTitle : Yii::app()->session['paramsConfig']["metaTitle"]; 
    $metaDesc = (isset($this->module->description)) ? $this->module->description : @Yii::app()->session['paramsConfig']["metaDesc"];  
    $metaImg = (isset($this->module->image)) ? Yii::app()->getRequest()->getBaseUrl(true).$this->module->image : "https://co.viequotidienne.re/"."/themes/CO2".@Yii::app()->session['paramsConfig']["metaImg"]; 
    $metaRelCanoncial=(isset($this->module->relCanonical)) ? $this->module->relCanonical : "https://www.communecter.org";
    $keywords = ""; 
    if(isset($this->module->keywords))
        $keywords = $this->module->keywords; 
    else if(isset($this->keywords) )
        $keywords = $this->keywords; 
    if(isset($this->module->favicon) )
        $favicon = $this->module->favicon;   
    else  
        $favicon =(isset($this->module->assetsUrl)) ? $this->module->assetsUrl."/images/favicon.ico" : "/images/favicon.ico"; 
 
    $params = Yii::app()->session['paramsConfig']; 
?>

<html lang="en" class="no-js">   

    <head>
        <title><?php echo $metaTitle;?></title> 
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        
        <meta name="title" content="<?php echo $metaTitle; ?>"> 
        <meta name="description" content="<?php echo $metaDesc; ?>"> 
        <meta name="author" content="pixelhumain"> 
        <meta property="og:image" content="<?php echo $metaImg; ?>"/> 
        <meta property="og:description" content="<?php echo $metaDesc; ?>"/> 
        <meta property="og:title" content="<?php echo $metaTitle; ?>"/> 
        <meta name="keywords" lang="<?php echo Yii::app()->language; ?>" content="<?php echo CHtml::encode($keywords); ?>" >  
        
        <script type="text/javascript">
            <?php if(isset($_GET['_escaped_fragment_'])){ ?>
                window.location.hash = '#<?php echo $_GET['_escaped_fragment_'] ?>';
                <?php
                }
            ?>
            console.log("hash 0",window.location.hash);
            if (window.location.hash.indexOf('#!') === 0){
                var hash = window.location.hash.substr(2);
                console.log("hash",hash);
                window.location.hash = '#'+hash;
                console.log("window.location.hash",window.location.hash);
            }
        </script>
        <link rel='shortcut icon' type='image/x-icon' href="<?php echo $favicon;?>" />  
        <link rel="canonical" href="<?php echo $metaRelCanoncial ?>" />
 
<?php if( Yii::app()->params["forceMapboxActive"]==true &&  Yii::app()->params["mapboxActive"]==true ){ ?>
    <script src='https://api.mapbox.com/mapbox.js/v2.4.0/mapbox.js'></script>
    <link href='https://api.mapbox.com/mapbox.js/v2.4.0/mapbox.css' rel='stylesheet' />

    <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700" rel="stylesheet" type="text/css">
    <link href="https://fonts.googleapis.com/css?family=Lato:400,700,400italic,700italic" rel="stylesheet" type="text/css"> 

    <script src='//cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js'></script>
    <link href='//cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css' rel='stylesheet' />
<?php } ?>

    <?php 
    if(isset(Yii::app()->session['userId'])){
      $myContacts = Person::getPersonLinksByPersonId(Yii::app()->session['userId']);
      $myFormContact = $myContacts; 
      $getType = (isset($_GET["type"]) && $_GET["type"] != "citoyens") ? $_GET["type"] : "citoyens";
    }else{
      $myFormContact = null;
    }
    $communexion = CO2::getCommunexionCookies();
            
    $me = isset(Yii::app()->session['userId']) ? Person::getById(Yii::app()->session['userId']) : null;
    if($this->module->id != "costum"){
        Yii::app()->session['paramsConfig'] = CO2::getThemeParams();
        $params=Yii::app()->session['paramsConfig'];
        Yii::app()->session["costum"]=null;
    }
    $this->renderPartial($layoutPath.'initJs', 
                                 array( "me"=>$me, "parentModuleId" => $parentModuleId, "myFormContact" => @$myFormContact, "communexion" => $communexion, "themeParams"=>$params));
        ?>

        <?php 
            $cs->registerScriptFile(Yii::app() -> createUrl($parentModuleId."/default/view/page/trad/dir/..|translation/layout/empty"));
        ?>
        <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
        <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
        <!--[if lt IE 9]>
            <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
            <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
        <![endif]-->

    </head>

    <body id="page-top" class="index">
    <!-- <script type="text/javascript">
    var d = new Date();
    var timecount = d.getTime();
    </script> -->
        <!-- **************************************
        MAP CONTAINER
        ******************************************* -->
        <div id="firstLoader">
        <?php 
            if(isset($params["loadingModal"]))
                $this->renderPartial( $params["loadingModal"]  );
            else   
                $this->renderPartial($layoutPath.'loadingModal',array("themeParams"=>$params));
        ?>
        </div>

        <?php $this->renderPartial($layoutPath.'progressBar',array("themeParams"=>$params)); ?>
        <div id="mainMap">
            <?php 
            $this->renderPartial( $layoutPath.'mainMap.'.Yii::app()->params["CO2DomainName"], array("modulePath"=>$modulePath )); ?>
        </div>

        <?php 
        $this->renderPartial($layoutPath.'menusMap/'.$CO2DomainName, array( "layoutPath"=>$layoutPath, "me" => $me ) ); 
        ?>   
        
        <?php  if( isset(Yii::app()->session["userId"]) ){
                $this->renderPartial($layoutPath.'.rocketchat'); 
            } 
        ?>
        <!-- /********* MAIN-CONTAINER ***********/
            => Contain all structure of cotools (header + menu + view page + footer ) 
        -->
        <div class="main-container col-md-12 col-sm-12 col-xs-12 <?php echo @Yii::app()->session['paramsConfig']["appRendering"] ?>">
            <?php $this->renderPartial($layoutPath.'header',array("page"=>"welcome","layoutPath"=>$layoutPath)); ?>
            <!-- /********* WELCOME PAGE ***********/
                - Home page of co or costum home directly intergrated in pageContent (view container)
                - Hash will be catch after on jquery 
            -->
            <div class="pageContent">
                <?php 
                echo $content; 
                ?>
            </div>
            <?php $this->renderPartial($layoutPath.'footer', array(  "page" => "welcome")); ?>

        </div>
        <div class="portfolio-modal portfolio-modal-survey modal fade <?php echo @Yii::app()->session['paramsConfig']["appRendering"] ?>" id="openModal" tabindex="-1" role="dialog" aria-hidden="true" style="top:0px !important;">
            <div class="modal-content">
                <div class="close-modal" data-dismiss="modal">
                    <div class="lr">
                        <div class="rl">
                        </div>
                    </div>
                </div>
                <div class="col-sm-12 container">
                    <div class="row">
                        <div class="col-lg-12">
                             <div class="modal-header text-dark">
                                <h3 class="modal-title text-center" id="ajax-modal-modal-title">
                                 </h3>
                            </div>
                            <div id="ajax-modal-modal-body" class="modal-body">
                                  <form id="modal-dynSurvey" class="" style=""></form>
       
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xs-12 text-center" style="margin-top:50px;margin-bottom:50px;">
                    <hr>
                    <a href="javascript:" style="font-size: 13px;" type="button" class="" data-dismiss="modal">
                    <i class="fa fa-times"></i> <?php echo Yii::t("common","Back") ?>
                    </a>
                </div>
            </div>
        </div>
        <div id="modal-preview-coop" class="shadow2 hidden"></div>
        <div id="modal-settings" class="shadow2"></div>
        <div id="floopDrawerDirectory" class="floopDrawer"></div>
        <div class="portfolio-modal modal fade <?php echo @Yii::app()->session['paramsConfig']["appRendering"] ?>" id="openModal" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-content">
                <div class="close-modal" data-dismiss="modal">
                    <div class="lr">
                        <div class="rl">
                        </div>
                    </div>
                </div>
                <div class="col-sm-12 container">
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="modal-header text-dark">
                                <h3 class="modal-title text-center" id="ajax-modal-modal-title">
                                    <i class="fa fa-angle-down"></i> <i class="fa " id="ajax-modal-icon"></i> 
                                </h3>
                            </div>
                            
                            <div id="ajax-modal-modal-body" class="modal-body">
                                
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xs-12 text-center" style="margin-top:50px;margin-bottom:50px;">
                    <hr>
                    <a href="javascript:" style="font-size: 13px;" type="button" class="" data-dismiss="modal">
                    <i class="fa fa-times"></i> <?php echo Yii::t("common","Back") ?>
                    </a>
                </div>
            </div>
        </div>
        
        <?php 

            /* ***********************
            add to HEAD
            ************************ */
            echo "<!-- start: MAIN JAVASCRIPTS -->";
            echo "<!--[if lt IE 9]>";
            $cs->registerScriptFile(Yii::app()->request->baseUrl.'/plugins/respond.min.js' , CClientScript::POS_HEAD);
            $cs->registerScriptFile(Yii::app()->request->baseUrl. '/plugins/excanvas.min.js' , CClientScript::POS_HEAD);
            $cs->registerScriptFile(Yii::app()->request->baseUrl. '/plugins/jQuery/jquery-1.11.1.min.js' , CClientScript::POS_HEAD);
            echo "<![endif]-->";
            echo "<!--[if gte IE 9]><!-->";
            $cs->registerScriptFile(Yii::app()->request->baseUrl. '/plugins/jQuery/jquery-2.1.1.min.js' , CClientScript::POS_HEAD);
            echo "<!--<![endif]-->";
            /* ***********************
            add to HEAD
            ************************ */

            /* ***********************
            ph core stuff
            ************************ */
            $cssAnsScriptFilesModule = array(
                '/plugins/jquery-ui-1.12.1/jquery-ui.min.js',
                '/plugins/jquery-ui-1.12.1/jquery-ui.min.css',
                
                '/plugins/jquery-validation/dist/jquery.validate.min.js',
                '/plugins/bootbox/bootbox.min.js' , 
                '/plugins/blockUI/jquery.blockUI.js' , 
                '/plugins/toastr/toastr.js' , 
                '/plugins/toastr/toastr.min.css',
                '/plugins/jquery.ajax-cross-origin.min.js',
                '/plugins/jquery-cookie/jquery.cookie.js' , 
                '/plugins/lightbox2/css/lightbox.css',
                '/plugins/lightbox2/js/lightbox.min.js',
                '/plugins/bootstrap-fileupload/bootstrap-fileupload.min.js' , 
                '/plugins/bootstrap-fileupload/bootstrap-fileupload.min.css',
                '/plugins/jquery-cookieDirective/jquery.cookiesdirective.js' , 
                '/plugins/ladda-bootstrap/dist/spin.min.js' , 
                '/plugins/ladda-bootstrap/dist/ladda.min.js' , 
                '/plugins/ladda-bootstrap/dist/ladda.min.css',
                '/plugins/ladda-bootstrap/dist/ladda-themeless.min.css',
                '/plugins/animate.css/animate.min.css',
                '/plugins/jQuery-contextMenu/dist/jquery.contextMenu.min.js' , 
                '/plugins/jQuery-contextMenu/dist/jquery.contextMenu.min.css' , 
                '/plugins/jQuery-contextMenu/dist/jquery.ui.position.min.js' , 
                
                '/plugins/select2/select2.min.js' , 
                '/plugins/moment/min/moment.min.js' ,
                '/plugins/moment/min/moment-with-locales.min.js',
                '/plugins/jquery.dynForm.js',
                '/plugins/jQuery-Smart-Wizard/js/jquery.smartWizard.js',
                '/plugins/jquery.dynSurvey/jquery.dynSurvey.js',
                
                '/plugins/jquery.elastic/elastic.js',
                '/plugins/underscore-master/underscore.js',
                '/plugins/jquery-mentions-input-master/jquery.mentionsInput.js',
                '/plugins/jquery-mentions-input-master/jquery.mentionsInput.css',
                //'/js/cookie.js' ,
                '/js/api.js',
                //'/plugins/animate.css/animate.min.css',
                '/plugins/font-awesome/css/font-awesome.min.css',
                //'/plugins/font-awesome-custom/css/font-awesome.css',

                '/plugins/cryptoJS-v3.1.2/rollups/aes.js',
                //FineUplaoder (called in jquery.dynform.js)
                '/plugins/fine-uploader/jquery.fine-uploader/fine-uploader-gallery.css',
                '/plugins/fine-uploader/jquery.fine-uploader/jquery.fine-uploader.js',
                '/plugins/fine-uploader/jquery.fine-uploader/fine-uploader-new.min.css',
                '/plugins/facemotion/faceMocion.css',
                '/plugins/facemotion/faceMocion.js',
            );
            if(Yii::app()->language!="en")
                array_push($cssAnsScriptFilesModule,"/plugins/jquery-validation/localization/messages_".Yii::app()->language.".js");
            HtmlHelper::registerCssAndScriptsFiles($cssAnsScriptFilesModule, Yii::app()->getRequest()->getBaseUrl(true));
            /* ***********************
            END ph core stuff
            ************************ */

            /* ***********************
            module stuff
            ************************ */
            
            $moduleAssets = ( @Yii::app()->params["module"]["parent"] ) ?  Yii::app()->getModule( Yii::app()->params["module"]["parent"] )->getAssetsUrl()  : $this->module->assetsUrl;
            HtmlHelper::registerCssAndScriptsFiles( 
                CO2::getModulesRessources(),
                $moduleAssets
            );
            HtmlHelper::registerCssAndScriptsFiles( 
                array('/js/default/formInMap.js'),
                $moduleAssets
            );
            HtmlHelper::registerCssAndScriptsFiles( 
                array('/js/uiCoop.js'), 
                Yii::app()->getModule( "dda" )->getAssetsUrl()
            );
            /* ***********************
            END module stuff
            ************************ */

            /* ***********************
            theme stuff
            ************************ */
            $cssAnsScriptFilesModule = array(   
                '/assets/vendor/bootstrap/js/bootstrap.min.js',
                '/assets/vendor/bootstrap/css/bootstrap.min.css',
                '/assets/css/sig/sig.css',
                '/assets/css/freelancer.css',
                '/assets/css/default/dynForm.css',
                '/assets/css/CO2-boot.css',
                '/assets/css/CO2-color.css',
                '/assets/css/CO2.css',
                '/assets/css/plugins.css',
                '/assets/css/floopDrawerRight.css',
                '/assets/css/cooperation.css',
                '/assets/css/default/directory.css',
                '/assets/js/comments.js'
            );
            HtmlHelper::registerCssAndScriptsFiles($cssAnsScriptFilesModule, Yii::app()->theme->baseUrl);

            $cssAnsScriptFilesModule = array(
                "/js/default/loginRegister.js",
                '/js/co.js',
                '/js/default/directory.js',
                '/js/default/search.js',
                '/js/links.js',
                '/js/default/index.js',
                '/js/default/notifications.js',
                '/js/dataHelpers.js',
                '/js/sig/localisationHtml5.js',
                '/js/floopDrawerRight.js',
                '/js/sig/geoloc.js',
                '/js/default/globalsearch.js',
                '/js/sig/findAddressGeoPos.js',
                '/js/jquery.filter_input.js',
                '/js/scopes/scopes.js',
            );
            HtmlHelper::registerCssAndScriptsFiles($cssAnsScriptFilesModule, $this->module->getParentAssetsUrl() );
            /* ***********************
            END theme stuff
            ************************ */
    
        ?>
        
        <?php $this->renderPartial('dda.views.co.pod.modalCommon', array()); 
            if(isset(Yii::app()->session['userId'])){
                $this->renderPartial('news.views.co.modalShare', array());
                $this->renderPartial($layoutPath.'notifications'); 
            }

            // BOUBOULE NOT USE FOR MOMENT $this->renderPartial($layoutPath.'modals.'.$CO2DomainName.'.mainMenu', array("me"=>$me) ); 
            $this->renderPartial( $layoutPath.'menuBottom.'.Yii::app()->params["CO2DomainName"], array("themeParams"=>@Yii::app()->session['paramsConfig'])); 
        ?>
        
        <script>        
            var CO2DomainName = "<?php echo $CO2DomainName; ?>";
            var CO2params = <?php echo json_encode(Yii::app()->session['paramsConfig']); ?>;
            
            jQuery(document).ready(function() { 
                themeObj.init(); 
                $.each(modules,function(k,v) { 
                    if(typeof v.init != "undefined" && notNull(v.init)){
                        mylog.log("init.js for module : ",k);
                        callB=(typeof v.callback != "undefined" )? v.callback : null;
                        lazyLoad( v.init , null, callB);
                    }
                });
               
                var pageUrls = <?php echo json_encode(Yii::app()->session['paramsConfig']["pages"]); ?>;
                $.each( pageUrls ,function(k , v){ 
                    if(typeof urlCtrl.loadableUrls[k] == "undefined")
                        urlCtrl.loadableUrls[k] = v;
                    else {
                        $.each( v ,function(ki , vi){ 
                            urlCtrl.loadableUrls[k][ki] = vi;
                        });
                    }
                });
                if(typeof themeObj.firstLoad == "function")
                    themeObj.firstLoad();
                else if(themeObj.firstLoad){
                    //Specific case if welcome is 
                    if(location.hash == "#welcome" 
                        || ((location.hash == "" ||  location.hash == "#") && (userId=="" || (userId!="" && themeParams.pages["#app.index"].redirect.logged=="welcome")))){
                        setTimeout(function(){ $('.progressTop').val(60)
                            $("#loadingModal").css({"opacity": 0.8});
                        }, 500);
                        setTimeout(function(){ $('.progressTop').val(80)}, 500);
                        setTimeout(function(){ $(".progressTop").val(100);}, 5000);
                        setTimeout(function(){ 
                            $(".progressTop").fadeOut(200);
                            $("#firstLoader").fadeOut(400);
                        }, 500);

                    }else{
                        themeObj.firstLoad=false;
                        $(".pageContent").html("<i class='fa fa-spin fa-spinner'></i>");
                        urlCtrl.loadByHash(location.hash);
                    }    
                }else
                    $("#page-top").show();
                /*$(".close-footer-help").click(function(){
                    $("#footer-help").remove();
                    if(typeof userId != "undefined" && userId != ""){
                        $.ajax({
                            type: "POST",
                            url: baseUrl+"/"+moduleId+"/person/removehelpblock/id/"+userId,
                            dataType: "json",
                            success: function(data){
                                    toastr.success("Ce bandeau ne s'affichera plus lorsque vous êtes connecté(e) !");
                                }
                            });
                    }
                });
                $(".add-cookie-close-footer").click(function(){
                    $.cookie('unseenHelpCo', true, { expires: 365, path: "/" });
                    $("#footer-help").fadeOut();
                    toastr.success("Ce bandeau ne s'affichera plus sur ce navigateur !");
                });*/
            });
        </script>
    </body>

</html>