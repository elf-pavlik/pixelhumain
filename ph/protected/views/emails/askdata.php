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
								<?php echo Yii::t("common","Hello, you have made a request to know what data we have, you find in this email a summary and the link to all your data") ?>
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

								$urlData = Yii::app()->getRequest()->getBaseUrl(true).'/co2/mailmanagement/getdata/id/'.$attach;
							?>

						</th>
					</tr>
					<tr style="padding: 0;vertical-align: top;text-align: center;">
						<th style="color: #728289;font-family: Helvetica, Arial, sans-serif;font-weight: normal;padding: 0;margin: 0;text-align: center;line-height: 19px;">
							<br/>
							<h4 style="text-align: center;">
								<a href="<?php echo $urlData ?>" style="color: #e33551; font-family: Helvetica, Arial, sans-serif;font-weight: bold;padding: 0;margin: 0;text-align: center;line-height: 1.3;text-decoration: none;">
									<?php 
									echo Yii::t("common","Link to your data");
									?>
								</a>
							</h4>
						</th>
					</tr>
					<tr style="padding: 0;vertical-align: top;text-align: left;">
						<th style="color: #3c5665;font-family: Helvetica, Arial, sans-serif;font-weight: normal;padding: 0;margin: 0;text-align: left;line-height: 19px;font-size: 15px;">
							<br/><br/>
							<p >
							<?php echo Yii::t("mail","If the link doesn&apos;t work, you can copy it in your browser&apos;s address") ?>
							<div style="word-break: break-all;font-size: 15px;"><?php echo $urlData; ?></div></p>
						</th>
					</tr>
					<tr style="padding: 0;vertical-align: top;text-align: left;">
						<th style="color: #3c5665;font-family: Helvetica, Arial, sans-serif;font-weight: normal;padding: 0;margin: 0;text-align: left;line-height: 19px;font-size: 15px;">
							<br/><br/>
							<p>
							<?php echo Yii::t("common","This url will be deleted after one week, remember to copy and paste your data or make a new request."); ?></p>
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