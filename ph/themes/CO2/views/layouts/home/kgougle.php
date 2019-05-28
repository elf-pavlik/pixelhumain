<?php
$communexion = CO2::getCommunexionCookies(); 
?>
<style>
	.contact-map {	
		background:url(<?php echo $this->module->assetsUrl; ?>/images/people.jpg) bottom center repeat-x; 
		background-size: 60%;
		background-color:#DFE7E9;  
	}
	.headSection {	
		background:url(<?php echo $this->module->assetsUrl; ?>/images/1+1=3.jpg?c=c) bottom center no-repeat; 
		background-size: 80%;
		background-color:#fff;  
	}
	/*#mainNav .dropdown-result-global-search{
        top:56px !important;
        left:83px !important;
    }*/

    .btn-main-menu{
    	text-align: center;
    }
    @media (min-width: 767px) and (max-width: 992px) {
        #mainNav .dropdown-result-global-search{
            width:40% !important;
        }
    } 
</style>

<div class="pageContent">

	<!-- <div class="col-md-12 col-lg-12 col-sm-12">
		<?php 	$layoutPath = 'webroot.themes.'.Yii::app()->theme->name.'.views.layouts.';
	  			//$this->renderPartial($layoutPath.'forms.'.Yii::app()->params["CO2DomainName"].'.login'); 
	  	?>
	</div> -->
	<div class="col-md-12 col-lg-12 col-sm-12 imageSection" 
		 style="margin-top: 30px; position:relative;">

		<div class="col-md-12 no-padding hidden">
			
			<?php if(!isset(Yii::app()->session['userId'])) { ?>
			<div class="col-md-7 col-sm-7 text-center">
				<div id="homeImg">
					<img id="img-header" class="img-responsive" src="<?php echo $this->module->assetsUrl; ?>/images/<?php echo Yii::app()->language ?>/1+1=3empty.jpg"/>
				</div>
			</div>

			<div class="videoWrapper col-md-8 col-sm-7">
				<!-- <a href="javascript:;" onclick="" class="btn-show-video"><i class="fa fa-youtube-play fa-5x"></i></a> -->
				<iframe class="col-md-12 col-xs-12 no-padding" height="480" 
						src="https://player.vimeo.com/video/133636468?api=1&title=0&amp;byline=0&amp;portrait=0&amp;color=57c0d4" 
						frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen class="video" 
						aria-hidden="true" tabindex="-1" style="border:10px solid black;">
				</iframe>
			</div>

			<div class="col-md-4 col-sm-5 margin-top-25 padding-bottom-15 margin-right-50" 
				 style="border:1px solid #DDD; background-color: #F9F9F9; border-radius:4px;">
				<?php 	$layoutPath = 'webroot.themes.'.Yii::app()->theme->name.'.views.layouts.';
			  			$this->renderPartial($layoutPath.'forms.'.Yii::app()->params["CO2DomainName"].'.register'); 
			  			$this->renderPartial($layoutPath.'forms.'.Yii::app()->params["CO2DomainName"].'.modalRegisterSuccess')
			  	?>
			</div>
			<?php } else { ?>
			<div class="col-md-12 text-center">
				<div id="homeImg">
					<img id="img-header" class="img-responsive" src="<?php echo $this->module->assetsUrl; ?>/images/<?php echo Yii::app()->language ?>/1+1=3empty.jpg"/>
				</div>
			</div>
			<?php } ?>
		</div>


		<!-- <div class="col-md-12 no-padding margin-top-25"><hr></div> -->


		<!-- <div class="col-md-12">
			<h3 class="text-red text-center"><i class="fa fa-hand-up"></i><br>parcourir les applications</h3>
			<hr class="angle-down">
		</div> -->
		<div class="col-md-offset-1 col-md-10 col-sm-12 col-xs-12 shadow2 padding-15 margin-top-25">
			<div class="mainmenu"></div>
		</div>

		<div class="col-md-4 col-sm-4 margin-top-25 padding-bottom-15 margin-right-50" 
			 style="border:1px solid #DDD; background-color: #F9F9F9; border-radius:4px;">
			<?php 	$layoutPath = 'webroot.themes.'.Yii::app()->theme->name.'.views.layouts.';
		  			$this->renderPartial($layoutPath.'forms.'.Yii::app()->params["CO2DomainName"].'.register'); 
		  			$this->renderPartial($layoutPath.'forms.'.Yii::app()->params["CO2DomainName"].'.modalRegisterSuccess')
		  	?>
		</div>


		<div class="col-md-12 col-sm-12 col-xs-12  margin-top-50">
			<?php $isEmptyCo = empty($communexion["values"]["cityName"]); 
				//var_dump($communexion);
			?>
			
			<h3 class="text-red text-center">
				<i class="fa fa-home fa-2x"></i><br>
				Communexion<br>
				<small>
				<i class="fa fa-cross"></i> 
				<span id="communexionNameHome">
				<?php if($isEmptyCo){ ?>
					<?php echo Yii::t("home","You're not <span class='text-dark'>communected</span>") ?>
				<?php }else{ ?>
					<?php echo Yii::t("home","You are") ?> <span class="text-dark"><?php echo Yii::t("home","communected to") ?> 
					<span class="text-red"><?php echo $communexion["values"]["cityName"];?></span> </span>
				<?php } ?>
				</span><br>
					<small class="text-dark inline-block margin-top-5 info_co
						 <?php if(!$isEmptyCo) echo "hidden"; ?>" 
						 style="line-height: 15px;">
						<i class="fa fa-signal"></i> 
						<?php echo Yii::t("home","Be communected permits you to get smart informations<br>localy performed.") ?>
					</small>
				</small>
			</h3>

			<hr class="angle-down">

			<h5 class="text-center info_co <?php if(!$isEmptyCo) echo 'hidden'; ?>">
				<?php echo Yii::t("home","Be communected") ?> !
			</h5>
			<div class="col-md-12 text-center">
				<button class="btn btn-default <?php if($isEmptyCo) echo 'hidden'; ?>" id="change_co">
				<?php echo Yii::t("home","Change your communexion") ?>
				</button>
			</div>
			
			<!-- <select class="col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3 col-xs-12 form-input margin-bottom-5">
				<option>France</option>
				<?php
					// echo "<option value=''>".Yii::t("common", "Choose a country")."</option>";
					// foreach ( OpenData::$phCountries as $key => $value) {
					// 	echo "<option value='".$key."'>".$value."</option>";
					// }
				?>
			</select> -->
			<input class="col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3 col-xs-12 form-input text-center input_co 
						 <?php if(!$isEmptyCo) echo "hidden"; ?>" 
				   id="main-search-bar" type="text" 
				   style="border-radius:50px; height:40px; border: 2px solid red; color:red; margin-bottom:15px;"
				   placeholder="<?php echo Yii::t("home", "communect you : London, Paris, Brussels ?") ?>"></div>

			<div class="col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3 col-xs-12 info_co
						 <?php if(!$isEmptyCo) echo "hidden"; ?>" 
						 style="font-family: 11px;" id="info_co">
	            <i class="fa fa-signal"></i> <?php echo Yii::t("home","To use the network efficiently, we advice you to be <i><b>communected</b></i>") ?>.<br><br>
	            <i class="fa fa-magic"></i> <?php echo Yii::t("home","Indicate your <b>living place</b>, to keep informed about what's happened around you automatically.") ?><br>
	        </div>
	        <div class="col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 col-xs-12" style="font-family: 11px;" id="dropdown_search">
	        </div>
		</div>

		
		<div class="col-md-12 col-sm-12 col-xs-12 no-padding margin-top-25"><hr></div>
		
		<div class="col-md-12 col-sm-12 col-xs-12">
			<h3 class="text-red text-center">
				<i class="fa fa-clock-o fa-2x"></i><br>
				<?php echo Yii::t("home", "An the moment") ?><br>
				<small id="liveNowCoName">
					<?php if($isEmptyCo){ ?>
					<?php echo Yii::t("home","on the network") ?>
					<?php }else{ ?>
					<span class='text-red'><?php echo Yii::t("home","in") ?> <?php echo $communexion["values"]["cityName"];?></span>
					<?php } ?>
				</small>
			</h3>
			<div class="text-left" id="nowList"></div>
		</div>

		<div class="col-md-12 col-sm-12 col-xs-12 margin-top-50">
			<h3 class="text-red text-center"><?php echo Yii::t("home","More informations") ?></h3>
			<hr class="angle-down">
		</div>

	</div>
	
