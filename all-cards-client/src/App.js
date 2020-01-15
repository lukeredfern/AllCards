import React, {Component} from 'react';
import axios from 'axios';
import {Stack} from "./components/Stack";

class App extends Component {
    // initialize our state
    state = {
        data: {},
        id: 0,
        message: null,
        intervalIsSet: false,
        idToDelete: null,
        idToUpdate: null,
        objectToUpdate: null,
    };

    // when component mounts, first thing it does is fetch all existing data in our db
    // then we incorporate a polling logic so that we can easily see if our db has
    // changed and implement those changes into our UI
    componentDidMount() {
        this.getGameState();
        if (!this.state.intervalIsSet) {
            let interval = setInterval(this.getGameState, 1000);
            this.setState({intervalIsSet: interval});
        }
    }

    // never let a process live forever
    // always kill a process everytime we are done using it
    componentWillUnmount() {
        if (this.state.intervalIsSet) {
            clearInterval(this.state.intervalIsSet);
            this.setState({intervalIsSet: null});
        }
    }

    // just a note, here, in the front end, we use the id key of our data object
    // in order to identify which we want to Update or delete.
    // for our back end, we use the object id assigned by MongoDB to modify
    // data base entries

    // our first get method that uses our backend api to
    // fetch data from our data base
    getGameState = () => {
        fetch('http://localhost:3001/game/state/12345')
            .then((data) => data.json())
            .then((res) => this.setState({data: res}));
    };

    // our put method that uses our backend api
    // to create new query into our data base
    putDataToDB = (message) => {
        let currentIds = this.state.data.map((data) => data.id);
        let idToBeAdded = 0;
        while (currentIds.includes(idToBeAdded)) {
            ++idToBeAdded;
        }

        axios.post('http://localhost:3001/api/putData', {
            id: idToBeAdded,
            message: message,
        });
    };

    // our delete method that uses our backend api
    // to remove existing database information
    deleteFromDB = (idTodelete) => {
        parseInt(idTodelete);
        let objIdToDelete = null;
        this.state.data.forEach((dat) => {
            if (dat.id == idTodelete) {
                objIdToDelete = dat._id;
            }
        });

        axios.delete('http://localhost:3001/api/deleteData', {
            data: {
                id: objIdToDelete,
            },
        });
    };

    // our update method that uses our backend api
    // to overwrite existing data base information
    updateDB = (idToUpdate, updateToApply) => {
        let objIdToUpdate = null;
        parseInt(idToUpdate);
        this.state.data.forEach((dat) => {
            if (dat.id == idToUpdate) {
                objIdToUpdate = dat._id;
            }
        });

        axios.post('http://localhost:3001/api/updateData', {
            id: objIdToUpdate,
            update: {message: updateToApply},
        });
    };

    // here is our UI
    // it is easy to understand their functions when you
    // see them render into our screen
    render() {
        const {data} = this.state;
        console.log(this.state);
        let stacks = [];
        if (data.hasOwnProperty('stacks')) {
            for (var i = 0; i < data.stacks.length; i++) {
                // note: we add a key prop here to allow react to uniquely identify each
                // element in this array. see: https://reactjs.org/docs/lists-and-keys.html
                stacks.push(<li>
                    {data.stacks[i].id}
                    <Stack id={data.stacks[i].id} />
                </li>);
            }
        }
        return (
            <div>
                <h1>
                    Game: {data ? data.id : 'unknown'}
                </h1>
                {stacks}
            </div>
        );
    }
}

export default App;
