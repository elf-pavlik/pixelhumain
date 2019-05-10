<?php $visibleClass=(@$params["numberOfApp"] && $params["numberOfApp"]<=1) ? "visible-xs": ""; 
    $borderShadow= (!@$useFilter || empty($useFilter)) ? "borderShadow": "";
?>
<div id="menuApp" class="subMenuTop col-md-12 col-sm-12 col-xs-12 margin-bottom-10 <?php echo $visibleClass." ".$borderShadow ?>">
    <button class="btn visible-xs pull-left menu-btn-scope-filter text-red elipsis"
        data-type="<?php echo @$type; ?>">
        <i class="fa fa-map-marker"></i> <span class="header-label-scope"><?php echo Yii::t("common","where ?") ?></span>
    </button>
    <?php //if(false){
        foreach ($params["pages"] as $key => $value) {
          
            if(!empty($value["inMenu"]) && $value["inMenu"]==true ){ 
                $url = ( !empty($value["urlExtern"]) ? $value["urlExtern"] : "javascript:;") ;
                $target = ( !empty($value["target"]) && $value["target"] === true ? "_blanc" : "") ;
                if(!empty($value["urlExtern"])){ ?>
                    <a href="<?php echo $value["urlExtern"]; ?>" 
                    target="<?php echo $target; ?>" 
                    class="<?php echo $key; ?>ModBtn btn btn-link pull-left btn-menu-to-app hidden-xs hidden-top link-submenu-header <?php if($subdomainName==$value["subdomainName"]) echo 'active'; ?>">
                <?php
                } else { ?>
                    <a href="javascript:;" data-hash="<?php echo $key; ?>" 
                    target="<?php echo $target; ?>" 
                    class="<?php echo $key; ?>ModBtn lbh-menu-app btn btn-link pull-left btn-menu-to-app hidden-xs hidden-top link-submenu-header">
                <?php
                }
                ?>
                
                        
                <i class="fa fa-<?php echo $value["icon"]; ?>"></i>
                <span class="<?php echo str_replace("#","",$key); ?>ModSpan"><?php echo Yii::t("common", $value["subdomainName"]); ?></span>
                <span class="<?php echo @$value["notif"]; ?> topbar-badge badge animated bounceIn badge-warning"></span>
            </a>  
        <?php   }
        } ?>
        <?php if(@$useFilter && !empty($useFilter)
                && (!isset($useFilter["filters"]) || !empty($useFilter["filters"]) )){ ?>
            <!--<button class="btn btn-show-filters"><?php echo Yii::t("common", "Filters") ?> <span class="topbar-badge badge animated bounceIn badge-warning bg-green"></span> <i class="fa fa-angle-down"></i></button>-->
        <?php } ?>
</div>
