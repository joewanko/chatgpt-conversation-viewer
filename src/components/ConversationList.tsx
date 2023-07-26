import React from 'react';
import ConversationItem from './ConversationItem';
import { Conversation } from '../types';

interface ConversationListProps {
  conversations: Conversation[];
  searchTerm: string;
}

const ConversationList: React.FC<ConversationListProps> = ({ conversations, searchTerm }) => {
  return (
    <div className="flex-container">
      {conversations.map((item, index) => (
        <ConversationItem key={index} item={item} searchTerm={searchTerm} />
      ))}
    </div>
  );
};

export default ConversationList;
