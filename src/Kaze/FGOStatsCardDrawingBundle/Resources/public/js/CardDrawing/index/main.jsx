// Requirements ////////////////////////////////////////////////////////////////////////////////////////////////////////

const $ = require('jquery');
require('bootstrap');
const moment = require('moment');
require('moment/locale/zh-cn');
const React = require('react');
const ReactDOM = require('react-dom');
const Select = require('react-select');
require('react-select/dist/react-select.css');
const Datetime =require('react-datetime');
require('react-datetime/css/react-datetime.css');
require('animate.css');

const noty = require('bundles/kazefgostatscarddrawing/js/common/noty.js');
const actions = require('bundles/kazefgostatscarddrawing/js/common/actions.js')('kazefgostatscarddrawing');
const trans = require('bundles/kazefgostatscarddrawing/js/common/translator.js')('kazefgostatscarddrawing');
require('bundles/kazefgostatscarddrawing/css/CardDrawing/index.scss');


// Definitions /////////////////////////////////////////////////////////////////////////////////////////////////////////

const UNIT_TYPE_ONE_TIME = '1';
const UNIT_TYPE_TEN_TIMES = '2';
const CARD_TYPE_SERVANT = '1';
const CARD_TYPE_CRAFT_ESSENCES = '2';
const CARD_TYPE_FIRE = '3';
const CARD_TYPE_FUU = '4';
const CARD_STAR_1 = '1';
const CARD_STAR_2 = '2';
const CARD_STAR_3 = '3';
const CARD_STAR_4 = '4';
const CARD_STAR_5 = '5';
const UNKNOWN_CARD_URL = '/bundles/kazefgostatscarddrawing/images/unknown_card.png';

const defaultServerId = '1';
const defaultDrawingTime = moment();
const defaultPoolId = null;

let card_pools = [];
let cards = {};


// React ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

