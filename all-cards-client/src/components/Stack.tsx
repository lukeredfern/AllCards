import * as React from "react";
import {IStack} from '../models/IStack'
import {ICard} from '../models/ICard'
import {Card} from './Card'
import {GameActions, GameContext} from './Game'

export interface StackProps {
    stack: IStack;
    context: GameContext;
    actions: GameActions;
}

export class Stack extends React.Component<StackProps, {}> {

    selectStack = () => {
        this.props.actions.selectStack(this.props.stack.id);
    };

    actionButton() {
        if (this.props.context.activeCardId) {
            return <button onClick={this.selectStack}>
                Move card {this.props.context.activeCardId} here.
            </button>;
        }
        return;
    }

    render() {
        return <div>
            <h2>Stack {this.props.stack.id} {this.actionButton()}</h2>
            {
                this.props.stack.cards
                    .map((card: ICard) =>
                            <Card
                                key={card.id}
                                card={card}
                                actions={this.props.actions}
                                context={this.props.context}/>
                                )}
        </div>;
    }
}
