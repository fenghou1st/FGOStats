// Requirements ////////////////////////////////////////////////////////////////////////////////////////////////////////

const $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');

const noty = require('bundles/kazefgostatscarddrawing/js/common/noty.js');
const actions = require('bundles/kazefgostatscarddrawing/js/common/actions.js')('kazefgostatscarddrawing');
const trans = require('bundles/kazefgostatscarddrawing/js/common/translator.js')('kazefgostatscarddrawing');

import {Constants} from './constants.js'


// Definitions /////////////////////////////////////////////////////////////////////////////////////////////////////////

// React ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

class CardStats extends React.Component {
    /**
     * @param props object      {drawingCnt => string, cardStat: {}, cards: {}}
     *      cardStat: {id => string, type => string, star => string, cnt => string, rate => float}
     */
    constructor (props) {
        super(props);
    }

    render () {
        const info = this.getCardInfo(this.props.cardStat['id']);
        const rate = this.props.cardStat['rate'];
        const rateString = (rate * 1000).toFixed(2);
        const stones = Math.ceil((1 / rate) * 3);
        const tooltip = this.props.drawingCnt + ' 抽 ' + this.props.cardStat['cnt'] + ' 中';

        return (
            <div className="stats_card">
                <img src={info.cardUrl}/>
                <div className="rate_desc" data-toggle="tooltip" title={tooltip}
                      ref={(node) => {this.nodeRate = node;}}>
                    <div className="rate">抽中几率 <span>{rateString}</span> ‰</div>
                    <div className="stones">平均消费圣晶石 <span>{stones}</span> 个</div>
                </div>
            </div>
        );
    }

    componentDidMount () {
        $(this.nodeRate).tooltip();
    }

    getCardInfo (cardId) {
        if (cardId === null || cardId <= 0 || cardId >= Object.keys(this.props.cards).length)
            return {cardId: null, cardUrl: Constants.UNKNOWN_CARD_URL};
        else
            return {cardId: cardId, cardUrl: this.props.cards[cardId].url};
    }
}


// Events //////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Functions ///////////////////////////////////////////////////////////////////////////////////////////////////////////

// Initializations /////////////////////////////////////////////////////////////////////////////////////////////////////

exports.CardStats = CardStats;
