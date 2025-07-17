import React from 'react';
import { Button } from 'antd';
import { HeartOutlined, PlusOutlined, CalendarOutlined, AppstoreOutlined, SkinOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';


interface Props {
  carousel: React.ReactNode; // 👈 теперь компонент принимает карусель
}

const WardrobeActions: React.FC<Props> = ({ carousel }) => {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr', // левая колонка | карусель | правая колонка
      gap: '6rem',
      alignItems: 'center',
      marginTop: '3rem',
    }}>
      {/* Левая колонка */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', alignItems: 'flex-end' }}>
        <Button
          type="primary"
          icon={<HeartOutlined />}
          size="large"
          style={{ width: '180px',   borderRadius: '20px', background: 'rgba(255, 255, 255, 0.3)', border: 'none', color:'#fff', }}
          onClick={() => navigate('/favorites')}
        >
          Favorites
        </Button>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          style={{ width: '180px', borderRadius: '20px', background: 'rgba(255, 255, 255, 0.3)', border: 'none', color:'#fff', }}
          onClick={() => navigate('/create-look')}
        >
          Create outfit
        </Button>

         <Button
          type="primary"
          icon={<SkinOutlined />}
          size="large"
          style={{ width: '180px', borderRadius: '20px', background: 'rgba(255, 255, 255, 0.3)', border: 'none', color:'#fff', }}
          onClick={() => navigate('/my-outfits')}
        >
          My outfits
        </Button>
      </div>

{/* Центр — сюда встраиваем карусель */}
      <div>
        {carousel}
      </div>

      {/* Правая колонка */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', alignItems: 'flex-start' }}>
        <Button
          type="primary"
          icon={<CalendarOutlined />}
          size="large"
          style={{ width: '180px', borderRadius: '20px', background: 'rgba(255, 255, 255, 0.3)', border: 'none', color:'#fff', }}
          onClick={() => navigate('/calendar')}
        >
          Calendar
        </Button>

        <Button
          type="primary"
          icon={<AppstoreOutlined />}
          size="large"
          style={{ width: '180px', borderRadius: '20px', background: 'rgba(255, 255, 255, 0.3)', border: 'none', color:'#fff', }}
          onClick={() => navigate('/wardrobe')}
        >
          Wardrobe
        </Button>
      </div>
    </div>
  );
};

export default WardrobeActions;
