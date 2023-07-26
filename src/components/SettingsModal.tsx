// SettingsModal.tsx
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { REPO_URL } from '../constants';

interface SettingsModalProps {
  showModal: boolean;
  handleCloseModal: () => void;
  handleClearConversations: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ showModal, handleCloseModal, handleClearConversations }) => {
  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>About This Project</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          This is a Chat GPT Archive Viewer created using React and IndexedDB.
        </p>
        <p>
          The source code for this project can be found on{' '}
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>.
        </p>
        <p>
          This application does not store any user data outside of your browser's IndexedDB.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleClearConversations}>Clear Conversations</Button>
        <Button variant="secondary" onClick={handleCloseModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SettingsModal;
