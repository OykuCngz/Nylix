import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';

const VisionBoard = ({ onBack, onRequireAuth, showNotification, navigate, setActiveVision }) => {
  const fileInputRef = useRef(null);
  const [visions, setVisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newVision, setNewVision] = useState({ title: '', category: 'Fundamental', description: '', images: [], layout: 'focus', size: 'medium', offsets: {} });
  const [token] = useState(localStorage.getItem('token'));

  const fetchVisions = async () => {
    try {
      const resp = await api.get('/visions');
      setVisions(resp.data.length > 0 ? resp.data : [
        {
          _id: '1',
          title: "Architecture Studio",
          category: "Agenda",
          description: "A sanctuary for focused design.",
          images: ["https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&q=80&w=600", "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400", "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=400"],
          layout: 'focus',
          size: "large"
        }
      ]);
    } catch (err) {
      console.error('Fetch visions error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisions();
  }, []);

  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    setUploading(true);

    try {
      const resp = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setNewVision({ ...newVision, images: [...newVision.images, ...resp.data.imageUrls].slice(0, 6) });
      showNotification(`${resp.data.imageUrls.length} images processed.`, "success");
    } catch (err) {
      showNotification("Upload failed.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!token) {
        onRequireAuth();
        return;
    }
    try {
      await api.post('/visions', newVision);
      setShowModal(false);
      setNewVision({ title: '', category: 'Fundamental', description: '', images: [], layout: 'focus', size: 'medium' });
      fetchVisions();
      showNotification("Vision collage archived.", "success");
    } catch (err) {
        showNotification("Failed to save vision.", "error");
    }
  };

  // Handle image reordering
  const moveImage = (index, direction) => {
    const newImgs = [...newVision.images];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newImgs.length) return;
    
    // Swap
    [newImgs[index], newImgs[targetIndex]] = [newImgs[targetIndex], newImgs[index]];
    setNewVision({ ...newVision, images: newImgs });
  };

  const removeImage = (index) => {
    const newImgs = newVision.images.filter((_, i) => i !== index);
    setNewVision({ ...newVision, images: newImgs });
  };

  // Panning Logic
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [activeDragIdx, setActiveDragIdx] = useState(null);

  const startDrag = (e, index) => {
    setIsDragging(true);
    setDragStartY(e.clientY);
    setActiveDragIdx(index);
    e.preventDefault();
  };

  const handleDrag = (e) => {
    if (!isDragging || activeDragIdx === null) return;
    const deltaY = e.clientY - dragStartY;
    const currentOffset = newVision.offsets[activeDragIdx] || 50;
    const newOffset = Math.max(0, Math.min(100, currentOffset - (deltaY * 0.1))); // Sensitivity adjustment
    
    setNewVision({
      ...newVision,
      offsets: { ...newVision.offsets, [activeDragIdx]: newOffset }
    });
    setDragStartY(e.clientY);
  };

  const stopDrag = () => {
    setIsDragging(false);
    setActiveDragIdx(null);
  };

  const [draggingIndex, setDraggingIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const onDragStart = (e, index) => {
    e.dataTransfer.setData("sourceIndex", index.toString());
    setDraggingIndex(index);
  };

  const onDragOver = (e, index) => {
    e.preventDefault();
    if (draggingIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const onDrop = (e, targetIndex) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData("sourceIndex"));
    setDraggingIndex(null);
    setDragOverIndex(null);
    
    if (isNaN(sourceIndex) || sourceIndex === targetIndex) return;

    const updatedImages = [...newVision.images];
    const updatedOffsets = { ...newVision.offsets };

    const tempImg = updatedImages[sourceIndex];
    updatedImages[sourceIndex] = updatedImages[targetIndex];
    updatedImages[targetIndex] = tempImg;

    const tempOffset = updatedOffsets[sourceIndex];
    updatedOffsets[sourceIndex] = updatedOffsets[targetIndex];
    updatedOffsets[targetIndex] = tempOffset;

    setNewVision({
        ...newVision,
        images: updatedImages,
        offsets: updatedOffsets
    });
  };

  // Helper to get full image URL
  const getFullUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://localhost:3001${url}`; // Base backend port
  };

  // Helper to render collage based on layout
  const renderCollage = (visionImages, layout = 'focus', isPreview = false, explicitOffsets = null) => {
    const imgs = visionImages && visionImages.length > 0 ? visionImages : [];
    const offsets = explicitOffsets || newVision.offsets || {};
    
    if (imgs.length === 0) return (
      <div className="text-center p-5 opacity-40 d-flex flex-column align-items-center">
         <div className="mb-3" style={{ fontSize: '4rem' }}>
            <i className="bi bi-layers text-muted opacity-25"></i>
         </div>
         <div className="ls-2 fw-bold text-uppercase mb-2" style={{ fontSize: '0.85rem', color: '#475569' }}>CANVAS EMPTY</div>
         <div className="smallest text-muted px-4" style={{ maxWidth: '250px', lineHeight: '1.4' }}>
           Your architectural intent will materialize here as you import assets.
         </div>
      </div>
    );

    if (layout === 'grid') {
      return (
        <div className="d-grid h-100 w-100 p-1" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gridTemplateRows: 'repeat(3, 1fr)', gap: '6px' }}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`position-relative group overflow-hidden rounded-2 transition-all ${dragOverIndex === i ? 'ring-2 ring-success' : ''}`}
                 onDragOver={(e) => isPreview && onDragOver(e, i)}
                 onDragLeave={() => setDragOverIndex(null)}
                 onDrop={(e) => isPreview && onDrop(e, i)}>
              {imgs[i] ? (
                <>
                  <img src={getFullUrl(imgs[i])} 
                       className="w-100 h-100 object-fit-cover cursor-move" 
                       style={{ objectPosition: `center ${offsets[i] || 50}%` }}
                       onMouseDown={(e) => isPreview && startDrag(e, i)}
                       alt="" />
                  {isPreview && (
                    <>
                       <div className="position-absolute top-0 start-0 m-1 bg-white/80 rounded-circle d-flex align-items-center justify-content-center shadow-sm cursor-grab"
                            style={{ width: '22px', height: '22px', zIndex: 30 }}
                            draggable="true"
                            onDragStart={(e) => onDragStart(e, i)}>
                          <i className="bi bi-arrows-move smallest text-dark"></i>
                       </div>
                       <button type="button" className="btn btn-xs btn-danger position-absolute top-0 end-0 m-1 shadow-sm rounded-circle" 
                               style={{ width: '22px', height: '22px', padding: 0 }}
                               onClick={() => removeImage(i)}>×</button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-100 h-100 bg-dark/5 d-flex align-items-center justify-content-center border-dashed cursor-pointer hover-bg-light transition-all"
                     onClick={() => isPreview && fileInputRef.current?.click()}>
                   <i className="bi bi-plus text-muted fs-4"></i>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }
    
    if (layout === 'mosaic') {
      const scrapbookPositions = [
        // Top row - 3 columns
        { top: '12%', left: '8%', width: '30%', height: '32%', rot: '-2deg', z: 5 },
        { top: '8%', left: '35%', width: '32%', height: '35%', rot: '1deg', z: 4 },
        { top: '12%', left: '65%', width: '28%', height: '30%', rot: '3deg', z: 3 },
        // Bottom row - 3 columns, slightly offset
        { top: '50%', left: '5%', width: '28%', height: '35%', rot: '2deg', z: 6 },
        { top: '52%', left: '32%', width: '38%', height: '38%', rot: '-1deg', z: 7 },
        { top: '48%', left: '68%', width: '26%', height: '34%', rot: '4deg', z: 5 }
      ];

      return (
        <div className="position-relative w-100 h-100 bg-light/10 overflow-hidden collage-grid-canvas" style={{ minHeight: isPreview ? '600px' : '400px' }}>
          {imgs.map((src, i) => {
            const pos = scrapbookPositions[i] || scrapbookPositions[i % scrapbookPositions.length];
            return (
              <div key={i} 
                   className={`position-absolute shadow-premium rounded-2 overflow-hidden collage-item transition-all ${dragOverIndex === i ? 'scale-105 shadow-lg border-success' : ''}`}
                   onDragOver={(e) => isPreview && onDragOver(e, i)}
                   onDragLeave={() => setDragOverIndex(null)}
                   onDrop={(e) => isPreview && onDrop(e, i)}
                   style={{ 
                     top: pos.top, 
                     left: pos.left, 
                     width: pos.width, 
                     height: pos.height,
                     zIndex: draggingIndex === i ? 100 : pos.z,
                     transform: draggingIndex === i ? 'scale(1.05)' : `rotate(${pos.rot})`,
                     backgroundColor: '#fff',
                     padding: '4px',
                     border: dragOverIndex === i ? '2px solid #10b981' : '1px solid #f1f5f9'
                   }}>
                 <img src={getFullUrl(src)} 
                      className="w-100 h-100 object-fit-cover cursor-move" 
                      style={{ objectPosition: `center ${offsets[i] || 50}%` }}
                      onMouseDown={(e) => isPreview && startDrag(e, i)}
                      alt="" />
                 {isPreview && (
                    <>
                       <div className="position-absolute top-0 start-0 m-2 bg-white/90 rounded-circle d-flex align-items-center justify-content-center shadow-md cursor-grab"
                            style={{ width: '26px', height: '26px', zIndex: 30 }}
                            draggable="true"
                            onDragStart={(e) => onDragStart(e, i)}>
                          <i className="bi bi-arrows-move text-dark fs-6"></i>
                       </div>
                       <button type="button" className="btn btn-xs btn-danger position-absolute top-0 end-0 m-2 shadow-sm rounded-circle" 
                               style={{ width: '22px', height: '22px', padding: 0, zIndex: 20 }}
                               onClick={() => removeImage(i)}>×</button>
                    </>
                 )}
              </div>
            );
          })}
          
          {/* Decorative dot grid only for scrapbook mode */}
          <div className="position-absolute w-100 h-100 top-0 start-0 pointer-events-none opacity-20" 
               style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        </div>
      );
    }

    // Default: Focus Layout
    if (layout === 'focus' || true) { // Defaulting to Focus
      return (
        <div className="w-100 h-100 p-3 d-flex flex-column animate-fade-in bg-white overflow-hidden">
           <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="smallest fw-bold ls-3 text-muted opacity-50">01 / REFINED FOCUS (6 IMAGES)</span>
           </div>
           
           <div className="d-grid flex-grow-1" style={{ 
             gridTemplateColumns: 'repeat(3, 1fr)', 
             gridTemplateRows: 'repeat(3, minmax(0, 1fr))', 
             gap: '10px',
             maxHeight: '100%'
           }}>
              {/* Top Row - 3 small items */}
              {[0, 1, 2].map(i => (
                 <div key={i} className="position-relative shadow-sm rounded-3 overflow-hidden border border-light border-dashed"
                      style={{ gridColumn: i + 1, gridRow: 1 }}>
                    {imgs[i+1] ? (
                       <>
                          <img src={getFullUrl(imgs[i+1])} 
                               className="w-100 h-100 object-fit-cover cursor-move" 
                               style={{ objectPosition: `center ${offsets[i+1] || 50}%` }}
                               onMouseDown={(e) => isPreview && startDrag(e, i+1)} alt="" />
                          {isPreview && (
                             <button type="button" className="btn btn-xs btn-danger position-absolute top-0 end-0 m-1 shadow-sm rounded-circle" onClick={() => removeImage(i+1)}>×</button>
                          )}
                       </>
                    ) : (
                       <div className="w-100 h-100 d-flex align-items-center justify-content-center cursor-pointer hover-bg-light"
                            onClick={() => isPreview && fileInputRef.current?.click()}>
                          <i className="bi bi-plus text-muted opacity-20"></i>
                       </div>
                    )}
                 </div>
              ))}

              {/* Main Primary Intent - Spans 2x2 in bottom left */}
              <div className="position-relative shadow-premium rounded-3 overflow-hidden border border-light" 
                   style={{ gridColumn: '1 / span 2', gridRow: '2 / span 2', zIndex: 10 }}>
                 {imgs[0] ? (
                    <img src={getFullUrl(imgs[0])} 
                         className="w-100 h-100 object-fit-cover cursor-move" 
                         style={{ objectPosition: `center ${offsets[0] || 50}%` }}
                         onMouseDown={(e) => isPreview && startDrag(e, 0)} alt="" />
                 ) : (
                    <div className="w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-light/30 border-dashed cursor-pointer"
                         onClick={() => isPreview && fileInputRef.current?.click()}>
                       <i className="bi bi-plus fs-2 text-muted opacity-30"></i>
                       <span className="smallest text-muted ls-2 fw-bold mt-2 opacity-40">PRIMARY INTENT</span>
                    </div>
                 )}
                 {isPreview && imgs[0] && (
                    <button type="button" className="btn btn-xs btn-danger position-absolute top-0 end-0 m-2 shadow-sm rounded-circle" onClick={() => removeImage(0)}>×</button>
                 )}
              </div>

              {/* Right Side Support items - 2 items */}
              {[4, 5].map((idx, i) => (
                 <div key={idx} className="position-relative shadow-sm rounded-3 overflow-hidden border border-light border-dashed"
                      style={{ gridColumn: 3, gridRow: i + 2 }}>
                    {imgs[idx] ? (
                       <>
                          <img src={getFullUrl(imgs[idx])} 
                               className="w-100 h-100 object-fit-cover cursor-move" 
                               style={{ objectPosition: `center ${offsets[idx] || 50}%` }}
                               onMouseDown={(e) => isPreview && startDrag(e, idx)} alt="" />
                          {isPreview && (
                             <button type="button" className="btn btn-xs btn-danger position-absolute top-0 end-0 m-1 shadow-sm rounded-circle" onClick={() => removeImage(idx)}>×</button>
                          )}
                       </>
                    ) : (
                       <div className="w-100 h-100 d-flex align-items-center justify-content-center cursor-pointer hover-bg-light"
                            onClick={() => isPreview && fileInputRef.current?.click()}>
                          <i className="bi bi-plus text-muted opacity-20"></i>
                       </div>
                    )}
                 </div>
              ))}
           </div>
        </div>
      );
    }
  };

  const convertToTask = async (vision) => {
    if (!token) {
        onRequireAuth();
        return;
    }
    try {
      await api.post('/todos', {
        title: vision.title,
        description: vision.description,
        priority: 'high',
        status: 'pending'
      });
      setActiveVision(vision);
      showNotification(`"${vision.title}" pinned to blueprint.`, 'success');
      setTimeout(() => { if (navigate) navigate('blueprint'); }, 800);
    } catch (err) {
      showNotification("Failed to transition vision.", 'error');
    }
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showModal]);

  return (
    <div className="vision-board-wrapper view-section" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Search & Header - Added pt-3 for breathing room from sticky navigation */}
      <div className="d-flex justify-content-between align-items-center mb-5 pt-3 px-1">
        <div>
          <h1 className="font-heading fw-bold mb-0 display-5">Vision Board</h1>
          <p className="text-muted smallest ls-2 text-uppercase fw-bold">Archive of Intentions</p>
        </div>
        <div className="d-flex gap-3">
           <button className="btn btn-premium bg-white shadow-sm px-4" onClick={onBack}>
              <i className="bi bi-arrow-left me-2"></i> Dismiss
           </button>
           <button 
             className="btn btn-premium text-white" 
             style={{ backgroundColor: 'var(--nylix-accent)' }}
             onClick={() => setShowModal(true)}
           >
              <i className="bi bi-plus-lg me-2"></i> Reveal Vision
           </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center p-5 opacity-50 smallest ls-2">INITIALIZING ARCHIVE...</div>
      ) : (
        <div className="pin-container">
          {visions.map(vision => (
            <div key={vision._id} className="pin-card group mb-5 cursor-pointer" onClick={() => navigate('blueprint')}>
              <div className="pin-content shadow-premium rounded-4 overflow-hidden shadow-sm transition-all group-hover-scale-102" style={{ height: '480px' }}>
                {renderCollage(vision.images || [vision.image], vision.layout, false, vision.offsets)}
              </div>
              <div className="mt-3 px-2 d-flex justify-content-between align-items-end">
                <div>
                  <h5 className="mb-0 fw-bold text-dark fs-6 ls-1 transition-all group-hover-text-primary text-uppercase">{vision.title}</h5>
                  <span className="smallest text-muted opacity-60 ls-2 text-uppercase">{vision.category || 'Vision Concept'}</span>
                </div>
                <div className="smallest fw-bold text-muted opacity-30 ls-1">ARCHIVED</div>
              </div>
            </div>
          ))}

          {/* Special Expansion Card */}
          <div className="pin-card" onClick={() => setShowModal(true)}>
             <div className="pin-content rounded-4 border-dashed d-flex flex-column align-items-center justify-content-center p-5 text-center cursor-pointer" 
                  style={{ border: '2px dashed var(--nylix-gray-100)', minHeight: '300px' }}>
                <div className="bg-light rounded-circle p-4 mb-3">
                   <i className="bi bi-collection-fill text-muted fs-3"></i>
                </div>
                <div className="fw-bold text-dark">Create New Collage</div>
                <div className="smallest text-muted mt-1 ls-1">Click to group your intents.</div>
             </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal fade show d-block" 
             onMouseMove={handleDrag}
             onMouseUp={stopDrag}
             style={{ backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(12px)', zIndex: 1050, position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflowY: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="modal-dialog modal-xl modal-dialog-centered w-100" style={{ maxWidth: '1600px', margin: 'auto' }}>
            <div className="modal-content border-0 shadow-2xl rounded-4 overflow-hidden" 
                 style={{ maxHeight: '96vh', backgroundColor: '#fff', height: '96vh', width: '100%' }}>
              
              <div className="modal-header border-0 p-5 pb-0 d-flex justify-content-between align-items-center bg-white animate-fade-down">
                 <div className="d-flex align-items-center gap-3">
                    <div className="bg-success rounded-circle shadow-glow-success" style={{ width: '8px', height: '8px' }}></div>
                    <h2 className="font-heading fw-bold m-0 fs-6 text-dark ls-3 text-uppercase opacity-90">VISION BOARD</h2>
                 </div>
                 <div className="d-flex align-items-center gap-4">
                    <div className="d-flex align-items-center gap-2 px-3 py-1 bg-light rounded-pill border border-light">
                       <div className="rounded-circle pulse-green" style={{ width: '6px', height: '6px', backgroundColor: '#5eead4' }}></div>
                       <span className="smallest text-uppercase ls-1 fw-bold text-muted opacity-50" style={{ letterSpacing: '0.2em' }}>DRAFTING MODE</span>
                    </div>
                    <button className="btn-close shadow-none opacity-25 hover-opacity-100 transition-all" onClick={() => setShowModal(false)}></button>
                 </div>
              </div>
              
              <div className="modal-body p-0">
                <form onSubmit={handleCreate} className="h-100">
                  <div className="row g-0 h-100">
                    {/* Left Panel */}
                    <div className="col-lg-5 p-5 border-end border-light animate-slide-right d-flex flex-column overflow-y-auto" style={{ maxHeight: 'calc(96vh - 100px)' }}>
                      <div className="row g-5">
                        <div className="col-12">
                          <label className="smallest fw-bold text-muted text-uppercase ls-3 mb-3 d-flex align-items-center opacity-60">
                             Intent Label
                          </label>
                          <input type="text" className="form-control py-3 bg-white border-light rounded-1 px-4 shadow-none fs-6 transition-all" 
                                 style={{ border: '1px solid #f1f5f9', color: '#1e293b', background: '#fcfdfe' }}
                                 placeholder="Type project identifier..." required 
                                 value={newVision.title} onChange={e => setNewVision({...newVision, title: e.target.value})} />
                        </div>
                        
                        <div className="col-12">
                          <label className="smallest fw-bold text-muted text-uppercase ls-2 mb-3 d-flex align-items-center opacity-75">
                             Design Geometry
                          </label>
                          <div className="d-flex gap-3">
                             {[
                               {id: 'focus', icon: 'bi-fullscreen-exit', label: 'FOCUS'},
                               {id: 'grid', icon: 'bi-justify', label: 'GRID'},
                               {id: 'mosaic', icon: 'bi-archive', label: 'MOSAIC'}
                             ].map(l => (
                               <button key={l.id} type="button" 
                                       className={`btn flex-grow-1 py-4 rounded-3 border transition-all shadow-none d-flex flex-column align-items-center gap-3 ${newVision.layout === l.id ? 'bg-white text-success border-success fw-bold' : 'bg-white text-muted border-light opacity-60'}`}
                                       style={{ minWidth: '85px', borderColor: newVision.layout === l.id ? '#2d6a4f' : '#f1f5f9' }}
                                       onClick={() => setNewVision({...newVision, layout: l.id})}>
                                 <i className={`bi ${l.icon} fs-5`}></i>
                                 <span className="smallest text-uppercase ls-1 fw-bold" style={{ fontSize: '0.6rem' }}>{l.label}</span>
                               </button>
                             ))}
                          </div>
                        </div>

                        <div className="col-12">
                          <label className="smallest fw-bold text-muted text-uppercase ls-3 mb-3 d-flex align-items-center opacity-60">
                             Import Visual Assets
                          </label>
                          <div className="upload-dropzone p-5 rounded-1 border-dashed text-center position-relative transition-all hover-scale-sm"
                               style={{ border: '1.5px dashed #e2e8f0', backgroundColor: '#fcfdfe' }}>
                             <div className="p-3 mb-2 animate-bounce-slow">
                                <i className="bi bi-plus-lg fs-3 text-success"></i>
                             </div>
                             <div className="fw-bold text-dark ls-1 mb-1" style={{ fontSize: '0.8rem', opacity: 0.8 }}>Drop assets or click to browse</div>
                             <div className="smallest text-muted opacity-40">PNG, JPG format accepted</div>
                             <input type="file" ref={fileInputRef} className="position-absolute top-0 start-0 w-100 h-100 opacity-0 cursor-pointer" 
                                    multiple onChange={handleFileUpload} accept="image/*" />
                          </div>
                        </div>

                        <div className="col-12 mt-auto">
                           <div className="pt-4 border-top border-light opacity-40">
                              <div className="smallest fw-bold ls-1 text-muted text-uppercase mb-1">Archive Capacity</div>
                              <div className="progress rounded-pill" style={{ height: '4px', backgroundColor: '#f1f5f9' }}>
                                 <div className="progress-bar bg-success opacity-50" style={{ width: `${(newVision.images.length / 6) * 100}%` }}></div>
                              </div>
                              <div className="d-flex justify-content-between mt-2 smallest fw-bold text-muted">
                                 <span>{newVision.images.length} / 6 Assets</span>
                                 <span>{6 - newVision.images.length} slots left</span>
                              </div>
                           </div>
                        </div>

                        </div>
                      </div>
                    
                    {/* Right Panel */}
                    <div className="col-lg-7 p-5 bg-white position-relative animate-fade-in d-flex flex-column overflow-y-auto" style={{ maxHeight: 'calc(96vh - 100px)' }}>
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <label className="smallest fw-bold text-muted text-uppercase ls-3 opacity-50">Live Architectural Canvas</label>
                      </div>
                      
                      <div className="preview-canvas rounded-2 overflow-hidden position-relative d-flex flex-column transition-all shadow-inner-soft flex-grow-1" 
                           style={{ 
                             minHeight: '500px', 
                             backgroundColor: '#fafbfc',
                             border: '1px solid #f1f5f9'
                           }}>
                         {uploading ? (
                           <div className="text-center">
                              <div className="spinner-border text-success mb-3" style={{ width: '2rem', height: '2rem', borderWidth: '0.15rem' }}></div>
                              <div className="smallest ls-3 fw-bold text-success opacity-50 text-uppercase">Materializing...</div>
                           </div>
                         ) : (
                           <>
                             {renderCollage(newVision.images, newVision.layout, true)}
                             
                             {/* Zoom Controls Overlay - Enhanced Glassmorphism */}
                             <div className="position-absolute bottom-0 end-0 m-4 d-flex align-items-center glass-panel rounded-2 shadow-lg p-1 px-3 gap-3 border border-white">
                                <button type="button" className="btn btn-link p-0 text-muted shadow-none hover-scale"><i className="bi bi-dash"></i></button>
                                <span className="smallest fw-bold text-muted opacity-60 font-monospace">85%</span>
                                <button type="button" className="btn btn-link p-0 text-muted shadow-none hover-scale"><i className="bi bi-plus"></i></button>
                             </div>
                           </>
                         )}
                      </div>
                      
                      <div className="mt-5 d-flex justify-content-end align-items-center gap-4">
                         <span className="smallest text-muted opacity-40 ls-1">Ready to commit to archive?</span>
                         <button type="submit" className="btn px-5 py-3 text-white shadow-premium border-0 transition-all hover-lift d-flex align-items-center gap-3" 
                                 style={{ backgroundColor: '#0f172a', borderRadius: '4px', fontWeight: 'bold', letterSpacing: '2px' }}>
                            <span className="text-uppercase" style={{ fontSize: '0.8rem' }}>Initialize Vision</span>
                            <i className="bi bi-arrow-right-short fs-4"></i>
                         </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .pin-container {
          columns: 3;
          column-gap: 1.5rem;
          width: 100%;
        }
        @media (max-width: 992px) { .pin-container { columns: 2; } }
        @media (max-width: 576px) { .pin-container { columns: 1; } }

        .pin-card {
          break-inside: avoid;
          margin-bottom: 1.5rem;
          transition: var(--transition-smooth);
        }
        .pin-card:hover {
          transform: translateY(-5px);
        }
        .pin-content {
          background-color: white;
          cursor: zoom-in;
        }
        .pin-card:hover img {
          transform: scale(1.08);
          filter: brightness(0.7);
        }
        .pin-overlay {
          background: linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 60%);
          transition: opacity 0.3s ease;
        }
        .group:hover .group-hover-opacity-100 {
          opacity: 1 !important;
        }
        .cursor-pointer { cursor: pointer; }
        .shadow-premium {
          box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.3);
        }
        .glass-panel {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        .ls-3 { letter-spacing: 0.25em; }
        .hover-lift:hover {
          transform: translateY(-3px);
          box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.4);
        }
        .pulse-green {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(94, 234, 212, 0.4); }
          70% { box-shadow: 0 0 0 8px rgba(94, 234, 212, 0); }
          100% { box-shadow: 0 0 0 0 rgba(94, 234, 212, 0); }
        }
        .animate-fade-down {
          animation: fadeDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-slide-right {
          animation: slideRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: 0.2s;
          opacity: 0;
        }
        .animate-fade-in {
          animation: fadeIn 1s ease forwards;
          animation-delay: 0.4s;
          opacity: 0;
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideRight {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .shadow-inner-soft {
          box-shadow: inset 0 2px 15px rgba(0,0,0,0.03);
        }
        .shadow-glow-success {
          box-shadow: 0 0 10px rgba(45, 106, 79, 0.5);
        }
        .cursor-move {
           cursor: ns-resize !important;
        }
        .cursor-move:active {
           cursor: grabbing !important;
        }
        .form-control:focus {
           border-color: #cbd5e1 !important;
           box-shadow: 0 0 0 4px rgba(94, 234, 212, 0.1) !important;
           background-color: white !important;
        }
        .btn-link:hover {
           opacity: 1 !important;
           color: var(--nylix-accent) !important;
        }
        .hover-scale-sm:hover {
           transform: scale(1.01);
           border-color: var(--nylix-accent) !important;
        }
        .hover-bg-light:hover {
           background-color: #f8fafc !important;
        }
      `}} />
    </div>
  );
};

export default VisionBoard;
