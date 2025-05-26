import React, { useState, useRef, useEffect } from 'react';
import { ICONS } from '../constants';

const ContentItemChooserModal = ({ onClose, onAdd, onAddAndClose, items }) => {
  const [selected, setSelected] = useState([]);
  const modalRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Center the modal in the viewport
    if (modalRef.current) {
      const modalRect = modalRef.current.getBoundingClientRect();
      setPosition({
        x: (window.innerWidth - modalRect.width) / 2,
        y: (window.innerHeight - modalRect.height) / 2
      });
    }
  }, []);

  const handleMouseDown = (e) => {
    if (e.target.closest('.chooser-header')) {
      setIsDragging(true);
      dragStartPos.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y
      };
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStartPos.current.x,
        y: e.clientY - dragStartPos.current.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  const toggleSelect = (idx) => {
    setSelected((sel) =>
      sel.includes(idx) ? sel.filter((i) => i !== idx) : [...sel, idx]
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        ref={modalRef}
        className="modal-window chooser-modal" 
        onClick={e => e.stopPropagation()}
        onMouseDown={handleMouseDown}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'none'
        }}
      >
        {/* Title row */}
        <div className="chooser-header">
          <span>Content Item Chooser</span>
          <button className="chooser-close" onClick={onClose}>✕</button>
        </div>
        {/* Toolbar row */}
        <div className="chooser-toolbar">
          <button className="chooser-toolbar-btn" title="Back">←</button>
          <button className="chooser-toolbar-btn" title="Forward">→</button>
          <div className="chooser-toolbar-btn-group">
            <button className="active">📂</button>
            <button disabled>🔍</button>
          </div>
          <div className="chooser-toolbar-spacer" />
          <select className="chooser-type-filter" disabled>
            <option>All</option>
            <option>Folder</option>
            <option>Article</option>
            <option>Picture</option>
            <option>Teaser</option>
            <option>Video</option>
          </select>
          <input className="chooser-search" placeholder="Search" disabled />
          <div className="chooser-view-btn-group">
            <button className="active" title="List view">☰</button>
            <button title="Thumbnail view" disabled>▦</button>
          </div>
        </div>
        {/* Breadcrumb */}
        <div className="chooser-breadcrumb">
          Chef Corp. / Editorial / <b>Downloads</b>
        </div>
        {/* Grid */}
        <div className="chooser-grid-container">
          <table className="chooser-grid">
            <thead>
              <tr>
                <th>Type</th>
                <th>Name</th>
                <th>Created</th>
                <th>State</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr
                  key={idx}
                  className={selected.includes(idx) ? 'selected' : ''}
                  onClick={() => toggleSelect(idx)}
                  onDoubleClick={() => onAddAndClose([idx])}
                >
                  <td><span className="chooser-icon">{ICONS[item.type] || '❓'}</span> {item.type}</td>
                  <td>{item.name}</td>
                  <td>{item.creationDate}</td>
                  <td><span className="chooser-icon">{ICONS[item.state] || '❓'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Footer */}
        <div className="chooser-footer">
          <span>{items.length} items</span>
          <div className="chooser-footer-btns">
            <button onClick={onClose}>Cancel</button>
            <button disabled={selected.length === 0} onClick={() => onAdd(selected)}>
              Add
            </button>
            <button disabled={selected.length === 0} onClick={() => onAddAndClose(selected)}>
              Add & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentItemChooserModal; 