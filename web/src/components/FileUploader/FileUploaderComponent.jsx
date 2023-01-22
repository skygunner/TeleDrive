import React, { useRef } from "react";

import {
  DragDropText,
  FileUploadContainer,
  FormField,
  UploadFileBtn,
} from "./FileUploaderStyles";

const FileUploader = ({ ...otherProps }) => {
  const fileInputField = useRef(null);

  const handleUploadBtnClick = () => {
    fileInputField.current.click();
  };

  const formFieldOnChange = (e) => {
    const { files: selectedFiles } = e.target;
    if (selectedFiles.length) {
      const files = Object.keys(selectedFiles).map((key) => selectedFiles[key]);
      uploadFilesHandler(files);
    }
  };

  const uploadFilesHandler = (files) => {
    console.log(files);
  };

  return (
    <>
      <FileUploadContainer>
        <DragDropText>Drag and drop your files anywhere or</DragDropText>
        <UploadFileBtn type="button" onClick={handleUploadBtnClick}>
          <i className="fas fa-file-upload" />
          <span> Upload {otherProps.multiple ? "files" : "a file"}</span>
        </UploadFileBtn>
        <FormField
          type="file"
          ref={fileInputField}
          onChange={formFieldOnChange}
          title=""
          value=""
          {...otherProps}
        />
      </FileUploadContainer>
    </>
  );
};

export default FileUploader;
