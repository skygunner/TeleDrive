import { useRef } from "react";

import {
  DragDropText,
  FileUploadContainer,
  UploadFileButton,
  UploadFormField,
} from "./FileUploaderStyles";

const FileUploader = ({ folderId }) => {
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
    files.forEach((file) => {
      console.log(file);
    });
  };

  return (
    <FileUploadContainer>
      <DragDropText>Drag and drop your files anywhere here or</DragDropText>
      <UploadFileButton type="button" onClick={handleUploadBtnClick}>
        <i className="fas fa-file-upload" />
        <span>Upload files</span>
      </UploadFileButton>
      <UploadFormField
        type="file"
        ref={fileInputField}
        onChange={formFieldOnChange}
        title=""
        value=""
        multiple
      />
    </FileUploadContainer>
  );
};

export default FileUploader;
