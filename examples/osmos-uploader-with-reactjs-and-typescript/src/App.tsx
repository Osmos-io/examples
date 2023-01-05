import "./App.css";
declare global {
  interface Window {
    Osmos: any;
  }
}
function App() {
  return (
    <div className="App">
      {/* Button provide in snippet */}
      <button
        className="ftl-button"
        onClick={() =>
          window.Osmos.handleClick(process.env.REACT_APP_UPLOADER_TOKEN)
        }
      >
        Upload Your Data
      </button>
    </div>
  );
}

export default App;
