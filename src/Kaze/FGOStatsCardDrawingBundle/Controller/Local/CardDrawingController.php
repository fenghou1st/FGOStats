<?php

namespace Kaze\FGOStatsCardDrawingBundle\Controller\Local;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use FOS\RestBundle\Controller\Annotations;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Tranz\TZBaseBundle\Controller\TZBaseController;
use Kaze\FGOStatsCardDrawingBundle\Services\CardDrawingService;

class CardDrawingController extends TZBaseController
{
    /**
     * @Annotations\Get("/", name="FGOStatsCardDrawing.CardDrawing.index")
     * @Template()
     *
     * @param Request $request
     * @return array
     */
    public function indexAction(Request $request)
    {
        return [];
    }


    /**
     * @Annotations\Get("/card-drawing/data", name="FGOStatsCardDrawing.CardDrawing.get_data")
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getDataAction(Request $request)
    {
        try
        {
            $pageParam = $this->handleDatatableQueryRequest($request);

            $result = $this->getCardDrawingService()->search(
                $pageParam['criteria'], $pageParam['orders'], $pageParam['start'], $pageParam['length']);

            return $this->renderReturn($this->renderDatatableQueryReturn($pageParam['draw'], $result));
        }
        catch (\Exception $e)
        {
            return $this->renderExceptionReturn($e);
        }
    }


    /**
     * @Annotations\Get("/card-drawing/stats", name="FGOStatsCardDrawing.CardDrawing.get_stats")
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getStatsAction(Request $request)
    {
        try
        {
            $result = $this->getCardDrawingService()->getStats();
            return $this->renderReturn($result);
        }
        catch (\Exception $e)
        {
            return $this->renderExceptionReturn($e);
        }
    }


    /**
     * @Annotations\Post("/card-drawing", name="FGOStatsCardDrawing.CardDrawing.create")
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function createAction(Request $request)
    {
        try
        {
            $params = $request->request->all();

            $params['userId'] = -1;

            $groupId = $this->getCardDrawingService()->create($params);

            return $this->renderReturn(['groupId' => $groupId]);
        }
        catch (\Exception $e)
        {
            return $this->renderExceptionReturn($e);
        }
    }


    /**
     * @Annotations\Get("/card-drawing/cards", name="FGOStatsCardDrawing.CardDrawing.get_cards")
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getCardsAction(Request $request)
    {
        try
        {
            $result = $this->getCardDrawingService()->getAllCards();

            return $this->renderReturn($result);
        }
        catch (\Exception $e)
        {
            return $this->renderExceptionReturn($e);
        }
    }


    /**
     * @Annotations\Get("/card-drawing/card-pools", name="FGOStatsCardDrawing.CardDrawing.get_card_pools")
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getCardPoolsAction(Request $request)
    {
        try
        {
            $result = $this->getCardDrawingService()->getAllCardPools();

            return $this->renderReturn($result);
        }
        catch (\Exception $e)
        {
            return $this->renderExceptionReturn($e);
        }
    }


    /** @return CardDrawingService */
    public function getCardDrawingService()
    {
        return $this->container->get('kaze_fgo_stats_card_drawing.service.card_drawing');
    }
}
