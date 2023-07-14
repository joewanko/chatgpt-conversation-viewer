import React, { useEffect, useState } from 'react';
import conversations from '../conversations.json';  // Path to your JSON file

function App() {
  const [formattedConversations, setFormattedConversations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const formattedData = conversations.map(conversation => {
      let allMessages = [];
      Object.values(conversation.mapping).filter(nodeData => {
        return nodeData?.message?.content?.parts?.length > 0 && !!nodeData.message.content.parts.join();
      }).forEach(nodeData => {
        allMessages.push(nodeData.message.content.parts.join());
      });

      return {
        id: "https://chat.openai.com/c/" + conversation.id,
        title: conversation.title,
        date: new Date(conversation.create_time * 1000).toISOString(),
        firstMessage: allMessages[0].slice(0, 210),
        allMessages: allMessages.join(" "),
      };
    });
    setFormattedConversations(formattedData);
  }, []);

  const handleChange = event => {
    setSearchTerm(event.target.value);
  };

  const filteredConversations = formattedConversations.filter(conversation =>
    conversation.allMessages.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      <input type="text" placeholder="Search..." onChange={handleChange} />
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Title</th>
            <th>First Message</th>
          </tr>
        </thead>
        <tbody>
          {filteredConversations.map((item, index) => (
            <tr key={index}>
              <td>{item.date}</td>
              <td><a href={item.id} target="_blank" rel="noopener noreferrer">{item.title}</a></td>
              <td>{item.firstMessage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
