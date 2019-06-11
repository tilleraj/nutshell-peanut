const messagesWithUserInfo = (messages, users) => {
  const messagesWithUserInfoArray = [];
  messages.forEach((message) => {
    users.forEach((user) => {
      if (message.uid === user.uid) {
        message.userName = user.name;
        message.userImage = user.image;
      }
    });
    messagesWithUserInfoArray.push(message);
  });
  return messagesWithUserInfoArray;
};

export default { messagesWithUserInfo };
