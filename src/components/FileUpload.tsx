// FileUpload.tsx
import React from 'react';
import { Form, FormGroup, FormControl, FormLabel } from 'react-bootstrap';

interface FileUploadProps {
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  return (
    <Form>
      <FormGroup>
        <FormLabel><h4>Select your conversations.json file</h4></FormLabel>
        <FormControl type="file" accept=".json" onChange={onFileSelect} />
      </FormGroup>
    </Form>
  );
};

export default FileUpload;