</div>


<div class="portfolio-modal modal fade" id="modalForgot" tabindex="-1" role="dialog" aria-hidden="true">
    <form class="modal-content form-email box-email padding-top-15"  >
        <div class="close-modal" data-dismiss="modal">
            <div class="lr">
                <div class="rl">
                </div>
            </div>
        </div>
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <span class="name" >
                        <?php if(Yii::app()->params["CO2DomainName"] == "kgougle"){ ?>
                            <img src="<?php echo Yii::app()->theme->baseUrl; ?>/assets/img/KGOUGLE-logo.png" height="60" class="inline margin-bottom-15">
                       <?php } else { ?>
                            <img src="<?php echo Yii::app()->theme->baseUrl; ?>/assets/img/CO2r.png" height="100" class="inline margin-bottom-15">
                        <?php } ?>
                    </span>
                    <h4 class="letter-red no-margin" style="margin-top:-5px!important;">Mot de passe oublié ?</h4><br>
                    <hr>
                    <p><small>Indiquez votre addresse e-mail, vous recevrez un e-mail contenant votre mot de passe.</small></p>
                    <hr>
                    
                </div>
            </div>
            <div class="col-md-4 col-md-offset-4 text-left">
                
                <label class="letter-black"><i class="fa fa-envelope"></i> E-mail</label><br>
                <input class="form-control" id="email2" name="email2" type="text" placeholder="E-mail"><br/>
                
                <hr>

                <div class="pull-left form-actions no-margin" style="width:100%; padding:10px;">
                    <div class="errorHandler alert alert-danger no-display registerResult pull-left " style="width:100%;">
                        <i class="fa fa-remove-sign"></i> <?php echo Yii::t("login","You have some form errors. Please check below.") ?>
                    </div>
                </div>

                <!-- <div class="form-actions">
                     <button type="submit"  data-size="s" data-style="expand-right" style="background-color:#E33551" class="forgotBtn ladda-button center center-block">
                        <span class="ladda-label">XXXXXXXX</span><span class="ladda-spinner"></span><span class="ladda-spinner"></span>
                    </button>
                </div> -->

                <a href="javascript:" class="btn btn-danger pull-left" data-dismiss="modal"><i class="fa fa-times"></i> Retour</a>
                <button class="btn btn-success text-white pull-right forgotBtn"><i class="fa fa-sign-in"></i> Envoyer</button>
                
                
                <div class="col-md-12 margin-top-50 margin-bottom-50"></div>
            </div>      
        </div>
    </form>
