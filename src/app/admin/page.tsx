'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Lock, Image as ImageIcon, Save, Check, RefreshCw, Upload, Eye, ArrowLeft, LogOut, Trash2 } from 'lucide-react';
import { FyAfMediaSlot } from '@/types/fyaf';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<{ email: string; name?: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [slots, setSlots] = useState<Record<string, FyAfMediaSlot>>({});
  const [selectedSlotId, setSelectedSlotId] = useState<string>('hero-cover');
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [authToken, setAuthToken] = useState<string>('');

  // Form states for selected slot
  const [urlInput, setUrlInput] = useState('');
  const [altInput, setAltInput] = useState('');
  const [focalX, setFocalX] = useState(50);
  const [focalY, setFocalY] = useState(50);
  const [zoom, setZoom] = useState(1);
  const [videoCoverUrl, setVideoCoverUrl] = useState('');

  // Cargar slots multimedia
  const fetchSlots = async (token?: string) => {
    try {
      setLoading(true);
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/admin/media', { headers });
      if (res.ok) {
        const data = await res.json();
        setSlots(data.slots || {});
      }
    } catch (e) {
      console.error('Error al cargar slots:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: 'key', password }),
      });

      if (res.ok) {
        const data = await res.json();
        setAuthToken(data.token);
        setAdminUser(data.user);
        setIsAuthenticated(true);
        fetchSlots(data.token);
      } else {
        const err = await res.json();
        setErrorMsg(err.error || 'Clave administrativa incorrecta.');
      }
    } catch {
      setErrorMsg('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminUser(null);
    setAuthToken('');
    setPassword('');
  };

  // Al seleccionar slot, poblar campos
  useEffect(() => {
    if (slots[selectedSlotId]) {
      const slot = slots[selectedSlotId];
      setUrlInput(slot.url || '');
      setAltInput(slot.alt || '');
      setFocalX(slot.focalPoint?.x ?? 50);
      setFocalY(slot.focalPoint?.y ?? 50);
      setZoom(slot.zoom ?? 1);
      setVideoCoverUrl(slot.videoCoverUrl || '');
    }
  }, [selectedSlotId, slots]);

  const handleSave = async () => {
    setLoading(true);
    setSaveSuccess(false);
    try {
      const updatedSlotData = {
        url: urlInput,
        alt: altInput,
        focalPoint: { x: focalX, y: focalY },
        zoom,
        videoCoverUrl,
      };

      const res = await fetch('/api/admin/media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken || password}`,
        },
        body: JSON.stringify({
          action: 'update_slot',
          slotId: selectedSlotId,
          slotData: updatedSlotData,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        setSlots((prev) => ({
          ...prev,
          [selectedSlotId]: result.slot,
        }));
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert('Error al guardar cambios.');
      }
    } catch {
      alert('Error de red al guardar.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken || password}`,
        },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setUrlInput(data.url);
      } else {
        const err = await res.json();
        alert(`Error al subir: ${err.error || 'No autorizado'}`);
      }
    } catch {
      alert('Error de conexión al subir el archivo.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-brand-surface border border-brand-border rounded-2xl p-8 shadow-xl">
          <div className="flex justify-center mb-6">
            <div className="h-12 w-12 rounded-full bg-brand-primary/10 border border-brand-primary flex items-center justify-center text-brand-primary">
              <Lock className="h-6 w-6" />
            </div>
          </div>
          <h1 className="text-xl font-bold text-center text-white mb-1">
            Panel Multimedia FyAF
          </h1>
          <p className="text-xs text-center text-brand-muted mb-6">
            Acceso administrativo verificado en el servidor para el Club DAOM.
          </p>

          <form onSubmit={handleKeyLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Clave Maestra de Administración
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresá la clave administrativa..."
                className="w-full rounded-xl bg-brand-dark border border-brand-border px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
                required
              />
            </div>

            {errorMsg && (
              <div className="text-xs text-rose-400 bg-rose-950/30 border border-rose-800 p-2.5 rounded-lg">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-brand-primary py-3 text-sm font-bold text-white hover:bg-brand-primaryHover transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              {loading ? 'Verificando autorización...' : 'Ingresar al Panel'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-brand-border/60 text-center">
            <p className="text-[11px] text-brand-dim mb-3">
              Administradores autorizados en servidor:
              <br />
              matias.muniz@gmail.com • administracion@daom.com.ar
            </p>
            <Link href="/" className="text-xs text-brand-muted hover:text-white inline-flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" />
              <span>Volver a la web pública</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const selectedSlot = slots[selectedSlotId];

  return (
    <div className="min-h-screen bg-brand-dark text-brand-text">
      <header className="border-b border-brand-border bg-brand-surface py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-brand-muted hover:text-white flex items-center gap-1.5 text-xs font-semibold">
            <ArrowLeft className="h-4 w-4" />
            <span>Volver a la Web</span>
          </Link>
          <span className="text-slate-600">|</span>
          <h1 className="text-sm font-bold text-white">
            Panel Multimedia • FyAF Club DAOM
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-emerald-400 font-medium">
              {adminUser?.email || 'Autorizado'}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-lg border border-brand-border bg-brand-surfaceAlt px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:border-slate-500"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </header>

      <div className="container mx-auto max-w-6xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Selector de ubicaciones reales sincronizadas */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-brand-muted">
                Ubicaciones Reales ({Object.keys(slots).length})
              </h2>
            </div>
            <div className="space-y-2">
              {Object.values(slots).map((slot) => {
                const isSelected = slot.id === selectedSlotId;
                return (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-brand-primary bg-brand-surfaceAlt text-white font-bold shadow'
                        : 'border-brand-border bg-brand-surface text-brand-muted hover:border-slate-500'
                    }`}
                  >
                    <div>
                      <div className="leading-snug">{slot.name}</div>
                      <div className="text-[10px] text-brand-dim mt-0.5 uppercase tracking-wide">
                        Sección: {slot.section} • ID: {slot.id}
                      </div>
                    </div>
                    {isSelected && <Check className="h-4 w-4 text-brand-primary shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Formulario y editor de la ubicación seleccionada */}
          <div className="md:col-span-8 space-y-6">
            {selectedSlot ? (
              <div className="rounded-2xl border border-brand-border bg-brand-surface p-6 shadow-md">
                <div className="border-b border-brand-border pb-4 mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">{selectedSlot.name}</h3>
                    <p className="text-xs text-brand-muted">
                      ID Estable: {selectedSlot.id} • Sección: {selectedSlot.section}
                    </p>
                  </div>
                  <span className="rounded bg-brand-surfaceAlt px-2.5 py-1 text-xs font-bold text-brand-gold border border-brand-border">
                    Formato: {selectedSlot.aspectRatio || 'Libre'}
                  </span>
                </div>

                {/* Previsualización en vivo */}
                <div className="mb-6">
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted mb-2 flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5" />
                    <span>Vista Previa con Encuadre Activo</span>
                  </label>
                  <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-brand-border bg-brand-dark flex items-center justify-center">
                    {urlInput ? (
                      <img
                        src={urlInput}
                        alt="Previsualización"
                        style={{
                          objectFit: 'cover',
                          objectPosition: `${focalX}% ${focalY}%`,
                          transform: `scale(${zoom})`,
                        }}
                        className="w-full h-full transition-all duration-150"
                      />
                    ) : (
                      <span className="text-xs text-brand-muted">Sin imagen asignada</span>
                    )}
                  </div>
                </div>

                {/* Subir archivo / Cambiar URL */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Subir archivo persistente (Cloud Storage / Supabase / Local)
                    </label>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileUpload}
                      className="block w-full text-xs text-brand-muted file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-primary file:text-white hover:file:bg-brand-primaryHover"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      URL del archivo multimedia
                    </label>
                    <input
                      type="text"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      className="w-full rounded-xl bg-brand-dark border border-brand-border px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-primary"
                    />
                  </div>

                  {/* Controles de Encuadre */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-brand-border/60">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Punto Focal X: {focalX}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={focalX}
                        onChange={(e) => setFocalX(Number(e.target.value))}
                        className="w-full accent-brand-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Punto Focal Y: {focalY}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={focalY}
                        onChange={(e) => setFocalY(Number(e.target.value))}
                        className="w-full accent-brand-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Zoom: {zoom}x
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="2"
                        step="0.05"
                        value={zoom}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-full accent-brand-primary"
                      />
                    </div>
                  </div>

                  {/* Texto alternativo accesible */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Texto Alternativo Accesible (Alt Text - WCAG 2.2)
                    </label>
                    <input
                      type="text"
                      value={altInput}
                      onChange={(e) => setAltInput(e.target.value)}
                      placeholder="Describí qué se ve en la fotografía para lectores de pantalla..."
                      className="w-full rounded-xl bg-brand-dark border border-brand-border px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-primary"
                    />
                  </div>

                  {/* Botón de Guardar */}
                  <div className="pt-4 flex items-center justify-between">
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-6 py-2.5 text-xs font-bold text-white hover:bg-brand-primaryHover transition-colors shadow-sm"
                    >
                      <Save className="h-4 w-4" />
                      <span>{loading ? 'Guardando...' : 'Publicar Cambios'}</span>
                    </button>

                    {saveSuccess && (
                      <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                        <Check className="h-4 w-4" />
                        ¡Cambios publicados exitosamente!
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-brand-border bg-brand-surface p-12 text-center text-brand-muted">
                Seleccioná una ubicación para editar.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
