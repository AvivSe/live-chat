import styled from 'styled-components';
import {IconButton, Input} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import {useEffect, useRef, useState} from "react";
import Message from "./Message";
import {useApolloClient, useMutation, useSubscription} from "@apollo/client";
import {SEND_MESSAGE, SUBSCRIBE_CONVERSATION} from "../api/queries";

const Container = styled.div`

  .content {
    height: 420px;
    overflow-y: scroll;
    overflow-wrap: break-word;
    padding-right: 10px;

  }

  footer {
    height: 80px;
    text-align: center;
  }

  input {
    font-size: 1.2em;
    width: 300px;
  }

  .send {
    svg {
      transform: rotate(-50deg);
      fill: #f50057;
    }
  }
`

function Conversation({conversation, user}) {
    const [value, setValue] = useState('');
    const [messages, setMessages] = useState(conversation.messages || []);
    const [sendMessage] = useMutation(SEND_MESSAGE);
    const client = useApolloClient();

    useEffect(function () {
        const conversationObserver = client.subscribe({
            query: SUBSCRIBE_CONVERSATION,
            variables: {conversationId: conversation.id}
        }).subscribe(response => {
            if (response.data) {
                setMessages(prev => [...prev, response.data.newMessage]);
            }
        });
        return function () {
            conversationObserver.unsubscribe();
        }
    }, [client]);

    const contentRef = useRef();
    const isValid = value.length > 0;

    function handleChange(e) {
        setValue(e.target.value);
    }

    async function handleSubmit() {
        if (isValid) {
            const {data} = await sendMessage({
                variables: {
                    sendMessageDto: {
                        userId: user.id,
                        conversationId: conversation.id,
                        content: value
                    }
                }
            });
            setValue('');
        }
    }

    function handleKeyPress(e) {
        if (e.charCode === 13) {
            handleSubmit();
        }
    }

    useEffect(function () {
        const div = contentRef.current;
        div.scrollTop = div?.scrollHeight - div?.clientHeight;

    }, [messages])

    return <Container>
        <div className={'content'} ref={contentRef}>
            {messages.map(function (message) {
                return <Message key={message.id} message={message} conversation={conversation}/>;
            })}
        </div>
        <footer>
            <Input onChange={handleChange} onKeyPress={handleKeyPress} value={value} color={'secondary'} autoFocus/>
            <IconButton className={'send'} onClick={handleSubmit} disabled={!isValid}><SendIcon/></IconButton>
        </footer>
    </Container>;
}

export default Conversation;
