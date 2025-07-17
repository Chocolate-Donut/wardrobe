import React from 'react';
import './ConstructorPage.css';
declare global {
    interface Window {
        lastPinchDist?: number | null;
    }
}
declare const ConstructorPage: React.FC;
export default ConstructorPage;
