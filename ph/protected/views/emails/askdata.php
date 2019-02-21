<?php

$url = (!empty($url)) ? Yii::app()->getRequest()->getBaseUrl(true).$url : Yii::app()->getRequest()->getBaseUrl(true) ;

$this->renderPartial('webroot.themes.'.Yii::app()->theme->name.'.views.layouts.mail.header', 
					array("logo" => ( (!empty($logo)) ? Yii::app()->getRequest()->getBaseUrl(true).$logo : null ),
							"url" => $url));
//Yii::app()->language = $language;
?>

<table class="row" style="border-spacing: 0;border-collapse: collapse;padding: 0;vertical-align: top;text-align: left;width: 100%;position: relative;display: table;">
	<tbody>
		<tr style="padding: 0;vertical-align: top;text-align: left;"> <!-- Horizontal Digest Content -->
			<th class="small-12 large-12 columns first" style="color: #3c5665;font-family: Helvetica, Arial, sans-serif;font-weight: normal;padding: 0;margin: 0 auto;text-align: left;line-height: 19px;font-size: 15px;padding-left: 16px;padding-bottom: 16px;width: 564px;padding-right: 8px;">

				<table style="border-spacing: 0;border-collapse: collapse;padding: 0;vertical-align: top;text-align: left;width: 100%;">
					<tr style="padding: 0;vertical-align: top;text-align: left;">
						<th style="color: #3c5665;font-family: Helvetica, Arial, sans-serif;font-weight: normal;padding: 0;margin: 0;text-align: left;line-height: 19px;font-size: 15px;">
							<br/><br/>
							<b>
								<?php echo Yii::t("common","Hello, you have made a request to know what data we have, you find attached the data and if below a summary") ?>
							</b>
							<br/><br/>
							<?php 
						
								if(!empty($resume["account"])){
									if(!empty($resume["tobeactivated"]) && $resume["tobeactivated"] == true){
										if(!empty($resume["invitedBy"]) && $resume["invitedBy"] == true)
											echo "<li>".Yii::t("common", "You have been invited to join Communicate")."</li>";
										else
											echo "<li>".Yii::t("common", "You have an account pending validation")."</li>";
									
									} else {
										echo "<li>".Yii::t("common", "You have an account.")."</li>";
									}
								} else {
									echo "<li>".Yii::t("common", "No user account is associated with your email")."</li>";
								}


								if(!empty($resume["elts"])){
									echo "<li>".Yii::t("common", "Summary of the number of times your email has been referenced in items")."</li>" ;
									echo "<ul>";
									foreach ($resume["elts"] as $key => $value) {
										echo "<li>".Yii::t("common", $key)." : ".$value."</li>";
									}
									echo "</ul>";
								} else {
									echo "<li>".Yii::t("common", "Your e-mail is not referenced in any element.")."</li>" ;
								}
							?>
						</th>
					</tr>					
				</table>

	        </th>
		</tr>

		<tr style="padding: 0;vertical-align: top;text-align: left;">
			<td style="color: #3c5665;font-family: Helvetica, Arial, sans-serif;font-weight: normal;padding: 0;margin: 0;text-align: left;line-height: 19px;font-size: 15px;">
				
				<?php $this->renderPartial('webroot.themes.'.Yii::app()->theme->name.'.views.layouts.mail.footer', 
					array("logo" => @$logo,
							"url" => $url,
							"name" => @$title) ); ?>

			</td>

		</tr>

	</tbody>
</table>
</center></td></tr></table>
</body></html>