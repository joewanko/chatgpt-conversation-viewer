import React, { useEffect, useState, useRef } from 'react';
import { Container, Form, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import conversations from './conversations.json';  // Path to your JSON file

function App() {
  const [formattedConversations, setFormattedConversations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef(null);

  useEffect(() => {
    const formattedData = conversations.map(conversation => {
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
        excerpt: allMessages[0].slice(0, 210),
        allMessages: allMessages.join(" "),
      };
    });
    setFormattedConversations(formattedData);
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
    conversation.allMessages.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to highlight the search term
  const highlightTerm = (text, term) => {
    if (term !== "") {
      const index = text.toLowerCase().indexOf(term.toLowerCase());
      if (index >= 0) {
        text = text.slice(0, index) + '<mark>' + text.slice(index, index + term.length) + '</mark>' + text.slice(index + term.length);
      }
    }
    return { __html: text };
  }

  return (
    <Container className="App">
      <Form.Group className="py-3" style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: 'white' }}>
        <Form.Control ref={searchRef} type="text" placeholder="Search..." onChange={handleChange} />
      </Form.Group>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Date</th>
            <th>Title</th>
            <th>Excerpt</th>
          </tr>
        </thead>
        <tbody>
          {filteredConversations.map((item, index) => {
            const excerptIndex = item.allMessages.toLowerCase().indexOf(searchTerm.toLowerCase());
            const start = searchTerm !== "" && excerptIndex >= 0
              ? Math.max(0, excerptIndex - Math.floor((210 - searchTerm.length) / 2))
              : 0;
            const end = start + 210;
            let excerpt = item.allMessages.slice(start, end);
            if (start > 0) excerpt = '...' + excerpt;
            if (end < item.allMessages.length) excerpt = excerpt + '...';
            return (
              <tr key={index}>
                <td>{item.date}</td>
                <td><a href={item.id} target="_blank" rel="noopener noreferrer">{item.title}</a></td>
                <td dangerouslySetInnerHTML={highlightTerm(excerpt, searchTerm)} />
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
}

export default App;