class RecordForm extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            visible: true,
            simple: true,
            serverId: defaultServerId,
            drawingTime: defaultDrawingTime,
            poolId: defaultPoolId,
            units: {0: createUnitState(UNIT_TYPE_ONE_TIME)},
            maxUnitId: 0,
            pools: []
        };

        this.servers = [
            {value: '1', label: 'B站（安卓）'},
            {value: '2', label: 'B站（iOS）'},
            {value: '3', label: '九游'},
            {value: '4', label: '百度'},
            {value: '5', label: '豌豆荚'}
        ];
    }

    reset (visible) {
        if (typeof visible === 'undefined') visible = true;

        const state = {
            visible: visible,
            simple: this.state.simple,
            serverId: defaultServerId,
            drawingTime: defaultDrawingTime,
            poolId: defaultPoolId,
            units: {0: createUnitState(UNIT_TYPE_ONE_TIME)},
            maxUnitId: 0,
            pools: []
        };

        this.setState(state);
    }

    render () {
        if (!this.state.visible) return;

        return (
            <form role="form">
                <div className="row">
                    <label className="col-sm-2">服务器</label>
                    <div className="col-sm-10">
                        <Select
                            options={this.servers} value={this.state.serverId}
                            placeholder="" searchable={false} clearable={false}
                            onChange={this.onChangeServer.bind(this)}
                        />
                    </div>
                </div>
                <div  className="row">
                    <label className="col-sm-2">抽卡时间</label>
                    <div className="col-sm-10">
                        <Datetime
                            value={this.state.drawingTime}
                            dateFormat="YYYY-MM-DD" timeFormat="HH:mm"
                            viewMode="time"
                            onChange={this.onChangeDrawingTime.bind(this)}
                        />
                    </div>
                </div>
                <div className="row">
                    <label className="col-sm-2">卡池</label>
                    <div className="col-sm-10">
                        <Select
                            options={this.state.pools} value={this.state.poolId}
                            placeholder="" searchable={false} clearable={false}
                            onChange={this.onChangePool.bind(this)}
                        />
                    </div>
                </div>
                <div className="row">
                    <RecordUnits units={this.state.units}
                                 addUnit={this.onAddUnit.bind(this)}
                                 removeUnit={this.onRemoveUnit.bind(this)}
                                 changeUnitType={this.onChangeUnitType.bind(this)}
                                 setCard={this.onChosenCard.bind(this)}/>
                </div>
                <div className="submit">
                    <button type="button" className="btn btn-primary" onClick={this.onSubmit.bind(this)}>提交记录</button>
                </div>
            </form>
        );
    }

    componentDidMount () {
        // const thisNode = $(ReactDOM.findDOMNode(this));
        getCardPools(this);
    }

    onChangeServer (option) {
        this.setState({serverId: option.value});
    }

    onChangeDrawingTime (drawingTime) {
        if (typeof drawingTime === 'string') drawingTime = moment(drawingTime);

        const result = this.getPoolList(drawingTime);

        this.setState({drawingTime: drawingTime, pools: result[0], poolId: result[1]});
    }

    updatePoolList () {
        this.onChangeDrawingTime(this.state.drawingTime);
    }

    onChangePool (option) {
        this.setState({poolId: option.value});
    }

    onAddUnit (type) {
        const maxUnitId = this.state.maxUnitId + 1;
        const units = this.state.units;
        units[maxUnitId] = createUnitState(type);

        this.setState({units: units, maxUnitId: maxUnitId});
    }

    onRemoveUnit (id) {
        const units = this.state.units;
        delete units[id];

        this.setState({units: units});
    }

    onChangeUnitType (id, type) {
        const units = this.state.units;
        const firstAward = units[id]['awards'][0];
        units[id] = createUnitState(type);
        units[id]['awards'][0] = firstAward;

        this.setState({units: units});
    }

    onChosenCard (unitId, awardId, cardId) {
        const units = this.state.units;
        units[unitId]['awards'][awardId] = cardId;

        this.setState({units: units});
    }

    onSubmit () {
        const units = [];
        Object.keys(this.state.units).forEach((i) => {
            const unit = this.state.units[i];
            unit.costCharms = 0;
            unit.costFreeStones = unit.awards.length * 3;
            unit.costPaidStones = 0;
            units.push(unit);
        });

        const data = {
            serverId: this.state.serverId,
            drawingTime: this.state.drawingTime.format('YYYY-MM-DD HH:mm:ss'),
            poolId: this.state.poolId,
            masterLevel: null,
            units: units
        };

        submit(data, this);
    }

    getPoolList (drawingTime) {
        const pools = [];
        card_pools.forEach((pool) => {
            if ((pool.beginTime === null || moment(pool.beginTime).isBefore(drawingTime)) &&
                (pool.endTime === null || moment(pool.endTime).isAfter(drawingTime)))
                pools.push({value: pool.id, label: pool.name});
        });

        const defaultPoolId = pools.length > 0 ? pools[0].value : null;

        return [pools, defaultPoolId];
    }
}


class RecordUnits extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            showChooseCardDialog: false,
            currUnitId: null,
            currAwardId: null
        };
    }

    render () {
        const units = [];
        Object.keys(this.props.units).forEach((id) => {
            units.push(<RecordUnit key={id}
                                   unitId={id}
                                   unitState={this.props.units[id]}
                                   removeUnit={this.props.removeUnit}
                                   changeUnitType={this.props.changeUnitType}
                                   switchChooseCardDialog={this.onSwitchChooseCardDialog.bind(this)}/>);
        });

        return (
            <div className="simple_units">
                <label className="col-sm-2">抽卡记录</label>
                <div className="col-sm-10 units">
                    {units}
                </div>
                <div className="col-sm-2"></div>
                <div className="col-sm-10 append_unit">
                    <button type="button" className="btn btn-default" onClick={() => this.props.addUnit(UNIT_TYPE_ONE_TIME)}>添加单抽记录</button>
                    <button type="button" className="btn btn-default" onClick={() => this.props.addUnit(UNIT_TYPE_TEN_TIMES)}>添加十连记录</button>
                </div>
                <ChooseCard show={this.state.showChooseCardDialog}
                            switchChooseCardDialog={this.onSwitchChooseCardDialog.bind(this)}
                            setCard={this.setCard.bind(this)}/>
            </div>
        );
    }

    onSwitchChooseCardDialog (show, unitId, awardId) {
        this.setState({
            showChooseCardDialog: show,
            currUnitId: unitId,
            currAwardId: awardId,
        });
    }

    setCard (cardId) {
        this.props.setCard(this.state.currUnitId, this.state.currAwardId, cardId);
    }
}


