
function ajaxPost(id,ajaxUrl,params,callback, datatype){
    mylog.log("ajaxPost 3", id,ajaxUrl,params);
    /*if(dataType == null)
    dataType = "json";*/
    if(datatype != "html" )
        $(id).html("");
    $.ajax({
        url:ajaxUrl,
        data:params,
        type:"POST",
        //  dataType: "json",
        success:function(data) {
            if(datatype == "none" )
                console.log();
            else if(datatype === "html" )
                $(id).html(data);
            else if(typeof data.msg === "string" )
                toastr.success(data.msg);
            else if( id != null )
                $("#"+id).html(JSON.stringify(data, null, 4));

            if( typeof callback === "function")
                callback(data,id);
        },
        error:function (xhr, ajaxOptions, thrownError){
            mylog.error(thrownError);
        } 
    });
}

function getAjax(id,ajaxUrl,callback,datatype,blockUI)
{
  $.ajaxSetup({ cache: true});
  mylog.log("getAjax",id,ajaxUrl,callback,datatype,blockUI);
    if(blockUI)
        $.blockUI({
            message : ( ( typeof jsonHelper.notNull("themeObj.blockUi.processingMsg") ) ? themeObj.blockUi.processingMsg : '<i class="fa fa-spinner fa-spin"></i> Processing... <br/> '+
                '<blockquote>'+
                  '<p>Art is the heart of our culture.</p>'+
                '</blockquote> ' )
        });
  
    if(datatype != "html" )
        $(id).html( "<div class='cblock'><div class='centered'><i class='fa fa-cog fa-spin fa-2x icon-big text-center'></i> Loading</div></div>" );
  
    $.ajax({
        url:ajaxUrl,
        type:"GET",
        cache: true,
        success:function(data) {
          if (data.error) {
            mylog.warn(data.error);
            toastr.error(data.error.msg);
          } else if(datatype === "html" )
            $(id).html(data);
          else if(datatype === "norender" )
            mylog.log("no render",ajaxUrl)
          else if( typeof data === "string" && datatype != null )
            toastr.success(data);
          else
              $(id).html( JSON.stringify(data, null, 4) );
          if( typeof callback === "function")
            callback(data,id);
          if(blockUI)
            $.unblockUI();
        },
        error:function (xhr, ajaxOptions, thrownError){
          //mylog.error(thrownError);
          $.blockUI({
              message : ( ( typeof jsonHelper.notNull("themeObj.blockUi.errorMsg") ) ? themeObj.blockUi.errorMsg : '<div class="title-processing homestead text-red"><i class="fa fa-warning text-red"></i> Oups !! 404 ERROR<br> La page que vous demandez ne peut être trouvée ... </div>'
              +'<a class="thumb-info" href="'+moduleUrl+'/images/proverb/from-human-to-number.jpg" data-title="Il n\'existe pas d\'évolution sans erreur."  data-lightbox="all">'
              + '<img src="'+moduleUrl+'/images/proverb/from-human-to-number.jpg" style="border:0px solid #666; border-radius:3px;"/></a><br/><br/>'),
              timeout: 3000 
          });
          //mylog.log("URL : ", url);
          setTimeout(function(){ urlCtrl.loadByHash('#')},3000);
          if(blockUI)
            $.unblockUI();
        } 
    });
}
function testitpost(id,url,params,callback){
	console.log(id,url,params);
	$("#"+id).html("");
	$.ajax({
	    url:url,
	    data:params,
	    type:"POST",
	    dataType:"json",
	    success:function(data) {
	    	if( typeof callback === "function")
	    		callback(data,id);
	    	else if(typeof data.msg === "string" )
	    		toastr.success(data);
	    	else
	      		$("#"+id).html(JSON.stringify(data, null, 4));
	    },
	    error:function (xhr, ajaxOptions, thrownError){
	      toastr.error(thrownError);
	    } 
	  });
}
/*
what can be a simple string which will go into the title bar 
or an aboject with properties like title, icon, desc
 */
function getModal(what, url,id)
{
	
	loaded = {};
	$('#ajax-modal').modal("hide");
	if(id)
		url = url+id;
	console.log("getModal",what,"url",url,"event",id);
	//var params = $(form).serialize();
	//$("#ajax-modal-modal-body").html("<i class='fa fa-cog fa-spin fa-2x icon-big'></i> Loading");
	$('body').modalmanager('loading'); 
	$.ajax({
        type: "GET",
        url: baseUrl+url
        //dataType : "json"
        //data: params
    })
    .done(function (data) 
    {
        if (data) {               
        	/*if(!selectContent)
        		selectContent = data.selectContent;*/
        	title = (typeof what === "object" && what.title ) ? what.title : what;
        	icon = (typeof what === "object" && what.icon ) ? what.icon : "fa-pencil";
        	desc = (typeof what === "object" && what.desc ) ? what.desc+'<div class="space20"></div>' : "";

    		$("#ajax-modal-modal-title").html("<i class='fa "+icon+"'></i> "+title);
            $("#ajax-modal-modal-body").html(desc+data); 
            $('#ajax-modal').modal("show");
        } else {
            toastr.error("bug get "+id);
        }
    });
}

