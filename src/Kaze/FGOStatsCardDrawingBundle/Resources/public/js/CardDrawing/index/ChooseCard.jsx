// Requirements ////////////////////////////////////////////////////////////////////////////////////////////////////////

const $ = require('jquery');
const React = require('react');

const noty = require('bundles/kazefgostatscarddrawing/js/common/noty.js');
const actions = require('bundles/kazefgostatscarddrawing/js/common/actions.js')('kazefgostatscarddrawing');
const trans = require('bundles/kazefgostatscarddrawing/js/common/translator.js')('kazefgostatscarddrawing');

import {Constants} from './constants.js'
import {Card} from './Card.jsx'


// Definitions /////////////////////////////////////////////////////////////////////////////////////////////////////////

// React ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

class ChooseCard extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            type: Constants.CARD_TYPE_SERVANT,
            star: Constants.CARD_STAR_5,
            cards: this.getCards(Constants.CARD_TYPE_SERVANT, Constants.CARD_STAR_5),
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
                                className={"btn " + (this.state.type === Constants.CARD_TYPE_SERVANT ? "btn-primary" : "btn-default")}
                                onClick={() => this.onSelectType(Constants.CARD_TYPE_SERVANT)}>从者</button>
                        <button type="button"
                                className={"btn " + (this.state.type === Constants.CARD_TYPE_CRAFT_ESSENCES ? "btn-primary" : "btn-default")}
                                onClick={() => this.onSelectType(Constants.CARD_TYPE_CRAFT_ESSENCES)}>概念礼装</button>
                    </div>
                    <div className="card_star">
                        <button type="button"
                                className={"btn " + (this.state.star === Constants.CARD_STAR_5 ? "btn-primary" : "btn-default")}
                                onClick={() => this.onSelectStar(Constants.CARD_STAR_5)}>五星</button>
                        <button type="button"
                                className={"btn " + (this.state.star === Constants.CARD_STAR_4 ? "btn-primary" : "btn-default")}
                                onClick={() => this.onSelectStar(Constants.CARD_STAR_4)}>四星</button>
                        <button type="button"
                                className={"btn " + (this.state.star === Constants.CARD_STAR_3 ? "btn-primary" : "btn-default")}
                                onClick={() => this.onSelectStar(Constants.CARD_STAR_3)}>三星</button>
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
        Object.keys(this.props.cards).forEach((id) => {
            const card = this.props.cards[id];
            if ((type === null || card.type === type) &&
                (star === null || card.star === star))
                _cards.push(card);
        });

        return _cards;
    }
}


// Events //////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Functions ///////////////////////////////////////////////////////////////////////////////////////////////////////////

// Initializations /////////////////////////////////////////////////////////////////////////////////////////////////////

exports.ChooseCard = ChooseCard;
