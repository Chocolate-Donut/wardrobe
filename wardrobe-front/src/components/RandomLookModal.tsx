/* import React, { useEffect, useState } from 'react';
import { Modal, Button, Spin, message, Select } from 'antd';
import axios from 'axios';
import './RandomLookModal.css';

interface Props {
  visible: boolean;
  onClose: () => void;
  onApply: (items: any[]) => void;
}

const palettes = {
  warm: ['#e74c3c', '#e67e22', '#d35400', '#c0392b'],
  cool: ['#3498db', '#1abc9c', '#2c3e50', '#2980b9'],
  neutral: ['#bdc3c7', '#ecf0f1', '#7f8c8d', '#95a5a6'],
};

function hexToRgb(hex: string): [number, number, number] {
  const bigint = parseInt(hex.replace('#', ''), 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function colorDistance(c1: string, c2: string): number {
  const [r1, g1, b1] = hexToRgb(c1);
  const [r2, g2, b2] = hexToRgb(c2);
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}

function hasMatchingColor(itemColors: string[], palette: string[]): boolean {
  return itemColors?.some(color =>
    palette.some(p => colorDistance(color, p) < 60)
  );
}

const RandomLookModal: React.FC<Props> = ({ visible, onClose, onApply }) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [paletteKey, setPaletteKey] = useState<'warm' | 'cool' | 'neutral'>('warm');

  const shuffle = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

  const generateLook = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/wardrobe', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      const wardrobe = res.data || [];
      const palette = palettes[paletteKey];

      type ClothingType = 'outwear' | 'top' | 'bottom' | 'footwear' | 'accessories' | 'fullbody';
      const categories: Record<ClothingType, any[]> = {
        outwear: [], top: [], bottom: [], fullbody: [], footwear: [], accessories: [],
      };

      wardrobe.forEach((item: any) => {
        const type = item.type?.toLowerCase() as ClothingType;
        if (categories[type]) categories[type].push(item);
      });

      const hasFullbody = categories.fullbody.length > 0;
      const order = (hasFullbody
        ? ['outwear', 'fullbody', 'accessories', 'footwear']
        : ['outwear', 'top', 'bottom', 'accessories', 'footwear']) as ClothingType[];

      const generated = order.map(type => {
        const filtered = categories[type].filter(item =>
          hasMatchingColor(item.colors || [], palette)
        );
        const selected = shuffle(filtered)[0] || shuffle(categories[type])[0];
        return selected ? { ...selected, type } : null;
      }).filter(Boolean);

      setItems(generated);
      setAttempt(prev => prev + 1);
    } catch (err) {
      console.error('Color-aware random error:', err);
      message.error('Failed to generate look');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) generateLook();
  }, [visible, paletteKey]);

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      width={820}
      title={`Random Look (Attempt ${attempt})`}
      footer={[
        <Select
          key="palette"
          value={paletteKey}
          onChange={(val) => setPaletteKey(val)}
          style={{ width: 150 }}
          options={[
            { value: 'warm', label: '🎨 Warm' },
            { value: 'cool', label: '❄️ Cool' },
            { value: 'neutral', label: '🟤 Neutral' },
          ]}
        />,
        <Button key="regen" onClick={generateLook} loading={loading}>🔄 Another</Button>,
        <Button key="cancel" onClick={onClose}>❌ Close</Button>,
        <Button key="use" type="primary" onClick={() => { onApply(items); onClose(); }}>✅ Use</Button>,
      ]}
    >
      {loading ? <Spin size="large" /> : (
        <div className="look-grid">
          {items.map((item, i) => (
            <div key={item.id || i} className="look-item">
              <img
                src={`http://localhost:3000/${item.imageUrl.replace(/\\/g, '/')}`}
                alt={item.type}
                className="item-image"
              />
              <div className="item-type">{item.type}</div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};

export default RandomLookModal;
 */

import React, { useEffect, useState } from 'react';
import { Modal, Button, Spin, message, Select } from 'antd';
import axios from 'axios';
import './RandomLookModal.css';

interface Props {
  visible: boolean;
  onClose: () => void;
  onApply: (items: any[]) => void;
}

const RandomLookModal: React.FC<Props> = ({ visible, onClose, onApply }) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [attempt, setAttempt] = useState(1);
  const [palette, setPalette] = useState<'Warm' | 'Cool' | 'Neutral'>('Warm');

  const shuffle = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

  const fetchAndGenerate = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/wardrobe', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const wardrobe = res.data || [];
      if (wardrobe.length === 0) {
        message.warning('Wardrobe is empty');
        setItems([]);
        return;
      }

      type ClothingType = 'outwear' | 'top' | 'bottom' | 'footwear' | 'accessories' | 'fullbody';

      const categories: Record<ClothingType, any[]> = {
        outwear: [],
        top: [],
        bottom: [],
        fullbody: [],
        footwear: [],
        accessories: [],
      };

      wardrobe.forEach((item: any) => {
        const type = item.type?.toLowerCase() as ClothingType;
        if (categories[type]) categories[type].push(item);
      });

      const hasFullbody = categories.fullbody.length > 0;
      const order: ClothingType[] = hasFullbody
        ? ['outwear', 'fullbody', 'accessories', 'footwear']
        : ['outwear', 'top', 'bottom', 'accessories', 'footwear'];

      const generated = order
        .filter((type) => categories[type].length > 0)
        .map((type) => ({
          ...shuffle(categories[type])[0],
          type,
        }));

      setItems(generated);
      setAttempt((prev) => prev + 1);
    } catch (err) {
      message.error('Failed to generate look');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchAndGenerate();
    }
  }, [visible]);

  return (
    <Modal
      className="custom-modal"
      open={visible}
      onCancel={onClose}
      title={`Random Look (Attempt ${attempt})`}
      footer={[
        <Select
          key="palette"
          value={palette}
          onChange={(val) => setPalette(val)}
          style={{ width: 120 }}
          options={[
            { value: 'Warm', label: '🎨 Warm' },
            { value: 'Cool', label: '🌊 Cool' },
            { value: 'Neutral', label: '⚪ Neutral' },
          ]}
        />,
        <Button key="another" onClick={fetchAndGenerate} disabled={loading} type="dashed" className="custom-another-btn">
          Another
        </Button>,
        <Button key="use" type="primary" onClick={() => {
          onApply(items);
          onClose();
        }}>
          Use
        </Button>,
      ]}
      width={800}
    >
      {loading ? (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      ) : (
        <div className="look-grid">
          {items.map((item, index) => (
            <div key={item.id || index} className="look-item">
              <div className="item-image-container">
                <img
                  src={`http://localhost:3000/${item.imageUrl.replace(/\\/g, '/')}`}
                  className="item-image"
                  alt={item.type}
                />
              </div>
              <div className="item-type">{item.type}</div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};

export default RandomLookModal;
