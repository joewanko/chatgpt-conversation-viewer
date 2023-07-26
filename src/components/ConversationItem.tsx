import React from 'react';
import { Conversation } from '../types';
import { Button } from 'react-bootstrap';
import { FaCopy, FaExternalLinkAlt } from 'react-icons/fa';

interface ConversationItemProps {
  item: Conversation;
  searchTerm: string;
}

function escapeHtml(html: string) {
    var text = document.createTextNode(html);
    var p = document.createElement('p');
    p.appendChild(text);
    return p.innerHTML;
  }
  

const ConversationItem: React.FC<ConversationItemProps> = ({ item, searchTerm }) => {
  const copyContent = () => {
    navigator.clipboard.writeText(item.prompt);
  }

  // Function to highlight the search term
  const highlightTerm = (rawText: string, rawTerm: string) => {
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

  return (
    <div className="flex-row">
      <div className='min'>{item.date}</div>
      <div className='title'><a href={item.id} target="_blank" rel="noopener noreferrer">{item.title}</a></div>
      <div className='excerpt' dangerouslySetInnerHTML={highlightTerm(item.excerpt, searchTerm)} />
      <div className='min'>
        <Button aria-label="Copy first prompt to clipboard" title="Copy first prompt to clipboard" variant="link" className="modal-button" onClick={copyContent}>
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
};

export default ConversationItem;
