import React from 'react';
import AddRoomModalEnhanced from './AddRoomModalEnhanced';

const AddRoomModal = ({ isOpen, onClose, onSave }) => {
  return <AddRoomModalEnhanced isOpen={isOpen} onClose={onClose} onSave={onSave} />;
};

export default AddRoomModal;
