import styled from 'styled-components';


const Container = styled.div`
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  align-items: ${({isCustomerMessage})=>isCustomerMessage ? 'flex-start': 'flex-end'};

  .messageContent {
    background-color: ${({isCustomerMessage})=>isCustomerMessage ? 'rgba(245, 0, 87, 0.2)': 'rgba(245, 0, 87, 0.6)'};
    border-radius: ${({isCustomerMessage})=>isCustomerMessage ? '0 14px 14px 14px': '14px 0 14px 14px'};
    padding: 10px;
    width: fit-content;
    overflow-wrap: break-word;
  }
  
  .title {
    font-size: .8em;
    font-weight: 600;
  }
  
  .date {
    font-size: .8em;
  }

`

function Message({message, conversation}) {
    const customer = conversation.customer;
    const isCustomerMessage = message.userId === customer.id;

    return <Container isCustomerMessage={isCustomerMessage}>
        <div className={'title'}>{message.user.username}</div>
        <div className={'messageContent'}>{message.content}</div>
        <div className={'date'}>{new Date(message.date).toLocaleString()}</div>
    </Container>
}

export default Message;
