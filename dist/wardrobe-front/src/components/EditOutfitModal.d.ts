import React from 'react';
interface EditOutfitModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (updated: any) => void;
    outfit: any;
}
declare const EditOutfitModal: React.FC<EditOutfitModalProps>;
export default EditOutfitModal;
