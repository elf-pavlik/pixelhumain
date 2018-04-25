<!-- start: PAGESLIDE RIGHT -->
<?php 
$cssAnsScriptFilesModule = array(
	'/js/default/notifications.js'
	//'/js/news/autosize.js',
);

HtmlHelper::registerCssAndScriptsFiles($cssAnsScriptFilesModule, $this->module->getParentAssetsUrl());

HtmlHelper::registerCssAndScriptsFiles( array('/css/notifications.css') , Yii::app()->theme->baseUrl. '/assets');
?>
<style type="text/css">
	
</style> 
<div id="notificationPanelSearch" class="arrow_box">
		<div class="notifications">
			<a href="javascript:;" onclick='refreshNotifications("<?php echo Yii::app()->session["userId"]?>","<?php echo Person::COLLECTION ?>","")' class="btn-notification-action pull-left btn-reload-notif">
				<i class="fa fa-refresh"></i>
			</a>
			<div class="pageslide-title pull-left">
				<i class="fa fa-angle-down"></i> <i class="fa fa-bell"></i> <span class="hidden-xs">Notifications</span> 
			</div> 
			<a href="javascript:;" onclick='removeAllNotifications()' class="btn-notification-action btn-danger pull-right" style="font-size:12px;">
				<?php echo Yii::t("common","All") ?> <i class="fa fa-trash"></i>
			</a>	
			<a href="javascript:;" onclick='markAllAsRead()' class="btn-notification-action pull-right hidden-xs" style="font-size:12px;">
				<?php echo Yii::t("common","Marked all as read") ?> 
				<i class="fa fa-check-square-o"></i>
			</a>	
			<a href="javascript:;" onclick='markAllAsRead()' class="btn-notification-action pull-right visible-xs" style="font-size:12px;">
				<?php echo Yii::t("common","Ok") ?> 
				<i class="fa fa-check-square-o"></i>
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
	//bindLBHLinks();
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
	    	//bindLBHLinks();
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