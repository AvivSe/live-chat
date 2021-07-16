import {useApolloClient, useQuery} from "@apollo/client";
import styled from 'styled-components';
import {useEffect, useState} from "react";
import {GET_ALL_CONVERSATIONS_BY_USER_ID, SUBSCRIBE_CONVERSATION} from "../api/queries";

const Container = styled.div`
  height: 480px;
  overflow-y: scroll;
`
const ConversationDetails = styled.div`
  margin-bottom: 10px;
  border-bottom: 1px solid lightpink;
  padding: 10px 0;
  cursor: pointer;
`

function Conversations({user, onSelectConversation}) {
    const {loading, error, data} = useQuery(GET_ALL_CONVERSATIONS_BY_USER_ID, {
        variables: {id: user.id},
        fetchPolicy: "no-cache"
    });
    const [conversations, setConversations] = useState({});
    const client = useApolloClient();

    useEffect(function () {
        if (!error && data) {
            const conversations = data.getAllConversationsByUserId.reduce(function (prev, current) {
                current.messages = current.messages?.sort(({date}, {date: anotherDate}) => new Date(date) - new Date(anotherDate));
                prev[current.id] = current;
                return prev;
            }, {});
            setConversations(conversations);
        }
    }, [data, error]);

    useEffect(function () {
        const conversationObservers = [];
        console.log("test1");
        Object.keys(conversations).forEach(conversationId => {
            const conversationObserver = client.subscribe({
                query: SUBSCRIBE_CONVERSATION,
                variables: {conversationId}
            }).subscribe(response => {
                const newMessage = response.data.newMessage;
                console.log("newMessage", newMessage);
                if(!conversations[newMessage.conversationId]) {
                    conversations[newMessage.conversationId] = { messages: [], id: newMessage.conversationId, customer: newMessage.user}
                }
                conversations[newMessage.conversationId].messages = [...conversations[newMessage.conversationId].messages, newMessage];
                setConversations({...conversations});
            });
            conversationObservers.push(conversationObserver);
        })

        return function () {
            console.log("test2");
            conversationObservers.forEach(observer => observer.unsubscribe());
        }

    }, [client, user]);

    const sortedConversations = Object.values(conversations).filter(conversation => conversation.messages?.length > 0).map(conversation => {
        conversation.messages = conversation.messages.sort(({date}, {date: anotherDate}) => new Date(date) - new Date(anotherDate));
        return conversation;
    }).sort((conversation, anotherConversation) => {
        const date = new Date(conversation.messages[conversation.messages.length - 1].date);
        const anotherDate = new Date(anotherConversation.messages[anotherConversation.messages.length - 1].date);
        return anotherDate - date;
    });

    return <Container>
        {Object.values(sortedConversations).map(function (conversation) {
            conversation.messages = conversation.messages?.sort(({date}, {date: anotherDate}) => new Date(date) - new Date(anotherDate));
            const lastMessage = conversation.messages[conversation.messages.length - 1];
            return <ConversationDetails key={conversation.id} onClick={() => onSelectConversation(conversation)}>
                {conversation.id}<br/>
                {!lastMessage && "Empty Conversation"}
                {lastMessage && <>
                    <div>{lastMessage.content}</div>
                    <div>By {lastMessage.user.username} on {new Date(lastMessage.date).toLocaleString()}</div>
                </>}
            </ConversationDetails>
        })}
    </Container>
}

export default Conversations;