class RecordUnit extends React.Component {
    constructor (props) {
        super(props);

        this.types = [
            {value: UNIT_TYPE_ONE_TIME, label: '单抽'},
            {value: UNIT_TYPE_TEN_TIMES, label: '十连'}
        ];
    }

    render () {
        const awards = [];
        if (this.props.unitState.type === UNIT_TYPE_ONE_TIME)
            awards.push(<Award key="0"
                               unitId={this.props.unitId}
                               awardId="0"
                               cardId={this.props.unitState.awards[0]}
                               switchChooseCardDialog={this.props.switchChooseCardDialog}/>);
        else if (this.props.unitState.type === UNIT_TYPE_TEN_TIMES)
            for (let i = 0; i < 10; ++i)
                awards.push(<Award key={i}
                                   unitId={this.props.unitId}
                                   awardId={i}
                                   cardId={this.props.unitState.awards[i]}
                                   switchChooseCardDialog={this.props.switchChooseCardDialog}/>);

        return (
            <div className="unit">
                <div className="options">
                    <Select
                        options={this.types} value={this.props.unitState.type}
                        placeholder="" searchable={false} clearable={false}
                        onChange={this.onChangeType.bind(this)}
                    />
                    <div className="remove" onClick={() => this.props.removeUnit(this.props.unitId)}>
                        <i className="fa fa-minus-circle"/>
                    </div>
                </div>
                <div className="awards">
                    {awards}
                </div>
            </div>
        );
    }

    onChangeType (option) {
        this.props.changeUnitType(this.props.unitId, option.value);
    }
}


class Award extends React.Component {
    constructor (props) {
        super(props);
        this.onChooseCard = this.onChooseCard.bind(this);
    }

    render () {
        const card = createAwardState(this.props.cardId);

        return (
            <div className="award" onClick={this.onChooseCard}>
                <img src={card.cardUrl}/>
            </div>
        );
    }

    onChooseCard () {
        this.props.switchChooseCardDialog(true, this.props.unitId, this.props.awardId);
    }
}


class ChooseCard extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            type: CARD_TYPE_SERVANT,
            star: CARD_STAR_5,
            cards: this.getCards(CARD_TYPE_SERVANT, CARD_STAR_5),
        };

        this.onSelectType = this.onSelectType.bind(this);
        this.onSelectStar = this.onSelectStar.bind(this);
    }

    render () {
        const _cards = [];
        this.state.cards.forEach((card) => {
            _cards.push(<Card key={card.id}
                              cardId={card.id}
                              cardUrl={card.url}
                              chooseCard={this.chooseCard.bind(this)}/>);
        });

        return (
            <div className="choose_card_wrapper" data-show={this.props.show}>
                <div className="choose_card">
                    <div className="card_type">
                        <button type="button"
                                className={"btn " + (this.state.type === CARD_TYPE_SERVANT ? "btn-primary" : "btn-default")}
                                onClick={() => this.onSelectType(CARD_TYPE_SERVANT)}>从者</button>
                        <button type="button"
                                className={"btn " + (this.state.type === CARD_TYPE_CRAFT_ESSENCES ? "btn-primary" : "btn-default")}
                                onClick={() => this.onSelectType(CARD_TYPE_CRAFT_ESSENCES)}>概念礼装</button>
                    </div>
                    <div className="card_star">
                        <button type="button"
                                className={"btn " + (this.state.star === CARD_STAR_5 ? "btn-primary" : "btn-default")}
                                onClick={() => this.onSelectStar(CARD_STAR_5)}>五星</button>
                        <button type="button"
                                className={"btn " + (this.state.star === CARD_STAR_4 ? "btn-primary" : "btn-default")}
                                onClick={() => this.onSelectStar(CARD_STAR_4)}>四星</button>
                        <button type="button"
                                className={"btn " + (this.state.star === CARD_STAR_3 ? "btn-primary" : "btn-default")}
                                onClick={() => this.onSelectStar(CARD_STAR_3)}>三星</button>
                    </div>
                    <div className="close" onClick={this.onClose.bind(this)}>&times;</div>
                    <div className="cards">
                        {_cards}
                    </div>
                </div>
            </div>
        );
    }

    chooseCard (cardId) {
        this.props.setCard(cardId);
        this.onClose();
    }

    onSelectType (type) {
        this.setState({
            type: type,
            cards: this.getCards(type, this.state.star)
        });
    }

    onSelectStar (star) {
        this.setState({
            star: star,
            cards: this.getCards(this.state.type, star)
        });
    }

    onClose () {
        this.props.switchChooseCardDialog(false, null, null);
    }

    getCards(type, star) {
        const _cards = [];
        Object.keys(cards).forEach((id) => {
            const card = cards[id];
            if ((type === null || card.type === type) &&
                (star === null || card.star === star))
                _cards.push(card);
        });

        return _cards;
    }
}


