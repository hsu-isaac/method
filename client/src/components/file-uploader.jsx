import axios from 'axios';
import React, { Component } from 'react';

class App extends Component {

  state = {
    selectedFile: null
  };

  onFileChange = event => {
    this.setState({ selectedFile: event.target.files[0] });

  };


  onFileUpload = () => {
    const formData = new FormData();
    formData.append(
      "myFile",
      this.state.selectedFile,
      this.state.selectedFile.name
    );
    console.log(Array.from(formData.entries()));
    axios.post("/api/uploadfile", formData);
  };

  // File content to be displayed after
  // file upload is complete
  fileData = () => {

    if (this.state.selectedFile) {

      return (
        <div>
          <h2>File Details:</h2>
          <p>File Name: {this.state.selectedFile.name}</p>

          <p>File Type: {this.state.selectedFile.type}</p>

          <p>
            Last Modified:{" "}
            {this.state.selectedFile.lastModifiedDate.toDateString()}
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

  render() {

    return (
      <div>
        <div>
          <input type="file" onChange={this.onFileChange} />
          <button onClick={this.onFileUpload}>
            Upload!
          </button>
        </div>
        {this.fileData()}
      </div>
    );
  }
}

export default App;
