import { useEffect, useState } from "react";
import { random } from "lodash/fp";
import "./App.css";
import axios from "axios";

const AIRTABLE_API_BASE_URL = "https://api.airtable.com/v0";
const TABLE_ID = "tblB1clQaecNCzA5j";
const APP_ID = "appgZMAf1Cy056FeT";

function App() {
  const [searchable, setSearchable] = useState(true);
  const [incorrect, setIncorrect] = useState(false);
  const [word, setWord] = useState([]);
  const [words, setWords] = useState([]);
  useEffect(() => {
    (async () => {
      const {
        data: { records },
      } = await axios.request({
        method: "get",
        url: `${AIRTABLE_API_BASE_URL}/${APP_ID}/${TABLE_ID}`,
        // params: {
        // fields: ["id", "chinese", "kanji", "kana"],
        // sort: [{ field: "id", direction: "asc" }],
        // },
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_TOKEN}`,
        },
      });
      const words = records.map(({ fields }) => fields);
      setWords(words);
      console.log(words);
      setWord(words[random(0, words.length - 1)]);
      console.log(word);
      setIncorrect(false);
    })();
  }, []);
  const onSearchCompositionStart = (e) => {
    setSearchable(false);
  };
  const onSearchCompositionEnd = (e) => {
    setSearchable(true);
  };
  return (
    <div className="App">
      <div>{word?.chinese}</div>
      {incorrect && <div>{word?.kanji}</div>}
      <input
        onCompositionStart={onSearchCompositionStart}
        onCompositionEnd={onSearchCompositionEnd}
        onKeyDown={(e) => {
          if (searchable) {
            if (e?.code === "Enter" || e?.keyCode === 13) {
              if (
                e.target.value === word.kanji ||
                e.target.value === word.kana
              ) {
                setWord(words[random(0, words.length - 1)]);
                setIncorrect(false);
                e.target.value = "";
              } else {
                setIncorrect(true);
              }
            }
          }
        }}
      ></input>
    </div>
  );
}

export default App;
