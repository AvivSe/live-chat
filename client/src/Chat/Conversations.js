import {gql, useQuery} from "@apollo/client";
import styled from 'styled-components';

const GET_ALL_CONVERSATIONS_BY_USER_ID = gql`
    query getAllConversationsByUserId($id: String!){
        getAllConversationsByUserId(id: $id){
            id,
            support  { username, id },
            supportId,
            messages {id, content, date, userId, user { username }},
            customer  { username, id },
        }
    }
`

const Container = styled.div`
  height: 480px;
  overflow-y: scroll;
`
const Conversation = styled.div`
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

    return <Container>
        {data?.getAllConversationsByUserId.map(function (conversation) {
            conversation.messages = conversation.messages?.sort(({date}, {date: anotherDate}) => new Date(date) - new Date(anotherDate))
            return <Conversation key={conversation.id} onClick={() => onSelectConversation(conversation)}>
                {conversation.id}<br/>
                {(!conversation.messages || conversation.messages.length === 0) && "Empty Conversation"}
                {(!!conversation.messages && conversation.messages.length > 0) && <>
                    <div>{conversation.messages[0]?.content}</div>
                    <div>By {conversation.messages[0]?.user.username} on {new Date(conversation.messages[0].date).toLocaleString()}</div>
                </>}
            </Conversation>
        })}
    </Container>
}

export default Conversations;
