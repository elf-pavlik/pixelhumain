/* **************************************

- add a form tag to your document
- define your dynForm with a jsonSchema defintion of each field input
- The process will then 
	- first build the specified HTML  for each different field and input according to types
   - bind any needed events according to types 
	- bind the save Process if needed 
   - apply any onLoad process

parameters : 
formId : is the <form> tag in the destination html
surveyObj: is the form object containg the form field definition and jsonSchema
surveyValues: contains the values if needed 
onLoad : (optional) is a function that is launched once the form has been created and written into the DOM 
onSave: (optional) overloads the generic saveProcess

***************************************** */
(function($) {
	"use strict";
	var thisBody = document.body || document.documentElement, 
	thisStyle = thisBody.style, 
	$this,
	survey,
	wizardContent,
	numberOfSteps,
	supportTransition = thisStyle.transition !== undefined || thisStyle.WebkitTransition !== undefined || thisStyle.MozTransition !== undefined || thisStyle.MsTransition !== undefined || thisStyle.OTransition !== undefined
	
	/*$(subviewBackClass).on("click", function(e) {
		$.hideSubview();
		e.preventDefault();
	});*/

	$.extend({

		dynSurvey: function(options)
		{
			// extend the options from pre-defined values:
			var defaults = {
				surveyId : "", 
				surveyObj: {},
				surveyValues: {},
				onLoad : null,
				onSave: null,
				collection : "",
	    		key : "",
				savePath : '/ph/common/save'
			};

			var settings = $.extend({}, defaults, options);
			mylog.log(settings);
			$this = this;
			survey = settings.surveyObj;
			dySObj.navBtnAction = false;

			mylog.info("build Form dynamically into form tag : ",settings.surveyId);
			mylog.dir(settings.surveyObj);
			mylog.dir(settings.surveyValues);

			/* **************************************
			* BUILD FORM based on surveyObj
			***************************************** */
			var form = {
				rules : {}
			};
			
			/* **************************************
			* Smart Wizard HTMl init
			***************************************** */			
			var wizardHTML = '<div id="wizard" class="swMain">'+
			/* **************************************
			* Wizard Likns
			***************************************** */
				'<ul id="wizardLinks"></ul>'+
			/* **************************************
			* Progress BAr
			***************************************** */
				'<div class="progress progress-xs transparent-black no-radius active">'+
					'<div aria-valuemax="100" aria-valuemin="0" role="progressbar" class="progress-bar partition-green step-bar">'+
						'<span class="sr-only"> 0% Complete (success)</span>'+
					'</div>'+
				'</div>'+
			/* **************************************
			* Error Section
			***************************************** */
				'<div class="errorHandler alert alert-danger no-display">'+
					'<i class="fa fa-remove-sign"></i> You have some form errors. Please check below.'+
				'</div>'
			'</div>';
			$(settings.surveyId).append(wizardHTML);

			var fieldHTML = '';
			var sectionIndex = 0;
			var lastSection = "";
			$.each(settings.surveyObj,function( sectionId ,sectionObj ) 
			{ 
				mylog.info("check what",settings.surveyObj, settings.sectionObj);
				mylog.info("building section : ",sectionIndex ,sectionId);
				var sectionClass = (sectionIndex>0) ? "hide" : ""
				
				$("#wizard").append("<div id='"+sectionId+"' class='section"+sectionIndex+" "+sectionClass+"'></div>");
				
				var name = (sectionObj.dynForm.jsonSchema.title) ? sectionObj.dynForm.jsonSchema.title : "";
				var desc = (sectionObj.dynForm.jsonSchema.desc) ? sectionObj.dynForm.jsonSchema.desc : "";
				var wizardLinkHTML = '<li><a href="#'+sectionId+'"><div class="stepNumber">'+(sectionIndex+1)+'</div>'+
										'<span class="stepDesc"> '+name+
											'<br /><small>'+desc+'</small> </span>'+
									'</a></li>';
				$("#wizardLinks").append(wizardLinkHTML);

				//build each form for each wizard step
				var countProperties = 0;
				for( var key in sectionObj.dynForm.jsonSchema.properties ) {
						++countProperties;
    			}
				var inc=1;
				var secJsonSchema = sectionObj.dynForm.jsonSchema;
				// if( typeof secJsonSchema.beforeBuild == "function" )
			 //        secJsonSchema.beforeBuild();

				$.each(sectionObj.dynForm.jsonSchema.properties,function(field,fieldObj) { 
					if(fieldObj.rules)
						form.rules[field] = fieldObj.rules;
					mylog.log("////////SETTTINGSSSS///////");
					mylog.log(settings.surveyValues);

					dyFObj.buildInputField("#"+sectionId,field, fieldObj, settings.surveyValues);//,sectionObj.key);
					
					//Only the last section carries the submit button
					if( sectionIndex == Object.keys(settings.surveyObj).length-1 && countProperties==inc){
						fieldHTML = '<div class="form-actions">'+
									'<button type="submit" class="btn btn-green pull-right finish-step">'+
										'Enregistrer <i class="fa fa-arrow-circle-right"></i>'+
									'</button> '+
									' <a  href="javascript:;" class="btn-prev btn btn-blue pull-right back-step">'+
										'<i class="fa fa-arrow-circle-left"></i> Precedent'+
									'</a>'+
								'</div> ';
						$("#"+sectionId).append(fieldHTML);
					}
					else if(countProperties==inc)
					{
						fieldHTML = '<div class="form-actions">';
						fieldHTML += '<a href="javascript:;" class="btn-next btn btn-blue pull-right next-step" style="margin-bottom :40px;">'+
										'Suivant <i class="fa fa-arrow-circle-right"></i>'+
									'</a> ';
						fieldHTML += (sectionIndex>0) ? ' <a href="javascript:;" class="btn-prev btn btn-blue pull-right back-step">'+
										'<i class="fa fa-arrow-circle-left"></i> Precedent</a> ' : "";
						fieldHTML += '</div> ';
						$("#"+sectionId).append(fieldHTML);
					}
					inc++;
				});

				if( typeof secJsonSchema.afterBuild == "function" )
			        secJsonSchema.afterBuild();
		        
		        //incase we need a second global post process
		        if( secJsonSchema.onLoads && typeof secJsonSchema.onLoads.onload == "function" )
		        	secJsonSchema.onLoads.onload();

				sectionIndex++;
			})
			numberOfSteps = sectionIndex;
			/* **************************************
			* CONTEXT ELEMENTS, used for saving purposes
			***************************************** */
			fieldHTML = '<input type="hidden" name="key" value="'+settings.key+'"/>';
	        fieldHTML += '<input type="hidden" name="collection" value="'+settings.collection+'"/>';
	        fieldHTML += '<input type="hidden" name="id" value="'+((settings.id) ? settings.id : "")+'"/>';
	       	$(settings.surveyId).append(fieldHTML);

        	
	        

			/* **************************************
			* bind any events Post building 
			***************************************** */
			dyFObj.bindDynFormEvents(settings,form.rules);
			if(typeof (settings.onLoad) != "undefined")
				mylog.dir(settings.onLoad);
			if(settings.onLoad && jQuery.isFunction( settings.onLoad ) )
				settings.onLoad();
		    

			return form;
		}

	});
	
	
     
    
	
	

})(jQuery);
var answerId=null;
var dySObj = {
	navBtnAction : false,
	activeSection : 0,
	activeSectionId : null,
	//contains the structured survey by sections
	survey : null,
	surveys : {},
	surveyId : null,
	/*
	use ajax to load the definition files
	name : unique key of the survey
	DSPath : can be null, or a url 
	type : script is needed if dynForm = {} 
	        otherwise json is enough json is directly at the root 
	*/
	getSurveyJson : function (name,DSPath,type,callback) {

	    mylog.warn("getSurveyJson",name,DSPath,type);
	    dynForm = null;
	    dType = ( type ) ? type : "json";
	    if( jsonHelper.notNull( "dySObj.surveys."+name) ){
	    	dySObj.buildSurveySections(dySObj.surveys.json[name]);
	        dySObj.buildSurvey()    
	    }
	    else 
	    {
	        mylog.log( "getSurveyJson ajax", dType );
	        
	        $.ajax({
	          type: "GET",
	          url: DSPath,
	          dataType: dType
	        }).done( function(data){
	            if(dynForm) {
	            	mylog.log("getSurveyJson dynForm",name,dynForm);
	                //tmpO = {};
	                //tmpO[name] = dynForm;
	                dySObj.surveys[name] = dynForm;
	            }
	            else if (typeof data.json != "undefined"){
	            	mylog.log("getSurveyJson data.json",name,data.json);
	                dySObj.surveys[name] = data.json;
	            }
	            else {
	                mylog.log("getSurveyJson data["+name+"] ",data[name]);
	                dySObj.surveys=data;
	                if(!notNull(dySObj.surveyId) || dySObj.surveyId=="#modal-dynSurvey"){
	                	dySObj.surveyId="#modal-dynSurvey";
	                	$("#modal-dynSurvey").empty();
	                	$(".portfolio-modal-survey").modal("show");
	                }
	            }
	            
	            if(typeof callback == "function")
	                callback(data[name]);
	            else {    
	            	dySObj.buildSurveySections(dySObj.surveys.json[name]); 
	                dySObj.buildSurvey();
	            }
	        });
	    }
	},

	//	binding validation events to the survey instance 
	bindSurvey : function (params, formRules) {
		/* **************************************
		* FORM VALIDATION and save process binding
		***************************************** */
		mylog.info("bindSurvey :: connecting submit btn to $.validate pluggin");
		mylog.dir(formRules);
		var errorHandler = $('.errorHandler', $(params.surveyId));
		$(params.surveyId).validate({

			rules : formRules,

			submitHandler : function(form) {
				$(dySObj.surveyId+" .finish-step").html( '<i class="fa  fa-spinner fa-spin fa-"></i>' ).prop("disabled",true);
				errorHandler.hide();
				mylog.info("form submitted "+params.surveyId);
				if(params.onSave && jQuery.isFunction( params.onSave ) ){
					params.onSave(params);
					return false;
		        } 
		        else 
		        {
		        	toastr.info("default SaveProcess : "+params.savePath);
		        	mylog.info("default SaveProcess",params.savePath);
		        	mylog.dir($(params.surveyId).serializeFormJSON());
		        	$.ajax({
		        	  type: "POST",
		        	  url: params.savePath,
		        	  data: $(params.surveyId).serializeFormJSON(),
		              dataType: "json"
		        	}).done( function(data){
		                
		                if( afterDynBuildSave && typeof afterDynBuildSave == "function" )
		                    afterDynBuildSave(data.map,data.id);
		                mylog.info('saved successfully !');

		        	});
					return false;
			    }
			    
			},
			invalidHandler : function(event, validator) {//display error alert on form submit
				errorHandler.show();
			}
		});

		/* **************************************
		* WIZARD INIT
		***************************************** */
		wizardContent = $('#wizard');
		wizardContent.smartWizard({
            selected: 0,
            keyNavigation: false,
            //onLeaveStep: function(){ mylog.log("leaveAStepCallback");},
            onShowStep: function(obj, context)
            {
            	mylog.log("test onShowStep",dySObj.navBtnAction,context.toStep,context.fromStep,Math.abs( context.toStep - context.fromStep));
            	if( !dySObj.navBtnAction ){
	            	$(".section"+dySObj.activeSection).addClass("hide");
	            	dySObj.activeSection =  context.toStep -1 ;
					mylog.log("top wisard direct link",dySObj.activeSection);
					$(".section"+dySObj.activeSection).removeClass("hide");	

				}
				dySObj.activeSection =  context.toStep -1 ;
				dySObj.animateBar(dySObj.activeSection+1);
				dySObj.activeSectionId = "#section"+(dySObj.activeSection+1);
				dySObj.activeSectionKey = dySObj.surveys.sections["section"+(dySObj.activeSection+1)].key;

				var sectionKey = "section"+(dySObj.activeSection+1);
				mylog.warn("open Section ",dySObj.activeSectionKey,"activeSectionId", "section"+(dySObj.activeSection+1))
				if( dySObj.surveys.sections[sectionKey].type == "dynForm" && 
					typeof dySObj.surveys.sections[sectionKey].dynForm.jsonSchema.beforeBuild == "function" &&
					typeof dySObj.surveys.json[ dySObj.activeSectionKey ].id == "undefined" )
					dySObj.surveys.sections[sectionKey].dynForm.jsonSchema.beforeBuild();
            },
        });
        dySObj.animateBar();

        /* **************************************
		* NEXT and BACK BUTTONS
		***************************************** */
		$('.btn-next').unbind("click").click(function()
		{
			if( dySObj.validateForm( dySObj.activeSection ) )
			{
				dySObj.goForward();
			}
		});

		$('.btn-prev').unbind("click").click(function()
		{
			$(".section"+dySObj.activeSection).addClass("hide");
			dySObj.activeSection--;
			mylog.log("btn-prev",dySObj.activeSection);
			$(".section"+dySObj.activeSection).removeClass("hide");	
			dySObj.navBtnAction = true;
			wizardContent.smartWizard("goBackward");
			dySObj.navBtnAction = false;
			dySObj.animateBar(dySObj.activeSection+1);
			if( dySObj.surveys.sections[ "section"+dySObj.activeSection ].onPrev && jQuery.isFunction( dySObj.surveys.sections["section"+dySObj.activeSection].onPrev ) )
				dySObj.surveys.sections[ "section"+dySObj.activeSection ].onPrev();
		});

		dataHelper.activateMarkdown(".markdown");
	},

	// init the dynSurvey instance 
	buildSurvey : function () {  
		$("#surveyDesc").hide();
	    mylog.log("buildSurvey sections: ",dySObj.surveys.sections);
	    //dySObj.survey = dySObj.surveys.sections;

	    $(dySObj.surveyId).unbind('keydown').keydown(function(event) 
		  {
		  	if ( event.keyCode == 13)
		    {
		    	//console.log($(':focus')[0].localName,$.inArray($(':focus')[0].localName, ["textarea","TEXTAREA"]));
		    	if($.inArray($(':focus')[0].localName, ["textarea","TEXTAREA"]) == -1 )
					event.preventDefault();
				//alert("enter");
			}
		});

	    var form = $.dynSurvey({
	        surveyId : dySObj.surveyId,
	        surveyObj : dySObj.surveys.sections,
	        surveyValues : {},
	        collection : "answers",
	        key : "answers",
	        savePath : baseUrl+"/survey/co/save/id/"+answerId,
	        onLoad : function(){
	            //$(".description1, .description2, .description3, .description4, .description5, .description6").focus().autogrow({vertical: true, horizontal: false});
	        },
	        onSave : function(params) {
	            mylog.log("onSave" );
	            var result = {
	            	// "user" : userId,
	            	// "name" : userConnected.name,
	            	// "email" : userConnected.email,
	            	"formId" : dySObj.surveys.id,
	            	// "session" : formSession,
	            	"t" : dySObj.surveys.t,
	            	"h" : dySObj.surveys.h,
	            	"answers" : {}
	            };
	            if(dySObj.surveys.parentSurvey)
	            	result.parentSurvey = dySObj.surveys.parentSurvey.id;

	            var reloadInside= true;
	            mylog.log(params.surveyObj);
	            uploadObj.afterLoadUploader=true;
	            $.each( params.surveyObj,function(section,sectionObj) { 
	            	//alert("key"+sectionObj.key);
	            	result["answers"][sectionObj.key] = {};
	            	if( typeof dySObj.surveys.json[sectionObj.key].saveElement == "undefined" )
	            	{
	            		mylog.log(sectionObj.dynForm.jsonSchema.properties);
		                $.each( sectionObj.dynForm.jsonSchema.properties,function(field,fieldObj) { 
		                    mylog.log(sectionObj.key+"."+field, $("#"+section+" #"+field).val() );
		                    if( fieldObj.inputType ){
		                        if(fieldObj.inputType=="uploader"){
		                        	listObject=$('#'+section+' #'+fieldObj.domElement).fineUploader('getUploads');
							    	goToUpload=false;
							    	if(listObject.length > 0){
							    		$.each(listObject, function(e,v){
							    			if(v.status == "submitted")
							    				goToUpload=true;
							    		});
							    	}
									if( goToUpload ){
		                     		//if( $('#'+section+' #'+fieldObj.domElement).fineUploader('getUploads').length > 0 ){
		                     			reloadInside=false;
		    							$('#'+section+' #'+fieldObj.domElement).fineUploader('uploadStoredFiles');
		    							result["answers"][sectionObj.key][field] = "";
		                        	}
		                        }else{
		                        	result["answers"][sectionObj.key][field] = {};
		                        	result["answers"][sectionObj.key][field] = $("#"+section+" #"+field).val();
		                        }
		                    }
		                });
		            } 
		            else 
		            {
		            	result["answers"][sectionObj.key]["parentType"] = dySObj.surveys.json[sectionObj.key].parentType;
		            	result["answers"][sectionObj.key]["parentId"] = dySObj.surveys.json[sectionObj.key].parentId;
		            	result["answers"][sectionObj.key]["type"] = dySObj.surveys.json[sectionObj.key].type;
		            	result["answers"][sectionObj.key]["id"] = dySObj.surveys.json[sectionObj.key].id;
		            	result["answers"][sectionObj.key]["name"] = dySObj.surveys.json[ sectionObj.key ].name;
		            	result["answers"][sectionObj.key]["email"] = dySObj.surveys.json[ sectionObj.key ].email;
		            }
	            });
	            mylog.log("onsave result", params, result);

	            $.ajax({
	              type: "POST",
	              url: params.savePath,
	              data: result,
	              dataType: "json"
	            }).done( function(data){
	            	if(data.result.ok == true){
	            		if( dySObj.surveys.parentSurvey && 
	            			dySObj.surveys.parentSurvey.surveyType == "surveyList" && 
	            			Object.keys( dySObj.surveys.parentSurvey.scenario).indexOf(dySObj.surveys.id) < Object.keys( dySObj.surveys.parentSurvey.scenario).length-1 ){
	            			var ix = Object.keys( dySObj.surveys.parentSurvey.scenario).indexOf(dySObj.surveys.id)+1;
	            			if(reloadInside)
	            				window.location = baseUrl+"/survey/co/index/id/"+Object.keys( dySObj.surveys.parentSurvey.scenario )[ix]+"/session/"+formSession+"/answer/"+answerId;

	            		} else {
		                	toastr.success("answers saved");
		                	if(dySObj.surveys.parentSurvey.custom.endTpl){
		                		if(reloadInside)
		                			window.location = baseUrl+"/survey/co/index/id/"+dySObj.surveys.parentSurvey.id+"/answer/"+answerId;
		                	}
		                	else
		                		$("#ajaxFormModal").html('<h1>Bravo ! Merci pour votre participation. </h1>');
		                }
	            	}
	                else 
	                	toastr.error(data.result);
	            });

	            //alert("final saved it all");
	            return false;
	        }
	    });
	},
	
	// transfroms a list of dynform definitions into the needed survey structure
	buildSurveySections : function (){
	    mylog.log( "buildSurveySections" );
	    dySObj.surveys.sections={};
	    var sec=1;
	    $.each(dySObj.surveys.json, function(e,form){
	    	var type = (dySObj.surveys.json[e].dynType) ? dySObj.surveys.json[e].dynType : "dynForm";
	        dySObj.surveys.sections[ "section"+sec ] = { dynForm : form, key : e, type : type };
	        sec++;
	    });
	    return dySObj.surveys.sections;
	},
	//takes a full scenario defnition and :
	// builds & returns a survey Json asynchronesly
	buildOneSurveyFromScenario : function (){
		mylog.log( "buildOneSurvey scenario x",dySObj.surveys.scenario);
	    if(typeof dySObj.surveys.json == "undefined") dySObj.surveys.json={};
	    //structure the survey json like a given survey
	    $.each( dySObj.surveys.scenario, function(s,step) {
	    	mylog.warn( "buildOneSurvey step",s,step );

	    	//this step of the survey of a form definition 
	    	// in the step it self as json
	    	if( step.json ){
	    		
	    		mylog.log("buildOne by json");
	    		dynType = (step.dynType) ? step.dynType : "dynForm" ;
	    		if(dynType == "dynSurvey" ){
		    		$.each(step.json, function(e,form){		
		    			dySObj.surveys.json[e] = form;
				        dySObj.surveys.json[e].dynType = dynType;
				        mylog.log("step dynSurvey step ",e,dynType);
				    }); 
		    	} else {
		    		dySObj.surveys.json[s] = step.json;
			        dySObj.surveys.json[s].dynType = dynType;
			        mylog.log("step dynForm step ",s,dynType);
		    	}
			    mylog.log("json",dySObj.surveys.json);
	    	} 
	    	//the form description is in a file get by ajax
	    	//ajax get form or survey following submitted path
	    	else if( step.path ) {
	    		
	    		//mylog.warn("buildOne by path");
	    		
	    		dType = (step.type) ? step.type : "json" ;
                dynType = (step.dynType) ? step.dynType : "dynForm" ;

                path = moduleUrl+step.path;
		        //passing through survey/co/form controller
		        if(step.where == "db")
		            path = baseUrl+step.path;
		        //existing surveys in co2 module like co2/assets/js/dynform/dynsurvey.js
		        else if(step.where == "parentModuleUrl")
		            path = parentModuleUrl+step.path;

		        //mylog.log( "buildOneSurvey scenario xx");
		        dySObj.surveys.json[s] = null; //important for asyncCheck
		        dySObj.getSurveyJson ( s , path, dType, function() { 
		        	mylog.log( "buildOne >>>>>>", s ,typeof dySObj.surveys.json);
	    			if(typeof dySObj.surveys.json == "undefined")
	    				dySObj.surveys.json={};
	    			dySObj.surveys.json[s] = dySObj.surveys[s];
	    			//DEBUG WITH A DYNsURVEY
	    			dySObj.surveys.json[s].dynType = ( dySObj.surveys.scenario[s].dynType ) ? dySObj.surveys.scenario[s].dynType : "dynForm";
	    			if( dySObj.surveys.scenario[s].saveElement )
	    				dySObj.surveys.json[s].saveElement = true; 
	    			dySObj.asyncSurveyLoadedCheck();
	    				
	            } );
	    	} 
	    });
	    mylog.log( "buildOneSurvey json",dySObj.surveys.json );
	    dySObj.asyncSurveyLoadedCheck();	
	},
	// checks no empty dynforms in dySObj.surveys.json
	//if so show the start btn
	asyncSurveyLoadedCheck : function() {
		mylog.log( "asyncSurveyLoadedCheck",dySObj.surveys.json );
		res = true;
		if(typeof dySObj.surveys.json != "undefined"){
		$.each( dySObj.surveys.json, function(s,step) {
			if(step == null)
				res = false;
		});
		}
		mylog.log( "asyncSurveyLoadedCheck res",res );
		if(res)
			$("#startSurvey").removeClass("hidden");
	},
	openSurvey : function (key,type,dynType) { 
	    $("#surveyBtn").hide();
	    mylog.log("openSurvey",key,type,dynType);

	    if(dynType == "oneSurvey"){
	    	dySObj.buildSurveySections(); 
	        dySObj.buildSurvey();
	    } 
	    else if(typeof dySObj.surveys.scenario == "undefined" || typeof dySObj.surveys.scenario[key] == "undefined"){
	    	dySObj.getSurveyJson ( key , baseUrl+"/survey/co/form/id/"+key,"json", function(){
	    		dySObj.buildOneSurveyFromScenario( );
	    		dySObj.buildSurveySections();
	            dySObj.buildSurvey();
	    	});
	    }
	    else if(typeof dySObj.surveys.scenario[key].json == "object"){
	        mylog.warn("openSurvey :: get survey json exist");

	        if(dynType == "dynSurvey"){
	        	dySObj.buildSurveySections( dySObj.surveys.scenario[key].json );
	          	dySObj.buildSurvey();
	        }
	        else 
	            dyFObj.openForm( dySObj.surveys.scenario[key].json );
	    }
	    else if( dySObj.surveys.scenario[ key ].path ){

	        path = moduleUrl+dySObj.surveys.scenario[key].path;

	        //passing through survey/co/form controller
	        if(dySObj.surveys.scenario[ key ].where == "db")
	            path = baseUrl+dySObj.surveys.scenario[key].path;
	        //existing surveys in co2 module like co2/assets/js/dynform/dynsurvey.js
	        else if(dySObj.surveys.scenario[ key ].where == "parentModuleUrl")
	            path = parentModuleUrl+dySObj.surveys.scenario[key].path;
	        
	        if( dynType == "dynSurvey" ){
	            //surveys like surveys/assets/js/surveys/dynsurvey.js
	            mylog.warn("openSurvey :: get survey json by path", path);
	            dySObj.getSurveyJson ( key , path,type, function() { 
	            	dySObj.buildSurveySections( surveys[key] );
	                dySObj.buildSurvey();
	            } );
	            
	        }
	        else {
	            //existing forms connected to co2 
	            if( jsonHelper.notNull( "typeObj."+key) ){
	                mylog.warn("openSurvey:: get form by key",key);
	                dyFObj.openForm( key ); 
	            }
	            else 
	            { 
	                //forms defined elsewhere like surveys/assets/js/surveys/login.js
	                mylog.warn("openSurvey :: get form json by path",key,path);
	                dySObj.getSurveyJson ( key , path,type,function() {
	                    dyFObj.openForm( surveys[key] );
	                } );
	            }
	        }
	        
	    }
	},

	animateBar : function (val) {
    	mylog.log("animateBar");
        if ((typeof val == 'undefined') || val == "") {
            val = 1;
        };
        var valueNow = Math.floor(100 / $(".stepNumber").length * val);
        $('.step-bar').css('width', valueNow + '%');
    },

    // complete Form secion validations  
	validateForm : function  ( sectionIndex, surveyId ) { 
		mylog.log( "validateForm1", sectionIndex, dySObj.surveyId );
		var counter = 0;
		var result = true;
		$.each( dySObj.surveys.sections , function( sectionId ,sectionObj ) { 
			mylog.log( "validateForm",sectionId, counter, sectionIndex );
			if( counter == sectionIndex ){
				mylog.dir(sectionObj.dynForm);
				$.each(sectionObj.dynForm.jsonSchema.properties , function(field,fieldObj) { 
					if( fieldObj.rules ){
						var res = $(dySObj.surveyId).validate().element("#"+field);
						if(!res)
							result = false;
					}
					//mylog.log("field",field,result);
				});
			}
			counter++;
		});
		if(!result){
			//$(".btn-next").html('<span class="text-red"><i class="fa fa-warning"></i> Régler les erreurs</span>');
			$('html, body').stop().animate({scrollTop: 0}, 500, '');
		}else{
			$(".btn-next").html('<span class="text-dark">Suivant <i class="fa fa-arrow-circle-right"></i></span>');
		}
		return result;
	}, 
	goForward : function (existedElementId, elementSlug, elementName, eltMail){
		var sec = "section"+(dySObj.activeSection+1);
		var sectionKey = dySObj.surveys.sections[sec].key;
		if( dySObj.surveys.sections[sec].type == "dynForm")
		{
			if( typeof dySObj.surveys.scenario[sectionKey].saveElement == "object" && existedElementId==null)
			{
				var  save = dySObj.surveys.scenario[dySObj.surveys.sections[sec].key].saveElement;
				saveData = {};
				dyFObj.elementObj = dySObj.surveys.sections[sec];
                $.each( dyFObj.elementObj.dynForm.jsonSchema.properties,function(field,fieldObj) { 
                    mylog.log(sectionKey+"."+field, $("#"+sec+" #"+field).val() );
                    if( fieldObj.inputType ) {
                        saveData[field] = {};
                        saveData[field] = $("#"+sec+" #"+field).val();
                    }
                });
                mylog.dir( saveData );
                var saveP = dySObj.surveys.scenario[sectionKey].saveElement;

                if( typeof dySObj.surveys.scenario[sectionKey].linkTo != "undefined" && answers ){
                	linkToT = dySObj.surveys.scenario[sectionKey].linkTo.split(".");
                	$.each( answers,function(i,a) { 
                		if( linkToT[0] == a.formId )
                		{
                			if( typeof a.answers[ linkToT[1] ] != "undefined" )
                			{
	                			saveData.parentId = a.answers[ linkToT[1] ].id;
	                			saveData.parentType = a.answers[ linkToT[1] ].type;
	                		}
                		}
                	});
                	mylog.log("linkTo",saveData);
                }

                dyFObj.saveElement(saveData, saveP.collection, saveP.ctrl,null, function(data) { 
                	mylog.warn("saved",data);
                	//if( $(uploadObj.domTarget).fineUploader('getUploads').length > 0 ){
		    		//	$(uploadObj.domTarget).fineUploader('uploadStoredFiles');
	    			//}
                	//alert("switch btn color to red to indicate, and disable form");
	            	dySObj.surveys.json[ dySObj.surveys.sections[sec].key ].type = dySObj.surveys.sections[sec].key;
	            	dySObj.surveys.json[ dySObj.surveys.sections[sec].key ].id = data.id;
	            	dySObj.surveys.json[ dySObj.surveys.sections[sec].key ].name = data.map.name;
	            	dySObj.surveys.json[ dySObj.surveys.sections[sec].key ].email = data.map.email;
	            	/*if(typeof dySObj.surveys.sections["section"+(dySObj.activeSection+1)] != "undefined"
		        		&& typeof dySObj.surveys.sections["section"+(dySObj.activeSection+1)].dynForm != "undefined")
	            	{
		        		$.each(dySObj.surveys.sections["section"+(dySObj.activeSection+1)].dynForm.jsonSchema.properties, function(e, v){
		            		if(typeof v.docType != "undefined" && typeof v.linkTo != "undefined" && v.linkTo==dySObj.surveys.sections[sec].key){ 
		            			typeOwner=v.linkTo+"s";
		            			idOwner=dySObj.surveys.json[ dySObj.surveys.sections[sec].key ].id;
		            			endpoint=baseUrl+"/"+moduleId+v.endPoint+"/folder/"+typeOwner+"/ownerId/"+idOwner;
								$("#"+v.domElement).fineUploader('setEndpoint', endpoint);
							}
						});
		    		}*/
		    		
	    		   	var secJsonSchema = dySObj.surveys.json[sectionKey].jsonSchema;
						if( typeof secJsonSchema.afterSave == "function" )
							var elemText = "<h1>Form has been saved,<br/>"+
						        		"to modify please go <a class='btn btn-xs btn-primary' href='"+baseUrl+"/co2#@"+data.map.slug+"' target='_blank'>here</a>"+
						        		"once you finished the survey"+
						        		"</h1>"+
						        		"<button class='btn btn-primary' onclick='$(\'#section"+( dySObj.activeSection+1 )+"\').trigger(\"click'\")'>Next step</button>";
							
						if( $(uploadObj.domTarget).fineUploader('getUploads').length > 0 )
						{
				        	secJsonSchema.afterSave( data, function() { 
					        	$("#section"+dySObj.activeSection).html(elemText);
					        }); 
				        } else 
				        	$("#section"+dySObj.activeSection).html(elemText);

                });
			} 
			else if(typeof dySObj.surveys.scenario[sectionKey].saveElement == "object" && notNull(existedElementId))
			{
				dySObj.surveys.json[ dySObj.surveys.sections[sec].key ].type = dySObj.surveys.sections[sec].key;
            	dySObj.surveys.json[ dySObj.surveys.sections[sec].key ].id = existedElementId;
            	dySObj.surveys.json[ dySObj.surveys.sections[sec].key ].name = elementName;
            	dySObj.surveys.json[ dySObj.surveys.sections[sec].key ].email = eltMail;

            	var secJsonSchema = dySObj.surveys.json[sectionKey].jsonSchema;
				if( typeof secJsonSchema.afterSave == "function" )
				{
		        	var data={
		        			type: dySObj.surveys.sections[sec].key, 
		        			id : existedElementId, 
		        			name : elementName, 
		        			slug: elementSlug,
		        			email: eltMail
		        		};
		        	//secJsonSchema.afterSave( data, function() { 
			        	$("#section"+dySObj.activeSection).html(
			        		"<h1>Form has been saved,<br/>"+
			        		"to modify please go <a class='btn btn-xs btn-primary' href='"+baseUrl+"/co2#@"+elementSlug+"' target='_blank'>here</a>"+
			        		"once you finished the survey"+
			        		"</h1>"
			        		/*"<button class='btn btn-primary' onclick='$(\'#section"+(dySObj.activeSection++)+"\').trigger(\'click'\)'>Next step</button>"*/);
			        //}); 
			    }
			}
			/*if(typeof dySObj.surveys.sections["section"+(dySObj.activeSection+1)] != "undefined"
        		&& typeof dySObj.surveys.sections["section"+(dySObj.activeSection+1)].dynForm != "undefined"){
        		$.each(dySObj.surveys.sections["section"+(dySObj.activeSection+1)].dynForm.jsonSchema.properties, function(e, v){
            		if(typeof v.docType != "undefined" && typeof v.linkTo != "undefined" && v.linkTo==dySObj.surveys.sections[sec].key){ 
            			if(v.linkTo=="citoyens"){
            				typeOwner=v.linkTo;
            				idOwner=userId;
            			}else{
            				typeOwner=v.linkTo+"s";
            				idOwner=dySObj.surveys.json[ dySObj.surveys.sections[sec].key ].id;
            			}
            			endpoint=baseUrl+"/"+moduleId+v.endPoint+"/folder/"+typeOwner+"/ownerId/"+idOwner;
						$("#"+v.domElement).fineUploader('setEndpoint', endpoint);
					}
				});
    		}*/
			//alert(dySObj.surveys.json[v.linkTo].type);
			$('html, body').stop().animate({scrollTop: 0}, 500, '');
		} 
		/*console.log("befffffffffore save fucking survey");
		if(typeof dySObj.surveys.sections["section"+(dySObj.activeSection+1)] != "undefined"
        		&& typeof dySObj.surveys.sections["section"+(dySObj.activeSection+1)].dynForm != "undefined"){
				alert();
        		$.each(dySObj.surveys.sections["section"+(dySObj.activeSection+1)].dynForm.jsonSchema.properties, function(e, v){
            		if(v.inputType=="uploader" && typeof v.docType != "undefined" && v.docType=="file"){ 
            			if( $('#'+v.domElement).fineUploader('getUploads').length > 0 ){
		    				$('#'+v.domElement).fineUploader('uploadStoredFiles');
		    						
            			//alert("type:"+dySObj.surveys.json[ dySObj.surveys.sections[sec].key ].type);
            			//endpoint=baseUrl+"/"+moduleId+v.endPoint+"/folder/"+v.linkTo+"s/ownerId/"+dySObj.surveys.json[ dySObj.surveys.sections[sec].key ].id;
						//$("#"+v.domElement).fineUploader('setEndpoint', endpoint);
						}
					}	
				});
    	}*/
		/*else 
		{
			mylog.log ( "save "+sectionKey );
			$.each( $("#"+sec+" textarea, #"+sec+" select, #"+sec+" input"),function(i,v){
				mylog.log(i,$(v).attr("name"),$(v).val());
				dySObj.surveys.answers[sectionKey][$(v).attr("name")] = $(v).val();
			});
		} */
		$( ".section"+dySObj.activeSection ).addClass("hide");
		dySObj.activeSection++;
		mylog.log("btn-next",dySObj.activeSection);
		$( ".section"+dySObj.activeSection ).removeClass("hide");
		dySObj.navBtnAction = true;
		wizardContent.smartWizard("goForward");
		dySObj.navBtnAction = false;
		dySObj.animateBar(dySObj.activeSection+1);
		if( dySObj.surveys.sections["section"+dySObj.activeSection].onNext && jQuery.isFunction( dySObj.surveys.sections["section"+dySObj.activeSection].onNext ) )
			dySObj.surveys.sections["section"+dySObj.activeSection].onNext();
	}
}

