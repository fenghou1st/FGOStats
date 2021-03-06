<?php

namespace Kaze\FGOStatsCardDrawingBundle\Handler;

use Tranz\TZBaseBundle\Constants\TZBaseHandlerConstant;
use Tranz\TZBaseBundle\Handler\Impl\TZBaseHandler;
use Tranz\TZBaseBundle\Plugin\Mysql\SqlQuery\SqlQueryTable;
use Tranz\TZBaseBundle\Plugin\Mysql\SqlQuery\SqlQuerySelect;
use Kaze\FGOStatsCardDrawingBundle\Constants\CardDrawingConst as Constants;
use Kaze\FGOStatsCardDrawingBundle\Constants\ExceptionConst;
use Kaze\FGOStatsCardDrawingBundle\Exceptions\HandlerException;
use Kaze\FGOStatsCardDrawingBundle\Entity\CardDrawingGroup;
use Kaze\FGOStatsCardDrawingBundle\Entity\CardDrawingUnit;
use Kaze\FGOStatsCardDrawingBundle\Entity\CardDrawingAward;

class CardDrawingHandler extends TZBaseHandler
{
    const REPO_NAME = "KazeFGOStatsCardDrawingBundle:CardDrawingGroup";


    public function setEntityClass()
    {
        $this->entityClass = self::REPO_NAME;
    }


    public function create(array $params): int
    {
        $this->beginTransaction();
        try
        {
            $groupEntity = $this->createGroupEntity($params);
            $this->persist($groupEntity);
            $this->flush($groupEntity);

            foreach ($params['units'] as $unit)
            {
                $unitEntity = $this->createUnitEntity($groupEntity, $unit);
                $this->persist($unitEntity);
                $this->flush($unitEntity);

                foreach ($unit['awards'] as $cardId)
                {
                    $awardEntity = $this->createAwardEntity($unitEntity, $cardId);
                    $this->persist($awardEntity);
                }
            }

            $this->flush();
            $this->commit();

            return $groupEntity->getId();
        }
        catch (\Exception $e)
        {
            $this->rollback();

            $errMsg = 'CardDrawingHandler.create: ' . $e->getMessage();
            $this->getLogger()->error($errMsg);
            throw new HandlerException($errMsg, ExceptionConst::TRANSACTION_ERROR);
        }
    }


    private function createGroupEntity(array $params): CardDrawingGroup
    {
        $entity = new CardDrawingGroup();

        $entity->setServerId($params['serverId']);
        $entity->setDrawingTime(new \DateTime($params['drawingTime']));
        $entity->setPoolId($params['poolId']);
        $entity->setMasterLevel($params['masterLevel']);
        $entity->setCreatedBy($params['userId'] ?: TZBaseHandlerConstant::SYS_ADMIN);
        $entity->setUpdatedBy($params['userId'] ?: TZBaseHandlerConstant::SYS_ADMIN);
        $this->setDefaultFields($entity);

        return $entity;
    }


    private function createUnitEntity(CardDrawingGroup $group, array $unit): CardDrawingUnit
    {
        $entity = new CardDrawingUnit();

        $entity->setGroupId($group->getId());
        $entity->setType($unit['type']);
        $entity->setCostCharms($unit['costCharms']);
        $entity->setCostFreeStones($unit['costFreeStones']);
        $entity->setCostPaidStones($unit['costPaidStones']);
        $entity->setCreatedBy($group->getCreatedBy());
        $entity->setUpdatedBy($group->getUpdatedBy());
        $this->setDefaultFields($entity);

        return $entity;
    }


    private function createAwardEntity(CardDrawingUnit $unit, int $cardId): CardDrawingAward
    {
        $entity = new CardDrawingAward();

        $entity->setUnitId($unit->getId());
        $entity->setCardId($cardId);
        $entity->setCreatedBy($unit->getCreatedBy());
        $entity->setUpdatedBy($unit->getUpdatedBy());
        $this->setDefaultFields($entity);

        return $entity;
    }


    public function search(array $criteria = [], array $orders = [], int $start = 0, int $length = 10): array
    {
        $sqlCountFiveStarServants =
            'SUM(CASE WHEN c.type = ' . Constants::CARD_TYPE_SERVANT . ' AND c.star = 5 THEN 1 ELSE 0 END)';

        $sqlCountFiveStarCraftEssences =
            'SUM(CASE WHEN c.type = ' . Constants::CARD_TYPE_CRAFT_ESSENCES . ' AND c.star = 5 THEN 1 ELSE 0 END)';

        $query = $this->getSqlQuery(
            [
                new SqlQueryTable('card_drawing_group', 'g'),
                new SqlQueryTable('card_drawing_unit', 'u', 'LEFT JOIN', 'g.id = u.group_id'),
                new SqlQueryTable('card_drawing_award', 'a', 'LEFT JOIN', 'u.id = a.unit_id'),
                new SqlQueryTable('card', 'c', 'LEFT JOIN', 'a.card_id = c.id'),
            ],
            [
                new SqlQuerySelect('g.id', 'id'),
                new SqlQuerySelect('g.server_id', 'serverId'),
                new SqlQuerySelect('g.drawing_time', 'drawingTime'),
                new SqlQuerySelect('g.pool_id', 'poolId'),
                new SqlQuerySelect('g.master_level', 'masterLevel'),
                new SqlQuerySelect('COUNT(a.id)', 'numCards'),
                new SqlQuerySelect($sqlCountFiveStarServants, 'numFiveStarServants'),
                new SqlQuerySelect($sqlCountFiveStarCraftEssences, 'numFiveStarCraftEssences'),
                new SqlQuerySelect('g.created_by', 'userId'),
            ],
            ['g.id']
        );

        $queryResult = $query->query($criteria, $orders, $start, $length);

        return $queryResult;
    }


