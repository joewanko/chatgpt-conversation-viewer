import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import './App.css';
import Instructions from './components/Instructions';
import ConversationList from './components/ConversationList';
import SearchBox from './components/SearchBox';
import LoadingScreen from './components/LoadingScreen';
import FileUpload from './components/FileUpload';
import SettingsModal from './components/SettingsModal';
import useConversations from './hooks/useConversations';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { conversations, isLoading, clearConversations, handleFileSelect } = useConversations({searchTerm});

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  useEffect(() => {
    if (conversations.length === 0) {
      setSearchTerm("");
      setShowModal(false);
    }    
  }, [ conversations ])

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!conversations?.length) {
    return (
      <Container style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', maxWidth: '800px' }}>
        <FileUpload onFileSelect={handleFileSelect} />
        <Instructions />
      </Container>
    );
  }

  return (
    <Container style={{ maxWidth: 'none' }}>
      <h1 className='heading'>ChatGPT Conversation Viewer</h1>
      <ConversationList searchTerm={searchTerm}conversations={conversations} />
      <SearchBox searchTerm={searchTerm} onSearchTermChange={setSearchTerm} onOpenSettings={handleOpenModal} />
      <SettingsModal showModal={showModal} handleCloseModal={handleCloseModal} handleClearConversations={clearConversations} />
    </Container>
  );
}

export default App;
