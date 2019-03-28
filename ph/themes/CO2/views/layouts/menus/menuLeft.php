<style type="text/css">
    .horizontal{
        position: fixed;
        top:  65px;
        left:0px;
        width: 65px;
    }
    /*#vertical .btn-show-filters.hidden-xs{
        position: absolute;
        display: none;
        left: 52px;
        top: -5px;
        font-size: 13px;
        background-color: white;
        padding: 0px 10px;
        border-radius: 1px 0px 5px 0px;
        border: 0px;
        border-right: 1px solid #DADADA;
        border-bottom: 1px solid #dadada; 
        color: #2BB0C6;

    }*/
    #vertical  .btn-show-filters.hidden-xs .topbar-badge{
        padding: 2px 5px;
        font-size: 11px;
        font-weight: bolder;
    }
    #vertical  .btn-show-filters.hidden-xs:hover{
        text-decoration: underline;
    }
</style>
<?php $visibleClass=(@$params["numberOfApp"]<=1) ? "hidden": ""; ?>
<div id="menuApp" class="menuLeft hidden-xs">
    <?php
        foreach ($params["pages"] as $key => $value) {
            if(@$value["inMenu"]==true){ ?>
                <a href="javascript:;" data-hash="<?php echo $key; ?>" 
                class="<?php echo $key; ?>ModBtn lbh-menu-app btn btn-link pull-left btn-menu-to-app btn-menu-vertical col-xs-12 hidden-xs hidden-top link-submenu-header <?php if(@$subdomainName==$value["subdomainName"]) echo 'active'; ?>">
                        
                <i class="fa fa-<?php echo $value["icon"]; ?>"></i>
                <span class="tooltips-menu-btn"><?php echo Yii::t("common", @$value["subdomainName"]); ?></span>
                <!--<span class="<?php echo @$value["notif"]; ?> topbar-badge badge animated bounceIn badge-warning"></span>-->
            </a>  
        <?php   }
        } ?>
</div>