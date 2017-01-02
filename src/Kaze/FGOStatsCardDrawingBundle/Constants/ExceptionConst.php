<?php

namespace Kaze\FGOStatsCardDrawingBundle\Constants;

class ExceptionConst
{
    const BASE_COMMON_COMMON            = 1000000;
    const BASE_COMMON_CURL              = 1001000;
    const BASE_CARD_DRAWING_COMMON      = 2000000;

    const INVALID_PARAMS                = self::BASE_COMMON_COMMON + 1;
    const MALFORMED_CONFIGS             = self::BASE_COMMON_COMMON + 2;
    const REMOTE_RESP_ERROR             = self::BASE_COMMON_COMMON + 3;
    const TRANSACTION_ERROR             = self::BASE_COMMON_COMMON + 4;
    const NOT_IMPLEMENTED               = self::BASE_COMMON_COMMON + 5;

    const CURL_EXEC_FAILED              = self::BASE_COMMON_CURL + 1;
}
