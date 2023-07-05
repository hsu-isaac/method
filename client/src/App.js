import React from "react";
import "./App.css";
import FileUploader from "./components/file-uploader";


function App() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>{!data ? "Loading..." : data}</p>
        <FileUploader />
      </header>
    </div>
  );
}

export default App;
