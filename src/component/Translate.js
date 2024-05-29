import React, { useEffect, useState } from "react";
import countries from "../data";
import Speech from "./Speech";

const Translate = () => {
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    const fromText = document.querySelector(".from-text");
    const toText = document.querySelector(".to-text");
    const exchangeIcon = document.querySelector(".exchange");
    const selectTag = document.querySelectorAll("select");
    const icons = document.querySelectorAll(".row i");
    const translateBtn = document.querySelector("button");

    // Populate language options in the select elements
    selectTag.forEach((tag, id) => {
      for (let country_code in countries) {
        let selected =
          id === 0
            ? country_code === "en-GB"
              ? "selected"
              : ""
            : country_code === "hi-IN"
            ? "selected"
            : "";
        let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", option);
      }
    });

    // Add event listener for exchange icon to swap text and languages
    exchangeIcon.addEventListener("click", () => {
      // Swap values of text areas
      let tempText = fromText.value;
      fromText.value = toText.value;
      toText.value = tempText;

      // Swap values of select elements
      let tempLang = selectTag[0].value;
      selectTag[0].value = selectTag[1].value;
      selectTag[1].value = tempLang;
    });

    // Clear the translation text if the input text is cleared
    fromText.addEventListener("keyup", () => {
      if (!fromText.value) {
        toText.value = "";
      }
    });

    // Add event listener for the translate button to fetch translation
    translateBtn.addEventListener("click", () => {
      let text = fromText.value.trim();
      let translateFrom = selectTag[0].value;
      let translateTo = selectTag[1].value;
      if (!text) return;
      toText.setAttribute("placeholder", "Translating...");
      let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
      fetch(apiUrl)
        .then((res) => res.json())
        .then((data) => {
          toText.value = data.responseData.translatedText;
          data.matches.forEach((data) => {
            if (data.id === 0) {
              toText.value = data.translation;
            }
          });
          toText.setAttribute("placeholder", "Translation");
        });
    });

    // Add event listeners for copy and speech icons
    icons.forEach((icon) => {
      icon.addEventListener("click", ({ target }) => {
        if (target.classList.contains("fa-copy")) {
          if (target.id === "from") {
            navigator.clipboard.writeText(fromText.value);
          } else {
            navigator.clipboard.writeText(toText.value);
          }
        } else if (target.classList.contains("fa-volume-up")) {
          let utterance;
          if (target.id === "from") {
            utterance = new SpeechSynthesisUtterance(fromText.value);
            utterance.lang = selectTag[0].value;
          } else {
            utterance = new SpeechSynthesisUtterance(toText.value);
            utterance.lang = selectTag[1].value;
          }
          speechSynthesis.speak(utterance);
        }
      });
    });
  }, []);

  // Update the input text area when transcript changes
  useEffect(() => {
    const fromText = document.querySelector(".from-text");
    fromText.value = transcript;
  }, [transcript]);

  return (
    <div className="container">
      <div className="wrapper">
        <div className="text-input">
          <textarea
            spellCheck="false"
            className="from-text"
            placeholder="Enter Text"
          ></textarea>
          <textarea
            readOnly
            spellCheck="false"
            className="to-text"
            placeholder="Translating..."
          ></textarea>
        </div>
        <ul className="controls">
          <li className="row from">
            <div className="icons">
              <i id="from" className="fas fa-volume-up"></i>
              <i id="from" className="fas fa-copy"></i>
            </div>
            <select></select>
          </li>
          <li className="exchange">
            <i className="fas fa-exchange-alt" />
          </li>
          <li className="row to">
            <select></select>
            <div className="icons">
              <i id="to" className="fas fa-volume-up" />
              <i id="to" className="fas fa-copy" />
            </div>
          </li>
        </ul>
      </div>
      <button>Translate</button>
      <Speech onTranscriptChange={setTranscript} />
    </div>
  );
};

export default Translate;
