// Requirements ////////////////////////////////////////////////////////////////////////////////////////////////////////

const $ = require('jquery');
const React = require('react');

const noty = require('bundles/kazefgostatscarddrawing/js/common/noty.js');
const actions = require('bundles/kazefgostatscarddrawing/js/common/actions.js')('kazefgostatscarddrawing');
const trans = require('bundles/kazefgostatscarddrawing/js/common/translator.js')('kazefgostatscarddrawing');

import {Constants} from './constants.js'


// Definitions /////////////////////////////////////////////////////////////////////////////////////////////////////////

// React ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Award extends React.Component {
    constructor (props) {
        super(props);
        this.onChooseCard = this.onChooseCard.bind(this);
        this.onRemoveAward = this.onRemoveAward.bind(this);
    }

    render () {
        const card = createAwardState(this.props.cards, this.props.cardId);

        const reset = this.props.cardId ? (<i className="fa fa-times" onClick={this.onRemoveAward}/>) : null;

        return (
            <div className="award" onClick={this.onChooseCard}>
                <img src={card.cardUrl}/>
                {reset}
            </div>
        );
    }

    onRemoveAward (evt) {
        evt.stopPropagation();
        this.props.removeAward(this.props.unitId, this.props.awardId);
    }

    onChooseCard () {
        this.props.switchChooseCardDialog(true, this.props.unitId, this.props.awardId);
    }
}


// Events //////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Functions ///////////////////////////////////////////////////////////////////////////////////////////////////////////

function createAwardState(cards, cardId) {
    if (cardId === null || cardId <= 0 || cardId >= Object.keys(cards).length)
        return {cardId: null, cardUrl: Constants.UNKNOWN_CARD_URL};
    else
        return {cardId: cardId, cardUrl: cards[cardId].url};
}


// Initializations /////////////////////////////////////////////////////////////////////////////////////////////////////

exports.Award = Award;
