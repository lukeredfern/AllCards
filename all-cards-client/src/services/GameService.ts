import {IStack} from '../models/IStack'
import axios from 'axios'

export class GameService {

    public static getStacks(gameId: string): Promise<Array<IStack>> {
        return fetch('http://localhost:3001/game/' + gameId + '/state')
            .then((data) => data.json())
            .then((res) => res.stacks)
    }

    public static moveCard(gameId: string, cardId: string, stackId: string): void {
        axios.post('http://localhost:3001/game/' + gameId + '/move', {
            cardId: cardId,
            stackId: stackId,
        });
    }
}
