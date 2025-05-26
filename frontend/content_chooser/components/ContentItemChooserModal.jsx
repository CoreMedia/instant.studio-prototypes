import React, { useState, useRef, useEffect } from 'react';
import FolderTree from './FolderTree';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import SmartDisplayOutlinedIcon from '@mui/icons-material/SmartDisplayOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';

const STORAGE_KEY = 'content_chooser_state';

const getFolderPath = (folders, currentId) => {
  const path = [];
  let curr = folders.find(f => f.id === currentId);
  while (curr) {
    path.unshift(curr);
    curr = curr.parent ? folders.find(f => f.id === curr.parent) : null;
  }
  return path;
};

const getFolderPathIds = (folders, currentId) => {
  const path = [];
  let curr = folders.find(f => f.id === currentId);
  while (curr) {
    path.unshift(curr.id);
    curr = curr.parent ? folders.find(f => f.id === curr.parent) : null;
  }
  return path;
};

const ContentItemChooserModal = ({ onClose, onAdd, onAddAndClose, items }) => {
  // Folders and content items
  const folders = items.filter(i => i.type === 'Folder');
  
  // Load saved state from localStorage
  const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  const [currentFolder, setCurrentFolder] = useState(savedState.currentFolder || 'root');
  const [selected, setSelected] = useState([]);
  const modalRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [modalSize, setModalSize] = useState(savedState.modalSize || { width: 800, height: 600 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const [treeWidth, setTreeWidth] = useState(savedState.treeWidth || 25); // percentage
  const [isTreeExpanded, setIsTreeExpanded] = useState(savedState.isTreeExpanded !== false); // default to true
  const isDraggingSeparator = useRef(false);
  const resizeObserver = useRef(null);

  // Get initial expanded folders
  const initialExpandedFolders = new Set(getFolderPathIds(folders, currentFolder));

  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      currentFolder,
      treeWidth,
      modalSize,
      isTreeExpanded
    }));
  }, [currentFolder, treeWidth, modalSize, isTreeExpanded]);

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

  // Set up resize observer to track modal size changes
  useEffect(() => {
    if (modalRef.current) {
      resizeObserver.current = new ResizeObserver(entries => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          setModalSize({ width, height });
        }
      });
      resizeObserver.current.observe(modalRef.current);
    }

    return () => {
      if (resizeObserver.current) {
        resizeObserver.current.disconnect();
      }
    };
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
    } else if (isDraggingSeparator.current) {
      const modalRect = modalRef.current.getBoundingClientRect();
      const newWidth = ((e.clientX - modalRect.left) / modalRect.width) * 100;
      setTreeWidth(Math.max(20, Math.min(40, newWidth)));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    isDraggingSeparator.current = false;
    document.body.style.cursor = '';
  };

  const handleSeparatorMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    isDraggingSeparator.current = true;
    document.body.style.cursor = 'col-resize';
  };

  useEffect(() => {
    if (isDragging || isDraggingSeparator.current) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isDraggingSeparator.current]);

  // Filter for current folder
  const subfolders = folders.filter(f => f.parent === currentFolder);
  const contentItems = items.filter(i => i.parent === currentFolder && i.type !== 'Folder');

  // Sort: folders by name, then content by type then name
  subfolders.sort((a, b) => a.name.localeCompare(b.name));
  contentItems.sort((a, b) => {
    if (a.type !== b.type) return a.type.localeCompare(b.type);
    return a.name.localeCompare(b.name);
  });
  const gridItems = [...subfolders, ...contentItems];

  // Breadcrumb
  const path = getFolderPath(folders, currentFolder);

  const handleRowDoubleClick = (item, idx) => {
    if (item.type === 'Folder') {
      setCurrentFolder(item.id);
      setSelected([]);
    } else {
      // Find the index in the original items array
      const realIdx = items.findIndex(i => i === item);
      onAddAndClose([realIdx]);
    }
  };

  const handleBreadcrumbClick = (folderId) => {
    setCurrentFolder(folderId);
    setSelected([]);
  };

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
          transform: 'none',
          width: `${modalSize.width}px`,
          height: `${modalSize.height}px`
        }}
      >
        {/* Title row */}
        <div className="chooser-header">
          <span>Content Item Chooser</span>
          <button className="chooser-close" onClick={onClose}><CloseOutlinedIcon /></button>
        </div>
        {/* Toolbar row */}
        <div className="chooser-toolbar">
          {/* Back button */}
          <button className="chooser-toolbar-btn" title="Back" onClick={() => {
            const parent = folders.find(f => f.id === currentFolder)?.parent;
            if (parent) setCurrentFolder(parent);
          }} disabled={currentFolder === 'root'}><ArrowBackOutlinedIcon /></button>
          <button className="chooser-toolbar-btn" title="Forward" disabled><ArrowForwardOutlinedIcon /></button>
          <div className="chooser-toolbar-btn-group">
            <button className="active"><FolderOutlinedIcon /></button>
            <button disabled><SearchOutlinedIcon /></button>
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
            <button className="active" title="List view"><MenuOutlinedIcon /></button>
            <button title="Thumbnail view" disabled><GridViewOutlinedIcon /></button>
          </div>
        </div>

        {/* Split view */}
        <div className="chooser-split-view">
          {/* Tree section */}
          <div 
            className={`chooser-tree-section ${!isTreeExpanded ? 'collapsed' : ''}`} 
            style={{ width: isTreeExpanded ? `${treeWidth}%` : '40px' }}
          >
            <button 
              className="tree-toggle-btn"
              onClick={() => setIsTreeExpanded(!isTreeExpanded)}
              title={isTreeExpanded ? "Collapse tree" : "Expand tree"}
            >
              {isTreeExpanded ? <ChevronLeftOutlinedIcon /> : <ChevronRightOutlinedIcon />}
            </button>
            {isTreeExpanded && (
              <FolderTree
                folders={folders}
                currentFolder={currentFolder}
                onFolderSelect={setCurrentFolder}
                initialExpandedFolders={initialExpandedFolders}
              />
            )}
          </div>

          {/* Separator */}
          {isTreeExpanded && (
            <div
              className="chooser-split-separator"
              onMouseDown={handleSeparatorMouseDown}
            />
          )}

          {/* Content section */}
          <div className="chooser-content-section">
            {/* Breadcrumb */}
            <div className="chooser-breadcrumb">
              {path.map((folder, idx) => (
                <span key={folder.id}>
                  {idx > 0 && ' / '}
                  <a
                    href="#"
                    style={{ color: idx === path.length - 1 ? '#222' : '#1e90c6', textDecoration: idx === path.length - 1 ? 'none' : 'underline', cursor: idx === path.length - 1 ? 'default' : 'pointer' }}
                    onClick={e => {
                      e.preventDefault();
                      if (idx !== path.length - 1) handleBreadcrumbClick(folder.id);
                    }}
                  >
                    {folder.name}
                  </a>
                </span>
              ))}
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
                  {gridItems.map((item, idx) => {
                    // Find the index in the original items array
                    const realIdx = items.findIndex(i => i === item);
                    return (
                      <tr
                        key={realIdx}
                        className={selected.includes(realIdx) ? 'selected' : ''}
                        onClick={() => toggleSelect(realIdx)}
                        onDoubleClick={() => handleRowDoubleClick(item, realIdx)}
                      >
                        <td><span className="chooser-icon">{
                          item.type === 'Folder' ? <FolderOutlinedIcon /> :
                          item.type === 'Article' ? <DescriptionOutlinedIcon /> :
                          item.type === 'Picture' ? <ImageOutlinedIcon /> :
                          item.type === 'Teaser' ? <EditNoteOutlinedIcon /> :
                          item.type === 'Video' ? <SmartDisplayOutlinedIcon /> :
                          <HelpOutlineOutlinedIcon />
                        }</span> {item.type}</td>
                        <td>{item.name}</td>
                        <td>{item.creationDate}</td>
                        <td><span className="chooser-icon">{
                          item.state === 'Checked In' ? <LockOutlinedIcon /> :
                          item.state === 'Checked Out' ? <LockOpenOutlinedIcon /> :
                          item.state === 'Approved' ? <CheckCircleOutlinedIcon /> :
                          item.state === 'Published' ? <PublicOutlinedIcon /> :
                          item.state === 'Deleted' ? <DeleteOutlineOutlinedIcon /> :
                          <HelpOutlineOutlinedIcon />
                        }</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="chooser-footer">
          <span>{gridItems.length} items</span>
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