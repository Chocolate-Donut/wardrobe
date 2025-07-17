import React from 'react';
import './RandomLookModal.css';
interface Props {
    visible: boolean;
    onClose: () => void;
    onApply: (items: any[]) => void;
}
declare const RandomLookModal: React.FC<Props>;
export default RandomLookModal;
