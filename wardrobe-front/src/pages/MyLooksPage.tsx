/* import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Tabs, Card, Tag } from 'antd';
import './MyLooksPage.css';
import LookCard from '../components/LookCard';


const { TabPane } = Tabs;

const MyLooksPage: React.FC = () => {
  const [publicOutfits, setPublicOutfits] = useState<any[]>([]);
  const [privateOutfits, setPrivateOutfits] = useState<any[]>([]);
  const [selectedLooks, setSelectedLooks] = useState<number[]>([]); // Для хранения ID выбранных образов
  const [isSelectMode, setIsSelectMode] = useState(false); // Режим выбора

  // Функция выбора/снятия выбора образа
  const toggleLookSelection = (id: number) => {
    setSelectedLooks(prev =>
      prev.includes(id) 
        ? prev.filter(lookId => lookId !== id) 
        : [...prev, id]
    );
  };

  // Массовое удаление
  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedLooks.map(id => 
          axios.delete(`http://localhost:3000/outfits/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          })
        )
      );
      
      setPublicOutfits(prev => prev.filter(o => !selectedLooks.includes(o.id)));
      setPrivateOutfits(prev => prev.filter(o => !selectedLooks.includes(o.id)));
      setSelectedLooks([]);
      setIsSelectMode(false);
    } catch (err) {
      console.error('Ошибка при удалении образов:', err);
    }
  };



    
const handleDelete = async (id: number) => {
  try {
    await axios.delete(`http://localhost:3000/outfits/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    setPublicOutfits((prev) => prev.filter((o) => o.id !== id));
    setPrivateOutfits((prev) => prev.filter((o) => o.id !== id));
  } catch (err) {
    console.error('Ошибка при удалении образа:', err);
  }
};


  useEffect(() => {
    const fetchOutfits = async () => {
      try {
        const res = await axios.get('http://localhost:3000/outfits/my-outfits', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const outfits = res.data || [];

        // Разделяем по приватности
        const publics = outfits.filter((o: any) => !o.isPrivate);
        const privates = outfits.filter((o: any) => o.isPrivate);

        setPublicOutfits(publics);
        setPrivateOutfits(privates);
      } catch (error) {
        console.error('Ошибка загрузки образов:', error);
      }
    };

    fetchOutfits();
  }, []);

  const renderOutfits = (list: any[]) => (
  <div className="outfit-grid">
    {list.map((outfit) => (
      <LookCard key={outfit.id} look={outfit} isAuthorized={false} onDelete={handleDelete} isSelected={selectedLooks.includes(outfit.id)}
          onSelect={toggleLookSelection}
          isSelectMode={isSelectMode}/>
      
    ))}
    
  </div>
  
);





  return (
    <div className="my-outfits-page" >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}></div>
      <h2>My Outfits</h2>


        {isSelectMode ? (
          <div>
            <span style={{ marginRight: 16 }}>Выбрано: {selectedLooks.length}</span>
            <Button danger onClick={handleBulkDelete}>Удалить выбранное</Button>
            <Button style={{ marginLeft: 8 }} onClick={() => {
              setSelectedLooks([]);
              setIsSelectMode(false);
            }}>Отмена</Button>
          </div>
        ) : (
          <Button onClick={() => setIsSelectMode(true)}>Выбрать несколько</Button>
        )}
      </div>
</div>

      <Tabs defaultActiveKey="public">
        <TabPane tab="Public" key="public" >
          {renderOutfits(publicOutfits)}
        </TabPane>
        <TabPane tab="Private" key="private">
          {renderOutfits(privateOutfits)}
        </TabPane>
      </Tabs>
    </div>
    
  );
};

export default MyLooksPage;
 */


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Tabs, Button } from 'antd';
import './MyLooksPage.css';
import LookCard from '../components/LookCard';
import EditOutfitModal from '../components/EditOutfitModal';
import NavigationMenu from '../components/NavigationMenu';




const { TabPane } = Tabs;

