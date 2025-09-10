import React, { useState } from 'react';
import { X } from 'lucide-react';
import { modalStyles as styles } from '../assets/dummystyle';
import Resume1 from '../assets/Resume1.png';
import Resume2 from '../assets/Resume2.png';
import Resume3 from '../assets/Resume3.png';

const TemplateGallery = () => {
  const templates = [
    {
      id: 'modern',
      name: 'Modern',
      description: 'Clean and professional design with modern typography',
      preview: Resume1,
      color: 'from-violet-500 to-fuchsia-500'
    },
    {
      id: 'classic',
      name: 'Classic',
      description: 'Traditional layout with elegant spacing and typography',
      preview: Resume2,
      color: 'from-blue-500 to-indigo-500'
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Simple and clean design focusing on content',
      preview: Resume3,
      color: 'from-emerald-500 to-teal-500'
    }
  ];

  return (
    <div className="flex flex-row gap-4 max-h-[60vh] overflow-hidden">
      {templates.map((template) => (
        <div key={template.id} className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 flex-1">
          <div className="aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-3">
            <img 
              src={template.preview} 
              alt={`${template.name} template`}
              className="w-full h-full object-cover rounded-lg border border-gray-200"
            />
          </div>
          <div className="p-3">
            <h3 className="font-semibold text-gray-900 text-sm mb-1">{template.name}</h3>
            <p className="text-xs text-gray-600 leading-relaxed">{template.description}</p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
      ))}
    </div>
  );
};

const Modal = ({
  children,
  isOpen,
  onClose,
  title,
  hideHeader,                             //NEXT 4 ARE FOR EDITRESUME
  showActionBtn,
  actionBtnIcon = null,
  actionBtnText,
  onActionClick = () => { },
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>

        {!hideHeader && (
          <div className={styles.header}>
            <h3 className={styles.title}>{title}</h3>

            {/* DOWNLOAD BTN */}
            {showActionBtn && (
              <button className={styles.actionButton} onClick={onActionClick}>
                {actionBtnIcon}
                {actionBtnText}
              </button>
            )}

          </div>
        )}

        <button type="button" className={styles.closeButton} onClick={onClose}>
          <X size={20} />
        </button>

        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
export { TemplateGallery };
