"use client";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [step, setStep] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [question, setQuestion] = useState("");

  const handleTextarea = (e: any) => setQuestion(e.target.value);

  const sanitize = (string: string) => {
    string = string.replace(/['"’‘“”]/g, '');
    if (string[string.length - 1] === '.') {
      string = string.slice(0, -1);
    }
    return string;
  } 

  const generateAnswer = async (event: any) => {
    setStep(1);
    setDisabled(true);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      question: sanitize(question),
    });

    var requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    try {
      const response = await fetch(
        "http://34.105.134.24:8080/api/bid/answer/question",
        requestOptions
      );
      const { answer } = await response.json();
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        file_name: sanitize(question).slice(0, 20),
        file_contents: `${sanitize(question)}\n\n${answer}`,
      });

      var requestOptions: RequestInit = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const fileResponse = await fetch(
        "http://34.105.134.24:8080/api/bid/save",
        requestOptions
      );
      const { location }: {location: string}  = await fileResponse.json();
      console.log('test', location);
      setStep(0);

    window.location.href = location;
    setDisabled(false);
    setQuestion('');
    } catch (e) {
      console.error(e); 
      setStep(2);
      setDisabled(false);
    }
  };
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between">
        <div className="header flex flex-row items-center">
          <a
            className="flex place-items-center"
            href="/"
            target="_self"
            rel="noopener noreferrer"
          >
            <Image
              src="/g4s-logo.png"
              alt="G4S Logo"
              className="logo"
              width={100}
              height={24}
              priority
            />
            <span className="logo-text">
              Bids
              <br />
              AI Assistant
            </span>
          </a>
        </div>
        <div className="content">
          {step === 0 && (
            <textarea
              name=""
              id=""
              rows={10}
              className="question"
              placeholder="How can I help you?"
              onChange={handleTextarea}
              value={question}
            ></textarea>
          )}
          {step === 1 && (
            <div className="state-container">
              <div className="state-wrapper">
                <div className="progress-bar">
                  <div className="progress-meter"></div>
                </div>
                <div className="state-message">
                  Please Wait, the AI Assistant is preparing an answer…
                </div>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="state-container">
              <div className="state-wrapper">
                <div className="error-sign" />
                <div className="state-message">
                  An unexpected error has occurred, please refresh the page and try again later.
                </div>
              </div>
            </div>
          )}

          <div className="future-actions-container">
            <button className="button upload" disabled >
              upload client data
            <Image
              src="/file.svg"
              alt="Upload client data"
              className="button-icon"
              width={25}
              height={25}
              priority
            />
            </button>
            <button className="button" disabled>
              add bid constraints
            <Image
              src="/chevron.svg"
              alt="add bid constraints"
              className="button-icon"
              width={25}
              height={25}
              priority
            />
            </button>
          </div>

          <div className="actions-container">
            <button className="button" disabled={disabled} onClick={generateAnswer}>
              generate answer
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
