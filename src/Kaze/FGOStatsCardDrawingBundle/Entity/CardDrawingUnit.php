<?php

namespace Kaze\FGOStatsCardDrawingBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Tranz\TZBaseBundle\Entity\TZBaseEntity;

/**
 * @ORM\Table(name="card_drawing_unit")
 * @ORM\Entity
 */
class CardDrawingUnit implements TZBaseEntity
{
    /**
     * @var integer
     * @ORM\Column(name="id", type="bigint")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @var integer
     * @ORM\Column(name="group_id", type="bigint")
     */
    private $groupId;

    /**
     * @var integer
     * @ORM\Column(name="type", type="smallint")
     */
    private $type;

    /**
     * @var integer
     * @ORM\Column(name="cost_charms", type="integer")
     */
    private $costCharms;

    /**
     * @var integer
     * @ORM\Column(name="cost_free_stones", type="integer")
     */
    private $costFreeStones;

    /**
     * @var integer
     * @ORM\Column(name="cost_paid_stones", type="integer")
     */
    private $costPaidStones;

    /**
     * @var string
     * @ORM\Column(name="is_deleted", type="string")
     */
    private $isDeleted;

    /**
     * @var integer
     * @ORM\Column(name="created_by", type="bigint")
     */
    private $createdBy;

    /**
     * @var \DateTime
     * @ORM\Column(name="created_time", type="datetime")
     */
    private $createdTime;

    /**
     * @var integer
     * @ORM\Column(name="updated_by", type="bigint")
     */
    private $updatedBy;

    /**
     * @var \DateTime
     * @ORM\Column(name="updated_time", type="datetime")
     */
    private $updatedTime;

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param int $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * @return int
     */
    public function getGroupId()
    {
        return $this->groupId;
    }

    /**
     * @param int $groupId
     */
    public function setGroupId($groupId)
    {
        $this->groupId = $groupId;
    }

    /**
     * @return int
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * @param int $type
     */
    public function setType($type)
    {
        $this->type = $type;
    }

    /**
     * @return int
     */
    public function getCostCharms()
    {
        return $this->costCharms;
    }

    /**
     * @param int $costCharms
     */
    public function setCostCharms($costCharms)
    {
        $this->costCharms = $costCharms;
    }

    /**
     * @return int
     */
    public function getCostFreeStones()
    {
        return $this->costFreeStones;
    }

    /**
     * @param int $costFreeStones
     */
    public function setCostFreeStones($costFreeStones)
    {
        $this->costFreeStones = $costFreeStones;
    }

    /**
     * @return int
     */
    public function getCostPaidStones()
    {
        return $this->costPaidStones;
    }

    /**
     * @param int $costPaidStones
     */
    public function setCostPaidStones($costPaidStones)
    {
        $this->costPaidStones = $costPaidStones;
    }

    /**
     * @return string
     */
    public function getIsDeleted()
    {
        return $this->isDeleted;
    }

    /**
     * @param string $isDeleted
     */
    public function setIsDeleted($isDeleted)
    {
        $this->isDeleted = $isDeleted;
    }

    /**
     * @return int
     */
    public function getCreatedBy()
    {
        return $this->createdBy;
    }

    /**
     * @param int $createdBy
     */
    public function setCreatedBy($createdBy)
    {
        $this->createdBy = $createdBy;
    }

    /**
     * @return \DateTime
     */
    public function getCreatedTime()
    {
        return $this->createdTime;
    }

    /**
     * @param \DateTime $createdTime
     */
    public function setCreatedTime($createdTime)
    {
        $this->createdTime = $createdTime;
    }

    /**
     * @return int
     */
    public function getUpdatedBy()
    {
        return $this->updatedBy;
    }

    /**
     * @param int $updatedBy
     */
    public function setUpdatedBy($updatedBy)
    {
        $this->updatedBy = $updatedBy;
    }

    /**
     * @return \DateTime
     */
    public function getUpdatedTime()
    {
        return $this->updatedTime;
    }

    /**
     * @param \DateTime $updatedTime
     */
    public function setUpdatedTime($updatedTime)
    {
        $this->updatedTime = $updatedTime;
    }
}
