import axios from 'axios';
import React from 'react';

export default function FileUploader() {
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
    axios.post("/api/confirm-payment", {data: methodEntityResponse})
  }

  const fileData = () => {
    if (file) {
      return (
        <div>
          <p>File Details:</p>
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
          <p>Choose before Pressing the Upload button</p>
        </div>
      );
    }
  };

  const methodEntityResponseComponent = () => {
    if (methodEntityResponse) {
      return (
        <div>
          <button onClick={confirmPayment}>Click to process payment</button>
        </div>
      )
    } else {
      return (
        <div>
          <p>Button to confirm payment will appear here when data has been processed</p>
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
