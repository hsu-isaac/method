import React from "react";
import logo from "./logo.svg";
import "./App.css";
import FileUploader from "./components/file-uploader";


function App() {
  const [data, setData] = React.useState(null);
  const [payments, setPayments] = React.useState(null);
  const getPaymentData = (paymentData) => {
    setPayments(paymentData)
  }

  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{!data ? "Loading..." : data}</p>
        <FileUploader getPaymentData={getPaymentData}/>
      </header>
    </div>
  );
}

export default App;
