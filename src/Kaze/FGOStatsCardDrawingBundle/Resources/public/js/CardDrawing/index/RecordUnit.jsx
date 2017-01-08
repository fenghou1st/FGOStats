// Requirements ////////////////////////////////////////////////////////////////////////////////////////////////////////

const $ = require('jquery');
const React = require('react');
const Select = require('react-select');
require('react-select/dist/react-select.css');

const noty = require('bundles/kazefgostatscarddrawing/js/common/noty.js');
const actions = require('bundles/kazefgostatscarddrawing/js/common/actions.js')('kazefgostatscarddrawing');
const trans = require('bundles/kazefgostatscarddrawing/js/common/translator.js')('kazefgostatscarddrawing');

import {Constants} from './constants.js'
import {Award} from './Award.jsx'


// Definitions /////////////////////////////////////////////////////////////////////////////////////////////////////////

// React ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

class RecordUnit extends React.Component {
    constructor (props) {
        super(props);

        this.types = [
            {value: Constants.UNIT_TYPE_ONE_TIME, label: '单抽'},
            {value: Constants.UNIT_TYPE_TEN_TIMES, label: '十连'}
        ];
    }

    render () {
        const awards = [];
        if (this.props.unitState.type === Constants.UNIT_TYPE_ONE_TIME)
            awards.push(<Award key="0"
                               unitId={this.props.unitId}
                               awardId="0"
                               cardId={this.props.unitState.awards[0]}
                               cards={this.props.cards}
                               switchChooseCardDialog={this.props.switchChooseCardDialog}
                               removeAward={this.props.removeAward}/>);
        else if (this.props.unitState.type === Constants.UNIT_TYPE_TEN_TIMES)
            for (let i = 0; i < 10; ++i)
                awards.push(<Award key={i}
                                   unitId={this.props.unitId}
                                   awardId={i}
                                   cardId={this.props.unitState.awards[i]}
                                   cards={this.props.cards}
                                   switchChooseCardDialog={this.props.switchChooseCardDialog}
                                   removeAward={this.props.removeAward}/>);

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


// Events //////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Functions ///////////////////////////////////////////////////////////////////////////////////////////////////////////

// Initializations /////////////////////////////////////////////////////////////////////////////////////////////////////

exports.RecordUnit = RecordUnit;