function openSubView(what, url,id, callback)
{
    if(!id) 
        id = "#ajaxSV";
    
	$.subview({
		content: id,
		onShow: function() {
			$(id).html("<div class='cblock'><div class='centered'><i class='fa fa-cog fa-spin fa-2x icon-big text-center'></i> Loading</div></div>");
			$.ajax({
		        type: "GET",
		        url: baseUrl+url
		    })
		    .done(function (data) 
		    {
		        if (data) {               
		            $(id).html(data); 
                if( typeof callback === "function")
                  callback(data);
		        } else {
		        	bootbox.error("bug happened : "+id);
		        }
		    });
		},
		onHide : function() {
			loaded = {};
		}
	});
}

function openSubViewHTML(html,callback,id)
{
    if(!id) 
        id = "#ajaxSV";
	$.subview({
		content: id,
		onShow: function() {
			$("#ajaxSV").html("<div class='cblock'><div class='centered'><i class='fa fa-cog fa-spin fa-2x icon-big text-center'></i> Loading</div></div>");
			$("#ajaxSV").html(html); 
			if( typeof callback === "function")
	    		callback();
		}
	});
}

function testitget(id,url,callback,datatype)
{
	if(datatype != "html" )
		$("#"+id).html("");
	$.ajax({
	    url:url,
	    type:"GET",
	    //dataType:"json",
	    success:function(data) {
	    	if( typeof callback === "function")
	    		callback(data,id);
	    	else if(datatype === "html" )
	    		$(id).html(data);
	    	else if(typeof data === "string" )
	    		toastr.success(data);
	    	else
	      		$("#"+id).html(JSON.stringify(data, null, 4));
	    	
	    },
	    error:function (xhr, ajaxOptions, thrownError){
	       toastr.error(thrownError);
	    } 
	  });
}

function toggle(id)
{
	log(id);
	if( !$("."+id).is(":visible") ) 
	{
		$("."+id).removeClass("hide").attr("style","");
		$("."+id+"Icon").removeClass('fa-eye-slash').addClass('fa-eye');
	} 
	else 
	{ 
		$("."+id).addClass("hide");
		$("."+id+"Icon").removeClass('fa-eye').addClass('fa-eye-slash');
		$("."+id).hide();
	}
	return false;
}
function scrollTo(id)
{
	if( $(id).length )
	{
		console.log("initscrollTo ", id);
	 	$("html, body").animate({ scrollTop: $(id).offset().top-70 }, 700);
	}
}
function Object2Array(obj)
{
	jsonAr =[];
	$.each(obj,function(k,v)
	{
		v.id = k;
		delete v._id;
		jsonAr.push(v);
	});
	console.dir(jsonAr);
	return jsonAr;
}
function showAsColumn(resp,id)
{
	//log(resp,"dir");
	if($("#"+id).hasClass("columns"))
	{
		log("rebuild");
		$("#"+id).columns('setMaster', Object2Array(resp) );
		$("#"+id).columns('create');
	} else {
		$("#"+id).columns({
	      data:Object2Array(resp),
	      schema:[
		      {"header":"Name","key":"name"},
		      {"header":"Edit","key":"id", "template":"<a class='openModal' href='{{id}}' data-id='{{id}}' data-name='{{name}}'>{{id}}</a>"}
		  ]
	    });
	    
	    $(".openModal").click(function(e){
	    	e.preventDefault();
	    	openModal($("#getbyMicroformat").val(),$("#getbyCollection").val(),this.dataset.id,"dynamicallyBuild");
	    })
	}
}

function slugify (value) {    
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

	// 1) met en bas de casse
	// 2) remplace les espace par des tirets
	// 3) enleve tout les caratères non alphanumeriques
	// 4) enlève les doubles tirets
	return value.toLowerCase()
	.replace(/\s+/g, '-')
	.replace(/[^a-z0-9-]/g, '')
	.replace(/\-{2,}/g,'-');
};

