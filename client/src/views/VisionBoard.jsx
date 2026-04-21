import React, { useState, useEffect } from 'react';
import api from '../services/api';

const VisionBoard = ({ onBack, onRequireAuth, showNotification, navigate, setActiveVision }) => {
  const [visions, setVisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newVision, setNewVision] = useState({ title: '', category: 'Fundamental', description: '', images: [], layout: 'focus', size: 'medium' });
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

  // Helper to get full image URL
  const getFullUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://localhost:3001${url}`; // Base backend port
  };

  // Helper to render collage based on layout
  const renderCollage = (visionImages, layout = 'focus', isPreview = false) => {
    const imgs = visionImages && visionImages.length > 0 ? visionImages : [];
    
    if (imgs.length === 0) return (
      <div className="text-center p-5 opacity-50">
         <i className="bi bi-stack fs-1 d-block mb-2"></i>
         <div className="smallest ls-1 fw-bold">CANVAS EMPTY</div>
      </div>
    );

    if (layout === 'grid') {
      return (
        <div className="d-grid h-100 w-100 p-1" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: '4px' }}>
          {imgs.slice(0, 4).map((src, i) => (
            <div key={i} className="position-relative group overflow-hidden rounded-2">
              <img src={getFullUrl(src)} className="w-100 h-100 object-fit-cover" alt="" />
              {isPreview && (
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark/40 opacity-0 group-hover:opacity-100 d-flex align-items-center justify-content-center gap-2 transition-all">
                  <button type="button" className="btn btn-sm btn-light p-1" onClick={() => moveImage(i, -1)}><i className="bi bi-chevron-left"></i></button>
                  <button type="button" className="btn btn-sm btn-light p-1" onClick={() => moveImage(i, 1)}><i className="bi bi-chevron-right"></i></button>
                  <button type="button" className="btn btn-sm btn-danger p-1" onClick={() => removeImage(i)}><i className="bi bi-trash"></i></button>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }
    
    if (layout === 'mosaic') {
      return (
        <div className="row g-1 h-100 w-100 m-0 p-1">
          <div className="col-8 h-100 p-0 position-relative">
             <img src={getFullUrl(imgs[0])} className="w-100 h-100 object-fit-cover rounded-start-4" alt="" />
             {isPreview && <button type="button" className="btn btn-sm btn-danger position-absolute top-0 start-0 m-2" onClick={() => removeImage(0)}><i className="bi bi-x"></i></button>}
          </div>
          <div className="col-4 h-100 p-0 d-flex flex-column gap-1">
            {[1, 2].map(idx => (
              <div key={idx} className="h-50 w-100 position-relative overflow-hidden {idx === 1 ? 'rounded-tr-4' : 'rounded-br-4'}">
                {imgs[idx] ? (
                  <>
                    <img src={getFullUrl(imgs[idx])} className="w-100 h-100 object-fit-cover" alt="" />
                    {isPreview && (
                       <div className="position-absolute top-0 start-0 w-100 h-100 bg-black/40 opacity-0 group-hover-opacity-100 d-flex align-items-center justify-content-center gap-1 transition-all">
                          <button type="button" className="btn btn-xs btn-light" onClick={() => moveImage(idx, -1)}>↑</button>
                          <button type="button" className="btn btn-xs btn-danger" onClick={() => removeImage(idx)}>×</button>
                       </div>
                    )}
                  </>
                ) : <div className="w-100 h-100 bg-dark/5 d-flex align-items-center justify-content-center border-dashed"><i className="bi bi-plus text-muted"></i></div>}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Default: Focus Layout
    return (
      <div className="position-relative h-100 w-100 overflow-hidden rounded-4 shadow-inner" 
           style={{ 
             backgroundColor: '#f8f9fa',
             backgroundImage: 'radial-gradient(#d1d1d1 1px, transparent 1px)',
             backgroundSize: '20px 20px' 
           }}>
        {/* Main Focus Image with Tape Effect */}
        <div className="position-relative h-100 w-100 p-4">
           <div className="position-absolute top-0 start-50 translate-middle-x mt-2 shadow-sm" 
                style={{ width: '60px', height: '15px', backgroundColor: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(2px)', zIndex: 5, transform: 'rotate(-2deg)' }}></div>
           
           <img src={getFullUrl(imgs[0])} className="w-100 h-100 object-fit-cover rounded-3 shadow-lg" alt="" />
           
           <div className="position-absolute bottom-0 start-0 p-4 d-flex gap-3 w-100 justify-content-center align-items-end" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.1))' }}>
            {imgs.map((src, i) => (
              <div key={i} className={`position-relative rounded-2 border-2 overflow-hidden shadow-lg transition-all cursor-pointer ${i === 0 ? 'border-success scale-110' : 'border-white opacity-90'}`} 
                   style={{ 
                     width: i === 0 ? '85px' : '65px', 
                     height: i === 0 ? '85px' : '65px', 
                     zIndex: 10 - i,
                     transform: `rotate(${i % 2 === 0 ? '2deg' : '-2deg'})`
                   }}
                   onClick={() => isPreview && moveImage(i, -i)}>
                <img src={getFullUrl(src)} className="w-100 h-100 object-fit-cover" alt="" />
                {isPreview && i > 0 && (
                  <span className="position-absolute top-0 end-0 bg-danger text-white d-flex align-items-center justify-content-center smallest rounded-circle m-1" 
                        style={{ width: '18px', height: '18px', fontSize: '10px' }}
                        onClick={(e) => { e.stopPropagation(); removeImage(i); }}>
                    <i className="bi bi-x"></i>
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
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

  return (
    <div className="vision-board-wrapper view-section">
      {/* Search & Header - Added pt-3 for breathing room from sticky navigation */}
      <div className="d-flex justify-content-between align-items-center mb-5 pt-3">
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
            <div key={vision._id} className="pin-card group">
              <div className="pin-content shadow-sm rounded-4 overflow-hidden position-relative h-100" style={{ minHeight: '300px' }}>
                {renderCollage(vision.images || [vision.image], vision.layout)}
                
                <div className="pin-overlay position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-between p-4 opacity-0 group-hover-opacity-100">
                  <div className="d-flex justify-content-between">
                    <span className="badge glass-card smallest text-dark px-3 py-2 rounded-pill fw-bold">
                      {vision.category}
                    </span>
                    <button className="btn btn-light rounded-circle shadow-sm d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                      <i className="bi bi-pin-angle-fill text-danger"></i>
                    </button>
                  </div>
                  <div>
                    <h5 className="text-white fw-bold mb-2 font-heading">{vision.title}</h5>
                    <p className="text-white smallest opacity-75 mb-3">{vision.description}</p>
                    <button 
                      className="btn btn-premium w-100 text-white"
                      style={{ backgroundColor: 'var(--nylix-accent)', borderRadius: '12px' }}
                      onClick={() => convertToTask(vision)}
                    >
                      Initialize Blueprint
                    </button>
                  </div>
                </div>
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

      {/* Modal - Back to White Premium */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)', zIndex: 1050, position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', overflowY: 'auto' }}>
          <div className="modal-dialog modal-xl modal-dialog-centered" style={{ maxWidth: '1100px' }}>
            <div className="modal-content border-0 shadow-2xl rounded-5 overflow-hidden" 
                 style={{ maxHeight: '95vh', backgroundColor: '#fff', height: 'fit-content' }}>
              
              <div className="modal-header border-0 p-4 pb-0 d-flex justify-content-between align-items-center bg-white">
                 <div className="d-flex align-items-center gap-3">
                    <div className="bg-success rounded-circle" style={{ width: '12px', height: '12px' }}></div>
                    <h2 className="font-heading fw-bold m-0 fs-4 text-dark ls-2">VISION BOARD</h2>
                 </div>
                 <button className="btn-close shadow-none" onClick={() => setShowModal(false)}></button>
              </div>
              
              <div className="modal-body p-4 pt-3 pb-0">
                <form onSubmit={handleCreate}>
                  <div className="row g-1 align-items-start">
                    <div className="col-lg-6">
                      <div className="row g-4">
                        <div className="col-12">
                          <label className="smallest fw-bold text-muted text-uppercase ls-2 mb-2 d-flex align-items-center">
                            <i className="bi bi-fonts me-2"></i> Intent Label
                          </label>
                          <input type="text" className="form-control py-3 bg-light border-0 rounded-4 px-4 shadow-none focus-ring-success" 
                                 placeholder="Project Name..." required 
                                 value={newVision.title} onChange={e => setNewVision({...newVision, title: e.target.value})} />
                        </div>
                        
                        <div className="col-12">
                          <label className="smallest fw-bold text-muted text-uppercase ls-2 mb-2 d-flex align-items-center">
                            <i className="bi bi-grid-3x3-gap me-2"></i> Design Geometry
                          </label>
                          <div className="d-flex gap-2">
                             {[
                               {id: 'focus', icon: 'bi-aspect-ratio'},
                               {id: 'grid', icon: 'bi-grid-fill'},
                               {id: 'mosaic', icon: 'bi-columns-gap'}
                             ].map(l => (
                               <button key={l.id} type="button" 
                                       className={`btn flex-grow-1 py-3 rounded-4 border-2 transition-all shadow-none d-flex flex-column align-items-center gap-2 ${newVision.layout === l.id ? 'border-success bg-light text-success fw-bold' : 'border-light text-muted opacity-50'}`}
                                       onClick={() => setNewVision({...newVision, layout: l.id})}>
                                 <i className={`bi ${l.icon} fs-5`}></i>
                                 <span className="smallest text-uppercase ls-1" style={{ fontSize: '0.65rem' }}>{l.id}</span>
                               </button>
                             ))}
                          </div>
                        </div>

                        <div className="col-12">
                          <label className="smallest fw-bold text-muted text-uppercase ls-2 mb-2 d-flex align-items-center">
                            <i className="bi bi-cloud-arrow-up me-2"></i> Import Visual Assets
                          </label>
                          <div className="upload-dropzone p-4 rounded-5 border-dashed text-center position-relative transition-all"
                               style={{ border: '2px dashed #e0e0e0', backgroundColor: '#fcfcfc' }}>
                             <div className="p-3 bg-white rounded-circle shadow-sm d-inline-block mb-2">
                                <i className="bi bi-plus-lg fs-4 text-success"></i>
                             </div>
                             <div className="smallest fw-bold text-dark ls-1">CLICK TO PIN ASSETS</div>
                             <div className="smallest text-muted opacity-75 mt-1">Maximum 6 high-fidelity images</div>
                             <input type="file" className="position-absolute top-0 start-0 w-100 h-100 opacity-0 cursor-pointer" 
                                    multiple onChange={handleFileUpload} accept="image/*" />
                          </div>
                        </div>

                        </div>
                      </div>
                    
                    <div className="col-lg-6">
                      <label className="smallest fw-bold text-muted text-uppercase ls-2 mb-3 d-block text-center mt-1">Live Architectural Canvas</label>
                      <div className="preview-canvas rounded-5 overflow-hidden border position-relative d-flex align-items-center justify-content-center shadow-2xl" 
                           style={{ 
                             height: '420px', 
                             backgroundColor: '#f8f9fa',
                             backgroundImage: 'linear-gradient(#e9ecef 1px, transparent 1px), linear-gradient(90deg, #e9ecef 1px, transparent 1px)',
                             backgroundSize: '30px 30px'
                           }}>
                         {uploading ? (
                           <div className="text-center">
                              <div className="spinner-border text-success mb-3" style={{ width: '3rem', height: '3rem' }}></div>
                              <div className="smallest ls-2 fw-bold text-success">PROCESSING ASSETS...</div>
                           </div>
                         ) : (
                           renderCollage(newVision.images, newVision.layout, true)
                         )}
                      </div>
                      
                      <div className="mt-4 mb-4">
                         <button type="submit" className="btn btn-premium w-100 py-3 text-white shadow-lg border-0 transition-all hover-scale" 
                                 style={{ backgroundColor: 'var(--nylix-accent)', borderRadius: '24px', fontSize: '1.1rem', fontWeight: 'bold', letterSpacing: '2px' }}>
                            <i className="bi bi-box-arrow-in-down-right me-3"></i> ARCHIVE BOARD
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
        .shadow-2xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
        }
        .border-dashed:hover {
          border-color: var(--nylix-accent) !important;
          background-color: var(--nylix-bg) !important;
        }
      `}} />
    </div>
  );
};

export default VisionBoard;