</div>


<script type="text/javascript">

<?php $layoutPath = 'webroot.themes.'.Yii::app()->theme->name.'.views.layouts.';
	  $this->renderPartial($layoutPath.'home.peopleTalk'); ?>
var peopleTalkCt = 0;
var communexion=<?php echo json_encode($communexion) ?>;
jQuery(document).ready(function() {

	topMenuActivated = false;
	hideScrollTop = true;
	checkScroll();

	loadLiveNow();
	openVideo();

	peopleTalkCt = getRandomInt(0,peopleTalk.length);
	showPeopleTalk();


    $("#map-loading-data").hide();
	$(".mainmenu").html($("#modalMainMenu .links-main-menu").html());
	//$("#modalMainMenu .links-main-menu").html("");

	//setTimeout(function(){ $("#input-communexion").hide(300); }, 300);

	var timerCo = false;
			
	$("#main-search-bar").keyup(function(){
		if($("#main-search-bar").val().length > 2){
			if(timerCo != false) clearTimeout(timerCo);
			timerCo = setTimeout(function(){ 
				//$("#info_co").html("");
				$(".info_co").addClass("hidden");
				$("#change_co").addClass("hidden");
				searchType = ["cities"];
				loadingData=false;
				scrollEnd=false;
				totalData = 0;
				startSearch(0, 20);
			}, 500);
		}else{
			$(".info_co").removeClass("hidden");
			$("#dropdown_search").html("");
		}
	});


    $("#change_co").click(function(){
    	$(".info_co, .input_co").removeClass("hidden");
		$("#change_co").addClass("hidden");

    });


	setTitle("<?php echo Yii::t("home","Welcome on") ?> <span class='text-red'>commune</span>cter","home","<?php echo Yii::t("home","Welcome on Communecter") ?>");
	$('.tooltips').tooltip();

	$("#btn-param-postal-code").click(function(){
		$("#div-param-postal-code").show(400);
	});

	// $('#searchBarPostalCode').keyup(function(e){
 //        clearTimeout(timeoutSearchHome);
 //        timeoutSearchHome = setTimeout(function(){ startSearch(); }, 800);
 //    });


    $(".explainLink").click(function() {
		showDefinition( $(this).data("id") );
		return false;
	});
    $(".keyword").click(function() {
    	$(".keysUsages").hide();
    	link = "<br/><a href='javascript:;' class='showUsage homestead yellow'><i class='fa fa-toggle-up' style='color:#fff'></i> Usages</a>";
    	$(".keywordExplain").html( $("."+$(this).data("id")).html()+link ).fadeIn(400);
    	 $(".showUsage").off().on("click",function() { $(".keywordExplain").slideUp(); $(".keysUsages").slideDown();});
    });

    $(".keyword1").click(function() {
    	$(".keysKeyWords").hide();
    	link = "<br/><a href='javascript:;' class='showKeywords homestead yellow'><i class='fa fa-toggle-up' style='color:#fff'></i> Mots Clefs</a>";
    	$(".usageExplain").html( $("."+$(this).data("id")).html()+link ).slideDown();
    	 $(".showKeywords").off().on("click",function() { $(".usageExplain").slideUp(); $(".keysKeyWords").slideDown();});
    });


    $(".btn-main-menu").mouseenter(function(){ 
        $(".menuSection2").addClass("hidden"); 
        if( $(this).data("type") ) 
            $("."+$(this).data("type")+"Section2").removeClass("hidden");
    }).click(function(e) {  
        e.preventDefault(); 
        $('#modalMainMenu').modal("hide"); 
        mylog.warn("***************************************"); 
        mylog.warn("coInterface.bindLBHLinks",$(this).attr("href")); 
        mylog.warn("***************************************"); 
        var h = ($(this).data("hash")) ? $(this).data("hash") : $(this).attr("href"); 
        urlCtrl.loadByHash( h ); 
    }); 

    $(".tagSearchBtn").click(function(e) {  
        e.preventDefault(); 
        $('#modalMainMenu').modal("hide"); 
        mylog.warn( ".tagSearchBtn",$(this).data("type"),$(this).data("stype"),$(this).data("tags") ); 

        searchObj.types = $(this).data("type").split(",");
        
        if( $(this).data("stype") )
            searchObj.stype = $(this).data("stype");
        else
            searchObj.tags = $(this).data("tags");
        
        urlCtrl.loadByHash($(this).data("app"));
        urlCtrl.afterLoad = function () {     
            //we have to pass by a variable to set the values         
            searchType = searchObj.types;
        
            if( $(this).data("stype") )
                $('#searchSType').val(searchObj.stype);
            else
                $('#searchTags').val(searchObj.tags);
            startSearch();
            searchObj = {};
        }
    }); 

});
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function showPeopleTalk(step)
{
	// if(!step)
	// 	step = 1;
	// peopleTalkCt = peopleTalkCt+step;
	// if( undefined == peopleTalk[ peopleTalkCt ]  )
	// 	peopleTalkCt = 0;
	// person = peopleTalk[ peopleTalkCt ];

	var html = "";
	$.each(peopleTalk, function(key, person){
	html += '<div class="col-lg-2 col-md-3 col-sm-4 col-xs-6 padding-5" style="min-height:430px;max-height:430px;">' +
				'<div class="" style="max-height:240px; overflow:hidden; max-width:100%;">' +
				'<img class="img-responsive img-thumbnail peopleTalkImg" src="'+person.image+'"><br>' +
				'</div>' +
				'<span class="peopleTalkName">'+person.name+'</span><br>' +
				'<span class="peopleTalkProject">'+person.project+'</span><br>' +
				'<span class="peopleTalkComment inline-block">'+person.comment+'</span>' +
			'</div>';
	});

	$("#co-friends").html( html );
	// $(".peopleTalkName").html( person.name );
	// $(".peopleTalkImg").attr("src",person.image);
	// $(".peopleTalkComment").html("<i class='fa fa-quote-left'></i> "+person.comment+"<i class='fa fa-quote-right'></i> ");
	// $(".peopleTalkProject").html( "<a target='_blank' href='"+person.url+"'>"+person.project+"</a>" );

}

