import { FaCog, FaCopy, FaExternalLinkAlt } from 'react-icons/fa';
import React, { useEffect, useState, useRef } from 'react';
import { Container, Form, FormGroup, FormControl, Button, Modal } from 'react-bootstrap';
import './App.css';
import Instructions from './Instructions';
import { REPO_URL, EXCERPT_LENGTH } from './constants';

function escapeHtml(html) {
  var text = document.createTextNode(html);
  var p = document.createElement('p');
  p.appendChild(text);
  return p.innerHTML;
}

function App() {
  const [formattedConversations, setFormattedConversations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const searchRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const getDb = () => {
    return new Promise((resolve, reject) => {
      const openRequest = indexedDB.open('ChatApp', 1);
      openRequest.onupgradeneeded = function () {
        const db = openRequest.result;
        if (!db.objectStoreNames.contains('conversations')) {
          db.createObjectStore('conversations');
        }
      };
      openRequest.onsuccess = function () {
        resolve(openRequest.result);
      };
      openRequest.onerror = function () {
        reject(openRequest.error);
      };
    });
  };

  const clearConversations = async () => {
    setFormattedConversations([]);
    const db = await getDb();
    const transaction = db.transaction('conversations', 'readwrite');
    const store = transaction.objectStore('conversations');
    store.delete('data');
    setShowModal(false);
  };

  const processConversations = (data) => {
    try {
      const formattedData = data.map(conversation => {
        let allMessages = [];
        Object.values(conversation.mapping).filter(nodeData => {
          return nodeData?.message?.content?.parts?.length > 0 && !!nodeData.message.content.parts.join();
        }).forEach(nodeData => {
          allMessages.push(nodeData.message.content.parts.join());
        });

        const date = new Date(conversation.create_time * 1000);
        return {
          id: "https://chat.openai.com/c/" + conversation.id,
          title: conversation.title,
          date: date.toLocaleDateString(),
          excerpt: allMessages[0]?.slice(0, EXCERPT_LENGTH),
          prompt: allMessages[0],
          allMessages: allMessages.join(" "),
        };
      });
      setFormattedConversations(formattedData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error processing conversations:", error);
      setFormattedConversations([]);
      // Clear the data in IndexedDB
      const openRequest = indexedDB.open('ChatApp', 1);
      openRequest.onsuccess = function () {
        const db = openRequest.result;
        const transaction = db.transaction('conversations', 'readwrite');
        const store = transaction.objectStore('conversations');
        store.delete('data');
      };
    }
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async function (event) {
      const data = JSON.parse(event.target.result);
      processConversations(data);

      const db = await getDb();
      const transaction = db.transaction('conversations', 'readwrite');
      const store = transaction.objectStore('conversations');
      store.put(data, 'data');
    };

    reader.readAsText(file);
  };

  useEffect(() => {
    (async () => {
      const db = await getDb();
      const transaction = db.transaction('conversations', 'readonly');
      const store = transaction.objectStore('conversations');
      const getRequest = store.get('data');

      getRequest.onsuccess = function () {
        if (getRequest.result) {
          processConversations(getRequest.result);
        }

        setIsLoading(false);
      };
    })();
  }, []);

  useEffect(() => {
    const keydownHandler = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'f') {
        event.preventDefault();
        if (searchRef.current) {
          searchRef.current.focus();
        }
      }
    };
    window.addEventListener('keydown', keydownHandler);
    return () => {
      window.removeEventListener('keydown', keydownHandler);
    };
  }, []);

  const handleChange = event => {
    setSearchTerm(event.target.value);
  };

  const filteredConversations = formattedConversations.filter(conversation =>
    conversation.allMessages?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    conversation.title?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  // Function to highlight the search term
  const highlightTerm = (rawText, rawTerm) => {
    let text = escapeHtml(rawText);
    const term = escapeHtml(rawTerm);

    if (term !== "") {
      const index = text?.toLowerCase().indexOf(term?.toLowerCase());
      if (index >= 0) {
        text = text?.slice(0, index) + '<mark>' + text?.slice(index, index + term?.length) + '</mark>' + text?.slice(index + term?.length);
      }
    }
    return { __html: text };
  }

  function copyContent(item) {
    navigator.clipboard.writeText(item.prompt);
  }

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h2>Loading...</h2>
      </div>
    );
  }


  if (!formattedConversations?.length) {
    // Other screen
    return (
      <Container style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', maxWidth: '800px' }}>
        <Form>
          <FormGroup>
            <Form.Label><h4>Select your conversations.json file</h4></Form.Label>
            <FormControl type="file" accept=".json" onChange={handleFileSelect} />
          </FormGroup>
        </Form>
        <Instructions />
      </Container>
    );
  }

  return (
    <Container style={{ maxWidth: 'none' }}>
      <h1 className='heading'>ChatGPT Conversation Viewer</h1>
        
      <div className="flex-container">
        {filteredConversations.map((item, index) => {
          const excerptIndex = item.allMessages?.toLowerCase().indexOf(searchTerm?.toLowerCase());
          const start = searchTerm !== "" && excerptIndex >= 0
            ? Math.max(0, excerptIndex - Math.floor((EXCERPT_LENGTH - searchTerm?.length) / 2))
            : 0;
          const end = start + EXCERPT_LENGTH;
          let excerpt = item.allMessages?.slice(start, end);
          if (start > 0) excerpt = '...' + excerpt;
          if (end < item.allMessages?.length) excerpt = excerpt + '...';
          return (
            <div key={index} className="flex-row">
              <div className='min'>{item.date}</div>
              <div className='title'><a href={item.id} target="_blank" rel="noopener noreferrer">{item.title}</a></div>
              <div className='excerpt' dangerouslySetInnerHTML={highlightTerm(excerpt, searchTerm)} />
              <div className='min'>
                <Button aria-label="Copy first prompt to clipboard" title="Copy first prompt to clipboard" variant="link" className="modal-button" onClick={() => copyContent(item)}>
                  <FaCopy className="copy-icon" />
                </Button>
              </div>
              <div className='min'>
                <Button aria-label={`Link to ${item.title} (opens in new window)`} variant="link" href={item.id} target="_blank" rel="noopener noreferrer">
                  <FaExternalLinkAlt className="copy-icon" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      <Form.Group className="py-3" style={{ position: 'sticky', bottom: 0, zIndex: 1, backgroundColor: 'white', display: 'flex', alignItems: 'center', boxShadow: '0px 30px 15px 35px white' }}>
        <Form.Control ref={searchRef} type="text" placeholder="Search..." onChange={handleChange} style={{ flex: '1', marginRight: '20px' }} />
        <Button variant="secondary" className="modal-button" onClick={handleOpenModal}>
          <FaCog className="settings-icon" />
        </Button>
      </Form.Group>
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
          <Button onClick={clearConversations}>Clear Conversations</Button>

          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default App;
