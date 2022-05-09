import React, { useState, useEffect } from "react";

function Meme({ imgs }) {
  //console.log(imgs.length);
  const[effectTrigger, setEffectTrigger] = useState(true);
  const[topText, setTopText] = useState("");
  const[bottomText, setBottomText] = useState("");
  
  const[currImg, setCurrImg] = useState(null);
  const[currImgBase64, setCurrImgBase64] = useState("");
  const[imgDisplay, setImgDisplay] = useState({});

  const getBase64Image = function(img) {
    const baseImage = new Image();
    baseImage.crossOrigin = "anonymous";
    baseImage.src = img.url;
    baseImage.width = img.width;
    baseImage.height = img.height;
    console.log(baseImage);
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    console.log(canvas);
    const context = canvas.getContext("2d");
    context.drawImage(baseImage, 0, 0);
    console.log(context);
    const dataURL = canvas.toDataURL("image/png");
    return dataURL;
  }

  const setCurrImgBase64Wrapper = function(img) {
    const base64 = getBase64Image(img); //.replace(/^data:image\/(png|jpg);base64,/, "");
    if (currImgBase64 !== base64) {
      setCurrImgBase64(base64);
    }
  }

  const setImgDisplayWrapper = function(defaultWidth, defaultHeight) {
    let newWidth = 400;
    let newHeight = newWidth * (defaultHeight / defaultWidth);
    while (newWidth > window.innerWidth - 100 || newHeight > window.innerHeight - 100) {
      newWidth *= 0.95;
      newHeight = newWidth * (defaultHeight / defaultWidth);
    }
    setImgDisplay({ width: newWidth, height: newHeight });
  }

  const downloadMeme = function() {
    
  }

  const generateMeme = function() {
    const randNum = Math.floor(Math.random() * imgs.length);
    const randImg = imgs[randNum];
    setImgDisplayWrapper(randImg.width, randImg.height);
    setCurrImgBase64Wrapper(randImg);
    setCurrImg(randImg);
  }

  /*const handleSubmit = function() {
    generateMeme();
  }*/

  // runs only the first render
  useEffect(() => {
    generateMeme();
    console.log("meme mounted");
    return() => {
      setCurrImg(null);
    }
  }, [effectTrigger]);

  return(
    <div className="container-meme">
      {currImg && 
      <svg
        width={imgDisplay.width}
        id="main_svg"
        height={imgDisplay.height}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <image 
          width={imgDisplay.width}
          height={imgDisplay.height}
          xlinkHref={currImg.url}
        />
        <text
          x="50%"
          y="10%"
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {topText}
        </text>
        <text
          x="50%"
          y="90%"
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {bottomText}
        </text>
      </svg>
      }
      <form className="meme-form">
        <input
          type="text"
          name="topText"
          placeholder="Top Text"
          value={topText}
          onChange={(e) => setTopText(e.target.value)}
        />
        <input
          type="text"
          name="bottomText"
          placeholder="Bottom Text"
          value={bottomText}
          onChange={(e) => setBottomText(e.target.value)}
        />
        <button onClick={() => downloadMeme()}>Download</button>
        <button onClick={() => setEffectTrigger(!effectTrigger)}>New</button>
      </form>
    </div>
  );
}

export default Meme;