function openVideo(){
	//$("#homeImg").fadeOut("slow",function() {
		$(".videoWrapper").fadeIn('slow');
	//});
}

var timeoutSearchHome = null;

function showTagOnMap (tag) {

	mylog.log("showTagOnMap",tag);

	var data = { 	 "name" : tag,
		 			 "locality" : "",
		 			 "searchType" : [ "persons" ],
		 			 //"searchBy" : "INSEE",
            		 "indexMin" : 0,
            		 "indexMax" : 500
            		};

        //setTitle("","");$(".moduleLabel").html("<i class='fa fa-spin fa-circle-o-notch'></i> Les acteurs locaux : <span class='text-red'>" + cityNameCommunexion + ", " + cpCommunexion + "</span>");

		$.blockUI({
			message : "<h1 class='homestead text-red'><i class='fa fa-spin fa-circle-o-notch'></i> Recherches des collaborateurs ...</h1>"
		});

		showMap(true);

		$.ajax({
	      type: "POST",
	          url: baseUrl+"/" + moduleId + "/search/globalautocomplete",
	          data: data,
	          dataType: "json",
	          error: function (data){
	             mylog.log("error"); mylog.dir(data);
	          },
	          success: function(data){
	            if(!data){ toastr.error(data.content); }
	            else{
	            	mylog.dir(data);
	            	Sig.showMapElements(Sig.map, data);
	            	//$(".moduleLabel").html("<i class='fa fa-connect-develop'></i> Les acteurs locaux : <span class='text-red'>" + cityNameCommunexion + ", " + cpCommunexion + "</span>");
					//$(".search-loader").html("<i class='fa fa-check'></i> Vous êtes communecté : " + cityNameCommunexion + ', ' + cpCommunexion);
					//toastr.success('Vous êtes communecté !<br/>' + cityNameCommunexion + ', ' + cpCommunexion);
					$.unblockUI();
	            }
	          }
	 	});

	//loadByHash('#project.detail.id.56c1a474f6ca47a8378b45ef',null,true);
	//Sig.showFilterOnMap(tag);
}



