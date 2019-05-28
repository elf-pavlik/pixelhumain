<!-- start: PAGESLIDE RIGHT -->
<?php 
$cssAnsScriptFilesModule = array(
	'/js/default/notifications.js'
	//'/js/news/autosize.js',
);
HtmlHelper::registerCssAndScriptsFiles($cssAnsScriptFilesModule, $this->module->assetsUrl);
?>
<style type="text/css">
	.notifications li {
		min-height:50px;
		padding: 10px;
		background-color: rgba(197, 225, 197, 0.3);
		border-bottom: 1px dashed #bed1be;
	}
	.notifications li.read{
		background-color:white !important;
	}
	.notifications{
		/*background-color: white;*/
		color: #528195;
		padding: 2px 0px !important;
	}
	.notifications .pageslide-title{
		padding-left: 10px;
		text-align: inherit; 
		color:#67B04C;
		font-size: 14px !important;
		text-transform: none !important;
	}
	#notificationPanelSearch{
	position: fixed;
	top: 68px !important;
	/*border-top:1px solid rgba(128, 128, 128, 0.54);*/
	right: 0%;
	width: 430px;
	bottom: 0px;
	overflow-y: auto;
	background-color: white;
	padding-top: 10px;
	padding-bottom: 10px;
	border-radius: 0px;
    box-shadow: 2px 0px 5px -1px rgba(66, 66, 66, 0.79) !important;
    -webkit-box-shadow: 2px 0px 5px -1px rgba(66, 66, 66, 0.79) !important;
    -o-box-shadow: 2px 0px 5px -1px rgba(66, 66, 66, 0.79) !important;
    box-shadow: 0px 9px 12px 3px rgba(66, 66, 66, 0.37) !important;
    overflow-x: hidden;
    z-index: 13000;
    
		display:none;
		/*background-color: white;
		/*box-shadow: 0px 0px !important;
		left:unset !important;
		right:25px;
		width: 300px !important;
		-moz-box-shadow: 0px 0px 3px 0px #656565;
		-webkit-box-shadow: 0px 0px 3px 0px #656565;
		-o-box-shadow: 0px 0px 3px 0px #656565;
		box-shadow: 0px 0px 3px 0px #656565;
		filter:progid:DXImageTransform.Microsoft.Shadow(color=#656565, Direction=NaN, Strength=3);*/
	}
	.notifications a.notif{
		padding-top: 0px !important;
		background-color: transparent;
		color: #354535;
		font-size: 13px;
	}
	ul.notifList{
		position: absolute;
		bottom: 0px !important;
		overflow-y: auto;
		padding-right: 10px;
		top: 45px;
		padding: 0px;
		-moz-box-shadow: 0px 0px 3px -1px #656565;
		-webkit-box-shadow: 0px 0px 3px -1px #656565;
		-o-box-shadow: 0px 0px 3px -1px #656565;
		box-shadow: 0px 0px 3px -1px #656565;
		filter:progid:DXImageTransform.Microsoft.Shadow(color=#656565, Direction=NaN, Strength=3);
	}

	

	.notifications .pageslide-list a .label{
		opacity: 0.7;
		font-size: 20px !important;
		border-radius: 30px !important;
		height: 40px;
		padding-top: 7px !important;
		padding-left: 7px !important;
		margin-top: 5px;
		height: 35px;
		width: 35px;
		margin-left: -1px;
		background-color: #56c557 !important;
	}

	.notifications .message,.notifications .time {
		width:100%;
	}
	.notifications .content-icon{
		margin-right: 10px;
	}
	.notifications .time {
	   color: #4d654d;
	}
	.btn-notification-action{
		background-color: #71CE4E !important;
		color: white;
		margin: 0px !important;
		margin-top: -4px !important;
		padding: 4px 8px !important;
		margin-right: 10px !important;
	}
	.footer-notif{
		position: absolute;
		bottom:10px;
		width:100%;
	}
	.btn-reload-notif{
		border-radius: 50%!important;
	    margin-left: 14px !important;
	    margin-right: 5px !important;
	}
	#notificationPanelSearch{
		width:415px !important;
		max-width: 100%;
	}

	.badge-tranparent{
		background-color: transparent;
	}
	.removeBtn{
		position: absolute !important;
		right: 3px;
		bottom: 4px;
		border-radius:25px !important;
		border:1px solid grey;
		color: grey;
	}
	.removeBtn:hover{
		background-color: grey;
		color: white;
	};
	.removeBtn i{
		font-size:12px;
	}
