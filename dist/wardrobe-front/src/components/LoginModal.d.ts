import React from 'react';
import './LoginModal.css';
interface LoginModalProps {
    visible: boolean;
    onClose: () => void;
    onLoginSuccess?: () => void;
}
declare const LoginModal: React.FC<LoginModalProps>;
export default LoginModal;
