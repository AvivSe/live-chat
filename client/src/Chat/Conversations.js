import {useApolloClient, useQuery} from "@apollo/client";
import styled from 'styled-components';
import {useEffect, useState} from "react";
import {GET_ALL_CONVERSATIONS_BY_USER_ID, SUBSCRIBE_CONVERSATION, SUBSCRIBE_NEW_CONVERSATION} from "../api/queries";

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
    const {error, data} = useQuery(GET_ALL_CONVERSATIONS_BY_USER_ID, {
        variables: {id: user.id},
        fetchPolicy: "no-cache"
    });
    const [conversations, setConversations] = useState({});
    const client = useApolloClient();

    function onNewMessage(response) {
        const newMessage = response.data.newMessage;
        setConversations(conversations => {
            conversations[newMessage.conversationId].messages = [...conversations[newMessage.conversationId].messages, newMessage];
            return {...conversations};
        });
    }

    useEffect(function () {
        if (!error && data) {
            const conversations = data.getAllConversationsByUserId.reduce(function (prev, current) {
                current.messages = current.messages?.sort(({date}, {date: anotherDate}) => new Date(date) - new Date(anotherDate));
                prev[current.id] = current;
                return prev;
            }, {});

            setConversations(conversations);

            const conversationObservers = [];
            Object.keys(conversations).forEach(conversationId => {
                const conversationObserver = client.subscribe({
                    query: SUBSCRIBE_CONVERSATION,
                    variables: {conversationId}
                }).subscribe(onNewMessage);
                conversationObservers.push(conversationObserver);
            })

            return function () {
                conversationObservers.forEach(observer => observer.unsubscribe());
            }
        }
    }, [data, error, user, client]);

    useEffect(function () {
        const newConversationObserver = client.subscribe({
            query: SUBSCRIBE_NEW_CONVERSATION,
            variables: {userId: user.id}
        }).subscribe(response => {
            console.log(response);
            setConversations(conversations => ({
                ...conversations,
                [response.data.newConversation.id]: response.data.newConversation
            }));

            client.subscribe({
                query: SUBSCRIBE_CONVERSATION,
                variables: {conversationId: response.data.newConversation.id}
            }).subscribe(onNewMessage);

        })
        return function () {
            newConversationObserver.unsubscribe();
        }
    }, [client, user.id]);

    const sortedConversations = Object.values(conversations).filter(conversation => conversation.messages?.length > 0).map(conversation => {
        conversation.messages = conversation.messages.sort(({date}, {date: anotherDate}) => new Date(date) - new Date(anotherDate));
        return conversation;
    }).sort((conversation, anotherConversation) => {
        const date = new Date(conversation.messages[conversation.messages.length - 1].date);
        const anotherDate = new Date(anotherConversation.messages[anotherConversation.messages.length - 1].date);
        return anotherDate - date;
    });

    return <Container>
        {Object.values(sortedConversations).map(function (conversation, i) {
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
