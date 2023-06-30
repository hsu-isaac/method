import axios from 'axios';
import React from 'react';


export default function FileUploader({ getPaymentData }) {
  const [file, setFile] = React.useState(null);
  const [methodEntityResponse, setMethodEntityResponse] = React.useState(null);

  const onFileChange = event => {
    setFile(event.target.files[0]);
  };

  const onFileUpload = () => {
    const formData = new FormData();
    formData.append(
      "myFile",
      file,
      file.name
    );
    axios.post("/api/uploadfile", formData).then(response => {
      setMethodEntityResponse(response.data);
    }).catch(err => {
      console.error(err);
    });
  };

  const confirmPayment = () => {
    console.log(methodEntityResponse)
    axios.post("/api/confirm-payment", {data: methodEntityResponse})
  }

  const fileData = () => {
    if (file) {
      return (
        <div>
          <h2>File Details:</h2>
          <p>File Name: {file.name}</p>
          <p>File Type: {file.type}</p>
          <p>
            Last Modified:{" "}
            {file.lastModifiedDate.toDateString()}
          </p>
        </div>
      );
    } else {
      return (
        <div>
          <br />
          <h4>Choose before Pressing the Upload button</h4>
        </div>
      );
    }
  };

  const methodEntityResponseComponent = () => {
    if (methodEntityResponse) {
      return (
        <div>
          <button onClick={confirmPayment}>Hello I am method response button</button>
        </div>
      )
    } else {
      return (
        <div>
          <button>Bad Button</button>
        </div>
      )
    }
  }

  return (
    <div>
      <div>
        <input type="file" onChange={onFileChange} />
        <button onClick={onFileUpload}>
          Upload!
        </button>
      </div>
      {fileData()}
      {methodEntityResponseComponent()}
    </div>
  );
};
