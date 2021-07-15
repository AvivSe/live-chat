import styled from 'styled-components';
import {useState} from "react";
import Button from '@material-ui/core/Button';
import CreateIcon from '@material-ui/icons/Create';
import ChatBubbleOutline from '@material-ui/icons/ChatBubbleOutline';
import CloseIcon from '@material-ui/icons/Close';
import {useLocation} from 'react-router-dom';
import Conversation from './Conversation';
import {Grow, IconButton} from "@material-ui/core";
import Login from "./Login";
import Conversations from "./Conversations";
import ArrowBackIcon from '@material-ui/icons/NavigateBefore';
import {gql, useMutation} from "@apollo/client";

const Container = styled.div`
  position: absolute;
  bottom: 40px;
  right: 40px;
  text-align: right;
`

const ChatBox = styled.div`
  text-align: left;
  height: 600px;
  width: 400px;
  background-color: #ffffff;
  margin-bottom: 32px;
  border-radius: 16px;


  header {
    padding: 20px;
    background-color: #f50057;
    height: 48px;
    display: flex;
    color: white;
    justify-content: space-between;
    align-items: center;
    border-radius: 16px 16px 0 0;

    h3 {
      max-width: 200px;
      text-overflow: ellipsis;
    }
  }
`

const ChatButton = styled(Button)`
  border-radius: 128px !important;
  width: 64px;
  height: 64px;
`

const Content = styled.div`
  padding: 10px;
  height: 490px;
`
const Screens = {
    MAIN: "MAIN",
    CONVERSATION: "CONVERSATION",
}

const CREATE_CONVERSATION = gql`
    mutation  createConversation($createConversationDto: CreateConversationDto!) {
        createConversation(createConversationDto: $createConversationDto) {
            id,
            supportId,
            messages { id, date, content }
        }
    }
`

function Chat() {
    const [open, setOpen] = useState(false);
    const [screen, setScreen] = useState(Screens.MAIN);
    const [user, setUser] = useState(undefined);
    const [_createConversation, {data, error}] = useMutation(CREATE_CONVERSATION);
    const [selectedConversation, setSelectedConversation] = useState(undefined);

    const location = useLocation();
    const adminMode = location.pathname === '/admin';

    function navigateMainScreen() {
        setScreen(Screens.MAIN);
    }

    function toggleChatBox() {
        setOpen(prev => !prev);
    }

    function handleSelectConversation(conversation) {
        setSelectedConversation(conversation);
        setScreen(Screens.CONVERSATION);
    }
    function createConversation() {
        _createConversation({variables: {createConversationDto: {userId: user.id}}}).then(response => {
            handleSelectConversation(response.data?.createConversation);
        });
    }

    return <Container>
        <Grow in={open}>
            <ChatBox>
                <header>
                    {user ? <>
                        <div style={{display: "flex", height: '48px', alignItems: "center"}}>
                            {screen === Screens.CONVERSATION &&
                            <IconButton onClick={navigateMainScreen} style={{marginBottom: "-3px", marginRight: "3px"}}><ArrowBackIcon
                                style={{color: 'white'}}/></IconButton>}
                            <h3>Hello {user.username}</h3>
                        </div>
                        {!adminMode &&
                        <IconButton onClick={createConversation}><CreateIcon style={{color: 'white'}}/></IconButton>}
                    </> : <h3> Let's start </h3>}
                </header>
                <Content>
                    {!user && <Login adminMode={adminMode} setUser={setUser}/>}
                    {user && <>
                        {screen === Screens.CONVERSATION && selectedConversation && <Conversation user={user} conversation={selectedConversation}/>}
                        {screen === Screens.MAIN && <Conversations user={user} onSelectConversation={handleSelectConversation}/>}
                    </>}
                </Content>
            </ChatBox>
        </Grow>
        <ChatButton color={'secondary'} variant={'contained'} onClick={toggleChatBox}>{open ? <CloseIcon/> :
            <ChatBubbleOutline/>}
        </ChatButton>
    </Container>;
}

export default Chat;
