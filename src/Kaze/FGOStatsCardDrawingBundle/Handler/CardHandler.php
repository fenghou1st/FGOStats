<?php

namespace Kaze\FGOStatsCardDrawingBundle\Handler;

use Tranz\TZBaseBundle\Constants\TZBaseHandlerConstant;
use Tranz\TZBaseBundle\Handler\Impl\TZBaseHandler;
use Tranz\TZBaseBundle\Plugin\Mysql\SqlQuery\SqlQueryTable;
use Tranz\TZBaseBundle\Plugin\Mysql\SqlQuery\SqlQuerySelect;
use Kaze\FGOStatsCardDrawingBundle\Constants\CardDrawingConst as Constants;
use Kaze\FGOStatsCardDrawingBundle\Constants\ExceptionConst;
use Kaze\FGOStatsCardDrawingBundle\Exceptions\HandlerException;
use Kaze\FGOStatsCardDrawingBundle\Entity\Card;

class CardHandler extends TZBaseHandler
{
    const REPO_NAME = "KazeFGOStatsCardDrawingBundle:Card";


    public function setEntityClass()
    {
        $this->entityClass = self::REPO_NAME;
    }


    public function getAll(): array
    {
        return $this->search([], [], 0, 0xFFFFFFFF);
    }


    public function search(array $criteria = [], array $orders = [], int $start = 0, int $length = 10): array
    {
        $query = $this->getSqlQuery(
            [
                new SqlQueryTable('card', 'c')
            ],
            [
                new SqlQuerySelect('c.id', 'id'),
                new SqlQuerySelect('c.type', 'type'),
                new SqlQuerySelect('c.order', '`order`'),
                new SqlQuerySelect('c.name', 'name'),
                new SqlQuerySelect('c.star', 'star'),
                new SqlQuerySelect('c.url', 'url'),
            ]);

        $queryResult = $query->query($criteria, $orders, $start, $length);

        return $queryResult;
    }
}
