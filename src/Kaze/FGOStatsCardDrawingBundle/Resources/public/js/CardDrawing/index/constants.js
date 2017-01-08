const moment = require('moment');
require('moment/locale/zh-cn');


exports.Constants = {
    UNIT_TYPE_ONE_TIME:     '1',
    UNIT_TYPE_TEN_TIMES:    '2',

    CARD_TYPE_SERVANT:          '1',
    CARD_TYPE_CRAFT_ESSENCES:   '2',
    CARD_TYPE_FIRE:             '3',
    CARD_TYPE_FUU:              '4',

    CARD_STAR_1:    '1',
    CARD_STAR_2:    '2',
    CARD_STAR_3:    '3',
    CARD_STAR_4:    '4',
    CARD_STAR_5:    '5',

    UNKNOWN_CARD_URL: '/bundles/kazefgostatscarddrawing/images/unknown_card.png',

    defaultServerId:    '1',
    defaultDrawingTime: moment(),
    defaultPoolId:      null,
};
