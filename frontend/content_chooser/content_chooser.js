import React, { useState, useRef } from 'react';
import './style.css';

const MIN_WIDTH = 200;

const ContentChooser = () => {
  const [formWidth, setFormWidth] = useState(window.innerWidth / 2);
  const dragging = useRef(false);

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

  const [modalOpen, setModalOpen] = useState(false);

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
            <div className="media-link" onClick={() => setModalOpen(true)}>
              <div className="media-thumb" />
              <span>Young Chef in Kitchen Picture</span>
            </div>
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
          <div className="preview-image-placeholder" />
          <div className="preview-text">
            Productivity and experience enhancements are made possible by Chef Corp. Integrated Technology for a Seamless Guest Experience. This interconnected system of handheld ordering and payment devices as well as kitchen order display and inquire devices enables your kitchen staff to go to work while the order is still being placed.<br /><br />
            In high class restaurants, waiters are proud to memorize your order and even your special wishes by heart. If your staff is on that level, don't read any further. Most waiters, though, rely on pen and paper which are still staples of the restaurant world today. There is nothing wrong with that, since this is often still the most effective means of getting the order to the kitchen and keep everything organized until the bill has to be produced.<br /><br />
            However, new technology allows for so much more. A kitchen that has the order of the first guest in the pan while the second is still ordering is a kitchen that can serve more guests, faster, and with fewer mistakes.
          </div>
        </div>
      </div>

      {/* Modal for Content Item Chooser */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-window" onClick={e => e.stopPropagation()}>
            <div className="modal-placeholder">Content item chooser</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentChooser;