function loadLiveNow () {
	mylog.log("loadLiveNow", communexion);
	/*var dep = ( ( notNull(contextData["address"])  && notNull(contextData["address"]["depName"]) ) ? 
				contextData["address"]["depName"] : "");
	*/
    var searchParams = {
      "tpl":"/pod/nowList",//"json", //
      //"latest" : true,
      //"searchType" : [typeObj["event"]["col"],typeObj["project"]["col"],
      //					typeObj["organization"]["col"],"classified",
      //				 /*typeObj["organization"]["col"]*//*,typeObj["action"]["col"]*/], 
      //"searchTag" : $('#searchTags').val().split(','), //is an array
      "searchLocalityCITYKEY" : new Array(""),
      //"searchLocalityCODE_POSTAL" : $('#searchLocalityCODE_POSTAL').val().split(','), 
      //"searchLocalityDEPARTEMENT" : new Array(""), //$('#searchLocalityDEPARTEMENT').val().split(','),
      //"searchLocalityREGION" : $('#searchLocalityREGION').val().split(','),
      "indexMin" : 0, 
      "indexMax" : 30 
    };

    console.log("communexion : ", communexion);
    //if(typeof communexion.values.cityKey != "undefined"){
   	//	searchParams.searchLocalityCITYKEY = new Array(communexion.values.cityKey);
   	//}else{
   		if($("#searchLocalityCITYKEY").val() != ""){
   			searchParams.searchLocalityCITYKEY = new Array($("#searchLocalityCITYKEY").val());
   		}else if(typeof communexion.values.cityKey != "undefined"){
   			searchParams.searchLocalityCITYKEY = new Array(communexion.values.cityKey);
   		}
   		//searchParams.searchLocalityCITYKEY = new Array("");
   	

    //console.log("communexion ?", communexion);

    ajaxPost( "#nowList", baseUrl+'/'+moduleId+'/element/getdatadetail/type/0/id/0/dataName/liveNow?tpl=nowList',
					searchParams, function(data) {
						
					//var html = directory.showResultsDirectoryHtml(data);
					//$("#nowList").html(html);
			        coInterface.bindLBHLinks();
     } , "html" );
}


</script>
