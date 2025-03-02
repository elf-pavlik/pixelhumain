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
     var parentModuleUrl = "<?php echo ( @Yii::app()->params["module"]["parent"] )  ? Yii::app()->getModule( Yii::app()->params["module"]["parent"] )->getAssetsUrl() : Yii::app()->controller->module->assetsUrl ?>";

    var modules = {
        //Configure here eco
        "classifieds":<?php echo json_encode( Classified::getConfig("classifieds") ) ?>,
        "jobs":<?php echo json_encode( Classified::getConfig("jobs") ) ?>,
        "ressources":<?php echo json_encode( Classified::getConfig("ressources") ) ?>,
        "places": <?php echo json_encode( Place::getConfig() ) ?>,
        "poi": <?php echo json_encode( Poi::getConfig() ) ?>,
        "chat": <?php echo json_encode( Chat::getConfig() ) ?>,
        "interop": <?php echo json_encode( Interop::getConfig() ) ?>,
        "eco" : <?php echo json_encode( array(
            "module" => "eco",
            "url"    => Yii::app()->getModule( "eco" )->assetsUrl
        )); ?>,
        "survey" : <?php echo json_encode( array(
            "url"    => Yii::app()->getModule( "survey" )->assetsUrl
        )); ?>,
        "co2" : <?php echo json_encode( array(
            "url"    => Yii::app()->getModule( "co2" )->assetsUrl
        )); ?>,
        "cotools" : <?php echo json_encode( array(
            "module" => "cotools",
            "init"   => Yii::app()->getModule( "cotools" )->assetsUrl."/js/init.js" ,
            "form"   => Yii::app()->getModule( "cotools" )->assetsUrl."/js/dynForm.js" ,
        )); ?>
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

    var deviseTheme = <?php echo json_encode(@$params["devises"]) ?>;
    var deviseDefault = <?php echo json_encode(@$params["deviseDefault"]) ?>;

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

    var searchObject={
        text:"",
        page:0,
        indexMin:0,
        indexStep:30,
        count:true,
        tags:[],
        initType : "",
        types:[],
        countType:[],
        locality:{}
    };

    var typeObj = {
        addPhoto:{ titleClass : "bg-dark", color : "bg-dark" },
        addFile:{ titleClass : "bg-dark", color : "bg-dark" },
        photo:{ titleClass : "bg-dark", color : "bg-dark" },
        file:{ titleClass : "bg-dark", color : "bg-dark" },
        person : { col : "citoyens" ,
            ctrl : "person", titleClass : "bg-yellow",bgClass : "bgPerson", color:"yellow",icon:"user", hash : "#element.invite", 
            class: "lbhp", 
            add: true,
            addInElement:false,
            name: trad.people,
            addLabel: trad.invitesomeone,
            createLabel: trad.invitesomeone,
            /*explainText:"Diffuse an event<br>Invite attendees<br>Communicate to your network",*/
        },
        persons : { sameAs:"person" },
        people : { sameAs:"person" },
        citoyen : { sameAs:"person" },
        citoyens : { sameAs:"person" },
        
        siteurl:{ col:"siteurl",ctrl:"siteurl"},
        organization : { col:"organizations", ctrl:"organization", icon : "group",titleClass : "bg-green",color:"green",bgClass : "bgOrga", 
            add: true,
            addInElement:false,
            formType:"organization",
            name: trad.organization, 
            createLabel: trad.createorganization,
            explainText: "Blabla"
        },
        organizations : {sameAs:"organization"},
        organization2 : { col:"organizations", ctrl:"organization" },
        LocalBusiness : {col:"organizations",color: "azure",icon: "industry",
            name:trad.LocalBusiness,
            addInElement:true,
            formType:"organization",
            formSubType:"LocalBusiness",
            createLabel:"Create a local business",
            explainText:tradDynForm.infosmallcreatebusiness,           
            parentAllow:["citoyens"]
        },
        NGO : {sameAs:"organization", color:"green", icon:"users",
            name : trad.NGO,
            formType:"organization",
            createLabel:"Create an NGO",
            formSubType:"NGO",
            addInElement:true,
            explainText:tradDynForm.infosmallcreatengo,           
            parentAllow:["citoyens"]
        },
        Association : {sameAs:"organization", color:"green", icon: "group"},
        GovernmentOrganization : {col:"organization", color: "red",icon: "university",
            name:trad.GovernmentOrganization,
            formType:"organization",
            formSubType:"GovernmentOrganization",
            createLabel:"Create a public sevrice",
            addInElement:true,
            explainText:tradDynForm.infosmallcreatepublicservice,           
            parentAllow:["citoyens"]
        },
        Group : {   col:"organizations",color: "turq",icon: "circle-o",
            name:trad.Group,
            formType:"organization",
            formSubType:"Group",
            createLabel:"Create a group",
            addInElement:true,
            explainText:tradDynForm.infosmallcreategroup,           
            parentAllow:["citoyens"]
        },
        event : {col:"events",ctrl:"event",icon : "calendar",titleClass : "bg-orange", color:"orange",bgClass : "bgEvent", 
            add: true,
            addInElement:true,
            formType:"event",
            name: trad.event, 
            createLabel: trad.createevent,
            explainText:tradDynForm.infosmallcreateevent,
            parentAllow:["citoyens", "organizations","projects", "events"]
        },
        
        events : {sameAs:"event"},
        project : {col:"projects",ctrl:"project",   icon : "lightbulb-o",color : "purple",titleClass : "bg-purple", bgClass : "bgProject",
            add: true,
            addInElement:true,
            formType:"project",
            name: trad.project, 
            createLabel: trad.createproject,
            explainText: tradDynForm.infosmallcreateproject,
            parentAllow:[ "citoyens", "organizations","projects"]
        },
        projects : {sameAs:"project"},
        project2 : {col:"projects",ctrl:"project"},
        city : {sameAs:"cities"},
        cities : {col:"cities",ctrl:"city", titleClass : "bg-red", icon : "university",color:"red"},
        
        entry : {   col:"surveys",  ctrl:"survey",  titleClass : "bg-dark",bgClass : "bgDDA",   icon : "gavel", color : "azure", 
            saveUrl : baseUrl+"/" + moduleId + "/survey/saveSession"},
        
        product:{ col:"products",ctrl:"product", titleClass : "bg-orange", color:"orange",  icon:"shopping-basket"},
        products : {sameAs:"product"},
        service:{ col:"services",ctrl:"service", titleClass : "bg-green", color:"green",    icon:"sun-o"},
        services : {sameAs:"service"},
        circuit:{ col:"circuits",ctrl:"circuit", titleClass : "bg-orange", color:"green",   icon:"ravelry"},
        circuits : {sameAs:"circuit"},
        poi:{  col:"poi",ctrl:"poi",color:"green-poi", titleClass : "bg-green-poi", icon:"map-marker",
            subTypes:["link" ,"tool","machine","software","rh","RessourceMaterielle","RessourceFinanciere",
                   "ficheBlanche","geoJson","compostPickup","video","sharedLibrary","artPiece","recoveryCenter",
                   "trash","history","something2See","funPlace","place","streetArts","openScene","stand","parking","other" ], 
            add: true,
            addInElement:true,
            name: tradCategory.poi,
            formType: "poi",
            explainText:tradDynForm.infosmallcreatepoi,
            parentAllow:["citoyens", "organizations","projects", "events"]
        },
        url : {col : "url" , ctrl : "url",titleClass : "bg-blue",bgClass : "bgPerson",color:"blue",icon:"user",saveUrl : baseUrl+"/" + moduleId + "/element/saveurl",   },
        bookmark : {col : "bookmarks" , ctrl : "bookmark",titleClass : "bg-dark",bgClass : "bgPerson",color:"blue",icon:"bookmark"},
        document : {col : "document" , ctrl : "document",titleClass : "bg-dark",bgClass : "bgPerson",color:"dark",icon:"upload",saveUrl : baseUrl+"/" + moduleId + "/element/savedocument", },
        default : {icon:"arrow-circle-right",color:"dark"},
        //"video" : {icon:"video-camera",color:"dark"},
        formContact : { titleClass : "bg-yellow",bgClass : "bgPerson",color:"yellow",icon:"user", saveUrl : baseUrl+"/"+moduleId+"/app/sendmailformcontact"},
        news : { col : "news", ctrl:"news", titleClass : "bg-dark", color:"dark",   icon:"newspaper-o"},
        //news : { col : "news" }, 
        config : { col:"config",color:"azure",icon:"cogs",titleClass : "bg-azure", title : tradDynForm.addconfig,
                    sections : {
                        network : { label: "Network Config",key:"network",icon:"map-marker"}
                    }},

        classified : { col:"classifieds",ctrl:"classified",color:"azure", icon:"bullhorn", titleClass : "bg-azure", bgClass : "bgPerson", 
            add: true,
            addInElement:true,
            formType:"classifieds",
            name: trad.classified, 
            createLabel: "Create a classified",
            explainText: tradDynForm.infosmallcreateclassifieds,
            parentAllow:[ "citoyens", "organizations","projects"]
        },
        classifieds : { sameAs:"classified" },
        ressource : {  col:"classifieds",ctrl:"classified",color:"vine", icon:"cubes", titleClass : "bg-vine", bgClass : "bgPerson",
            add: true,
            addInElement:true,
            formType:"ressources",
            name: trad.ressource, 
            createLabel: "add a ressource",
            explainText: tradDynForm.infosmallcreateressources,
            parentAllow:[ "citoyens", "organizations","projects", "events"]
        },
        ressources : { sameAs:"ressource" },
        job :{  col:"classifieds",ctrl:"classified",color:"yellow-k", icon:"briefcase", titleClass : "bg-yellow-k", bgClass : "bgPerson",
            add: true,
            addInElement:true,
            formType:"jobs",
            name: trad.job, 
            createLabel: "Add an offers",
            explainText: tradDynForm.infosmallcreatejobs,
            parentAllow:[ "citoyens", "organizations","projects"]
        },
        jobs : { sameAs:"job" },
        network : { col:"network",color:"azure",icon:"map-o",titleClass : "bg-turq"},
        networks : {sameAs:"network"},
        vote : {sameAs:"proposals"},
        survey : {col:"proposals",ctrl:"proposal", color:"dark",icon:"hashtag", titleClass : "bg-turq" }, 
        surveys : {sameAs:"survey"},
        proposal : { col:"proposals", ctrl:"proposal", color:"turq",icon:"gavel", titleClass : "bg-turq", 
            add: true,
            addInElement: true,
            name: trad.survey,
            formType:"proposal",
            createLabel: "Create a survey",
            explainText: "Make a survey<br>add a referendum<br>construct a collective opinion",
            parentAllow:["organizations","projects"]
        }, 
        proposals : { sameAs : "proposal" },
        proposal2 : { sameAs : "proposal" },
        resolutions : { col:"resolutions", ctrl:"resolution", titleClass : "bg-turq", bgClass : "bgDDA", icon : "certificate", color : "turq" },
        action : {col:"actions", ctrl:"action", titleClass : "bg-turq", bgClass : "bgDDA", icon : "cogs", color : "dark" },
        actions : { sameAs : "action" },
        actionRooms : {sameAs:"room"},
        rooms : {sameAs:"room"},
        room : {col:"rooms",ctrl:"room",color:"azure",icon:"connectdevelop",titleClass : "bg-turq"},
        discuss : {col:"actionRooms",ctrl:"room"},
        contactPoint : {col : "contact" , ctrl : "person",titleClass : "bg-blue",bgClass : "bgPerson",color:"blue",icon:"user", 
            saveUrl : baseUrl+"/" + moduleId + "/element/saveContact"},
        contacts : {color:"blue",icon:"envelope", titleClass : "bg-blue", 
            add: false,
            addInElement:true,
            name: trad.contact,
            formType:"contactPoint",
            createLabel: "Add a contact",
            explainText:tradDynForm.infosmallcreatecontact,
            parentAllow:["organizations","projects"]
        }, 
        curiculum : { color:"dark",icon:"clipboard",titleClass : "bg-dark",title : "My CV"},
        badge : { col: "badges", color:"dark",icon:"bookmark",titleClass : "bg-dark",title : "Badge"},
        get: function(e){
              elt={};
              if(typeof typeObj[e] != "undefined"){
                if(typeof typeObj[e].name != "undefined")
                    elt.name=typeObj[e].name; 
                else if(typeof typeObj[e].sameAs != "undefined")
                    elt.name=typeObj[typeObj[e].sameAs].name;
                
                if(typeof typeObj[e].icon != "undefined")
                    elt.icon=typeObj[e].icon; 
                else if(typeof typeObj[e].sameAs != "undefined")
                    elt.icon=typeObj[typeObj[e].sameAs].icon;
                
                if(typeof typeObj[e].color != "undefined")
                    elt.color=typeObj[e].color; 
                else if(typeof typeObj[e].sameAs != "undefined")
                    elt.color=typeObj[typeObj[e].sameAs].color;
                
                if(typeof typeObj[e].formType != "undefined")
                    elt.formType=typeObj[e].formType; 
                else if(typeof typeObj[e].sameAs != "undefined")
                    elt.formType=typeObj[typeObj[e].sameAs].formType;
                
                if(typeof typeObj[e].formParent != "undefined")
                    elt.formParent=typeObj[e].formParent; 
                
                if(typeof typeObj[e].dynForm != "undefined")
                    elt.dynForm=typeObj[e].dynForm;
                
                if(typeof typeObj[e].dynFormCostum != "undefined")
                    elt.dynFormCostum=typeObj[e].dynFormCostum;
                 else if(typeof typeObj[e].sameAs != "undefined" && typeof typeObj[typeObj[e].sameAs].dynFormCostum != "undefined")
                    elt.dynFormCostum=typeObj[typeObj[e].sameAs].dynFormCostum;
                
                if(typeof typeObj[e].formSubType != "undefined")
                    elt.formSubType=typeObj[e].formSubType; 
                else if(typeof typeObj[e].sameAs != "undefined" && typeof typeObj[typeObj[e].sameAs].formSubType != "undefined")
                    elt.formSubType=typeObj[typeObj[e].sameAs].formSubType;
                
                if(typeof typeObj[e].createLabel != "undefined")
                    elt.createLabel=typeObj[e].createLabel; 
                else if(typeof typeObj[e].sameAs != "undefined")
                    elt.createLabel=typeObj[typeObj[e].sameAs].createLabel;

                if(typeof typeObj[e].col != "undefined")
                    elt.col=typeObj[e].col; 
                else if(typeof typeObj[e].sameAs != "undefined")
                    elt.col=typeObj[typeObj[e].sameAs].col;

                if(typeof typeObj[e].ctrl != "undefined")
                    elt.ctrl=typeObj[e].ctrl; 
                else if(typeof typeObj[e].sameAs != "undefined")
                    elt.ctrl=typeObj[typeObj[e].sameAs].ctrl;
              }
              console.log("getFormat typeObj", elt);
              return elt;
        },
        isDefined:function(type, entry, obj){
            res=true;
            if(notNull(obj))
                inspector=obj;
            else if(typeof typeObj[type] !="undefined")
                inspector=typeObj[type];
            else
                res=false;
            if(res){
                checkValues=(entry.indexOf(".")) ? entry.split(".") : [entry];
                $.each(checkValues, function(e,v){
                    if(typeof inspector[v] != "undefined"){
                        res=true;
                        inspector=inspector[v];
                    }else
                        res=false;
                });
            }
            //if(notNull(entry) && res)
              //  res = (typeof typeObj[type][entry] != "undefined") ? true : false;
            //}
            return res;
        },
        authorizedButton : function(elt, config){
            auth=false;
            if(notNull(config) && typeof config.inElement != "undefined"){ 
                if(typeof elt.addInElement !="undefined" && elt.addInElement){
                    auth=true;
                    if(typeof config.allowIn != "undefined" && config.allowIn 
                        && typeof elt.parentAllow != "undefined" && $.inArray(config.contextType, elt.parentAllow) < 0)
                        auth=false;
                }
                if(typeof elt.add != "undefined" && (!elt.add || (elt.add=="onlyAdmin" && (typeof canCreate == "undefined" || !canCreate))))
                    auth=false;
            }else if(typeof elt.add != "undefined"){
                if(elt.add=="onlyAdmin" && typeof canCreate != "undefined" && canCreate) 
                    auth=true;
                else if(elt.add===true)
                    auth=true;
            }
            return auth;
        },
        buildCreateButton: function(domContain, dropdownButton, params){
            menuButtonCreate="";
            var count=0;
            var hash="";
            var formType="";
            var subFormType=  "";
            var addClass =  "";
            var nameLabel="";
            var bgClass="";
            var textExplain="";
            $.each(typeObj, function(e,v){
                if(typeObj.authorizedButton(v, params)){
                    count++;
                    hash=(typeof v.hash != "undefined") ? v.hash : "javascript:;";
                    formType=(typeof v.formType != "undefined") ? 'data-form-type="'+v.formType+'" ' : "";
                    subFormType= (typeof v.formSubType != "undefined") ? 'data-form-subtype="'+v.formSubType+'" ' : "";
                    addClass = (typeof v.class != "undefined") ? v.class : "";
                    nameLabel=(typeof v.addLabel!= "undefined") ? v.addLabel : v.name;
                    bgIcon="";
                    bgClass="bg-"+v.color;
                    inline="";
                    if(notNull(params)){
                        bgClass=(typeof params.bgColor != "undefined") ? "bg-"+params.bgColor : bgClass;
                        textExplain=(typeof params.explain != "undefined") ? "<small>"+v.explainText+"</small>": "";
                        addClass=(typeof params.addClass != "undefined") ? params.addClass : addClass;
                        addClass=(typeof params.textColor != "undefined") ? addClass+" text-"+v.color : addClass;
                        bgIcon=(typeof params.bgIcon != "undefined") ? "bg-"+v.color : bgIcon;
                        inline=(typeof params.inline != "undefined" && !params.inline) ? "<br/>" : ""; 
                    }
                    menuButtonCreate+='<a href="'+hash+'" '+ 
                        formType+
                        subFormType+ 
                        'class="addBtnFoot btn-open-form btn btn-default '+addClass+' '+bgClass+' margin-bottom-10">'+ 
                            '<i class="fa fa-'+v.icon+' '+bgIcon+'"></i>'+inline+' <span>'+nameLabel+'</span>'+
                            inline+textExplain
                        '</a>';
                }
            });
            $(domContain).html(menuButtonCreate);            
            if(count <= 1 && notNull(dropdownButton) && dropdownButton){
                oneButton='<a href="'+hash+'" '+
                        formType+
                        subFormType+ 
                        'class="btn btn-default no-padding btn-menu-vertical btn-open-form" id="show-bottom-add">'+
                            '<i class="fa fa-plus-circle"></i>'+
                            '<span class="tooltips-menu-btn">'+nameLabel+'</span>'+
                        '</a>';
                $("#show-bottom-add").replaceWith(oneButton);
            }
        }
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