    public function getStats(): array
    {
        $sqlDrawingCnt = 'SELECT' .
            ' g.server_id AS serverId,' .
            ' g.pool_id AS poolId,' .
            ' COUNT(*) AS drawingCnt' .
            ' FROM card_drawing_group AS g' .
            ' LEFT JOIN card_drawing_unit AS u ON g.id = u.group_id AND u.is_deleted = \'' . TZBaseHandlerConstant::IS_NOT_DELETED . '\'' .
            ' LEFT JOIN card_drawing_award AS a ON u.id = a.unit_id AND a.is_deleted = \'' . TZBaseHandlerConstant::IS_NOT_DELETED . '\'' .
            ' LEFT JOIN card AS c ON a.card_id = c.id AND c.is_deleted = \'' . TZBaseHandlerConstant::IS_NOT_DELETED . '\'' .
            ' WHERE g.is_deleted = \'' . TZBaseHandlerConstant::IS_NOT_DELETED . '\'' .
            ' GROUP BY g.server_id, g.pool_id';

        $sqlCardCnt = 'SELECT' .
            ' g.server_id AS serverId,' .
            ' g.pool_id AS poolId,' .
            ' a.card_id cardId,' .
            ' c.type cardType,' .
            ' c.star cardStar,' .
            ' COUNT(*) AS cardCnt' .
            ' FROM card_drawing_group AS g' .
            ' LEFT JOIN card_drawing_unit AS u ON g.id = u.group_id AND u.is_deleted = \'' . TZBaseHandlerConstant::IS_NOT_DELETED . '\'' .
            ' LEFT JOIN card_drawing_award AS a ON u.id = a.unit_id AND a.is_deleted = \'' . TZBaseHandlerConstant::IS_NOT_DELETED . '\'' .
            ' LEFT JOIN card AS c ON a.card_id = c.id AND c.is_deleted = \'' . TZBaseHandlerConstant::IS_NOT_DELETED . '\'' .
            ' WHERE g.is_deleted = \'' . TZBaseHandlerConstant::IS_NOT_DELETED . '\'' .
            ' AND c.star IN (4, 5)'.
            ' GROUP BY g.server_id, g.pool_id, a.card_id';

        $entityManager = $this->getQueryBuilder()->getQueryBuilder()->getEntityManager();
        $conn = $entityManager->getConnection();

        $stmt = $conn->executeQuery($sqlDrawingCnt);
        $resultDrawingCnt = $stmt->fetchAll();

        $stmt = $conn->executeQuery($sqlCardCnt);
        $resultCardCnt = $stmt->fetchAll();

        $stats = [];
        foreach ($resultDrawingCnt as $result)
        {
            $serverId = $result['serverId'];
            $poolId = $result['poolId'];
            $drawingCnt = $result['drawingCnt'];
            $stats[$serverId][$poolId]['drawingCnt'] = $drawingCnt;
        }

        foreach ($resultCardCnt as $result)
        {
            $serverId = $result['serverId'];
            $poolId = $result['poolId'];
            $cardId = $result['cardId'];
            $cardType = $result['cardType'];
            $cardStar = $result['cardStar'];
            $cardCnt = $result['cardCnt'];

            $stats[$serverId][$poolId]['cards'][$cardId] = [
                'id' => $cardId,
                'type' => $cardType,
                'star' => $cardStar,
                'cnt' => $cardCnt,
                'rate' => $cardCnt / $stats[$serverId][$poolId]['drawingCnt'],
            ];

            $stats[$serverId][$poolId]['cardCounts'][$cardType][$cardStar] =
                ($stats[$serverId][$poolId]['cardCounts'][$cardType][$cardStar] ?? 0) + $cardCnt;
        }

        foreach ($stats as &$serverStats)
        {
            foreach ($serverStats as &$poolStats)
            {
                $drawingCnt = $poolStats['drawingCnt'];

                foreach ($poolStats['cardCounts'] as &$cardTypeStats)
                {
                    foreach ($cardTypeStats as $cardStar => &$cardCount)
                    {
                        $cardCount = [
                            'count' => $cardCount,
                            'rate' => $cardCount / $drawingCnt,
                        ];
                    }
                }
            }
        }

        return $stats;
    }
}
