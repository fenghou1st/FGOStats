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


// React ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

class ReactContainer extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            showStats: true,
            showForm: false,
        };

        this.onSelectAction = this.onSelectAction.bind(this);
    }

    render () {
        const stats = this.state.showStats ?
            (<Stats {...this.props} />) :
            null;
        const form = this.state.showForm ?
            (<RecordForm {...this.props} onRecordsSubmitted={this.onRecordsSubmitted.bind(this)} />) :
            null;

        return (
            <div>
                <div className="header">
                    <div className="title">Fate / Grand Order 抽卡概率统计</div>
                    <div className="desc">为获得足够准确的概率，劳烦各位 Master 提交一下您的抽卡记录，谢啦～</div>
                    <div className="contact">若遇到问题请发邮件到
                        <a href="mailto:fenghou1st@gmail.com">fenghou1st@gmail.com</a>
                        ，或回复
                        <a href="http://baidu.com/">此帖</a>
                    </div>
                    <div className="actions">
                        <button type="button"
                                className={"btn " + (this.state.showStats ? "btn-primary" : "btn-default")}
                                onClick={() => this.onSelectAction('stats')}>查看统计结果</button>
                        <button type="button"
                                className={"btn " + (this.state.showForm ? "btn-primary" : "btn-default")}
                                onClick={() => this.onSelectAction('form')}>提交抽卡记录</button>
                    </div>
                </div>
                {stats}
                {form}
            </div>
        );
    }

    onSelectAction (action) {
        if (action === 'stats')
            this.setState({showStats: true, showForm: false});
        else if (action === 'form')
            this.setState({showStats: false, showForm: true});
    }

    onRecordsSubmitted () {
        location.reload();
    }
}


// Events //////////////////////////////////////////////////////////////////////////////////////////////////////////////

$('body').on('data.loaded', function (evt, dataType, data) {
    asyncData[dataType] = data;

    if (asyncData['cards'] && asyncData['cardPools'] && asyncData['stats'])
        ReactDOM.render(
            <ReactContainer stats={asyncData['stats']} cards={asyncData['cards']} cardPools={asyncData['cardPools']} />,
            $('#react')[0]);
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
                noty('获取卡池列表失败: ' + data['resultDisplayMsg'], 'error', 3000);
            }
            else {
                if (__DEV__) console.log('get_card_pools failed, without display message');
                noty('获取卡池列表失败', 'error', 3000);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (__DEV__) console.log('get_card_pools error: state: ' + textStatus + ', error: ' + errorThrown);
            noty('获取卡池列表失败', 'error', 3000);
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
                noty('获取卡片列表失败: ' + data['resultDisplayMsg'], 'error', 3000);
            }
            else {
                if (__DEV__) console.log('get_cards failed, without display message');
                noty('获取卡片列表失败', 'error', 3000);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (__DEV__) console.log('get_cards error: state: ' + textStatus + ', error: ' + errorThrown);
            noty('获取卡片列表失败', 'error', 3000);
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
                noty('获取统计信息失败: ' + data['resultDisplayMsg'], 'error', 3000);
            }
            else {
                if (__DEV__) console.log('get_stats failed, without display message');
                noty('获取统计信息失败', 'error', 3000);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (__DEV__) console.log('get_stats error: state: ' + textStatus + ', error: ' + errorThrown);
            noty('获取统计信息失败', 'error', 3000);
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
