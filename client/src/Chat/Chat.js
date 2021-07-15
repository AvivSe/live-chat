import styled from 'styled-components';
import {useState} from "react";
import Button from '@material-ui/core/Button';
import CreateIcon from '@material-ui/icons/Create';
import ChatBubbleOutline from '@material-ui/icons/ChatBubbleOutline';
import CloseIcon from '@material-ui/icons/Close';

import {Grow, IconButton} from "@material-ui/core";

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
  }
`

const ChatButton = styled(Button)`
  border-radius: 128px !important;
  width: 64px;
  height: 64px;
`

function Chat() {

    const [open, setOpen] = useState(false);

    function toggleChatBox() {
        setOpen(prev => !prev);
    }

    console.log("open", open)
    return <Container>
        <Grow in={open}>
            <ChatBox>
                <header>
                    <h3>Conversations</h3>
                    <IconButton><CreateIcon style={{color: 'white'}}/></IconButton>
                </header>
            </ChatBox>
        </Grow>
        <ChatButton color={'secondary'} variant={'contained'} onClick={toggleChatBox}>{open ? <CloseIcon/> :
            <ChatBubbleOutline/>}
        </ChatButton>
    </Container>;
}

export default Chat;
