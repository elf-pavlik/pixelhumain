<?php

$url = (!empty($url)) ? Yii::app()->getRequest()->getBaseUrl(true).$url : Yii::app()->getRequest()->getBaseUrl(true) ;

$urlValidation=Yii::app()->getRequest()->getBaseUrl(true).'/co2#element.remove.id.'.$active;
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
							<b>
								<h5 style="color: #3c5665;font-family: Helvetica, Arial, sans-serif;font-weight: normal;padding: 0;margin-top: 15px; line-height: 1.3;word-wrap: normal;margin-bottom: 10px;font-size: 20px;">
									<?php echo Yii::t("common","You have decided to do the following actions") ?> :
								</h5>
							</b>
							<?php

								echo "<ul>";
								if ( !empty($removeMail) && ($removeMail == "true" || $removeMail == true ) ) {
									echo "<li>".Yii::t("common","Delete my email associated with items")."</li>";
								}

								if ( !empty($notMail) && ( $notMail == "true" || $notMail == true ) ) {
									echo "<li>".Yii::t("common","No longer allow my email to be informed about the platform")."</li>";
								}
								echo "</ul>";

								echo '<a href="'.$urlValidation.'" style="color: #e33551;font-family: Helvetica, Arial, sans-serif;font-weight: normal;padding: 0;margin: 0;text-align: left;line-height: 1.3;text-decoration: none;">'. Yii::t("common","Validate the actions").'</a>';
							?>
							<br/><br/>
							<?php echo Yii::t("common","If you are not the originator of this request, you can ignore it"); ?>.
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