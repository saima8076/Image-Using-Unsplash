import React, { useState, useRef } from "react";
import axios from "axios";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import "./App.css";

function ImageEditor() {
  const [imageUrl, setImageUrl] = useState("");
  const [textInputs, setTextInputs] = useState([]);
  const textInputRef = useRef(null);
  const [fontSize, setFontSize] = useState(16); // Initial font size

  const fetchImage = async () => {
    try {
      const response = await axios.get("https://source.unsplash.com/random");
      setImageUrl(response.request.responseURL);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  const handleAddText = () => {
    const newText = textInputRef.current.value;
    if (newText) {
      setTextInputs([
        ...textInputs,
        {
          text: newText,
          position: { x: 50, y: 50 },
          size: { width: 150, height: 50 },
        },
      ]);
      textInputRef.current.value = "";
    }
  };

  const handleDrag = (index, _, { x, y }) => {
    const updatedTextInputs = [...textInputs];
    updatedTextInputs[index].position.x = x;
    updatedTextInputs[index].position.y = y;
    setTextInputs(updatedTextInputs);
  };

  const handleResize = (index, _, { width, height }) => {
    const updatedTextInputs = [...textInputs];
    updatedTextInputs[index].size.width = width;
    updatedTextInputs[index].size.height = height;
    setTextInputs(updatedTextInputs);
  };

  const increaseFontSize = () => {
    setFontSize(fontSize + 2); // Increase font size by 2px (adjust as needed)
  };

  const decreaseFontSize = () => {
    setFontSize(fontSize - 2); // Decrease font size by 2px (adjust as needed)
  };

  return (
    <div className="App">
      <h1>Image Overlay App</h1>
      <button onClick={fetchImage}>Fetch Image</button>
      {imageUrl && <img src={imageUrl} alt="Fetched" />}

      <div className="button-container">
        {textInputs.map((textInput, index) => (
          <Draggable
            key={index}
            onDrag={(e, data) => handleDrag(index, e, data)}
            position={textInput.position}
          >
            <ResizableBox
              width={textInput.size.width}
              height={textInput.size.height}
              onResize={(e, data) => handleResize(index, e, data)}
            >
              <div className="text-box" style={{ fontSize: `${fontSize}px` }}>
                {textInput.text}
              </div>
            </ResizableBox>
          </Draggable>
        ))}

        <input type="text" ref={textInputRef} placeholder="Enter text" />
        <button onClick={handleAddText}>Add Text</button>
        <button onClick={increaseFontSize}>Increase Font Size</button>
        <button onClick={decreaseFontSize}>Decrease Font Size</button>
      </div>
    </div>
  );
}

export default ImageEditor;
