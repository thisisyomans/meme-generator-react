import React, { useState, useEffect } from "react";
import Meme from "./Meme";

function Generator() {
  const[imgs, setImgs] = useState(null);

  // runs only the first render
  useEffect(() => {
    fetch("https://api.imgflip.com/get_memes")
      .then(response => {
        return response.json()
      })
      .then(response => {
        const { memes } = response.data;
        setImgs(memes);
      });
  }, []);
  
  return(
    <>
      {imgs && <Meme imgs={imgs} />}
    </>
  );
}

export default Generator;
