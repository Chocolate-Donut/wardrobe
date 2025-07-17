// OutfitPickerModal.tsx
import React, { useEffect, useState } from 'react';
import { Modal, Tabs } from 'antd';
import axios from 'axios';

const { /* TabPane  */} = Tabs;

interface Outfit {
  id: number;
  imageUrl: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (outfitId: number) => void;
}

const OutfitPickerModal: React.FC<Props> = ({ visible, onClose, onSelect }) => {
  const [createdOutfits, setCreatedOutfits] = useState<Outfit[]>([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (visible) {
      axios.get('http://localhost:3000/outfits/my-outfits', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => setCreatedOutfits(res.data));
    }
  }, [visible]);

  const generateImageUrl = (imageUrl: string) => {
    if (imageUrl.startsWith('uploads/')) {
      return `http://localhost:3000/${imageUrl}`;
    } else if (imageUrl.startsWith('http')) {
      return imageUrl;
    } else {
      return `http://localhost:3000/uploads/outfits/${imageUrl}`;
    }
  };

  const renderOutfits = (outfits: Outfit[]) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      {outfits.map(outfit => {
        const imageUrl = generateImageUrl(outfit.imageUrl);

        return (
          <img
            key={outfit.id}
            src={imageUrl}
            alt="Outfit"
            onClick={() => onSelect(outfit.id)}
            style={{
              width: 90,
              height: 120,
              borderRadius: 8,
              cursor: 'pointer',
              border: '2px solid transparent'
            }}
          />
        );
      })}
    </div>
  );

  const items = [
    {
      key: 'created',
      label: 'Created',
      children: renderOutfits(createdOutfits)
    }
  ];

  return (
    <Modal open={visible} onCancel={onClose} footer={null} title="Choose outfit">
      <Tabs defaultActiveKey="created" items={items} />
    </Modal>
  );
};

export default OutfitPickerModal;
