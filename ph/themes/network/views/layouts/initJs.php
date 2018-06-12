<?php 
$preferences = Preference::getPreferencesByTypeId(@Yii::app()->session["userId"], Person::COLLECTION);
$multiscopes = (empty($me) && isset( Yii::app()->request->cookies['multiscopes'] )) ? 
                            Yii::app()->request->cookies['multiscopes']->value : "{}";
?>
<script>

    var baseUrl = "<?php echo Yii::app()->getRequest()->getBaseUrl(true);?>";
    var moduleUrl = "<?php echo Yii::app()->controller->module->assetsUrl;?>";
    var moduleId = "<?php echo $parentModuleId?>";
    var activeModuleId = "<?php echo $this->module->id?>";


    var modules = {
        "ressources": <?php echo json_encode( Ressource::getConfig() ) ?>,
        "classifieds": <?php echo json_encode( Classified::getConfig() ) ?>,
        "places": <?php echo json_encode( Place::getConfig() ) ?>,
    };

    var themeUrl = "<?php echo Yii::app()->theme->baseUrl;?>";
    var userId = "<?php echo Yii::app()->session['userId']?>";
    var mainLanguage = "<?php echo Yii::app()->language ?>";
    var debug = <?php echo (YII_DEBUG) ? "true" : "false" ?>;
    var currentUrl = "<?php echo "#".Yii::app()->controller->id.".".Yii::app()->controller->action->id ?>";
    var debugMap = [
        <?php if(YII_DEBUG) { ?>
           { "userId":"<?php echo Yii::app()->session['userId']?>"},
           { "userEmail":"<?php echo Yii::app()->session['userEmail']?>"}
        <?php } ?>
        ];

    var myScopes={};

    var currentScrollTop = 0;
    var isMapEnd = false;
	//used in communecter.js dynforms
    var tagsList = <?php echo json_encode(Tags::getActiveTags()) ?>;
    var eventTypes = <?php asort(Event::$types); echo json_encode(Event::$types) ?>;
    var organizationTypes = <?php echo json_encode( Organization::$types ) ?>;
    var avancementProject = <?php echo json_encode( Project::$avancement ) ?>;
    var currentUser = <?php echo isset($me) ? json_encode(Yii::app()->session["user"]) : "null"?>;
    var rawOrganizerList = <?php echo json_encode(Authorisation::listUserOrganizationAdmin(Yii::app() ->session["userId"])) ?>;
    var organizerList = {}; 
    var poiTypes = <?php echo json_encode( Poi::$types ) ?>;
    //var rolesList=[ tradCategory.financier, tradCategory.partner, tradCategory.sponsor, tradCategory.organizor, tradCategory.president, tradCategory.director, tradCategory.speaker, tradCategory.intervener];

    var rolesList=[ { id : tradCategory.financier, text : tradCategory.financier}, 
                    { id : tradCategory.partner , text : tradCategory.partner } ];

    var myContacts = <?php echo (@$myFormContact != null) ? json_encode($myFormContact) : "null"; ?>;
    var myContactsById =<?php echo (@$myFormContact != null) ? json_encode($myFormContact) : "null"; ?>;
    var userConnected = <?php echo isset($me) ? json_encode($me) : "null"; ?>;

    var poi = <?php echo json_encode( CO2::getContextList("poi") ) ?>;

    //var classifiedSubTypes = <?php //echo json_encode( Classified::$classifiedSubTypes ) ?>;
    var urlTypes = <?php asort(Element::$urlTypes); echo json_encode(Element::$urlTypes) ?>;
    
    var globalTheme = "<?php echo Yii::app()->theme->name;?>";

    var search={
        value:"",
        page:0,
        count:true,
        app:"search",
        type:"<?php echo Organization::COLLECTION ?>"
    };

    var mapIconTop = {
        "default" : "fa-arrow-circle-right",
        "citoyen":"<?php echo Person::ICON ?>", 
        "citoyens":"<?php echo Person::ICON ?>", 
        "person":"<?php echo Person::ICON ?>", 
        "people":"<?php echo Person::ICON ?>", 
        "NGO":"<?php echo Organization::ICON ?>",
        "LocalBusiness" :"<?php echo Organization::ICON_BIZ ?>",
        "Group" : "<?php echo Organization::ICON_GROUP ?>",
        "group" : "<?php echo Organization::ICON ?>",
        "association" : "<?php echo Organization::ICON ?>",
        "organization" : "<?php echo Organization::ICON ?>",
        "organizations" : "<?php echo Organization::ICON ?>",
        "GovernmentOrganization" : "<?php echo Organization::ICON_GOV ?>",
        "event":"<?php echo Event::ICON ?>",
        "events":"<?php echo Event::ICON ?>",
        "project":"<?php echo Project::ICON ?>",
        "projects":"<?php echo Project::ICON ?>",
        "city": "<?php echo City::ICON ?>",
        "entry": "fa-gavel",
        "action": "fa-cogs",
        "actions": "fa-cogs",
        "poi": "fa-info-circle",
        "video": "fa-video-camera",
        "classified" : "fa-bullhorn"
    };
    
    var mapColorIconTop = {
        "default" : "dark",
        "citoyen":"yellow", 
        "citoyens":"yellow", 
        "person":"yellow", 
        "people":"yellow", 
        "NGO":"green",
        "LocalBusiness" :"azure",
        "Group" : "white",
        "group" : "green",
        "association" : "green",
        "organization" : "green",
        "organizations" : "green",
        "GovernmentOrganization" : "green",
        "event":"orange",
        "events":"orange",
        "project":"purple",
        "projects":"purple",
        "city": "red",
        "entry": "azure",
        "action": "lightblue2",
        "actions": "lightblue2",
        "poi": "dark",
        "video":"dark",
        "classified" : "yellow"
    };

    var directoryViewMode="block";
    var themeObj = {
        init : function(){
            toastr.options = {
              "closeButton": false,
              "positionClass": "toast-bottom-right",
              "onclick": null,
              "showDuration": "1000",
              "hideDuration": "1000",
              "timeOut": "5000",
              "extendedTimeOut": "1000",
              "showEasing": "swing",
              "hideEasing": "linear",
              "showMethod": "fadeIn",
              "hideMethod": "fadeOut"
            };

            if( notNull(localStorage) && notNull(localStorage.myScopes) )
                myScopes = JSON.parse(localStorage.getItem("myScopes"));

            if( notNull(myScopes) && myScopes.userId == userId )  {
                myScopes.open={};
                myScopes.search = {};
                myScopes.openNews={};
                if(myScopes.multiscopes==null)
                    myScopes.multiscopes={};
            } else {
                myScopes={
                    type:"open",
                    typeNews:"open",
                    userId: userId,
                    open : {},
                    openNews : {},
                    search : {},
                    communexion : <?php echo json_encode(CO2::getCommunexionUser()) ?>,
                    multiscopes : <?php echo isset($me) && isset($me["multiscopes"]) ? 
                                    json_encode($me["multiscopes"]) :
                                    $multiscopes; ?>
                };

                if( myScopes.communexion != false)
                    myScopes.communexion=scopeObject(myScopes.communexion);
                else
                    myScopes.communexion={};
                localStorage.setItem("myScopes",JSON.stringify(myScopes));
            }

            initFloopDrawer();
            resizeInterface();
        },
        imgLoad : "CO2r.png" ,
        mainContainer : ".main-container",
        blockUi : {
            processingMsg : //'<img src="'+themeUrl+'/assets/img/CO2r.png" class="nc_map" height=80>'+
                  '<i class="fa fa-spin fa-circle-o-notch"></i>'+
                  '<h4 style="font-weight:300" class=" text-dark padding-10">'+
                    'Chargement en cours...'+
                  '</h4>'+
                  '<span style="font-weight:300" class=" text-dark">'+
                    'Merci de patienter quelques instants'+
                  '</span>',
                  //'<br><br><br>'+
                  //'<a href="#" class="btn btn-default btn-sm lbh">'+
                  //  "c'est trop long !"+
                  //'</a>', 
            errorMsg : //'<img src="'+themeUrl+'/assets/img/CO2r.png" class="nc_map" height=80>'+
              '<i class="fa fa-times"></i><br>'+
               '<span class="col-md-12 text-center font-blackoutM text-left">'+
                '<span class="letter letter-red font-blackoutT" style="font-size:40px;">404</span>'+
               '</span>'+

              '<h4 style="font-weight:300" class=" text-dark padding-10">'+
                'Oups ! Une erreur s\'est produite'+
              '</h4>'
              //'<span style="font-weight:300" class=" text-dark">'+
                //'Vous allez être redirigé vers la page d\'accueil'+
              //'</span>'
        },
        dynForm : {
            onLoadPanel : function (elementObj) { 
                //console.log("onLoadPanel currentKFormType", currentKFormType);
                var typeName = (typeof currentKFormType != "undefined" && currentKFormType!=null) ? 
                    trad["add"+currentKFormType] : elementObj.dynForm.jsonSchema.title;
                
                var typeIcon = (typeof currentKFormType != "undefined" && currentKFormType!=null) ? 
                    typeObj[currentKFormType].icon : elementObj.dynForm.jsonSchema.icon;


                $("#ajax-modal-modal-title").html(
                        "<i class='fa fa-"+typeIcon+"'></i> "+typeName);
                
                $("#ajax-modal .modal-header").removeClass("bg-dark bg-red bg-purple bg-green bg-green-poi bg-orange bg-turq bg-yellow bg-url");
                $("#ajax-modal .infocustom p").removeClass("text-dark text-red text-purple text-green text-green-poi text-orange text-turq text-yellow text-url");
                
                if(typeof currentKFormType != "undefined" && typeObj[currentKFormType] && typeObj[currentKFormType].color){
                    $("#ajax-modal .modal-header").addClass("bg-"+typeObj[currentKFormType].color);
                    $("#ajax-modal .infocustom p").addClass("text-"+typeObj[currentKFormType].color);
                }
                
                <?php if(Yii::app()->params["CO2DomainName"] == "kgougle"){ ?>
                $(".locationBtn").on( "click", function(){
                     setTimeout(function(){
                        $('[name="newElement_country"]').val("NC");
                        $('[name="newElement_country"]').trigger("change");
                     },1000); 
                });
                <?php } ?>
                
                $(".locationBtn").html("<i class='fa fa-home'></i> <?php echo Yii::t("common","Main locality") ?>")
                $(".locationBtn").addClass("letter-red bold");
                $("#btn-submit-form").removeClass("text-azure").addClass("letter-green");
                if(typeof currentKFormType != "undefined")
                    $("#ajaxFormModal #type").val(currentKFormType);
            }
        }
    };

