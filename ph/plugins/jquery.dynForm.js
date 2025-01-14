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
formObj: is the form object containg the form field definition and jsonSchema
formValues: contains the values if needed 
onLoad : (optional) is a function that is launched once the form has been created and written into the DOM 
onSave: (optional) overloads the generic saveProcess
test

var dyFObj
var dyFInputs 
var dyFCustom
var finder 

***************************************** */

(function($) {
	"use strict";
	var thisBody = document.body || document.documentElement, 
	thisStyle = thisBody.style, 
	$this,
	supportTransition = thisStyle.transition !== undefined || thisStyle.WebkitTransition !== undefined || thisStyle.MozTransition !== undefined || thisStyle.MsTransition !== undefined || thisStyle.OTransition !== undefined
	
	/*$(subviewBackClass).on("click", function(e) {
		$.hideSubview();
		e.preventDefault();
	});*/

	$.extend({

		dynForm: function(options)
		{
			// extend the options from pre-defined values:
			var defaults = {
				formId : "", 
				formObj: {},
				formValues: {},
				beforeBuild : null,
				onLoad : null,
				onSave: null,
				beforeSave: null,
				savePath : '/ph/common/save'
			}; 
			var settings = $.extend({}, defaults, options);
			$this = this;

			mylog.info("build Form dynamically into form tag : ",settings.formId);
			mylog.dir(settings.formObj);

			/* **************************************
			* BUILD FORM based on formObj
			***************************************** */
			var form = {
				rules : {}
			};
			var fieldHTML = '';
			dyFObj.initFieldOnload={};
			dyFObj.orderForm=[];
			/* **************************************
			* Error Section
			***************************************** */
			var errorHTML = '<div class="errorHandler alert alert-danger no-display">'+
								'<i class="fa fa-remove-sign"></i> Merci de corriger les erreurs ci dessous.'+
							'</div>';
			$("body").removeClass("modal-open");
			$(settings.formId).append(errorHTML);

			if(settings.beforeBuild && jQuery.isFunction( settings.beforeBuild ) )
				settings.beforeBuild();

			$.each(settings.formObj.jsonSchema.properties,function(field,fieldObj) { 
				//mylog.log("??????????????????????????",field,fieldObj);
				if(fieldObj.rules)
					form.rules[field] = fieldObj.rules;//{required:true}
				
				var fieldTooltip = null;
				//alert("dyFObj."+dyFObj.activeElem+".dynForm.jsonSchema.tooltips."+field );
				if( jsonHelper.notNull( "dyFObj."+dyFObj.activeElem+".dynForm.jsonSchema.tooltips" ) && 
						dyFObj[dyFObj.activeElem].dynForm.jsonSchema.tooltips[field] ){
					fieldTooltip = dyFObj[dyFObj.activeElem].dynForm.jsonSchema.tooltips[field];
				}
				dyFObj.buildInputField(settings.formId,field, fieldObj, settings.formValues, fieldTooltip);
			});
			
			/* **************************************
			* CONTEXT ELEMENTS, used for saving purposes
			***************************************** */
			fieldHTML = '<input type="hidden" name="key" id="key" value="'+settings.formObj.key+'"/>';
	        fieldHTML += '<input type="hidden" name="collection" id="collection" value="'+settings.formObj.collection+'"/>';
	        fieldHTML += '<input type="hidden" name="id" id="id" value="'+((settings.formValues && settings.formValues.id) ? settings.formValues.id : "")+'"/>';
	       
        	fieldHTML += '<div class="form-actions">'+
        				'<hr class="col-md-12">';
        	if( !settings.formObj.jsonSchema.noSubmitBtns )
				fieldHTML += '<button id="btn-submit-form" class="btn btn-default text-azure text-bold pull-right">'+
							tradDynForm.submit+' <i class="fa fa-arrow-circle-right"></i>'+
						'</button> '+

						' <a href="javascript:dyFObj.closeForm(); " class="mainDynFormCloseBtn btn btn-default pull-right text-red" style="margin-right:10px;">'+
							'<i class="fa fa-times "></i> '+tradDynForm.cancel+
						'</a> ';

			fieldHTML += '</div>';

	        $( settings.formId ).append(fieldHTML);
	        if(settings.afterBuild && jQuery.isFunction( settings.afterBuild ) )
				settings.afterBuild();
	        $(dyFObj.activeModal+" #btn-submit-form").one(function() { 
				$( settings.formId ).submit();	        	
	        });

			/* **************************************
			* bind any events Post building 
			***************************************** */
			dyFObj.bindDynFormEvents(settings,form.rules);

			if(settings.onLoad && jQuery.isFunction( settings.onLoad ) )
				settings.onLoad();
			return form;
		}
	});
	

})(jQuery);

$.fn.serializeFormJSON = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name]) {
			if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

/* **************************************
* PROPERTIES functions called externally
***************************************** */
// here's our click function for when the forms submitted
function getPairs(parentContainer)
{
	//mylog.log("getPairs",parentContainer);
    var properties = {};
    $.each($(parentContainer+' .addmultifield'), function(i,el) {
    	if( $(this).val() != "" && $( this ).parent().next().children(".addmultifield1") != "" ){
	        properties[ slugify($(this).val()) ] = { "label" : $(this).val(),
	        										  "value" : $( this ).parent().next().children(".addmultifield1").val()};
	    }
    });
    //mylog.dir("getPairs",properties);
    return properties;
}

function getArray(parentContainer)
{
	//mylog.log("getArray",parentContainer);
    var list = [];
    $.each($(parentContainer+' .addmultifield'), function(i,el) {
    	if( $(this).val() != ""  ){
	        list.push( $(this).val() );
	    }
    });
    //mylog.dir("getArray",list);
    return list;
}

function AutoGrowTextArea(textField)
{
  if (textField.clientHeight < textField.scrollHeight)
  {
    textField.style.height = textField.scrollHeight + "px";
    if (textField.clientHeight < textField.scrollHeight)
    {
      textField.style.height = 
        (textField.scrollHeight * 2 - textField.clientHeight) + "px";
    }
  }
}

function slugify (value, slug) {    
	var rExps=[
	{re:/[\xC0-\xC6]/g, ch:'A'},
	{re:/[\xE0-\xE6]/g, ch:'a'},
	{re:/[\xC8-\xCB]/g, ch:'E'},
	{re:/[\xE8-\xEB]/g, ch:'e'},
	{re:/[\xCC-\xCF]/g, ch:'I'},
	{re:/[\xEC-\xEF]/g, ch:'i'},
	{re:/[\xD2-\xD6]/g, ch:'O'},
	{re:/[\xF2-\xF6]/g, ch:'o'},
	{re:/[\xD9-\xDC]/g, ch:'U'},
	{re:/[\xF9-\xFC]/g, ch:'u'},
	{re:/[\xC7-\xE7]/g, ch:'c'},
	{re:/[\xD1]/g, ch:'N'},
	{re:/[\xF1]/g, ch:'n'} ];

	// converti les caractères accentués en leurs équivalent alpha
	for(var i=0, len=rExps.length; i<len; i++)
	value=value.replace(rExps[i].re, rExps[i].ch);
	if(typeof slug != "undefined" && slug){
	    return value.replace(/\s+/g, '-')
	      .replace(/[^a-z0-9A-Z]/g, '')
	      .replace(/\-{2,}/g,'-');
	}
	else{
		// 1) met en bas de casse
		// 2) remplace les espace par des tirets
		// 3) enleve tout les caratères non alphanumeriques
		// 4) enlève les doubles tirets
		return value.replace(/\s+/g, '-')
		.replace(/[^a-z0-9-]/g, '')
		.replace(/\-{2,}/g,'-');
	}
};


var finder = {
	object : {},
	finderPopulation : {},
	selectedItems:{},
	typeAuthorized : {},
	callback : {},
	invite : null,
	roles : null,
	search : null,
	initVar : function(){
		mylog.log("finder initVar");
		finder.object = {};
		finder.finderPopulation = {};
		finder.selectedItems={};
		finder.typeAuthorized = {};
		finder.callback = {};
		finder.invite = null;
		finder.roles = null;
		finder.search = null;
	},
	set : function(){
		mylog.log("finder set");
		finder.object={};
		finder.typeAuthorized={};
		finder.callback={};
	},
	//init : function(id, multiple, initType, values, update, callbackSelect){
	init : function(params, callbackSelect){
		mylog.log("finder init!", params, callbackSelect);
		finder.object[params.id]={};
		finder.typeAuthorized[params.id]=params.initType;
		if(notNull(callbackSelect) && typeof callbackSelect == "function")
		 	finder.callback[params.id]=callbackSelect;
		 
		if(params.values){
			var valFin = params.values;
			if(typeof params.values.contributors != "undefined"){

				valFin = params.values.contributors;
				mylog.log("finder init data", dyFObj.elementData.map.type, dyFObj.elementData.map.id);
				$.ajax({
					type: "POST",
					url: baseUrl+'/'+moduleId+'/element/getdatadetail/type/'+dyFObj.elementData.map.type+
										'/id/'+dyFObj.elementData.map.id+'/dataName/contributors/isInviting/true?tpl=json',
					dataType: "json",
					async : false,
					success: function(data){
						mylog.log("finder init data res ", data);
						$.each(data, function(e, v){
							var good = false;
							if(params.roles == null){
								mylog.log("finder init data rolesNull ");
								good = true;
							}
							else if(notNull(params.roles)){
								good = true ;
								$.each(params.roles, function(kR, vR){
									mylog.log("finder init data inArray ");
									if($.inArray(vR, v.rolesLink) == -1)
										good = false;
								});
							}
							mylog.log("finder init data good ", good, e);
							if(good == true)
								finder.addInForm(params.id, e, v.type, v.name, v.profilThumbImageUrl);	
						});
					}
				});
			}else{
				mylog.log("finder init valFin", valFin);
				$.each(valFin, function(e, v){
					finder.addInForm(params.id, e, v.type, v.name, v.profilThumbImageUrl);	
				});
			}
			

			
		}
		else if(!notNull(params.update)){
			if(typeof contextData != "undefined" && notNull(contextData) && $.inArray(contextData.type, finder.typeAuthorized[params.id]) > -1)
				finder.addInForm(params.id, contextData.id, contextData.type, contextData.name, contextData.profilThumbImageUrl);
			else if(typeof finder.typeAuthorized[params.id] != "undefined" && 
					( ( finder.typeAuthorized[params.id].length != 1 && 
						finder.typeAuthorized[params.id][0] != "events" ) || 
					finder.typeAuthorized[params.id][0] == "organizations" ) && 
					!notNull(params.initElt) )  
				finder.addInForm(params.id, userId, "citoyens", userConnected.name+" ("+tradDynForm.me+")", userConnected.profilThumbImageUrl);
		}

		if(typeof params.invite != "undefined" && params.invite != null && params.invite === true){
			finder.invite = params.invite;
			lazyLoad( modules.co2.url+'/js/invite.js', 
					null,
					function(){
						if(typeof params.roles != "undefined" && params.roles != null){
							finder.roles = params.roles;
						}
						return true ;
					});

		}
		else
			finder.invite = null ;

		if(typeof params.search != "undefined" && params.search != null ){
			finder.search = params.search;
		}

        $(".finder-"+params.id+" .selectParent").click(function(e){
        	e.preventDefault();
        	//if($(this).data("multiple") || $(this).parent().find(".form-list-finder > .element-finder").length == 0){
    		keyForm=$(this).data("id");
    		typeSearch=finder.typeAuthorized[keyForm];
    		openSearch=$(this).data("open");
    		multiple=($(this).data("multiple")) ? true : false;
    		finder.showPanel(keyForm, typeSearch, openSearch, multiple);
        	//}else{
        	//	$(this).parent().find(".error").show(700).text("Vous ne pouvez ajouter qu'un élément");
        	//}
        });
	},
	addInForm : function(keyForm, id, type, name, img){
		mylog.log("finder addInForm", keyForm, id, type, name, img);
		img= (img != "") ? baseUrl + img : modules.co2.url + "/images/thumb/default_"+type+".png";
		//img= (img != "") ? img : modules.co2.url + "/images/thumb/default_"+type+".png";
		var str="";
		str="<div class='col-xs-12 element-finder element-finder-"+id+" shadow2 padding-10'>"+
					'<img src="'+ img+'" class="img-circle pull-left margin-right-10" height="35" width="35">'+
					'<span class="info-contact pull-left margin-right-5">' +
						'<span class="name-contact text-dark text-bold">' + name + '</span>'+
						'<br/>'+
						'<span class="cp-contact text-light pull-left">' + trad[type]+ '</span>'+
					'</span>' +
					'<button class="bg-red text-white pull-right" style="border: none;font-size: 15px;border-radius: 6px;padding: 5px 10px !important;" onclick="finder.removeFromForm(\''+keyForm+'\', \''+id+'\')"><i class="fa fa-times"></i></button>'+
			"</div>";
		$(".finder-"+keyForm+" .form-list-finder").append(str);

		finder.object[keyForm][id]={"type" : type, "name" : name};


		if(notNull(finder.finderPopulation[id]) && notNull(finder.finderPopulation[id].email)){
			finder.object[keyForm][id].email = finder.finderPopulation[id].email;
		}

		if(notNull(finder.roles)){
			finder.object[keyForm][id].roles = finder.roles;
		}

		if(notNull(finder.search) && notNull(finder.search.filterBy)){
			
			mylog.log("filterBy split", split, finder.selectedItems[id][finder.search.filterBy], notNull( finder.selectedItems[id][finder.search.filterBy]) );
			if(notNull( finder.selectedItems[id][finder.search.filterBy] ) ) {
				var fBy = {} ;
				var split = id.split(".");
				fBy[finder.search.filterBy] = finder.selectedItems[id][finder.search.filterBy] ;
				finder.object[keyForm][split[0]]=Object.assign({}, finder.object[keyForm][id], fBy);
				delete finder.object[keyForm][id];
			}
		};
	},
	removeFromForm : function(keyForm, id){
		//mylog.log("finder removeFromForm", keyForm, id);
		$(".finder-"+keyForm+" .form-list-finder .element-finder-"+id).remove();
		delete finder.object[keyForm][id];	
	},
	showPanel: function(keyForm, typeSearch, open, multiple){
		mylog.log("finder showPanel", keyForm, typeSearch, open, multiple);
		finder.selectedItems={};
		titleForm="Sélectionner dans la liste";
		if(!notNull(multiple) && !multiple)
			titleForm+="(Un seulement)";
		var dialog = bootbox.dialog({
		    title: titleForm,
		    message: '<div id="finderSelectHtml" style="max-height:480px;">'+
		    			'<input class="form-group form-control" type="text" id="populateFinder"/>'+
						'<div id="list-finder-selected" style="max-height:200px; overflow-y:auto"></div>'+
		    			'<hr/><div id="list-finder-selection" style="height:200px; overflow-y:auto" class="shadow2"><p><i class="fa fa-spin fa-spinner"></i> '+trad.currentlyloading+'...</p></div>'+
		    			'<form id="form-invite" class="hidden col-sm-12" style="margin-top : 10px">'+
		    			//"<div id='form-invite' class='hidden'>"+
    						'<div class="row margin-bottom-10">'+
								'<div class="col-md-1 col-md-offset-1" id="iconUser">'+    
									'<i class="fa fa-user fa-2x"></i>'+
								'</div>'+
								'<div class="col-md-9">'+
									'<input class="invite-name form-control" placeholder="Name" id="inviteName" name="inviteName" value="" />'+
								'</div>'+
							'</div>'+
							'<div class="row margin-bottom-10">'+
								'<div class="col-md-1 col-md-offset-1">'+  
									'<i class="fa fa-envelope-o fa-2x"></i>'+
								'</div>'+
								'<div class="col-md-9">'+
									'<input class="invite-email form-control" placeholder="Email" id="inviteEmail" name="inviteEmail" value="" />'+
								'</div>'+
							'</div>'+
							'<div class="row margin-bottom-10">'+
								'<div class="col-md-1 col-md-offset-1">'+  
									'<i class="fa fa-align-justify fa-2x"></i>'+
								'</div>'+
								'<div class="col-md-9">'+
									'<textarea class="invite-text form-control" id="inviteText" name="inviteText" rows="4" placeholder="Custom message"></textarea>'+
								'</div>'+
							'</div>'+
							'<div class="errorHandler alert alert-danger hidden"></div>'+
							'<div class="col-md-12 col-sm-12 col-xs-12 text-center">'+
								// '<input class="submit" type="submit" value="Submit">'+
								'<button class="btn btn-success" id="btnInviteNew" ><i class="fa fa-add"></i> Ajouter à la liste</button>'+
							'</div>'+
						'</div>'+
		    		'</div>',
		    closeButton:false,
		    buttons: {
			    cancel: {
			        label: trad.Close,
			        className: 'btn-default',
			        callback: function(){
			            dialog.modal('hide');
			        }
			    },
			    ok: {
			        label: trad.Add,
			        className: 'btn-success',
			        callback: function(e){
			        	e.preventDefault();
			        	finder.addSelectedToForm(keyForm, multiple);
			        }
			    }
			}
		});
		dialog.init(function(){
		    //setTimeout(function(){
		    finder.finderPopulation={};
		    if(typeof myContacts != "undefined"){
		    	$.each(typeSearch, function(e, type){
		    		if(typeof myContacts[type] != "undefined"){
		    			$.each(myContacts[type], function(e, v){
		    				finder.finderPopulation[e]={
		    					"name": v.name,
		    					"type": type,
		    					"profilThumbImageUrl":v.profilThumbImageUrl
		    				};
		    				if(type=="events"){
		    					finder.finderPopulation[e].startDate=v.startDate;
		    					finder.finderPopulation[e].endDate=v.endDate;
		    				}
		    			});
		    		}
		    	});
		    	
		    }
		    finder.populateFinder(keyForm, finder.finderPopulation, multiple, true);
		    $("#populateFinder").keyup(function(){
		    	if($(this).val().length < 3){
		    		finder.filterPopulation($(this).val());
		    	}else{
		    		if(notNull(open) && open){
		    			finder.filterPopulation($(this).val());
		    			finder.searchAndPopulateFinder(keyForm,$(this).val(), typeSearch, multiple);
		    		}else{
		    			finder.filterPopulation($(this).val());
		    		}
		    	}
		    });
		});

		if(typeof finder.invite != "undefined" && finder.invite != null && finder.invite === true){
			mylog.log("finder #finderSelectHtml", $("#finderSelectHtml").length);
			dialog.on('shown.bs.modal', function(e){
				mylog.log("finder #finderSelectHtml HERE", $("#finderSelectHtml").length);
				 var paramsInvite = {
				 	container : "#finderSelectHtml #form-invite"
				 };
			 	 inviteObj.init(paramsInvite);
				 inviteObj.formInvite(function(data){

				 	finder.finderPopulation[data.id]={
    					"name": data.name,
    					"email": data.mail,
    					"type": "citoyens",
    					"profilThumbImageUrl": modules.co2.url + "/images/thumb/default_citoyens.png"
    				};
    				finder.selectedItems[data.id]=finder.finderPopulation[data.id];
				 	

				 	var str ="<div class='population-elt-finder population-elt-finder-"+data.id+" col-xs-12' data-value='"+data.id+"'>"+
								'<div class="checkbox-content pull-left">'+
									'<label>'+
					    				'<input type="checkbox" class="check-population-finder checkbox-info" data-value="'+data.id+'">'+
					    				'<span class="cr"><i class="cr-icon fa fa-check"></i></span>'+
									'</label>'+
								'</div>'+
								"<div class='element-finder element-finder-"+data.id+"'>"+
									'<img src="'+ modules.co2.url + "/images/thumb/default_citoyens.png" +'" class="thumb-send-to pull-left img-circle" height="40" width="40">'+
									'<span class="info-contact pull-left margin-left-20">' +
										'<span class="name-element text-dark text-bold" data-id="'+data.id+'">' + data.name + '</span>'+
										'<br/>'+
										'<span class="type-element text-light pull-left">' + trad[data.type]+ '</span>'+
									'</span>' +
								"</div>"+
							"</div>";

					$("#form-invite").addClass("hidden");
				 	$("#list-finder-selected").append(str);
				 	$(".check-population-finder[data-value='"+data.id+"'").trigger("click");
				 	$("#list-finder-selection").removeClass("hidden");
		        	
				 	return true;
				 });

			});
		}

		
	},
	filterPopulation : function(searchVal){
		//mylog.log("finder filterPopulation", searchVal);
		//recherche la valeur recherché dans les 3 champs "name", "cp", et "city"
		if(searchVal != "")	$("#list-finder-selection .population-elt-finder").hide();
		else $("#list-finder-selection .population-elt-finder").show();
	
		$.each($("#list-finder-selection .population-elt-finder .name-element"), function() { 
			content = $(this).html();
			found = content.search(new RegExp(searchVal, "i"));
			console.log(searchVal, found, $(this).attr("id") );
			if(found >= 0)
				$("#list-finder-selection .population-elt-finder-"+$(this).data("id")).show();
		});
	},
	populateFinder : function(keyForm, obj, multiple, first){
		mylog.log("finder populateFinder", keyForm, obj, multiple, first);
		str="";
		if(first && typeof finder.object[keyForm][userId] == "undefined"){
			img= (userConnected.profilThumbImageUrl != "") ? baseUrl + userConnected.profilThumbImageUrl : modules.co2.url + "/images/thumb/default_citoyens.png";
			if(typeof finder.finderPopulation[userId]=="undefined"){
				finder.finderPopulation[userId]={
					name:userConnected.name + ' ('+tradDynForm.me+')',
					type:"citoyens",
					profilThumbImageUrl:userConnected.profilThumbImageUrl
				};
			}
			str+="<div class='population-elt-finder population-elt-finder-"+userId+" col-xs-12' data-value='"+userId+"'>"+
					'<div class="checkbox-content pull-left">'+
						'<label>'+
		    				'<input type="checkbox" class="check-population-finder checkbox-info" data-value="'+userId+'">'+
		    				'<span class="cr"><i class="cr-icon fa fa-check"></i></span>'+
						'</label>'+
					'</div>'+
					"<div class='element-finder element-finder-"+userId+"'>"+
						'<img src="'+img+'" class="thumb-send-to pull-left img-circle" height="40" width="40">'+
						'<span class="info-contact pull-left margin-left-20">' +
							'<span class="name-element text-dark text-bold" data-id="'+userId+'">' + userConnected.name + ' ('+tradDynForm.me+')</span>'+
							'<br/>'+
							'<span class="type-element text-light pull-left">' + trad.citoyens+ '</span>'+
						'</span>' +
					"</div>"+
				"</div>";
		}
		if(notNull(obj)){
			$.each(obj, function(e, v){
				if(typeof finder.object[keyForm][e] == "undefined" && e != userId){
					if(typeof finder.finderPopulation[e]== "undefined")
						finder.finderPopulation[e]=v;
					if($(".population-elt-finder-"+e).length <= 0){

						img= (v.profilThumbImageUrl != "") ? baseUrl + v.profilThumbImageUrl : modules.co2.url + "/images/thumb/default_"+v.type+".png";
						// if(notNull(finder.search) && notNull(finder.search.filterBy)){
						// 	if(notNull(v[finder.search.filterBy])){
						// 		$.each(v[finder.search.filterBy], function(keyF, valF){
						// 			str+="<div class='population-elt-finder population-elt-finder-"+e+"."+keyF+" col-xs-12' data-value='"+e+"."+keyF+"'>"+
						// 				'<div class="checkbox-content pull-left">'+
						// 					'<label>'+
						// 	    				'<input type="checkbox" class="check-population-finder checkbox-info" data-value="'+e+'.'+keyF+'">'+
						// 	    				'<span class="cr"><i class="cr-icon fa fa-check"></i></span>'+
						// 					'</label>'+
						// 				'</div>'+
						// 				"<div class='element-finder element-finder-"+e+"."+keyF+"'>"+
						// 					'<img src="'+ img+'" class="thumb-send-to pull-left img-circle" height="40" width="40">'+
						// 					'<span class="info-contact pull-left margin-left-20">' +
						// 						'<span class="name-element text-dark text-bold" data-id="'+e+'.'+keyF+'">' + v.name + ' - ' + valF["name"] + '</span>'+
						// 						'<br/>'+
						// 						'<span class="type-element text-light pull-left">' + trad[v.type]+ '</span>'+
						// 					'</span>' +
						// 				"</div>"+
						// 			"</div>";
						// 		});
						// 	}
						// }else{
							str+="<div class='population-elt-finder population-elt-finder-"+e+" col-xs-12' data-value='"+e+"'>"+
								'<div class="checkbox-content pull-left">'+
									'<label>'+
					    				'<input type="checkbox" class="check-population-finder checkbox-info" data-value="'+e+'">'+
					    				'<span class="cr"><i class="cr-icon fa fa-check"></i></span>'+
									'</label>'+
								'</div>'+
								"<div class='element-finder element-finder-"+e+"'>"+
									'<img src="'+ img+'" class="thumb-send-to pull-left img-circle" height="40" width="40">'+
									'<span class="info-contact pull-left margin-left-20">' +
										'<span class="name-element text-dark text-bold" data-id="'+e+'">' + v.name + '</span>'+
										'<br/>'+
										'<span class="type-element text-light pull-left">' + trad[v.type]+ '</span>'+
									'</span>' +
								"</div>"+
							"</div>";
						//}

						
						
					}
				}
			});
		}
		if(first)
			$("#list-finder-selection").html(str);
		else
			$("#list-finder-selection").append(str);
		finder.bindSelectItems(multiple);
	},
	bindSelectItems : function(multiple){
		//mylog.log("finder bindSelectItems", multiple);
		$(".population-elt-finder").off().on("click", function(e){
			if(e.target.className!="cr-icon fa fa-check" && e.target.className!="check-population-finder checkbox-info")
				$(".check-population-finder[data-value='"+$(this).data("value")+"'").trigger("click");
		});
		$(".check-population-finder").off().on("click", function(){
			if($(this).is(":checked")){
				if(!multiple){
					finder.selectedItems={};	
					$("#list-finder-selected").html("");
				}
				// if(notNull(finder.search) && notNull(finder.search.filterBy)){
				// 	var split = $(this).data("value").split(".");
				// 	finder.selectedItems[$(this).data("value")]=finder.finderPopulation[split[0]];
				// }else{
					finder.selectedItems[$(this).data("value")]=finder.finderPopulation[$(this).data("value")];
				//}
				
				$(".population-elt-finder-"+$(this).data("value")).prependTo("#list-finder-selected");
			}else{
				delete finder.selectedItems[$(this).data("value")];
				$(".population-elt-finder-"+$(this).data("value")).prependTo("#list-finder-selection");
			}
		});
	},
	addSelected : function(checked, multiple, val ){
		if($(this).is(":checked")){
			if(!multiple){
				finder.selectedItems={};	
				$("#list-finder-selected").html("");
			}
			finder.selectedItems[val]=finder.finderPopulation[val];
			$(".population-elt-finder-"+val).prependTo("#list-finder-selected");
		}else{
			delete finder.selectedItems[val];
			$(".population-elt-finder-"+val).prependTo("#list-finder-selection");
		}
	},
	addSelectedToForm: function(keyForm, multiple){
		mylog.log("finder addSelectedToForm", keyForm, multiple);
		if(Object.keys(finder.selectedItems).length > 0){
			if(!multiple){
				finder.object[keyForm]={};
				$(".finder-"+keyForm+" .form-list-finder").html("");
			}
			$.each(finder.selectedItems, function(e, v){
				finder.addInForm(keyForm, e, v.type, v.name, v.profilThumbImageUrl);
			});
			if(typeof finder.callback[keyForm] != "undefined") finder.callback[keyForm]();
		}
	},
	searchAndPopulateFinder : function(keyForm, text, typeSearch, multiple){
		//mylog.log("finder searchAndPopulateFinder", keyForm, text, typeSearch, multiple);
		//finder.isSearching=true;

		var dataSearch = {
        	searchType : typeSearch, 
        	name: text
        };

        if(notNull(finder.search)){
        	dataSearch = Object.assign({}, dataSearch, finder.search);
        }

  		$.ajax({
			type: "POST",
	        url: baseUrl+"/"+moduleId+"/search/globalautocomplete",
	        data: dataSearch,
	        dataType: "json",
	        success: function(retdata){
	        	
	        	if(!retdata){
	        		toastr.error(retdata.content);
	        	} else {
		        	mylog.log(retdata);
		        	if(retdata.results.length == 0 && finder.invite === true){
		        		$("#form-invite").removeClass("hidden");
		        		$("#list-finder-selection").addClass("hidden");

		        		var search =  "#finderSelectHtml #populateFinder" ;
		        		var id = "#finderSelectHtml #form-invite" ; 
		        		var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
						if(emailReg.test( $(search).val() )){
							$(id+' #inviteEmail').val( $(search).val());
							var nameEmail = $(search).val().split("@");
							$(id+" #inviteName").val(nameEmail[0]);
						}else{
							$(id+" #inviteName").val($(search).val());
							$(id+" #inviteEmail").val("");
						}

	        		} else{
	        			$("#form-invite").addClass("hidden");
	        			$("#list-finder-selection").removeClass("hidden");
		        		finder.populateFinder(keyForm, retdata.results, multiple);
	        		}
	  			}
			}	
		});
	}
};
var uploadObj = {
	type : null,
	id : null,
	gotoUrl : null,
	isSub : false,
	update  : false,
	docType  : "image",
	docListIds : [],
	initList : [],
	callBackData : null,
	startAfterLoadUploader:true,
	folder : "communecter", //on force pour pas casser toutes les vielles images
	contentKey : "profil",
	afterLoadUploader : false,
	path : null,
	extra : null,
	get : function(type,id, docT, contentK, foldKey, extraUrl){
		docT=(notNull(docT) && docT) ? docT : "image";
		typeForUpload = ( jsonHelper.notNull( "typeObj."+type+'.col') ) ? typeObj[type].col : type; 
		path = baseUrl+"/"+moduleId+"/document/uploadSave/dir/"+uploadObj.folder+"/folder/"+typeForUpload+"/ownerId/"+id+"/input/qqfile/docType/"+docT;	
		if(notNull(contentK) && contentK != "")
			path += "/contentKey/"+contentK;
		else if(docT == "image")
			path += "/contentKey/profil";
		if(notNull(foldKey) && foldKey != "")
			path += "/folderId/"+foldKey;
		if(notNull(extraUrl) && extraUrl != "" && extraUrl !== true)
			path += extraUrl;
		return path;
	},
	set : function(type,id, docT, contentK, foldKey, extraUrl){
		if(typeof type != "undefined"){
			mylog.log("set uploadObj", id,type,uploadObj.folder,uploadObj.contentKey);
			typeForUpload = ( jsonHelper.notNull( "typeObj."+type+'.col') ) ? typeObj[type].col : type; 
			uploadObj.type = typeForUpload;
			uploadObj.id = id;
			docT=(notNull(docT) && docT) ? docT : "image";
			uploadObj.path = baseUrl+"/"+moduleId+"/document/uploadSave/dir/"+uploadObj.folder+"/folder/"+typeForUpload+"/ownerId/"+id+"/input/qqfile/docType/"+docT;
			if(notNull(contentK) && contentK != "")
				uploadObj.path += "/contentKey/"+contentK;
			else if(docT == "image")
				uploadObj.path += "/contentKey/profil";
			if(notNull(foldKey) && foldKey != "")
				uploadObj.path += "/folderId/"+foldKey;
			if(notNull(extraUrl) && extraUrl != "" && extraUrl !== true)
				uploadObj.path += extraUrl;
			
			//if(typeof uploadObj.domTarget !="undefined")
			//	$(uploadObj.domTarget).fineUploader('setEndpoint', uploadObj.path);
		}else {
			uploadObj.type = null;
			uploadObj.id = null;
			uploadObj.path = null;
			uploadObj.callBackData = null;
			uploadObj.initList = {};
		}
	},
	prepareInit : function(data){
		arrayList=[];
		$.each(data, function(e, v){
			item=new Object;
			item.size=v.size,
			item.uuid=v._id.$id,
			item.name=v.name;
			item.deleteFileEndpoint=baseUrl+"/"+moduleId+"/document/deletedocumentbyid/id";
			if(typeof v.imageThumbPath != "undefined")
				item.thumbnailUrl=v.imageThumbPath;
			arrayList.push(item);
		} );
		return arrayList;
	}
};
var openingHoursResult=[
	{"dayOfWeek":"Su","allDay":true, "hours":[{"opens":"06:00","closes":"19:00"}]},
	{"dayOfWeek":"Mo","allDay":true, "hours":[{"opens":"06:00","closes":"19:00"}]},
	{"dayOfWeek":"Tu","allDay":true, "hours":[{"opens":"06:00","closes":"19:00"}]},
	{"dayOfWeek":"We","allDay":true, "hours":[{"opens":"06:00","closes":"19:00"}]},
	{"dayOfWeek":"Th","allDay":true, "hours":[{"opens":"06:00","closes":"19:00"}]},
	{"dayOfWeek":"Fr","allDay":true, "hours":[{"opens":"06:00","closes":"19:00"}]},
	{"dayOfWeek":"Sa","allDay":true, "hours":[{"opens":"06:00","closes":"19:00"}]},
];

var dyFObj = {
	elementObj : null,
	elementData : null,
	subElementObj : null,
	subElementData : null,
	activeElem : null,
	activeModal : null,
	//rules to show hide submit btn, used anwhere on blur and can be 
	//completed by specific rules on dynForm Obj
	//ex : dyFObj.elementObj.dynForm.jsonSchema.canSubmitIf
	canSubmitIf : function () { 
    	var valid = true;
    	mylog.log("canSubmitIf");
    	//on peut ajouter des regles dans la map definition 
    	if(	jsonHelper.notNull("dyFObj.elementObj.dynForm.jsonSchema.canSubmitIf", "function") )
    		valid = dyFObj.elementObj.dynForm.jsonSchema.canSubmitIf();
    	if( $('#ajaxFormModal #name').length == 0 || $('#ajaxFormModal #name').val() != "" && valid )
    		$('#btn-submit-form').show();
    	else 
    		$('#btn-submit-form').hide();
		//tmp
		$('#btn-submit-form').show();
    },
    initFieldOnload : {},
	formatData : function (formData, collection,ctrl) { 
		mylog.warn("----------- formatData",formData, collection,ctrl, dynForm);
		formData.collection = collection;
		formData.key = ctrl;
		if( $.isArray(formData.id) )
			formData.id = formData.id[0]; //this shouldn't happen, occurs in survey

		if(dyFInputs.locationObj.centerLocation){
			//formData.multiscopes = elementLocation;
			formData.address = dyFInputs.locationObj.centerLocation.address;
			formData.geo = dyFInputs.locationObj.centerLocation.geo;
			formData.geoPosition = dyFInputs.locationObj.centerLocation.geoPosition;
			if( dyFInputs.locationObj.elementLocations.length ){
				$.each( dyFInputs.locationObj.elementLocations,function (i,v) { 
					mylog.log("elementLocations v", v);
					if(typeof v != "undefined" && typeof v.center != "undefined" ){
						dyFInputs.locationObj.elementLocations.splice(i, 1);
					}
				});
				formData.addresses = dyFInputs.locationObj.elementLocations;
			}
		}
		if(notNull(formData.newElement_country))
			delete formData.newElement_country; 

		if(notNull(scopeObj.selected)){
			formData.scope = scopeObj.selected;
		}
		
		formData.medias = [];
		$(".resultGetUrl").each(function(){
			if($(this).html() != ""){
				mediaObject=new Object;	
				if($(this).find(".type").val()=="url_content"){
					mediaObject.type=$(this).find(".type").val();
					if($(this).find(".name").length)
						mediaObject.name=$(this).find(".name").val();
					if($(this).find(".description").length)
						mediaObject.description=$(this).find(".description").val();
					mediaObject.content=new Object;
					mediaObject.content.type=$(this).find(".media_type").val(),
					mediaObject.content.url=$(this).find(".url").val(),
					mediaObject.content.image=$(this).find(".img_link").val();
					if($(this).find(".size_img").length)
						mediaObject.content.imageSize=$(this).find(".size_img").val();
					if($("#form-news #results .video_link_value").length)
						mediaObject.content.videoLink=$(this).find(".video_link_value").val();
				}
				else{
					mediaObject.type=$(this).find(".type").val(),
					mediaObject.countImages=$(this).find(".count_images").val(),
					mediaObject.images=[];
					$(".imagesNews").each(function(){
						mediaObject.images.push($(this).val());	
					});
				}
				formData.medias.push(mediaObject);
			}
		});
		mylog.log( "formData", formData );
		if( typeof formData.source != "undefined" && formData.source != "" ){
			originInsert=(typeof costum != "undefined" && notNull(costum)) ? "costum" : "network";
			formData.source = { insertOrign : originInsert,
								keys : [ 
									formData.source
								],
								key : formData.source
							}

			if( typeof dynForm.jsonSchema.typeObjOrigin != "undefined" && 
				dynForm.jsonSchema.typeObjOrigin != null && 
				typeof costum != "undefined" && costum != null && 
				typeof costum.typeObj != "undefined" && costum.typeObj != null &&
				typeof costum.typeObj[dynForm.jsonSchema.typeObjOrigin] != "undefined" && 
				costum.typeObj[dynForm.jsonSchema.typeObjOrigin] != null &&
				typeof costum.typeObj[dynForm.jsonSchema.typeObjOrigin].toBeValidated != "undefined" && 
				costum.typeObj[dynForm.jsonSchema.typeObjOrigin].toBeValidated === true
				 ) {
				formData.source.toBeValidated = true;
			}
		}
		mylog.log("finder formData", finder);
		if(typeof finder != "undefined" && Object.keys(finder.object).length > 0){
			$.each(finder.object, function(key, object){
				formData[key]=object;
			});
		}
		if( typeof formData.tags != "undefined" && formData.tags != "" )
			formData.tags = formData.tags.split(",");

		// input de tags différents
		var nbListTags = 1 ;
		mylog.log("Here", nbListTags, jsonHelper.notNull("formData.tags"+nbListTags));
		while(jsonHelper.notNull("formData.tags"+nbListTags)){
			tagsSave=formData["tags"+nbListTags].split(",");
			if(!formData.tags)formData.tags = [];
			$.each(tagsSave, function(i, e) {
				formData.tags.push(e);
			});
			delete formData["tags"+nbListTags];
			nbListTags++;
		}
		
		if( typeof formData.openingHours != "undefined"){
			if(typeof formData.hour != "undefined")
				delete formData.hour;
			if(typeof formData.minute != "undefined")
				delete formData.minute;
			$.each(openingHoursResult, function(e,v){
				if(v.allDay && typeof v.hours != "undefined")
        			delete openingHoursResult[e]["hours"];
				if(typeof v.disabled != "undefined")
					delete openingHoursResult[e];
			});		
			formData.openingHours=openingHoursResult;
		}
		// Add collections and genres of notragora in tags
		if( typeof formData.collections != "undefined" && formData.collections != "" ){
			collectionsTagsSave=formData.collections.split(",");
			if(!formData.tags)formData.tags = [];
			$.each(collectionsTagsSave, function(i, e) {
				formData.tags.push(e);
			});
			delete formData['collections'];
		}

		if( typeof formData.genres != "undefined" && formData.genres != "" ){
			genresTagsSave=formData.genres.split(",");
			if(!formData.tags)formData.tags = [];
			$.each(genresTagsSave, function(i, e) {
				formData.tags.push(e);
			});
			delete formData['genres'];
		}

		if(typeof formData.isUpdate == "undefined" || !formData.isUpdate)
			removeEmptyAttr(formData);
		else
			delete formData["isUpdate"];


		$.each(dyFObj.elementObj.dynForm.jsonSchema.properties, function(kP, vP) {
			if(vP["inputType"] == "properties"){
				// var ind = 0;
				// var keyVal = [];
				// var nostop = true;
				// while( nostop ) {
				// 	mylog.log("formData jsonHelper.notNull", kP, ind, formData[kP+ind], notNull(formData[kP+ind]));
				// 	if(notNull(formData[kP+ind])){
				// 		keyVal.push({name : formData[kP+ind], value : formData["tags"+kP+ind]});
				// 		delete formData[kP+ind];
				// 		delete formData["tags"+kP+ind];
				// 		ind++;
				// 	}else
				// 		 nostop = false ;
				// }
				// formData[kP] = keyVal ;
				
				formData[kP] = getPairs("."+kP+vP["inputType"]);

				$.each($("."+kP+vP["inputType"]+' .addmultifield'), function(i,el) {
					var id1 = $(this).attr('id');
					var id2 =$( this ).parent().next().children(".addmultifield1").attr('id');
					delete formData[id1];
					delete formData[id2];
			    	
			    });
			}
		});

		mylog.log("formData", formData);
		return formData;
	},

	saveElement : function  ( formId,collection,ctrl,saveUrl,afterSave ) { 
		mylog.warn("---------------- saveElement",formId,collection,ctrl,saveUrl,afterSave );
		if( typeof formId == "object" )
			formData = formId;
		else	
			formData = $(formId).serializeFormJSON();

		if( !formData.id && uploadObj.id ){
			mylog.log("no formData id, using uploadObj.id : ",uploadObj.id);
			formData.id = uploadObj.id;
		}
		mylog.log("before",formData);

		if( jsonHelper.notNull( "dyFObj.elementObj.dynForm.jsonSchema.formatData","function") )
			formData = dyFObj.elementObj.dynForm.jsonSchema.formatData(formData);

		formData = dyFObj.formatData(formData,collection,ctrl);
		mylog.log("saveElement", formData);

		if( jsonHelper.notNull( "dyFObj.elementObj.dynForm.jsonSchema.mapping","function") )
			formData = dyFObj.elementObj.dynForm.jsonSchema.mapping(formData);

		formData.medias = [];
		$(".resultGetUrl").each(function(){
			if($(this).html() != ""){
				mediaObject=new Object;	
				if($(this).find(".type").val()=="url_content"){
					mediaObject.type=$(this).find(".type").val();
					if($(this).find(".name").length)
						mediaObject.name=$(this).find(".name").val();
					if($(this).find(".description").length)
						mediaObject.description=$(this).find(".description").val();
					mediaObject.content=new Object;
					mediaObject.content.type=$(this).find(".media_type").val(),
					mediaObject.content.url=$(this).find(".url").val(),
					mediaObject.content.image=$(this).find(".img_link").val();
					if($(this).find(".size_img").length)
						mediaObject.content.imageSize=$(this).find(".size_img").val();
					if($(this).find(".video_link_value").length)
						mediaObject.content.videoLink=$(this).find(".video_link_value").val();
				}
				else{
					mediaObject.type=$(this).find(".type").val(),
					mediaObject.countImages=$(this).find(".count_images").val(),
					mediaObject.images=[];
					$(".imagesNews").each(function(){
						mediaObject.images.push($(this).val());	
					});
				}
				formData.medias.push(mediaObject);
			}
		});
		if(formData.medias.length == 0)
			delete formData.medias;
		mylog.log("beforeAjax",formData);

		if( dyFObj.elementObj.dynForm.jsonSchema.debug ){
			mylog.log("debug dyn Form xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
			mylog.dir(formData);
			dyFObj.closeForm();
			mylog.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
		} else {
			$.ajax( {
		    	type: "POST",
		    	url: (saveUrl) ? saveUrl : baseUrl+"/"+moduleId+"/element/save",
		    	data: formData,
		    	dataType: "json",
		    	success: function(data){
		    		mylog.warn("saveElement ajax result");
		    		mylog.dir(data);
					if(data.result == false)
					{
		                toastr.error(data.msg);
		                //reset save btn 
		                $("#btn-submit-form").html('Valider <i class="fa fa-arrow-circle-right"></i>').prop("disabled",false).one(function() { 
							$( settings.formId ).submit();	        	
				        });
		           	} else {

		           		mylog.log("here");
		            	if(typeof data.msg != "undefined") 
		            		toastr.success(data.msg);
		            	else{
		            		if(typeof data.resultGoods != "undefined" && typeof data.resultGoods.msg != "undefined")
		            			toastr.success(data.resultGoods.msg);
		            		if(typeof data.resultErrors != "undefined" && typeof data.resultErrors.msg != "undefined")
		            			toastr.error(data.resultErrors.msg);
		            	}
		            	// mylog.log("data.id", data.id, data.url);
		            	/*if(data.map && $.inArray(collection, ["events","organizations","projects","citoyens"] ) !== -1)
				        	addLocationToFormloopEntity(data.id, collection, data.map);*/
				       
				        if (typeof networkJson != "undefined"){
				        	mylog.log("here networkJson", typeof networkJson, networkJson);
				        	window.location.reload();
				        } else if (typeof afterSave == "function"){
				        	mylog.log("here afterSave", typeof afterSave, afterSave);
		            		afterSave(data);
		            		//urlCtrl.loadByHash( '#'+ctrl+'.detail.id.'+data.id );
		            	} else {
		            		 mylog.log("here else", data);
							dyFObj.closeForm();
			                if(data.url){
			                	mylog.log("urlReload data.url", data.url);
			                	urlCtrl.loadByHash( data.url );
			                }
			                else if(data.id){
			                	mylog.log("urlReload", '#'+ctrl+'.detail.id.'+data.id);
				        		urlCtrl.loadByHash( '#'+ctrl+'.detail.id.'+data.id );
			                }
						}
		            }
		            //uploadObj.set()
		    	}
		    });
		}
	},
	closeForm : function() {
		$('#ajax-modal').modal("hide");
	    //clear the unecessary DOM 
	    $("#ajaxFormModal").html(''); 
	   	uploadObj.set();
	    uploadObj.update = false;
	},
	editStep : function ( form,data,afterLoad ){
		mylog.log("step",form, data);
		dyFObj.openForm( form ,afterLoad , data);
	},
	editElement : function (type,id, subType, dynFormCostum){
		mylog.warn("--------------- editElement dynFormCostum",type,id,subType,dynFormCostum);
		//get ajax of the elemetn content

		uploadObj.set(type, id);
		uploadObj.update = true;
		$.ajax({
	        type: "GET",
	        url: baseUrl+"/"+moduleId+"/element/get/type/"+type+"/id/"+id+"/update/true",
	        dataType : "json"
	    })
	    .done(function (data) {
	        if ( data && data.result ) {
	        	//toastr.info(type+" found")
				//onLoad fill inputs
				//will be sued in the dynform  as update 
				data.map.id = data.map["_id"]["$id"];
				if(typeObj[type] && typeof typeObj[type].formatData == "function")
					data = typeObj[type].formatData();
				if(data.map["_id"])
					delete data.map["_id"];
				mylog.log("editElement data", data);
				dyFObj.elementData = data;
				typeModules=(notNull(subType)) ? subType : type; 
				if(typeof typeObj[typeModules] != "undefined")
					typeForm=typeModules;
				else if(typeof typeObj[type] != "undefined" && typeObj[type].formType !="undefined")
					typeForm=type;
				else if(typeof subType == "object")
					typeForm = subType;
				else if(jsonHelper.notNull( "modules."+typeModules+".form") ) 
					typeForm = typeModules;
				else 
					typeForm = dyFInputs.get(typeModules).ctrl;

				mylog.log("editElement typeForm ", typeForm);
				dyFObj.openForm(typeForm,null, data.map,null, dynFormCostum);
				//console(dyFObj.init.uploader, "editiiiiiii");
				
	        } else 
	           toastr.error("something went wrong!! please try again.");
	    });
	},
	openAjaxForm : function (url){
		mylog.warn("--------------- openAjaxForm ",url);
		//get ajax of the elemetn content
		
		uploadObj.update = true;
		$.ajax({
	        type: "GET",
	        url: baseUrl+url,
	        dataType : "json"
	    })
	    .done(function (data) {
	        if ( data && data.json ) {
				mylog.log("openAjaxForm data.json", data.json);
				dyFObj.openForm( data.json );
				dyFInputs.setSub("bg-purple");
	        } else 
	           toastr.error("something went wrong!! please try again.");
	    });
	},
	prepData : function(data){
		var obj = null ;
		if(typeof networkJson != 'undefined' && notNull(networkJson))
			obj = networkJson;
		if(typeof costum != 'undefined' && notNull(costum))
			obj = costum;

		if(obj != null && notNull(obj.dynForm) && notNull(data.tags)){
			if(notNull(obj.dynForm.extra)){
				var nbListTags = 1 ;
				while( notNull(obj.dynForm.extra["tags"+nbListTags] ) ){
					var tagsL = obj.dynForm.extra["tags"+nbListTags].tags;
					tagsL.forEach(function(valTag) {
						var index = $.inArray( valTag, data.tags );
						if(index > -1){
							if(typeof data["tags"+nbListTags] == "undefined"){
								data["tags"+nbListTags] = [];
							}
							data["tags"+nbListTags].push(valTag);
							data.tags.splice(index,1);
						}
					});
					nbListTags++;
				}

				if( typeof obj.dynForm.extra.tags == "undefined" ||
					obj.dynForm.extra.tags == null ||
					obj.dynForm.extra.tags == false )
					delete data.tags;
			}
		}

		mylog.log("prepData",data);
		return data;

	},
	//entry point function for opening dynForms
	openForm : function  (type, afterLoad,data, isSub, dynFormCostum) { 
		//mylog.clear();

		$.unblockUI();
		$("#openModal").modal("hide");
		mylog.warn("--------------- Open Form ",type, afterLoad,data);
		mylog.dir(data);
		uploadObj.contentKey="profil"; 
		if(notNull(data)){
			if(typeof data.images != "undefined")
				uploadObj.initList.image=data.images;
			if(typeof data.files != "undefined" )
				uploadObj.initList.file=data.files;

			data = dyFObj.prepData(data);

		}else{
			uploadObj.initList={};
		}
		dyFObj.activeElem = (isSub) ? "subElementObj" : "elementObj";
		dyFObj.activeModal = (isSub) ? "#openModal" : "#ajax-modal";

		//enables setting dynform customization 
		//sample used in costum/views/tpls/wizard
		if( typeof dynFormCostum != "undefined"){
			mylog.warn("--------------- Open Form dynFormCostum set",dynFormCostum);
			dyFObj.dynFormCostum = dynFormCostum;
		}

		if(notNull(finder))
			finder.initVar();

		if(notNull(scopeObj))
			scopeObj.selected = {};

		if(userId)
		{
			if(typeof formInMap != 'undefined')
				formInMap.formType = type;

			if(typeof dyFObj.formInMap != 'undefined')
				dyFObj.formInMap.formType = type;

			dyFObj.getDynFormObj(type, function() { 
				dyFObj.startBuild(afterLoad,data);
			},afterLoad, data, dynFormCostum);
		} else {
			dyFObj.openFormAfterLogin = {
				type : type, 
				afterLoad : afterLoad,
				data : data
			};
			toastr.error(tradDynForm.mustbeconnectforcreateform);
			$('#modalLogin').modal("show");
		}
	},
	//get the specification of a given dynform  
	//can be of 3 types 
	//(string) :: will get the definition if exist in typeObj[key].dybnForm 
	//if doesn't exist tries to lazyload it from assets/js/dynForm 
	//(object) :: is dynformp definition 
	getDynFormObj : function(type, callback,afterLoad, data,dynFormCostum){
		//alert(type+'.js');
		mylog.warn("------------ getDynFormObj",type, callback,afterLoad, data );
		if (typeof type == "object"){
			mylog.log(" object directly Loaded : ", type);
			if(type.dynForm)
				dyFObj[dyFObj.activeElem] = type;
			else 
				dyFObj[dyFObj.activeElem] = {dynForm:type};
			if( notNull(type.col) ) uploadObj.type = type.col;
    		callback(type, afterLoad, data);
		} else if( jsonHelper.notNull( "typeObj."+type+".dynForm" , "object") ){
			mylog.log(" typeObj Loaded : ", type);
			dyFObj[dyFObj.activeElem] = dyFInputs.get(type);
			if( notNull(dyFInputs.get(type).col) ) uploadObj.type = dyFInputs.get(type).col;
			
			if( typeof dyFObj.dynFormCostum != "undefined")
				dyFObj[dyFObj.activeElem].dynFormCostum = dyFObj.dynFormCostum;
			
    		callback( dyFObj[dyFObj.activeElem], afterLoad, data );
		} else {
			//TODO : pouvoir surchargé le dossier dynform dans le theme
			//via themeObj.dynForm.folder overload
			var dfPath = moduleUrl+'/js/dynForm/'+type+'.js';
			var dyfCallObj=typeObj.get(type);
			if(typeof dyfCallObj.formParent != "undefined")
				dfPath=moduleUrl+'/js/dynForm/'+dyfCallObj.formParent+'.js';
			
			//sometimes special forms sit in the theme obj
			if ( jsonHelper.notNull( "themeObj.dynForm.folder") ) 
				dfPath = themeObj.dynForm.folder+type+'.js';
			
			//a dynform can be called from a module , but comes from parent Co2 module
			if ( moduleId != activeModuleId ){
				dfPath = parentModuleUrl+'/js/dynForm/'+type+'.js';
				if(typeof dyfCallObj.formParent != "undefined")
					dfPath=parentModuleUrl+'/js/dynForm/'+dyfCallObj.formParent+'.js';
				mylog.log("properties from MODULE CO2","modules/"+type+"/assets/js/dynform.js");
			}
			
			//path is defined in the initJS modules obj
			if ( jsonHelper.notNull( "modules."+type+".form") ) {
				dfPath = modules[type].form;
				mylog.log("properties from MODULE","modules/"+type+"/assets/js/dynform.js");
			}

			//a full path is given to a form definition
			if ( type.indexOf(".js")>-1)  
				dfPath = type;
			
			mylog.log("getDynFormObj",type,dfPath);
			lazyLoad( dfPath, 
				null,
				function() { 
					//alert(dfPath+type+'.js');
					mylog.log("lazyLoaded",type,dfPath);
					mylog.dir(dynForm);
					
				  	//dyFInputs.get(type).dynForm = dynForm;
					typeObj[type].dynForm = dynForm;
					dyFObj[dyFObj.activeElem] = typeObj.get(type);

					if( typeof dyFObj.dynFormCostum != "undefined")
						dyFObj[dyFObj.activeElem].dynFormCostum = dyFObj.dynFormCostum;

					//console.log("culuclucluccuucucuc",dyFObj[dyFObj.activeElem]);
					if( notNull( typeObj.get(type).col) ) 
						uploadObj.type = typeObj.get(type).col;
    				callback( afterLoad, data );
				});
		}
	},
	//prepare information for the modal panel 
	//and launches the build process
	startBuild : function  (afterLoad, data) { 
		mylog.warn("------------ startBuild",dyFObj[dyFObj.activeElem], afterLoad, data,dyFObj.activeModal );
		mylog.dir(dyFObj[dyFObj.activeElem]);
		$(dyFObj.activeModal+" .modal-header").removeClass("bgEvent bgOrga bgProject bgPerson bgDDA");//.addClass(dyFObj[elem].bgClass);
		$(dyFObj.activeModal+" #ajax-modal-modal-title").html("<i class='fa fa-refresh fa-spin'></i> Chargement en cours. Merci de patienter.");
		$(dyFObj.activeModal+" #ajax-modal-modal-title").removeClass("text-dark text-green text-azure text-purple text-orange text-blue text-turq");
		
	  	$(dyFObj.activeModal+" #ajax-modal-modal-body").html( "<div class='row bg-white'>"+
	  										"<div class='col-md-10 col-md-offset-1 col-xs-12'>"+
							              	"<div class='space20'></div>"+
							              	//"<h1 id='proposerloiFormLabel' >Faire une proposition</h1>"+
							              	"<form id='ajaxFormModal' enctype='multipart/form-data'></form>"+
							              	"</div>"+
							              "</div>");
	  	$(dyFObj.activeModal+' .modal-footer').hide();
	  	$(dyFObj.activeModal).modal("show");
	  	leftPosModal=($("#modalCoop").is(":visible")) ? $("#menuCoop").outerWidth() : $("#menuApp.menuLeft").outerWidth();
		$(".main-container.vertical .portfolio-modal.modal").css("left",leftPosModal);
		mylog.log( "scopeObj dyFInputs", dyFInputs );
	  	dyFInputs.init();
	  	afterLoad = ( notNull(afterLoad) ) ? afterLoad : null;
	  	data = ( notNull(data) ) ? data : {}; 
	  	dyFObj.buildDynForm( afterLoad, data,dyFObj[dyFObj.activeElem],dyFObj.activeModal+" #ajaxFormModal");
	},
	buildDynForm : function (afterLoad,data,obj,formId) { 
		mylog.warn("--------------- buildDynForm", dyFObj[dyFObj.activeElem], afterLoad,data);
		if(userId)
		{ 
			var form = $.dynForm({
			    formId : formId,
			    formObj : dyFObj[dyFObj.activeElem].dynForm,
			    formValues : data,
			    beforeBuild : function  () {
			      	if( jsonHelper.notNull( "dyFObj."+dyFObj.activeElem+".dynForm.jsonSchema.beforeBuild","function") ){
						dyFObj[dyFObj.activeElem].dynForm.jsonSchema.beforeBuild();
					}

			      	if(typeof dyFObj[dyFObj.activeElem].dynFormCostum != "undefined" && typeof dyFObj[dyFObj.activeElem].dynFormCostum.beforeBuild != "undefined"){
						dyFCustom.beforeBuild(dyFObj[dyFObj.activeElem].dynFormCostum.beforeBuild);
					}
					
				},
			    afterBuild : function  () {
			      	if( jsonHelper.notNull( "dyFObj."+dyFObj.activeElem+".dynForm.jsonSchema.afterBuild","function") )
						dyFObj[dyFObj.activeElem].dynForm.jsonSchema.afterBuild(data);
			    },
			    onLoad : function  () {

			      	if( jsonHelper.notNull("themeObj.dynForm.onLoadPanel","function") ){
			      		themeObj.dynForm.onLoadPanel(dyFObj[dyFObj.activeElem]);
			      	} else {
				        $("#ajax-modal-modal-title").html("<i class='fa fa-"+dyFObj[dyFObj.activeElem].dynForm.jsonSchema.icon+"'></i> "+dyFObj[dyFObj.activeElem].dynForm.jsonSchema.title);
				        //alert(afterLoad+"|"+typeof dyFObj[dyFObj.activeElem].dynForm.jsonSchema.onLoads[afterLoad]);
			    	}

			        //incase we need a second global post process
			        if( jsonHelper.notNull( "dyFObj."+dyFObj.activeElem+".dynForm.jsonSchema.onLoads.onload", "function") )
			        	dyFObj[dyFObj.activeElem].dynForm.jsonSchema.onLoads.onload(data);

			        
			        if( jsonHelper.notNull( "dyFObj."+dyFObj.activeElem+".dynForm.jsonSchema.onLoads."+afterLoad, "function") )
			        	dyFObj[dyFObj.activeElem].dynForm.jsonSchema.onLoads[afterLoad](data);
				    
				    if(Object.keys(dyFObj.initFieldOnload).length > 0){
				    	$.each(dyFObj.initFieldOnload, function(k, v){
				    		v();
				    	});
				    }

				    colorHeader= (typeof dyFObj[dyFObj.activeElem].color != "undefined") ? dyFObj[dyFObj.activeElem].color : "dark"; 
				    dyFInputs.setHeader("bg-"+colorHeader);
				    if(typeof dyFObj[dyFObj.activeElem].dynFormCostum != "undefined")
				    	dyFCustom.init(dyFObj[dyFObj.activeElem].dynFormCostum);
				   	if(typeof dyFObj.init.uploader != "undefined" && Object.keys(dyFObj.init.uploader).length>0){
					   	$.each(dyFObj.init.uploader, function(e, v){
							endPoint=uploadObj.get(uploadObj.type, uploadObj.id, v.docType);
							$("#"+e).fineUploader('setEndpoint', endPoint);
						});
				   	}
				    if( typeof coInterface.bindLBHLinks != "undefined")
			        	coInterface.bindLBHLinks();
			    },
			    onSave : function()
			    {

			      	mylog.log("onSave");
		
			      	if( typeof dyFObj[dyFObj.activeElem].dynForm.jsonSchema.beforeSave == "function")
			        	dyFObj[dyFObj.activeElem].dynForm.jsonSchema.beforeSave();
			        uploadObj.afterLoadUploader=true;
			        var afterSave = ( typeof dyFObj[dyFObj.activeElem].dynForm.jsonSchema.afterSave == "function") ? dyFObj[dyFObj.activeElem].dynForm.jsonSchema.afterSave : null;
			        mylog.log("onSave ", dyFObj.activeElem, dyFObj[dyFObj.activeElem].saveUrl, dyFObj[dyFObj.activeElem].save);
			        if( dyFObj[dyFObj.activeElem].save )
			        	dyFObj[dyFObj.activeElem].save(dyFObj.activeModal+" #ajaxFormModal");
			        if( dyFObj[dyFObj.activeElem].dynForm.jsonSchema.save )
			        	dyFObj[dyFObj.activeElem].dynForm.jsonSchema.save(); //use this for subDynForms
			        else if( dyFObj[dyFObj.activeElem].saveUrl )
			        	dyFObj.saveElement( "#ajaxFormModal", dyFObj[dyFObj.activeElem].col, dyFObj[dyFObj.activeElem].cIdtrl, dyFObj[dyFObj.activeElem].saveUrl, afterSave );
			        else
			        	dyFObj.saveElement( "#ajaxFormModal", dyFObj[dyFObj.activeElem].col, dyFObj[dyFObj.activeElem].ctrl, null, afterSave );
			        return false;
			    }
			});
			mylog.dir(form);
		} else {
			toastr.error("Vous devez être connecté pour afficher les formulaires de création");
			$('#modalLogin').modal("show");
		}
	},
	commonAfterSave : function(data, callB){
		mylog.log("commonAfterSave", data);
		totalUploader=0;
		$(".fine-uploader-manual-trigger").each(function(){
			if($(this).parent().is(":visible"))
				totalUploader++;
		});
		if(totalUploader>1){
			mylog.log("commonAfterSave fine-uploader-manual-trigger");
			uploadObj.startAfterLoadUploader=false;
			uploadCount=$(".fine-uploader-manual-trigger").length;
			i=1;
			insideCallBMulti=false;
			$(".fine-uploader-manual-trigger").each(function(){
				if(i==uploadCount)
					uploadObj.startAfterLoadUploader=true;
				listObject=$(this).fineUploader('getUploads');
		    	goToUpload=false;
		    	if(listObject.length > 0){
		    		$.each(listObject, function(e,v){
		    			if(v.status == "submitted")
		    				goToUpload=true;
		    		});
		    	}
				if( goToUpload ){
					insideCallBMulti=true;
		    		$(this).fineUploader('uploadStoredFiles');
			    	//principalement pour les surveys
			    	if(typeof callB == "function")
		    			callB();
		    	}
		    	i++;
			});
			if(!insideCallBMulti){
				if(activeModuleId == "survey")//use case for answerList forms updating
	        		window.location.reload();
	        	else if(notNull(uploadObj.gotoUrl))
					urlCtrl.loadByHash( uploadObj.gotoUrl );
				else
					urlCtrl.loadByHash( location.hash );
			}
		}else{
			mylog.log("commonAfterSave else");
			uploadObj.startAfterLoadUploader=true;
			listObject=$(uploadObj.domTarget).fineUploader('getUploads');
	    	goToUpload=false;
	    	if(listObject.length > 0){
	    		$.each(listObject, function(e,v){
	    			if(v.status == "submitted")
	    				goToUpload=true;
	    		});
	    	}
			if( goToUpload ){
	    		$(uploadObj.domTarget).fineUploader('uploadStoredFiles');
		    	//principalement pour les surveys
		    	if(typeof callB == "function"){
		    		callB();
		    	}
	    	}
		    else { 
		    	mylog.log("commonAfterSave isMapEnd", isMapEnd, uploadObj.gotoUrl);
		    	if(typeof networkJson != "undefined")
					isMapEnd = true;

				if(activeModuleId == "survey")//use case for answerList forms updating
	        		window.location.reload();
	        	/*
				check it with @bouboule
	        	else if(notNull(uploadObj.gotoUrl))
					urlCtrl.loadByHash( uploadObj.gotoUrl );*/
				else
					urlCtrl.loadByHash( location.hash );
	        }
	    }
	    dyFObj.closeForm();
	    mylog.log("commonAfterSave end", dyFObj);
	},
	coopAfterSave : function(data){
		dyFObj.closeForm(); 
       	var oldCount = $("li.sub-proposals a.load-coop-data[data-status='"+data.map.status+"'] .badge").html();
       	$("li.sub-proposals a.load-coop-data[data-status='"+data.map.status+"'] .badge").html(parseInt(oldCount)+1);
       	if(typeof data.map.idParentRoom != "undefined"){
           	uiCoop.getCoopData(contextData.type, contextData.id, "room", null, data.map.idParentRoom);
            setTimeout(function(){
            	uiCoop.getCoopData(contextData.type, contextData.id, "proposal", null, data.id);
            }, 1000);
        } else {
        	uiCoop.getCoopData(contextData.type, contextData.id, "room", null, currentRoomId);
            setTimeout(function(){
            	uiCoop.getCoopData(contextData.type, contextData.id, "proposal", null, idParentProposal);
            }, 1000);
        }
	},
	//generate Id for upload feature of this element 
	setMongoId : function(type,callback) { 
		//alert("setMongoId"+type);
		uploadObj.type = type;
		mylog.warn("uploadObj ",uploadObj);
		if(  !$("#ajaxFormModal #id").val() && !uploadObj.update )
		{
			getAjax( null , baseUrl+"/api/tool/get/what/mongoId" , function(data){
				if(typeof dyFObj.init.uploader != "undefined" && Object.keys(dyFObj.init.uploader).length>0){
					$.each(dyFObj.init.uploader, function(e, v){
						endPoint=uploadObj.get(type,data.id, v.docType);
						$("#"+e).fineUploader('setEndpoint', endPoint);
					});
				}				
				uploadObj.set(type,data.id);
				$("#ajaxFormModal #id").val(data.id);
				if( typeof callback === "function" )
                	callback();
			});
		}
	},
	canUserEdit : function ( ) {
		var res = false;
		if( userId && userConnected && userConnected.links && contextData ){
			if(contextData.type == "organizations" 
				&& typeof userConnected.links.memberOf[contextData.id] != "undefined" 
				&& userConnected.links.memberOf[contextData.id].isAdmin )
				res = true;
			if(contextData.type == "events" 
				&& typeof userConnected.links.events[contextData.id] != "undefined"
				&& userConnected.links.events[contextData.id].isAdmin )
				res = true;
			if(contextData.type == "projects" 
				&& typeof userConnected.links.projects[contextData.id] != "undefined"
				&& userConnected.links.projects[contextData.id].isAdmin )
				res = true;
		}
		return res;
	},
	/* **************************************
	*	building an array of answer based on table template
	***************************************** */
	drawAnswers : function (el,type,before,after) {
		//alert("drawAnswers");
		//list is filled in the page 
	    var data = dyFObj.elementData;
	    var prop = dyFObj[dyFObj.activeElem].dynForm.jsonSchema.properties;
	    console.log("drawAnswers data",data);
	    console.log("drawAnswers prop",prop);
	    str = '<table class="table table-striped table-bordered table-hover">'+
	        '<thead><tr>';
	    
	    /* ********************************
	    Build TH title for the array
	    ********************************** */
	    if(before){
	    	$.each(  before,function(ai,av) { 
		        str += '<th>'+ai+'</th>';
		    });
	    }
	    str += '<th>Date</th>';
	    var keys = Object.keys( data );
	    //find first Element containing an answer
	    var firstIx = 0; 
	    $.each(  data,function(ai,av) { 
	    	if( data [ keys[firstIx] ] && data [ keys[firstIx] ].answer )
	    		return;
	    	else 
	    		firstIx++;
	    });
	    
	    if( data [ keys[firstIx] ] && data [ keys[firstIx] ].answer ){
    		$.each(  data [ keys[firstIx] ].answer,function(ai,av) { 
		        str += '<th>'+((prop[ai] && prop[ai].placeholder) ? prop[ai].placeholder : ai)+'</th>';
		    });
    	}
	    if(after){
	    	$.each( after,function(ai,av) { 
	    		lbl = ai;
	    		if( typeof av == "object" && av.lbl)
	    			lbl = av.lbl;
		        str += '<th>'+lbl+'</th>';
		    });
	    }
	        
	    str += '</tr></thead><tbody>';
	    
	    // ********************** END TH TITLES


	    /* ********************************
	    Filling every line of the array 
	    ********************************** */
	    //alert(Object.keys(data).length)
	    $.each( data ,function(i,v) { 
	        //LES REPONSE
	        if(v.answer){
		        console.log("v",v);
		        str += '<tr>';
		        if(before){
			    	$.each(  before,function(ai,av) { 
				        str += '<td>'+av+'</td>';
				    });
			    }

		        str += '<td>'+formatDate(new Date(v.created*1000))+'</td>';
		        
			        $.each(v.answer,function(ai,av) { 
			        	console.log(prop[ai].options);
			        	//alert(ai+av);
			            ansV = av;
			            console.log( ai, prop[ai] );

		            	if( prop[ai] && 
			            	prop[ai].inputType == "select" && 
			            	prop[ai].options[av] )
			                ansV = prop[ai].options[av];

			            str += "<td>"+ansV+"</td>";
			        });
			    
			    /* ********************************
			    ADD tools to each line
			    ********************************** */
		        if(after)
		        {
			    	$.each(  after,function(ai,av) 
			    	{ 
			    		if( typeof av == "object" ){
			    			pre = "";
			    			if(av.pre){
			    				if(av.pre.value) {
				    				if( v[av.pre.value] )
				    					pre = "<span class='"+( (av.pre.class) ? av.pre.class : "" )+"'>"+v[av.pre.value]+"</span> ";
				    			}
			    			}

			    			if(av.btn){
			    				lbl = av.btn;
			    				if(av.test && v[av.test]){
			    					lbl = "";
			    					if(av.else)
			    						lbl = av.else;
			    				}
			    				str += '<td class="text-center" data-id="'+i+'" data-type="'+type+'">'+pre+lbl+'</td>';
			    			} else if(av.value){
			    				lbl = "";
			    				if( v[av.value] )
			    					lbl = "<span class='"+( (av.class) ? av.class : "" )+"'>"+v[av.value]+"</span>";
			    				str += '<td class="text-center">'+pre+lbl+'</td>';
			    			}
			    		}
			    		else
				        	str += '<td class="text-center">'+av+'</td>';
				    });
			     }

		        str += "</tr>";
		    }
	    });
	    str += "</tbody></table></div>";
	    $(el).append(str);
	},
	/* **************************************
	*	each input field type has a corresponding HTMl to build
	***************************************** */
	buildInputField : function (id, field, fieldObj,formValues, tooltip){
		mylog.warn("------------------ buildInputField",id, field, fieldObj,formValues, tooltip);
		mylog.log("------------------ buildInputField !",id, field, fieldObj,formValues, tooltip);
		var fieldHTML = '<div class="form-group '+field+fieldObj.inputType+'">';
		var required = "";
		if(fieldObj.rules && fieldObj.rules.required)
			required = "*";

		tooltip = (tooltip) ? '<i class=" fa fa-question-circle pull-right tooltips text-red" data-toggle="tooltip" data-placement="top" title="'+tooltip+'"></i>' : '';
		if(fieldObj.label)
			fieldHTML += '<label class="col-xs-12 text-left control-label no-padding" for="'+field+'">'+
			              '<i class="fa fa-chevron-down"></i> ' +  fieldObj.label+required+tooltip+
			            '</label>';

        var iconOpen = (fieldObj.icon) ? '<span class="input-icon">'   : '';
        var iconClose = (fieldObj.icon) ? '<i class="'+fieldObj.icon+'"></i> </span>' : '';
        var placeholder = (fieldObj.placeholder) ? fieldObj.placeholder+required : '';
        var placeholder2 = (fieldObj.placeholder2) ? fieldObj.placeholder2 : '';
        var fieldClass = (fieldObj.class) ? fieldObj.class : '';
        var initField = '';
        var value = "";
        var style = "";
        var mainTag = null;
        if( fieldObj.value ) 
        	value = fieldObj.value;
        else if (formValues && formValues[field]) {
        	value = formValues[field];
        }else if(formValues && field=="public" && typeof formValues[field] != "undefined"){
			value = formValues[field];
        }
        //mylog.log("value network", value);
        if(value!="")
        	mylog.warn("--------------- dynform form Values",field,value);

        /* **************************************
		* 
		***************************************** */
        if( field.indexOf("separator")>=0 ) {
        	if(fieldClass == '' ) 
        		fieldClass = "panel-blue";
        	fieldHTML += '<div class="text-large text-bold '+fieldClass+' text-white center padding-10 ">'+iconOpen+iconClose+fieldObj.title+'</div>';
        }
        
        /* **************************************
		* STANDARD TEXT INPUT
		***************************************** */
        else if( !fieldObj.inputType || 
        		  fieldObj.inputType == "text" || 
        		  fieldObj.inputType == "numeric" || 
        		  fieldObj.inputType == "tags" || 
        		  fieldObj.inputType == "tags" ) {
        	mylog.log("build field "+field+">>>>>> text, numeric, tags, tags", fieldObj);

        	if(fieldObj.inputType == "tags"){
        		fieldClass += " select2TagsInput";
        		mylog.log("text, numeric, tags, tags HERE", fieldObj);
        		if(	typeof fieldObj.tagsList != "undefined" &&
        			typeof fieldObj.tagsList != null && 
        			typeof costum != "undefined" &&
        			typeof costum != null && 
        			typeof costum[fieldObj.tagsList] != "undefined"){
        			fieldObj.values = costum[fieldObj.tagsList];
        			fieldObj.data = costum[fieldObj.tagsList];
        			mylog.log("text, numeric, tags, tags HERE", fieldObj);
        		}

        		if(fieldObj.values){
        			if(!dyFObj.init.initValues[field])
        				dyFObj.init.initValues[field] = {};
        			dyFObj.init.initValues[field]["tags"] = fieldObj.values;
        		}
        		mylog.log("build field "+field+">>>>>> text, numeric, tags, tags", fieldObj);

        		if(fieldObj.maximumSelectionLength)
        			dyFObj.init.initValues[field]["maximumSelectionLength"] =  fieldObj.maximumSelectionLength;
        		
        		mylog.log("select2TagsInput fieldObj.minimumInputLength", fieldObj.minimumInputLength);
        		if(typeof fieldObj.minimumInputLength != "undefined" && typeof fieldObj.minimumInputLength == "number"){
        			if(!dyFObj.init.initValues[field])
        				dyFObj.init.initValues[field] = {};
        			dyFObj.init.initValues[field]["minimumInputLength"] = fieldObj.minimumInputLength;
        			mylog.log("select2TagsInput fieldObj dyFObj.init.initValues[field]", dyFObj.init.initValues[field]);
        		}



     
        		//TODO RApha bien géré les tags via network et costum 
        		// if(typeof fieldObj.data != "undefined"){

        		// 	delete fieldObj.data;
        		// 	//value = fieldObj.data;
	        	// }

        		if(typeof fieldObj.mainTag != "undefined")
					mainTag=fieldObj.mainTag;
        		style = "style='width:100%;margin-bottom: 10px;border: 1px solid #ccc;'";
        		mylog.log("select2TagsInput field",field, value );
        	}

        	
        	//var label = '<label class="pull-left"><i class="fa fa-circle"></i> '+placeholder+'</label><br>';
        	fieldHTML += iconOpen+' <input type="text" class="form-control '+fieldClass+'" name="'+field+'" id="'+field+'" value="'+value+'" placeholder="'+placeholder+'" '+style+'/>'+iconClose;
        
        	if(fieldObj.inputType == "price"){       		
        		fieldHTML += '<select class="'+fieldClass+'" name="devise" id="devise" style="">';
				fieldHTML += 	'<option class="bold" value="€">euro €</option>';
				fieldHTML += 	'<option class="bold" value="G1">G1</option>';
				fieldHTML += 	'<option class="bold" value="$">dollars $</option>';
				fieldHTML += 	'<option class="bold" value="CFP">CFP</option>';
				fieldHTML += '</select>';
        	}
        } else if( fieldObj.inputType == "tags2" ) {
        	mylog.log("build field "+field+">>>>>> tags2", fieldObj);
        	alert("HERE");
        		fieldClass += " select2Tags2";
        		if(fieldObj.values){
        			if(!dyFObj.init.initValues[field])
        				dyFObj.init.initValues[field] = {};
        			dyFObj.init.initValues[field]["tags"] = fieldObj.values;
        		}

        		if(fieldObj.maximumSelectionLength)
        			dyFObj.init.initValues[field]["maximumSelectionLength"] =  fieldObj.maximumSelectionLength;
        		mylog.log("select2TagsInput fieldObj.minimumInputLength", fieldObj.minimumInputLength);
        		if(typeof fieldObj.minimumInputLength != "undefined" && typeof fieldObj.minimumInputLength == "number"){
        			if(!dyFObj.init.initValues[field])
        				dyFObj.init.initValues[field] = {};
        			dyFObj.init.initValues[field]["minimumInputLength"] = fieldObj.minimumInputLength;
        			mylog.log("select2TagsInput fieldObj dyFObj.init.initValues[field]", dyFObj.init.initValues[field]);
        		}

        		if(typeof fieldObj.mainTag != "undefined")
					mainTag=fieldObj.mainTag;
        		style = "style='width:100%;margin-bottom: 10px;border: 1px solid #ccc;'";
        		mylog.log("select2TagsInput field",field, value );
        	
        	
        	fieldHTML += '<select name="'+field+'" id="'+field+'" class="form-control select2Tags2" multiple="multiple">';
        	$.each(fieldObj.values, function(kT,vT){
        		mylog.log("tags2 values ",kT,vT);
				fieldHTML += '<option>'+vT+'</option>';
			});
        	fieldHTML += '</select>';

        }
        
        /* **************************************
		* HIDDEN
		***************************************** */
		else if( fieldObj.inputType == "hidden" || fieldObj.inputType == "timestamp" ) {
			if ( fieldObj.inputType == "timestamp" )
				value = Date.now();
			mylog.log("build field "+field+">>>>>> hidden, timestamp", value);
			fieldHTML += '<input type="hidden" name="'+field+'" id="'+field+'" value="'+value+'"/>';
		}
		/* **************************************
		* TEXTAREA
		***************************************** */
		else if ( fieldObj.inputType == "textarea" || fieldObj.inputType == "wysiwyg" ){
			mylog.log("build field "+field+">>>>>> textarea, wysiwyg", fieldObj);
			if(fieldObj.inputType == "wysiwyg")
				fieldClass += " wysiwygInput";
			var maxlength = "";
			var minlength = 0;
			if(notNull(fieldObj.rules) && notNull(fieldObj.rules.maxlength) ){
				fieldClass += " maxlengthTextarea";
				maxlength = fieldObj.rules.maxlength;
				minlength = value.length ;
			}

        	mylog.log("build field "+field+">>>>>> textarea, wysiwyg");
        	fieldHTML += '<textarea id="'+field+'" maxlength="'+maxlength+'"  class="form-control textarea '+fieldClass+'" name="'+field+'" placeholder="'+placeholder+'">'+value+'</textarea>';
        	
        	if(maxlength > 0){
        		fieldHTML += '<span><span id="maxlength'+field+'" name="maxlength'+field+'">'+minlength+'</span> / '+maxlength+' '+trad["character(s)"]+' </span> ';
	        	initField = function(){
		    		mylog.log("textarea init");
		    		if($(".maxlengthTextarea").length){
		    			mylog.log("textarea init2");
		    			$(".maxlengthTextarea").off().keyup(function(){
							//var name = "#" + $(this).attr("id") ;
							var name = $(this).attr("id") ;
							mylog.log(".maxlengthTextarea", "#ajaxFormModal #"+name, $(this).attr("id"));
							mylog.log(".maxlengthTextarea", $("#ajaxFormModal #"+name).val().length, $(this).val().length);
							$("#ajaxFormModal #maxlength"+name).html($("#ajaxFormModal  #"+name).val().length);
						});
		    		}
		    		
		        };
			}
			if(typeof fieldObj.markdown != "undefined" && fieldObj.markdown){
				initField = function(){
					dataHelper.activateMarkdown("#ajaxFormModal #"+field);
				};
			}
		}else if ( fieldObj.inputType == "markdown"){ 
			mylog.log("build field "+field+">>>>>> textarea, markdown");
			fieldClass += " markdownInput";
			//fieldHTML +='<textarea id="'+field+'" name="'+field+'" class="form-control textarea '+fieldClass+'" placeholder="'+placeholder+'" data-provide="markdown" data-savable="true" rows="10"></textarea>';
			fieldHTML +='<textarea name="target-editor" id="'+field+'" data-provide="markdown" data-savable="true" class="form-control textarea '+fieldClass+'" placeholder="'+placeholder+'" rows="10"></textarea>';
		
		}
		/* **************************************
		* CHECKBOX SIMPLE
		***************************************** */
		else if ( fieldObj.inputType == "checkboxSimple" ) {
   			//if(value == "") value="25/01/2014";
   			mylog.log("fieldObj ???",fieldObj, ( fieldObj.checked == "true" ));
   			mylog.log("fieldObj simplecheck???",value);
   			
			var thisValue = ( fieldObj.checked == "true" ) ? "true" : "false";
			forced="";
			if(value!==""){
				thisValue = (!value || value=="false") ? "false" : "true";
				forced="data-checked='"+thisValue+"'";
			}
			mylog.log("fieldObj ??? thisValue", thisValue);
			//var onclick = ( fieldObj.onclick ) ? "onclick='"+fieldObj.onclick+"'" : "";
			//var switchData = ( fieldObj.switch ) ? "data-on-text='"+fieldObj.params.onText+"' data-off-text='"+fieldObj.params.offText+"' data-label-text='"+fieldObj.switch.labelText+"' " : "";
			mylog.log("build field "+field+">>>>>> checkbox");
			fieldHTML += '<input type="hidden" class="'+fieldClass+'" name="'+field+'" id="'+field+'" value="'+thisValue+'" '+forced+' /> ';
			fieldHTML += '<div class="col-lg-6 padding-5">'+
							'<a href="javascript:" class="btn-dyn-checkbox btn btn-sm bg-white letter-green col-xs-12" data-checkval="true">'+
								fieldObj.params.onText+
							'</a>'+
						 '</div>';
			fieldHTML += '<div class="col-lg-6 padding-5">'+
							'<a href="javascript:" class="btn-dyn-checkbox btn btn-sm bg-white letter-red col-xs-12" data-checkval="false" >'+
								fieldObj.params.offText+
							'</a>'+
						 '</div>';
			if(typeof fieldObj.init == "undefined"){
				initField = function(){
	    			var checked = (typeof fieldObj.checked != "undefined") ? fieldObj.checked : false;
		    		mylog.log("checkcheck2", checked, "#ajaxFormModal #"+field);
		    		var idTrue = "#ajaxFormModal ."+field+"checkboxSimple .btn-dyn-checkbox[data-checkval='true']";
		    		var idFalse = "#ajaxFormModal ."+field+"checkboxSimple .btn-dyn-checkbox[data-checkval='false']";
		    		if(typeof $("#ajaxFormModal #"+field).data("checked") != "undefined")
		    			checked=$("#ajaxFormModal #"+field).data("checked");//$("#ajaxFormModal #"+id).hasAttr("data-checked");
		    		$("#ajaxFormModal #"+field).val(checked);

		    		if(typeof fieldObj.params.labelInformation != "undefined")
		        		$("#ajaxFormModal ."+field+"checkboxSimple label").append(
		        				"<small class='col-md-12 col-xs-12 text-left no-padding' "+
										"style='font-weight: 200;'>"+
										fieldObj.params.labelInformation+
								"</small>");

		        	if(checked == "true" || checked){
		    			$(idTrue).addClass("bg-green-k").removeClass("letter-green");
		    			$("#ajaxFormModal ."+field+"checkboxSimple label").append(
		    					"<span class='lbl-status-check margin-left-10'>"+
		    						'<span class="letter-green"><i class="fa fa-check-circle"></i> '+fieldObj.params.onLabel+'</span>'+
		    					"</span>");

		    			setTimeout(function(){
	    			  		if(typeof fieldObj.inputTrue != "undefined") 
	    			  			$(fieldObj.inputTrue).hide(400);
	    			  	}, 1000);
		        	}
					else if(checked == "false" || !checked){ 
		    			$(idFalse).addClass("bg-red").removeClass("letter-red");
		    			$("#ajaxFormModal ."+field+"checkboxSimple label").append(
		    					"<span class='lbl-status-check margin-left-10'>"+
		    						'<span class="letter-red"><i class="fa fa-minus-circle"></i> '+fieldObj.params.offLabel+'</span>'+
		    					"</span>");

		    			setTimeout(function(){
	    			  		if(typeof fieldObj.inputId != "undefined") 
	    			  			$(fieldObj.inputId).hide(400);
	    			  	}, 1000);
		    		}
		    		

		    		$("#ajaxFormModal ."+field+"checkboxSimple .btn-dyn-checkbox").click(function(){
		    			var checkval = $(this).data('checkval');
		    			$("#ajaxFormModal #"+field).val(checkval);
		    			mylog.log("EVENT CLICK ON CHECKSIMPLE", checkval);
		    			
		    			if(checkval) {
		    				$(idTrue).addClass("bg-green-k").removeClass("letter-green");
		    			  	$(idFalse).removeClass("bg-red").addClass("letter-red");
		    			  	$("#ajaxFormModal ."+field+"checkboxSimple .lbl-status-check").html(
		    					'<span class="letter-green"><i class="fa fa-check-circle"></i> '+fieldObj.params.onLabel+'</span>');
		    			  	
		    			  	if(typeof fieldObj.inputId != "undefined") $(fieldObj.inputId).show(400);

		    			  	if(typeof fieldObj.inputTrue != "undefined") $(fieldObj.inputTrue).hide(400);
		    			}
		    			else{
		    			  	$(idFalse).addClass("bg-red").removeClass("letter-red");
		    				$(idTrue).removeClass("bg-green-k").addClass("letter-green");
		    				$("#ajaxFormModal ."+field+"checkboxSimple .lbl-status-check").html(
		    					'<span class="letter-red"><i class="fa fa-minus-circle"></i> '+fieldObj.params.offLabel+'</span>');

		    				if(typeof fieldObj.inputId != "undefined") $(fieldObj.inputId).hide(400);
		    				if(typeof fieldObj.inputTrue != "undefined") $(fieldObj.inputTrue).show(400);
		    			}
		    		});

					//var checked = ( fieldObj.checked ) ? "checked" : "";
					//if(checked) 
					//if( fieldObj.switch )
						//dyFObj.init.initbootstrapSwitch('#'+field, (fieldObj.switch.onChange) ? fieldObj.switch.onChange : null );
				};
			}
		}

		/* **************************************
		* CHECKBOX
		***************************************** */
        else if ( fieldObj.inputType == "checkbox" ) {
   			if(value == "") value="25/01/2014";
			var checked = ( fieldObj.checked ) ? "checked" : "";
			var onclick = ( fieldObj.onclick ) ? "onclick='"+fieldObj.onclick+"'" : "";
			var switchData = ( fieldObj.switch ) ? "data-on-text='"+fieldObj.switch.onText+"' data-off-text='"+fieldObj.switch.offText+"' data-label-text='"+fieldObj.switch.labelText+"' " : "";
			mylog.log("build field "+field+">>>>>> checkbox");
			fieldHTML += '<input type="checkbox" class="'+fieldClass+'" name="'+field+'" id="'+field+'" value="'+value+'" '+checked+' '+onclick+' '+switchData+'/> '+placeholder;
			if(typeof fieldObj.options != "undefined" && typeof fieldObj.options.allWeek != "undefined"){
				fieldHTML+=dyFObj.init.buildOpeningHours(value);
			}
			initField = function(){
				if( fieldObj.switch )
					dyFObj.init.initbootstrapSwitch('#'+field, (fieldObj.switch.onChange) ? fieldObj.switch.onChange : null, (fieldObj.switch.css) ? fieldObj.switch.css : null );
				if(typeof fieldObj.options != "undefined" && typeof fieldObj.options.allWeek != "undefined"){
					//loadTimePicker(null);
					dyFObj.init.bindTimePicker();
					if(notNull(value) && typeof value == "object"){
						$.each(value, function(e,v){
							if(typeof v == "object" && notNull(v.hours) ){
								$.each(v.hours, function(ehour,vhour){
									dyFObj.init.bindTimePicker(v.dayOfWeek, ehour, vhour);
								});
							}
						});
					}
					dyFObj.init.initRangeHours();
					
				}
				//if( fieldObj.subSwitch )
				//	dyFObj.init.initbootstrapSwitch(fieldObj.subSwitch.domHtml, (fieldObj.subSwitch.onChange) ? fieldObj.subSwitch.onChange : null );
			};
		}

		/* **************************************
		* RADIO
		***************************************** */
		else if ( fieldObj.inputType == "radio" ) {
   			
	       	mylog.log("build field "+field+">>>>>> radio");
	       	
	       	fieldHTML += '<div class="btn-group" data-toggle="buttons">';
	       	value = ( (typeof fieldObj.value != "undefined") ? fieldObj.value : value ) ;
	       	if(fieldObj.options)
	       		fieldHTML += buildRadioOptions(fieldObj.options,value, field) ;
	       	fieldHTML += '</div>';
       	}


        /* **************************************
		* SELECT , we use select2
		***************************************** */
        else if ( fieldObj.inputType == "select" || fieldObj.inputType == "selectMultiple" ) 
        {
       		var multiple = (fieldObj.inputType == "selectMultiple") ? 'multiple="multiple"' : '';
       		mylog.log("build field "+field+">>>>>> select selectMultiple");
       		var isSelect2 = (fieldObj.isSelect2) ? "select2Input" : "";
       		fieldHTML += '<select class="'+isSelect2+' '+fieldClass+'" '+multiple+' name="'+field+'" id="'+field+'" style="width: 100%;height:30px;" data-placeholder="'+placeholder+'">';
			if(placeholder)
				fieldHTML += '<option class="text-red" style="font-weight:bold" disabled selected>'+placeholder+'</option>';
			else
				fieldHTML += '<option></option>';

			var selected = "";
			mylog.log("fieldObj select", fieldObj);
			//initialize values
			if(fieldObj.options)
				fieldHTML += buildSelectOptions(fieldObj.options, ((typeof fieldObj.value != "undefined")?fieldObj.value:value));

			if( fieldObj.groupOptions )
				fieldHTML += buildSelectGroupOptions(fieldObj.groupOptions, ((typeof fieldObj.value != "undefined")?fieldObj.value:value));
			
			fieldHTML += '</select>';
        } 
        else if ( fieldObj.inputType == "uploader" ) {
        	if(placeholder == "")
        		placeholder="add Image";
        	mylog.log("build field "+field+">>>>>> uploader" );
        	var uploaderId=(fieldObj.domElement) ? fieldObj.domElement : "imageElement"; 
        	fieldHTML += '<div class=" col-xs-12 '+fieldClass+' fine-uploader-manual-trigger"  id="'+uploaderId+'" data-type="citoyens" data-id="'+userId+'"></div>';
        	
        	if(fieldObj.docType=="image")
				fieldHTML += 	'<script type="text/template" id="qq-template-gallery">';
			else
				fieldHTML += 	'<script type="text/template" id="qq-template-manual-trigger">';

			fieldHTML += 	'<div class="qq-uploader-selector qq-uploader';
			if(fieldObj.docType=="image")
				fieldHTML +=		' qq-gallery';

			fieldHTML +=		'" qq-drop-area-text="'+tradDynForm.dropfileshere+'">'+
							'<div class="qq-total-progress-bar-container-selector qq-total-progress-bar-container">'+
							'<div role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" class="qq-total-progress-bar-selector qq-progress-bar qq-total-progress-bar"></div>'+
							'</div>'+
							//'<div class="qq-paste-element-triger"><input type="text" value="" placeholder="paste a link"/></div>'+
							'<div class="qq-upload-drop-area-selector qq-upload-drop-area" qq-hide-dropzone>'+
							'<span class="qq-upload-drop-area-text-selector"></span>'+
							'</div>'+
							'<div class="qq-upload-button-selector btn btn-primary">'+
							'<div>'+tradDynForm["add"+fieldObj.docType]+'</div>'+
							'</div>'+
							'<button type="button" id="trigger-upload" class="btn btn-danger hide">'+
			                '<i class="icon-upload icon-white"></i> '+tradDynForm.save+
			                '</button>'+
							'<span class="qq-drop-processing-selector qq-drop-processing">'+
							'<span>En cours de progression...</span>'+
							'<span class="qq-drop-processing-spinner-selector qq-drop-processing-spinner"></span>'+
							'</span>';
			if(fieldObj.docType=="image"){
				fieldHTML += 	'<ul class="qq-upload-list-selector qq-upload-list" role="region" aria-live="polite" aria-relevant="additions removals">'+
								'<li>'+
								'<span role="status" class="qq-upload-status-text-selector qq-upload-status-text"></span>'+
								'<div class="qq-progress-bar-container-selector qq-progress-bar-container">'+
								'<div role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" class="qq-progress-bar-selector qq-progress-bar"></div>'+
								'</div>'+
								'<span class="qq-upload-spinner-selector qq-upload-spinner"></span>'+
								'<div class="qq-thumbnail-wrapper">'+
								'<img class="qq-thumbnail-selector" qq-max-size="120" qq-server-scale>'+
								'</div>'+
								'<button type="button" class="qq-upload-cancel-selector qq-upload-cancel">X</button>'+
								'<button type="button" class="qq-upload-retry-selector qq-upload-retry">'+
								'<span class="qq-btn qq-retry-icon" aria-label="Retry"></span>'+
								'Retry'+
								'</button>'+
								''+
								'<div class="qq-file-info">'+
								'<div class="qq-file-name">'+
								'<span class="qq-upload-file-selector qq-upload-file"></span>'+
								//'<span class="qq-edit-filename-icon-selector qq-edit-filename-icon" aria-label="Edit filename"></span>'+
								'</div>'+
								'<input class="qq-edit-filename-selector qq-edit-filename" tabindex="0" type="text">'+
								'<span class="qq-upload-size-selector qq-upload-size"></span>'+
								'<button type="button" class="qq-btn qq-upload-delete-selector qq-upload-delete">'+
								'<span class="qq-btn qq-delete-icon" aria-label="Delete"></span>'+
								'</button>'+
								'<button type="button" class="qq-btn qq-upload-pause-selector qq-upload-pause">'+
								'<span class="qq-btn qq-pause-icon" aria-label="Pause"></span>'+
								'</button>'+
								'<button type="button" class="qq-btn qq-upload-continue-selector qq-upload-continue">'+
								'<span class="qq-btn qq-continue-icon" aria-label="Continue"></span>'+
								'</button>'+
								'</div>'+
								'</li>'+
								'</ul>';
			}else{
				fieldHTML += '<ul class="qq-upload-list-selector qq-upload-list" aria-live="polite" aria-relevant="additions removals">'+
					                '<li>'+
					                    '<div class="qq-progress-bar-container-selector">'+
					                        '<div role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" class="qq-progress-bar-selector qq-progress-bar"></div>'+
					                    '</div>'+
					                    '<span class="qq-upload-spinner-selector qq-upload-spinner"></span>'+
					                    '<img class="qq-thumbnail-selector" qq-max-size="100" qq-server-scale>'+
					                    '<span class="qq-upload-file-selector qq-upload-file"></span>'+
					                    //'<span class="qq-edit-filename-icon-selector qq-edit-filename-icon" aria-label="Edit filename"></span>'+
					                    '<input class="qq-edit-filename-selector qq-edit-filename" tabindex="0" type="text">'+
					                    '<span class="qq-upload-size-selector qq-upload-size"></span>'+
					                    '<button type="button" class="qq-btn qq-upload-cancel-selector qq-upload-cancel">Cancel</button>'+
					                    '<button type="button" class="qq-btn qq-upload-retry-selector qq-upload-retry">Retry</button>'+
					                    '<button type="button" class="qq-btn qq-upload-delete-selector qq-upload-delete">Delete</button>'+
					                    '<span role="status" class="qq-upload-status-text-selector qq-upload-status-text"></span>'+
					                '</li>'+
					            '</ul>';
			}
			fieldHTML += ''+
							'<dialog class="qq-alert-dialog-selector">'+
							'<div class="qq-dialog-message-selector"></div>'+
							'<div class="qq-dialog-buttons">'+
							'<button type="button" class="qq-cancel-button-selector">Close</button>'+
							'</div>'+
							'</dialog>'+
							''+
							'<dialog class="qq-confirm-dialog-selector">'+
							'<div class="qq-dialog-message-selector"></div>'+
							'<div class="qq-dialog-buttons">'+
							'<button type="button" class="qq-cancel-button-selector">No</button>'+
							'<button type="button" class="qq-ok-button-selector">Yes</button>'+
							'</div>'+
							'</dialog>'+
							''+
							'<dialog class="qq-prompt-dialog-selector">'+
							'<div class="qq-dialog-message-selector"></div>'+
							'<input type="text">'+
							'<div class="qq-dialog-buttons">'+
							'<button type="button" class="qq-cancel-button-selector">Cancel</button>'+
							'<button type="button" class="qq-ok-button-selector">Ok</button>'+
							'</div>'+
							'</dialog>'+
							'</div>'+
							'</script>';
			if(typeof dyFObj.init.uploader == "undefined") dyFObj.init.uploader=new Object;
			uploadObject=new Object; 
			if( fieldObj.showUploadBtn )
        		uploadObject.showUploadBtn = fieldObj.showUploadBtn;
        	if( fieldObj.filetypes )
        		uploadObject.filetypes = fieldObj.filetypes;
        	if( fieldObj.template )
        		uploadObject.template = fieldObj.template;
			if( fieldObj.itemLimit )
        		uploadObject.itemLimit = fieldObj.itemLimit;
		

			uploadObject.docType=(fieldObj.docType) ? fieldObj.docType : "image"; 

			if(fieldObj.endPoint){
				uploadObject.endPoint=uploadObj.get(uploadObj.type, uploadObj.id, fieldObj.docType, null, null, fieldObj.endPoint);
			}
			if(typeof dySObj == "undefined" && $.isFunction( fieldObj.afterUploadComplete ))
        		uploadObject.afterUploadComplete = fieldObj.afterUploadComplete;
        	else if(typeof dySObj != "undefined" && Object.keys(dySObj.surveys).length != 0 && typeof fieldObj.afterUploadComplete == "string"){
        		uploadObject.afterUploadComplete = function(){
        			urlRedirect=baseUrl+fieldObj.afterUploadComplete;
        			if(typeof formSession !=  "undefined" && formSession != "" && formSession != null )
        				urlRedirect+="/session/"+formSession;
        			if(typeof answerId != "undefined" && answerId!=""){
        				urlRedirect+="/answer/"+answerId;
        			}
        			window.location=urlRedirect;
        		};
        	}else if(typeof updateForm != "undefined"){
        		uploadObject.afterUploadComplete = function(){
        			window.location.reload();
        		};
        	}

        	if(typeof uploadObj.initList != "undefined" && typeof uploadObj.initList[uploadObject.docType] != "undefined" && Object.keys(uploadObj.initList[uploadObject.docType]).length > 0){
        		uploadObject.initList=uploadObj.prepareInit(uploadObj.initList[uploadObject.docType]);
        	} 
        	dyFObj.init.uploader[uploaderId]=new Object;
        	dyFObj.init.uploader[uploaderId]=uploadObject;
        }
         /* **************************************
		* Folder INPUT
		***************************************** */
        else if ( fieldObj.inputType == "folder" ) {
        	dataField="data-type='"+fieldObj.contextType+"' data-id='"+fieldObj.contextId+"' data-doctype='"+fieldObj.docType+"' data-contentkey='"+fieldObj.contentKey+"'";
        	fieldHTML += iconOpen+'<button class="form-control col-xs-6 selectFolder btn-success" '+dataField+'>'+trad.choose+'</button><span class="nameFolder-form">'+fieldObj.emptyMsg+'</span>';
        	dyFObj.initFieldOnload.folder = function(){
        		   init={docType:fieldObj.docType}; 
        		if(typeof folderId != "undefined" && folderId != "" && navInFolders[folderId].docType == fieldObj.docType){
					dyFObj.init.folderUploadEvent(fieldObj.contextType, fieldObj.contextId, fieldObj.docType, fieldObj.contentKey, folderId);
					init.folderId=folderId;
				}
                $(".selectFolder").click(function(e){
                	var $this=$(this);
                	e.preventDefault();
                	folder.showPanel("get", null, null, function(e){
		    			dyFObj.init.folderUploadEvent($this.data("type"), $this.data("id"), $this.data("doctype"), $this.data("contentkey"), e);
	    			}, init);
	    		});
            }
        }
         /* **************************************
		* Finder INPUT
		***************************************** */
        else if ( fieldObj.inputType == "finder" ) {
        	//finder.set();
        	mylog.log("build field finder", fieldObj);
        	labelStr=(typeof fieldObj.multiple != "undefined" && fieldObj.multiple) ? tradDynForm.addtothelist: tradDynForm.changetheelement;
        	initType=fieldObj.initType;
        	fieldHTML += '<div class="finder-'+field+'">'+
        					"<div class='col-xs-12'><span  class='col-xs-12 hidden text-red errorForm'></span></div>"+
        					'<input type="hidden" id="'+field+'" name="'+field+'"/>'+
        					'<button class="form-control col-xs-6 selectParent btn-success margin-bottom-10" data-id="'+field+'" data-types="'+initType.join(",")+'" data-multiple="'+fieldObj.multiple+'" data-open="'+fieldObj.openSearch+'">'+labelStr+'</button>'+
        					"<span class='error bg-warning' style='display:none'></span>"+
        					"<div class='form-list-finder'>"+
        					"</div>"+
        					//"</div>"+
        				"</div>";
        	if(typeof fieldObj.init == "undefined"){
        		mylog.log("build field finder", fieldObj);
        		var initFinderFunction=function(){
	        		update=(typeof fieldObj.update != "undefined") ? true : null;
	        		initValues=null;
	        		if(typeof fieldObj.values != "undefined" && notNull(fieldObj.values) && Object.keys(fieldObj.values).length > 0) 
	        			initValues=fieldObj.values;
	        		else if(typeof value != "undefined" && notNull(value) && Object.keys(value).length > 0) 
	        			initValues=value;

	        		var finderParams = {
	        			id : field,
	        			multiple : fieldObj.multiple,
	        			initType : fieldObj.initType,
	        			values : initValues,
	        			update : update,
	        			invite : fieldObj.invite,
	        			roles : fieldObj.roles,
	        			search : fieldObj.search,
	        			initElt : fieldObj.initElt
	        		};

	        		finder.init(finderParams);
	            }
	        	dyFObj.initFieldOnload[field+"Finder"]=initFinderFunction; 
        	}
        }
        /* **************************************
		* COLOR PICKER  , we use colorpicker.js
		***************************************** */
        else if ( fieldObj.inputType == "colorpicker" ) {
        	if(placeholder == "")
        		placeholder="#ff0066";
        	mylog.log("build field "+field+">>>>>> colorpicker");
        	fieldHTML += iconOpen+'<input id="'+field+'" type="text" class="form-control colorpickerInput '+fieldClass+'" name="'+field+'" id="'+field+'" value="'+value+'" placeholder="'+placeholder+'"/>'+iconClose;
        }

        /* **************************************
		* DATE INPUT , we use bootstrap-datepicker
		***************************************** */
        else if ( fieldObj.inputType == "date" ) {
        	if(placeholder == "")
        		placeholder="25/01/2014";
        	mylog.log("build field "+field+">>>>>> date");
        	if(value && (""+value).indexOf("/") < 0){
        		//timestamp use case 
        		value =moment(parseInt(value)*1000).format('DD/MM/YYYY');
        		//alert("switch:"+value);
        	}
        	fieldHTML += iconOpen+'<input type="text" autocomplete="off" class="form-control dateInput '+fieldClass+'" name="'+field+'" id="'+field+'" value="'+value+'" placeholder="'+placeholder+'"/>'+iconClose;
        }

        /* **************************************
		* DATE TIME INPUT , we use bootstrap-datetimepicker
		***************************************** */
        else if ( fieldObj.inputType == "datetime" ) {
        	if(placeholder == "")
        		placeholder="25/01/2014 08:30";
        	mylog.log("build field "+field+">>>>>> datetime");
        	fieldHTML += iconOpen+'<input type="text" autocomplete="off" class="form-control dateTimeInput '+fieldClass+'" name="'+field+'" id="'+field+'" value="'+value+'" placeholder="'+placeholder+'"/>'+iconClose;
        }
        /* **************************************
		* DATE RANGE INPUT 
		***************************************** */
        else if ( fieldObj.inputType == "daterange" ) {
        	if(placeholder == "")
        		placeholder="25/01/2014";
			mylog.log("build field "+field+">>>>>> daterange");
        	fieldHTML += iconOpen+'<input type="text" class="form-control daterangeInput '+fieldClass+'" name="'+field+'" id="'+field+'" value="'+value+'" placeholder="'+placeholder+'"/>'+iconClose;
        }

        /* **************************************
		* TIME INPUT , we use 
		***************************************** */
        else if ( fieldObj.inputType == "time" ) {
        	if(placeholder == "")
        		placeholder="20:30";
        	mylog.log("build field "+field+">>>>>> time");
        	fieldHTML += iconOpen+'<input type="text" class="form-control timeInput '+fieldClass+'" name="'+field+'" id="'+field+'" value="'+value+'" placeholder="'+placeholder+'"/>'+iconClose;
        }

        /* **************************************
		* LINK
		***************************************** */
        else if ( fieldObj.inputType == "link" ) {
        	if(fieldObj.url.indexOf("http://") < 0 )
        		fieldObj.url = "http://"+fieldObj.url;
        	mylog.log("build field "+field+">>>>>> link");
        	fieldHTML += '<a class="btn btn-primary '+fieldClass+'" href="'+fieldObj.url+'">Go There</a>';
        } 

         /* **************************************
		* CAPCHAT
		***************************************** */
        else if ( fieldObj.inputType == "captcha" ) {
        	mylog.log("build field "+field+">>>>>> captcha");
        	fieldHTML += '<div class="col-md-8 pull-right text-right">';
				fieldHTML += '<h5 for="message" class="letter-green margin-bottom-25">';
					fieldHTML += '<span class="letter-red"><i class="fa fa-lock fa-2x"></i> sécurité</span><br>'; 
					fieldHTML += 'merci de recopier le code ci-dessous<br>afin de valider votre message <i class="fa fa-chevron-down"></i>';
				fieldHTML += '</h5>';
				fieldHTML += '<input placeholder="taper le code ici" class="col-md-6 txt-captcha text-right pull-right" id="captcha">';
			fieldHTML += '</div>';
        }


        /* **************************************
		* TAG List
		***************************************** */
        else if ( fieldObj.inputType == "tagList" ) {
        	mylog.log("build field "+field+">>>>>> tagList");
        	var action = ( fieldObj.action ) ? fieldObj.action : "javascript:;";
        	$.each(fieldObj.list,function(k,v) { 
        		//mylog.log("build field ",k,v);
        		fieldClass = (v.class) ? v.class : "";
        		if(!v.excludeFromForm){
	        		var lbl = ( fieldObj.trad && fieldObj.trad[v.labelFront] ) ? fieldObj.trad[v.labelFront] : tradCategory[k] ? tradCategory[k] : k;
	        		fieldHTML += '<div class="col-md-4 padding-5 '+field+'C '+k+'">'+
	        						'<a class="btn tagListEl btn-select-type-anc '+field+' '+k+'Btn '+fieldClass+'"'+
	        						' data-tag="'+lbl+'" data-key="'+k+'" href="'+action+'"><i class="fa fa-'+v.icon+'"></i> <br>'+lbl+'</a>'+
	        					 '</div>';
        		}
        	});
        } 

        /* **************************************
		* LOCATION
		***************************************** */
        else if ( fieldObj.inputType == "location" ) {
        	mylog.log("build field "+field+">>>>>> location");
        	fieldHTML += "<a href='javascript:;' class='w100p "+fieldClass+" locationBtn btn btn-default'><i class='text-azure fa fa-map-marker fa-2x'></i> Localiser </a>";
        	fieldHTML += '<input type="hidden" placeholder="Latitude" name="geo[latitude]" id="geo.latitude]" value="'+( (fieldObj.geo) ? fieldObj.geo.latitude :"" )+'"/>';
        	fieldHTML += '<input type="hidden" placeholder="Longitude" name="geo[longitude]" id="geo[longitude]" value="'+( (fieldObj.geo) ? fieldObj.geo.longitude : "" )+'"/>';
        	fieldHTML += '<input type="hidden" placeholder="Insee" name="address[codeInsee]" id="address[codeInsee]" value="'+( (fieldObj.address) ? fieldObj.address.codeInsee : "" )+'"/>';
        	fieldHTML += '<input type="hidden" placeholder="country" name="address[addressCountry]" id="address[addressCountry]" value="'+( (fieldObj.address) ? fieldObj.address.addressCountry : "" )+'"/>';
        	fieldHTML += '<input type="hidden" placeholder="postal Code" name="address[postalCode]" id="address[postalCode]" value="'+( (fieldObj.address) ? fieldObj.address.postalCode : "" )+'"/>';
        	fieldHTML += '<input type="hidden" placeholder="Locality" name="address[addressLocality]" id="address[addressLocality]" value="'+( (fieldObj.address) ? fieldObj.address.addressLocality : "" )+'"/>';
        	fieldHTML += '<input type="hidden" placeholder="address" name="address[streetAddress]" id="address[streetAddress]" value="'+( (fieldObj.address) ? fieldObj.address.streetAddress : "" )+'"/>';
			mylog.log("location formValues", formValues);
			//locations are saved in addresses attribute
			if( formValues.address && formValues.geo && formValues.geoPosition ){
				var initAddress = function(){
					mylog.warn("init Adress location",formValues.address.addressLocality,formValues.address.postalCode);
					dyFInputs.locationObj.copyMapForm2Dynform({address:formValues.address,geo:formValues.geo,geoPosition:formValues.geoPosition});
					dyFInputs.locationObj.addLocationToForm({address:formValues.address,geo:formValues.geo,geoPosition:formValues.geoPosition});
				};
			}     
			if( formValues.addresses ){
				var initAddresses = function(){
					$.each(formValues.addresses, function(i,locationObj){
						mylog.warn("init extra addresses location ",locationObj.address.addressLocality,locationObj.address.postalCode);
						dyFInputs.locationObj.copyMapForm2Dynform(locationObj);
						dyFInputs.locationObj.addLocationToForm(locationObj, i);
					});
				};
			} 
			initField = function(){
				if(initAddress)
					initAddress();
				if(initAddresses)
					initAddresses();
				dyFInputs.locationObj.init();
			} 

        }else if ( fieldObj.inputType == "postalcode" ) {
        	mylog.log("build field "+field+">>>>>> postalcode");
        	fieldHTML += "<a href='javascript:;' class='w100p "+fieldClass+" postalCodeBtn btn btn-default'><i class='text-azure fa fa-plus fa-2x'></i> Postal Code </a>";
        	fieldHTML += '<input type="hidden" placeholder="Latitude" name="geo[latitude]" id="geo.latitude]" value="'+( (fieldObj.geo) ? fieldObj.geo.latitude :"" )+'"/>';
        	fieldHTML += '<input type="hidden" placeholder="Longitude" name="geo[longitude]" id="geo[longitude]" value="'+( (fieldObj.geo) ? fieldObj.geo.longitude : "" )+'"/>';
        	fieldHTML += '<input type="hidden" placeholder="postal Code" name="address[postalCode]" id="address[postalCode]" value="'+( (fieldObj.address) ? fieldObj.address.postalCode : "" )+'"/>';
        	fieldHTML += '<input type="hidden" placeholder="Locality" name="address[addressLocality]" id="address[addressLocality]" value="'+( (fieldObj.address) ? fieldObj.address.addressLocality : "" )+'"/>';
        	
			//locations are saved in addresses attribute
			if( formValues.postalCodes ){
				initField = function(){
					$.each(formValues.postalCodes, function(i,postalCodeObj){
						mylog.warn("init location",postalCodeObj.name,postalCodeObj.postalCode);
						copyPCForm2Dynform(postalCodeObj);
						addPostalCodeToForm(postalCodeObj);
					});
				};
			}       
        } 
        /* **************************************
		* ARRAYFOMR , is a subdynForm, that builds a list of strutured answered using a
		***************************************** */
        else if ( fieldObj.inputType == "arrayForm" ) {
        	mylog.log("build field "+field+">>>>>> array Form");
       	}
        /* **************************************
		* ARRAY , is a list of sequential values
		***************************************** */
        else if ( fieldObj.inputType == "array" ) {
        	mylog.log("build field "+field+">>>>>> array list");
        	var addLabel="";
        	var typeExtract="";
        	if(typeof fieldObj.initOptions != "undefined"){
        		if(typeof fieldObj.initOptions.labelAdd != "undefined")
        	 		addLabel=fieldObj.initOptions.labelAdd;
        	 	if(typeof fieldObj.initOptions.type != "undefined")
        	 		typeExtract=fieldObj.initOptions.type;
        	}
        	fieldHTML +=   '<div class="inputs array">'+
								'<div class="col-sm-10 no-padding">'+
									'<img class="loading_indicator" src="'+parentModuleUrl+'/images/news/ajax-loader.gif" style="position: absolute;right: 5px;top: 10px;display:none;">'+
									'<input type="text" name="'+field+'[]" class="addmultifield addmultifield0 form-control input-md" value="" placeholder="'+placeholder+'"/>'+
								'</div>'+
								'<div class="col-sm-2 sectionRemovePropLineBtn">'+
									'<a href="javascript:" data-id="'+field+fieldObj.inputType+'" class="removePropLineBtn col-md-12 btn btn-link letter-red" alt="Remove this line"><i class=" fa fa-minus-circle" ></i></a>'+
								'</div>'+
								'<div class="resultGetUrl resultGetUrl0 col-sm-12 col-md-12 col-xs-12 no-padding"></div>'+
							'</div>'+
							'<span class="form-group '+field+fieldObj.inputType+'Btn">'+
								'<div class="col-sm-12 no-padding margin-top-5 margin-bottom-15">'+
									'<a href="javascript:" data-container="'+field+fieldObj.inputType+'" data-id="'+field+'" data-type="'+typeExtract+'" class="addPropBtn btn btn-default w100p letter-green" alt="Add a line"><i class=" fa fa-plus-circle" ></i> '+addLabel+'</a> '+
							        //'<i class=" fa fa-spinner fa-spin fa-2x loading_indicator" ></i>'+
							        
					       		'</div>'+
				       		'</span>';
			
			if( formValues && formValues[field] ){
				mylog.warn("dynForm >> ",field, formValues[field]);
				fieldObj.value = formValues[field];
			}

			mylog.log("scopeObj fieldObj", fieldObj);
			
			if( fieldObj.init && $.isFunction(fieldObj.init) ){
				mylog.log("scopeObj fieldObj 2", fieldObj);
        		initField = fieldObj.init;
			}
        	
			initField = function(){
				$("#loading_indicator").hide();
				//initialize values
				//value is an array of strings
				var initOptions = new Object;
				if(typeof fieldObj.initOptions != "undefined")
					initOptions=fieldObj.initOptions;

				mylog.log("initField", fieldObj, fieldObj.value);
					
				$.each(fieldObj.value, function(optKey,optVal) { 
					mylog.log("initField", optKey, "fieldObj.value", fieldObj.value, "class ."+field+fieldObj.inputType, "optVal", optVal, "field", field, initOptions);
					if(optKey == 0)
	                    $(".addmultifield").val(optVal);
	                else {
	                	dyFObj.init.addfield("."+field+fieldObj.inputType, optVal, field, initOptions);
	                	$(".addmultifield"+optKey).val(optVal);
	                }
	                
	                if( formValues && formValues.medias ){
	                	$.each(formValues.medias, function(i,mediaObj) {
	                		if( mediaObj.content && optVal == mediaObj.content.url ) {
	                			if(typeof initOptions.type != "undefined" && initOptions.type == "video")
	                				var strHtml = processUrl.getMediaVideo(mediaObj,"save");
	                			else
	                				var strHtml = processUrl.getMediaCommonHtml(mediaObj,"save");//dyFObj.init.buildMediaHTML(mediaObj);
	                			$(".resultGetUrl"+optKey).html(strHtml);
	                			$("#loading_indicator").hide();
	                		}
	                	});
	                }
				});
				dyFObj.init.initMultiFields('.'+field+fieldObj.inputType,field,typeExtract);
			}

        }

        /* **************************************
		* PROPERTIES , is a list of pairs key/values
		***************************************** */
        else if ( fieldObj.inputType == "properties" ) {
        	mylog.log("build field "+field+">>>>>> properties dyFObj.init list", fieldObj);

        	var classInput =  "";

        	if(!dyFObj.init.properties[field])
    			dyFObj.init.properties[field] = {};

        	if(!dyFObj.init.initValues["tags"+field+"0"])
    			dyFObj.init.initValues["tags"+field+"0"] = {};


    		mylog.log("dyFObj.init fieldObj.values", fieldObj.values, $.isArray(fieldObj.values));
    		if($.isArray(fieldObj.values)){
    			fieldObj.values
    			classInput = "select2TagsInput";
    			dyFObj.init.properties[field]["type"]  = "tags";
				dyFObj.init.initValues["tags"+field+"0"]["tags"] = fieldObj.values;
	    		if(typeof fieldObj.data != "undefined"){
	    			var value = fieldObj.data;
	        		//dyFObj.init.initSelectNetwork[field]=fieldObj.data;
	        	}

	        	if(fieldObj.maximumSelectionLength)
	    			dyFObj.init.initValues[field]["maximumSelectionLength"] =  fieldObj.maximumSelectionLength;

	    		if(typeof fieldObj.mainTag != "undefined")
					mainTag=fieldObj.mainTag;
    		}else{
    			mylog.log("dyFObj.init.properties", dyFObj.init.properties);
    			var value = fieldObj.values;
    			dyFObj.init.properties[field]["type"] = "text";
    			dyFObj.init.properties[field]["values"] = fieldObj.values;

    			dyFObj.init.initValues["tags"+field+"0"]["values"] = fieldObj.values;
    			dyFObj.init.initValues["tags"+field+"0"]["type"] = "text";

    			mylog.log("dyFObj.init.properties", dyFObj.init.properties);
    		}

    			
    		
    		
    		
    		mylog.log("dyFObj.init classInput", classInput);
    		mylog.log("dyFObj.init.properties", dyFObj.init.properties);
    		fieldHTML += 	'<div class="padding-5">'+
								'<div class="col-sm-3">'+
									'<h6>'+(notNull(fieldObj.labelKey) ? fieldObj.labelKey : tradDynForm["Name of filter"])+'</h6>'+
								'</div>'+
								'<div class="col-sm-7">'+
									'<h6>'+(notNull(fieldObj.labelValue) ? fieldObj.labelValue : tradDynForm["Tags link a filter"])+'</h6>'+
								'</div>'+
							'</div>'+
				       		'<div class="space5"></div>';
        	fieldHTML += 	'<div class="inputs properties">'+
	        					'<div class="col-xs-12">'+
									'<div class="col-sm-3">'+
										//'<span>'+tradDynForm["Name of filter"]+'</span>'+
										'<input type="text" name="'+field+'0" id="'+field+'0" class="addmultifield addmultifield0 form-control input-md" value="" placeholder="'+placeholder+'"/>'+
										//'<img class="loading_indicator" src="'+parentModuleUrl+'/images/news/ajax-loader.gif">'+
									'</div>'+
									'<div class="col-sm-7">'+
										//'<span>'+tradDynForm["Tags link a filter"]+'</span>'+
										'<input type="text" class="form-control '+classInput+' addmultifield1" name="tags'+field+'0" id="tags'+field+'0" value="'+value+'" placeholder="'+placeholder+'" style="width:100%;margin-bottom: 10px;border: 1px solid #ccc;"/>'+
									//	'<button data-id="'+field+'" class="pull-right removePropLineBtn btn btn-xs letter-red" alt="Remove this line"><i class=" fa fa-minus-circle" ></i></button>'+
									'</div>'+
									'<div class="col-sm-1">'+
										'<button class="pull-right removePropLineBtn btn letter-red tooltips pull-right" data- data-original-title="Retirer cette ligne" data-placement="bottom"><i class=" fa fa-times" ></i></button>'+
									'</div>'+
								'</div>'+
							'</div>'+
							'<span class="form-group '+field+fieldObj.inputType+'Btn">'+
							'<div class="col-sm-12">'+
								'<div class="space10"></div>'+
						        '<a href="javascript:;" data-id="'+field+'" data-container="'+field+fieldObj.inputType+'" class="addPropBtn btn btn-default text-bold letter-green" alt="Add a line"><i class=" fa fa-plus-circle" ></i></button> '+
				       		'</div></span>'+
				       '<div class="space5"></div>';
			

			initField = function(){
				dyFObj.init.initMultiFields('.'+field+fieldObj.inputType,field);
				//initialize values
				//value is an array of objects structured like {"label":"","value":""}
				/*$.each(fieldObj.value, function(optKey,optVal) {
					if(optKey == 0)
	                    $(".addmultifield").val(optVal); tweak this for properties
	                else 
						dyFObj.init.addfield("."+field+fieldObj.inputType,optVal );
				});*/
			}
        }
        else if( fieldObj.inputType == "tagsNetwork") {
        	mylog.log("build field "+field+">>>>>> tagsNetwork");
        	fieldHTML += iconOpen+'<input type="text" class="form-control " name="name'+field+'" id="name'+field+'" value="'+value+'" placeholder="'+placeholder+'"/>'+iconClose;
        	fieldHTML += iconOpen+'<input type="text" class="form-control select2TagsInput" name="tags'+field+'" id="tags'+field+'" value="'+value+'" placeholder="'+placeholder+'" '+style+'/>'+iconClose;
        }

         /* **************************************
		* DropDown , searchInvite
		***************************************** */
        else if ( fieldObj.inputType == "searchInvite" ) {
        	mylog.log("build field "+field+">>>>>> searchInvite");

			fieldHTML += '<input class="invite-search '+fieldClass+' form-control text-left" placeholder="Un nom, un e-mail ..." autocomplete = "off" id="inviteSearch" name="inviteSearch" value="">'+
				        		'<ul class="dropdown-menu" id="dropdown_searchInvite" style="">'+
									'<li class="li-dropdown-scope">-</li>'+
								'</ul>'+
							'</input>';			
        }

        /* **************************************
		* CAPTCHA
		***************************************** */
        else if ( fieldObj.inputType == "recaptcha" ) {
        	mylog.log("build field "+field+">>>>>> recaptcah");
        	fieldHTML += '<div class="g-recaptcha" data-sitekey="'+fieldObj.key+'"></div>';
        } 
        

        /* **************************************
		* CUSTOM 
		***************************************** */
        else if ( fieldObj.inputType == "custom" ) {
        	mylog.log("build field "+field+">>>>>> custom");

        	fieldHTML += (typeof fieldObj.html == "function") ? fieldObj.html() : fieldObj.html;
        } 
        /* **************************************
        * CREATE NEWS
        ************************************** */
        else if( fieldObj.inputType == "createNews"){
        	mylog.log("build field "+field+">>>>>> createNews");
        	var newsContext=fieldObj.params;
        	if(newsContext.targetType!="citoyens"){
        		if(newsContext.authorImg=="")
        			var authorImg=moduleUrl+'/images/thumb/default_citoyens.png';
        		else
        			var authorImg=baseUrl+newsContext.authorImg;
        		if(newsContext.targetImg=="")
        			var targetImg=moduleUrl+'/images/thumb/default_'+newsContext.targetType+'.png';
        		else
        			var targetImg=baseUrl+newsContext.targetImg;
        		//targetName=newsContext.targetName;
        		//authorName=newsContext.authorName;
        	}
        	fieldHTML='<div id="createNews" class="form-group">'+
        			'<label class="col-xs-12 text-left control-label no-padding" for="post">'+
			            '<i class="fa fa-chevron-down"></i> '+tradDynForm.writenewshere+
			        '</label>'+
			        '<div id="mentionsText" class="col-xs-12 no-padding">'+
        				'<textarea name="newsText"></textarea>'+
        			'</div>'+
					'<label class="col-xs-12 text-left control-label no-padding" for="post">'+
			            '<i class="fa fa-chevron-down"></i> '+tradDynForm.tags+
			        '</label>'+
        			'<div class="no-padding">'+
          				'<input id="tags" type="" data-type="select2" name="tags" placeholder="#Tags" value="" style="width:100%;">'+
      				'</div>'+
        			'<label class="col-xs-12 text-left control-label no-padding" for="post">'+
			            '<i class="fa fa-chevron-down"></i> '+tradDynForm.newsvisibility+
			        '</label>'+
        			'<div class="dropdown no-padding col-xs-12">'+
          				'<a data-toggle="dropdown" class="btn btn-default col-xs-12" id="btn-toogle-dropdown-scope" href="javascript:;">'+
          					'<i class="fa fa-connectdevelop"></i> '+tradDynForm.network+' <i class="fa fa-caret-down" style="font-size:inherit;"></i>'+
          				'</a>'+
          				'<ul class="dropdown-menu" role="menu" aria-labelledby="dLabel">';
          	if(newsContext.targetType != "events")
          	{
            fieldHTML+=		'<li>'+
              					'<a href="javascript:;" id="scope-my-network" class="scopeShare" data-value="private">'+
              						'<h4 class="list-group-item-heading"><i class="fa fa-lock"></i> '+tradDynForm.private+'</h4>'+
               						'<p class="list-group-item-text small">'+tradDynForm["explainprivate"+newsContext.targetType]+'</p>'+
              					'</a>'+
            				'</li>';
            				}
            fieldHTML+=		'<li>'+
              					'<a href="javascript:;" id="scope-my-network" class="scopeShare" data-value="restricted">'+
              						'<h4 class="list-group-item-heading"><i class="fa fa-connectdevelop"></i> '+tradDynForm.network+'</h4>'+
                					'<p class="list-group-item-text small"> '+tradDynForm.explainnetwork+'</p>'+
              					'</a>'+
				            '</li>'+
				            '<li>'+
				              	'<a href="javascript:;" id="scope-my-wall" class="scopeShare" data-value="public">'+
				              		'<h4 class="list-group-item-heading"><i class="fa fa-globe"></i> '+tradDynForm.public+'</h4>'+
				                    '<p class="list-group-item-text small">'+tradDynForm.explainpublic+'</p>'+
				              	'</a>'+
				            '</li>'+
			            '</ul>'+
			            '<input type="hidden" name="scope" id="scope" value="restricted"/>'+
	        		'</div>';
	        if(newsContext.targetType!="citoyens")
	        {
	        fieldHTML+=		'<label class="col-xs-12 text-left control-label no-padding" for="post">'+
			            '<i class="fa fa-chevron-down"></i> '+tradDynForm.newsauthor+
		            '</label>'+
        			'<div class="dropdown no-padding col-md-12">'+
          				'<a data-toggle="dropdown" class="btn btn-default col-xs-12 text-left" id="btn-toogle-dropdown-targetIsAuthor" href="javascript:;">'+
           					'<img height=20 width=20 src="'+targetImg+'">'+  
           					' '+newsContext.targetName+
				            ' <i class="fa fa-caret-down" style="font-size:inherit;"></i>'+
				        '</a>'+
				        '<ul class="dropdown-menu" role="menu" aria-labelledby="dLabel">'+
				            '<li>'+
              					'<a href="javascript:;" class="targetIsAuthor" data-value="1" data-name="'+newsContext.targetName+'">'+
					                '<h4 class="list-group-item-heading">'+
					                  	'<img height=20 width=20 src="'+targetImg+'">'+  
					                	' '+newsContext.targetName+
					                '</h4>'+
					                '<p class="list-group-item-text small">'+tradDynForm.show+' '+newsContext.targetName+' '+tradDynForm.asAuthor+'</p>'+
					            '</a>'+
					        '</li>'+
					        '<li>'+
				              	'<a href="javascript:;" class="targetIsAuthor" data-value="0" data-name="'+tradDynForm.me+'">'+
				              		'<h4 class="list-group-item-heading">'+
				                		'<img height=20 width=20 src="'+authorImg+'">'+  
				                		' '+tradDynForm.me+
				                	'</h4>'+
				                	'<p class="list-group-item-text small"> '+tradDynForm.iamauthor+'</p>'+
				              	'</a>'+
				            '</li>'+
				        '</ul>'+
				        '<input type="hidden" id="authorIsTarget" value="1"/>'+
        			'</div>';
        			}
        	fieldHTML+=	'</div>';  
          
        }
        /* 	*************************************
        * SCOPE USER 	
        ************************************** */
        else if( fieldObj.inputType == "scope" ) {
        	mylog.log("scopeObj ", fieldObj);
   //      	fieldHTML += 	'<div id="scopeListContainerForm" class="col-xs-12 no-padding margin-bottom-10">';
			// fieldHTML +=		'<div id="news-scope-search" class="col-xs-12 no-padding">'+
			// 						'<div id="input-sec-search" class="hidden-xs col-xs-12 col-sm-10">'+
			// 							'<div class="input-group shadow-input-header">'+
			// 								'<span class="input-group-addon bg-white addon-form-news"><i class="fa fa-search fa-fw" aria-hidden="true"></i></span>'+
			// 								'<input type="text" class="form-control input-global-search" id="searchScopeDF" autocomplete="off" placeholder="'+trad.searchcity+' ...">'+
			// 							'</div>'+
			// 							'<div class="dropdown-result-global-search col-xs-12 col-sm-5 col-md-5 col-lg-5 no-padding" style="max-height: 70%; display: none;"><div class="text-center" id="footerDropdownGS"><label class="text-dark"><i class="fa fa-ban"></i> Aucun résultat</label><br></div>'+
			// 							'</div>'+
			// 						'</div>'+
			// 					'</div>'+
			// 					'<div id="labelselected" class=" hidden col-md-12 col-sm-12 col-xs-12 margin-top-10 no-padding">'+
			// 						'<label class="margin-left-5"><i class="fa fa-angle-down"></i> '+trad.selectedzones+'</label><br>'+
			// 					'</div>'+
			// 					'<div id="scopes-container" class="col-md-12 col-sm-12 col-xs-12"></div>';
   //      	fieldHTML += 	'</div>';

   			fieldHTML += scopeObj.getHtml();
        	scopeObj.initVar(fieldObj);

					
        } else if ( fieldObj.inputType == "formLocality") {
        	mylog.log("build field "+field+">>>>>> formLocality", fieldObj);
        	fieldHTML += "<div class='col-md-6 col-xs-12 inline-block padding-15 form-in-map formLocality col-md-6'>"+
        					'<label style="font-size: 13px;" class="col-xs-12 text-left control-label no-padding" for="newElement_country">'+
								'<i class="fa fa-chevron-down"></i> '+tradDynForm.country+
				            '</label>'+
							"<select class='col-md-10 col-xs-12' name='newElement_country' >"+
								"<option value=''>"+trad.chooseCountry+"</option>";
								mylog.log("mamp 1");
								$.each(dyFObj.formInMap.countryList, function(key, v){
									
									if(	typeof dyFObj[dyFObj.activeElem] != "undefined" &&
										(	(	typeof dyFObj[dyFObj.activeElem].dynFormCostum != "undefined" && 
												typeof dyFObj[dyFObj.activeElem].dynFormCostum.filters != "undefined" && 
												typeof dyFObj[dyFObj.activeElem].dynFormCostum.filters.locations != "undefined" &&
												typeof dyFObj[dyFObj.activeElem].dynFormCostum.filters.locations.country != "undefined" &&
												$.inArray(v.countryCode, dyFObj[dyFObj.activeElem].dynFormCostum.filters.locations.country)  > -1 ) ||
											(	typeof dyFObj[dyFObj.activeElem].dynFormCostum == "undefined" || 
												typeof dyFObj[dyFObj.activeElem].dynFormCostum.filters == "undefined" || 
												typeof dyFObj[dyFObj.activeElem].dynFormCostum.filters.locations == "undefined" ||
												typeof dyFObj[dyFObj.activeElem].dynFormCostum.filters.locations.country == "undefined" ) ) ) {
										mylog.log("mamp 2", v.countryCode)
										fieldHTML += "<option value='"+v.countryCode+"'>"+v.name+"</option>";
									}
									//fieldHTML += "<option value='"+v.countryCode+"'>"+v.name+"</option>";
								});
				fieldHTML += "</select>"+
							"<div id='divCity' class='hidden dropdown pull-left col-md-12 col-xs-12 no-padding'> "+
								'<label style="font-size: 13px;" class="col-xs-12 text-left control-label no-padding" for="newElement_city">'+
									'<i class="fa fa-chevron-down"></i> '+trad.city  +
								'</label>'+
						  		"<input autocomplete='off' class='col-md-10 col-xs-12' type='text' name='newElement_city' placeholder='"+trad['Search a city, a town or a postal code']+"'>"+
								"<ul class='dropdown-menu col-md-10 col-xs-12' id='dropdown-newElement_locality-found' style='margin-top: -2px; background-color : #ea9d13; max-height : 300px ; overflow-y: auto'>"+
									"<li><a href='javascript:' class='disabled'>"+tradDynForm.searchACityATownOrAPostalCode +"</a></li>"+
								"</ul>"+
					  		"</div>"+
							"<div id='divStreetAddress' class='hidden dropdown pull-left col-md-12 col-xs-12 no-padding'> "+
								'<label style="font-size: 13px;" class="col-xs-12 text-left control-label no-padding" for="newElement_street">'+
									'<i class="fa fa-chevron-down"></i> '+trad.streetFormInMap +
					            '</label>'+
								"<input class='col-md-9 col-xs-9'  autocomplete='off' type='text' style='margin-right:-3px;' name='newElement_street' placeholder='"+trad.streetFormInMap +"'>"+
								"<a href='javascript:;' class='col-md-1 col-xs-1 btn btn-default' style='padding:3px;border-radius:0 4px 4px 0 ; height: 33px;' type='text' id='newElement_btnSearchAddress'><i class='fa fa-search'></i></a>"+
							"</div>"+
							"<div class='dropdown pull-left col-xs-12 no-padding'> "+
						  		"<ul class='dropdown-menu' id='dropdown-newElement_streetAddress-found' style='margin-top: -15px; background-color : #ea9d13; max-height : 300px ; overflow-y: auto'>"+
						  			"<li><a href='javascript:' class='disabled'>"+trad.currentlyresearching +"</a></li>"+
						  		"</ul>"+
							"</div>"+
							"<div id='alertGeo' class='alert alert-warning col-xs-12 hidden' style='margin-bottom: 0px;'>"+
							  "<strong>Warning!</strong> "+tradDynForm.doNotForgetToGeolocateYourAddress+
							"</div>"+
						"</div>"+
							"<div id='sumery' class='text-dark col-md-6 col-xs-12 no-padding'>"+
								"<h4 class='text-center'>"+tradDynForm.addressSummary +" : </h4>"+
								"<div id='street_sumery' class='col-xs-12'>"+
									"<span>"+trad.streetFormInMap +" : </span>"+
									"<b><span id='street_sumery_value'></span></b>"+
								"</div>"+
								"<div id='cp_sumery' class='col-xs-12'>"+
									"<span>"+trad.postalCode +" : </span>"+
									"<b><span id='cp_sumery_value'></span></b>"+
								"</div>"+
								"<div id='city_sumery' class='col-xs-12'>"+
									"<span>"+trad.city +" : </span>"+
									"<b><span id='city_sumery_value'></span></b>"+
								"</div>"+
								"<div id='country_sumery' class='col-xs-12'>"+
									"<span>"+tradDynForm.country +" : </span>"+
									"<b><span id='country_sumery_value'></span></b>"+
								"</div>"+
								"<hr class='col-md-12'>"+
								"<a href='javascript:;' class='btn btn-success' type='text' id='btnValideAddress'>"+
									tradDynForm.confirmAddress+
								"</a>"+
							"</div>";
				//fieldHTML +="<div id='divMapLocality' class='col-xs-12' style='height: 300px;'></div>";
				fieldHTML +="<div class='col-xs-12'><span class='col-xs-12 hidden text-red errorForm'></span></div>";
				fieldHTML +="<div id='divNewAddress' class='text-dark col-xs-12 no-padding '>"+
								"<a href='javascript:;' class='btn btn-success' style='margin-bottom: 10px;' type='text' id='newAddress'>"+
									'<i class="fa fa-plus"></i> '+tradDynForm.addANewAddress +
								"</a>"+
							"</div>";

				//dyFObj.formInMap.initParams(fieldObj.params);
        } else if ( fieldObj.inputType == "password" ) {
        	mylog.log("build field "+field+">>>>>> password");
        	fieldHTML += '<input id="'+field+'" name="'+field+'" class="form-control" type="password"/>';
       	} else {
        	mylog.log("build field "+field+">>>>>> input text");
        	fieldHTML += iconOpen+'<input type="text" class="form-control '+fieldClass+'" name="'+field+'" id="'+field+'" value="'+value+'" placeholder="'+placeholder+'"/>'+iconClose;
        }

        if( fieldObj.custom )
        	fieldHTML += fieldObj.custom ;

		fieldHTML += '</div>';

		$(id).append(fieldHTML);

		//Post creation initialisation
		if( fieldObj.init && $.isFunction(fieldObj.init) ){
			fieldObj.init(field+fieldObj.inputType);
		}
        if(initField && $.isFunction(initField) )
        	initField ('.'+field+fieldObj.inputType);
	},

	/* **************************************
	*	any event to be initiated 
	***************************************** */
	bindForm : function (params, formRules) { 

		/* **************************************
		* FORM VALIDATION and save process binding
		***************************************** */
		mylog.info("bindForm :: connecting submit btn to $.validate pluggin", formRules);
		mylog.dir(formRules);
		var errorHandler = $('.errorHandler', $(params.formId));

		// $(params.formId).unbind('keydown').keydown(function(event) 
		//   {
		//   	if ( event.keyCode == 13)
		//     {
		// 		event.preventDefault();
		// 		//alert("enter");
		// 	}
		// });

		$(params.formId).validate({

			rules : formRules,

			submitHandler : function(form) {
				
				var validRules = dyFObj.checkRules(formRules, params);
				if(validRules === false){
					errorHandler.show();
					return false;
				}
				$(dyFObj.activeModal+" #btn-submit-form").html( '<i class="fa  fa-spinner fa-spin fa-"></i>' ).prop("disabled",true);
				errorHandler.hide();
				mylog.info("form submitted "+params.formId);
				
				if(params.beforeSave && jQuery.isFunction( params.beforeSave ) ){
					params.beforeSave();
				}

				if(params.onSave && jQuery.isFunction( params.onSave ) ){
					params.onSave();
					return false;
		        } else {
		        	//TODO SBAR - Remove notPost form element
		        	/*$.each($(params.formId).serializeArray()).function() {
		        		if ($this.)
		        	}*/
		        	mylog.info("default SaveProcess",params.savePath);
		        	mylog.dir($(params.formId).serializeFormJSON());
		        	$.ajax({
		        	  type: "POST",
		        	  url: params.savePath,
		        	  data: $(params.formId).serializeFormJSON(),
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
				
				//alert("error form");
				//$(".btn-next").html('<span class="text-red">Errors <i class="fa fa-warning"></i></span>');
				
				// $("#btn-submit-form").html('Valider <i class="fa fa-arrow-circle-right"></i>').prop("disabled",false).one(function() { 
				// 	$( settings.formId ).submit();	        	
		  //       });
		        //$("#btn-submit-form").hide(); 
			}
		});	

	},
	
	bindDynFormEvents : function (params, formRules) {  
		mylog.log("formLocality bindDynFormEvents", params, formRules);
		if(params.surveyId)
			dySObj.bindSurvey(params, formRules);
		else 
			dyFObj.bindForm(params, formRules);
		
		mylog.info("connecting any specific input event select2, datepicker...");
		/* **************************************
		* SELECTs , we use https://github.com/select2/select2
		***************************************** */
		//is a type select with options
		if( $(".select2Input").length)
		{
			if( jQuery.isFunction(jQuery.fn.select2) )
			{
				/*$(".select2Input").select2(
					{
					  "placeholder" : ( $(this).attr("placeholder") ) ? $(this).attr("placeholder") : ""
					}
				);*/
				
				$.each($(".select2Input"),function () 
				{
					if( jQuery.isFunction(jQuery.fn.select2) )
						$(this).select2({
							  "placeholder" : ( $(this).data("placeholder") ) ? $(this).data("placeholder") : "",
							  allowClear: true
							}
						);
					else
						mylog.error("select2 library is missing");
				 });
			}
		} 

		//is a type input
		if( $(".select2TagsInput").length)
		{
			if( jQuery.isFunction(jQuery.fn.select2) )
			{
				$.each($(".select2TagsInput"),function () 
				{
					mylog.log( "select2TagsInput id xxxxxxxxxxxxxxxxx " , $(this).attr("id") , dyFObj.init.initValues[ $(this).attr("id") ], dyFObj.init.initValues );
					if( dyFObj.init.initValues[ $(this).attr("id") ] && !$(this).hasClass( "select2-container" ))
					{
						mylog.log( "select2TagsInput", dyFObj.init.initValues[ $(this).attr("id") ]);
						var selectOptions = 
						{
						  "tags": dyFObj.init.initValues[ $(this).attr("id") ].tags ,
						  "tokenSeparators": [','],
						  //"minimumInputLength" : 3,
						  "placeholder" : ( $(this).attr("placeholder") ) ? $(this).attr("placeholder") : "",
						};
						if(dyFObj.init.initValues[ $(this).attr("id") ].maximumSelectionLength)
							selectOptions.maximumSelectionSize = dyFObj.init.initValues[$(this).attr("id")]["maximumSelectionLength"];
						mylog.log( "select2TagsInput dyFObj.init.initValues", dyFObj.init.initValues);

						if(typeof dyFObj.init.initValues[ $(this).attr("id") ].minimumInputLength == "number" && dyFObj.init.initValues[ $(this).attr("id") ].minimumInputLength > 0){
							mylog.log( "select2TagsInput minimumInputLength ", selectOptions);
							selectOptions.minimumInputLength = dyFObj.init.initValues[$(this).attr("id")]["minimumInputLength"];
						}

						if(typeof dyFObj.init.initSelectNetwork != "undefined" && typeof dyFObj.init.initSelectNetwork[$(this).attr("id")] != "undefined" && dyFObj.init.initSelectNetwork[$(this).attr("id")].length > 0){
							mylog.log("select2TagsInput data", dyFObj.init.initSelectNetwork[$(this).attr("id")]);
							selectOptions.data=dyFObj.init.initSelectNetwork[$(this).attr("id")];
						}
						mylog.log( "select2TagsInput selectOptions ", selectOptions);
						$(this).removeClass("form-control").select2(selectOptions);
						if(typeof mainTag != "undefined")
							$(this).val([mainTag]).trigger('change');

						mylog.log( "select2TagsInput end ", selectOptions);
					}
				});
			} else
				mylog.error("select2 library is missing");
		} 

		/* **************************************
		* Color picker 
		***************************************** */
		function loadColorPicker(callback) {
			mylog.log("loadColorPicker");
			if( ! jQuery.isFunction(jQuery.ColorPicker) ) {
				mylog.log("loadDateTimePicker2");
				lazyLoad( baseUrl+'/plugins/colorpicker/js/colorpicker.js', 
						  baseUrl+'/plugins/colorpicker/css/colorpicker.css',
						  callback);
		    }
		}
		var initColor = function(){
			mylog.log("init .colorpickerInput");
			$(".colorpickerInput").ColorPicker({ 
		        color : "pink",
		        onSubmit: function(hsb, hex, rgb, el) {
					$(el).val(hex);
					$(el).ColorPickerHide();
				},
				onBeforeShow: function () {
					$(this).ColorPickerSetColor(this.value);
				}
		    }).bind('keyup', function(){
				$(this).ColorPickerSetColor(this.value);
			});
		};

		if(  $(".colorpickerInput").length){
			loadColorPicker(initColor);
		}
		/* **************************************
		* DATE INPUT , we use http://xdsoft.net/jqplugins/datetimepicker/
		***************************************** */
		function loadDateTimePicker(callback) {
			mylog.log("loadDateTimePicker");
			if( ! jQuery.isFunction(jQuery.datetimepicker) ) {
				mylog.log("loadDateTimePicker2");
				lazyLoad( baseUrl+'/plugins/xdan.datetimepicker/jquery.datetimepicker.full.min.js', 
						  baseUrl+'/plugins/xdan.datetimepicker/jquery.datetimepicker.min.css',
						  callback);
		    }
		}
		function loadTimePicker(callback) {
			if( ! jQuery.isFunction(jQuery.datetimepicker) ) {
				lazyLoad( baseUrl+'/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
						baseUrl+'/plugins/moment/moment.js', 
						  baseUrl+'/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
						  callback);
		    }
		}

		var initDate = function(){
			mylog.log("init dateInput");
			jQuery.datetimepicker.setLocale('fr');
			$(".dateInput").datetimepicker({ 
		        autoclose: true,
		        lang: "fr",
		        format: "d/m/Y",
		        timepicker:false
		    });
		};

		if(  $(".dateInput").length){
			loadDateTimePicker(initDate);
		}
		var initTime = function(){
			mylog.log("init dateInput");
			//$('.timeInput').timepicker(
               // minuteStep: 1,
              //  appendWidgetTo: 'body',
              
                //showSeconds: true,
                //showMeridian: false,
                //defaultTime: false
            //);
			/*$(".timeInput").datetimepicker({ 
		        format: 'LT'
		    });*/
		};
		/*if(  $(".timeInput").length){

			$('.timeInput').timepicker({
               // minuteStep: 1,
              //  appendWidgetTo: 'body',
              
                showSeconds: false,
                showMeridian: false,
                defaultTime: false
            });
            $('.startTime').timepicker('setTime', '06:00');
            $('.endTime').timepicker('setTime', '19:00');
			//loadTimePicker(initTime);
		}*/
		/* **************************************
		* DATE INPUT , we use http://xdsoft.net/jqplugins/datetimepicker/
		***************************************** */
	
		var initDateTime = function(){
			mylog.log("init dateTimeInput");
			jQuery.datetimepicker.setLocale('fr');
			$(".dateTimeInput").datetimepicker({
				weekStart: 1,
				step: 15,
				lang: 'fr',
				format: 'd/m/Y H:i'
			   });
		};
		if(  $(".dateTimeInput").length){
			loadDateTimePicker(initDateTime);
		}
		/* **************************************
		* Location type 
		***************************************** */
		if(  $(".locationBtn").length){
			//todo : for generic dynForm check if map exist 
			$(".locationBtn").off().on( "click", function(){ 
				
		        //if(typeof showFormInMap != "undefined"){ showFormInMap(); }
		        if(typeof formInMap.showMarkerNewElement != "undefined"){
		        	$("#ajax-modal").modal("hide");
		        	mylog.log(".locationBtn");
					formInMap.actived = true ;
			        showMap(true);
		        	mylog.log(".locationBtn showMarkerNewElement");
		        	formInMap.showMarkerNewElement(); 
		        }
		    });
		}

		/* **************************************
		* Postal Code type 
		***************************************** */
		if(  $(".postalCodeBtn").length)
		{
			//todo : for generic dynForm check if map exist 
			$(".postalCodeBtn").off().on( "click", function(){ 
				$("#ajax-modal").modal("hide");
		        showMap(true);
		        //if(typeof showFormInMap != "undefined"){ showFormInMap(); }
		        if(typeof formInMap.showMarkerNewElement != "undefined"){ formInMap.showMarkerNewElement(true); }
		    });
		}
		
		/* **************************************
		* Image uploader , we use https://github.com/FineUploader/fine-uploader
		***************************************** */
		if(typeof dyFObj.init.uploader != "undefined" && Object.keys(dyFObj.init.uploader).length)
		{
			/*function loadFineUploader(callback,template) {
				if( ! jQuery.isFunction(jQuery.fineUploader) ) {
					if(template=='qq-template-manual-trigger')
						var cssLazy=baseUrl+'/plugins/fine-uploader/jquery.fine-uploader/fine-uploader-new.min.css';
					else
						var cssLazy=baseUrl+'/plugins/fine-uploader/jquery.fine-uploader/fine-uploader-gallery.css';
					lazyLoad( baseUrl+'/plugins/fine-uploader/jquery.fine-uploader/jquery.fine-uploader.js', 
							  cssLazy,
							  callback);
			    }
			}*/
			uploadObj.docListIds=[];
			uploadObj.afterLoadUploader=false;
			$.each(dyFObj.init.uploader, function(e,v){
				var domElement="#"+e;
				//var FineUploader = function(){
					//if(typeof v.endPoint == "undefined")
					uploadObj.domTarget=domElement;
					mylog.log("init fineUploader");
					var endPointUploader=(typeof v.endPoint != "undefined") ? v.endPoint : uploadObj.path;
					$(domElement).fineUploader({
			            template: (v.template) ? v.template : 'qq-template-manual-trigger',
			            paste: {
					        defaultName: 'pasted_image',
					        promptForName:false,
					        targetElement: $(window)
					    },

			            request: {
			                endpoint: endPointUploader
			            },
			            validation: {
			                allowedExtensions: (v.filetypes) ? v.filetypes : ['jpeg', 'jpg', 'gif', 'png'],
			                sizeLimit: 5000000,
			                itemLimit: (v.itemLimit) ? v.itemLimit : 0
			            },
			            messages: {
					        sizeError : '{file} '+tradDynForm.istooheavy+'! '+tradDynForm.limitmax+' : {sizeLimit}.',
					        typeError : '{file} '+tradDynForm.invalidextension+'. '+tradDynForm.extensionacceptable+': {extensions}.'
					    },
					    session:{
					    	endpoint:null
					    },
					    deleteFile: {
					        enabled: true
					    },
			            callbacks: {
			            	//when a img is selected
						    onSubmit: function(id, fileName) {
						    		
						    	//if(typeof v.endPoint == "undefined")
						    	//	$(domElement).fineUploader('setEndpoint',uploadObj.path);
	    					    if( v.showUploadBtn  ){
							      	$('#trigger-upload').removeClass("hide").click(function(e) {
					        			$(domElement).fineUploader('uploadStoredFiles');
							        	urlCtrl.loadByHash(location.hash);
					        			$('#ajax-modal').modal("hide");
							        });
						        }
						    },
						    onCancel: function(id) {
						    	if(($("ul.qq-upload-list > li").length-1)<=0)
						    		$('#trigger-upload').addClass("hide");
		        			},
		        			onPasteReceived: function(blob) {},

						    //launches request endpoint
						    //onUpload: function(id, fileName) {
						      //alert(" > upload : "+id+fileName+contextData.type+contextData.id);
						      //alert(" > request : "+ uploadObj.id +" :: "+ uploadObj.type);
						      //mylog.log('onUpload uplaodObj',uploadObj);
						      //var ex = $('.fine-uploader-manual-trigger').fineUploader('getEndpoint');
						      //mylog.log('onUpload getEndpoint',ex);
						    //},
						    //launched on upload
						    //onProgress: function(id, fileName, uploadedBytes,totalBytes) {
						    	/*mylog.log('onProgress uplaodObj',uploadObj);
						    	var ex = $('.fine-uploader-manual-trigger').fineUploader('getEndpoint');
						    	mylog.log('onProgress getEndpoint',ex);
						    	mylog.log('getInProgress',$('.fine-uploader-manual-trigger').fineUploader('getInProgress'));*/
						      //alert("progress > "+" :: "+ uploadObj.id +" :: "+ uploadObj.type);
						    //},
						    //when every img finish upload process whatever the status
						    onComplete: function(id, fileName,responseJSON,xhr) {
						    	
						    	console.log(responseJSON,xhr);
						    	if(typeof responseJSON.survey != "undefined" && responseJSON.survey){
						    		uploadObj.afterLoadUploader=false;
						    		documentEl={
						    			surveyId:uploadObj.formId,
						    			answerId:uploadObj.answerId,
						    			formId:dySObj.surveys.id,
						    			answerSection: dySObj.activeSectionKey,
						    			answerKey : responseJSON.survey,
						    			documentId :responseJSON.id.$id
						    		};
						    		if(typeof updateForm !="undefined" && notNull(updateForm)){
						    			
						    			documentEl.formId = updateForm.form;
	    								documentEl.answerSection = updateForm.step; 
	    							}
						    		$.ajax({
								        type: "POST",
								        url: baseUrl+"/survey/co/updatedocumentids",
								        //dataType: "json",
								        data: documentEl,
										type: "POST",
								    })
								    .done(function (data){
								    	uploadObj.afterLoadUploader=true;
								    	if(typeof v.afterUploadComplete != "undefined" && jQuery.isFunction(v.afterUploadComplete) ){
						    				v.afterUploadComplete();
						    			}
								    }).fail(function(){
									  // toastr.error("Something went wrong, contact your admin");
									   $("#btn-submit-form i").removeClass("fa-circle-o-notch fa-spin").addClass("fa-arrow-circle-right");
									   $("#btn-submit-form").prop('disabled', false);
								    });
						    	}
						    	if($("#ajaxFormModal #newsCreation").val()=="true"){
						    		uploadObj.docListIds.push(responseJSON.id.$id);
						    	}
						    	if(!responseJSON.result){
						    		toastr.error(trad.somethingwentwrong+" : "+responseJSON.msg );		
						    		mylog.error(trad.somethingwentwrong , responseJSON.msg)
						    	}
						    },
						    onSessionRequestComplete:function(response, success, xhrOrXdr){
						    	//alert("sessiiiiiiion");
						    	//console.log("sesionnnn", response, success, xhrOrXdr);
						    },
						    //when all upload is complete whatever the result
						    onAllComplete: function(succeeded, failed) {
						    	mylog.log("ooooooooooooo",succeeded,failed);
						     	
						      	if($("#ajaxFormModal #newsCreation").val()=="true"){
						      		//var mentionsInput=[];
						      		/*$('#ajaxFormModal #createNews textarea').mentionsInput('getMentions', function(data) {
	      								mentionsInput=data;
	    							});*/
						      		var media=new Object;
						      		if(uploadObj.contentKey=="file"){
						      			media.type="gallery_files";
						      			media.countFiles=uploadObj.docListIds.length;
						      			media.files=uploadObj.docListIds;
						      		}else{
						      			media.type="gallery_images";
						      			media.countImages=uploadObj.docListIds.length;
						      			media.images=uploadObj.docListIds;
						      		}
						    		var addParams = {
		              				  type: "news",
		              				  parentId: uploadObj.id,
		              				  parentType: uploadObj.type,
		              				  scope:$("#ajaxFormModal #createNews #scope").val(),
		              				  text:$("#ajaxFormModal #createNews textarea").val(),
		              				  media: media
		            				};
		            				if ($("#ajaxFormModal #createNews #tags").val() != "")
										addParams.tags = $("#ajaxFormModal #createNews #tags").val().split(",");
									if($('#ajaxFormModal #createNews #authorIsTarget').length && $('#ajaxFormModal #createNews #authorIsTarget').val()==1)
										addParams.targetIsAuthor = true;
									/*if (mentionsResult.mentionsInput.length != 0){
										addParams.mentions=mentionsResult.mentionsInput;
										addParams.text=mentionsResult.text;
									}*/
									addParams=mentionsInit.beforeSave(addParams,'#ajaxFormModal #createNews textarea');
									$.ajax({
								        type: "POST",
								        url: baseUrl+"/news/co/save",
								        //dataType: "json",
								        data: addParams,
										type: "POST",
								    })
								    .done(function (data) {
							    		
										return true;
								    }).fail(function(){
									   toastr.error("Something went wrong, contact your admin"); 
									   $("#btn-submit-form i").removeClass("fa-circle-o-notch fa-spin").addClass("fa-arrow-circle-right");
									   $("#btn-submit-form").prop('disabled', false);
								    });
								}
						    	if(uploadObj.afterLoadUploader){
						    		if(uploadObj.startAfterLoadUploader){
							    		//toastr.info( "Fichiers bien chargés !!");
							    		if(typeof uploadObj.type != "undefined" && notNull(uploadObj.type) && uploadObj.type=="proposals"){
							    			dyFObj.coopAfterSave(uploadObj.callBackData);
							    		}else if(typeof v.afterUploadComplete != "undefined" && notNull(v.afterUploadComplete) && jQuery.isFunction(v.afterUploadComplete) ){
							    			v.afterUploadComplete();
							    		}else if(notNull(uploadObj.gotoUrl)){
							    			urlCtrl.loadByHash(uploadObj.gotoUrl);
							    		}else{
							    			urlCtrl.loadByHash(location.hash);
							    		}
							     		uploadObj.gotoUrl = null;
							     	}
						     	}
						    },
						    onError: function(id) {
						      toastr.info(trad.somethingwentwrong);
						    }
						},
			            thumbnails: {
			                placeholders: {
			                    waitingPath: baseUrl+'/plugins/fine-uploader/jquery.fine-uploader/processing.gif',
			                    notAvailablePath: baseUrl+'/plugins/fine-uploader/jquery.fine-uploader/retry.gif'
			                }
			            },
			            autoUpload: false
			        });
					if(typeof v.initList != "undefined" )
						$(domElement).fineUploader("addInitialFiles",v.initList);
					/*mylog.log(params);
					if(typeof params.formValues.images != "undefined" && params.formValues.images.length > 0){
						var imagesArray=[];
						$.each(params.formValues.images,function(e,v){
							var image={
								"name":"ressource"+e,
								"uuid":v.id,
								"thumbnailUrl":v.imageThumbPath
							};
							imagesArray.push(image);
						});
						uploader.addInitialFiles(imagesArray);
					}*/
				//};
				//if($(domElement).length)
				//loadFineUploader(FineUploader,v.template);
			});
		}

		/* **************************************
		* DATE RANGE INPUT , we use https://github.com/dangrossman/bootstrap-daterangepicker
		***************************************** */
		if( $(".daterangeInput").length){
			var initDateRange = function(){
								$('.daterangeInput').daterangepicker({
						            timePicker: true,
						            timePickerIncrement: 30,
						            format: 'DD/MM/YYYY h:mm A'
						        }, function(start, end, label) {
						            mylog.log(start.toISOString(), end.toISOString(), label);
						        });
							};
			if( jQuery.isFunction(jQuery.fn.daterangepicker) )
				initDateRange();
			else
				lazyLoad( baseUrl+'/plugins/bootstrap-daterangepicker/daterangepicker.js' ,  
						  baseUrl+'/plugins/bootstrap-daterangepicker/daterangepicker-bs3.css',
						  initDateRange);
		    /*$('.daterangeInput').val(moment().format('DD/MM/YYYY h:mm A') + ' - ' + moment().add('days', 1).format('DD/MM/YYYY h:mm A'))
			.daterangepicker({  
				startDate: moment(),
				endDate: moment().add('days', 1),
				timePicker: true, 
				timePickerIncrement: 30, 
				format: 'DD/MM/YYYY h:mm A' 
			});*/
		}
		/* **************************************
		* formLocality 
		***************************************** */
		if(  $(".formLocality").length ){
			//alert("formLocality");
			dyFObj.formInMap.init();
		}
		
		
		/* **************************************
		* PROPERTIES 
		***************************************** */
		if(  $(".addmultifield").length )
		{
			//if(  $(".addmultifield1").length )
			//	$('head').append('<style type="text/css">.inputs textarea.addmultifield1{width:90%; height:34px;}</style>');

			//intialise event on the add new row button 
			$('.addPropBtn').unbind("click").click(function(){
				mylog.log("addPropBtn", $(this).data('id'));
				var field = $(this).data('id');
				var typeExtract = $(this).data('type');
				if( $('.'+field+' .inputs .addmultifield:visible').length==0 || ( $("."+field+" .addmultifield:last").val() != "" && $( "."+field+" .addmultifield1:last" ).val() != "") )
					dyFObj.init.addfield('.'+$(this).data('container'),'',field, typeExtract);
				else
					toastr.info("please fill properties first");
			} );
		}

		/* **************************************
		* WYSIWYG 
		***************************************** */
		if(  $(".wysiwygInput").length )
		{
			mylog.log("wysiwygInput wysiwygInput");
				var initField = function(){
					$(".wysiwygInput").summernote({

						oninit: function() {
							/*if ($(this).code() == "" || $(this).code().replace(/(<([^>]+)>)/ig, "") == "") {
								$(this).code($(this).attr("placeholder"));
							}*/
						}, onfocus: function(e) {
							/*if ($(this).code() == $(this).attr("placeholder")) {
								$(this).code("");
							}*/
						}, onblur: function(e) {
							/*if ($(this).code() == "" || $(this).code().replace(/(<([^>]+)>)/ig, "") == "") {
								$(this).code($(this).attr("placeholder"));
							}*/
						}, onkeyup: function(e) {},
						toolbar: [
						['style', ['bold', 'italic', 'underline', 'clear']],
						['color', ['color']],
						['para', ['ul', 'ol', 'paragraph']],
						]
					});
				if( jQuery.isFunction(jQuery.fn.summernote) )
					initField();
			    else {
			    	lazyLoad( baseUrl+'/plugins/summernote/dist/summernote.min.js', 
							  baseUrl+'/plugins/summernote/dist/summernote.css',
							  initField);
		    	}
			}
		}

		/* **************************************
		* MARKDOWN 
		***************************************** */
		if(  $(".markdownInput").length )
		{
			mylog.log("markdownInput");
			var initField = function(){
				$(".markdownInput").markdown({
						savable:true,
						onPreview: function(e) {
							var previewContent = "";
						    mylog.log(e);
						    mylog.log(e.isDirty());
						    if (e.isDirty()) {
						    	var converter = new showdown.Converter(),
						    		text      = e.getContent(),
						    		previewContent      = converter.makeHtml(text);
						    } else {
						    	previewContent = "Default content";
						    }
						    return previewContent;
					  	},
					  	onSave: function(e) {
					  		mylog.log(e);
					  	},
					});

				
				lazyLoad( 	baseUrl+'/plugins/showdown/showdown.min.js',
								baseUrl+'/plugins/bootstrap-markdown/js/bootstrap-markdown.js',
								baseUrl+'/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
								initField);
		    	
			}
		}

	},
	/* **************************************
	*	specific methods for each type of input
	***************************************** */
	init : { 
		/* **************************************
		* add a new line to the multi line process 
		* val can be a value when type array or {"label":"","value":""} when type property
		***************************************** */
		initValues : {},
		properties : {},
		uploader : {},
		initSelect : {},
		initSelectNetwork : [],
		addfield : function ( parentContainer,val,name, type ) {
			mylog.log("dyFObj.init.addfield",parentContainer+' .inputs val',val, "name", name, "type", type);
			if(!$.isEmptyObject($(parentContainer+' .inputs')))
		    {
		    	if($(parentContainer+' .properties').length > 0){
		    		$( dyFObj.init.propertyLineHTML( val, name ) ).fadeIn('slow').appendTo(parentContainer+' .inputs');
		    	}
		    	else
		    		$( dyFObj.init.arrayLineHTML( val,name ) ).fadeIn('slow').appendTo(parentContainer+' .inputs');
		    	
		    	$(".loading_indicator").hide();

		    	$(parentContainer+' .addmultifield:last').focus();
		        dyFObj.init.initMultiFields(parentContainer,name, type);


		        mylog.log("dyFObj.init.initSelect", dyFObj.init.initSelect);
		        if(typeof dyFObj.init.properties[name] != "undefined" && dyFObj.init.properties[name]["type"] == "tags"){
			        $.each(dyFObj.init.initSelect , function(e,v){
						mylog.log( "id " , e, v, dyFObj.init.initValues[ e ].tags);
						if( v == true){
							
							var selectOptions = 
							{
							  "tags": dyFObj.init.initValues[ e ].tags ,
							  "tokenSeparators": [','],
							  "placeholder" : ( $("#"+e).attr("placeholder") ) ? $("#"+e).attr("placeholder") : "",
							};
							
							if(dyFObj.init.initValues[ e ].maximumSelectionLength)
								selectOptions.maximumSelectionLength = dyFObj.init.initValues[e]["maximumSelectionLength"];
							
							if(typeof dyFObj.init.initSelectNetwork != "undefined" && typeof dyFObj.init.initSelectNetwork[e] != "undefined" && dyFObj.init.initSelectNetwork[e].length > 0)
								selectOptions.data=dyFObj.init.initSelectNetwork[e];
							
							$("#"+e).removeClass("form-control").select2(selectOptions);
							if(typeof mainTag != "undefined")
								$("#"+e).val([mainTag]).trigger('change');

							dyFObj.init.initSelect[e]=false;
						}
					});
				}


		    }else 
		    	mylog.error("container doesn't seem to exist : "+parentContainer+' .inputs');
		},
		
		/* **************************************
		* initiliase events 
		* prevent submitting empty fields 
		* remove a field
		* enter key submition
		***************************************** */
		initMultiFields : function (parentContainer,name, typeExtract){
			mylog.log("dyFObj.init.initMultiFields",parentContainer);
		  //manage using Enter to make easy loop editing
		  $(parentContainer+' .addmultifield').unbind('keydown').keydown(function(event) 
		  {
		  	if ( event.keyCode == 13)
		    {
				event.preventDefault();
		        if( $(this).val() != ""){
		        	if( $( this ).parent().next().children(".addmultifield1").val() != "" )
		        		dyFObj.init.addfield(parentContainer,'',name);
		        	else 
		        		$( this ).parent().next().children(".addmultifield1").focus();
		        } 
		        else
		        	toastr.warning("La paire (clef/valeure) doit etre remplie.");
		    }
		  });
		 // var typeExtract=null;
		  //if(typeof initOptions != "undefined" && initOptions.type=="video")
		  	//typeExtract=initOptions.type;
		  var count = $(".addmultifield").length-1;
		  processUrl.getMediaFromUrlContent(parentContainer+" .addmultifield"+count, ".resultGetUrl"+count,1, typeExtract);
		  //manage using Enter to make easy loop editing
		  //for 2nd property field
		  $(parentContainer+' .addmultifield1').unbind('keydown').keydown(function(event) 
		  {
		  	if ( event.ctrlKey &&  event.keyCode == 13)
		    {
				event.preventDefault();
		        if( $(this).val() != "" && $( this ).parent().prev().children(".addmultifield").val() != "" )
		        	dyFObj.init.addfield(parentContainer,'',name);
		        else
		        	toastr.warning("La paire (clef/valeure) doit etre remplie.");
		    }
		  }); 

		  //bind remove btn event 
		  $(parentContainer+' .removePropLineBtn').click(function(){
		  	//$(this).parents().eq(1).prev().remove();
		  	$(this).parents().eq(1).remove();
		  });

		},

		//seems depreceated tka , refactor 15/05
		// clearProperties : function (where)
		// {
		// 	$("#ajaxSV "+where+" .inputs").html("");
		// 	dyFObj.init.propertyLineHTML( {"label":"","value":""} );
		// }

		/* **************************************
		* build HTML for each element of a property list 
		***************************************** */
		propertyLineHTML : function (propVal,name){
			var count = $(".addmultifield").length - 1;
			mylog.log("dyFObj.init.propertyLineHTML",dyFObj.init,  propVal, typeof propVal, name, count);
			mylog.log("dyFObj.init.propertyLineHTML", name);

			var elt = dyFObj.elementObj.dynForm.jsonSchema.properties[name];
			mylog.log("dyFObj.init elt", elt);
			if( !notEmpty(propVal) ) 
					propVal = {"label":"","value":""};

			var classInput = "";

			mylog.log("dyFObj.init.properties",dyFObj.init.properties);
			if(notNull(dyFObj.init.properties) && notNull(dyFObj.init.properties[name])){
				if(!dyFObj.init.initValues["tags"+name+count])
				    dyFObj.init.initValues["tags"+name+count] = {};


				if(dyFObj.init.properties[name]["type"] == "tags"){
					dyFObj.init.initValues["tags"+name+count]["tags"] = tagsList;
				    classInput = "select2TagsInput";	
				}else{						
				    dyFObj.init.initValues["tags"+name+count]["values"] = dyFObj.init.properties[name]["values"];	
				}
				dyFObj.init.initSelect["tags"+name+count] = true;
        		
			}
			


			

			
			mylog.log("dyFObj.init.propertyLineHTML classInput ", classInput);


			var str = '<div class="col-xs-12">'+
						'<div class="space5"></div><div class="col-sm-3">'+
						'<input type="text" id="'+name+count+'" name="'+name+count+'" class="addmultifield addmultifield'+count+' form-control input-md" value="'+propVal.label+'" />'+
						'<img class="loading_indicator" src="'+parentModuleUrl+'/images/news/ajax-loader.gif">'+
					'</div>'+
					'<div class="col-sm-7">'+
						//'<textarea type="text" name="tags'+name+'[]" class="addmultifield'+count+' form-control input-md pull-left" onkeyup="AutoGrowTextArea(this);" placeholder="valeur"   >'+propVal.value+'</textarea>'+
						'<input type="text" class="form-control '+classInput+' addmultifield1" name="tags'+name+count+'" id="tags'+name+count+'" value="" placeholder="" style="width:100%;margin-bottom: 10px;border: 1px solid #ccc;"/>'+
					'</div>'+
					'<div class="col-sm-1">'+
						'<button class="pull-right removePropLineBtn btn letter-red tooltips pull-right" data- data-original-title="Retirer cette ligne" data-placement="bottom"><i class=" fa fa-times" ></i></button>'+
					'</div>'+
					'</div>';

					// TODO Rapha
					// '<div class="col-sm-3">'+
					// 	'<input type="text" name="properties" class="addmultifield form-control input-md" value="" placeholder="'+placeholder+'"/>'+
					// 	'<img class="loading_indicator" src="'+parentModuleUrl+'/images/news/ajax-loader.gif">'+
					// '</div>'+
					// '<div class="col-sm-7">'+
					// 	'<input type="text" class="form-control select2TagsInput" name="tags'+field+'" id="tags'+field+'" value="'+value+'" placeholder="'+placeholder+'" style="width:100%;margin-bottom: 10px;border: 1px solid #ccc;"/>'+
					// 	'<button data-id="'+field+fieldObj.inputType+'" class="pull-right removePropLineBtn btn btn-xs btn-blue" alt="Remove this line"><i class=" fa fa-minus-circle" ></i></button>'+
					// '</div>';

			return str;
		},

		/* **************************************
		* build HTML for each element of array
		***************************************** */
		arrayLineHTML : function (val,name){
			mylog.log("dyFObj.init.arrayLineHTML : ",val);
			if( typeof val == "undefined" ) 
		    	val = "";
		    var count = $(".addmultifield").length;
			var str = 	'<div class="col-sm-12 no-padding margin-top-10">'+
						'<div class="col-sm-10 no-padding">'+
								'<img class="loading_indicator" src="'+parentModuleUrl+'/images/news/ajax-loader.gif">'+
								'<input type="text" name="'+name+'[]" class="addmultifield addmultifield'+count+' form-control input-md value="" placeholder="..."/>'+
							'</div>'+
							'<div class="col-sm-2 sectionRemovePropLineBtn">'+
								'<a href="javascript:" class="removePropLineBtn col-md-12 btn btn-link letter-red" alt="Remove this line"><i class=" fa fa-minus-circle" ></i></a>'+
							'</div>'+
							'<div class="resultGetUrl resultGetUrl'+count+' col-sm-12"></div>'+
						'</div>';

			mylog.log("-------------------------");
			/*'<div class="space5"></div><div class="col-sm-10">'+
						'<img class="loading_indicator" src="'+parentModuleUrl+'/images/news/ajax-loader.gif">'+
						'<input type="text" name="'+name+'[]" class="addmultifield addmultifield'+count+' form-control input-md" value="'+val+'"/>'+
						'<div class="resultGetUrl resultGetUrl'+count+' col-sm-12"></div>'+
						'</div>'+
						'<div class="col-sm-2">'+
						'<button class="pull-right removePropLineBtn btn btn-xs btn-blue tooltips pull-left" data- data-original-title="Retirer cette ligne" data-placement="bottom"><i class=" fa fa-minus-circle" ></i></button>'+
					'</div>';*/
			return str;
		},
		//seems depreceated tka , refactor 15/05
		// buildMediaHTML : function (mediaObj){
		// 	mylog.log("dyFObj.init.buildMediaHTML : ",mediaObj.name);
		// 	var str = '<div class="extracted_url padding-10">'+
		// 			'<div class="extracted_thumb  col-xs-4" id="extracted_thumb">'+
		// 				'<a href="#" class="videoSignal text-white center"><i class="fa fa-3x fa-play-circle-o"></i>'+
		// 				'<input class="videoLink" value="'+mediaObj.content.url+'" type="hidden"></a>'+
		// 				'<img src="'+mediaObj.content.image+'" width="100" height="100">'+
		// 			'</div>'+
		// 			'<div class="extracted_content col-xs-8 padding-5">'+
		// 				'<h4><a href="'+mediaObj.content.url+'" target="_blank" class="lastUrl text-dark">'+mediaObj.name+'</a></h4>'+
		// 				'<p>'+mediaObj.description+'</p>'+
		// 			'</div>'+
		// 		'</div>';
		// 	return str;
		// },
		initRangeHours : function (){
			mylog.log("dyFObj.init.initRangeHours : ");
			$(".addHoursRange").click(function(){
		    	var addToDay=$(this).data("value");
		    	dyFObj.init.addHoursRange(addToDay);
		    });
		},
		bindTimePicker : function (addToDay,countRange, hours){
			mylog.log("dyFObj.init.bindTimePicker", addToDay,countRange, hours);
			var startTime = '06:00';
			var endTime = '19:00';
			if(notNull(hours)){
				startTime = hours.opens;
				endTime = hours.closes;
			}

			if(typeof addToDay != "undefined" && notNull(addToDay)){
				//Init time
				$('#startTime'+addToDay+countRange+', #endTime'+addToDay+countRange).timepicker({
		               // minuteStep: 1,
		              //  appendWidgetTo: 'body',
		              
		            showSeconds: false,
		            showMeridian: false,
		            defaultTime: false
		        });
		        $('#startTime'+addToDay+countRange).timepicker('setTime', startTime);
		        $('#endTime'+addToDay+countRange).timepicker('setTime', endTime);
		        $.each(openingHoursResult, function(e,v){
		        	if(v.dayOfWeek==addToDay){
		        		openingHoursResult[e]["hours"].push({"opens":startTime,"closes":endTime})
		        	}
		        });
		        $(".removeHoursRange").off().on("click",function(){
		        	var dayInc=$(this).data("days");
		        	var inc=$(this).data("value");
		        	$("#hoursRange"+dayInc+" .hoursRange"+inc).remove();
		        	$.each(openingHoursResult, function(e,v){
		        		if(v.dayOfWeek==dayInc){
		        			openingHoursResult[e]["hours"].splice(inc,1);
		        		}
		        	});
		        });

			}else{
				$('.timeInput').timepicker({
	               // minuteStep: 1,
	              //  appendWidgetTo: 'body',
	              
	                showSeconds: false,
	                showMeridian: false,
	                defaultTime: false
	            });
	            $('.startTime').timepicker('setTime', startTime);
	            $('.endTime').timepicker('setTime', endTime);
				//loadTimePicker(initTime);
			}
			$('.timeInput').off().on('changeTime.timepicker', function(e) {
				var typeInc=$(this).data("type");
				var daysInc=$(this).data("days");
				var hoursInc=$(this).data("value");
				$.each(openingHoursResult, function(i,v){
	        		if(v.dayOfWeek==daysInc)
	        			openingHoursResult[i]["hours"][hoursInc][typeInc]=e.time.value;
		        });
			  });
		},
		folderUploadEvent : function( type, id, docT, contentK, foldk){
			if(foldk=="")
				name=(docT=="image") ? trad.noalbumselected : trad.nofolderselected;
			else
				name=navInFolders[foldk].name;
			$(".nameFolder-form").text(name);
		    endPoint=uploadObj.get(type, id, docT, contentK, foldk);
		    $("#imageElement").fineUploader('setEndpoint',endPoint);
			uploadObj.gotoUrl="#page.type."+type+".id."+id+".view.gallery.dir."+docT;
			if(contentK != "")
				uploadObj.gotoUrl+=".key."+contentK;
			if(foldk != "")
				uploadObj.gotoUrl+=".folder."+foldk;
		},
		addHoursRange : function (addToDay){
			mylog.log("dyFObj.init.addHoursRange", addToDay);
			var countRange=$("#hoursRange"+addToDay+" .hoursRange").length;
			mylog.log("countRange", countRange);
			//alert(countRange);
			str='<div class="col-xs-12 hoursRange no-padding hoursRange'+countRange+'" data-value="'+countRange+'">'+
					'<label class="col-md-6 col-sm-6 col-xs-6 text-left control-label no-padding">'+
	        		'<i class="fa fa-hourglass-start"></i> Start hour'+
	    			'</label>'+
	    		'<label class="col-md-6 col-sm-6 col-xs-6 text-left control-label no-padding">'+
	        		'<i class="fa fa-hourglass-end"></i> End hour'+
	    		'</label>'+
	    		'<div class="input-group bootstrap-timepicker timepicker col-md-6 col-sm-6 col-xs-6 no-padding pull-left">'+
						'<input type="text" class="form-control input-small timeInput startTime" data-value="'+countRange+'" data-days="'+addToDay+'" data-type="opens" id="startTime'+addToDay+countRange+'">'+
					'<span class="input-group-addon"><i class="glyphicon glyphicon-time"></i></span>'+
				'</div>'+
	//        		
	    		'<div class="input-group bootstrap-timepicker timepicker col-md-6 col-sm-6 col-xs-6 no-padding pull-left">'+
						'<input type="text" class="form-control input-small timeInput endTime" data-value="'+countRange+'" data-days="'+addToDay+'" data-type="closes" id="endTime'+addToDay+countRange+'">'+
					'<span class="input-group-addon"><i class="glyphicon glyphicon-time"></i></span>'+
				'</div>'+
				'<a href="javascript:;" class="btn btn-default text-red removeHoursRange margin-top-10 col-md-12 col-sm-12" data-days="'+addToDay+'" data-value="'+countRange+'"><i class="fa fa-trash"></i> Remove hours range</a>'+
			'</div>';
			$("#hoursRange"+addToDay).find('.hoursRange:last').after(str);
			dyFObj.init.bindTimePicker(addToDay,countRange);
		},
		/***************************************
		* Build OpeningHour on week HTML system 
		***************************************/
		buildOpeningHours : function (data){
			mylog.log("dyFObj.init.buildOpeningHours", data);
			var arrayDayKeys=["Su","Mo","Tu","We","Th","Fr","Sa"];
			var arrayKeyTrad={
				"Su":{"key":"Su","label":"Sunday"},
				"Mo":{"key":"Mo","label":"Monday"},
				"Tu":{"key":"Tu","label":"Tuesday"},
				"We":{"key":"We","label":"Wednesday"},
				"Th":{"key":"Th","label":"Thursday"},
				"Fr":{"key":"Fr","label":"Friday"},
				"Sa":{"key":"Sa","label":"Saturday"}
			};

			var allWeek = true ;
			if(notNull(data) && typeof data == "object"){
				$.each(data,function(e,v){
					if(typeof v != "object")
						allWeek = false;
				});
			}
			mylog.log("allWeek", allWeek);
			//((allWeek == true) ? "style='display:none;'" : "")
			var str = "<div class='col-xs-12 no-padding'>"+
				"<div id='selectedDays' class='col-xs-12 text-center margin-bottom-10' "+((allWeek == true) ? "style='display:none;'" : "")+">";
					$.each(arrayDayKeys,function(e,v){
						var active = ((typeof data != "object" || typeof data[e] == "object" ) ? "active"  : "");
						str+="<div class='inline'>"+
								'<a class="btn btn-default btn-select-day '+active+'" data-key="'+v+'" href="javascript:;">'+arrayKeyTrad[v].key+'</a>'+
							"</div>";
					});
			str+="</div>"+
				"<div id='daysList' class='col-xs-12 no-padding'>";
					$.each(arrayDayKeys,function(e,v){

						var noneDay = ( (typeof data != "object" || typeof data[e] == "object")  ? ""  : "display:none;");
						var checked = (( typeof data != "object" || (typeof data[e] == "object" && data[e].allDay == "true") ) ? "checked"  : "");
						var noneHours = ((typeof data[e] == "object" && notNull(data[e].hours) ) ? ""  : "style='display:none;'");
						// mylog.log("typeof data[e]", typeof data[e], data[e]);
						// mylog.log("noneDay", noneDay);
						// mylog.log("checked", checked);
						// mylog.log("noneHours", noneHours);
				str+=	"<div class='col-xs-12 padding-bottom-10 padding-top-10 margin-bottom-5 shadow2' id='contentDays"+v+"' style='border-bottom:1px solid lightgray; "+noneDay+"'>"+
							"<div class='col-xs-12 no-padding'>"+
								'<label class="col-md-4 col-sm-5 col-xs-6 text-left control-label no-padding no-margin" for="allDaysMo">'+
									'<i class="fa fa-calendar"></i> '+arrayKeyTrad[v].label+
								'</label>'+
								'<input type="checkbox" class="allDaysWeek" id="allDays'+v+'" value="true" data-key="'+v+'" '+checked+'/> '+tradDynForm.allday+
							"</div>"+
							'<div class="col-xs-12" id="hoursRange'+v+'" '+noneHours+'>';
								if( typeof data[e] == "object" && notNull(data[e].hours) ){
									$.each(data[e].hours,function(kHour,vHour){
										mylog.log("hours", kHour, vHour);
										str +='<div class="col-xs-12 hoursRange no-padding hoursRange'+kHour+'" data-value="'+kHour+'">'+
												'<label class="col-md-6 col-sm-6 col-xs-6 text-left control-label no-padding">'+
								        		'<i class="fa fa-hourglass-start"></i> Start hour'+
								    			'</label>'+
								    		'<label class="col-md-6 col-sm-6 col-xs-6 text-left control-label no-padding">'+
								        		'<i class="fa fa-hourglass-end"></i> End hour'+
								    		'</label>'+
								    		'<div class="input-group bootstrap-timepicker timepicker col-md-6 col-sm-6 col-xs-6 no-padding pull-left">'+
													'<input type="text" class="form-control input-small timeInput startTime" data-value="'+kHour+'" data-days="'+v+'" data-type="opens" id="startTime'+v+kHour+'">'+
												'<span class="input-group-addon"><i class="glyphicon glyphicon-time"></i></span>'+
											'</div>'+
								    		'<div class="input-group bootstrap-timepicker timepicker col-md-6 col-sm-6 col-xs-6 no-padding pull-left">'+
													'<input type="text" class="form-control input-small timeInput endTime" data-value="'+kHour+'" data-days="'+v+'" data-type="closes" id="endTime'+v+kHour+'">'+
												'<span class="input-group-addon"><i class="glyphicon glyphicon-time"></i></span>'+
											'</div>';
										if(kHour != 0)
											str += '<a href="javascript:;" class="btn btn-default text-red removeHoursRange margin-top-10 col-md-12 col-sm-12" data-days="'+v+'" data-value="'+kHour+'"><i class="fa fa-trash"></i> Remove hours range</a>';
										str += '</div>';

									});
								}else{
									str+= '<div class="col-xs-12 hoursRange no-padding" data-value="0">'+
										'<label class="col-md-6 col-sm-6 col-xs-6 text-left control-label no-padding" for="allDaysMo">'+
											'<i class="fa fa-hourglass-start"></i> Start hour'+
										'</label>'+
										'<label class="col-md-6 col-sm-6 col-xs-6 text-left control-label no-padding" for="allDaysMo">'+
											'<i class="fa fa-hourglass-end"></i> End hour'+
										'</label>'+
										'<div class="input-group bootstrap-timepicker timepicker col-md-6 col-sm-6 col-xs-6 no-padding pull-left">'+
											'<input type="text" class="form-control input-small timeInput startTime" data-value="0" data-days="'+v+'" data-type="opens" id="startTime'+v+'0">'+
											'<span class="input-group-addon"><i class="glyphicon glyphicon-time"></i></span>'+
										'</div>'+
										'<div class="input-group bootstrap-timepicker timepicker col-md-6 col-sm-6 col-xs-6 no-padding pull-left">'+
											'<input type="text" class="form-control input-small timeInput endTime" data-value="0" data-days="'+v+'" data-type="closes" id="endTime'+v+'0">'+
											'<span class="input-group-addon"><i class="glyphicon glyphicon-time"></i></span>'+
										'</div>'+
									'</div>';
								}
								str+= '<a href="javascript:;" class="btn btn-default text-green addHoursRange margin-top-10 col-md-12 col-sm-12" data-value="'+v+'"><i class="fa fa-plus"></i> Add an hours range</a>'+
							'</div>'+
						"</div>";
					});
				str+="</div>"+
				'<input type="hidden" name="openingHours" value="true"/>'+
			"</div>";
			return str;
		},

		/* **************************************
		* init Boostrap Switch
		***************************************** */
		initbootstrapSwitch : function (el,change, css){
			mylog.log("dyFObj.init.initbootstrapSwitch", el,change, css);
			var initSwitch = function(){
				mylog.log("init bootstrap switch");
				$(el).bootstrapSwitch();
				if(typeof change == "function"){
					$(el).on('switchChange.bootstrapSwitch', function(event, state) {
						change($(this));
					});
				}
				if(notNull(css))
					$(el).parent().parent().css(css);
				else
					$(el).parent().parent().addClass("form-group");
			};

			if( jQuery.isFunction(jQuery.fn.bootstrapSwitch) )
				initSwitch();
		    else {
		    	lazyLoad( baseUrl+'/plugins/bootstrap-switch/dist/js/bootstrap-switch.min.js', 
						  baseUrl+'/plugins/bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.min.css',
						  initSwitch);
	    	}
			
		}
	},
	searchExist : function (searchValue,types,contact){
		
		searchType = (types) ? types : ["organizations", "projects", "events"/*, "needs"*/, "citoyens"];

		var data = { 	 
			"name" : searchValue,
			// "locality" : "", a otpimiser en utilisant la localité 
			"searchType" : searchType,
			"indexMin" : 0,
			"indexMax" : 50
		};
		$("#listSameName").html("<i class='fa fa-spin fa-circle-o-notch'></i> Vérification d'existence");
		$("#similarLink").show();
		$("#btn-submit-form").html('<i class="fa  fa-spinner fa-spin"></i>').prop("disabled",true);
		$.ajax({
	      type: "POST",
	          url: baseUrl+"/" + moduleId + "/search/globalautocomplete",
	          data: data,
	          dataType: "json",
	          error: function (data){
	             mylog.log("error"); mylog.dir(data);
	             $("#btn-submit-form").html('Valider <i class="fa fa-arrow-circle-right"></i>').prop("disabled",false);
	          },
	          success: function(data){
	          	mylog.log("searchExist", data);
	            var str = "";
	 			var compt = 0;
	 			var msg = "Verifiez si cet élément n'existe pas déjà";
	 			$("#btn-submit-form").html('Valider <i class="fa fa-arrow-circle-right"></i>').prop("disabled",false);
	 			cotmp = {};
	 			$.each(data.results, function(id, elem) {
	  				mylog.log("similarlink globalautocomplete", elem);
	  				city = "";
					postalCode = "";
					var htmlIco ="<i class='fa fa-users'></i>";
					if(elem.type){
						typeIco = elem.type;
						htmlIco ="<i class='fa fa-"+dyFInputs.get(elem.type).icon +"'></i>";
					}
					where = "";
					if (elem.address != null) {
						city = (elem.address.addressLocality) ? elem.address.addressLocality : "";
						postalCode = (elem.address.postalCode) ? elem.address.postalCode : "";
						if( notEmpty( city ) && notEmpty( postalCode ) )
						where = ' ('+postalCode+" "+city+")";
					}
					//var htmlIco="<i class='fa fa-calendar fa-2x'></i>";
					if("undefined" != typeof elem.profilImageUrl && elem.profilImageUrl != ""){
						htmlIco= "<img width='25' height='25' alt='image' class='img-circle' src='"+baseUrl+elem.profilThumbImageUrl+"'/>";
					}
					
					if(contact == true){
						cotmp[id] = {id:id, name : elem.name};
						str += 	"<div class='col-xs-12 padding-10'>"+
									"<a href='javascript:;' onclick='fillContactFields( \""+id+"\" );' class='btn btn-xs btn-default w50p' >"+
										htmlIco + " " + elem.name + "</br>" + where +
									"</a>" +
								"</div>";
						msg = "Verifiez si le contact est dans Communecter";
					}else if(dySObj.surveys != null){
						str +='<a href="javascript:;" onclick="dySObj.goForward(\''+id+'\',\''+addslashes(elem.name)+'\', \''+elem.slug+'\', \''+elem.email+'\' );" class="btn btn-xs btn-danger col-xs-12 w50p text-left padding-5 margin-5">'+
							"<span>"+ htmlIco +"</span> <span> " + elem.name+"</br>"+where+ "</span>"+
						"</a>"; 
					}else{
						str += 	"<a target='_blank' href='#page.type."+ elem.type +".id."+ id +"' class='btn btn-xs btn-danger col-xs-12 w50p text-left padding-5 margin-5' style='height:42px' >"+
								"<span>"+ htmlIco +"</span> <span> " + elem.name+"</br>"+where+ "</span>"+
							"</a>";
					}
					//str += directory.lightPanelHtml(elem);  
					
					compt++;


	  			});
				
				if (compt > 0) {
					$("#listSameName").html("<div class='col-sm-12 light-border text-red'> <i class='fa fa-eye'></i> "+msg+" : </div>"+str);
					$("#listSameName").show();
				} else {
					$("#listSameName").html("<span class='txt-green'><i class='fa fa-thumbs-up text-green'></i> Aucun élément avec ce nom.</span>");

				}


				
	          }
	 	});
	},
	formInMap : {
		actived : false,
		timeoutAddCity : null,
		countryList : null,
		map : null,
		NE_insee : "",
		NE_lat : "",
		NE_lng : "",
		NE_city : "",
		NE_cp : "",
		NE_street : "",
		NE_country : "",
		NE_level4 : "",
		NE_level4Name : "",
		NE_level3 : "",
		NE_level3Name : "",
		NE_level2 : "",
		NE_level2Name : "",
		NE_level1 : "",
		NE_level1Name : "",
		NE_localityId : "",
		NE_betweenCP : false,
		geoShape : "",
		typeSearchInternational : "",
		formType : "",
		updateLocality : false,
		addressesIndex : false,
		saveCities : {},
		bindActived : false,
		rules : {
			required : false,
			country : false,
			level4 : false,
			level3 : false,
			level2 : false,
			level1 : false,
		},
		initRules : function(rules){

			if(typeof rules != "undefined" && rules != null){

				if(notNull(params.required))
					dyFObj.formInMap.rules.required = rules.required;
			}
			
		},
		initMap : function(){
			mylog.log("initMap");
			
			var ListPath = [
				modules.map.assets+'/leaflet/leaflet.css',
				modules.map.assets+'/leaflet/leaflet.js',
				modules.map.assets+'/markercluster/MarkerCluster.css',
				modules.map.assets+'/markercluster/MarkerCluster.Default.css',
				modules.map.assets+'/markercluster/leaflet.markercluster.js',
				modules.map.assets+'/js/map.js',
				modules.map.assets+'/css/map.css',
			];

			lazyLoadMany2( ListPath, function() { return true; }, true);
			// alert("HERE");
			


			// if( !$('script[src="'+modules.map.assets+'/js/map.js"]').length ){

			// 	lazyLoad( modules.map.assets+'/js/map.js', null, function() { mylog.log("initMap HERE"); dyFObj.formInMap.initMap(); } );
			// 	lazyLoad( modules.map.assets+'/js/map.js', null, function() { return }, true );
			// }
			// else if( !$('script[src="'+modules.map.assets+'/css/map.css"]').length )
			// 	lazyLoad( modules.map.assets+'/css/map.css', null, function() { dyFObj.formInMap.initMap(); });
			// else{
			// 	var paramsMapLocality = {
			// 		container : "divMapLocality",
			// 		latLon : [ 39.74621, -104.98404],
			// 		activeCluster : false,
			// 		zoom : 16
			// 	};
			// 	mapObj.init(paramsMapLocality);
			// 	var elt = { 
			// 		type : "citoyens",
			// 		geo : {
			// 			latitude :  39.74621,
			// 			longitude : -104.98404,
			// 		}
			// 	};
			// 	var opt = {
			// 		draggable: true
			// 	};
			// 	mapObj.addMarker(elt, false, true, opt);
			// }
		},
		init : function(){
			
			mylog.log("forminmap showMarkerNewElement");
			mylog.log("formType", dyFObj.formInMap.formType);
			$(".locationBtn").addClass("hidden");
			
			dyFObj.formInMap.initCountry();

			$('#ajaxFormModal [name="newElement_country"]').val(dyFObj.formInMap.NE_country);
			mylog.log("dyFObj.formInMap.NE_country ", dyFObj.formInMap.NE_country);
			if(dyFObj.formInMap.NE_country != ""){
				$("#ajaxFormModal #divPostalCode").removeClass("hidden");
				$("#ajaxFormModal #divCity").removeClass("hidden");
			}
			mylog.log("dyFObj.formInMap.bindActived", dyFObj.formInMap.bindActived);
			if(dyFObj.formInMap.bindActived == false)
				dyFObj.formInMap.bindFormInMap();

			if(userId == "" || dyFObj.formInMap.NE_insee == "")
				$("#ajaxFormModal #divStreetAddress").addClass("hidden");
			else
				$("#ajaxFormModal #divStreetAddress").removeClass("hidden");

			dyFObj.formInMap.resumeLocality();

			if(typeof networkJson == "undefined" || networkJson == null)
				$("#ajaxFormModal #mapLegende").addClass("hidden");

			dyFObj.formInMap.newAddress(false);
			//dyFObj.formInMap.initMap();

			mylog.log("forminmap showMarkerNewElement END!");

			
		},
		initCountry : function(){
			mylog.log("formInMap initCountry");
			if ( 	typeof dySObj != "undefined" && 
					typeof dySObj.surveys != "undefined" && 
					typeof dySObj.surveys.parentSurvey != "undefined" && 
					typeof dySObj.surveys.parentSurvey.countryCode != "undefined" && 
					dySObj.surveys.parentSurvey.countryCode != ""){
				mylog.log("formInMap initCountry if");
				dyFObj.formInMap.NE_country = dySObj.surveys.parentSurvey.countryCode;
			} else if( notNull(currentUser) && notNull(currentUser.addressCountry) && dyFObj.formInMap.NE_country == "" ){
				mylog.log("formInMap initCountry elseif");
				dyFObj.formInMap.NE_country = currentUser.addressCountry;
			}else{
				mylog.log("formInMap initCountry else");
				dyFObj.formInMap.NE_country = "";
			}
			mylog.log("formInMap initCountry end", dyFObj.formInMap.NE_country);
		},
		initVarNE : function(){
			mylog.log("initVarNE");
			dyFObj.formInMap.NE_insee = "";
			dyFObj.formInMap.NE_lat = "";
			dyFObj.formInMap.NE_lng = "";
			dyFObj.formInMap.NE_city = "";
			dyFObj.formInMap.NE_cp = "";
			dyFObj.formInMap.NE_street = "";
			dyFObj.formInMap.NE_country = "";
			dyFObj.formInMap.NE_level4 = "";
			dyFObj.formInMap.NE_level4Name = "";
			dyFObj.formInMap.NE_level3 = "";
			dyFObj.formInMap.NE_level3Name = "";
			dyFObj.formInMap.NE_level2 = "";
			dyFObj.formInMap.NE_level2Name = "";
			dyFObj.formInMap.NE_level1 = "";
			dyFObj.formInMap.NE_level1Name = "";
			dyFObj.formInMap.NE_localityId = "";
			dyFObj.formInMap.NE_betweenCP = false;

			dyFObj.formInMap.initCountry();
		},
		initDropdown : function(){
			mylog.log("initDropdown");
			$("#dropdown-newElement_cp-found").html("<li><a href='javascript:' class='disabled'>"+trad['Currently researching']+"</a></li>");
			$("#dropdown-newElement_city-found").html("<li><a href='javascript:' class='disabled'>"+trad['Search a city, a town or a postal code'] +"</a></li>");
		},
		initHtml : function(){
			dyFObj.formInMap.initCountry();	
			//$('#ajaxFormModal [name="newElement_country"]').val(dyFObj.formInMap.NE_country);
			$('#ajaxFormModal [name="newElement_city"]').val("");
			$('#ajaxFormModal [name="newElement_street"]').val("");

			$("#ajaxFormModal #divStreetAddress").addClass("hidden");

			if(dyFObj.formInMap.NE_country == ""){
				$("#ajaxFormModal #divCity").addClass("hidden");
			}
			dyFObj.formInMap.showWarningGeo(false);
		},
		resumeLocality : function(cancel){
			if(dyFObj.formInMap.NE_street != ""){
				$('#ajaxFormModal #street_sumery_value').html(dyFObj.formInMap.NE_street );
				$('#ajaxFormModal #street_sumery').removeClass("hidden");
			}else
				$('#ajaxFormModal #street_sumery').addClass("hidden");

			if(dyFObj.formInMap.NE_cp != ""){
				$('#ajaxFormModal #cp_sumery_value').html(dyFObj.formInMap.NE_cp );
				$('#ajaxFormModal #cp_sumery').removeClass("hidden");
			}else
				$('#ajaxFormModal #cp_sumery').addClass("hidden");

			if(dyFObj.formInMap.NE_city != ""){
				$('#ajaxFormModal #city_sumery_value').html(dyFObj.formInMap.NE_city);
				$('#ajaxFormModal #city_sumery').removeClass("hidden");
			}else
				$('#ajaxFormModal #city_sumery').addClass("hidden");

			if(dyFObj.formInMap.NE_country != ""){
				$('#ajaxFormModal #country_sumery_value').html(dyFObj.formInMap.NE_country);
				$('#ajaxFormModal #country_sumery').removeClass("hidden");
			}else
				$('#ajaxFormModal #country_sumery').addClass("hidden");


			if(dyFObj.formInMap.NE_country != "" && dyFObj.formInMap.NE_city != ""){
				//$("#btnValideAddress").prop('disabled', false);
				$("#ajaxFormModal #btnValideAddress").show();
			}else{
				//$("#btnValideAddress").prop('disabled', true);
				$("#ajaxFormModal #btnValideAddress").hide();
			}
		},
		bindFormInMap : function(){
			mylog.log("bindFormInMap");

			$('#ajaxFormModal  [name="newElement_country"]').change(function(){
				mylog.log("formInMap.NE_country D", $(this).val(), $('#ajaxFormModal  [name="newElement_country"]').val());
				dyFObj.formInMap.initVarNE();
				dyFObj.formInMap.NE_country = $(this).val() ;
				mylog.log("formInMap.NE_country M", dyFObj.formInMap.NE_country );
				dyFObj.formInMap.resumeLocality();
				//dyFObj.formInMap.initHtml();
				// $("#country_sumery_value").html($('#ajaxFormModal [name="newElement_country"]').val());
				// $('#ajaxFormModal [name="newElement_city"]').val("");
				// $("#country_sumery_value").html($('#ajaxFormModal [name="newElement_country"]').val());
				// $("#btnValideAddress").prop('disabled', true);
				$("#ajaxFormModal #btnValideAddress").hide();
				$("#ajaxFormModal #divStreetAddress").addClass("hidden");

				dyFObj.formInMap.initDropdown();
				mylog.log("formInMap.NE_country F", dyFObj.formInMap.NE_country, typeof dyFObj.formInMap.NE_country, dyFObj.formInMap.NE_country.length);
				if(dyFObj.formInMap.NE_country != ""){
					$("#ajaxFormModal #divCP").addClass("hidden");
					$("#ajaxFormModal #divCity").removeClass("hidden");
				}else{
					$("#ajaxFormModal #divCity").addClass("hidden");
				}
					
			});

				// ---------------- newElement_city
			$('#ajaxFormModal [name="newElement_city"]').keyup(function(){ 
				$("#dropdown-city-found").show();
				mylog.log("newElement_city", $('#ajaxFormModal [name="newElement_city"]').val().trim().length);
				if($('#ajaxFormModal [name="newElement_city"]').val().trim().length > 1){
					dyFObj.formInMap.NE_city = $('#ajaxFormModal [name="newElement_city"]').val();
					dyFObj.formInMap.changeSelectCountrytim();

					if(notNull(dyFObj.formInMap.timeoutAddCity)) 
						clearTimeout(dyFObj.formInMap.timeoutAddCity);

					dyFObj.formInMap.timeoutAddCity = setTimeout(function(){ 
						dyFObj.formInMap.autocompleteFormAddress("locality", $('#ajaxFormModal [name="newElement_city"]').val()); 
					}, 500);

				}
			});
			// ---------------- newElement_cp
			$('#ajaxFormModal [name="newElement_cp"]').keyup(function(){ 
				mylog.log("newElement_cp", $('#ajaxFormModal [name="newElement_cp"]').val().trim());
				dyFObj.formInMap.NE_cp = $('#ajaxFormModal [name="newElement_cp"]').val().trim();
				dyFObj.formInMap.btnValideDisable( ($('#ajaxFormModal [name="newElement_cp"]').val().trim().length == 0 ? true : false) );

			});

			// ---------------- newElement_streetAddress
			$("#ajaxFormModal #newElement_btnSearchAddress").click(function(){
				$(".dropdown-menu").hide();
				dyFObj.formInMap.searchAdressNewElement();
			});

			$('#ajaxFormModal [name="newElement_street"]').keyup(function(){ 
				dyFObj.formInMap.showWarningGeo( ( ( $('#ajaxFormModal [name="newElement_street"]').val().length > 0 ) ? true : false ) );
				dyFObj.formInMap.NE_street = $('#ajaxFormModal [name="newElement_street"]').val().trim();
				dyFObj.formInMap.resumeLocality();
			});

			// ---------------- newElement_streetAddress
			$("#ajaxFormModal #btnValideAddress").click(function(){
				dyFObj.formInMap.valideLocality();
			});


			$("#ajaxFormModal #newAddress").click(function(){
				dyFObj.formInMap.newAddress(true);
			});

		},
		showWarningGeo : function(bool){
			mylog.log("showWarningGeo");
			if(bool == true){
				$("#ajaxFormModal #alertGeo").removeClass("hidden");
				$("#ajaxFormModal #newElement_btnSearchAddress").removeClass("btn-default");
				$("#ajaxFormModal #newElement_btnSearchAddress").addClass("btn-warning");
			}else{
				$("#ajaxFormModal #alertGeo").addClass("hidden");
				$("#ajaxFormModal #newElement_btnSearchAddress").removeClass("btn-warning");
				$("#ajaxFormModal #newElement_btnSearchAddress").addClass("btn-default");
			}
		},
		createLocalityObj : function(withUnikey){
			mylog.log("createLocalityObj", dyFObj.formInMap);
			
			var locality = {
				address : {
					"@type" : "PostalAddress",
					codeInsee : dyFObj.formInMap.NE_insee,
					streetAddress : dyFObj.formInMap.NE_street.trim(),
					postalCode : dyFObj.formInMap.NE_cp,
					addressLocality : dyFObj.formInMap.NE_city,
					level1 : dyFObj.formInMap.NE_level1,
					level1Name : dyFObj.formInMap.NE_level1Name,
					addressCountry : dyFObj.formInMap.NE_country,
					localityId : dyFObj.formInMap.NE_localityId
					
				},
				geo : {
					"@type" : "GeoCoordinates",
					latitude : dyFObj.formInMap.NE_lat,
					longitude : dyFObj.formInMap.NE_lng
				},
				geoPosition : {
					"type" : "Point",
					"coordinates" : [ parseFloat(dyFObj.formInMap.NE_lng), parseFloat(dyFObj.formInMap.NE_lat) ]
				}
			};

			if( notEmpty(dyFObj.formInMap.NE_level2) && dyFObj.formInMap.NE_level2 != "undefined" ){
				locality.address.level2 = dyFObj.formInMap.NE_level2;
				locality.address.level2Name = dyFObj.formInMap.NE_level2Name;
			}
			if(notEmpty(dyFObj.formInMap.NE_level3 != "" && dyFObj.formInMap.NE_level3 != "undefined")){
				locality.address.level3 = dyFObj.formInMap.NE_level3;
				locality.address.level3Name = dyFObj.formInMap.NE_level3Name;
			}
			if(notEmpty(dyFObj.formInMap.NE_level4 != "" && dyFObj.formInMap.NE_level4 != "undefined")){
				locality.address.level4 = dyFObj.formInMap.NE_level4;
				locality.address.level4Name = dyFObj.formInMap.NE_level4Name;
			}

			if(typeof withUnikey != "undefined" && withUnikey == true){
				var unikey = dyFObj.formInMap.NE_country + "_" + dyFObj.formInMap.NE_insee + "-" + dyFObj.formInMap.NE_cp;
				locality.unikey = unikey;
			}

			return locality;
		},
		newAddress : function(newA){
			mylog.log("newAddress !", newA);
			if(notEmpty(newA) && newA == true ){
				$('#ajaxFormModal .formLocality').show();
				$('#ajaxFormModal #sumery').show();
				$('#ajaxFormModal #divMapLocality').show();
				$('#ajaxFormModal #divNewAddress').hide();

				var paramsMapLocality = {
					container : "divMapLocality",
					latLon : [ 39.74621, -104.98404],
					activeCluster : false,
					zoom : 16
				};
				var elt = { 
					type : "citoyens",
					geo : {
						latitude :  39.74621,
						longitude : -104.98404,
					}
				};
				var opt = {
					draggable: true
				};

				dyFObj.formInMap.initCountry();
				if(dyFObj.formInMap.NE_country != ""){
					$("#ajaxFormModal #divPostalCode").removeClass("hidden");
					$("#ajaxFormModal #divCity").removeClass("hidden");
				}

			}else{
				$('#ajaxFormModal .formLocality').hide();
				$('#ajaxFormModal #sumery').hide();
				$('#ajaxFormModal #divMapLocality').hide();
				$('#ajaxFormModal #divNewAddress').show();
			}
		},
		valideLocality : function(country){
			mylog.log("valideLocality ", notEmpty(dyFObj.formInMap.NE_lat));
			if(notEmpty(dyFObj.formInMap.NE_lat)){
				locObj = dyFObj.formInMap.createLocalityObj();
				mylog.log("forminmap copyMapForm2Dynform", locObj);
				dyFInputs.locationObj.copyMapForm2Dynform(locObj);
				dyFInputs.locationObj.addLocationToForm(locObj);
			}

			dyFObj.formInMap.initVarNE();
			dyFObj.formInMap.resumeLocality();
			dyFObj.formInMap.initHtml();
			dyFObj.formInMap.newAddress(false);


		},
		// Pour effectuer une recherche a la Réunion avec Nominatim, il faut choisir le code de la France, pas celui de la Réunion
		changeCountryForNominatim : function(country){
			var codeCountry = {
				"FR" : ["RE", "GP", "GF", "MQ", "YT", "NC", "PM"]
			};
			$.each(codeCountry, function(key, countries){
				if(countries.indexOf(country) != -1)
			 		country = key;
			});
			return country ;
		},
		searchAdressNewElement : function(){ 
			mylog.log("searchAdressNewElement");
			var providerName = "";
			var requestPart = "";

			var street 	= ($('#ajaxFormModal [name="newElement_street"]').val()  != "") ? $('#ajaxFormModal [name="newElement_street"]').val() : "";
			var city 	= dyFObj.formInMap.NE_city;
			var cp 		= dyFObj.formInMap.NE_cp;
			var countryCode = dyFObj.formInMap.NE_country;


			if($('#ajaxFormModal [name="newElement_street"]').val() != ""){
				providerName = "nominatim";
				dyFObj.formInMap.typeSearchInternational = "address";
				//construction de la requete
				requestPart = addToRequest(requestPart, street);
				requestPart = addToRequest(requestPart, city);
				requestPart = addToRequest(requestPart, cp);
			}else{
				providerName = "communecter"
				dyFObj.formInMap.typeSearchInternational = "city";
				//construction de la requete
				if(cp != ""){
					requestPart = addToRequest(requestPart, cp);
				}
			}

			dyFObj.formInMap.NE_street = $('#ajaxFormModal [name="newElement_street"]').val();

			$("#ajaxFormModal #dropdown-newElement_streetAddress-found").html("<li><a href='javascript:'><i class='fa fa-spin fa-refresh'></i> "+trad.currentlyresearching+"</a></li>");
			$("#ajaxFormModal #dropdown-newElement_streetAddress-found").show();
			mylog.log("countryCode", countryCode);
			
			var countryDataGouv = ["FR","GP","MQ","GF","RE","PM","YT"];
			if(countryDataGouv.indexOf(countryCode) != -1){
				countryCode = dyFObj.formInMap.changeCountryForNominatim(countryCode);
				mylog.log("countryCodeHere", countryCode);
				dyFObj.formInMap.callDataGouv(requestPart, countryCode);
				
			}else{
				countryCode = dyFObj.formInMap.changeCountryForNominatim(countryCode);
				mylog.log("countryCode", countryCode);
				dyFObj.formInMap.callNominatim(requestPart, countryCode);
			}
			
			//dyFObj.formInMap.btnValideDisable(false);
		},
		addResultsInForm : function (commonGeoObj, countryCode){
			//success
			mylog.log("addResultsInForm success callGeoWebService", commonGeoObj, countryCode);
			//mylog.dir(objs);
			var res = commonGeoObj; //getCommonGeoObject(objs, providerName);
			mylog.dir(res);
			var html = "";
			$.each(res, function(key, value){ //mylog.log(allCities);
				if(notEmpty(value.countryCode)){
					mylog.log("Country Code",value.countryCode.toLowerCase(), countryCode.toLowerCase());
					if(value.countryCode.toLowerCase() == countryCode.toLowerCase()){ 
						html += "<li><a href='javascript:;' class='item-street-found' data-lat='"+value.geo.latitude+"' data-lng='"+value.geo.longitude+"'><i class='fa fa-marker-map'></i> "+value.name+"</a></li>";
					}
				}
			});
			if(html == "") html = "<i class='fa fa-ban'></i> "+trad.noresult;
			$("#ajaxFormModal #dropdown-newElement_streetAddress-found").html(html);
			$("#ajaxFormModal #dropdown-newElement_streetAddress-found").show();

			$("#ajaxFormModal .item-street-found").click(function(){
				// if(typeof Sig != "undefined"){
				// 	Sig.markerFindPlace.setLatLng([$(this).data("lat"), $(this).data("lng")]);
				// 	Sig.map.panTo([$(this).data("lat"), $(this).data("lng")]);
				// 	Sig.map.setZoom(16);
				// }

				//mapObj.setLatLng([$(this).data("lat"), $(this).data("lng")], 0);

				mylog.log("lat lon", $(this).data("lat"), $(this).data("lng"));
				$("#ajaxFormModal #dropdown-newElement_streetAddress-found").hide();
				$('#ajaxFormModal [name="newElement_lat"]').val($(this).data("lat"));
				$('#ajaxFormModal [name="newElement_lng"]').val($(this).data("lng"));
				
				
				dyFObj.formInMap.NE_lat = $(this).data("lat");
				dyFObj.formInMap.NE_lng = $(this).data("lng");
				dyFObj.formInMap.showWarningGeo(false);
				
			});
		},
		callDataGouv(requestPart, countryCode){ /*countryCode=="FR"*/
			mylog.log('callDataGouv');
			showMsgListRes("<i class='fa fa-spin fa-refresh'></i> "+trad.currentlyresearching+" <small>Data Gouv</small>");
			callGeoWebService("data.gouv", requestPart, countryCode,
				function(objDataGouv){ /*success nominatim*/
					mylog.log("SUCCESS DataGouv"); 

					if(objDataGouv.features.length != 0){
						mylog.log('Résultat trouvé chez DataGouv !'); mylog.dir(objDataGouv);
						var commonGeoObj = getCommonGeoObject(objDataGouv.features, "data.gouv");
						var res = dyFObj.formInMap.addResultsInForm(commonGeoObj, countryCode);
						if(res == 0) 
							dyFObj.formInMap.callNominatim(requestPart, countryCode);
					}else{
						mylog.log('Aucun résultat chez DataGouv');
						dyFObj.formInMap.callNominatim(requestPart, countryCode);
					}
				}, 
				function(thisError){ /*error nominatim*/
					mylog.log("ERROR DataGouv");
					mylog.dir(thisError);
				}
			);
		},
		callNominatim : function (requestPart, countryCode){
			mylog.log('callNominatim');
			showMsgListRes("<i class='fa fa-spin fa-refresh'></i> "+trad.currentlyresearching+" <small>Nominatim</small>");
			callGeoWebService("nominatim", requestPart, countryCode,
				function(objNomi){ /*success nominatim*/
					mylog.log("SUCCESS nominatim"); 

					if(objNomi.length != 0){
						mylog.log('Résultat trouvé chez Nominatim !'); mylog.dir(objNomi);

						var commonGeoObj = getCommonGeoObject(objNomi, "nominatim");
						var res = dyFObj.formInMap.addResultsInForm(commonGeoObj, countryCode);

						if(res == 0) 
							callGoogle(requestPart, countryCode);
					}else{
						mylog.log('Aucun résultat chez Nominatim');
						callGoogle(requestPart, countryCode);
					}
				}, 
				function(thisError){ /*error nominatim*/
					mylog.log("ERROR nominatim");
					mylog.dir(thisError);
				}
			);
		},
		autocompleteFormAddress : function(currentScopeType, scopeValue){
			mylog.log("autocompleteFormAddress", currentScopeType, scopeValue);
			$("#ajaxFormModal #dropdown-newElement_"+currentScopeType+"-found").html("<li><a href='javascript:'><i class='fa fa-refresh fa-spin'></i></a></li>");
			$("#ajaxFormModal #dropdown-newElement_"+currentScopeType+"-found").show();

			//costum.admins[userId].isAdmin

			var paramsSearch =  {
				type: currentScopeType, 
				scopeValue: scopeValue,
				geoShape: true,
				formInMap: true,
				countryCode : $('#ajaxFormModal [name="newElement_country"]').val()
			} ;
			// mamp
			if(	typeof dyFObj[dyFObj.activeElem] != "undefined" &&
				typeof dyFObj[dyFObj.activeElem].dynFormCostum != "undefined" && 
				typeof dyFObj[dyFObj.activeElem].dynFormCostum.filters != "undefined" && 
				typeof dyFObj[dyFObj.activeElem].dynFormCostum.filters.locations != "undefined" ){
				paramsSearch.subParams = dyFObj[dyFObj.activeElem].dynFormCostum.filters.locations.subParams;
			}

			$.ajax({
				type: "POST",
				url: baseUrl+"/"+moduleId+"/city/autocompletemultiscope",
				data: paramsSearch,
				dataType: "json",
				success: function(data){
					mylog.log("autocompleteFormAddress success", data);
					html="";
					var inseeGeoSHapes = {};
					dyFObj.formInMap.saveCities = {};
					$.each(data.cities, function(key, value){
						mylog.log("autocompleteFormAddress value", value);
						var insee = value.insee;
						var country = value.country;
						if(notEmpty(value.save) &&  value.save == true){
							dyFObj.formInMap.saveCities[insee] = value;
						}
						if(notEmpty(value.geoShape))
							inseeGeoSHapes[insee] = value.geoShape.coordinates[0];

						if(currentScopeType == "city" || currentScopeType == "locality") { 
							if(value.postalCodes.length > 0){
								$.each(value.postalCodes, function(keyCP, valueCP){
									var val = valueCP.name; 
									var lbl = valueCP.postalCode ;
									var lat = valueCP.geo.latitude;
									var lng = valueCP.geo.longitude;

									var lblList = value.name ;

									if(valueCP.name != value.name)
										lblList +=  ", " + valueCP.name ;

									if(notEmpty(valueCP.postalCode))
										lblList += ", " + valueCP.postalCode ;
									
									if(notEmpty(value.level4Name))
										lblList += " ( " + value.level4Name + " ) ";
									else if(notEmpty(value.level3Name))
										lblList += " ( " + value.level3Name + " ) ";
									else if(notEmpty(value.level2Name))
										lblList += " ( " + value.level2Name + " ) ";

									html += '<li><a href="javascript:;" data-type="'+currentScopeType+'" '+
													'data-locId="'+key+'" '+
													'data-level4="'+value.level4+'" data-level4name="'+value.level4Name+'"'+
													'data-level3="'+value.level3+'" data-level3name="'+value.level3Name+'"'+
													'data-level2="'+value.level2+'" data-level2name="'+value.level2Name+'"'+ 
													'data-level1="'+value.level1+'" data-level1name="'+value.level1Name+'"'+ 
													'data-country="'+country+'" '+
													'data-city="'+val+'" data-cp="'+lbl+'" '+
													'data-lat="'+lat+'" data-lng="'+lng+'" '+
													'data-insee="'+insee+'" class="item-city-found">'+lblList+'</a></li>';
								});
							}else{
								var val = value.name; 
								var lat = value.geo.latitude;
								var lng = value.geo.longitude;
								var lblList = value.name ;
								if(notEmpty(value.level4Name))
									lblList += " ( " + value.level4Name + " ) ";
								else if(notEmpty(value.level3Name))
									lblList += " ( " + value.level3Name + " ) ";
								else if(notEmpty(value.level2Name))
									lblList += " ( " + value.level2Name + " ) ";

								html += '<li><a href="javascript:;" data-type="'+currentScopeType+'" '+
													'data-locid="'+key+'" ';
								html +=	'data-level4="'+value.level4+'" data-level4name="'+value.level4Name+'"'+
										'data-level3="'+value.level3+'" data-level3name="'+value.level3Name+'"'+
										'data-level2="'+value.level2+'" data-level2name="'+value.level2Name+'"'+ 
										'data-level1="'+value.level1+'" data-level1name="'+value.level1Name+'"';
								html += 'data-country="'+country+'" '+
										'data-city="'+val+'" data-lat="'+lat+'" '+
										'data-lng="'+lng+'" data-insee="'+insee+'" '+
										'class="item-city-found-uncomplete">'+lblList+'</a></li>';
							}
						};
					});

					if(html == "") html = "<i class='fa fa-ban'></i> "+trad.noresult;
					$("#ajaxFormModal #dropdown-newElement_"+currentScopeType+"-found").html(html);
					$("#ajaxFormModal #dropdown-newElement_"+currentScopeType+"-found").show();

					$("#ajaxFormModal .item-city-found, .item-cp-found").click(function(){
						dyFObj.formInMap.add(true, $(this), inseeGeoSHapes);
					});

					$("#ajaxFormModal .item-city-found-uncomplete").click(function(){
						dyFObj.formInMap.add(false, $(this), inseeGeoSHapes);
					});
				},
				error: function(error){
					$("#ajaxFormModal #dropdown-newElement_"+currentScopeType+"-found").html("error");
					mylog.log("Une erreur est survenue pendant autocompleteMultiScope", error);
				}
			});
		},
		add : function(complete, data, inseeGeoSHapes){
			mylog.log("add", complete, data, inseeGeoSHapes);
			
			dyFObj.formInMap.NE_insee = data.data("insee");
			dyFObj.formInMap.NE_lat = data.data("lat");
			dyFObj.formInMap.NE_lng = data.data("lng");
			dyFObj.formInMap.NE_city = data.data("city");
			dyFObj.formInMap.NE_country = data.data("country");
			dyFObj.formInMap.NE_level4 = (notEmpty(data.data("level4")) ? data.data("level4") : null) ;
			dyFObj.formInMap.NE_level4Name = (notEmpty(data.data("level4name")) ? data.data("level4name") : null) ;
			dyFObj.formInMap.NE_level3 = (notEmpty(data.data("level3")) ? data.data("level3") : null) ;
			dyFObj.formInMap.NE_level3Name = (notEmpty(data.data("level3name")) ? data.data("level3name") : null) ;
			dyFObj.formInMap.NE_level2 = (notEmpty(data.data("level2")) ? data.data("level2") : null) ;
			dyFObj.formInMap.NE_level2Name = (notEmpty(data.data("level2name")) ? data.data("level2name") : null);
			dyFObj.formInMap.NE_level1 = (notEmpty(data.data("level1")) ? data.data("level1") : null) ;
			dyFObj.formInMap.NE_level1Name = (notEmpty(data.data("level1name")) ? data.data("level1name") : null) ;
			dyFObj.formInMap.NE_localityId = data.data("locid");

			if(complete == true){
				dyFObj.formInMap.NE_cp = data.data("cp");
			}else if ( 	notEmpty(dyFObj.formInMap.saveCities) && 
						notEmpty(dyFObj.formInMap.saveCities[dyFObj.formInMap.NE_insee]) &&
						notEmpty(dyFObj.formInMap.saveCities[dyFObj.formInMap.NE_insee].betweenCP)
						)
				dyFObj.formInMap.NE_betweenCP = dyFObj.formInMap.saveCities[dyFObj.formInMap.NE_insee].betweenCP ;

			$("#ajaxFormModal #dropdown-newElement_cp-found, #dropdown-newElement_city-found, #dropdown-newElement_streetAddress-found, #dropdown-newElement_locality-found").hide();
			//dyFObj.formInMap.updateSummeryLocality(data);
			mylog.log("dyFObj.formInMap.NE_betweenCP ", dyFObj.formInMap.NE_betweenCP );
			dyFObj.formInMap.btnValideDisable( (dyFObj.formInMap.NE_betweenCP == false ? false : true) );
			
			if(userId == "")
				$("#ajaxFormModal #divStreetAddress").addClass("hidden");
			else
				$("#ajaxFormModal #divStreetAddress").removeClass("hidden");
			$('#ajaxFormModal [name="newElement_city"]').val(dyFObj.formInMap.NE_city);
			dyFObj.formInMap.resumeLocality();


			//mapObj.setLatLng([data.data("lat"), data.data("lng")], 0);


		},
		changeSelectCountrytim : function(){
			mylog.log("changeSelectCountrytim", dyFObj.formInMap.NE_country);
			mylog.log("dyFObj.formInMap.NE_cp.substring(0, 3)");
			var countryFR = ["FR","GP","MQ","GF","RE","PM","YT"];
			var regexNumber = new RegExp("[1-9]+") ;
			if(countryFR.indexOf(dyFObj.formInMap.NE_country) != -1 && regexNumber.test(dyFObj.formInMap.NE_country) ) {
				var name = $('#ajaxFormModal [name="newElement_city"]').val();
				if(name.substring(0, 3) == "971")
					$('#ajaxFormModal [name="newElement_country"]').val("GP");
				else if(name.substring(0, 3) == "972")
					$('#ajaxFormModal [name="newElement_country"]').val("MQ");
				else if(name.substring(0, 3) == "973")
					$('#ajaxFormModal [name="newElement_country"]').val("GF");
				else if(name.substring(0, 3) == "974")
					$('#ajaxFormModal [name="newElement_country"]').val("RE");
				else if(name.substring(0, 3) == "975")
					$('#ajaxFormModal [name="newElement_country"]').val("PM");
				else if(name.substring(0, 3) == "976")
					$('#ajaxFormModal [name="newElement_country"]').val("YT");
				else
					$('#ajaxFormModal [name="newElement_country"]').val("FR");
			}
		},
		btnValideDisable : function(bool){
			mylog.log("btnValideDisable",bool);
			//$("#btnValideAddress").prop('disabled', bool);

			if(bool == true){
				$("#ajaxFormModal #btnValideAddress").show();
			}else{
				$("#ajaxFormModal #btnValideAddress").hide();
			}
		}
	},
	checkRules : function(rules, params) {
		$(".errorForm").addClass("hidden");
		$(".errorForm").html("");
		mylog.log("checkRules", rules, params);
		var notError = true ;
		$.each(params.formObj.jsonSchema.properties, function(kProp, valProp) {
			if(typeof valProp.rules != "undefined" && 
				valProp.rules != null) {
				if( valProp.inputType == "formLocality" ){
					if( typeof valProp.rules.required != "undefined" &&
						valProp.rules.required == true &&
						!dyFInputs.locationObj.centerLocation){
						dyFObj.showError(kProp+valProp.inputType, tradDynForm["This field is required."]);
						notError = false;
					}
				}

				if(valProp.inputType == "finder" ){
					mylog.log("checkRules ");
					if( typeof valProp.rules.required != "undefined" &&
						valProp.rules.required == true &&
						Object.keys(finder.object[kProp]).length == 0 ){
						mylog.log("checkRules 2", kProp, valProp);
						dyFObj.showError(kProp+valProp.inputType, tradDynForm["This field is required."]);
						notError = false;
					}

					if( typeof valProp.rules.lengthMin != "undefined" &&
						valProp.rules.lengthMin != null &&
						Object.keys(finder.object[kProp]).length < valProp.rules.lengthMin ){
						mylog.log("checkRules 3");
						dyFObj.showError(kProp+valProp.inputType, "quantité minimum : "+valProp.rules.lengthMin);
						notError = false;
					}
				}
			}
			
		});
		mylog.log("checkRules", notError);
		return notError ;
		
	},
	showError : function(key, msg) {
		$("."+key+" .errorForm").append(msg);
		$("."+key+" .errorForm").append("<br/>");
		$("."+key+" .errorForm").removeClass("hidden");

		
	}
	

}
//TODO : refactor into dyfObj.inputs
var dyFInputs = {

	init : function() {
		mylog.log("KEY init");
		 //global variables clean up
		dyFInputs.locationObj.elementLocation = null;
	    dyFInputs.locationObj.elementLocations = [];
	    dyFInputs.locationObj.centerLocation = null;
	    dyFInputs.locationObj.countLocation = 0 ;
	    dyFInputs.locationObj.addresses = (typeof dyFObj.elementData != "undefined" && dyFObj.elementData != null && typeof dyFObj.elementData.map.addresses != "undefined") ? dyFObj.elementData.map.addresses  :  [] ;
	    updateLocality = false;
	    // Forced dynForm in network or cOstum
	    if(typeof networkJson != 'undefined' && notNull(networkJson))
	    	dyFInputs.initializeTypeObjForm(networkJson);
	    if(typeof costum != 'undefined' && notNull(costum))
	    	dyFInputs.initializeTypeObjForm(costum);
	},
	initializeTypeObjForm : function(object){
		mylog.log("KEY initializeTypeObjForm", object);
		// Initialize tags list for network in form of element
		var networkTags = [];
		var networkTagsCategory = {};
		tagsList = [];
		if(typeof object.request != "undefined"){
			if(typeof object.request.mainTag != "undefined")
				networkTags.push({id:object.request.mainTag[0],text:object.request.mainTag[0]});

			if(typeof object.request.searchTag != "undefined"){
				mylog.log("NETWORK searchTag", networkTags);
				networkTags = $.merge(networkTags, object.request.searchTag);
				mylog.log("NETWORK searchTag", networkTags);
			}
		}

		if(typeof object.filter != "undefined" && typeof object.filter.linksTag != "undefined"){
			$.each(object.filter.linksTag, function(category, properties) {
				optgroupObject=new Object;
				optgroupObject.text=category;
				optgroupObject.children=[];
				networkTagsCategory[category]=[];
				$.each(properties.tags, function(i, tag) {
					if($.isArray(tag)){
						$.each(tag, function(keyTag, textTag) {
							val={id:textTag,text:textTag};
							if(jQuery.inArray( textTag, tagsList ) == -1 ){
								optgroupObject.children.push(val);
								tagsList.push(textTag);
							}
						});
					}else{
						val={id:tag,text:tag};
						if(jQuery.inArray( tag, tagsList ) == -1 ){
							optgroupObject.children.push(val);
							tagsList.push(tag);
						}
					}
				});
				networkTags.push(optgroupObject);
				networkTagsCategory[category].push(optgroupObject);
			});
		}
		mylog.log("object.add", object.typeObj, object);
		if(	typeof object.typeObj != "undefined"  && 
			typeof typeObj != "undefined" ){

			$.each(object.typeObj, function(key, v) {
				mylog.log("object.add key", key);
				//key=(key=="jobs" || key=="ressources") ? "classifieds" : key;
				//key=(typeof typeObj[key].sameAs != "undefined") ? typeObj[key].sameAs : key; 
				var typeObjOrigin = key;
				// if(!typeObj.isDefined(key, "dynForm") && typeObj.isDefined(key, "sameAs")){

				// 	typeObjOrigin = key;
				// 	key = typeObj[key].sameAs;
				// 	mylog.log("object.add typeObjOrigin",typeObjOrigin, key);
				// }
	
				key = (!typeObj.isDefined(key, "dynForm") && typeObj.isDefined(key, "sameAs")) ? typeObj[key].sameAs : key;
				mylog.log("object.add typeObjOrigin2", key, typeof typeObj[key].dynForm, typeObjOrigin);
				if( typeof typeObj[key].dynForm != "undefined"){
					if(typeObjOrigin != null)
						typeObj[key].dynForm.jsonSchema.typeObjOrigin = typeObjOrigin;

					if( typeof object.slug != "undefined"){
						mylog.log("object.add source", object.slug, object);
						sourceObject = { inputType:"hidden", value : object.slug };
						typeObj[key].dynForm.jsonSchema.properties.source = sourceObject;
					}

					if( typeof object.request != "undefined"){
						
						if(typeof object.request.sourceKey != "undefined"){
							sourceObject = { inputType:"hidden", value : object.request.sourceKey[0] };
							typeObj[key].dynForm.jsonSchema.properties.source = sourceObject;
						}

						if(v){
							if(typeof object.request.searchTag != "undefined"){
								typeObj[key].dynForm.jsonSchema.properties.tags.data = object.request.searchTag;
							}

							if(	typeof typeObj[key].dynForm.jsonSchema.properties.tags != "undefined" &&
								( 	typeof object.dynForm == "undefined" ||
									typeof object.dynForm.extra == "undefined" ||
									(	typeof object.dynForm.extra.tags == "undefined" ||
										object.dynForm.extra.tags == null ||
										object.dynForm.extra.tags == false ) ) ) {
								typeObj[key].dynForm.jsonSchema.properties.tags.values=networkTags;
								mylog.log("initializeTypeObjForm ", typeObj[key].dynForm.jsonSchema.properties.tags);
								if(typeof object.request.mainTag != "undefined"){
									typeObj[key].dynForm.jsonSchema.properties.tags.mainTag = object.request.mainTag;
									if(typeof typeObj[key].dynForm.jsonSchema.properties.tags.data == "undefined")
										typeObj[key].dynForm.jsonSchema.properties.tags.data = [] ;

									typeObj[key].dynForm.jsonSchema.properties.tags.data = $.merge(object.request.mainTag, typeObj[key].dynForm.jsonSchema.properties.tags.data);
								}
							}

							
							if(	typeof object.request.parent != "undefined" && 
								typeof object.request.parent.id != "undefined" &&
								typeof object.request.parent.type != "undefined" ){
								mylog.log("DATA NETWORK1 parent", object.request.parent);
								typeObj[key].dynForm.jsonSchema.properties.parentType = dyFInputs.inputHidden("");
								typeObj[key].dynForm.jsonSchema.properties.parentId = dyFInputs.inputHidden("");
								
							}
						}
					}

					if(v && notNull(object.dynForm)){
						if(notNull(object.dynForm.extra)){
							var nbListTags = 1 ;
							
							while( notNull(object.dynForm.extra["tags"+nbListTags] ) ){

								typeObj[key].dynForm.jsonSchema.properties["tags"+nbListTags] = {
									"inputType" : "tags",
									"placeholder" : object.dynForm.extra["tags"+nbListTags].placeholder,
									"values" : object.dynForm.extra["tags"+nbListTags].tags,
									//"data" : object.dynForm.extra["tags"+nbListTags].tags,
									"label" : object.dynForm.extra["tags"+nbListTags].list
								};
								nbListTags++;
							}
							if( typeof object.dynForm.extra.tags == "undefined" ||
								object.dynForm.extra.tags == null ||
								object.dynForm.extra.tags == false )
								delete typeObj[key].dynForm.jsonSchema.properties.tags;
						}
					}

					mylog.log("object.dynForm.extra.tags typeObj[key]2", typeObj[key].dynForm.jsonSchema.properties);

				}
			});
		}


	},
	formLocality :function(label, placeholder, rules) {
		mylog.log("inputText ", inputObj);
		var inputObj = {
			label : label,
	    	placeholder : ( notEmpty(placeholder) ? placeholder : "... " ),
	        inputType : "formLocality",
	        rules : ( notEmpty(rules) ? rules : null ),
	    };



		if(dyFObj.formInMap.countryList == null){
			$("#btn-submit-form").prop('disabled', true);
			$.ajax({
				type: "POST",
				url: baseUrl+"/"+moduleId+"/opendata/getcountries/hasCity/true",
				dataType: "json",
				async: false,
				success: function(data){
					mylog.log("getcountries data",data);
					dyFObj.formInMap.countryList = data;
					$("#btn-submit-form").prop('disabled', false);
					return inputObj;
				},
				error: function(error){
					mylog.log("error", error);
				}
			});
		}
	   	//alert("HERE");
    	return inputObj;
    },
	inputText :function(label, placeholder, rules, custom) { 
		var inputObj = {
			label : label,
	    	placeholder : ( notEmpty(placeholder) ? placeholder : "... " ),
	        inputType : "text",
	        rules : ( notEmpty(rules) ? rules : {} ),
	        custom : ( notEmpty(custom) ? custom : "" )
	    };
	    mylog.log("inputText ", inputObj);
    	return inputObj;
    },
    slug :function(label, placeholder, rules) { 
    	mylog.log("rooooles",rules);
		var inputObj = {
			label : label,
	    	placeholder : ( notEmpty(placeholder) ? placeholder : "... " ),
	        inputType : "text",
	        rules : ( notEmpty(rules) ? rules : "")
	    };
    	inputObj.init = function(){
    		$("#ajaxFormModal #btn-submit-form").attr('disabled','disabled');
			
			$("#ajaxFormModal #slug").data("checking", false);

        	$("#ajaxFormModal #slug").bind("keyup",function(e) {

				$("#ajaxFormModal #btn-submit-form").attr('disabled','disabled');
        		$(this).val(slugify($(this).val(), true));
        		if($("#ajaxFormModal #slug").val().length >= 3 ){
            		if($("#ajaxFormModal #slug").data("checking") == false){
            			var value = $(this).val();
            			if(formInMap.formType.timer != false) clearTimeout(formInMap.formType.timer);
            			formInMap.formType.timer = setTimeout(function(){ 
        					mylog.log("checking slug", true);
            				$("#ajaxFormModal #slug").data("checking", true);
            				slugUnique(value); 
            			}, 1000);
            			
            		}else{ mylog.log("already checking slug"); }
        		} else {
            		$("#ajaxFormModal #slug").parent().removeClass("has-success").addClass("has-error");//.find("span").text("Please enter at least 3 characters.");
            	}
            	//dyFObj.canSubmitIf();
        	});

        	$("#ajaxFormModal .form-group.slugtext").append("<span class='help-blockk col-xs-12 padding-5 text-left letter-green bold'></span>");
        	slugUnique( $("#ajaxFormModal #slug").val() );
	    }
	    mylog.log("dyFInputs ", inputObj);
    	return inputObj;
	},
	name :function(type, rules, addElement, extraOnBlur) { 
		var inputObj = {
	    	placeholder : "... ",
	        inputType : "text",
	        rules : ( notEmpty(rules) ? rules : { required : true } )
	    };
	    if(type){
	    	mylog.log("NAMEOFYOUR", dyFInputs.get(type).ctrl, trad[dyFInputs.get(type).ctrl]);
	    	inputObj.label = tradDynForm.nameofyour+" " + trad[dyFInputs.get(type).ctrl]+" ";
	    	if(type=="classified") 
	    		inputObj.label = tradDynForm.titleofyour+" "+ trad[type]+" ";

	    	inputObj.placeholder = inputObj.label + " ...";

	    	inputObj.init = function(){
	        	$("#ajaxFormModal #name ").off().on("blur",function(){
	        		
	        		//use urls in the name field to fill the form dynamically
	        		if( $("#ajaxFormModal #url ") && ( $("#ajaxFormModal #name ").val().indexOf("http://")>=0 ||
	        			$("#ajaxFormModal #name ").val().indexOf("https://")>=0 ) )
	        		{
	        			urlContent = processUrl.extractUrl( ".nametext ",$("#ajaxFormModal #name ").val(), 
	        				function (data) {  
	        					if( $("#ajaxFormModal #url") )
			        				$("#ajaxFormModal #url").val($("#ajaxFormModal #name ").val());
			        			if( data.name ){
			        				$("#ajaxFormModal #name ").val(data.name);
			        				dyFObj.searchExist(data.name,[ dyFInputs.get(type).col ], addElement );
			        			}
			        			if( data.description ){
			        				if($("#ajaxFormModal #shortDescription"))$("#ajaxFormModal #shortDescription").val( data.description );
			        				if($("#ajaxFormModal #description"))$("#ajaxFormModal #description").val( data.description );
			        			}
			        			if( data.keywords.length > 0 ){
			        				taglist = [];
			        				$.each(data.keywords, function(i,k) { taglist.push( {id:i,text:k} ); });
			        				$("#ajaxFormModal #tags").select2( "data", taglist );
			        			}
	        			});
	        		} else if( $("#ajaxFormModal #name ").val().length > 3 ){
	        			if( typeof dyFInputs.get(type).search != "undefined" )
	        				dyFObj.searchExist($(this).val(), dyFInputs.get(type).search, addElement );
	        			else
	            			dyFObj.searchExist($(this).val(),[ dyFInputs.get(type).col ], addElement );
	        		}
	            	//dyFObj.canSubmitIf();
	        	});
	        }
	    }else{
	    	inputObj.label = "Nom ";
	    }
	    mylog.log("dyFInputs ", inputObj);
    	return inputObj;
    },
    username : {
    	placeholder : "username",
        inputType : "text",
        label : "Username",
        rules : { required : true },
        init : function(){
        	$("#ajaxFormModal #username ").off().on("blur",function(){
        		if($("#ajaxFormModal #username ").val().length > 2 ){
            		var res = isUniqueUsername($(this).val());
            		$("#btn-submit-form").html('Valider <i class="fa fa-arrow-circle-right"></i>').prop("disabled",false);
            		var msg = "Username existe déjà";
            		var color = " text-red"
            		if(res){
            			msg = "Username est bon";
            			color = " text-green"
            		}
            		
            		$("#listSameName").html("<div class='col-sm-12 light-border"+color+"'> <i class='fa fa-eye'></i> "+msg+" : </div>");
            	}
            });
        }
    },
    similarLink : {
        inputType : "custom",
        html:"<div id='similarLink'><div id='listSameName' style='overflow-y: scroll; height:150px;border: 1px solid black; display:none'></div></div>",
    },
    inputSelect :function(label, placeholder, list, rules, init) {
    	mylog.log("inputSelect", label, placeholder, list, rules);
		var inputObj = {
			inputType : "select",
			label : ( notEmpty(label) ? label : "" ),
			placeholder : ( notEmpty(placeholder) ? placeholder : trad.choose ),
			options : ( notEmpty(list) ? list : [] ),
			rules : ( notEmpty(rules) ? rules : {} ),
			init : ( notEmpty(init) ? init : null )
		};
		return inputObj;
	},
	inputSelectGroup :function(label, placeholder, list, group, rules, init) { 
		mylog.log("inputSelectGroup", label, placeholder, list, rules);
		var inputObj = {
			inputType : "select",
			label : ( notEmpty(label) ? label : "" ),
			placeholder : ( notEmpty(placeholder) ? placeholder : trad.choose ),
			options : ( notEmpty(list) ? list : [] ),
			groupOptions : ( notEmpty(group) ? group : [] ),
			rules : ( notEmpty(rules) ? rules : {} ),
			init : ( notEmpty(init) ? init : function(){} )
		};
		return inputObj;
	},
	organizerId : function( organizerId, organizerType ){
		return dyFInputs.inputSelectGroup( 	tradDynForm.whoorganizedevent+" ?", 
											tradDynForm.whoorganize+" ?", 
											firstOptions(), 
											parentList( ["organizations","projects"], organizerId, organizerType ), 
											{ required : true },
											function(){
												$("#ajaxFormModal #organizerId").off().on("change",function(){
													
													var organizerId = $(this).val();
													var organizerType = "notfound";
													if(organizerId == "dontKnow" )
														organizerType = "dontKnow";
													else if( $('#organizerId').find(':selected').data('type') && typeObj[$('#organizerId').find(':selected').data('type')] )
														organizerType = $('#organizerId').find(':selected').data('type');
													else
														organizerType = typeObj["person"].col;

													mylog.warn( "organizer",organizerId,organizerType, $('#organizerId').find(':selected').data('type') );
													$("#ajaxFormModal #organizerType").val( organizerType );
												});
											});
	},
	tags : function(list, placeholder, label, minimumInputLength) { 
		mylog.log("inputTags", list, placeholder, label)
    	return {
			inputType : "tags",
			placeholder : placeholder != null ? placeholder : tradDynForm.tags,
			values : (list) ? list : tagsList,
			label : (label != null) ? label : tradDynForm.addtags,
			minimumInputLength : (minimumInputLength != null) ? minimumInputLength : 3
		}
	},
	radio : function(label,keyValues) { 
    	return {
    		label : (label != null) ? label : "",
			inputType : "radio",
			options : keyValues
		}
	},
    imageAddPhoto : {
    	inputType : "uploader",
    	showUploadBtn : true,
    	init : function() { 
    		setTimeout( function()
    		{
    			
        		$('#trigger-upload').click(function(e) {
        			$('.fine-uploader-manual-trigger').fineUploader('uploadStoredFiles');
		        	urlCtrl.loadByHash(location.hash);
        			$('#ajax-modal').modal("hide");
		        });
				//$("#ajax-modal .modal-header").removeClass("bg-dark bg-purple bg-red bg-azure bg-green bg-green-poi bg-orange bg-yellow bg-blue bg-turq bg-url")
				//	  					  	  .addClass("bg-dark");
    		 	
    		 	//$("#ajax-modal-modal-title").html("<i class='fa fa-camera'></i> Publier une photo");

        	},1500);
    	}
    },
    image :function(label, afterLoad) { 
    	
    	if( !jsonHelper.notNull("uploadObj.gotoUrl") ) 
    		uploadObj.gotoUrl = location.hash ;
    	mylog.log("image upload then gotoUrl", uploadObj.gotoUrl) ;

    	return {
	    	inputType : "uploader",
	    	docType : "image",
	    	label : (label != null) ? label : tradDynForm.imageshere+" :", 
	    	showUploadBtn : false,
	    	template:'qq-template-gallery',
	    	filetypes:['jpeg', 'jpg', 'gif', 'png'],
	    	afterUploadComplete : function(){
	    		if(notNull(afterLoad) && typeof afterLoad == "function" )
	    			afterLoad();
	    	    if(typeof urlCtrl != "undefined") {
	            	dyFObj.closeForm();
	            	urlCtrl.loadByHash( (uploadObj.gotoUrl) ? uploadObj.gotoUrl : location.hash );
	            }
		    }
    	}
    },
    file :function() { 
    	
    	if( !jsonHelper.notNull("uploadObj.gotoUrl") ) 
    		uploadObj.gotoUrl = location.hash ;
    	mylog.log("image upload then gotoUrl", uploadObj.gotoUrl) ;

    	return {
	    	inputType : "uploader",
	    	label : tradDynForm.fileshere+" :", 
	    	showUploadBtn : false,
	    	docType : "file",
	    	template:'qq-template-manual-trigger',
	    	filetypes:["pdf","xls","xlsx","doc","docx","ppt","pptx","odt","ods","odp", "csv"],
	    	afterUploadComplete : function(){
	    		//alert("afterUploadComplete :: "+uploadObj.gotoUrl);
		    	dyFObj.closeForm();
				//alert( "image upload then goto : "+uploadObj.gotoUrl );
				//if(location.hash.indexOf("view.gallery")>0){
				//	buildNewBreadcrum("files");
				//	getViewGallery(1,"","files");
				//}		
				//else
	            urlCtrl.loadByHash( (uploadObj.gotoUrl) ? uploadObj.gotoUrl : location.hash );
		    }
    	}
    },
    textarea :function (label,placeholder,rules) {  
    	var inputObj = {
    		inputType : "textarea",
	    	label : ( notEmpty(label) ? label : "Votre message ..." ),
	    	placeholder : ( notEmpty(placeholder) ? placeholder : "Votre message ..." ),
	    	rules : ( notEmpty(rules) ? rules : { } ),
	    	init : function(){
	    		mylog.log("textarea init");
	    		if($(".maxlengthTextarea").length){
	    			mylog.log("textarea init2");
	    			$(".maxlengthTextarea").off().keyup(function(){
						//var name = "#" + $(this).attr("id") ;
						var name = $(this).attr("id") ;
						mylog.log(".maxlengthTextarea", "#ajaxFormModal #"+name, $(this).attr("id"));
						mylog.log(".maxlengthTextarea", $("#ajaxFormModal #"+name).val().length, $(this).val().length);
						$("#ajaxFormModal #maxlength"+name).html($("#ajaxFormModal  #"+name).val().length);
					});
	    		}
	    		
	        }
	    };
	    return inputObj;
	},

	password : function  (title, rules) {  
    	var title = (title) ? title : trad["New password"];
    	var ph = "";
    	var rules = (rules) ? rules : { required : true } ;
	    var res = {
	    	label : title,
	    	inputType : "password",
	    	placeholder : ph,
	    	rules : rules
	    }
	    return res;
	},
    price :function(label, placeholder, rules, custom) { 
		var inputObj = dyFInputs.inputText(tradDynForm.pricesymbole, tradDynForm.pricesymbole+" ...") ;
	    inputObj.init = function(){
    		$('input#price').filter_input({regex:'[0-9]'});
      	};
    	return inputObj;
    },
    quantity :function(label, placeholder, rules, custom) { 
		var inputObj = dyFInputs.inputText(tradDynForm.quantity, tradDynForm.quantity+" ...") ;
	    inputObj.init = function(){
    		$('input#quantity').filter_input({regex:'[0-9]'});
      	};
    	return inputObj;
    },
    text :function (label,placeholder,rules) {  
    	var inputObj = {
    		inputType : "text",
	    	label : ( notEmpty(label) ? label : tradDynForm.mainemail ),
	    	placeholder : ( notEmpty(placeholder) ? placeholder : "exemple@mail.com" ),
	    	rules : ( notEmpty(rules) ? rules : { email: true } )
	    }
	    mylog.log("create form input email", inputObj);
	    return inputObj;
	},

	email :function (label,placeholder,rules) {  
    	var inputObj = {
    		inputType : "text",
	    	label : ( notEmpty(label) ? label : tradDynForm.mainemail ),
	    	placeholder : ( notEmpty(placeholder) ? placeholder : "exemple@mail.com" ),
	    	rules : ( notEmpty(rules) ? rules : { email: true, required : true } )
	    }
	    return inputObj;
	},
	
	emailOptionnel :function (label,placeholder,rules) {  
    	var inputObj = dyFInputs.text(label, placeholder, rules);
    	inputObj.init = function(){
			$(".emailtext").css("display","none");
		};
	    return inputObj;
	},
	createNews: function (){
		var inputObj = {
			inputType : "createNews",
			label : "ta mere",
       		placeholder:"",
       		rules: "",
       		params : { "targetId":contextData.id, "targetType":contextData.type, 
     					"targetImg":contextData.profilThumbImageUrl, "targetName":contextData.name, 
     					"authorId":userId,"authorImg":userConnected.profilThumbImageUrl, "authorName":userConnected.name}
   		}
		inputObj.init = function(){
			$("#createNews").css("display","none");
			$("#createNews #tags").select2({tags:tagsList});
			$("#createNews > textarea").elastic();
			mentionsInit.get("#createNews > #mentionsText > textarea");
			$("#createNews .scopeShare").click(function() {
				mylog.log(this);
				replaceText=$(this).find("h4").html();
				$("#createNews #btn-toogle-dropdown-scope").html(replaceText+' <i class="fa fa-caret-down" style="font-size:inherit;"></i>');
				scopeChange=$(this).data("value");
				$("#createNews > input[name='scope']").val(scopeChange);
				
			});
			$("#createNews .targetIsAuthor").click(function() {
				mylog.log(this);
				srcImg=$(this).find("img").attr("src");
				name=$(this).data("name");
				$("#createNews #btn-toogle-dropdown-targetIsAuthor").html('<img height=20 width=20 src="'+srcImg+'"/> '+name+' <i class="fa fa-caret-down" style="font-size:inherit;"></i>');
				authorTargetChange=$(this).data("value");
				$("#createNews #authorIsTarget").val(authorTargetChange);
			});
		};
		return inputObj;  
	},
	location : {
		label : tradDynForm.location,
       	inputType : "location"
    },
    locationObj : {
    	/* *********************************
					LOCATION
		********************************** */
		//TODO move to elementForm
		elementLocation : null,
		centerLocation : null,
		elementLocations : [],
		addresses : [],
		elementPostalCode : null,
		elementPostalCodes : [],
		countLocation : 0,
		countPostalCode : 0,
		initVar :function(){
			dyFInputs.locationObj.elementLocation = null;
		    dyFInputs.locationObj.elementLocations = [];
		    dyFInputs.locationObj.centerLocation = null;
		    dyFInputs.locationObj.addresses = [];
		    dyFInputs.locationObj.countLocation = 0 ;
		},
		init : function () {
			console.log("init loc");
			$(".deleteLocDynForm").click(function(){
				console.log("deleteLocDynForm", $(this).data("index"));
				var index = $(this).data("index");
				var indexLoc = $(this).data("indexLoc");
				if(index == -1 && dyFInputs.locationObj.elementLocations.length > 1){
					toastr.error("Vous ne pouvez pas supprimer l'adresse principal si vous avez des adresses secondaires");
				}else{
					bootbox.confirm({
						message: trad["suredeletelocality"]+"<span class='text-red'></span>",
						buttons: {
							confirm: {
								label: trad["yes"],
								className: 'btn-success'
							},
							cancel: {
								label: trad["no"],
								className: 'btn-danger'
							}
						},
						callback: function (result) {
							if (!result) {
								return;
							} else {
								mylog.log("Index Delete", $(this).data("index"));
								var param = new Object;
								param.name = (index == -1 ) ? "locality" : "addresses";
								param.value = (index == -1 ) ? "" : { addressesIndex : index };
								param.pk = uploadObj.id;

								$.ajax({
							        type: "POST",
							        url: baseUrl+"/"+moduleId+"/element/updatefields/type/"+uploadObj.type,
							        data: param,
							       	dataType: "json",
							    	success: function(data){
								    	if(data.result){
											toastr.success(data.msg);
											
											var formValues = dyFObj.elementData.map;
											mylog.log("FormValues", formValues);

											dyFInputs.locationObj.elementLocation = null;
											dyFInputs.locationObj.elementLocations.splice(indexLoc,1);
											if(index != -1 ){
												dyFInputs.locationObj.initVar();
												$(".locationlocation").html("");
												   
												if( dyFInputs.locationObj.addresses ){
													dyFInputs.locationObj.addresses.splice(index,1);
													var test = [];
													$.each(dyFInputs.locationObj.elementLocations, function(i,locelt){
														$.each(dyFInputs.locationObj.addresses, function(i,addLoc){

															if(addLoc.postalCode == locelt.locelt && 
																addLoc.streetAddress == locelt.streetAddress &&
																addLoc.insee == locelt.insee &&
																addLoc.addressCountry == locelt.addressCountry &&
																addLoc.addressLocality == locelt.addressLocality){
																test.push(locelt);
															}
														});
													});
													
												}

												if( formValues.address && formValues.geo && formValues.geoPosition ){
													mylog.warn("init Adress location",formValues.address.addressLocality,formValues.address.postalCode);
													dyFInputs.locationObj.copyMapForm2Dynform({address:formValues.address,geo:formValues.geo,geo:formValues.geoPosition});
													dyFInputs.locationObj.addLocationToForm({address:formValues.address,geo:formValues.geo,geo:formValues.geoPosition}, -1);
												}
												if( dyFInputs.locationObj.addresses ){
													$.each(dyFInputs.locationObj.addresses, function(i,addLoc){
														mylog.warn("init extra addresses location ",locationObj.address.addressLocality,locationObj.address.postalCode);
														dyFInputs.locationObj.copyMapForm2Dynform(locationObj);
														dyFInputs.locationObj.addLocationToForm(locationObj, i);	
													});
												}
												
											}else{
												$(".locationEl"+ indexLoc).remove();
											}
								    	}
								    }
								});
							}
						}
					});
				}
			});
		},
		copyMapForm2Dynform : function (locObj) {
			mylog.warn("---------------copyMapForm2Dynform----------------");
			//if(!elementLocation)
			//	elementLocation = [];
			mylog.log("locationObj", locObj);
			dyFInputs.locationObj.elementLocation = locObj;
			mylog.log("elementLocation", dyFInputs.locationObj.elementLocation);
			dyFInputs.locationObj.elementLocations.push(dyFInputs.locationObj.elementLocation);
			mylog.log("dyFInputs.locationObj.elementLocations", dyFInputs.locationObj.elementLocations);
			mylog.log("dyFInputs.locationObj.centerLocation", dyFInputs.locationObj.centerLocation);
			if(!dyFInputs.locationObj.centerLocation /*|| dyFInputs.locationObj.elementLocation.center == true*/){
				dyFInputs.locationObj.centerLocation = dyFInputs.locationObj.elementLocation;
				dyFInputs.locationObj.elementLocation.center = true;
			}
			mylog.dir(dyFInputs.locationObj.elementLocations);
			//elementLocation.push(positionObj);
		},
		addLocationToForm : function (locObj, index){
			mylog.warn("---------------addLocationToForm----------------", locObj, index);
			mylog.dir(locObj);
			var strHTML = "";
			if( locObj.address.addressCountry)
				strHTML += locObj.address.addressCountry;
			if( locObj.address.postalCode)
				strHTML += ", "+locObj.address.postalCode;
			if( locObj.address.addressLocality)
				strHTML += ", "+locObj.address.addressLocality;
			if( locObj.address.streetAddress)
				strHTML += ", "+locObj.address.streetAddress;
			var btnSuccess = "";
			var locCenter = "";
			var boolCenter=false;
			if( dyFInputs.locationObj.countLocation == 0){
				btnSuccess = "btn-success";
				//locCenter = "<span class='lblcentre'>(localité centrale)</span>";
				locCenter = "<span class='lblcentre'> "+tradDynForm.mainLocality+"</span>"; 
				boolCenter=true;
			}

			/*if(typeof index != "undefined"){
				strHTML = "<a href='javascript:;' class='deleteLocDynForm locationEl"+dyFInputs.locationObj.countLocation+" btn' data-index='"+index+"' data-indexLoc='"+dyFInputs.locationObj.countLocation+"'>"+
								"<i class='text-red fa fa-times'></i></a>"+
					  		"<span class='locationEl"+dyFInputs.locationObj.countLocation+" locel text-azure'>"+strHTML+"</span> "+
					  "<a href='javascript:dyFInputs.locationObj.setAsCenter("+dyFInputs.locationObj.countLocation+")' data-index='"+index+"' class='centers center"+dyFInputs.locationObj.countLocation+" locationEl"+dyFInputs.locationObj.countLocation+" btn btn-xs "+btnSuccess+"'>"+
					  	"<i class='fa fa-map-marker'></i>"+locCenter+"</a> <br/>";
			}
			else{
				strHTML = "<a href='javascript:dyFInputs.locationObj.removeLocation("+dyFInputs.locationObj.countLocation+")' class=' locationEl"+dyFInputs.locationObj.countLocation+" btn'> <i class='text-red fa fa-times'></i></a>"+
					  "<span class='locationEl"+dyFInputs.locationObj.countLocation+" locel text-azure'>"+strHTML+"</span> "+
					  "<a href='javascript:dyFInputs.locationObj.setAsCenter("+dyFInputs.locationObj.countLocation+")' class='centers center"+dyFInputs.locationObj.countLocation+" locationEl"+dyFInputs.locationObj.countLocation+" btn btn-xs "+btnSuccess+"'> <i class='fa fa-map-marker'></i>"+locCenter+"</a> <br/>";
			}*/
			if(typeof index != "undefined"){
				mylog.log("---------------addLocationToForm---------------- IF", index);
				strHTML =  
			        "<div class='col-xs-12 text-left shadow2 padding-15 margin-top-15 margin-bottom-15'>" + 
			          "<span class='pull-left locationEl"+dyFInputs.locationObj.countLocation+" locel text-red bold'>"+ 
			            "<i class='fa fa-home fa-2x'></i> "+ 
			            strHTML+ 
			          "</span> "+ 

			          "<a href='javascript:echo;' data-index='"+index+"' data-indexLoc='"+dyFInputs.locationObj.countLocation+"' "+ 
			            "class='deleteLocDynForm locationEl"+dyFInputs.locationObj.countLocation+" btn btn-sm btn-danger pull-right'> "+ 
			            "<i class='fa fa-times'></i> "+tradDynForm.clear+ 
			          "</a>"+ 
			 
			          "<a href='javascript:dyFInputs.locationObj.setAsCenter("+dyFInputs.locationObj.countLocation+")' data-index='"+index+"'"+ 
			            "class='margin-right-5 centers pull-right center"+dyFInputs.locationObj.countLocation+" locationEl"+dyFInputs.locationObj.countLocation+" btn btn-sm "+btnSuccess+"'> "+ 
			            "<i class='fa fa-map-marker'></i> "+locCenter+ 
			          "</a>" + 
			           
			        "</div>"; 
			} else {
				mylog.log("---------------addLocationToForm---------------- ESLE", index);
				strHTML =  
			        "<div class='col-xs-12 text-left shadow2 padding-15 margin-top-15 margin-bottom-15'>" + 
			          "<span class='pull-left locationEl"+dyFInputs.locationObj.countLocation+" locel text-red bold'>"+ 
			            "<i class='fa fa-home fa-2x'></i> "+ 
			            strHTML+ 
			          "</span> "+ 
			 
			          "<a href='javascript:dyFInputs.locationObj.removeLocation("+dyFInputs.locationObj.countLocation+", "+boolCenter+")' "+ 
			            "class='removeLocalityBtn locationEl"+dyFInputs.locationObj.countLocation+" btn btn-sm btn-danger pull-right'> "+ 
			            "<i class='fa fa-times'></i> "+tradDynForm.clear+ 
			          "</a>"+ 
			 
			          "<a href='javascript:dyFInputs.locationObj.setAsCenter("+dyFInputs.locationObj.countLocation+")' "+ 
			            "class='setAsCenterLocalityBtn margin-right-5 centers pull-right center"+dyFInputs.locationObj.countLocation+" locationEl"+dyFInputs.locationObj.countLocation+" btn btn-sm "+btnSuccess+"'> "+ 
			            "<i class='fa fa-map-marker'></i> "+locCenter+ 
			          "</a>" + 
			           
			        "</div>"; 
			}
      		$(".locationlocation").append(strHTML); 
			
			
			// strHTML = "<a href='javascript:removeLocation("+dyFInputs.locationObj.countLocation+", "+true+")'' class=' locationEl"+dyFInputs.locationObj.countLocation+" btn'> <i class='text-red fa fa-times'></i></a>"+
			// 		  "<span class='locationEl"+dyFInputs.locationObj.countLocation+" locel text-azure'>"+strHTML+"</span> "+
			// 		  "<a href='javascript:dyFInputs.locationObj.setAsCenter("+dyFInputs.locationObj.countLocation+")' class='centers center"+dyFInputs.locationObj.countLocation+" locationEl"+dyFInputs.locationObj.countLocation+" btn btn-xs "+btnSuccess+"'> <i class='fa fa-map-marker'></i>"+locCenter+"</a> <br/>";

			$(".postalcodepostalcode").prepend(strHTML);

			mylog.log("strAddres", strHTML);
			//$(".locationlocation").prepend(strHTML);
			dyFInputs.locationObj.countLocation++;
		},
		copyPCForm2Dynform : function (postalCodeObj) { 
			mylog.warn("---------------copyPCForm2Dynform----------------");
			mylog.log("postalCodeObj", postalCodeObj);
			dyFInputs.locationObj.elementPostalCode = postalCodeObj;
			mylog.log("elementPostalCode", dyFInputs.locationObj.elementPostalCode);
			dyFInputs.locationObj.elementPostalCodes.push(dyFInputs.locationObj.elementPostalCode);
			mylog.log("elementPostalCodes", dyFInputs.locationObj.elementPostalCodes);
			mylog.dir(dyFInputs.locationObj.elementPostalCodes);
			//elementPostalCode.push(positionObj);
		},
		addPostalCodeToForm : function (postalCodeObj){
			mylog.warn("---------------addPostalCodeToForm----------------");
			mylog.dir(postalCodeObj);
			var strHTML = "";
			if( postalCodeObj.postalCode)
				strHTML += postalCodeObj.postalCode;
			if( postalCodeObj.name)
				strHTML += " ,"+postalCodeObj.name;
			if( postalCodeObj.latitude)
				strHTML += " ,("+postalCodeObj.latitude;
			if( postalCodeObj.longitude)
				strHTML += " / "+postalCodeObj.longitude+")";
			
			strHTML = "<a href='javascript:dyFInputs.locationObj.removeLocation("+dyFInputs.locationObj.countPostalCode+")' class=' locationEl"+dyFInputs.locationObj.countPostalCode+" btn'> <i class='text-red fa fa-times'></i></a>"+
					  "<span class='locationEl"+dyFInputs.locationObj.countPostalCode+" locel text-azure'>"+strHTML+"</span> <br/>";
			$(".postalcodepostalcode").prepend(strHTML);
			dyFInputs.locationObj.countPostalCode++;
		},
		removeLocation : function (ix,center){
			mylog.log("dyFInputs.locationObj.removeLocation", ix, dyFInputs.locationObj.elementLocations);
			dyFInputs.locationObj.elementLocation = null;
			if(typeof dyFInputs.locationObj.elementLocations[ix].center != "undefined" && dyFInputs.locationObj.elementLocations[ix].center){
				dyFInputs.locationObj.centerLocation = null;
			} 
			dyFInputs.locationObj.elementLocations.splice(ix,1);
			$(".locationEl"+ix).parent().remove();
			//delete dyFInputs.locationObj.elementLocations[ix];
			dyFInputs.locationObj.countLocation--;
			if(dyFInputs.locationObj.countLocation > 0){
				for(var prop in dyFInputs.locationObj.elementLocations){
					if(prop >= ix){
						domNumber=parseInt(prop)+1;
						domParent=$(".locationEl"+domNumber).parent();
						var btnSuccess = "";
						var locCenter = "";
						var boolCenter=false;
						if( typeof center != "undefined" && center && prop==0){
							btnSuccess = "btn-success";
							//locCenter = "<span class='lblcentre'>(localité centrale)</span>";
							locCenter = "<span class='lblcentre'> "+tradDynForm.mainLocality+"</span>"; 
							boolCenter=true;
						}
						domParent.find(".removeLocalityBtn").attr("href","javascript:dyFInputs.locationObj.removeLocation("+prop+","+boolCenter+")");
						domParent.find(".setAsCenterLocalityBtn").attr("href","javascript:dyFInputs.locationObj.setAsCenter("+prop+")");
						$(".locationEl"+domNumber).each(function(){
							$(this).removeClass("locationEl"+domNumber).addClass("locationEl"+prop);
						});
						$(".center"+domNumber).removeClass("center"+domNumber).addClass("center"+prop)/*.append(locCenter)*/;
					}
				}
				if(typeof center != "undefined" && center)
					dyFInputs.locationObj.setAsCenter(0);
				$(".locationBtn").html("<i class='fa fa-home'></i> "+tradDynForm.secondLocality);
			} else{
				$(".locationBtn").html("<i class='fa fa-home'></i> "+tradDynForm.mainLocality);
				//dyFInputs.locationObj.centerLocation = null;
			}
			
			//$.each(function())
			//TODO check if this center then apply on first
			//$(".locationEl"+dyFInputs.locationObj.countLocation).remove();

			/*if(ix != 0){
				removeAddresses(ix-1, true);
			}
			else
				removeAddress(true);*/

		},
		setAsCenter : function (ix){

			$(".centers").removeClass('btn-success');
			$(".lblcentre").remove();
			$.each(dyFInputs.locationObj.elementLocations,function(i, v) {
				mylog.log(v); 
				if(typeof v.center != "undefined" && v.center)
					delete v.center;
			})
			$(".centers").removeClass('btn-success');
			$(".center"+ix).addClass('btn-success').append(" <span class='lblcentre'>addresse principale</span>");
			$(".center"+ix).parent().find(".removeLocalityBtn").attr("href","javascript:dyFInputs.locationObj.removeLocation("+ix+",true)");
			dyFInputs.locationObj.centerLocation = dyFInputs.locationObj.elementLocations[ix];
			dyFInputs.locationObj.elementLocations[ix].center = true;
		}
	},
	scope : function (params){
		var inputObj = {
			label : ( notNull(params) && notNull(params.label) ? params.label : trad.addplacestyournews ),
			inputType : "scope",
			limit : ( notNull(params) && notNull(params.limit) ? params.limit : null ),
			init : function (p) {

				scopeObj.init(p);
				// mylog.log("scopeObj init", p );
				// mylog.log("scopeObj searchScopeDF", $("#searchScopeDF").length );
				// $("#searchScopeDF").off().on("keyup", function(e){
				// 	mylog.log("searchScopeDF", $("#searchScopeDF").val().trim().length);
				// 	if($("#searchScopeDF").val().trim().length > 1){
				// 		if(notNull(scopeObj.timeoutAddCity)) 
				// 			clearTimeout(scopeObj.timeoutAddCity);

				// 		scopeObj.timeoutAddCity = setTimeout(function(){ 
				// 			scopeObj.search(0, 30, "#scopeListContainerForm");
				// 		}, 500);
				// 	}
				// });
			}
		}
		return inputObj;
	},
	
	//produces 
	subDynForm : function(form, multi){

	},
	inputUrl :function (label,placeholder,rules, custom) {  
		label = ( notEmpty(label) ? label : tradDynForm.mainurl );
		placeholder = ( notEmpty(placeholder) ? placeholder : "http://www.exemple.org" );
		rules = ( notEmpty(rules) ? rules : { url: true } );
		custom = ( notEmpty(custom) ? custom : "<div class='resultGetUrl resultGetUrl0 col-sm-12'></div>" );
		var inputObj = dyFInputs.inputText(label, placeholder, rules, custom);
		return inputObj;
	},
	inputUrlOptionnel :function (label, placeholder,rules, custom) {  
		var inputObj = dyFInputs.inputUrl(label, placeholder, rules, custom);
		inputObj.init = function(){
			processUrl.getMediaFromUrlContent("#url", ".resultGetUrl0",0);
			$(".urltext").css("display","none");
	    };
	    return inputObj;
	},
    urls : {
    	label : tradDynForm.freeinfourl,
    	placeholder : tradDynForm.freeinfourl+" ...",
        inputType : "array",
        value : [],
        init:function(){
            processUrl.getMediaFromUrlContent(".addmultifield0", ".resultGetUrl0",1);	
        }
    },
    multiChoice : {
    	label : tradDynForm["Add answers"],
    	placeholder : tradDynForm.answer+" ...",
        inputType : "array",
        value : [],
        init:function(){
            //getMediaFromUrlContent(".addmultifield0", ".resultGetUrl0",1);	
        }
    },
    videos : {
    	label : "Your media videos here",
    	placeholder : tradDynForm.sharevideourl+" ...",
        inputType : "array",
        value : [],
        initOptions : {type:"video",labelAdd:"Add video link"},
        init:function(){
            processUrl.getMediaFromUrlContent(".addmultifield0", ".resultGetUrl0",1, "video");	
        }
    },
    urlsOptionnel : {
        inputType : "array",
        placeholder : tradDynForm.urlandaddinfoandaction,
        value : [],
        init:function(){
            processUrl.getMediaFromUrlContent(".addmultifield0", ".resultGetUrl0",1);
        	$(".urlsarray").css("display","none");	
        }
    },
    keyVal : function(label){
    	return { 	label : ( notEmpty(label) ? label : "" ),
    				inputType : "properties",
    				values : tagsList }
    },
    bookmarkUrl: function(label, placeholder,rules, custom){
    	var inputObj = dyFInputs.inputUrl(label, placeholder, rules, custom);
    	inputObj.init = function(){
    		$("#ajaxFormModal #url").bind("input keyup",function(e) {
            	processUrl.refUrl($(this).val());
            	/*if(result){
            		mylog.log(result);
            	}*/
        	});
            //$(".urltext").css("display","none");
        };
	    return inputObj;
    },
    checkboxSimple : function(checked, id, params){
    
    	var inputObj = {
    		label: params["labelText"],
    		params : params,
	    	inputType : "checkboxSimple",
	    	checked : checked, //$("#ajaxFormModal #"+id).val(),
	    	init : function(){
	    		//var checked = $("#ajaxFormModal #"+id).val();
	    		mylog.log("checkcheck2", checked, "#ajaxFormModal #"+id);
	    		var idTrue = "#ajaxFormModal ."+id+"checkboxSimple .btn-dyn-checkbox[data-checkval='true']";
	    		var idFalse = "#ajaxFormModal ."+id+"checkboxSimple .btn-dyn-checkbox[data-checkval='false']";
	    		if(typeof $("#ajaxFormModal #"+id).data("checked") != "undefined")
	    			checked=$("#ajaxFormModal #"+id).data("checked");//$("#ajaxFormModal #"+id).hasAttr("data-checked");
	    		$("#ajaxFormModal #"+id).val(checked);

	    		if(typeof params["labelInformation"] != "undefined")
	        		$("#ajaxFormModal ."+id+"checkboxSimple label").append(
	        				"<small class='col-md-12 col-xs-12 text-left no-padding' "+
									"style='font-weight: 200;'>"+
									params["labelInformation"]+
							"</small>");

	        	if(checked == "true" || checked){
	    			$(idTrue).addClass("bg-green-k").removeClass("letter-green");
	    			$("#ajaxFormModal ."+id+"checkboxSimple label").append(
	    					"<span class='lbl-status-check margin-left-10'>"+
	    						'<span class="letter-green"><i class="fa fa-check-circle"></i> '+params["onLabel"]+'</span>'+
	    					"</span>");

	    			setTimeout(function(){
    			  		if(typeof params["inputTrue"] != "undefined") 
    			  			$(params["inputTrue"]).hide(400);
    			  	}, 1000);
	        	}
				else if(checked == "false" || !checked){ 
	    			$(idFalse).addClass("bg-red").removeClass("letter-red");
	    			$("#ajaxFormModal ."+id+"checkboxSimple label").append(
	    					"<span class='lbl-status-check margin-left-10'>"+
	    						'<span class="letter-red"><i class="fa fa-minus-circle"></i> '+params["offLabel"]+'</span>'+
	    					"</span>");

	    			setTimeout(function(){
    			  		if(typeof params["inputId"] != "undefined") 
    			  			$(params["inputId"]).hide(400);
    			  	}, 1000);
	    		}
	    		

	    		$("#ajaxFormModal ."+id+"checkboxSimple .btn-dyn-checkbox").click(function(){
	    			var checkval = $(this).data('checkval');
	    			$("#ajaxFormModal #"+id).val(checkval);
	    			mylog.log("EVENT CLICK ON CHECKSIMPLE", checkval);
	    			
	    			if(checkval) {
	    				$(idTrue).addClass("bg-green-k").removeClass("letter-green");
	    			  	$(idFalse).removeClass("bg-red").addClass("letter-red");
	    			  	$("#ajaxFormModal ."+id+"checkboxSimple .lbl-status-check").html(
	    					'<span class="letter-green"><i class="fa fa-check-circle"></i> '+params["onLabel"]+'</span>');
	    			  	
	    			  	if(typeof params["inputId"] != "undefined") $(params["inputId"]).show(400);

	    			  	if(typeof params["inputTrue"] != "undefined") $(params["inputTrue"]).hide(400);
	    			}
	    			else{
	    			  	$(idFalse).addClass("bg-red").removeClass("letter-red");
	    				$(idTrue).removeClass("bg-green-k").addClass("letter-green");
	    				$("#ajaxFormModal ."+id+"checkboxSimple .lbl-status-check").html(
	    					'<span class="letter-red"><i class="fa fa-minus-circle"></i> '+params["offLabel"]+'</span>');

	    				if(typeof params["inputId"] != "undefined") $(params["inputId"]).hide(400);
	    				if(typeof params["inputTrue"] != "undefined") $(params["inputTrue"]).show(400);
	    			}
	    		});

	    	}
	    };

	    return inputObj;
	},
	
	checkbox : function(checked, id, params){
    
    	var inputObj = {
    		label: params["labelText"],
    		inputType : "checkbox",
	    	checked : ( notEmpty(checked) ? checked : "" ),
	    	init : function(){
	        	
	        	$("#ajaxFormModal #"+id).val(checked);
	        	$("#ajaxFormModal ."+id+"checkbox label").append("<span class='lbl-status-check margin-left-10'></span>");
	        	if(typeof params["labelInformation"] != "undefined")
	        		$("#ajaxFormModal ."+id+"checkbox").append("<small class='col-md-12 col-xs-12 text-left no-padding' style='margin-top:-10px;'>"+params["labelInformation"]+"</small>");

	        	setTimeout(function(){
	        		$(".bootstrap-switch-label").off().click(function(){
	        			$(".bootstrap-switch-off").click();
	        		});
	        		
		        	if (checked) {
	    				$("#ajaxFormModal ."+id+"checkbox .lbl-status-check").html(
	    					'<span class="letter-green"><i class="fa fa-check-circle"></i> '+params["onLabel"]+'</span>');
	    				$(params["inputId"]).show(400);
	    				$(params["inputTrue"]).hide(400);
	    			} else {
	    				
	    				$("#ajaxFormModal ."+id+"checkbox .lbl-status-check").html(
	    					'<span class="letter-red"><i class="fa fa-minus-circle"></i> '+params["offLabel"]+'</span>');
	    				$(params["inputId"]).hide(400);
	    				$(params["inputTrue"]).show(400);
	    			}
    			}, 1000);
	        },
	    	"switch" : {
	    		"onText" : params["onText"],
	    		"offText" : params["offText"],
	    		"labelText":params["labelInInput"],
	    		"onChange" : function(){
	    			var checkbox = $("#ajaxFormModal #"+id).is(':checked');
	    			$("#ajaxFormModal #"+id).val($("#ajaxFormModal #"+id).is(':checked'));
	    			mylog.log("on change checkbox",$("#ajaxFormModal #"+id).val());
	        		//$("#ajaxFormModal #"+id+"checkbox").append("<span class='lbl-status-check'></span>");
	    			if (checkbox) {
	    				$("#ajaxFormModal ."+id+"checkbox .lbl-status-check").html(
	    					'<span class="letter-green"><i class="fa fa-check-circle"></i> '+params["onLabel"]+'</span>');
	    				$(params["inputId"]).show(400);
	    				$(params["inputTrue"]).hide(400);
	    				/*if(id=="amendementActivated"){
	    					var am = $("#ajaxFormModal #voteActivated").val();
	    					mylog.log("am", am);
	    					if(am == "true")
	    						$("#ajaxFormModal .voteActivatedcheckbox .bootstrap-switch-handle-on").click();
	    				}
	    				if(id=="voteActivated"){
	    					var am = $("#ajaxFormModal #amendementActivated").val();
	    					mylog.log("vote", am);
	    					if(am == "true")
	    						$("#ajaxFormModal .amendementActivatedcheckbox .bootstrap-switch-handle-on").click();
	    				}*/
	    			} else {
	    				
	    				$("#ajaxFormModal ."+id+"checkbox .lbl-status-check").html(
	    					'<span class="letter-red"><i class="fa fa-minus-circle"></i> '+params["offLabel"]+'</span>');
	    				$(params["inputId"]).hide(400);
	    				$(params["inputTrue"]).show(400);
	    			}
	    		}
		    }
    	};
	    return inputObj;
	},
	colorpicker : function(typeDate, label, placeholder, rules){
    	var inputObj = {
	        inputType : "colorpicker",
	        placeholder: "#ff0066" ,
	        label : ( notEmpty(label) ? label : "Choisir une couleur" ),
	        rules : ( notEmpty(rules) ? rules : {} ) 
	    }
    	return inputObj;
    },
	allDay : function(checked){

    	var inputObj = {
    		inputType : "checkbox",
	    	checked : ( notEmpty(checked) ? checked : "" ),
	    	init : function(){
	        	$("#ajaxFormModal #allDay").off().on("switchChange.bootstrapSwitch",function (e, data) {
	        		mylog.log("allDay dateLimit",$("#ajaxFormModal #allDay").val());
	        	})
	        },
	    	"switch" : {
	    		"onText" : tradDynForm.yes,
	    		"offText" : tradDynForm.no,
	    		"labelText":tradDynForm.allday,
	    		"onChange" : function(){
	    			var allDay = $("#ajaxFormModal #allDay").is(':checked');
	    			var startDate = "";
	    			var endDate = "";
	    			$("#ajaxFormModal #allDay").val($("#ajaxFormModal #allDay").is(':checked'));
	    			
	    			if (allDay) {
	    				$(".dateTimeInput").addClass("dateInput");
	    				$(".dateTimeInput").removeClass("dateTimeInput");
	    				$('.dateInput').datetimepicker('destroy');
	    				$(".dateInput").datetimepicker({ 
					        autoclose: true,
					        lang: "fr",
					        format: "d/m/Y",
					        timepicker:false
					    });
					    startDate = moment($('#ajaxFormModal #startDate').val(), "DD/MM/YYYY HH:mm").format("DD/MM/YYYY");
					    endDate = moment($('#ajaxFormModal #endDate').val(), "DD/MM/YYYY HH:mm").format("DD/MM/YYYY");
	    			} else {
	    				$(".dateInput").addClass("dateTimeInput");
	    				$(".dateInput").removeClass("dateInput");
	    				$('.dateTimeInput').datetimepicker('destroy');
	    				$(".dateTimeInput").datetimepicker({ 
		       				weekStart: 1,
							step: 15,
							lang: 'fr',
							format: 'd/m/Y H:i'
					    });
					    
	    				startDate = moment($('#ajaxFormModal #startDate').val(), "DD/MM/YYYY").format("DD/MM/YYYY HH:mm");
						endDate = moment($('#ajaxFormModal #endDate').val(), "DD/MM/YYYY").format("DD/MM/YYYY HH:mm");
	    			}
				    if (startDate != "Invalid date") $('#ajaxFormModal #startDate').val(startDate);
					if (endDate != "Invalid date") $('#ajaxFormModal #endDate').val(endDate);
	    		}
		    }
    	};
    	return inputObj;
    },
    
    openingHours : function(checked){
    	var inputObj = {
    		inputType : "checkbox",
    		label : "Availabity of your service",
	    	checked : ( notEmpty(checked) ? checked : "" ),
	    	init : function(){
	    		//openingHoursResult=openingHours.init;
	    		openingHoursResult=[
					{"dayOfWeek":"Su","allDay":true, "hours":[{"opens":"06:00","closes":"19:00"}]},
					{"dayOfWeek":"Mo","allDay":true, "hours":[{"opens":"06:00","closes":"19:00"}]},
					{"dayOfWeek":"Tu","allDay":true, "hours":[{"opens":"06:00","closes":"19:00"}]},
					{"dayOfWeek":"We","allDay":true, "hours":[{"opens":"06:00","closes":"19:00"}]},
					{"dayOfWeek":"Th","allDay":true, "hours":[{"opens":"06:00","closes":"19:00"}]},
					{"dayOfWeek":"Fr","allDay":true, "hours":[{"opens":"06:00","closes":"19:00"}]},
					{"dayOfWeek":"Sa","allDay":true, "hours":[{"opens":"06:00","closes":"19:00"}]},
				];
	    		//jQuery.datetimepicker.setLocale('fr');
	    		//$('.changeTime').datetimepicker({format:"HH:MM"});
	    		$(".btn-select-day").click(function(){
	    			key=$(this).data("key");
	    			if($(this).hasClass("active")){
	    				$(this).removeClass("active");
	    				$.each(openingHoursResult, function(e,v){
	    					if(v.dayOfWeek==key)
	    						openingHoursResult[e].disabled=true;
	    				});
	    				$("#contentDays"+key).fadeOut();
	    			}else{
	    				$(this).addClass("active");
	    				$.each(openingHoursResult, function(e,v){
	    					if(v.dayOfWeek==key)
	    						delete openingHoursResult[e].disabled;
	    				});
	    				$("#contentDays"+key).fadeIn();
	    			}
	    		});
	    		$(".allDaysWeek").click(function(){
	    			keyRange=$(this).data("key");
	    			//alert(keyRange);
	        		if($(this).is(':checked')){
	        			$("#hoursRange"+keyRange).fadeOut("slow");
	        			$.each(openingHoursResult, function(e,v){
	    					if(v.dayOfWeek==keyRange)
	        					openingHoursResult[e].allDay=true;
	        			});
	        		}else{
	        			$("#hoursRange"+keyRange).fadeIn("slow");
	        			$.each(openingHoursResult, function(e,v){
	    					if(v.dayOfWeek==keyRange)
	        					openingHoursResult[e].allDay=false;
	        			});
	        		}
	    		});
	        },
	        options: {"allWeek" : true},
	    	"switch" : {
	    		"onText" : tradDynForm.yes,
	    		"offText" : tradDynForm.no,
	    		"labelText":tradDynForm.allweek,
	    		"css":{"min-width": "300px","margin": "10px"},
	    		"onChange" : function(){
	    			var allWeek = $("#ajaxFormModal #openingHours").is(':checked');
	    			$("#ajaxFormModal #openingHours").val($("#ajaxFormModal #openingHours").is(':checked'));
	    			if (allWeek) {
	    				$("#ajaxFormModal #selectedDays").fadeOut("slow");
	    			} else {
	    				$("#ajaxFormModal #selectedDays").fadeIn("slow");
	    			}
				    //if (startDate != "Invalid date") $('#ajaxFormModal #startDate').val(startDate);
					//if (endDate != "Invalid date") $('#ajaxFormModal #endDate').val(endDate);
	    		}
		    },
    	};
    	return inputObj;
    },
    startDateInput : function(typeDate){
    	mylog.log('startDateInput', typeDate);
    	var inputObj = {
	        inputType : ( notEmpty(typeDate) ? typeDate : "datetime" ),
	        placeholder: tradDynForm.startDate,
	        label : tradDynForm.startDate,
	        rules : { 
	        	required : true,
	        	duringDates: ["#startDateParent","#endDateParent",tradDynForm.thestartDate]
	    	}
	    }
    	return inputObj;
    },
    endDateInput : function(typeDate){
    	var inputObj = {
	        inputType : ( notEmpty(typeDate) ? typeDate : "datetime" ),
	        placeholder: tradDynForm.endDate,
	        label : tradDynForm.endDate,
	        rules : { 
	        	required : true,
	        	greaterThan: ["#ajaxFormModal #startDate",tradDynForm.thestartDate],
	        	duringDates: ["#startDateParent","#endDateParent",tradDynForm.theendDate]
		    }
	    }
    	return inputObj;
    },
    dateInput : function(typeDate, label, placeholder, rules){
    	var inputObj = {
	        inputType : ( notEmpty(typeDate) ? typeDate : "datetime" ),
	        placeholder: ( notEmpty(placeholder) ? placeholder : "Saisir une date" ),
	        label : ( notEmpty(label) ? label : "Saisir une date" ),
	        rules : ( notEmpty(rules) ? rules : {} ) 
	    }
    	return inputObj;
    },
    birthDate : {
        inputType : "date",
        label : tradDynForm.birthdate,
        placeholder: tradDynForm.birthdate
    },
    dateEnd :{
    	inputType : "date",
    	label : tradDynForm.endDate,
    	placeholder : "Fin de la période de vote",
    	rules : { 
    		required : true,
    		greaterThanNow : ["DD/MM/YYYY"]
    	}
    },
    voteDateEnd :{
    	inputType : "datetime",
    	label : tradDynForm.dateEndVoteSession,
    	placeholder : tradDynForm.dateEndVoteSession,
    	rules : { 
    		required : true,
    		greaterThanNow : ["DD/MM/YYYY H:m"]
    	}
    },
    amendementDateEnd :{
    	inputType : "datetime",
    	label : tradDynForm.dateEndAmendementSessionStartVote,
    	placeholder : tradDynForm.dateEndAmendementSession,
    	rules : { 
    		required : true,
    		greaterThanNow : ["DD/MM/YYYY H:m"]
    	}
    },
    inviteSearch : {
    	inputType : "searchInvite",
       	init : function(){
        	$("#ajaxFormModal #inviteSearch ").keyup(function(e){
			    var search = $('#inviteSearch').val();
			    if(search.length>2){
			    	clearTimeout(timeout);
					timeout = setTimeout('autoCompleteInviteSearch("'+encodeURI(search)+'")', 500); 
				}else{
				 	$("#newInvite #dropdown_searchInvite").css({"display" : "none" });	
				}	
			});
        }
    },
    invitedUserEmail : {
    	placeholder : "Email",
        inputType : "text",
        rules : {
            required : true
        },
        init:function(){
        	$(".invitedUserEmailtext").css("display","none");	 
        }
    },
    inputHidden :function(value, rules) { 
    	console.log("inputHidden", value, rules);
		var inputObj = { inputType : "hidden"};
		if( notNull(value) ) inputObj.value = value ;
		if( notNull(rules) ) inputObj.rules = rules ;
		console.log("inputHidden and ", inputObj);
    	return inputObj;
    },
    get:function(type){
    	mylog.log("dyFInputs.get", type);
    	if( type == "undefined" ){
    		toastr.error("type can't be undefined");
    		return null;
    	}
    	var obj = null;
    	if( jsonHelper.notNull("typeObj."+type)){
    		if (jsonHelper.notNull("typeObj."+type+".sameAs") ){
    			obj = typeObj.get(type);
    		} else
    			obj = typeObj[type];
    		obj.name = (trad[type]) ? trad[type] : type;
    	}
    	if( obj === null ){
    		obj = dyFInputs.deepGet(type);
    		if( obj ){
    			obj = dyFInputs.get( obj.col )
    		}
    	}
    	mylog.log("dyFInputs.get return", obj);
    	return obj;
    },
    deepGet:function(type){
    	//mylog.log("get", type);
    	var obj = null;
    	$.each( typeObj,function(k,o) { 
    		if( o.subTypes && ( $.inArray( type,  o.subTypes )>=0 ) ){
    			obj = o;
    			return false;
    		}
    	});
    	return obj;
    },
    setHeader : function(subClass) { 
    	$("#ajax-modal .modal-header").removeClass("bg-dark bg-purple bg-red bg-azure bg-green bg-green-poi bg-orange bg-yellow bg-yellow-k bg-blue bg-turq bg-url")
						  			  .addClass(subClass);
	},
    setSub : function(subClass) { 
    	dyFInputs.setHeader(subClass);
		
    	/*if( (contextData != null && contextData.type && contextData.id) || userId )
		{
			cId = userId;
			cType = "citoyens";
			cName = userConnected.name;
			if(typeof contextData != "undefined" && contextData.type && contextData.id){
				cId = contextData.id;
				cType = contextData.type;
				cName = contextData.name;
			}

			$('#ajaxFormModal #parentId').val( cId );
			$("#ajaxFormModal #parentType").val( cType ); 
			
		} 
		$("#ajax-modal-modal-title").html(
		 	$("#ajax-modal-modal-title").html()+
		 		" <br><small class='text-white'>"+tradDynForm.speakingas+" : <span class='text-dark'>"+cName+"</span></small>" );*/
		
    },
    links: function(params){
    	mylog.log("HERE links params", params);
    	var inputObj = {
			inputType : "finder",
			label : ( notEmpty(params) && notEmpty(params.label) ? params.label : tradDynForm.whoiscarrytheproject ),
			multiple : ( notEmpty(params) &&notEmpty(params.multiple) ? params.multiple : true ),
			invite :  ( notEmpty(params) &&notEmpty(params.invite) ? params.invite : true ),
			rules : { required : ( notEmpty(params) && notEmpty(params.required) ? params.required : true ), lengthMin:( notEmpty(params) && notEmpty(params.lengthMin) ? params.lengthMin : null ) },
			initType: ( notEmpty(params) &&notEmpty(params.type) ? params.type : ["persons"] ),
			openSearch :( notEmpty(params) &&notEmpty(params.openSearch) ? params.openSearch : true )
		}
		mylog.log("HERE links", inputObj);
    	return inputObj;
    }
}
var dyFCustom = {
	orderForm:[],
	beforeBuild : function (obj) {
		$.each(obj,function(f,p) {
			mylog.log("beforeBuild", f,p);
			if(typeof dyFCustom[f] == "function")
				f = dyFCustom[f];
			if(typeof f == "function"){
				if(p==1)
					f();
				else if(typeof p == "object")
					f(p);
				else if(typeof p == "string")
					f(p);
			}
		});
	},
	init : function (obj) {
		mylog.log("dyFCustom init", obj);
		if( typeof obj.onload != "undefined" 
			&& typeof obj.onload.actions != "undefined"){
			mylog.log("dyFCustom obj.onload.actions", obj.onload.actions);
			$.each(obj.onload.actions,function(f,p) {
				mylog.log("dyFCustom f,p", f,p);
				if(typeof dyFCustom[f] == "function")
					f = dyFCustom[f];
				else if(	typeof dyFObj.elementObj.dynForm.jsonSchema.actions == "function" && 
							typeof dyFObj.elementObj.dynForm.jsonSchema.actions[f] == "function")
					f = dyFObj.elementObj.dynForm.jsonSchema.actions[f];				
				if(typeof f == "function"){
					if(p==1)
						f();
					else if(typeof p == "object")
						f(p);
					else if(typeof p == "string")
						f(p);
				}
		 	});
		}
	},
	setTitle:function(p){
		mylog.log("dyFCustom setTitle", p);
		$("#ajax-modal-modal-title").html(p);
	},
    adminOnly : function(p) {
    	mylog.log("dyFCustom adminOnly", p);
		if(  typeof costum != "undefined" 
			&& typeof costum.admins != "undefined" 
			&& typeof costum.admins[userId] != "undefined" 
			&& typeof costum.admins[userId].isAdmin != "undefined" 
			&& costum.admins[userId].isAdmin == true ){
				
			$.each(p,function(el,v) {
				$("."+el).show();
				alert("adminOnly show "+el);
		 	});
				
		} else {
			$.each(p,function(el,v) {
				$("."+el).hide();
				alert("adminOnly hide "+el);
		 	});
		}
	},
	presetValue : function(p) {
		mylog.log("dyFCustom presetValue !", p);
		$.each(p,function(k,v) {
			mylog.log("dyFCustom presetValue k v", k, v, $("#"+k).length);
			$("#"+k).val(v);
			if(k=="type" && dyFObj.elementObj.col=="poi"){
				$(".sectionBtn[data-key='"+v+"']").trigger("click");
			//	dyFObj.canSubmitIf();
			}
	 	});	    		
	},
	html : function(p) {
		mylog.log("dyFCustom html", p);
		$.each(p,function(k,v) {
			$("."+k).html(v);
	 	});	    		
	},
	hide : function(p) {
		mylog.log("dyFCustom hide", p);
		$.each(p,function(k,v) {
			$("."+k).hide();
	 	});	    		
	},
	required : function(p) {
		mylog.log("dyFCustom required", p);
		$.each(p,function(f,k) {
			if( typeof dyFObj.elementObj.dynForm.jsonSchema.properties[f] != "undefined" ){
				if( typeof dyFObj.elementObj.dynForm.jsonSchema.properties[f].rules != "undefined" && 
					dyFObj.elementObj.dynForm.jsonSchema.properties[f].rules != null){
					dyFObj.elementObj.dynForm.jsonSchema.properties[f].rules.required = (k === 1 ? true : false);
				} else {
					dyFObj.elementObj.dynForm.jsonSchema.properties[f].rules = { required : (k === 1 ? true : false) };
				}
			}
		});
	},
	properties : function(p){
		dyFCustom.orderForm=[];
		orderingForm=false;
		$.each(dyFObj.elementObj.dynForm.jsonSchema.properties, function(e,v){
			dyFCustom.orderForm.push(e);
		});
		$.each(p,function(f,k) {
			mylog.log("ESPION costum properties: ", dyFObj.elementObj.dynForm.jsonSchema.properties[f]);
			if(typeof k.order != "undefined"){
				orderingForm=true;
				dyFCustom.orderForm.splice(k.order, 0, f); 
			}else
				dyFCustom.orderForm.splice(dyFCustom.orderForm.length, 0, f);
			
			if(typeof dyFObj.elementObj.dynForm.jsonSchema.properties[f] != "undefined"){
				dyFObj.elementObj.dynForm.jsonSchema.properties[f]=dyFCustom.setProperties(k, dyFObj.elementObj.dynForm.jsonSchema.properties[f]);
			} else {
				if( typeof dyFInputs != "undefined" && 
					typeof dyFInputs[f] != "undefined" ){
					// A priori on passe pas par ici car les objets existants sont déjà instanciés !!')
					var temp = dyFInputs[f]();
					temp= dyFCustom.setProperties(k, temp);
					dyFObj.elementObj.dynForm.jsonSchema.properties[f] = temp;
				}else
					dyFObj.elementObj.dynForm.jsonSchema.properties[f] = k;
			}
	 	});
	 	if(orderingForm)
	 		dyFObj.elementObj.dynForm.jsonSchema.properties=dyFCustom.orderingProperties(dyFObj.elementObj.dynForm.jsonSchema.properties, dyFCustom.orderForm);
	},
	orderingProperties : function(properties, order){
		mylog.log("sisi la famille", properties, order);
		object={};
		$.each(order, function(e, v){
			object[v]=properties[v];
		});
		return object;
	},
	setProperties : function(cusProp, prop){
		$.each(cusProp, function(e, v){
			prop[e]=v;
        });
        return prop;
	}
};

/* ***********************************
ARRAY FORM help create array filled by dynForm entries and defined by dynform properties
considers existing varaible ssuch as 
form
scenarioKey
********************************** */
var arrayForm = {
	form : null,
	buildFormSchema : function(f, k, q, pos) { 
		arrayForm.form = {
			jsonSchema : {
				title : (jsonHelper.notNull( "ctxDynForms."+f+"."+k+"."+q)) ? ctxDynForms[f][k][q].title : form[scenarioKey][f].form.scenario[k].json.jsonSchema.title,
				icon : (jsonHelper.notNull( "ctxDynForms."+f+"."+k+"."+q)) ? ctxDynForms[f][k][q].icon : form[scenarioKey][f].form.scenario[k].json.jsonSchema.icon,
				onLoads : {
					onload : function(){
						dyFInputs.setHeader("bg-dark");
						$('.form-group div').removeClass("text-white");
						dataHelper.activateMarkdown(".form-control.markdown");
						if( jsonHelper.notNull('ctxDynForms.'+f+'.'+k+'.'+q+'.onLoads.onload') ){
							ctxDynForms[f][k][q].onLoads.onload();
						}
					}
				},
				save : function() { 
					var data = {
		    			formId : f,
		    			answerSection : (typeof answerSection != "undefined") ? answerSection : f+".answers."+k+"."+q ,
		    			arrayForm : true,
		    			answers : arrayForm.getAnswers(arrayForm.form , true)
		    		};
		    		
		    		//for saving edits
		    		if(typeof pos != "undefined"){
		    			data.answerSection = (typeof answerSection != "undefined") ? answerSection+"."+pos : f+".answers."+k+"."+q+"."+pos;
		    			data.edit = true;
		    		}

		    		data.collection = answerCollection;
	    			data.id = answerId;
	    			urlPath = baseUrl+"/survey/co/update2";
		    		
		    		console.log("save",data);
		    		//alert("save arrayForm");

		    		$.ajax({ type: "POST",
				        url: urlPath,
				        data: data,
						type: "POST",
				    }).done(function (data) {
				    	//toastr.success('Enregistré avec succés!');
				    	window.location.reload(); 
				    });
				},
				properties : (jsonHelper.notNull( "ctxDynForms."+f+"."+k+"."+q) ) ? ctxDynForms[f][k][q].properties : form[scenarioKey][f].form.scenario[k].json.jsonSchema.properties[q].properties
			}
		};
		console.log("buildFormSchema AF form",arrayForm.form);
		
	},
	add : function (f, k, q,pos,data) { 
		console.log("add AF",f, k, q,pos,data);
		arrayForm.buildFormSchema(f,k,q,pos);
		if( typeof pos != "undefined" )
			dyFObj.openForm( arrayForm.form, null, answers[f].answers[k][q][pos] );
		else 
			dyFObj.openForm( arrayForm.form );
	},
	del : function  (f,k,q,pos) { 
		console.log("del AF",f,k,q,pos);
		var modal = bootbox.dialog({
	        message: "Vous bien sur ?",
	        title: "Confirmez",
	        buttons: [
	          {
	            label: "Ok",
	            className: "btn btn-primary pull-left",
	            callback: function() {
	            	
				data = {
					formId : f,
					answerSection : (typeof answerSection != "undefined") ? answerSection+"."+pos : f+".answers."+k+"."+q+"."+pos ,
					answers : null,
					pull : (typeof answerSection != "undefined") ? answerSection : f+".answers."+k+"."+q
					
				};
				
				data.collection = answerCollection;
				data.id = answerId;
				urlPath = baseUrl+"/survey/co/update2";
				
				console.log("save",data);

				$.ajax({ type: "POST",
			        url: urlPath,
			         data: data,
					type: "POST",
			    }).done(function (data) {
			    	window.location.reload(); 
			    });
	            }
	          },
	          {
	            label: "Annuler",
	            className: "btn btn-default pull-left",
	            callback: function() {}
	          }
	        ],
	        show: false,
	        onEscape: function() {
	          modal.modal("hide");
	        }
	    });
	    modal.modal("show");
		
	},
	edit : function  (f,k, q,pos) { 
		console.log("edit AF",f,k,q,pos);
		arrayForm.add(f, k, q, pos);
	},
	getAnswers : function(dynJson)
	{
		var editAnswers = {};
		$.each( dynJson.jsonSchema.properties , function(field,fieldObj) { 
	        console.log($(this).data("step")+"."+field, $("#"+field).val() );
	        if( fieldObj.inputType ){
	            if(fieldObj.inputType=="uploader"){
	            	listObject=$('#'+fieldObj.domElement).fineUploader('getUploads');
			    	goToUpload=false;
			    	if(listObject.length > 0){
			    		$.each(listObject, function(e,v){
			    			if(v.status == "submitted")
			    				goToUpload=true;
			    		});
			    	}

					if( goToUpload ){       		
			    
	         		//if( $('#'+fieldObj.domElement).fineUploader('getUploads').length > 0 ){
						$('#'+fieldObj.domElement).fineUploader('uploadStoredFiles');
						editAnswers[field] = "";
	            	}
	            } else {
	            	console.log(field,$("#"+field).val());
	            	editAnswers[field] = $("#"+field).val();
	            }
	        }
	    });
	    
		console.log("editAnswers",editAnswers);
	    return editAnswers;
	}
}

/* ***********************************
			EXTRACTPROCCESS
********************************** */
var processUrl = {
	isLoading:false,
	checkUrlExists: function(url){
	    url = url.trim();
	    if(url.lastIndexOf("/") == url.lenght){
	        url = url.substr(0, url.lenght-1);
	        $("#form-url").val(url); 
	    }

	    $.ajax({
	        type: "POST",
	        url: baseUrl+"/"+moduleId+"/app/checkurlexists",
	        data: { url: url },
	        dataType: "json",
	        success: function(data){ mylog.log("checkUrlExists", data);
	            if(data.status == "URL_EXISTS")
	            urlExists = true;
	            else
	            urlExists = false;
	            mylog.log("checkUrlExists", data);
	            refUrl(url);
	        },
	        error: function(data){
	            mylog.log("check url exists error");
	        }
	    });
	},
	getMediaFromUrlContent : function(className, appendClassName,nbParent, typeExtract){
	    //user clicks previous thumbail
	    lastUrl = "";
	    if(typeof typeExtract != "undefined")
	    	var typeExtract=typeExtract;
	    $("body").on("click","#thumb_prev", function(e){        
	        if(img_arr_pos>0) 
	        {
	            img_arr_pos--; //thmubnail array position decrement
	            
	            //replace with new thumbnail
	            $("#extracted_thumb").html('<img src="'+extracted_images[img_arr_pos]+'" width="100" height="100">'+selectThumb);
	            
	            //replace thmubnail position text
	            $("#total_imgs").html((img_arr_pos) +' of '+ total_images);
	        }
	    });
	    
	    //user clicks next thumbail
	    $("body").on("click","#thumb_next", function(e){        
	        if(img_arr_pos<total_images)
	        {
	            img_arr_pos++; //thmubnail array position increment
	            
	            //replace with new thumbnail
	            $("#extracted_thumb").html('<img src="'+extracted_images[img_arr_pos]+'" width="100" height="100">'+selectThumb);
	            
	            //replace thmubnail position text
	            $("#total_imgs").html((img_arr_pos) +' of '+ total_images);
	        }
	    }); 
	    var getUrl  = $(className); //url to extract from text field
	    var appendClassName = appendClassName;
	    getUrl.bind("input keyup",function(e) { //user types url in text field        
	        //url to match in the text field
	        var $this = $(this);
	        if($(appendClassName).html()==""){
	        if($this.parents().eq(nbParent).find(appendClassName).html()=="" || (e.which==32 || e.which==13)){
	        	//var match_url=new RegExp("(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?")
	        	//var match_url=new RegExp("(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})");
	        	//var match_url=/\b(https?):\/\/([\-A-Z0-9. \-]+)(\/[\-A-Z0-9+&@#\/%=~_|!:,.;\-]*)?(\?[A-Z0-9+&@#\/%=~_|!:,.;\-]*)?/i
		       // var match_url = /\b(https?|ftp):\/\/([\-A-Z0-9. \-]+?|www\\.)(\/[\-A-Z0-9+&@#\/%=~_|!:,.;\-]*)?(\?[A-Z0-9+&@#\/%=~_|!:,.;\-]*)?/i;
		       // var match_url=new RegExp("(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
		        //var match_url=/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
		        var match_url=/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ@:%_\+.~#?&//=]*)/g;

		        if (match_url.test(getUrl.val())) 
		        {
		        	extract_url=getUrl.val().match(match_url)[0];
		        	extract_url=extract_url.replace(/[\n]/gi," ");
		        	extract_url=extract_url.split(" ");
		        	extract_url=extract_url[0];
			        if(lastUrl != extract_url && processUrl.isLoading==false){
			        	processUrl.isLoading=true;
			        	var extracted_url = extract_url;
		                $this.parents().eq(nbParent).find(".loading_indicator").show(); //show loading indicator image
		                //ajax request to be sent to extract-process.php
		                lastUrl=extracted_url;
		                extracted_url_send=extracted_url;
		                if(extracted_url_send.indexOf("http")<0)
		                	extracted_url_send = "http://"+extracted_url;
		                $.ajax({
							url: baseUrl+"/news/co/extractprocess",
							data: {'url': extracted_url_send},
							type: 'post',
							dataType: 'json',
							success: function(data){        
				                mylog.log(data); 
				                processUrl.isLoading=false;
				                if(data.type=="activityStream"){
				                  	content = '<a href="javascript:;" class="removeMediaUrl"><i class="fa fa-times"></i></a>'+
				                			 directory.showResultsDirectoryHtml(new Array(data.object), data.object.type)+
				                			"<input type='hidden' class='type' value='activityStream'>"+
											"<input type='hidden' class='objectId' value='"+data.object.id+"'>"+
											"<input type='hidden' class='objectType' value='"+data.object.type+"'>";
				                }else{
				                	if(typeof typeExtract != "undefined" && typeExtract=="video"){
				                		if(typeof data.content !="undefined" && typeof data.content.videoLink != "undefined")
				                			content= processUrl.getMediaVideo(data,"save");
				                		else 
				                			content="<span class='text-red'><i>This url is not associate to a video</i></span>";
				                	}else
			                    		content = processUrl.getMediaCommonHtml(data,"save");
				                }
			                    //load results in the element
			                    //return content;
			                   //$("#results").html(content); 
			                    $this.parents().eq(nbParent).find(appendClassName).html(content).slideDown();
			                    //$this.parents().eq(nbParent).slideDown();
			                    if($this.parent().find(".dynFormUrlsWarning").length > 0)
				                   $this.parent().find(".dynFormUrlsWarning").remove(); 
			                    
			                    $(".removeMediaUrl").click(function(){
				                    $trigger=$(this).parents().eq(1).find(className);
								    $this.parents().eq(nbParent).find(appendClassName).empty().hide();
								    $trigger.trigger("input");
								});
								//append received data into the element
			                    //$("#results").slideDown(); //show results with slide down effect
			                    $this.parents().eq(nbParent).find(".loading_indicator").hide(); //hide loading indicator image
		                	},
							error : function(){
								$.unblockUI();
								//toastr.error(trad["wrongwithurl"] + " !");
								 processUrl.isLoading=false;
								//content to be loaded in #results element
								var content = '<a href="javascript:;" class="removeMediaUrl"><i class="fa fa-refresh"></i></a><h4><a href="'+extracted_url+'" target="_blank" class="lastUrl wrongUrl">'+extracted_url+'</a></h4>';
			                    //load results in the element
			                    $this.parents().eq(nbParent).find(appendClassName).hide();
			                    $this.parents().eq(nbParent).find(appendClassName).html(content);
			                    $this.parents().eq(nbParent).find(appendClassName).slideDown();
			                    toastr.warning("L'url "+extracted_url+" ne pointe vers aucun site ou un problème est survenu à son extraction");
			                    if ($("#ajaxFormModal").is(":visible") && $this.parent().find(".dynFormUrlsWarning").length <= 0)
									$this.parent().append( "<span class='text-red dynFormUrlsWarning'>* Ceci n'est pas un url valide.</span>" );         	
			                    $(".removeMediaUrl").click(function(){
				                    $trigger=$(this).parents().eq(1).find(className);
								    $this.parents().eq(nbParent).find(appendClassName).empty().hide();
								    $trigger.trigger("input");
								});

			                    //$("#results").html(content); //append received data into the element
			                    //$("#results").slideDown(); //show results with slide down effect
			                    $this.parents().eq(nbParent).find(".loading_indicator").hide(); //hide loading indicator image
							}	
		                });
					}
	        	} else if ($("#ajaxFormModal").is(":visible") && $this.parent().find(".dynFormUrlsWarning").length <= 0){
					//$this.parent().append( "<span class='text-red dynFormUrlsWarning'>* Ceci n'est pas un url valide.</span>" );         	
	        	}
	        }
	    }
	    }); 
	},
	extractUrl : function(inputClass, url,callback) { 

		$(inputClass+" span.help-block").html(trad.waitWeFetch+" <i class='fa fa-spin fa-refresh'></i>");
	
		$.ajax({
			url: baseUrl+"/news/co/extractprocess",
			data: { 'url' : url },
			type: 'post',
			dataType: 'json',
			success: function(data){  
				$(inputClass+" span.help-block").html('');
				if (typeof callback == "function") 
					callback(data);
				return data;
			},
			error:function(xhr, status, error){
				toastr.info("<span class='letter-red'><i class='fa fa-ban'></i> URL INNACCESSIBLE</span>");
				$(inputClass+" span.help-block").html('');
			},
			statusCode:{
				404: function(){
					toastr.info("<span class='letter-red'><i class='fa fa-ban'></i> 404 : URL INTROUVABLE OU INACCESSIBLE</span>");
					$(inputClass+" span.help-block").html('');
				}
			}
		})
	},
	refUrl: function(url){
	    if(!processUrl.isValidURL(url)){
	        $("#status-ref").html("<span class='letter-red'><i class='fa fa-times'></i> cette url n'est pas valide.</span>");
	        return;
	    }
		$("#status-ref").html("<span class='letter-blue'><i class='fa fa-spin fa-refresh'></i> "+trad.currentlyresearching+"</span>");
		$("#refResult").addClass("hidden");
		$("#send-ref").addClass("hidden");

		//urlValidated = "";

	    //$.ajax({ 
	    //	url: "//cors-anywhere.herokuapp.com/" + url, // 'http://google.fr', 
	    	//crossOrigin: true,
	    //	timeout:10000,
	      //  success:
	    processUrl.extractUrl("", url,function(data) {
				  /*  var jq = $.parseHTML(data);
				    
				    var tempDom = $('<output>').append($.parseHTML(data));
				    var title = $('title', tempDom).html();
				    var stitle = "";

				    if(stitle=="" || stitle=="undefined")
				   		stitle = $('blockquote', tempDom).html();

				   	//mylog.log("STITLE", stitle);

					if(stitle=="" || stitle=="undefined")
				   		stitle = $('h2', tempDom).html();

					if(stitle=="" || stitle=="undefined")
				   		stitle = $('h3', tempDom).html();

					if(stitle=="" || stitle=="undefined")
				   		stitle = $('blockquote', tempDom).html();

					if(title=="" || title=="undefined")
				   		title = stitle;

	                var favicon = $("link[rel*='icon']", tempDom).attr("href");
	                var hostname = (new URL(url)).origin;
	                var faviconSrc = "";
	                if(typeof favicon != "undefined"){
	                    var faviconSrc = hostname+favicon;
	                    if(favicon.indexOf("http")>=0) faviconSrc = favicon;
	                }*/

					//var description = $(tempDom).find('meta[name=description]').attr("content");

					//var keywords = $(tempDom).find('meta[name=keywords]').attr("content");
					//mylog.log("keywords", keywords);

					var arrayKeywords = new Array();
					if(typeof data.keywords != "undefined")
						arrayKeywords = data.keywords;

					//mylog.log("arrayKeywords", arrayKeywords);

					//if(typeof arrayKeywords[0] != "undefined") $("#form-keywords1").val(arrayKeywords[0]); else $("#form-keywords1").val("");
					//if(typeof arrayKeywords[1] != "undefined") $("#form-keywords2").val(arrayKeywords[1]); else $("#form-keywords2").val("");
					//if(typeof arrayKeywords[2] != "undefined") $("#form-keywords3").val(arrayKeywords[2]); else $("#form-keywords3").val("");
					//if(typeof arrayKeywords[3] != "undefined") $("#form-keywords4").val(arrayKeywords[3]); else $("#form-keywords4").val("");

					//if(description=="" || description=="undefined")
				   	//	if(stitle=="" || stitle=="undefined")
				   	//		description = stitle;
				   /*	params = new Object;
				   	params.title=title,
				   	params.favicon=faviconSrc,
				   	params.hostname=hostname,
				   	params.description=description,
				   	params.tags=arrayKeywords;
					mylog.log(params);*/
					/*$("#form-title").val(title);
	                $("#form-favicon").val(faviconSrc);
	                $("#form-description").val(description);*/
					

					//color
					$("#ajaxFormModal #name").val(data.name);   	
				   	//color	
					$("#ajaxFormModal #description").val(data.description); 
				   	//color
				   	if(notEmpty(arrayKeywords))		
						$("#ajaxFormModal #tags").select2("val",arrayKeywords);
					/*if($("#form-keywords1").val() != "")   $("#lbl-keywords").removeClass("text-orange").addClass("letter-green");
					else 								   $("#lbl-keywords").removeClass("letter-green").addClass("text-orange");
				   		
				   	$("#form-title").off().keyup(function(){
				   		if($(this).val()!="")$("#lbl-title").removeClass("letter-red").addClass("letter-green");
						else 				 $("#lbl-title").removeClass("letter-green").addClass("letter-red");
						checkAllInfo();
				   	});
				   	$("#form-description").off().keyup(function(){
				   		if($(this).val()!="")$("#lbl-description").removeClass("text-orange").addClass("letter-green");
						else 				 $("#lbl-description").removeClass("letter-green").addClass("text-orange");
						checkAllInfo();
				   	});
				   	$("#form-keywords1").off().keyup(function(){
				   		if($(this).val()!="")$("#lbl-keywords").removeClass("text-orange").addClass("letter-green");
						else 				 $("#lbl-keywords").removeClass("letter-green").addClass("text-orange");
						checkAllInfo();
				   	});

				   	$("#status-ref").html("<span class='letter-green'><img src='"+faviconSrc+"' height=30 alt='x'> <i class='fa fa-check'></i> Nous avons trouvé votre page</span>");
	    			$("#refResult").removeClass("hidden");
				   
				   	$("#lbl-url").removeClass("letter-red").addClass("letter-green");
				   	urlValidated = url;

				    $('<output>').remove();
				    tempDom = "";

				    checkAllInfo();*/	
				    //return params;		   
				/*},
			error:function(xhr, status, error){
				$("#lbl-url").removeClass("letter-green").addClass("letter-red");
				$("#status-ref").html("<span class='letter-red'><i class='fa fa-ban'></i> URL INNACCESSIBLE</span>");
			},
			statusCode:{
				404: function(){
					$("#lbl-url").removeClass("letter-green").addClass("letter-red");
					$("#status-ref").html("<span class='letter-red'><i class='fa fa-ban'></i> 404 : URL INTROUVABLE OU INACCESSIBLE</span>");
				}
			}*/
		});
	},
	isValidURL:function(url) {
  		var match_url = new RegExp("(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
  		return match_url.test(url);
	},
	getMediaCommonHtml: function(data,action,id){
		if(typeof(data.images)!="undefined"){
			extracted_images = data.images;
			total_images = parseInt(data.images.length);
			img_arr_pos=1;
	    }
	    inputToSave="";
	    widthMediaDescription="col-xs-12 margin-top-10";
	    if(typeof(data.content) !="undefined" && typeof(data.content.imageSize) != "undefined"){
	        if (data.content.videoLink){
	            extractClass="extracted_thumb";
	            if(data.content.imageSize =="large" && (!notNull(action) || action=="show")){
	                extractClass="extracted_thumb_large col-xs-12";
	                width="100%";
	                height="";
	                faSize="4x";
	            }
	            else{
	                extractClass="extracted_thumb col-xs-4";
	                width="100%";
	                height="100%";
	                faSize="3x";
	                widthMediaDescription="col-xs-8";
	            }
	            aVideo='<a href="javascript:;" class="videoSignal text-white center"><i class="fa fa-'+faSize+' fa-play-circle-o"></i><input type="hidden" class="videoLink" value="'+data.content.videoLink+'"/></a>';
	            inputToSave+="<input type='hidden' class='video_link_value' value='"+data.content.videoLink+"'/>"+
	            "<input type='hidden' class='media_type' value='video_link' />";   
			}
	        else{
	            aVideo="";
	            endAVideo="";
	            if(data.content.imageSize =="large" && (!notNull(action) || action=="show")){
	                extractClass="extracted_thumb_large col-xs-12";
	                width="100%";
	                height="";
	            }
	            else{
	                extractClass="extracted_thumb col-xs-4";
	                width="100";
	                height="100";
	                widthMediaDescription="col-xs-8";
	            }
	            inputToSave+="<input type='hidden' class='media_type' value='img_link' />";
			}
			inputToSave+="<input type='hidden' class='size_img' value='"+data.content.imageSize+"'/>"
	    }
	    if (typeof(data.content) !="undefined" && typeof(data.content.image)!="undefined"){
	        inc_image = '<div class="'+extractClass+' no-padding" id="extracted_thumb">'+aVideo;
	        if(data.content.type=="img_link"){
		        if(typeof(data.content.imageId) != "undefined"){
			       inc_image += "<input type='hidden' id='deleteImageCommunevent"+id+"' value='"+data.content.imageId+"'/>";
			       titleImg = "De l&apos;application communevent"; 
			    }else
			    	titleImg = "Image partagée"; 
		        inc_image += "<a class='thumb-info' href='"+data.content.image+"' data-title='"+titleImg+"'  data-lightbox='allimgcontent'>";
		    }
	        inc_image +='<img src="'+data.content.image+'" width="'+width+'" height="'+height+'">';
	        if(data.content.type=="img_link")
	        	inc_image += '</a>';
	        inc_image += '</div>';
	        countThumbail="";
	        inputToSave+="<input type='hidden' class='img_link' value='"+data.content.image+"'/>";
	    }
	    else {
	        if(typeof(total_images)!="undefined" && total_images > 0){
	            if(total_images > 1){
	                selectThumb='<div class="thumb_sel"><span class="prev_thumb" id="thumb_prev">&nbsp;</span><span class="next_thumb" id="thumb_next">&nbsp;</span> </div>';
	                countThumbail='<span class="small_text" id="total_imgs">'+img_arr_pos+' of '+total_images+'</span><span class="small_text">&nbsp;&nbsp;Choose a Thumbnail</span>';
	            }
	            else{
	                selectThumb="";
	                countThumbail="";
	            }
	            inc_image = '<div class="'+extractClass+'  col-xs-4" id="extracted_thumb">'+aVideo+'<img src="'+data.images[0]+'" width="'+width+'" height="'+height+'">'+selectThumb+'</div>';
	      		inputToSave+="<input type='hidden' class='img_link' value='"+data.images[0]+"'/>";      
	        }else{
	            inc_image ='';
	            countThumbail='';
	        }
	    }
	    
	    //content to be loaded in #results element
		if(data.content==null)
			data.content="";
		if(typeof(data.url)!="undefined")
			mediaUrl=data.url;
		else if (typeof(data.content.url) !="undefined")
			mediaUrl=data.content.url;
		else
			mediaUrl="";
		if((typeof(data.description) !="undefined" || typeof(data.name) != "undefined") && (data.description !="" || data.name != "")){
			contentMedia='<div class="extracted_content '+widthMediaDescription+'">'+
				'<a href="'+mediaUrl+'" target="_blank" class="lastUrl text-dark">';
				if(typeof(data.name) != "undefined" && data.name!=""){
					contentMedia+='<h4>'+data.name+'</h4></a>';
					inputToSave+="<input type='hidden' class='name' value='"+data.name+"'/>";
				}
				if(typeof(data.description) != "undefined" && data.description!=""){
					contentMedia+='<p>'+data.description+'</p>'+countThumbail;
					if(typeof(data.name) == "undefined" || data.name=="")
						contentMedia+='</a>';
					inputToSave+="<input type='hidden' class='description' value='"+data.description+"'/>"; 
				}
			contentMedia+='</div>';
		}
		else{
			contentMedia="";
		}
		inputToSave+="<input type='hidden' class='url' value='"+mediaUrl+"'/>";
		inputToSave+="<input type='hidden' class='type' value='url_content'/>"; 
		content="";
		if(action == "save")
			content += '<a href="javascript:;" class="removeMediaUrl"><i class="fa fa-times"></i></a>';
	    content += '<div class="extracted_url col-xs-12">'+ inc_image +contentMedia+'</div>'+inputToSave;
	    return content;
	},
	getMediaVideo:function(data,action){
		if(typeof(data.images)!="undefined"){
			extracted_images = data.images;
			total_images = parseInt(data.images.length);
			img_arr_pos=1;
	    }
	    inputToSave="";
	    if(typeof(data.content) !="undefined" && typeof(data.content.imageSize) != "undefined"){
	        if (data.content.videoLink){
	            extractClass="extracted_thumb";
	            width="100%";
	            height="100%";

	            aVideo='<a href="javascript:;" class="videoSignal text-white center" style="position:absolute;top:20%;left:40%;"><i class="fa fa-4x fa-play-circle-o"></i><input type="hidden" class="videoLink" value="'+data.content.videoLink+'"/></a>';
	            inputToSave+="<input type='hidden' class='video_link_value' value='"+data.content.videoLink+"'/>"+
	            "<input type='hidden' class='media_type' value='video_link' />";   
			}
	       	inputToSave+="<input type='hidden' class='size_img' value='"+data.content.imageSize+"'/>";
	    }
	    if (typeof(data.content) !="undefined" && typeof(data.content.image)!="undefined"){
	        inc_image = '<div class="'+extractClass+'  col-xs-12 col-md-12 col-sm-12 no-padding" id="extracted_thumb">'+aVideo;
	        /*if(data.content.type=="img_link"){
		        if(typeof(data.content.imageId) != "undefined"){
			       inc_image += "<input type='hidden' id='deleteImageCommunevent"+id+"' value='"+data.content.imageId+"'/>";
			       titleImg = "De l&apos;application communevent"; 
			    }else
			    	titleImg = "Image partagée"; 
		        inc_image += "<a class='thumb-info' href='"+data.content.image+"' data-title='"+titleImg+"'  data-lightbox='allimgcontent'>";
		    }*/
	        inc_image +='<img src="'+data.content.image+'" width="'+width+'" height="'+height+'">';
	        if(data.content.type=="img_link")
	        	inc_image += '</a>';
	        inc_image += '</div>';
	        countThumbail="";
	        inputToSave+="<input type='hidden' class='img_link' value='"+data.content.image+"'/>";
	    }
	    else {
	        if(typeof(total_images)!="undefined" && total_images > 0){
	            if(total_images > 1){
	                selectThumb='<div class="thumb_sel"><span class="prev_thumb" id="thumb_prev">&nbsp;</span><span class="next_thumb" id="thumb_next">&nbsp;</span> </div>';
	                countThumbail='<span class="small_text" id="total_imgs">'+img_arr_pos+' of '+total_images+'</span><span class="small_text">&nbsp;&nbsp;Choose a Thumbnail</span>';
	            }
	            else{
	                selectThumb="";
	                countThumbail="";
	            }
	            inc_image = '<div class="'+extractClass+'  col-xs-12 col-sm-12 col-md-12" id="extracted_thumb">'+aVideo+'<img src="'+data.images[0]+'" width="'+width+'" height="'+height+'">'+selectThumb+'</div>';
	      		inputToSave+="<input type='hidden' class='img_link' value='"+data.images[0]+"'/>";      
	        }else{
	            inc_image ='';
	            countThumbail='';
	        }
	    }
	    
	    //content to be loaded in #results element
		if(data.content==null)
			data.content="";
		if(typeof(data.url)!="undefined")
			mediaUrl=data.url;
		else if (typeof(data.content.url) !="undefined")
			mediaUrl=data.content.url;
		else
			mediaUrl="";
		/*if((typeof(data.description) !="undefined" || typeof(data.name) != "undefined") && (data.description !="" || data.name != "")){
			contentMedia='<div class="extracted_content col-xs-8 padding-20">'+
				'<a href="'+mediaUrl+'" target="_blank" class="lastUrl text-dark">';
				if(typeof(data.name) != "undefined" && data.name!=""){
					contentMedia+='<h4>'+data.name+'</h4></a>';
					inputToSave+="<input type='hidden' class='name' value='"+data.name+"'/>";
				}
				if(typeof(data.description) != "undefined" && data.description!=""){
					contentMedia+='<p>'+data.description+'</p>'+countThumbail+'>';
					if(typeof(data.name) == "undefined" || data.name=="")
						contentMedia+='</a>';
					inputToSave+="<input type='hidden' class='description' value='"+data.description+"'/>"; 
				}
			contentMedia+='</div>';
		}
		else{
			contentMedia="";
		}*/
		inputToSave+="<input type='hidden' class='url' value='"+mediaUrl+"'/>";
		inputToSave+="<input type='hidden' class='type' value='url_content'/>"; 
		content="";
		content += '<div class="extracted_url padding-10">'+ inc_image +'</div>'+inputToSave;
	    return content;
	}
}

function addToSurvey(id, type){
	//name = cotmp[id].name;
	mylog.log("fillSurvey", id, type );
	
}
//<<<<<<< HEAD

var scopeObj = {
	selected : {},
	subParams : {},
	limit : null,
	initVar : function(params) {
		mylog.log("scopeObj initVar", params );

		if(notNull(params)){
			scopeObj.subParams = ( notNull(params.subParams) ? params.subParams : {} ) ;
			mylog.log("scopeObj subParams", scopeObj.subParams );
		}

		if(notNull(params)){
			scopeObj.limit = ( notNull(params.limit) ? params.limit : null ) ;
		}

	},
	init : function(p){
		mylog.log("scopeObj init", p );
		mylog.log("scopeObj searchScopeDF", $("#searchScopeDF").length );
		$("#searchScopeDF").off().on("keyup", function(e){
			mylog.log("searchScopeDF", $("#searchScopeDF").val().trim().length);
			if($("#searchScopeDF").val().trim().length > 1){
				if(notNull(scopeObj.timeoutAddCity)) 
					clearTimeout(scopeObj.timeoutAddCity);

				scopeObj.timeoutAddCity = setTimeout(function(){ 
					scopeObj.search(0, 30, "#scopeListContainerForm");
				}, 500);
			}
		});
	},
	getHtml: function(placeholder=trad.searchcity){
		str = 	'<div id="scopeListContainerForm" class="col-xs-12 no-padding margin-bottom-10">'+
					'<div id="news-scope-search" class="col-xs-12 no-padding">'+
						'<div id="input-sec-search" class="hidden-xs col-xs-12 col-sm-10">'+
							'<div class="input-group shadow-input-header">'+
								'<span class="input-group-addon bg-white addon-form-news"><i class="fa fa-search fa-fw" aria-hidden="true"></i></span>'+
								'<input type="text" class="form-control input-global-search" id="searchScopeDF" autocomplete="off" placeholder="'+placeholder+' ...">'+
							'</div>'+
							'<div class="dropdown-result-global-search col-xs-12 col-sm-5 col-md-5 col-lg-5 no-padding" style="max-height: 70%; display: none;"><div class="text-center" id="footerDropdownGS"><label class="text-dark"><i class="fa fa-ban"></i> Aucun résultat</label><br></div>'+
							'</div>'+
						'</div>'+
					'</div>'+
					'<div id="labelselected" class=" hidden col-md-12 col-sm-12 col-xs-12 margin-top-10 no-padding">'+
						'<label class="margin-left-5"><i class="fa fa-angle-down"></i> '+trad.selectedzones+'</label><br>'+
					'</div>'+
					'<div id="scopes-container" class="col-md-12 col-sm-12 col-xs-12"></div>'+
        		'</div>';
        return str
	},
	timeoutAddCity : null,
	spinSearchAddon: function(bool){
		removeClass= (bool) ? "fa-arrow-circle-right" : "fa-spin fa-circle-o-notch";
		addClass= (bool) ? "fa-spin fa-circle-o-notch" : "fa-arrow-circle-right";
		$("#scopeListContainerForm .main-search-bar-addon,#scopeListContainerForm .second-search-bar-addon").find("i").removeClass(removeClass).addClass(addClass);
	},
	showDropDownGS(show, dom){
	if(typeof show == "undefined") show = true;
		if(!notNull(dom)) dom=".dropdown-result-global-search";
		if(show){
			if($(dom).css("display") == "none"){
				$(dom).css("maxHeight", "0px");
				$(dom).show();
				$(dom).animate({"maxHeight" : "70%"}, 300);
				$(dom).mouseleave(function(){
					$(this).hide(700);
				});
			}
		} else {
			if(!loadingDataGS){
				$(dom).animate({"maxHeight" : "0%"}, 300);
				$(dom).hide(300);
			}
		}
	},
	search : function(indexMin, indexMax, input){
		mylog.log("scopeObj.search", indexMin, indexMax, input);

		var search = $(input+" .input-global-search").val();

		if(search.length<3) return;

		scopeObj.spinSearchAddon(true);

		if(typeof indexMin == "undefined") indexMin = 0;
		if(typeof indexMax == "undefined") indexMax = indexStepGS;

		scopeObj.autoComplete(search, indexMin, indexMax, input);
	},
	autoComplete : function(search, indexMin, indexMax, input){
		mylog.log("scopeObj.autoComplete",search, indexMin, indexMax, input);

		var data = {
			name : search, 
			locality : "", 
			searchType : ["cities"], 
			searchBy : "ALL",
			indexMin : indexMin, 
			indexMax : indexMax  
		};


		if(Object.keys(scopeObj.subParams).length > 0){
			data.subParams = scopeObj.subParams;
		}



		var domTarget = input+" .dropdown-result-global-search" ;
		scopeObj.showDropDownGS(true, domTarget);
		$(domTarget).html("<h5 class='text-dark center padding-15'><i class='fa fa-spin fa-circle-o-notch'></i> "+trad.currentlyresearching+" ...</h5>");  
		

		if(search.indexOf("co.") === 0 ){
			searchT = search.split(".");
			if( searchT[1] && typeof co[ searchT[1] ] == "function" ){
				co[ searchT[1] ](search);
				return;
			} else {
				co.mands();
			}
		}

		$.ajax({
			type: "POST",
			url: baseUrl+"/" + moduleId + "/search/globalautocomplete",
			data: data,
			dataType: "json",
			error: function (data){
				mylog.log("error"); mylog.dir(data);          
			},
			success: function(data){
				spinSearchAddon();
				var totalDataGS = 0;
				if(!data){ toastr.error(data.content); }
				else{
					mylog.log("globalautocomplete DATA", data);
					var countData = 0;
					if(typeof data.count != "undefined")
						$.each(data.count, function(e, v){countData+=v;});
					else
						$.each(data.results, function(i, v) { if(v.length!=0){ countData++; } });

					totalDataGS += countData;

					str = "";
					var city, postalCode = "";

					if(totalDataGS == 0)      totalDataGSMSG = "<i class='fa fa-ban'></i> "+trad.noresult;
					else if(totalDataGS == 1) totalDataGSMSG = totalDataGS + " "+trad.result;   
					else if(totalDataGS > 1)  totalDataGSMSG = totalDataGS + " "+trad.results;   

					if(totalDataGS > 0){
						labelSearch=(Object.keys(data.results).length == totalDataGS) ? trad.extendedsearch : "Voir tous les résultats";
						str += '<div class="text-left col-xs-12" id="footerDropdownGS" style="">';
							str += "<label class='text-dark margin-top-5'><i class='fa fa-angle-down'></i> " + totalDataGSMSG + "</label>";
							// str += '<a href="#search" class="btn btn-default btn-sm pull-right lbh" id="btnShowMoreResultGS">'+
							// 			'<i class="fa fa-angle-right"></i> <i class="fa fa-search"></i> '+labelSearch+
							// 		'</a>';
						str += '</div>';
						str += "<hr style='margin: 0px; float:left; width:100%;'/>";
					}
					if(data.results.length){
						//parcours la liste des résultats de la recherche
						$.each(data.results, function(i, o) {
							mylog.log("globalsearch res : ", o);
							var typeIco = i;
							var ico = "fa-"+typeObj["default"].icon;
							var color = mapColorIconTop["default"];

							mapElementsGS.push(o);
							if(typeof( typeObj[o.type] ) == "undefined")
								itemType="poi";
							typeIco = o.type;
							//if(directory.dirLog) mylog.warn("itemType",itemType,"typeIco",typeIco);
							if(typeof o.typeOrga != "undefined")
								typeIco = o.typeOrga;

							var obj = (dyFInputs.get(typeIco)) ? dyFInputs.get(typeIco) : typeObj["default"] ;
							ico =  "fa-"+obj.icon;
							color = obj.color;
							
							htmlIco ="<i class='fa "+ ico +" fa-2x bg-"+color+"'></i>";
							if("undefined" != typeof o.profilThumbImageUrl && o.profilThumbImageUrl != ""){
								var htmlIco= "<img width='80' height='80' alt='' class='img-circle bg-"+color+"' src='"+baseUrl+o.profilThumbImageUrl+"'/>"
							}

							city="";

							var postalCode = o.postalCode
							if (o.address != null) {
								city = o.address.addressLocality;
								postalCode = o.postalCode ? o.postalCode : o.address.postalCode ? o.address.postalCode : "";
							}

							var id = getObjectId(o);
							var insee = o.insee ? o.insee : "";
							type = o.type;
							if(type=="citoyens") type = "person";
							//var url = "javascript:"; //baseUrl+'/'+moduleId+ "/default/simple#" + o.type + ".detail.id." + id;
							var url = (notEmpty(o.type) && notEmpty(id)) ? 
							        '#page.type.'+o.type+'.id.' + id : "";

							//var onclick = 'urlCtrl.loadByHash("#' + type + '.detail.id.' + id + '");';
							var onclickCp = "";
							var target = " target='_blank'";
							var dataId = "";
							if(type == "city"){
								dataId = o.name; //.replace("'", "\'");
							}


							var tags = "";
							if(typeof o.tags != "undefined" && o.tags != null){
								$.each(o.tags, function(key, value){
									if(value != "")
										tags +=   "<a href='javascript:' class='badge bg-red btn-tag'>#" + value + "</a>";
								});
							}

							var name = typeof o.name != "undefined" ? o.name : "";
							var postalCode = (	typeof o.address != "undefined" &&
												o.address != null &&
												typeof o.address.postalCode != "undefined") ? o.address.postalCode : "";

							if(postalCode == "") postalCode = typeof o.postalCode != "undefined" ? o.postalCode : "";
							var cityName = (typeof o.address != "undefined" &&
											o.address != null &&
											typeof o.address.addressLocality != "undefined") ? o.address.addressLocality : "";
		                  	var countryCode=(typeof o.address != "undefined" && notNull(o.address) && typeof o.address.addressCountry != "undefined") ? "("+o.address.addressCountry+")" : ""; 
							var fullLocality = postalCode + " " + cityName+" "+countryCode;
							if(fullLocality == " Addresse non renseignée" || fullLocality == "" || fullLocality == " ") 
								fullLocality = "<i class='fa fa-ban'></i>";
							mylog.log("fullLocality", fullLocality);

							var description = (	typeof o.shortDescription != "undefined" &&
												o.shortDescription != null) ? o.shortDescription : "";
							if(description == "") description = (	typeof o.description != "undefined" &&
																	o.description != null) ? o.description : "";
		           
							var startDate = (typeof o.startDate != "undefined") ? "Du "+dateToStr(o.startDate, "fr", true, true) : null;
							var endDate   = (typeof o.endDate   != "undefined") ? "Au "+dateToStr(o.endDate, "fr", true, true)   : null;

							var followers = (typeof o.links != "undefined" && o.links != null && typeof o.links.followers != "undefined") ?
							                o.links.followers : 0;
							var nbFollower = 0;
							if(followers !== 0)                 
								$.each(followers, function(key, value){
								nbFollower++;
							});

							target = "";

							mylog.log("type", type);
							if(type != "city" && type != "zone" ){ 
								str += "<a href='"+url+"' class='lbh col-md-12 col-sm-12 col-xs-12 no-padding searchEntity'>";
								str += "<div class='col-md-2 col-sm-2 col-xs-2 no-padding entityCenter text-center'>";
								str +=   htmlIco;
								str += "</div>";
								str += "<div class='col-md-10 col-sm-10 col-xs-10 entityRight'>";

								str += "<div class='entityName text-dark'>" + name + "</div>";

								str += '<div data-id="' + dataId + '"' + "  class='entityLocality'>"+
								"<i class='fa fa-home'></i> " + fullLocality;

								if(nbFollower >= 1)
								str +=    " <span class='pull-right'><i class='fa fa-chain margin-left-10'></i> " + nbFollower + " follower</span>";

								str += '</div>';

								str += "</div>";

								str += "</a>";
							}else{
								o.input = input;

			         	 		
								if(type == "city"){
									var valuesScopes = {
										city : o._id.$id,
										cityName : o.name,
										postalCode : (typeof o.postalCode == "undefined" ? "" : o.postalCode),
										country : o.country,
										allCP : o.allCP,
										uniqueCp : o.uniqueCp,
										level1 : o.level1,
										level1Name : o.level1Name
									}

									if( notEmpty( o.nameCity ) ){
										valuesScopes.name = o.nameCity ;
									}

									if( notEmpty( o.uniqueCp ) ){
										valuesScopes.uniqueCp = o.uniqueCp;
									}

									if( notEmpty( o.level5 ) && valuesScopes.id != o.level5){
										valuesScopes.level5 = o.level5 ;
										valuesScopes.level5Name = o.level5Name ;
									}

									if( notEmpty( o.level4 ) && valuesScopes.id != o.level4){
										valuesScopes.level4 = o.level4 ;
										valuesScopes.level4Name = o.level4Name ;
									}
									if( notEmpty( o.level3 ) && valuesScopes.id != o.level3 ){
										valuesScopes.level3 = o.level3 ;
										valuesScopes.level3Name = o.level3Name ;
									}
									if( notEmpty( o.level2 ) && valuesScopes.id != o.level2){
										valuesScopes.level2 = o.level2 ;
										valuesScopes.level2Name = o.level2Name ;
									}

									//valuesScopes.type = o.type;
									valuesScopes.type = "cities";
									o.type = "cities";
									valuesScopes.key = valuesScopes.city+"cities" ;
									mylog.log("valuesScopes", valuesScopes);
									if(notNull(valuesScopes.allCP) && valuesScopes.allCP == false){
										valuesScopes.key = valuesScopes.key + valuesScopes.postalCode ;
									}


									o.key = valuesScopes.key;
				         	 		myScopes.search[valuesScopes.key] = valuesScopes;
									str += directory.cityPanelHtml(o);
								}
								else if(type == "zone"){


									valuesScopes = {
										id : o._id.$id,
										name : o.name,
										country : o.countryCode,
										level : o.level
									}
									mylog.log("valuesScopes",valuesScopes);

									if(o.level.indexOf("1") >= 0){
										typeSearchCity="level1";
										levelSearchCity="1";
										valuesScopes.numLevel = 1;
									}else if(o.level.indexOf("2") >= 0){
										typeSearchCity="level2";
										levelSearchCity="2";
										valuesScopes.numLevel = 2;
									}else if(o.level.indexOf("3") >= 0){
										typeSearchCity="level3";
										levelSearchCity="3";
										valuesScopes.numLevel = 3;
									}else if(o.level.indexOf("4") >= 0){
										typeSearchCity="level4";
										levelSearchCity="4";
										valuesScopes.numLevel = 4;
									}else if(o.level.indexOf("5") >= 0){
										typeSearchCity="level5";
										levelSearchCity="5";
										valuesScopes.numLevel = 5;
									}
									if(notNull(typeSearchCity))
										valuesScopes.type = typeSearchCity;				

									mylog.log("valuesScopes test", (valuesScopes.id != o.level1), valuesScopes.id, o.level1);

									if( notEmpty( o.level1 ) && valuesScopes.id != o.level1){
										mylog.log("valuesScopes test", (valuesScopes.id != o.level1), valuesScopes.id, o.level1);
										valuesScopes.level1 = o.level1 ;
										valuesScopes.level1Name = o.level1Name ;
									}

									var subTitle = "";
									if( notEmpty( o.level5 ) && valuesScopes.id != o.level5){
										valuesScopes.level5 = o.level5 ;
										valuesScopes.level5Name = o.level5Name ;
										subTitle +=  (subTitle == "" ? "" : ", ") +  o.level4Name ;
									}

									if( notEmpty( o.level4 ) && valuesScopes.id != o.level4){
										valuesScopes.level4 = o.level4 ;
										valuesScopes.level4Name = o.level4Name ;
										subTitle +=  (subTitle == "" ? "" : ", ") +  o.level4Name ;
									}
									if( notEmpty( o.level3 ) && valuesScopes.id != o.level3 ){
										valuesScopes.level3 = o.level3 ;
										valuesScopes.level3Name = o.level3Name ;
										subTitle +=  (subTitle == "" ? "" : ", ") +  o.level3Name ;
									}
									if( notEmpty( o.level2 ) && valuesScopes.id != o.level2){
										valuesScopes.level2 = o.level2 ;
										valuesScopes.level2Name = o.level2Name ;
										subTitle +=  (subTitle == "" ? "" : ", ") +  o.level2Name ;
									}
									//objToPush.id+objToPush.type+objToPush.postalCode
									valuesScopes.key = valuesScopes.id+valuesScopes.type ;
									mylog.log("valuesScopes.key", valuesScopes.key, valuesScopes);
									myScopes.search[valuesScopes.key] = valuesScopes;

									mylog.log("myScopes.search", myScopes.search);
									o.key = valuesScopes.key;
									str += directory.zonePanelHtml(o);
								}
							}
						}); //end each
					} else {
						str += '<div class="text-left col-xs-12" id="footerDropdownGS" style="">';
							str += "<label class='text-dark margin-top-5'><i class='fa fa-times'></i> " + trad.noresult + "</label>";
						str += '</div>';
					}
					

					//on ajoute le texte dans le html
					$(domTarget).html(str);
					//on scroll pour coller le haut de l'arbre au menuTop
					$(domTarget).scrollTop(0);
					
					//on affiche la dropdown
					scopeObj.showDropDownGS(true, domTarget);
					//bindScopesInputEvent();
					
					scopeObj.onclickScope(input, domTarget);

					coInterface.bindLBHLinks();

					//signal que le chargement est terminé
					mylog.log("loadingDataGS false");
					loadingDataGS = false;
			

					//si le nombre de résultat obtenu est inférieur au indexStep => tous les éléments ont été chargé et affiché
					if(indexMax - countData > indexMin){
						$("#btnShowMoreResultGS").remove(); 
						scrollEndGS = true;
					}else{
						scrollEndGS = false;
					}

					if(isMapEnd){
						//affiche les éléments sur la carte
						scopeObj.showDropDownGS(false);
						Sig.showMapElements(Sig.map, mapElementsGS, "globe", "Recherche globale");
					}
				}
			}
		});	
	},
	onclickScope : function(input, domTarget){
		$(input+" .item-globalscope-checker").off().on('click', function(){
			$("#labelselected").removeClass("hidden");
			if(scopeObj.limit == null || Object.keys(scopeObj.selected).length < scopeObj.limit ){
				var key = $(this).data("scope-value");
				mylog.log("item-globalscope-checker myScopes", key, myScopes.search[key] );
				if( typeof myScopes != "undefined" &&
					typeof myScopes.search != "undefined" &&
					typeof myScopes.search[key]  != "undefined" ){
					var scopeDF = myScopes.search[key];
					var nameZone = (typeof scopeDF.cityName != "undefined") ? scopeDF.cityName : scopeDF.name ;
					var btnScopeAction="<span class='removeScopeDF tooltips margin-right-5 margin-left-10' "+
						"style='font-size: 18px;' "+
						"data-add='false' data-scope-value='"+scopeDF.id+"' "+
						'data-scope-key="'+key+'" '+
						"data-toggle='tooltip' data-placement='top' "+
						"data-original-title='"+trad.removeFromMyFavoritesPlaces+"'>"+
							"<i class='fa fa-times-circle'></i>"+
						"</span>";
					var html = "<div class='scope-order text-red col-xs-12 col-sm-6' data-level='"+scopeDF.level+"'>"+
						btnScopeAction+
						"<span data-toggle='dropdown' data-target='dropdown-multi-scope' "+
							"class='item-scope-checker item-scope-input' "+
							"style='font-size: 18px;' "+
							'data-scope-key="'+key+'" '+
							'data-scope-value="'+scopeDF.id+'" '+
							'data-scope-name="'+nameZone+'" '+
							'data-scope-type="'+scopeDF.type+'" '+
							'data-scope-level="'+scopeDF.type+'" ' +
							'data-scope-country="'+scopeDF.country+'" ' +
							'data-btn-type="multiscope" ';
							if(notNull(scopeDF.level))
								html += 'data-level="'+scopeDF.level+'"';
							html += '>' + 
							nameZone + 
						"</span>"+
					"</div>";
					
					$(input+" #scopes-container").append(html);
					scopeObj.selected[key] = myScopes.search[key];

					$(".removeScopeDF").off().on('click', function(){
						$(this).parent().remove();
						delete scopeObj.selected[$(this).data("scope-key")];
						if(Object.keys(scopeObj.selected).length == 0){
							$("#labelselected").addClass("hidden");
						}
						
					});

					$(domTarget).hide();
				}
			} else {
				toastr.error("Vous avez déjà selectionné le nombre max élèments")
			}
			
		});
	},
	changeCommunexionScope : function(scopeValue, scopeName, scopeType, scopeLevel, values, notSearch, testCo, appendDom){
		mylog.log("changeCommunexionScope", scopeValue, scopeName, scopeType, scopeLevel, values, notSearch, testCo, appendDom);
		mylog.log("changeCommunexionScope appendDom", appendDom);
		//communexionObj=scopeObject(values);
		//mylog.log("changeCommunexionScope communexionObj",communexionObj);
		//myScopes.open=communexionObj;
		myScopes.type=="search";
		//var newsAction = ( notNull(appendDom) && appendDom.indexOf("scopes-news-form") >= 0) ? true : false;
		var newsAction = true;
		mylog.log("changeCommunexionScope newsAction", newsAction);

		$(appendDom).html( constructScopesHtml(newsAction) );
		$(appendDom+" .scope-order").sort(sortSpan) // sort elements
					.appendTo(appendDom); // append again to the list

	}
};