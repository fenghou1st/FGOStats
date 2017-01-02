<?php

namespace Kaze\FGOStatsCardDrawingBundle\Tests\Services;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Kaze\FGOStatsCardDrawingBundle\Constants\CardDrawingConst;
use Kaze\FGOStatsCardDrawingBundle\Services\CardDrawingService;

class CardDrawingServiceTest extends WebTestCase
{
    /** @var CardDrawingService */
    protected $service;


    /**
     * Sets up the fixture, for example, opens a network connection.
     * This method is called before a test is executed.
     */
    protected function setUp()
    {
        global $kernel;
        $kernel = static::createKernel();
        $kernel->boot();

        $this->service = $kernel->getContainer()->get('kaze_fgo_stats_card_drawing.service.card_drawing');
    }


    /**
     * Tears down the fixture, for example, closes a network connection.
     * This method is called after a test is executed.
     */
    protected function tearDown()
    {
        unset($this->service);
    }


    /**
     * @covers CardDrawingService::create
     */
    public function testCreate()
    {
        $params = [
            'userId' => 1,
            'serverId' => CardDrawingConst::SERVER_BILI_ANDROID,
            'drawingTime' => '2016-12-30 02:00:00',
            'poolId' => 4,
            'masterLevel' => 109,
            'units' => [
                [
                    'type' => CardDrawingConst::UNIT_TYPE_ONE_TIME,
                    'costCharms' => 0,
                    'costFreeStones' => 3,
                    'costPaidStones' => 0,
                    'awards' => [55],
                ],
                [
                    'type' => CardDrawingConst::UNIT_TYPE_TEN_TIMES,
                    'costCharms' => 0,
                    'costFreeStones' => 30,
                    'costPaidStones' => 0,
                    'awards' => [55, 55, 55, 55, 55, 13, 13, 13, 13, 13],
                ]
            ]
        ];

        $groupId = $this->service->create($params);

        echo "\n  testCreate: [$groupId]\n";
    }


    /**
     * @covers CardDrawingService::search
     */
    public function testSearch()
    {
        $criteria = ['userId' => 1];
        $orders = [];
        $start = 0;
        $length = 10;

        $result = $this->service->search($criteria, $orders, $start, $length);

        echo "\n  testSearch: [" . json_encode($result) . "]\n";
    }


    /**
     * @covers CardDrawingService::getAllCards
     */
    public function testGetAllCards()
    {
        $result = $this->service->getAllCards();

        echo "\n  testGetAllCards: [" . json_encode($result) . "]\n";
    }


    /**
     * @covers CardDrawingService::getAllCardPools
     */
    public function testGetAllCardPools()
    {
        $result = $this->service->getAllCardPools();

        echo "\n  testGetAllCardPools: [" . json_encode($result) . "]\n";
    }
}
