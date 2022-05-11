import React, { useState, useEffect, useCallback } from "react";

function Meme({ imgs }) {
  //console.log(imgs.length);
  const[effectTrigger, setEffectTrigger] = useState(true);
  //const[topText, setTopText] = useState("");
  //const[bottomText, setBottomText] = useState("");
  const[textContents, setTextContents] = useState([]);  

  const[currImg, setCurrImg] = useState(null);
  const[currImgBase64, setCurrImgBase64] = useState("");
  const[imgDisplay, setImgDisplay] = useState({});
  
  const[imgRef, setImgRef] = useState("");
  //const[svgRef, setSvgRef] = useState("");
  const[moveStateIdx, setMoveStateIdx] = useState(-1);

  const addInput = function() {
    const newInput = {
      content: "",
      x: `50%`,
      y: `${textContents.length * 5 + 10}%`
    };
    setTextContents(prevTextContents => [...prevTextContents, newInput]);
    console.log(textContents.length);
  }

  const updateText = function(index, newText) {
    const updatedTextContents = [...textContents];
    updatedTextContents[index].content = newText;
    setTextContents(updatedTextContents);
  }

  const updateCoords = function(index, x, y) {
    const updatedTextContents = [...textContents];
    console.log(updatedTextContents[index].x);
    updatedTextContents[index].x = x;
    updatedTextContents[index].y = y;
    setTextContents(updatedTextContents);
  }

  const getStateObj = function(e, index) {
    let rect = imgRef.getBoundingClientRect();
    let xOffset = e.clientX - rect.left;
    let yOffset = e.clientY - rect.top;
    if (xOffset < 0) {
      xOffset = 0;
    }
    if (xOffset > rect.width) {
      xOffset = rect.width;
    }
    if (yOffset < 0) {
      yOffset = 0;
    }
    if (yOffset > rect.height) {
      yOffset = rect.height;
    }
    const stateObj = {
      index: index,
      x: `${xOffset}px`,
      y: `${yOffset}px`
    };
    return stateObj;
  }

  const handleMouseMove = useCallback((e) => {
    //Object.keys(moveStateObj).length == 0;
    if (moveStateIdx > -1) {
      const stateObj = getStateObj(e, moveStateIdx);
      updateCoords(moveStateIdx, stateObj.x, stateObj.y);
    }
  }, [moveStateIdx]);

  const handleMouseDown = function(e, index) {
    const stateObj = getStateObj(e, index);
    document.addEventListener('mousemove', handleMouseMove);
    setMoveStateIdx(index);
    updateCoords(index, stateObj.x, stateObj.y);
  }

  const handleMouseUp = function(e, index) { 
    document.removeEventListener('mousemove', handleMouseMove);
    setMoveStateIdx(-1);
  }

  // this shit still don't work so I'm just gonna use the regular url and come back to this
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
    const svg = document.getElementById("main_svg");
    //console.log(document.getElementById("main_svg"));
    let svgData = new XMLSerializer().serializeToString(svg);
    console.log(svgData);
    const canvas = document.createElement("canvas");
    canvas.setAttribute("id", "canvas");
    const svgSize = svg.getBoundingClientRect();
    canvas.width = svgSize.width;
    canvas.height = svgSize.height;
    const img = document.createElement("img");
    img.setAttribute("src", "data:image/svg+xml;base64," + btoa(decodeURIComponent(encodeURIComponent(svgData))));
    img.onload = function() {
      canvas.getContext("2d").drawImage(img, 0, 0);
      const canvasData = canvas.toDataURL("image/jpg");
      const a = document.createElement("a");
      a.download = "meme.jpg";
      a.href = canvasData;
      document.body.appendChild(a);
      a.click();
    };
    //img.setAttribute("src", "data:image/svg+xml;base64," + btoa(svgData));
  }

  const generateMeme = function() {
    const randNum = Math.floor(Math.random() * imgs.length);
    const randImg = imgs[randNum];
    setTextContents([]);
    setImgDisplayWrapper(randImg.width, randImg.height);
    setCurrImgBase64Wrapper(randImg);
    setCurrImg(randImg);
  }

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
          ref={el => { setImgRef(el) }}
          width={imgDisplay.width}
          height={imgDisplay.height}
          xlinkHref={currImg.url}
        />
        { textContents.map((obj, index) => (
          <text
            key={index}
            style={{ 
              zIndex: moveStateIdx == index ? 0 : index + 1 
            }}
            x={obj.x}
            y={obj.y}
            dominantBaseline="middle"
            textAnchor="middle"
            onMouseDown={(e) => handleMouseDown(e, index)}
            onMouseUp={(e) => handleMouseUp(e, index)}
          >
            {obj.content}
          </text>
        )) }
      </svg>
      }
      <div className="meme-form">
        { textContents.map((obj, index) => (
          <input
            key={index}
            type="text"
            name={`input-${index}`}
            placeholder="Text"
            value={obj.content}
            onChange={e => updateText(index, e.target.value)}
          />
        )) }
        <button onClick={() => addInput()}>+</button>
        <button onClick={() => downloadMeme()}>Download</button>
        <button onClick={() => setEffectTrigger(!effectTrigger)}>New</button>
      </div>
    </div>
  );
}

export default Meme;