class Card extends React.Component {
    constructor (props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    render () {
        return (
            <div className="card" onClick={this.onClick}>
                <img src={this.props.cardUrl}/>
            </div>
        );
    }

    onClick () {
        this.props.chooseCard(this.props.cardId);
    }
}


// Events //////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Functions ///////////////////////////////////////////////////////////////////////////////////////////////////////////

function createUnitState(type) {
    if (type === UNIT_TYPE_ONE_TIME)
        return {type: type, awards: [null]};
    else if (type === UNIT_TYPE_TEN_TIMES)
        return {type: type, awards: [null, null, null, null, null, null, null, null, null, null]};
}


function createAwardState(cardId) {
    if (Object.keys(cards).length === 0) {
        if (__DEV__) console.error('Card list has not been loaded');
        return {cardId: null, cardUrl: UNKNOWN_CARD_URL};
    }
    if (cardId === null || cardId <= 0 || cardId >= Object.keys(cards).length)
        return {cardId: null, cardUrl: UNKNOWN_CARD_URL};
    else
        return {cardId: cardId, cardUrl: cards[cardId].url};
}


function getCardPools(formComponent) {
    $.ajax({
        url: actions('FGOStatsCardDrawing.CardDrawing.get_card_pools'),
        type: 'GET',
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
            // if (__DEV__) console.log('get_card_pools success: ' + textStatus + ', ' + JSON.stringify(data));

            if (data['resultStatus'] && data['resultStatus'] === true && data['result'] && data['result']['result']) {
                if (__DEV__) console.log('get_card_pools success, count:' + data['result']['result'].length);
                const cardPools = data['result']['result'];
                setCardPools(cardPools);
                formComponent.updatePoolList();
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
                const cardList = data['result']['result'];
                setCards(cardList);
                ReactDOM.render(<RecordForm />, $('#record_form')[0]);
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


function submit(data, formComponent) {
    $.ajax({
        url: actions('FGOStatsCardDrawing.CardDrawing.create'),
        type: 'POST',
        data: data,
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
            // if (__DEV__) console.log('submit success: ' + textStatus + ', ' + JSON.stringify(data));

            if (data['resultStatus'] && data['resultStatus'] === true && data['result'] && data['result']['groupId']) {
                if (__DEV__) console.log('submit success, groupId:' + data['result']['groupId']);
                formComponent.reset(false);
                noty('提交抽卡记录成功！', 'success');
            }
            else if (data['resultDisplayMsg']) {
                if (__DEV__) console.log('submit failed, with display message');
                noty('提交抽卡记录失败: ' + data['resultDisplayMsg'], 'error');
            }
            else {
                if (__DEV__) console.log('submit failed, without display message');
                noty('提交抽卡记录失败', 'error');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (__DEV__) console.log('submit error: state: ' + textStatus + ', error: ' + errorThrown);
            noty('提交抽卡记录失败', 'error');
        }
    });
}


function setCards(cardList) {
    cardList.forEach((card) => {
        cards[card.id] = card;
    });
}


function setCardPools(cardPools) {
    card_pools = cardPools;
    card_pools.reverse();
}


// Initializations /////////////////////////////////////////////////////////////////////////////////////////////////////

getCards();
