// Requirements ////////////////////////////////////////////////////////////////////////////////////////////////////////

const $ = require('jquery');
require('bootstrap');
const React = require('react');
const ReactDOM = require('react-dom');

require('bundles/kazefgostatscarddrawing/css/CardDrawing/index.scss');
const noty = require('bundles/kazefgostatscarddrawing/js/common/noty.js');
const actions = require('bundles/kazefgostatscarddrawing/js/common/actions.js')('kazefgostatscarddrawing');
const trans = require('bundles/kazefgostatscarddrawing/js/common/translator.js')('kazefgostatscarddrawing');

import {Constants} from './constants.js'
import {Stats} from './Stats.jsx'
import {RecordForm} from './RecordForm.jsx'


// Definitions /////////////////////////////////////////////////////////////////////////////////////////////////////////

const asyncData = {};


// Events //////////////////////////////////////////////////////////////////////////////////////////////////////////////

$('body').on('data.loaded', function (evt, dataType, data) {
    asyncData[dataType] = data;

    if (asyncData['cards'] && asyncData['cardPools'])
        ReactDOM.render(<RecordForm cards={asyncData['cards']} cardPools={asyncData['cardPools']} />, $('#record_form')[0]);

    if (asyncData['cards'] && asyncData['cardPools'] && asyncData['stats'])
        ReactDOM.render(<Stats stats={asyncData['stats']} />, $('#stats')[0]);
});


// Functions ///////////////////////////////////////////////////////////////////////////////////////////////////////////

function getCardPools() {
    $.ajax({
        url: actions('FGOStatsCardDrawing.CardDrawing.get_card_pools'),
        type: 'GET',
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
            // if (__DEV__) console.log('get_card_pools success: ' + textStatus + ', ' + JSON.stringify(data));

            if (data['resultStatus'] && data['resultStatus'] === true && data['result'] && data['result']['result']) {
                if (__DEV__) console.log('get_card_pools success, count:' + data['result']['result'].length);

                const cardPools = formatCardPools(data['result']['result']);
                $('body').trigger('data.loaded', ['cardPools', cardPools]);
            }
            else if (data['resultDisplayMsg']) {
                if (__DEV__) console.log('get_card_pools failed, with display message');
                noty('获取卡池列表失败: ' + data['resultDisplayMsg'], 'error');
            }
            else {
                if (__DEV__) console.log('get_card_pools failed, without display message');
                noty('获取卡池列表失败', 'error');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (__DEV__) console.log('get_card_pools error: state: ' + textStatus + ', error: ' + errorThrown);
            noty('获取卡池列表失败', 'error');
        }
    });
}


function getCards() {
    $.ajax({
        url: actions('FGOStatsCardDrawing.CardDrawing.get_cards'),
        type: 'GET',
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
            // if (__DEV__) console.log('get_cards success: ' + textStatus + ', ' + JSON.stringify(data));

            if (data['resultStatus'] && data['resultStatus'] === true && data['result'] && data['result']['result']) {
                if (__DEV__) console.log('get_cards success, count:' + data['result']['result'].length);

                const cards = formatCards(data['result']['result']);
                $('body').trigger('data.loaded', ['cards', cards]);
            }
            else if (data['resultDisplayMsg']) {
                if (__DEV__) console.log('get_cards failed, with display message');
                noty('获取卡片列表失败: ' + data['resultDisplayMsg'], 'error');
            }
            else {
                if (__DEV__) console.log('get_cards failed, without display message');
                noty('获取卡片列表失败', 'error');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (__DEV__) console.log('get_cards error: state: ' + textStatus + ', error: ' + errorThrown);
            noty('获取卡片列表失败', 'error');
        }
    });
}


function getStats() {
    $.ajax({
        url: actions('FGOStatsCardDrawing.CardDrawing.get_stats'),
        type: 'GET',
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
            // if (__DEV__) console.log('get_stats success: ' + textStatus + ', ' + JSON.stringify(data));

            if (data['resultStatus'] && data['resultStatus'] === true && data['result']) {
                if (__DEV__) console.log('get_stats success');

                $('body').trigger('data.loaded', ['stats', data['result']]);
            }
            else if (data['resultDisplayMsg']) {
                if (__DEV__) console.log('get_stats failed, with display message');
                noty('获取统计信息失败: ' + data['resultDisplayMsg'], 'error');
            }
            else {
                if (__DEV__) console.log('get_stats failed, without display message');
                noty('获取统计信息失败', 'error');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (__DEV__) console.log('get_stats error: state: ' + textStatus + ', error: ' + errorThrown);
            noty('获取统计信息失败', 'error');
        }
    });
}


function formatCards(cardList) {
    const cards = {};

    cardList.forEach((card) => {
        cards[card.id] = card;
    });

    return cards;
}


function formatCardPools(cardPools) {
    return cardPools.reverse();
}


// Initializations /////////////////////////////////////////////////////////////////////////////////////////////////////

getCardPools();
getCards();
getStats();
