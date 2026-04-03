import { useState, useEffect, useRef, useCallback } from 'react';
import { AR } from 'js-aruco2';
import { injectDictsIfNeeded } from '../utils/injectArucoDict.js';

export function useCamera() {
  const [cameras, setCameras] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [dictName, setDictName] = useState('DICT_4X4_50');
  const [isStreaming, setIsStreaming] = useState(false);
  const [detections, setDetections] = useState([]);
  const [error, setError] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const detectorRef = useRef(null);

  // Build or rebuild detector whenever the dictionary changes
  useEffect(() => {
    injectDictsIfNeeded();
    try {
      detectorRef.current = new AR.Detector({ dictionaryName: dictName });
    } catch (e) {
      console.error('Detector init failed for', dictName, e);
      detectorRef.current = null;
    }
  }, [dictName]);

  const enumerateCameras = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((d) => d.kind === 'videoinput');
      setCameras(videoDevices);
      if (videoDevices.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(videoDevices[0].deviceId);
      }
    } catch {
      // enumerateDevices may fail in insecure contexts
    }
  }, [selectedDeviceId]);

  const stopStream = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
    setDetections([]);
  }, []);

  const startStream = useCallback(async () => {
    setError(null);
    try {
      const constraints = {
        video: selectedDeviceId
          ? { deviceId: { exact: selectedDeviceId }, width: { ideal: 1280 }, height: { ideal: 720 } }
          : { width: { ideal: 1280 }, height: { ideal: 720 } },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setPermissionGranted(true);
      setIsStreaming(true);
      // Re-enumerate after permission so we get real device labels
      await enumerateCameras();
    } catch (e) {
      if (e.name === 'NotAllowedError') {
        setError('Camera access denied. Allow camera access in your browser settings and try again.');
      } else if (e.name === 'NotFoundError') {
        setError('No camera found. Make sure a camera is connected.');
      } else {
        setError(`Camera error: ${e.message}`);
      }
    }
  }, [selectedDeviceId, enumerateCameras]);

  // When the user picks a different camera while streaming, restart the stream
  const changeCamera = useCallback(
    async (deviceId) => {
      const wasStreaming = isStreaming;
      stopStream();
      setSelectedDeviceId(deviceId);
      if (wasStreaming) {
        // We can't await startStream here because selectedDeviceId state hasn't
        // propagated yet. The component will restart via useEffect below.
        setIsStreaming('restart');
      }
    },
    [isStreaming, stopStream],
  );

  // Restart after changeCamera sets isStreaming = 'restart'
  useEffect(() => {
    if (isStreaming === 'restart') {
      startStream();
    }
  }, [isStreaming, startStream]);

  // Detection loop — runs while streaming
  useEffect(() => {
    if (isStreaming !== true) return;

    const detect = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const detector = detectorRef.current;

      if (!video || !canvas || !detector || video.readyState < 2) {
        rafRef.current = requestAnimationFrame(detect);
        return;
      }

      const w = video.videoWidth;
      const h = video.videoHeight;
      if (w === 0 || h === 0) {
        rafRef.current = requestAnimationFrame(detect);
        return;
      }

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, w, h);

      let markers = [];
      try {
        const imageData = ctx.getImageData(0, 0, w, h);
        markers = detector.detect(imageData) || [];
      } catch {
        // Skip frame silently on detection errors
      }

      // ── Overlay ────────────────────────────────────────────────────────────
      for (const marker of markers) {
        const corners = marker.corners;
        const cx = corners.reduce((s, c) => s + c.x, 0) / 4;
        const cy = corners.reduce((s, c) => s + c.y, 0) / 4;

        // Filled polygon
        ctx.beginPath();
        ctx.moveTo(corners[0].x, corners[0].y);
        for (let i = 1; i < 4; i++) ctx.lineTo(corners[i].x, corners[i].y);
        ctx.closePath();
        ctx.fillStyle = 'rgba(93, 112, 82, 0.18)';
        ctx.fill();
        ctx.strokeStyle = '#5D7052';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Corner dots — corner 0 (reference) in terracotta, rest in moss
        corners.forEach((c, idx) => {
          ctx.beginPath();
          ctx.arc(c.x, c.y, 7, 0, Math.PI * 2);
          ctx.fillStyle = idx === 0 ? '#C18C5D' : '#5D7052';
          ctx.fill();
          ctx.beginPath();
          ctx.arc(c.x, c.y, 7, 0, Math.PI * 2);
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        });

        // ID badge
        const label = `ID ${marker.id}`;
        ctx.font = 'bold 16px "Nunito", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const tw = ctx.measureText(label).width;
        const ph = 24, pw = tw + 20;
        const bx = cx - pw / 2, by = cy - ph / 2;
        // Pill background
        ctx.fillStyle = 'rgba(45, 44, 36, 0.82)';
        ctx.beginPath();
        ctx.roundRect(bx, by, pw, ph, ph / 2);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(label, cx, cy);

        // Hamming badge (only if > 0) — shown above the ID badge
        if (marker.hammingDistance > 0) {
          const hLabel = `Δ${marker.hammingDistance}`;
          ctx.font = '11px "Nunito", sans-serif';
          const hw = ctx.measureText(hLabel).width + 12;
          const hh = 16;
          ctx.fillStyle = 'rgba(193, 140, 93, 0.88)';
          ctx.beginPath();
          ctx.roundRect(cx - hw / 2, cy - ph / 2 - hh - 2, hw, hh, hh / 2);
          ctx.fill();
          ctx.fillStyle = '#FFFFFF';
          ctx.textBaseline = 'middle';
          ctx.fillText(hLabel, cx, cy - ph / 2 - hh / 2 - 2);
        }
      }
      // ── End overlay ────────────────────────────────────────────────────────

      setDetections(
        markers.map((m) => ({
          id: m.id,
          hammingDistance: m.hammingDistance ?? 0,
        })),
      );

      rafRef.current = requestAnimationFrame(detect);
    };

    rafRef.current = requestAnimationFrame(detect);
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isStreaming]);

  // Cleanup on unmount
  useEffect(() => () => stopStream(), [stopStream]);

  // Initial enumerate — labels will be generic until permission is granted
  useEffect(() => {
    enumerateCameras();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    cameras,
    selectedDeviceId,
    changeCamera,
    dictName,
    setDictName,
    isStreaming: isStreaming === true,
    startStream,
    stopStream,
    detections,
    error,
    permissionGranted,
    videoRef,
    canvasRef,
  };
}
