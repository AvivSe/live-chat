import logo from './logo.svg';
import Chat from './Chat/Chat'
import './App.css';
import {gql, useQuery} from "@apollo/client";

const GET_ALL_USERS = gql`
    query  {
        getAllUsers{
            username,
            id,
            role
        }
    }
`

function App() {
    const {loading, error, data} = useQuery(GET_ALL_USERS);

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
            <Chat/>
        </div>
    );
}

export default App;