</style>
<div id="notificationPanelSearch" class="">
		<div class="notifications">
			<a href="javascript:;" onclick='refreshNotifications("<?php echo Yii::app()->session["userId"]?>","<?php echo Person::COLLECTION ?>","")' class="btn-notification-action pull-left btn-reload-notif">
				<i class="fa fa-refresh"></i>
			</a>
			<div class="pageslide-title pull-left">
				<i class="fa fa-angle-down"></i> <i class="fa fa-bell"></i> <span class="hidden-xs">Notifications</span> 
			</div> 
			<a href="javascript:;" onclick='markAllAsRead()' class="btn-notification-action pull-right" style="font-size:12px;">
				<?php echo Yii::t("common","All marked all as read") ?> <i class="fa fa-check-square-o"></i>
			</a>	
			
			
			<ul class="pageslide-list notifList col-md-12 col-sm-12 col-xs-12">
				<?php
					$maxTimestamp = 0;
				?>
			</ul>
		
			<?php /*
			<div class="view-all">
				<a href="javascript:void(0)">
					See all notifications <i class="fa fa-arrow-circle-o-right"></i>
				</a>
			</div>
			*/?>
		</div>
</div>
<!-- end: PAGESLIDE RIGHT -->
<script type="text/javascript">
var notifications = null;
var maxNotifTimstamp = <?php echo $maxTimestamp ?>;

jQuery(document).ready(function() 
{
	initNotifications();
	//coInterface.bindLBHLinks();
	bindNotifEvents("");
	//refreshNotifications(userId,"<?php echo Person::COLLECTION ?>","");
	$("#notificationPanelSearch").mouseleave(function(){
		showNotif();
	});
});

