import React, { useState, useRef, useEffect } from 'react';
import '../style.css';
import chooserData from '../chooser_data.json';
import { MIN_WIDTH } from '../constants';
import ContentItemChooserModal from './ContentItemChooserModal';

// Function to generate a consistent color based on item properties
const getItemColor = (item) => {
  // Create a hash from the item's name and type
  const hash = `${item.name}${item.type}`.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  // Array of visually distinct colors
  const colors = [
    '#FFB74D', // Orange
    '#4FC3F7', // Light Blue
    '#81C784', // Green
    '#BA68C8', // Purple
    '#F06292', // Pink
    '#FF8A65', // Coral
    '#64B5F6', // Blue
    '#4DB6AC', // Teal
    '#FFD54F', // Yellow
    '#A1887F', // Brown
    '#90A4AE', // Blue Grey
    '#7986CB', // Indigo
  ];
  
  // Use the hash to select a color
  return colors[Math.abs(hash) % colors.length];
};

const ContentChooser = () => {
  const [formWidth, setFormWidth] = useState(window.innerWidth / 2);
  const dragging = useRef(false);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [mediaSelection, setMediaSelection] = useState([]);
  const [clipboard, setClipboard] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  React.useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragging.current) return;
      const newWidth = Math.max(MIN_WIDTH, Math.min(e.clientX, window.innerWidth - MIN_WIDTH));
      setFormWidth(newWidth);
    };
    const handleMouseUp = () => {
      dragging.current = false;
      document.body.style.cursor = '';
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const startDrag = () => {
    dragging.current = true;
    document.body.style.cursor = 'col-resize';
  };

  const handleAdd = (selectedIndices) => {
    const newItems = selectedIndices.map(idx => chooserData[idx]);
    setSelectedMedia(prev => [...prev, ...newItems]);
  };

  const handleAddAndClose = (selectedIndices) => {
    handleAdd(selectedIndices);
    setModalOpen(false);
  };

  const handleDelete = () => {
    setSelectedMedia(prev => prev.filter((_, idx) => !mediaSelection.includes(idx)));
    setMediaSelection([]);
  };
  const handleCut = () => {
    setClipboard(selectedMedia.filter((_, idx) => mediaSelection.includes(idx)));
    setSelectedMedia(prev => prev.filter((_, idx) => !mediaSelection.includes(idx)));
    setMediaSelection([]);
  };
  const handleCopy = () => {
    setClipboard(selectedMedia.filter((_, idx) => mediaSelection.includes(idx)));
  };
  const handlePaste = () => {
    if (clipboard.length > 0) {
      setSelectedMedia(prev => [...prev, ...clipboard]);
    }
  };

  const toggleMediaSelect = (idx) => {
    setMediaSelection(sel =>
      sel.includes(idx) ? sel.filter(i => i !== idx) : [...sel, idx]
    );
  };
  const isSelected = idx => mediaSelection.includes(idx);

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
    e.target.classList.add('dragging');
  };

  const handleDragEnd = (e) => {
    setDraggedItem(null);
    setDragOverIndex(null);
    e.target.classList.remove('dragging');
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === targetIndex) return;

    const newOrder = [...selectedMedia];
    const [movedItem] = newOrder.splice(draggedItem, 1);
    newOrder.splice(targetIndex, 0, movedItem);
    
    setSelectedMedia(newOrder);
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  return (
    <div className="studio-root">
      {/* Header Toolbar */}
      <div className="header-toolbar">
        <button className="hamburger">☰</button>
        <span className="header-title">Content</span>
        <div className="header-buttons">
          <button className="header-btn" />
          <button className="header-btn" />
          <button className="header-btn" />
        </div>
      </div>

      {/* Tabbed Panel */}
      <div className="tabbed-panel">
        <div className="tab active">Enjoy your passion</div>
      </div>

      {/* Main Content Area */}
      <div className="main-content" style={{position: 'relative'}}>
        {/* Left: Document Form */}
        <div
          className="form-section"
          style={{ width: formWidth, minWidth: MIN_WIDTH, maxWidth: window.innerWidth - MIN_WIDTH }}
        >
          {/* Details (expanded) */}
          <div className="form-group expanded">
            <div className="form-group-title">Details</div>
            <div className="form-field">
              <label>ARTICLE TITLE</label>
              <div className="input-placeholder">This is Chris - he started his own restaurant in Cape Town</div>
            </div>
            <div className="form-field">
              <label>ARTICLE TEXT</label>
              <div className="richtext-placeholder">
                <div className="richtext-toolbar">
                  <button>B</button><button>I</button><button>U</button><button>•</button><button>1.</button>
                </div>
                <div className="richtext-content">
                  Productivity and experience enhancements are made possible by Chef Corp. Integrated Technology for a Seamless Guest Experience. This interconnected system of handheld ordering and payment devices as well as kitchen order display and inquire devices enables your kitchen staff to go to work while the order is still being placed.<br /><br />
                  In high class restaurants, waiters are proud to memorize your order and even your special wishes by heart. If your staff is on that level, don't read any further. Most waiters, though, rely on pen and paper which are still staples of the restaurant world today. There is nothing wrong with that, since this is often still the most effective means of getting the order to the kitchen and keep everything organized until the bill has to be produced.<br /><br />
                  However, new technology allows for so much more. A kitchen that has the order of the first guest in the pan while the second is still ordering is a kitchen that can serve more guests, faster, and with fewer mistakes.
                </div>
              </div>
            </div>
          </div>

          {/* Teaser (collapsed) */}
          <div className="form-group collapsed">
            <div className="form-group-title">Teaser</div>
          </div>

          {/* Pictures and Other Media */}
          <div className="form-group expanded">
            <div className="form-group-title">Pictures and Other Media</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '8px 18px 0 18px' }}>
              <button title="Delete" onClick={handleDelete} disabled={mediaSelection.length === 0}>🗑️</button>
              <button title="Cut" onClick={handleCut} disabled={mediaSelection.length === 0}>✂️</button>
              <button title="Copy" onClick={handleCopy} disabled={mediaSelection.length === 0}>📋</button>
              <button title="Paste" onClick={handlePaste} disabled={clipboard.length === 0}>📥</button>
              <button title="Add" onClick={() => setModalOpen(true)}>＋</button>
            </div>
            {selectedMedia.map((item, index) => {
              const itemColor = getItemColor(item);
              return (
                <div
                  key={index}
                  className={`media-link${isSelected(index) ? ' selected' : ''}${draggedItem === index ? ' dragging' : ''}${dragOverIndex === index ? ' drag-over' : ''}`}
                  onClick={() => toggleMediaSelect(index)}
                  style={{ border: isSelected(index) ? '2px solid #1e90c6' : undefined }}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  <div 
                    className="media-thumb"
                    style={{
                      background: `repeating-linear-gradient(45deg, ${itemColor}, ${itemColor} 8px, #eaf6fb 8px, #eaf6fb 16px)`,
                      borderColor: itemColor
                    }}
                  />
                  <span>{item.name}</span>
                </div>
              );
            })}
            <input className="media-search" placeholder="Type here to search or drag and drop content onto this area." disabled />
          </div>
        </div>

        {/* Draggable Separator */}
        <div
          className="vertical-separator"
          onMouseDown={startDrag}
          style={{ left: formWidth - 4 }}
        />

        {/* Right: Preview */}
        <div
          className="preview-section"
          style={{ width: `calc(100% - ${formWidth}px)`, minWidth: MIN_WIDTH }}
        >
          <div className="preview-title">THIS IS CHRIS - HE STARTED HIS OWN RESTAURANT IN CAPE TOWN</div>
          {selectedMedia.length > 0 && (
            <div 
              className="preview-image-placeholder"
              style={{
                background: `repeating-linear-gradient(45deg, ${getItemColor(selectedMedia[0])}, ${getItemColor(selectedMedia[0])} 16px, #eaf6fb 16px, #eaf6fb 32px)`,
                borderColor: getItemColor(selectedMedia[0])
              }}
            />
          )}
          <div className="preview-text">
            Productivity and experience enhancements are made possible by Chef Corp. Integrated Technology for a Seamless Guest Experience. This interconnected system of handheld ordering and payment devices as well as kitchen order display and inquire devices enables your kitchen staff to go to work while the order is still being placed.<br /><br />
            In high class restaurants, waiters are proud to memorize your order and even your special wishes by heart. If your staff is on that level, don't read any further. Most waiters, though, rely on pen and paper which are still staples of the restaurant world today. There is nothing wrong with that, since this is often still the most effective means of getting the order to the kitchen and keep everything organized until the bill has to be produced.<br /><br />
            However, new technology allows for so much more. A kitchen that has the order of the first guest in the pan while the second is still ordering is a kitchen that can serve more guests, faster, and with fewer mistakes.
          </div>
        </div>
      </div>

      {/* Modal for Content Item Chooser */}
      {modalOpen && (
        <ContentItemChooserModal
          onClose={() => setModalOpen(false)}
          onAdd={handleAdd}
          onAddAndClose={handleAddAndClose}
          items={chooserData}
        />
      )}
    </div>
  );
};

export default ContentChooser; 