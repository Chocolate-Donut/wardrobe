import React from 'react';
interface Props {
    visible: boolean;
    onClose: () => void;
    onSelect: (outfitId: number) => void;
}
declare const OutfitPickerModal: React.FC<Props>;
export default OutfitPickerModal;