const MyLooksPage: React.FC = () => {
  const [publicOutfits, setPublicOutfits] = useState<any[]>([]);
  const [privateOutfits, setPrivateOutfits] = useState<any[]>([]);
  const [selectedLooks, setSelectedLooks] = useState<number[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedOutfitForEdit, setSelectedOutfitForEdit] = useState<any>(null);
  const [isEditModalVisible, setEditModalVisible] = useState(false);


  const toggleLookSelection = (id: number) => {
    setSelectedLooks(prev =>
      prev.includes(id) 
        ? prev.filter(lookId => lookId !== id) 
        : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedLooks.map(id => 
          axios.delete(`http://localhost:3000/outfits/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          })
        )
      );
      
      setPublicOutfits(prev => prev.filter(o => !selectedLooks.includes(o.id)));
      setPrivateOutfits(prev => prev.filter(o => !selectedLooks.includes(o.id)));
      setSelectedLooks([]);
      setIsSelectMode(false);
    } catch (err) {
      console.error('Ошибка при удалении образов:', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/outfits/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setPublicOutfits(prev => prev.filter(o => o.id !== id));
      setPrivateOutfits(prev => prev.filter(o => o.id !== id));
    } catch (err) {
      console.error('Ошибка при удалении образа:', err);
    }
  };

  useEffect(() => {
    const fetchOutfits = async () => {
      try {
        const res = await axios.get('http://localhost:3000/outfits/my-outfits', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const outfits = res.data || [];
        setPublicOutfits(outfits.filter((o: any) => !o.isPrivate));
        setPrivateOutfits(outfits.filter((o: any) => o.isPrivate));
      } catch (error) {
        console.error('Ошибка загрузки образов:', error);
      }
    };

    fetchOutfits();
  }, []);



  const handleEditClick = (outfit: any) => {
  setSelectedOutfitForEdit(outfit);
  setEditModalVisible(true);
};

const handleSaveEdit = async (updatedOutfit: any) => {
  try {
    const res = await axios.patch(`http://localhost:3000/outfits/${updatedOutfit.id}`, updatedOutfit, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    const updated = res.data;
    setPublicOutfits((prev) => prev.map(o => o.id === updated.id ? updated : o));
    setPrivateOutfits((prev) => prev.map(o => o.id === updated.id ? updated : o));
  } catch (err) {
    console.error('Ошибка при сохранении образа:', err);
  }
};




  const renderOutfits = (list: any[]) => (
    <div className="outfit-grid">
        <NavigationMenu />
      {list.map((outfit) => (
        <LookCard 
          key={outfit.id} 
          look={outfit} 
          onEdit={() => handleEditClick(outfit)}
          onDelete={handleDelete}
          isSelected={selectedLooks.includes(outfit.id)}
          onSelect={toggleLookSelection}
          isSelectMode={isSelectMode}
        />
      ))}
    </div>
  );

  return (
    <div className="my-outfits-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>My Outfits</h2>
        {isSelectMode ? (
          <div>
            <span style={{ marginRight: 16 }}>Выбрано: {selectedLooks.length}</span>
            <Button danger onClick={handleBulkDelete}>Удалить выбранное</Button>
            <Button style={{ marginLeft: 8 }} onClick={() => {
              setSelectedLooks([]);
              setIsSelectMode(false);
            }}>Отмена</Button>
          </div>
        ) : (
          <Button onClick={() => setIsSelectMode(true)}>Выбрать несколько</Button>
        )}
      </div>

      <Tabs defaultActiveKey="public">
        <TabPane tab="Public" key="public">
          {renderOutfits(publicOutfits)}
        </TabPane>
        <TabPane tab="Private" key="private">
          {renderOutfits(privateOutfits)}
        </TabPane>
      </Tabs>

      <EditOutfitModal
        visible={isEditModalVisible}
        onClose={() => setEditModalVisible(false)}
        onSave={handleSaveEdit}
        outfit={selectedOutfitForEdit}
        />

    </div>
  );
};

export default MyLooksPage;