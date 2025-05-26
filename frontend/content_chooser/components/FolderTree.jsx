import React, { useState, useEffect } from 'react';
import { ICONS } from '../constants';

const FolderTree = ({ folders, currentFolder, onFolderSelect, initialExpandedFolders = new Set() }) => {
  const [expandedFolders, setExpandedFolders] = useState(initialExpandedFolders);

  // Update expanded folders when currentFolder changes
  useEffect(() => {
    if (currentFolder) {
      const path = [];
      let curr = folders.find(f => f.id === currentFolder);
      while (curr) {
        path.unshift(curr.id);
        curr = curr.parent ? folders.find(f => f.id === curr.parent) : null;
      }
      setExpandedFolders(new Set(path));
    }
  }, [currentFolder, folders]);

  const toggleFolder = (folderId, e) => {
    e.stopPropagation();
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const renderFolder = (folder) => {
    const children = folders.filter(f => f.parent === folder.id);
    const isExpanded = expandedFolders.has(folder.id);
    const isSelected = currentFolder === folder.id;

    return (
      <div key={folder.id} className="folder-tree-item">
        <div 
          className={`folder-tree-row ${isSelected ? 'selected' : ''}`}
          onClick={() => onFolderSelect(folder.id)}
        >
          <span 
            className="folder-tree-toggle"
            onClick={(e) => toggleFolder(folder.id, e)}
          >
            {children.length > 0 ? (isExpanded ? '▼' : '▶') : ' '}
          </span>
          <span className="folder-tree-icon">{ICONS.Folder}</span>
          <span className="folder-tree-name">{folder.name}</span>
        </div>
        {isExpanded && children.length > 0 && (
          <div className="folder-tree-children">
            {children.map(child => renderFolder(child))}
          </div>
        )}
      </div>
    );
  };

  const rootFolders = folders.filter(f => f.parent === null);
  return (
    <div className="folder-tree">
      {rootFolders.map(folder => renderFolder(folder))}
    </div>
  );
};

export default FolderTree; 