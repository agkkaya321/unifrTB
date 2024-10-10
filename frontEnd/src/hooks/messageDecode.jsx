const msgDecode = (message) => {
  const { type, content } = message;
  let decodedContent;

  switch (type) {
    case "nbJoueur":
      try {
        decodedContent = JSON.parse(content);
        if (!Array.isArray(decodedContent)) {
          console.error("Content is not an array:", decodedContent);
          decodedContent = [];
        }
      } catch (error) {
        console.error("Error parsing content:", error);
        decodedContent = [];
      }
      //console.log("decoded content: " + content);
      break;
    case "questionsRound":
      try {
        decodedContent = JSON.parse(content);
        if (!Array.isArray(decodedContent)) {
          console.error("Content is not an array:", decodedContent);
          decodedContent = [];
        }
      } catch (error) {
        console.error("Error parsing content:", error);
        decodedContent = [];
      }
      break;
    case "question":
      try {
        decodedContent = JSON.parse(content);
      } catch (error) {
        console.error("Error parsing content:", error);
        decodedContent = [];
      }
      break;
    default:
      decodedContent = content;
      break;
  }
  return { type, content: decodedContent };
};

export default msgDecode;
