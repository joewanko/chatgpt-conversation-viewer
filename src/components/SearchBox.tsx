// SearchBox.tsx
import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { FaCog } from 'react-icons/fa';

interface SearchBoxProps {
  searchTerm: string;
  onSearchTermChange: (searchTerm: string) => void;
  onOpenSettings: () => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ searchTerm, onSearchTermChange, onOpenSettings }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchTermChange(event.target.value);
  };

  return (
    <Form.Group className="py-3" style={{ position: 'sticky', bottom: 0, zIndex: 1, backgroundColor: 'white', display: 'flex', alignItems: 'center', boxShadow: '0px 30px 15px 35px white' }}>
      <Form.Control type="text" placeholder="Search..." value={searchTerm} onChange={handleChange} style={{ flex: '1', marginRight: '20px' }} />
      <Button variant="secondary" className="modal-button" onClick={onOpenSettings}>
        <FaCog className="settings-icon" />
      </Button>
    </Form.Group>
  );
};

export default SearchBox;
