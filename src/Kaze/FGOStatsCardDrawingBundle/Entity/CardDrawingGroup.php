<?php

namespace Kaze\FGOStatsCardDrawingBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Tranz\TZBaseBundle\Entity\TZBaseEntity;

/**
 * @ORM\Table(name="card_drawing_group")
 * @ORM\Entity
 */
class CardDrawingGroup implements TZBaseEntity
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
     * @ORM\Column(name="server_id", type="smallint")
     */
    private $serverId;

    /**
     * @var \DateTime
     * @ORM\Column(name="drawing_time", type="datetime")
     */
    private $drawingTime;

    /**
     * @var integer
     * @ORM\Column(name="pool_id", type="integer")
     */
    private $poolId;

    /**
     * @var integer
     * @ORM\Column(name="master_level", type="integer")
     */
    private $masterLevel;

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
    public function getServerId()
    {
        return $this->serverId;
    }

    /**
     * @param int $serverId
     */
    public function setServerId($serverId)
    {
        $this->serverId = $serverId;
    }

    /**
     * @return \DateTime
     */
    public function getDrawingTime()
    {
        return $this->drawingTime;
    }

    /**
     * @param \DateTime $drawingTime
     */
    public function setDrawingTime($drawingTime)
    {
        $this->drawingTime = $drawingTime;
    }

    /**
     * @return int
     */
    public function getPoolId()
    {
        return $this->poolId;
    }

    /**
     * @param int $poolId
     */
    public function setPoolId($poolId)
    {
        $this->poolId = $poolId;
    }

    /**
     * @return int
     */
    public function getMasterLevel()
    {
        return $this->masterLevel;
    }

    /**
     * @param int $masterLevel
     */
    public function setMasterLevel($masterLevel)
    {
        $this->masterLevel = $masterLevel;
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
