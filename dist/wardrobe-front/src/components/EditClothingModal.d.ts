import React from 'react';
import './UploadClothingModal.css';
interface EditClothingModalProps {
    visible: boolean;
    item: WardrobeItem | null;
    onClose: () => void;
    onSave: (updatedItem: WardrobeItem) => void;
}
interface WardrobeItem {
    id: number;
    imageUrl: string;
    colors: string[];
    type: string;
    tags: string[];
    season?: string;
    brand?: string;
}
declare const EditClothingModal: React.FC<EditClothingModalProps>;
export default EditClothingModal;
