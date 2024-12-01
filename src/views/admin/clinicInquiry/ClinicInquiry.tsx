import React, { useState } from "react";
import { Space, Table,Button, Modal, Form, Input, } from 'antd';
interface ModalProps {
    title: string;
    open: boolean;
    onClose: () => void;
  }
const ClinicInquiry =()=>{
    const Modal: React.FC<ModalProps> = ({ title, open, onClose }) => {
        if (!open) {
          return null;
        }

    return (
        <div className="modal">
        <div className="modal-overlay" onClick={onClose} />
        <div className="modal-content">
          <div className="modal-header">
            <h2>{title}</h2>
            <button className="modal-close" onClick={onClose}>x</button>
          </div>
          <div className="modal-body">
            
          </div>
        </div>
      </div>
      );   
}
}
export default ClinicInquiry