/*function bindNotifEvents(){
	$(".notifList a.notif").off().on("click",function () 
	{
		markAsRead( $(this).data("id") );
		hash = $(this).data("href");
		elem = $(this).parent();
		//elem.removeClass('animated bounceInRight').addClass("animated bounceOutRight");
		//elem.removeClass("enable");
		setTimeout(function(){
          //  elem.addClass("read");
            //elem.removeClass('animated bounceOutRight');
            urlCtrl.loadByHash(hash);
            //notifCount();
        }, 200);
	});
	$('.tooltips').tooltip();
	$(".notifList li").mouseenter(function(){
		$(this).find(".removeBtn").show();
	}).mouseleave(function(){
		$(this).find(".removeBtn").hide();
	})
}
function updateNotification(action, id)
{ 
	var action = action;
	var all = true;
	data = new Object;
	if(id != null){
		var notifId=id;
		all=false;
		data.id=id
	} else {
		data.action=action;
		data.all=all;
	}
	//ajax remove Notifications by AS Id
	$.ajax({
        type: "POST",
        url: baseUrl+"/"+moduleId+"/notification/update",
        data: data,
        dataType : 'json'
    })
    .done( function (data) {
    	mylog.dir(data);
        if ( data && data.result ) {
        	if(action=="seen"){  
        		$(".notifList li.notifLi").addClass("seen")  
        		notifCount();
        	}else{           
        		if(all)
        			$(".notifList li.notifLi").addClass("read");
        		else
        			$(".notifList li.notif_"+notifId).addClass("read");
        	}
        	mylog.log("notification cleared ",data);
        } else {
            toastr.error("no notifications found ");
        }

    });
}
function markAllAsSeen(){
	updateNotification("seen");
}
function markAsRead(id){
	updateNotification("read",id);
}
function markAllAsRead()
{ 
	updateNotification("read");
}
function removeNotification(id)
{ // Ancienne markAsRead
	mylog.log("markAsRead",id);
	//ajax remove Notifications by AS Id
	$.ajax({
        type: "POST",
        url: baseUrl+"/"+moduleId+"/notification/marknotificationasread",
        data: { "id" : id },
        dataType : 'json'
    })
    .done( function (data) {
    	//mylog.dir(data);
        if ( data && data.result ) {               
        	$(".notifList li.notif_"+id).remove();
        	mylog.log("notification cleared ",data);
        } else {
            toastr.error("no notifications found ");
        }
        notifCount();
    });
}

function removeAllNotifications()
{ 
	//Ancienne markAllAsRead
	$.ajax({
        type: "POST",
        url: baseUrl+"/"+moduleId+"/notification/markallnotificationasread",
        dataType : 'json'
    })
    .done( function (data) {
    	mylog.dir(data);
        if ( data && data.result ) {               
        	$(".notifList li.notifLi").remove();
        	mylog.log("notifications cleared ",data);
        	$(".sb-toggle-right").trigger("click");
        } else {
            toastr.error("no notifications found ");
        }
        notifCount();
    });
	
}

function refreshNotifications()
{
	//ajax get Notifications
	$(".pageslide-list.header .btn-primary i.fa-refresh").addClass("fa-spin");
	mylog.log("refreshNotifications", maxNotifTimstamp);
	$.ajax({
        type: "GET",
        url: baseUrl+"/"+moduleId+"/notification/getnotifications?ts="+maxNotifTimstamp
    })
    .done(function (data) { //mylog.log("REFRESH NOTIF : "); mylog.dir(data);
        if (data) {       
        	buildNotifications(data);
        } else {
            toastr.error("no notifications found ");
        }
        $(".pageslide-list.header .btn-primary i.fa-refresh").removeClass("fa-spin");
    }).fail(function(){
    	toastr.error("error notifications");
        $(".pageslide-list.header .btn-primary i.fa-refresh").removeClass("fa-spin");
    });
}
/*function markAllNotificationsAsSeen()
{
	$.ajax({
        type: "POST",
        data:{"action":"seen","all":true}
        url: baseUrl+"/"+moduleId+"/notification/update"
    })
    .done(function (data) { //mylog.log("REFRESH NOTIF : "); mylog.dir(data);
        if (data) {       
        	countNotif(true);
        } else {
            //toastr.error("no notifications found ");
        }
        $(".pageslide-list.header .btn-primary i.fa-refresh").removeClass("fa-spin");
    }).fail(function(){
    	toastr.error("error notifications");
        $(".pageslide-list.header .btn-primary i.fa-refresh").removeClass("fa-spin");
    });

}
function buildNotifications(list)
{	mylog.log(list);
	mylog.info("buildNotifications()");
	mylog.log(typeof list);
	$(".notifList").html("");
	if(typeof list != "undefined" && typeof list == "object"){
		$.each( list , function( notifKey , notifObj )
		{
			var url = (typeof notifObj.notify != "undefined") ? notifObj.notify.url : "#";
			//convert url to hash for loadByHash
			url = "#"+urlCtrl.replace(/\//g, ".");
			//var moment = require('moment');
			moment.lang('fr');
			if(typeof notifObj.updated != "undefined")
				momentNotif=moment(new Date( parseInt(notifObj.updated.sec)*1000 )).fromNow();
			else if(typeof notifObj.created != "undefined")
				momentNotif=moment(new Date( parseInt(notifObj.created.sec)*1000 )).fromNow();
			else if(typeof notifObj.timestamp != "undefined")
				momentNotif=moment(new Date( parseInt(notifObj.timestamp.sec)*1000 )).fromNow();
			var icon = (typeof notifObj.notify != "undefined") ? notifObj.notify.icon : "fa-bell";
			var displayName = (typeof notifObj.notify != "undefined") ? notifObj.notify.displayName : "Undefined notification";
			//console.log(notifObj);
			//console.log(userId);
			//console.log(notifObj.notify);
			//console.log(notifObj.notify.id[userId]);
			var isSeen = (typeof notifObj.notify.id[userId] != "undefined" && typeof notifObj.notify.id[userId].isUnseen != "undefined") ? "" : "seen";
			var isRead = (typeof notifObj.notify.id[userId] != "undefined" && typeof notifObj.notify.id[userId].isUnread != "undefined") ? "" : "read";

			str = "<li class='notifLi notif_"+notifKey+" "+isSeen+" "+isRead+" hide'>"+
					"<a href='javascript:;' class='notif' data-id='"+notifKey+"' data-href='"+ url +"'>"+
						"<span class='label bg-dark'>"+
							'<i class="fa '+icon+'"></i>'+
						"</span>" + 
						
						'<span class="message">'+
							displayName+
						"</span>" + 
						
						"<span class='time pull-left'>"+momentNotif+"</span>"+
					"</a>"+
					"<a href='javascript:;' class='label removeBtn tooltips' onclick='removeNotification(\""+notifKey+"\")' data-toggle='tooltip' data-placement='left' title='<?php echo Yii::t("common","Delete"); ?>' style='display:none;'>"+
							'<i class="fa fa-remove"></i>'+
						"</a>" + 
				  "</li>";

			$(".notifList").append(str);
			$(".notif_"+notifKey).removeClass('hide').addClass("animated bounceInRight enable");
			if( notifObj.timestamp > maxNotifTimstamp )
				maxNotifTimstamp = notifObj.timestamp;
		});
		setTimeout( function(){
	    	notifCount();
	    	bindNotifEvents();
	    	//coInterface.bindLBHLinks();
	    }, 800);
		//bindNotifEvents();
	}
}

function notifCount(upNotifUnseen)
{ 	var countNotif = $(".notifList li.enable").length;
	var countNotifSeen = $(".notifList li.seen").length;
	var countNotifUnseen = countNotif-countNotifSeen;
	if(upNotifUnseen)
		countNotifUnseen=0;
	mylog.log(" !!!! notifCount", countNotif);
	$(".notifCount").html( countNotif );
	if(countNotif == 0)
		$(".notifList").append("<li><i class='fa fa-ban'></i> <?php echo Yii::t("common","No more notifications for the moment") ?></li>");
	if( countNotifUnseen > 0)
	{
	    $(".notifications-count").html(countNotif);
		$('.notifications-count').removeClass('hide');
		$('.notifications-count').addClass('animated bounceIn');
		$('.notifications-count').addClass('badge-success');
		$('.notifications-count').removeClass('badge-tranparent');
		$(".markAllAsRead").show();
	} else {
		//$('.notifications-count').addClass('hide');
		//$(".notifications-count").html("0");
		$('.notifications-count').addClass('hide');
		$('.notifications-count').removeClass('badge-success');
		$('.notifications-count').addClass('badge-tranparent');
		$(".markAllAsRead").hide();
	}
}*/
</script>