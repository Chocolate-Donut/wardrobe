import React from "react";
import "./BubbleButton.css";
interface BubbleButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
}
declare const BubbleButton: React.FC<BubbleButtonProps>;
export default BubbleButton;