var jsonHelper = {
  /*
  
   */
  a : {x : {b : 2} },
  test : function(){
    console.log("init",JSON.stringify(this.a));

    this.getValueByPath( this.a,"x.b");
    console.log("this.a set x.b => 1000");    
    this.setValueByPath( this.a,"x.b",1000);
    this.getValueByPath( this.a,"x.b")
    console.log(JSON.stringify(this.a));

    console.log("this.a.x set b => 2000");
    this.setValueByPath( this.a.x,"b",2000);
    this.getValueByPath( this.a,"x.b");
    console.log(JSON.stringify(this.a));

    console.log("this.a.x set b => {m:1000}");
    this.setValueByPath( this.a.x,"b",{m:1000});
    this.getValueByPath( this.a,"x.b");
    console.log(JSON.stringify(this.a));

    console.log("this.a set x.b.a => 4000");
    this.setValueByPath( this.a,"x.b.a",4000);
    this.getValueByPath( this.a,"x.b");
    console.log(JSON.stringify(this.a));

    console.log("this.a set x.b.a => {m:1000}");
    this.getValueByPath( this.a,"x.b.a");
    this.setValueByPath( this.a,"x.b.a",{m:1000});
    this.getValueByPath( this.a,"x.b.a");
    console.log(JSON.stringify(this.a));

    console.log("this.a set x.b.a.b.c.d => {xx:1000}");
    this.getValueByPath( this.a,"x.b.a.b.c.d");
    this.setValueByPath( this.a,"x.b.a.b.c.d",{xx:1000,yy:25000});
    console.log(JSON.stringify(this.a));

    console.log("this.a reset x.b.a.b.c.d.yy => 100000");
    this.getValueByPath( this.a,"x.b.a.b.c.d.yy");
    this.setValueByPath( this.a,"x.b.a.b.c.d.yy",100000);
    console.log(JSON.stringify(this.a));

    console.log("this.a delete x.b.a.b.c.d.yy");
    this.deleteByPath( this.a,"x.b.a.b.c.d.yy");
    console.log(JSON.stringify(this.a));
  },
  /*
  srcObj = any json OBJCT
  path =  STRING "node1.node2.node3"
   */
  getValueByPath : function(srcObj,path)
  {
    node = srcObj;
    if( !path )
      return node;
    else if( path.indexOf(".") ){
      pathArray = path.split(".");
      $.each(pathArray,function(i,v){
        if(node != undefined && node[v] != undefined)
          node = node[v];
        else {
          node = undefined; 
          return;
        }
      });
      return node;
    }  
    else
      return node[path];
  },
  setValueByPath : function(srcObj,path,value)
  {
    node = srcObj;
    if( !path ){
      node = value;
    }
    else if( path.indexOf(".") ){
      pathArray = path.split(".");
      nodeParent = null;
      lastKey = null;
      $.each(pathArray,function(i,v){
        if(!node[v]){
          //console.log("building node",v);
          node[v] = {};
        }
        nodeParent = node;
        node = node[v]; 
        lastKey = v;
      });
      //console.log(node,nodeParent,lastKey);
      nodeParent[lastKey] = value;
    }  
    else{ 
      node[path] = value;
    }
  },
  
  deleteByPath : function  (srcObj,path) {
    nodeParent = srcObj;
    lastChild = null;
    node = srcObj;
    if( path.indexOf(".") ){
      pathArray = path.split(".");
      if( pathArray.length )
      {
        $.each(pathArray,function(i,v){
          nodeParent = node;
          lastChild = v;
          node = node[v];
        });
      }
      delete nodeParent[lastChild];
    } else
      delete nodeParent[path];
  },
  /*
  convert
  { "clim":75,"informatique": 223 }
  to 
  [{  "label" : "Climatisation",  "value":75},{"label" : "Climatisation", "value":75}]
   */
  Object2GraphArray : function ( srcObj )
  {
    destArray = [];
    //console.dir(srcObj);
    $.each(srcObj,function(k,v){
      destArray.push(v);
    });
    //console.dir(destArray);
    return destArray;
  },

  jsonFromToJson : {

  "fromjson" : [
    {"x":1, "y": {"c" : 20, "o" : 30} },
    {"x":2, "y": {"c" : 60, "o" : 50} }
  ],
  "rules" : { 
          "a" : "x" , 
          "b" : function(obj){ return obj.y.c + obj.y.o }
          },
  "outputLine" : {"a":"", "b":""},
  "toJson" : [],
  
  "test" : function(){
    console.log("test");  
    this.convert();
  },
  
  "convert" : function(){
    console.log("convert");     
    this.toJson = [];
    $.each(this.fromJson,function(i, fromObj){

      newLine = this.outputLine;
      /*$.each(this.rules,function(keyTo, convertTo){
        console.log("convert rules ",fromObj,keyTo,convertTo);     
          if(typeof convertTo == "function")
            newLine[ keyTo ] = convertTo( fromObj );
          else
            newLine[ keyTo ] = fromObj[convertTo];
      });*/
        
      this.toJson.push(newLine);
    });
    return this.toJson;
  }

}

};