<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/REC-html40/loose.dtd">
<html>
  <head>
    <title><?php echo $title?></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  </head>
  <body>
    <span style="text-align: left;"><?php echo Utils::getServerName()?></span>
    <table cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td align="left" valign="top">
          <img src='<?php echo Yii::app()->getRequest()->getBaseUrl(true).$logo ?>' alt="<?php echo $title?>" title="<?php echo $title?>"/>
        </td>
      </tr>

                 <?php echo Yii::t("common", "LOCAL CONNECTED CITIZENS");

             foreach ( $data as $key => $person) {

              echo "<tr>
         <td align='left'> <h3>Un nouvel utilisateur s'est inscrit sur le site : ".$person["name"]."</h3>";

                echo  'N\'oubliez pas de le modérer sur le <a href="'.Yii::app()->getRequest()->getBaseUrl(true).'/'.Yii::app()->getController()->moduleId.'/#admin.directory"> back office</a><br/></td>
      </tr>';
               
             }


           ?>
      </table>
  </body>
</html>