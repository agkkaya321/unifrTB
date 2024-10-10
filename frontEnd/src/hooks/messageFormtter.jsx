const formatMessage = (type, content) => {
  return JSON.stringify({ type, content });
};

export default formatMessage;
