// Requirements ////////////////////////////////////////////////////////////////////////////////////////////////////////

const $ = require('jquery');
const React = require('react');

const noty = require('bundles/kazefgostatscarddrawing/js/common/noty.js');
const actions = require('bundles/kazefgostatscarddrawing/js/common/actions.js')('kazefgostatscarddrawing');
const trans = require('bundles/kazefgostatscarddrawing/js/common/translator.js')('kazefgostatscarddrawing');

import {Constants} from './constants.js'
import {RecordUnit} from './RecordUnit.jsx'
import {ChooseCard} from './ChooseCard.jsx'


// Definitions /////////////////////////////////////////////////////////////////////////////////////////////////////////

// React ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
            units.push(<RecordUnit
                key={id}
                unitId={id}
                unitState={this.props.units[id]}
                removeUnit={this.props.removeUnit}
                changeUnitType={this.props.changeUnitType}
                cards={this.props.cards}
                switchChooseCardDialog={this.onSwitchChooseCardDialog.bind(this)}
                removeAward={this.props.removeAward}
            />);
        });

        return (
            <div className="simple_units">
                <label className="col-sm-2">抽卡记录</label>
                <div className="col-sm-10 units">
                    {units}
                </div>
                <div className="col-sm-2"></div>
                <div className="col-sm-10 append_unit">
                    <button type="button" className="btn btn-default"
                            onClick={() => this.props.addUnit(Constants.UNIT_TYPE_ONE_TIME)}
                    >添加单抽记录</button>
                    <button type="button" className="btn btn-default"
                            onClick={() => this.props.addUnit(Constants.UNIT_TYPE_TEN_TIMES)}
                    >添加十连记录</button>
                </div>
                <ChooseCard
                    cards={this.props.cards}
                    show={this.state.showChooseCardDialog}
                    switchChooseCardDialog={this.onSwitchChooseCardDialog.bind(this)}
                    setCard={this.setCard.bind(this)}
                />
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


// Events //////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Functions ///////////////////////////////////////////////////////////////////////////////////////////////////////////

// Initializations /////////////////////////////////////////////////////////////////////////////////////////////////////

exports.RecordUnits = RecordUnits;
