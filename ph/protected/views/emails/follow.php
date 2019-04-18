  <?php
  $this->renderPartial('webroot.themes.'.Yii::app()->theme->name.'.views.layouts.mail.header');
  $url = Yii::app()->getRequest()->getBaseUrl(true)."/#page.type.".$parentType.".id.".(string)$parent["_id"].".view.directory.dir.followers";
  $verbAction=Yii::t("mail","{who} is following {what}",array("{who}"=>'<b><a href="'.Yii::app()->getRequest()->getBaseUrl(true).'/#page.type.'.Person::COLLECTION.'.id.'.$authorId.'" target="_blank">'.ucfirst($authorName).'</a></b>',"{what}"=>$parent["name"]));
  $explain= Yii::t("mail","{who} is now connected to the news stream of {what}",array("{who}"=>$authorName,"{what}"=>"<a href='".$url."'>".$parent["name"]."</a>"));
  $explain.=". ".Yii::t("mail","When you post a news on {what}, he/she will received the news on his/her news", array("{what}"=>$parent["name"]));
  $links=Yii::t("mail","All followers on {what}", array("{what}"=>$parent["name"]));
  if($parentType==Person::COLLECTION){
      $verbAction=Yii::t("mail","{who} is following you", array("{who}"=>'<b><a href="'.Yii::app()->getRequest()->getBaseUrl(true).'/#page.type.'.Person::COLLECTION.'.id.'.$authorId.'" target="_blank">'.ucfirst($authorName).'</a></b>'));
     $explain= Yii::t("mail","{who} is now connected to your news stream" , array("{who}"=>$authorName));
     $explain.=". ".Yii::t("mail","When you post a news, he/she will received the news on his/her news");
     $links=Yii::t("mail","All my followers");
  }
  ?>
    <table class="row" style="border-spacing: 0;border-collapse: collapse;padding: 0;vertical-align: top;text-align: left;width: 100%;position: relative;display: table;"><tbody><tr style="padding: 0;vertical-align: top;text-align: left;"> <!-- Horizontal Digest Content -->
      <th class="small-12 large-12 columns first" style="color: #3c5665;font-family: Helvetica, Arial, sans-serif;font-weight: normal;padding: 0;margin: 0 auto;text-align: left;line-height: 19px;font-size: 15px;padding-left: 16px;padding-bottom: 16px;width: 564px;padding-right: 8px;">

              <h1 class="text-center" style="color: inherit;font-family: Helvetica, Arial, sans-serif;font-weight: normal;padding: 35px 0px 15px 0px;margin: 0;text-align: center;line-height: 1.3;word-wrap: normal;margin-bottom: 10px;font-size: 34px;"><?php echo Yii::t("mail","New follower") ?> !!</h1>
            <table style="border-spacing: 0;border-collapse: collapse;padding: 0;vertical-align: top;text-align: left;width: 100%;">
            <tr style="padding: 0;vertical-align: top;text-align: left;">
              <th style="color: #3c5665;font-family: Helvetica, Arial, sans-serif;font-weight: normal;padding: 0;margin: 0;text-align: left;line-height: 19px;font-size: 15px;">
                <!--http://localhost:8888/ph/images/betatest.png-->
              <a href="<?php echo Yii::app()->getRequest()->getBaseUrl(true) ?>" style="color: #e33551;font-family: Helvetica, Arial, sans-serif;font-weight: normal;padding: 0;margin: 0;text-align: left;line-height: 1.3;text-decoration: none;"><img align="right" width="200" src="<?php echo Yii::app()->getRequest()->getBaseUrl(true)."/images/bdb.png"?>" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;width: auto;max-width: 100%;clear: both;display: block;border: none;" alt="Intelligence collective"></a>
              <b>
              <h5 style="color: inherit;font-family: Helvetica, Arial, sans-serif;font-weight: normal;padding: 0;margin: 0;text-align: left;line-height: 1.3;word-wrap: normal;margin-bottom: 10px;font-size: 20px;"></h5></b><br>
                 <?php echo $verbAction ?><br>
              <br><br>
              <?php echo $explain."." ?>
              <br>
              <br>
              <a href="<?php echo $url?>" style="color: #e33551;font-family: Helvetica, Arial, sans-serif;font-weight: normal;padding: 0;margin: 0;text-align: left;line-height: 1.3;text-decoration: none;"><?php echo $links ?></a>
              <br>
              <br>
              <?php echo Yii::t("mail","If the link doesn&apos;t work, you can copy it in your browser&apos;s address"); ?> :
              <br><div style="word-break: break-all;"><?php echo $url?></div>
             
  <?php $this->renderPartial('webroot.themes.'.Yii::app()->theme->name.'.views.layouts.mail.footer', array("url"=>@$urlRedirect, "name" => (!empty($title) ? $title : null) )); ?>