function expireAllCookies(name, paths) {
    var expires = new Date(0).toUTCString();
    document.cookie = name + '=; expires=' + expires;
    for (var i = 0, l = paths.length; i < l; i++) {
        document.cookie = name + '=; path=' + paths[i] + '; expires=' + expires;
    }
};

function removeCookies() {
    expireAllCookies('cityInseeCommunexion', ['/', '/ph', '/ph/co2', 'co2']);
    expireAllCookies('regionNameCommunexion', ['/', '/ph', '/ph/co2', 'co2']);
    expireAllCookies('nbCpbyInseeCommunexion', ['/', '/ph', '/ph/co2', 'co2']);
    expireAllCookies('countryCommunexion', ['/', '/ph', '/ph/co2']);
    expireAllCookies('cityName', ['/', '/ph', '/ph/co2', 'co2']);
    expireAllCookies('insee', ['/', '/ph', '/ph/co2', 'co2']);    
    expireAllCookies('inseeCommunexion', ['/','/ph', '/ph/co2', 'co2']);
    expireAllCookies('cpCommunexion', ['/','/ph', '/ph/co2', 'co2']);
    expireAllCookies('cityNameCommunexion', ['/','/ph', '/ph/co2', 'co2']);
    expireAllCookies('communexionType', ['/ph', '/ph/co2', 'co2']);
    expireAllCookies('communexionValue', ['/ph', '/ph/co2', 'co2']);
    expireAllCookies('communexionName', ['/ph', '/ph/co2', 'co2']);
    expireAllCookies('communexionLevel', ['/ph', '/ph/co2', 'co2']);
    expireAllCookies('communexionActivated', ['/ph', '/ph/co2', 'co2']);
    //expireAllCookies('multiscopes', ['/ph', '/ph/co2', 'co2']);

}

removeCookies();
    
</script>