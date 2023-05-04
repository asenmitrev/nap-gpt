import { useState, useEffect } from "react";
import PromptInput from "../PromptInput/PromptInput";
import "./App.css";
import { ResponseInterface } from "../PromptResponseList/response-interface";
import PromptResponseList from "../PromptResponseList/PromptResponseList";

const BestAnswer = ["Тук", "не", "е", "информация!"];
const firstAnswer = [
  "Здравейте!",
  "Аз",
  "съм",
  "езиковият",
  "модел",
  "на",
  "НАП",
  "и",
  "съм",
  "вашият",
  "ИИ",
  "асистент",
  "днес.",
  "Трениран",
  "съм",
  "на",
  "милиарди",
  "въпроси",
  "към",
  "служители",
  "на",
  "НАП",
  "и",
  "техните",
  "отговори.",
  "Как",
  "мога",
  "да",
  "ви",
  "бъда",
  "полезен?",
];
const obedna = [
  "В",
  "обедна",
  "почивка",
  "сме",
  "от",
  "12:00ч.",
  "до",
  "14:00ч.",
  "Моля",
  "заповядайте",
  "по-късно.",
];

const App = () => {
  const [responseList, setResponseList] = useState<ResponseInterface[]>([]);
  const [prompt, setPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const generateUniqueId = () => {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
  };
  useEffect(() => {
    getGPTResult("", firstAnswer);
  }, []);

  const delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const addResponse = (selfFlag: boolean, response?: string) => {
    const uid = generateUniqueId();
    setResponseList((prevResponses) => [
      ...prevResponses,
      {
        id: uid,
        response,
        selfFlag,
      },
    ]);
    return uid;
  };

  const updateResponse = (
    uid: string,
    updatedObject: Record<string, unknown>
  ) => {
    setResponseList((prevResponses) => {
      const updatedList = [...prevResponses];
      const index = prevResponses.findIndex((response) => response.id === uid);
      if (index > -1) {
        updatedList[index] = {
          ...updatedList[index],
          ...updatedObject,
        };
      }
      return updatedList;
    });
  };

  const getGPTResult = async (prompt: string, answer: string[]) => {
    if (isLoading) return;
    setIsLoading(true);

    // Clear the prompt input
    setPrompt("");

    let uniqueId: string;
    // Add the self prompt to the response list
    prompt && addResponse(true, prompt.replace(/(<br>)+$/, '').replace(/<br><br>/g, '\n\r'));
    uniqueId = addResponse(false);
    await delay(50);

    try {
      let responseSoFar = "";
      for (const word of answer) {
        responseSoFar += ` ${word}`;
        await delay(200);
        updateResponse(uniqueId, {
          response: responseSoFar,
        });
      }
    } catch (err) {
    } finally {
      // Clear the loader interval
      setIsLoading(false);
    }
  };

  const sendAnswer = (prompt: string) => {
    if (new Date().getHours() === 12 || new Date().getHours() === 13) {
      getGPTResult(prompt, obedna);
    } else {
      getGPTResult(prompt, BestAnswer);
    }
  };

  return (
    <div className="App">
      <div id="response-list">
        <PromptResponseList responseList={responseList} key="response-list" />
      </div>
      <div id="input-container">
        <PromptInput
          prompt={prompt}
          onSubmit={() => sendAnswer(prompt)}
          key="prompt-input"
          updatePrompt={(prompt) => setPrompt(prompt)}
        />
        <button
          id="submit-button"
          disabled={isLoading}
          className={isLoading ? "loading" : ""}
          onClick={() => sendAnswer(prompt)}
        ></button>
      </div>
    </div>
  );
};

export default App;
