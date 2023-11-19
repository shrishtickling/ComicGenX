import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

// Define the ComicFormPage component
const ComicFormPage: React.FC = () => {
  const navigate = useNavigate();
  
  // State hooks for managing component state
  const [panelText, setPanelText] = useState(""); // Text entered by the user
  const [selectedPanel, setSelectedPanel] = useState<number | null>(null); // Selected panel for applying the generated image
  const [comicPanels, setComicPanels] = useState<string[]>(Array(10).fill("")); // Array to store comic panel images
  const [generatedImage, setGeneratedImage] = useState<string | null>(null); // URL of the generated image
  const [speechBubbleText, setSpeechBubbleText] = useState(""); // Text for the speech bubble
  const [showHowToUse, setShowHowToUse] = useState(false);

  // Effect hook to update the preview image when generatedImage changes
  useEffect(() => {
    // Get the preview image element
    const previewImage = document.getElementById("previewImage");

    if (previewImage) {
      // Display the generated image or an empty string
      previewImage.innerHTML = generatedImage
        ? `<img src="${generatedImage}" alt="Generated Preview" style="max-width: 100%; max-height: 100%;" />`
        : "";
    }
  }, [generatedImage]);

  // Function to fetch a generated comic image from the server
  const generateComic = async () => {
    try {
      // Fetch the generated image from the server
      const response = await fetch(
        "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
        {
          headers: {
            Accept: "image/png",
            Authorization:
              "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ inputs: panelText }),
        }
      );

      // Check if the response is OK
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Convert the response to a blob and create a URL for the image
      const result = await response.blob();
      const imageUrl = URL.createObjectURL(new Blob([result]));

      // Set the generated image URL in the state
      setGeneratedImage(imageUrl);
    } catch (error) {
      console.error("Error generating comic:", error);
    }
  };

  // Function to apply the generated image to the selected panel
  const applyToPanel = () => {
    if (selectedPanel !== null && generatedImage) {
      // Update the comicPanels state with the generated image applied to the selected panel
      setComicPanels((prevPanels) =>
        prevPanels.map((panel, index) =>
          index === selectedPanel ? generatedImage : panel
        )
      );

      // Reset state values after applying the image
      setGeneratedImage(null);
      setSelectedPanel(null);
      setPanelText("");
    }
  };

  // Function to clear all panels
  const clearPage = () => {
    setComicPanels(Array(10).fill(""));
  };

  // Function to go back to the homepage
  const goBack = () => {
    // Assuming your homepage is at the root path '/'
    navigate('/');
  };

  // JSX structure of the ComicFormPage component
  return (
    <div style={styles.container}>
      {/* Top buttons: How to Use, Clear Page, and Go Back */}
      <div style={styles.topButtons}>
        <button onClick={() => setShowHowToUse(true)} style={styles.topButton}>
          How to Use
        </button>
        <button onClick={clearPage} style={styles.topButton}>
          Clear Page
        </button>
        <button onClick={goBack} style={styles.topButton}>
          Go Back
        </button>
      </div>

      {/* Text input and generation controls */}
      <div style={styles.lefty}>
        <div style={styles.textPart}>
          <h2 style={styles.heading}>Enter Text for Comic</h2>
          <textarea
            id="panelText"
            rows={5}
            placeholder="Eg: Batman flying"
            value={panelText}
            onChange={(e) => setPanelText(e.target.value)}
            style={styles.textarea}
          />
          <input
            type="text"
            placeholder="Enter speech bubble text"
            value={speechBubbleText}
            onChange={(e) => setSpeechBubbleText(e.target.value)}
            style={styles.textInput}
          />
          <button type="button" onClick={generateComic} style={styles.button}>
            Generate Comic
          </button>
          <div
            id="previewImage"
            style={{ ...styles.previewImage, position: "relative" }}
          >
            {generatedImage && (
              <img
                src={generatedImage}
                alt="Generated Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  zIndex: 1,
                }}
              />
            )}
            {generatedImage && (
              <div
                className="speechBubble"
                style={{
                  position: "absolute",
                  top: "20%", // Adjust the top position as needed
                  left: "20%", // Adjust the left position as needed
                  backgroundColor: "#fff",
                  padding: "10px",
                  borderRadius: "10px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  zIndex: 2,
                }}
              >
                <p style={{ margin: 0 }}>{speechBubbleText}</p>
              </div>
            )}
          </div>
          <select
            id="selectPanel"
            value={selectedPanel !== null ? selectedPanel.toString() : ""}
            onChange={(e) => setSelectedPanel(parseInt(e.target.value, 10))}
            style={styles.select}
          >
            <option value="" disabled>
              Select Panel
            </option>
            {comicPanels.map((_, index) => (
              <option key={index} value={index}>
                Panel {index + 1}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={applyToPanel}
            style={styles.applyToPanelButton}
          >
            Apply to Panel
          </button>
        </div>
      </div>

      {/* Display generated comic panels and controls */}
      <div style={styles.comicPart}>
        <div style={styles.righty}>
          <h2 style={styles.heading}>Generated Comic</h2>
          <div style={styles.grid} id="comicPage">
            {comicPanels.map((image, index) => (
              <div key={index} style={styles.gridPanel}>
                <div style={styles.comicPanel}>
                  {image ? (
                    <>
                      <img
                        src={image}
                        alt={`Panel ${index + 1}`}
                        style={styles.comicPanelImage}
                      />
                    </>
                  ) : (
                    <div style={styles.comicPanelBox}>
                      <p style={styles.comicPanelBoxText}>Panel {index + 1}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={downloadComicPage}
            style={styles.downloadPageButton}
          >
            Download Comic Page
          </button>
        </div>
      </div>

      {/* How to Use Modal */}
      {showHowToUse && (
        <div style={styles.instructionsModal}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalHeading}>How to Use</h2>
            {/* Add your instructions here */}
            <p>1. Enter text for each comic panel.</p>
            <p>2. Click "Generate Comic" to generate images.</p>
            <p>3. Apply generated images to panels.</p>
            {/* ... add more instructions */}
            <button onClick={() => setShowHowToUse(false)} style={styles.closeButton}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Function to download the entire comic page
const downloadComicPage = () => {
  const comicPage = document.getElementById("comicPage");
  if (comicPage) {
    const link = document.createElement("a");
    const blob = new Blob([comicPage.outerHTML], { type: "text/html" });
    link.href = URL.createObjectURL(blob);
    link.download = "comic_page.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Styles object for component styling
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    width: "100vw",
    height: "100vh",
    position: "relative",
  },
  topButtons: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 2,
  },
  topButton: {
    backgroundColor: "#4caf50",
    color: "white",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    marginRight: "10px",
  },
  instructionsModal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "5px",
    textAlign: "left",
    maxWidth: "400px",
  },
  closeButton: {
    backgroundColor: "#ff9800",
    color: "white",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
  },
  howToUseButton: {
    backgroundColor: "#4caf50",
    color: "white",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
  },
  lefty: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    height: "100%",
    width: "30%",
    backgroundColor: "#e090df",
    gap: "1.5rem",
  },
  righty: {
    marginTop: "150px",
    backgroundColor: "#fbbede",
    padding: "20px",
  },
  textPart: {
    marginTop: "25px",
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    justifyContent: "center",
    alignContent: "center",
    gap: "20px",
    marginBottom: "30px",
  },
  comicPart: {
    flex: 1,
    backgroundColor: "#fbbede", // Background color for the righty part
  },
  heading: {
    fontSize: "24px",
    marginBottom: "20px",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
  },
  label: {
    display: "block",
    fontSize: "16px",
    marginBottom: "10px",
  },
  textarea: {
    fontSize: "16px",
    width: "100%",
    padding: "10px",
    marginBottom: "20px",
    border: "3px solid #000",
    borderRadius: "5px",
    height: "50px",
    lineHeight: "normal",
    color: "#282828",
    boxSizing: "border-box",
    userSelect: "auto",
    outline: "none",
  },
  textInput: {
    fontSize: "16px",
    width: "100%",
    padding: "10px",
    marginBottom: "20px",
    border: "3px solid #000",
    borderRadius: "5px",
    height: "50px",
    lineHeight: "normal",
    color: "#282828",
    boxSizing: "border-box",
    userSelect: "auto",
    outline: "none",
  },
  select: {
    width: "100%",
    padding: "10px",
    marginBottom: "20px",
    fontSize: "14px",
  },
  button: {
    backgroundColor: "#4caf50",
    color: "white",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    display: "block",
    margin: "0 auto",
  },
  grid: {
    display: "grid",
    alignItems: 'center',
    gridTemplateColumns: "repeat(5, 1fr)", // Adjusted to 5 columns
    gridTemplateRows: "repeat(2, 1fr)", // Added to specify 2 rows
    gap: "20px",
  },
  gridPanel: {
    position: "relative",
    marginBottom: "20px",
    height: "100%", // Added to fill the entire height of the grid cell
  },
  comicPanel: {
    position: "relative",
    height: "100%", // Added to fill the entire height of the grid cell
  },
  comicPanelBox: {
    width: "100%",
    paddingBottom: "100%",
    backgroundColor: "#f0f0f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  comicPanelBoxText: {
    fontSize: "14px",
    color: "#555",
  },
  comicPanelImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  downloadPageButton: {
    backgroundColor: "#4caf50",
    color: "white",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "20px",
    display: "block",
    margin: "0 auto",
  },
  clearPageButton: {
    backgroundColor: "#ff9800",
    color: "white",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "20px",
    display: "block",
    margin: "0 auto",
  },
  goBackButton: {
    backgroundColor: "#2196f3",
    color: "white",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "20px",
    display: "block",
    margin: "0 auto",
  },
  previewImage: {
    marginTop: "20px",
    marginBottom: "20px",
    border: "2px solid #000",
    width: "100%",
    minHeight: "200px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  applyToPanelButton: {
    backgroundColor: "#4caf50",
    color: "white",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "20px",
    display: "block",
    margin: "0 auto",
  },
};

// Export the ComicFormPage component
export default ComicFormPage;
