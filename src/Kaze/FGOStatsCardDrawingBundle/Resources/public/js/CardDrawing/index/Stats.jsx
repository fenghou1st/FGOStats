// Requirements ////////////////////////////////////////////////////////////////////////////////////////////////////////

const $ = require('jquery');
const React = require('react');
const Select = require('react-select');
require('react-select/dist/react-select.css');

const noty = require('bundles/kazefgostatscarddrawing/js/common/noty.js');
const actions = require('bundles/kazefgostatscarddrawing/js/common/actions.js')('kazefgostatscarddrawing');
const trans = require('bundles/kazefgostatscarddrawing/js/common/translator.js')('kazefgostatscarddrawing');

import {Constants} from './constants.js'
import {CardStats} from './CardStats.jsx'


// Definitions /////////////////////////////////////////////////////////////////////////////////////////////////////////

// React ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Stats extends React.Component {
    /**
     * @param props object      {stats: {}, cards: {}, cardPools: []}
     */
    constructor (props) {
        super(props);

        const result = this.getPoolList();

        this.state = {
            serverId: Constants.defaultServerId,
            poolId: result[1],
            cardType: Constants.CARD_TYPE_SERVANT,
            cardStar: Constants.CARD_STAR_5,
        };

        this.pools = result[0];
    }

    render () {
        const results = this.getStats(this.state.serverId, this.state.poolId, this.state.cardType, this.state.cardStar);
        const drawingCnt = results[0];
        const cardCounts = results[1];
        const cardStats = results[2];

        const rateServant5 = ((Constants.CARD_TYPE_SERVANT in cardCounts &&
            Constants.CARD_STAR_5 in cardCounts[Constants.CARD_TYPE_SERVANT] ?
            cardCounts[Constants.CARD_TYPE_SERVANT][Constants.CARD_STAR_5]['rate'] : 0) * 100).toFixed(2);
        const rateServant4 = ((Constants.CARD_TYPE_SERVANT in cardCounts &&
            Constants.CARD_STAR_4 in cardCounts[Constants.CARD_TYPE_SERVANT] ?
            cardCounts[Constants.CARD_TYPE_SERVANT][Constants.CARD_STAR_4]['rate'] : 0) * 100).toFixed(2);
        const rateEquip5 = ((Constants.CARD_TYPE_CRAFT_ESSENCES in cardCounts &&
            Constants.CARD_STAR_5 in cardCounts[Constants.CARD_TYPE_CRAFT_ESSENCES] ?
            cardCounts[Constants.CARD_TYPE_CRAFT_ESSENCES][Constants.CARD_STAR_5]['rate'] : 0) * 100).toFixed(2);
        const rateEquip4 = ((Constants.CARD_TYPE_CRAFT_ESSENCES in cardCounts &&
            Constants.CARD_STAR_4 in cardCounts[Constants.CARD_TYPE_CRAFT_ESSENCES] ?
            cardCounts[Constants.CARD_TYPE_CRAFT_ESSENCES][Constants.CARD_STAR_4]['rate'] : 0) * 100).toFixed(2);

        const stats = [];
        cardStats.forEach((cardStat) => {
            stats.push(<CardStats
                key={cardStat['id']}
                drawingCnt={drawingCnt}
                cardStat={cardStat}
                cards={this.props.cards}
            />);
        });

        return (
            <div className="stats">
                <form role="form">
                    <div className="row">
                        <label className="col-sm-2">服务器</label>
                        <div className="col-sm-10">
                            <Select
                                options={Constants.servers} value={this.state.serverId}
                                placeholder="" searchable={false} clearable={false}
                                onChange={this.onChangeServer.bind(this)}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <label className="col-sm-2">卡池</label>
                        <div className="col-sm-10">
                            <Select
                                options={this.pools} value={this.state.poolId}
                                placeholder="" searchable={false} clearable={false}
                                onChange={this.onChangePool.bind(this)}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <label className="col-sm-2">类别</label>
                        <div className="col-sm-10">
                            <button type="button"
                                    className={"btn " + (this.state.cardType === Constants.CARD_TYPE_SERVANT && this.state.cardStar === Constants.CARD_STAR_5 ? "btn-primary" : "btn-default")}
                                    onClick={() => this.onChangeCardType(Constants.CARD_TYPE_SERVANT, Constants.CARD_STAR_5)}>
                                五星从者
                                <span className="rate">{rateServant5} %</span>
                            </button>
                            <button type="button"
                                    className={"btn " + (this.state.cardType === Constants.CARD_TYPE_SERVANT && this.state.cardStar === Constants.CARD_STAR_4 ? "btn-primary" : "btn-default")}
                                    onClick={() => this.onChangeCardType(Constants.CARD_TYPE_SERVANT, Constants.CARD_STAR_4)}>
                                四星从者
                                <span className="rate">{rateServant4} %</span>
                            </button>
                            <button type="button"
                                    className={"btn " + (this.state.cardType === Constants.CARD_TYPE_CRAFT_ESSENCES && this.state.cardStar === Constants.CARD_STAR_5 ? "btn-primary" : "btn-default")}
                                    onClick={() => this.onChangeCardType(Constants.CARD_TYPE_CRAFT_ESSENCES, Constants.CARD_STAR_5)}>
                                五星礼装
                                <span className="rate">{rateEquip5} %</span>
                            </button>
                            <button type="button"
                                    className={"btn " + (this.state.cardType === Constants.CARD_TYPE_CRAFT_ESSENCES && this.state.cardStar === Constants.CARD_STAR_4 ? "btn-primary" : "btn-default")}
                                    onClick={() => this.onChangeCardType(Constants.CARD_TYPE_CRAFT_ESSENCES, Constants.CARD_STAR_4)}>
                                四星礼装
                                <span className="rate">{rateEquip4} %</span>
                            </button>
                        </div>
                    </div>
                </form>
                <div className="stats_cards">
                    {stats}
                </div>
            </div>
        );
    }

    onChangeServer (option) {
        this.setState({serverId: option.value});
    }

    onChangePool (option) {
        this.setState({poolId: option.value});
    }

    onChangeCardType (cardType, cardStar) {
        this.setState({cardType: cardType, cardStar: cardStar});
    }

    getPoolList () {
        const pools = [];
        this.props.cardPools.forEach((pool) => {
                pools.push({value: pool.id, label: pool.name});
        });

        const defaultPoolId = pools.length > 0 ? pools[0].value : null;

        return [pools, defaultPoolId];
    }

    getStats (serverId, poolId, cardType, cardStar) {
        if (!(serverId in this.props.stats)) return [0, [], []];
        const serverStats = this.props.stats[serverId];

        if (!(poolId in serverStats)) return [0, [], []];
        const poolStats = serverStats[poolId];

        const cards = [];
        Object.keys(poolStats['cards'] || {}).forEach((id) => {
            const card = poolStats['cards'][id];
            if (card['type'] === cardType && card['star'] === cardStar)
                cards.push(card);
        });

        cards.sort(function (lhs, rhs) {
            return rhs['rate'] - lhs['rate'];
        });

        return [poolStats['drawingCnt'], poolStats['cardCounts'], cards];
    }
}


// Events //////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Functions ///////////////////////////////////////////////////////////////////////////////////////////////////////////

// Initializations /////////////////////////////////////////////////////////////////////////////////////////////////////

exports.Stats = Stats;
