import {gql} from "@apollo/client";

export const CREATE_CONVERSATION = gql`
    mutation  createConversation($createConversationDto: CreateConversationDto!) {
        createConversation(createConversationDto: $createConversationDto) {
            id,
            customer { username, id }
            messages { id, date, content, user { username } }
        }
    }
`

export const SEND_MESSAGE = gql`
    mutation  sendMessage($sendMessageDto: SendMessageDto!) {
        sendMessage(sendMessageDto: $sendMessageDto) {
            id,
            userId,
            conversationId,
            content,
            date,
            user { username, id }
        }
    }
`

export const GET_ALL_CONVERSATIONS_BY_USER_ID = gql`
    query getAllConversationsByUserId($id: String!){
        getAllConversationsByUserId(id: $id){
            id,
            messages {id, content, date, userId, user { username }},
            customer  { username, id },
        }
    }
`

export const SUBSCRIBE_CONVERSATION = gql`
    subscription OnNewMessage($conversationId: String!) {
        newMessage(conversationId: $conversationId) {
            id,
            userId,
            conversationId,
            content,
            date,
            user { username, id }
        }
    }
`;
