<?php
class ActivityStream {

	
	/**
   *
   * @return [json Map] list
   */
  public static function addEntry($param)
  {
    $param["timestamp"] = time();
    
    PHDB::insert(PHType::TYPE_ACTIVITYSTREAM, $param);
  }

  public static function getNotifications($param)
  {
    return PHDB::find(PHType::TYPE_ACTIVITYSTREAM, $param);
  }


}