import { Modal, Input, Upload, Select, Button, Spin, Switch, message } from 'antd';
import  { useState } from 'react';
import axios from 'axios';
import './LookUploadModal.css';

const { /* Option  */} = Select;

const LookUploadModal = ({ visible, onClose }: { visible: boolean, onClose: () => void }) => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null); // Оригинальное изображение
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [season, setSeason] = useState('');
  const [trend, setTrend] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [extractedColors, setExtractedColors] = useState<string[]>([]);

  const resetFields = () => {
    setImage(null);
    setPreview(null);
    setTitle('');
    setTags([]);
    setSeason('');
    setTrend('');
    setIsPrivate(false);
    setExtractedColors([]);
    setLoading(false);
  };

  const handleImageChange = ({ file }: any) => {
    const selectedFile = file?.originFileObj || file;
    if (!(selectedFile instanceof File)) return;

    setImage(selectedFile);
    setPreview(URL.createObjectURL(selectedFile)); // просто показываем оригинал
  };

   const handleSubmit = async () => {
  if (!title || !season || !trend || !image) {
    return message.error('Please fill all required fields and upload an image.');
  }

  setLoading(true);

  const formData = new FormData();
  formData.append('title', title);
  formData.append('tags', JSON.stringify(tags));
  formData.append('season', season);
  formData.append('trend', trend);
  formData.append('isPrivate', String(isPrivate));
  formData.append('image', image);

  try {
    await axios.post('http://localhost:3000/outfits/upload', formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    message.success({
      content: '✅ Look saved successfully!',
      duration: 2,
    });

    // Подождём чуть-чуть перед закрытием
    setTimeout(() => {
      resetFields();
      onClose();
    }, 1000); // можно 1500–2000 мс для эффекта
  } catch (err) {
    console.error(err);
    message.error('❌ Upload failed. Try again.');
  } finally {
    setLoading(false);
  }
};


  const handleClose = () => {
    resetFields();
    onClose();
  };


  



  return (
    <Modal
    
      open={visible}
      onCancel={handleClose}
      footer={null}
      centered
      closable={false}
      width={520}
      className="look-upload-modal"
    >
      <div className="modal-content">
        <h2 className="modal-title">Upload Your Look ✨</h2>

        <Upload
          beforeUpload={() => false}
          onChange={handleImageChange}
          showUploadList={false}
          accept="image/*"
        >
          <Button className="upload-btn">
            <img src="/icons8-папка-100.png" alt="papka" style={{ width: '30px' }} />
            Upload Image
          </Button>
        </Upload>

        {preview && <img src={preview} alt="preview" className="image-preview" />}
        {extractedColors.length > 0 && (
          <div className="color-palette">
            {extractedColors.map((color, index) => (
              <span
                key={index}
                className="color-dot"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}

        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="dark-input"
        />
        <Input
          placeholder="Tags (comma separated)"
          onChange={(e) => setTags(e.target.value.split(',').map((tag) => tag.trim()))}
          className="dark-input"
        />

        <Select
          value={season}
          onChange={setSeason}
          placeholder="Season"
          className="dark-select"
          options={[
            { value: 'summer', label: 'Summer' },
            { value: 'autumn', label: 'Autumn' },
            { value: 'spring', label: 'Spring' },
            { value: 'winter', label: 'Winter' },
          ]}
        />

        <Select
          value={trend}
          onChange={setTrend}
          placeholder="Trend"
          className="dark-select"
          options={[
            { value: 'casual', label: 'Casual' },
            { value: 'glamor', label: 'Glamor' },
            { value: 'classic', label: 'Classic' },
          ]}
        />

        <div className="private-toggle">
          <span>Make Private:</span>
          <Switch checked={isPrivate} onChange={setIsPrivate} />
        </div>

        <div className="modal-footer">
          <Button onClick={handleClose} className="cancel-btn" ghost>
            Cancel
          </Button>
          <Button type="primary" onClick={handleSubmit} disabled={loading} style={{ borderRadius: '30px' }}>
            {loading ? <Spin size="small" /> : 'Save Look'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LookUploadModal;
