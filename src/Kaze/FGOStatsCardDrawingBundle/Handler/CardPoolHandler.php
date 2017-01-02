<?php

namespace Kaze\FGOStatsCardDrawingBundle\Handler;

use Tranz\TZBaseBundle\Constants\TZBaseHandlerConstant;
use Tranz\TZBaseBundle\Handler\Impl\TZBaseHandler;
use Tranz\TZBaseBundle\Plugin\Mysql\SqlQuery\SqlQueryTable;
use Tranz\TZBaseBundle\Plugin\Mysql\SqlQuery\SqlQuerySelect;
use Kaze\FGOStatsCardDrawingBundle\Constants\CardDrawingConst as Constants;
use Kaze\FGOStatsCardDrawingBundle\Constants\ExceptionConst;
use Kaze\FGOStatsCardDrawingBundle\Exceptions\HandlerException;
use Kaze\FGOStatsCardDrawingBundle\Entity\CardPool;

class CardPoolHandler extends TZBaseHandler
{
    const REPO_NAME = "KazeFGOStatsCardDrawingBundle:CardPool";


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
                new SqlQueryTable('card_pool', 'p')
            ],
            [
                new SqlQuerySelect('p.id', 'id'),
                new SqlQuerySelect('p.name', 'name'),
                new SqlQuerySelect('p.begin_time', 'beginTime'),
                new SqlQuerySelect('p.end_time', 'endTime'),
            ]);

        $queryResult = $query->query($criteria, $orders, $start, $length);

        return $queryResult;
    }


    public function getByDrawTime(string $drawTime): array
    {
        $sql = 'SELECT' .
            ' id AS id,' .
            ' name AS name,' .
            ' begin_time AS beginTime,' .
            ' end_time AS endTime' .
            ' FROM card_pool' .
            ' WHERE (begin_time IS NULL OR begin_time <= :drawTime)' .
            ' AND (end_time IS NULL OR end_time > :drawTime)' .
            ' AND is_deleted = \'' . TZBaseHandlerConstant::IS_NOT_DELETED . '\'';

        $entityManager = $this->getQueryBuilder()->getQueryBuilder()->getEntityManager();
        $conn = $entityManager->getConnection();

        $stmt = $conn->executeQuery($sql,
            ['drawTime' => $drawTime],
            ['drawTime' => \PDO::PARAM_STR]);

        return $stmt->fetchAll();
    }
}
