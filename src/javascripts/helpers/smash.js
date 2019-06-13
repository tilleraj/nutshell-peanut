const messagesWithUserInfo = (messages, users) => {
  const messagesWithUserInfoArray = [];
  messages.forEach((message) => {
    const newMessage = message;
    users.forEach((user) => {
      if (message.uid === user.uid) {
        newMessage.userName = user.name;
        newMessage.userImage = user.image;
      }
    });
    messagesWithUserInfoArray.push(newMessage);
  });
  return messagesWithUserInfoArray;
};

export default { messagesWithUserInfo };
