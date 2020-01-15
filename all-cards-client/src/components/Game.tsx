import * as React from "react";
import {Stack} from './Stack'
import {GameService} from '../services/GameService'
import {IStack} from '../models/IStack'

export interface GameProps {
    id: string;
}

export interface GameState {
    stacks: Array<IStack>;
    intervalIsSet: NodeJS.Timeout | undefined;
    context: GameContext;
}

export interface GameContext {
    activeCardId: string | undefined;
}

export interface GameActions {
    selectCard: (cardId: string) => void;
    deselectCard: () => void;
    selectStack: (stackId: string) => void;
}

export class Game extends React.Component<GameProps, GameState> {

    state =
        {
            stacks: [],
            intervalIsSet: undefined,
            context: {
                activeCardId: undefined,
            },
        };

    actions: GameActions = {
        selectCard: (cardId: string) => {
            this.setState({context:{activeCardId: cardId}});
        },
        deselectCard: () => {
            this.setState({context:{activeCardId: undefined}});
        },
        selectStack: (stackId: string) => {
            if (this.state.context.activeCardId) {
                GameService.moveCard(this.props.id, this.state.context.activeCardId || '', stackId);
                this.setState({context: {activeCardId: undefined}});
            }
        },
    }

    getGameState = () => {
        GameService.getStacks(this.props.id).then((stacks: Array<IStack>) => this.setState({stacks: stacks}));
    };



    componentDidMount() {
        this.getGameState();
        if (!this.state.intervalIsSet) {
            let interval = setInterval(this.getGameState, 1000);
            this.setState({intervalIsSet: interval});
        }
    }

    componentWillUnmount() {
        if (this.state.intervalIsSet) {
            clearInterval(this.state.intervalIsSet);
            this.setState({intervalIsSet: undefined});
        }
    }


    render() {
        if (!this.state.stacks) {
            return <div>Error</div>
        }
        return <div>
            <h1>Game {this.props.id}</h1>
            {this.state.stacks.map((stack: IStack) => <Stack key={stack.id} stack={stack} actions={this.actions} context={this.state.context}/>)}
        </div>;
    }
}
