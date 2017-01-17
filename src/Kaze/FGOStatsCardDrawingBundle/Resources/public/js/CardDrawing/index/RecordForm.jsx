// Requirements ////////////////////////////////////////////////////////////////////////////////////////////////////////

const $ = require('jquery');
const React = require('react');
const moment = require('moment');
require('moment/locale/zh-cn');
const Select = require('react-select');
require('react-select/dist/react-select.css');
const Datetime =require('react-datetime');
require('react-datetime/css/react-datetime.css');

const noty = require('bundles/kazefgostatscarddrawing/js/common/noty.js');
const actions = require('bundles/kazefgostatscarddrawing/js/common/actions.js')('kazefgostatscarddrawing');
const trans = require('bundles/kazefgostatscarddrawing/js/common/translator.js')('kazefgostatscarddrawing');

import {Constants} from './constants.js'
import {RecordUnits} from './RecordUnits.jsx'


// Definitions /////////////////////////////////////////////////////////////////////////////////////////////////////////

// React ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

class RecordForm extends React.Component {
    /**
     * @param props object      {cards: {}, cardPools: [], onRecordsSubmitted: callback}
     */
    constructor (props) {
        super(props);

        this.state = {
            simple: true,
            serverId: Constants.defaultServerId,
            drawingTime: Constants.defaultDrawingTime,
            poolId: Constants.defaultPoolId,
            units: {0: createUnitState(Constants.UNIT_TYPE_ONE_TIME)},
            maxUnitId: 0,
            currPools: []
        };
    }

    reset () {
        const state = {
            simple: this.state.simple,
            serverId: Constants.defaultServerId,
            drawingTime: Constants.defaultDrawingTime,
            poolId: Constants.defaultPoolId,
            units: {0: createUnitState(Constants.UNIT_TYPE_ONE_TIME)},
            maxUnitId: 0,
            currPools: []
        };

        this.setState(state);

        this.props.onRecordsSubmitted();
    }

    render () {
        return (
            <form role="form" className="record_form">
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
                            options={this.state.currPools} value={this.state.poolId}
                            placeholder="" searchable={false} clearable={false}
                            onChange={this.onChangePool.bind(this)}
                        />
                    </div>
                </div>
                <div className="row">
                    <RecordUnits units={this.state.units}
                                 cards={this.props.cards}
                                 addUnit={this.onAddUnit.bind(this)}
                                 removeUnit={this.onRemoveUnit.bind(this)}
                                 changeUnitType={this.onChangeUnitType.bind(this)}
                                 setCard={this.onChosenCard.bind(this)}
                                 removeAward={this.onRemoveAward.bind(this)}/>
                </div>
                <div className="submit">
                    <button type="button" className="btn btn-primary" onClick={this.onSubmit.bind(this)}>提交记录</button>
                </div>
            </form>
        );
    }

    componentDidMount () {
        this.onChangeDrawingTime(this.state.drawingTime);
    }

    onChangeServer (option) {
        this.setState({serverId: option.value});
    }

    onChangeDrawingTime (drawingTime) {
        if (typeof drawingTime === 'string') drawingTime = moment(drawingTime);

        const result = this.getPoolList(drawingTime);

        this.setState({drawingTime: drawingTime, currPools: result[0], poolId: result[1]});
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

    onRemoveAward (unitId, awardId) {
        const units = this.state.units;
        units[unitId]['awards'][awardId] = null;

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
        const currPools = [];
        this.props.cardPools.forEach((pool) => {
            if ((pool.beginTime === null || moment(pool.beginTime).isBefore(drawingTime)) &&
                (pool.endTime === null || moment(pool.endTime).isAfter(drawingTime)))
                currPools.push({value: pool.id, label: pool.name});
        });

        const defaultPoolId = currPools.length > 0 ? currPools[0].value : null;

        return [currPools, defaultPoolId];
    }
}


// Events //////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Functions ///////////////////////////////////////////////////////////////////////////////////////////////////////////

function createUnitState(type) {
    if (type === Constants.UNIT_TYPE_ONE_TIME)
        return {type: type, awards: [null]};
    else if (type === Constants.UNIT_TYPE_TEN_TIMES)
        return {type: type, awards: [null, null, null, null, null, null, null, null, null, null]};
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
                noty('提交抽卡记录成功！即将进入统计页面……', 'success', 3000);
                setTimeout(function () {
                    formComponent.reset(false);
                }, 2000)
            }
            else if (data['resultDisplayMsg']) {
                if (__DEV__) console.log('submit failed, with display message');
                noty('提交抽卡记录失败: ' + data['resultDisplayMsg'], 'error', 3000);
            }
            else {
                if (__DEV__) console.log('submit failed, without display message');
                noty('提交抽卡记录失败', 'error', 3000);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (__DEV__) console.log('submit error: state: ' + textStatus + ', error: ' + errorThrown);
            noty('提交抽卡记录失败', 'error', 3000);
        }
    });
}


// Initializations /////////////////////////////////////////////////////////////////////////////////////////////////////

exports.RecordForm = RecordForm;
