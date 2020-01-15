import * as React from "react";
import {ICard} from '../models/ICard'
import {GameActions, GameContext} from './Game'

export interface CardProps {
    card: ICard;
    context: GameContext;
    actions: GameActions;
}

export class Card extends React.Component<CardProps, {}> {

    select = () => {
        this.props.actions.selectCard(this.props.card.id);
    };

    deselect = () => {
        this.props.actions.deselectCard();
    };

    actionButton() {
        if (!this.props.context.activeCardId) {
            return <button onClick={this.select}>
                Move
            </button>;
        }

        if (this.props.context.activeCardId === this.props.card.id) {
            return <button onClick={this.deselect}>
                Cancel
            </button>;
        }

        return;
    }

    render() {
        return <div>
            Card {this.props.card.id}
            {this.actionButton()}
        </div>;
    }
}
