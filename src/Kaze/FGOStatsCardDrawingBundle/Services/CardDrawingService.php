<?php

namespace Kaze\FGOStatsCardDrawingBundle\Services;

use Tranz\TZBaseBundle\Services\TZBaseService;
use Kaze\FGOStatsCardDrawingBundle\Constants\CardDrawingConst as Constants;
use Kaze\FGOStatsCardDrawingBundle\Constants\ExceptionConst;
use Kaze\FGOStatsCardDrawingBundle\Exceptions\ServiceException;
use Kaze\FGOStatsCardDrawingBundle\Handler\CardDrawingHandler;
use Kaze\FGOStatsCardDrawingBundle\Handler\CardHandler;
use Kaze\FGOStatsCardDrawingBundle\Handler\CardPoolHandler;

class CardDrawingService extends TZBaseService
{
    private $handler;
    private $cardHandler;
    private $cardPoolHandler;


    public function __construct(CardDrawingHandler $handler,
                                CardHandler $cardHandler,
                                CardPoolHandler $cardPoolHandler)
    {
        $this->handler = $handler;
        $this->cardHandler = $cardHandler;
        $this->cardPoolHandler = $cardPoolHandler;
    }


    /**
     * @param array $params
     *      userId => int|null
     *      serverId => int
     *      drawingTime => string
     *      poolId => int
     *      masterLevel => int|null
     *      units => array                      array of units
     *              type => int
     *              costCharms => int
     *              costFreeStones => int
     *              costPaidStones => int
     *              awards => array             [int (cardId), ...]
     * @return int
     * @throws \Exception
     */
    public function create(array $params): int
    {
        $this->checkCreateParams($params);

        return $this->handler->create($params);
    }


    public function search(array $criteria = [], array $orders = [], int $start = 0, int $length = 10): array
    {
        return $this->handler->search($criteria, $orders, $start, $length);
    }


    public function getStats(): array
    {
        return $this->handler->getStats();
    }


    public function getAllCards(): array
    {
        return $this->cardHandler->getAll();
    }


    public function getAllCardPools(): array
    {
        return $this->cardPoolHandler->getAll();
    }


    /**
     * @param array $params
     * @throws ServiceException
     */
    private function checkCreateParams(array &$params)
    {
        if (!array_key_exists('userId', $params) ||
            empty($params['serverId']) ||
            empty($params['drawingTime']) ||
            empty($params['poolId']) ||
            !array_key_exists('masterLevel', $params))
            throw new ServiceException('CardDrawingService.checkCreateParams: Invalid parameters',
                ExceptionConst::INVALID_PARAMS);

        if (!$params['masterLevel']) $params['masterLevel'] = null;

        if (!is_array($params['units']))
            throw new ServiceException('CardDrawingService.checkCreateParams: Invalid parameters',
                ExceptionConst::INVALID_PARAMS);

        foreach ($params['units'] as &$unit)
        {
            if (empty($unit['type']) ||
                !isset($unit['costCharms']) || !is_numeric($unit['costCharms']) ||
                !isset($unit['costFreeStones']) || !is_numeric($unit['costFreeStones']) ||
                !isset($unit['costPaidStones']) || !is_numeric($unit['costPaidStones']))
                throw new ServiceException('CardDrawingService.checkCreateParams: Invalid parameters',
                    ExceptionConst::INVALID_PARAMS);

            $type = (int) $unit['type'];
            switch ($type)
            {
                case Constants::UNIT_TYPE_ONE_TIME:
                    if (!is_array($unit['awards']) || count($unit['awards']) !== 1)
                        throw new ServiceException('CardDrawingService.checkCreateParams: Invalid parameters',
                            ExceptionConst::INVALID_PARAMS);
                    break;
                case Constants::UNIT_TYPE_TEN_TIMES:
                    if (!is_array($unit['awards']) || count($unit['awards']) !== 10)
                        throw new ServiceException('CardDrawingService.checkCreateParams: Invalid parameters',
                            ExceptionConst::INVALID_PARAMS);
                    break;
                default:
                    throw new ServiceException('CardDrawingService.checkCreateParams: Invalid parameters',
                        ExceptionConst::INVALID_PARAMS);
            }

            foreach ($unit['awards'] as &$award)
                if (empty($award))
                    $award = Constants::CARD_ID_UNKNOWN;
        }
    }
}
