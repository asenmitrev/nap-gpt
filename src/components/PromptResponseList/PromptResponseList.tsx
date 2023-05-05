import { FC, useRef } from "react";
import ChatGptImg from "../../img/chatgpt.png";
import MyImg from "../../img/me.png";
import { ResponseInterface } from "./response-interface";
import "./PromptResponseList.css";
import ReactMarkdown from "react-markdown";

interface PromptResponseListProps {
  responseList: ResponseInterface[];
}

const PromptResponseList: FC<PromptResponseListProps> = ({ responseList }) => {
  const responseListRef = useRef<HTMLDivElement>(null);

  return (
    <div className="prompt-response-list" ref={responseListRef}>
      {responseList.map((responseData) => (
        <div
          className={
            "response-container " +
            (responseData.selfFlag ? "my-question" : "chatgpt-response")
          }
          key={responseData.id}
        >
          <img
            className="avatar-image"
            src={responseData.selfFlag ? MyImg : ChatGptImg}
            alt="avatar"
          />
          <div
            className={
              (responseData.error ? "error-response " : "") + "prompt-content"
            }
            id={responseData.id}
          >
            <pre>
              <ReactMarkdown children={responseData.response?.trim() ?? ""} />
            </pre>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PromptResponseList;
