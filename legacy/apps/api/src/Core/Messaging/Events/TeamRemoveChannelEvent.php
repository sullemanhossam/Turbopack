<?php declare(strict_types=1);
/*******************************************************************************
 * Copyright(c) 2019 CodeLathe. All rights Reserved.
 *******************************************************************************/

namespace CodeLathe\Core\Messaging\Events;

use CodeLathe\Core\Objects\Channel;
use CodeLathe\Core\Objects\Team;
use CodeLathe\Core\Objects\User;

/**
 * This event is for tracking User login event
 */

class TeamRemoveChannelEvent extends  AbstractTeamChannelEvent
{
    public const NAME = 'team.remove_channel';

    /**
     * This method is to get the base event Name
     * @return string
     */
    static function eventName(): string
    {
        return self::NAME;
    }

}