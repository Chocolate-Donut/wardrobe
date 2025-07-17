import React from 'react';
interface LookCardProps {
    look: any;
    isAuthorized?: boolean;
    isInitiallyFavorite?: boolean;
    onRemoveFavorite?: (id: number) => void;
    onDelete?: (id: number) => void;
    isSelected?: boolean;
    isSelectMode?: boolean;
    onSelect?: (id: number) => void;
    onEdit?: (id: number) => void;
}
declare const LookCard: React.FC<LookCardProps>;
export default LookCard;
