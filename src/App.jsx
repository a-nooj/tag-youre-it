import React, { useState, useRef, useCallback } from 'react';
import Header from './components/Header.jsx';
import MarkerTypeTabs from './components/MarkerTypeTabs.jsx';
import ArucoConfig from './components/configs/ArucoConfig.jsx';
import AprilTagConfig from './components/configs/AprilTagConfig.jsx';
import CharucoConfig from './components/configs/CharucoConfig.jsx';
import ChessboardConfig from './components/configs/ChessboardConfig.jsx';
import PreviewCanvas from './components/PreviewCanvas.jsx';
import DownloadButtons from './components/DownloadButtons.jsx';
import InfoPanel from './components/InfoPanel.jsx';

const DEFAULT_CONFIGS = {
  aruco: {
    dictName: 'DICT_4X4_50',
    markerId: 0,
    markerSize: 200,
    borderBits: 1,
    physicalSizeMm: 50,
    mode: 'single',
    sheetStartId: 0,
    sheetCount: 12,
    sheetCols: 4,
    sheetGap: 10,
  },
  apriltag: {
    family: 'tag36h11',
    tagId: 0,
    tagSize: 200,
    physicalSizeMm: 50,
    mode: 'single',
    sheetStartId: 0,
    sheetCount: 12,
    sheetCols: 4,
    sheetGap: 10,
  },
  charuco: {
    squaresX: 7,
    squaresY: 5,
    squareSize: 60,
    markerRatio: 0.7,
    dictName: 'DICT_4X4_50',
    startMarkerId: 0,
    borderBits: 1,
  },
  chessboard: {
    squaresX: 9,
    squaresY: 6,
    squareSize: 50,
    addBorder: true,
    borderSize: 20,
  },
};

export default function App() {
  const [markerType, setMarkerType] = useState('aruco');
  const [configs, setConfigs] = useState(DEFAULT_CONFIGS);
  const canvasRef = useRef(null);

  const handleConfigChange = useCallback((newConfig) => {
    setConfigs((prev) => ({ ...prev, [markerType]: newConfig }));
  }, [markerType]);

  const handleCanvasReady = useCallback((canvas) => {
    canvasRef.current = canvas;
  }, []);

  const currentConfig = configs[markerType];

  const renderConfig = () => {
    switch (markerType) {
      case 'aruco':
        return <ArucoConfig config={currentConfig} onChange={handleConfigChange} />;
      case 'apriltag':
        return <AprilTagConfig config={currentConfig} onChange={handleConfigChange} />;
      case 'charuco':
        return <CharucoConfig config={currentConfig} onChange={handleConfigChange} />;
      case 'chessboard':
        return <ChessboardConfig config={currentConfig} onChange={handleConfigChange} />;
      default:
        return null;
    }
  };

  const cardStyle = {
    background: '#FEFEFA',
    borderColor: 'rgba(222, 216, 207, 0.5)',
    boxShadow: '0 4px 20px -2px rgba(93, 112, 82, 0.15)',
  };

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: 'Nunito, sans-serif' }}>
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
            {/* LEFT PANEL */}
            <aside
              className="w-full lg:w-96 flex-shrink-0"
              style={{ position: 'sticky', top: '1.5rem', alignSelf: 'flex-start', maxHeight: 'calc(100vh - 5rem)', overflowY: 'auto' }}
            >
              <div className="rounded-3xl border p-6" style={cardStyle}>
                {/* Marker type tabs */}
                <div className="mb-5">
                  <MarkerTypeTabs activeTab={markerType} onChange={setMarkerType} />
                </div>

                <div className="border-t border-border/40 mb-5" />

                {/* Config fields */}
                <div className="mb-5">
                  <h2
                    className="text-sm font-bold text-foreground mb-4"
                    style={{ fontFamily: 'Fraunces, serif' }}
                  >
                    Configuration
                  </h2>
                  {renderConfig()}
                </div>

                <div className="border-t border-border/40 mb-5" />

                {/* Download */}
                <div>
                  <h2
                    className="text-sm font-bold text-foreground mb-4"
                    style={{ fontFamily: 'Fraunces, serif' }}
                  >
                    Export
                  </h2>
                  <DownloadButtons
                    markerType={markerType}
                    config={currentConfig}
                    canvasRef={canvasRef}
                  />
                </div>
              </div>
            </aside>

            {/* RIGHT PANEL */}
            <main className="flex-1 min-w-0 space-y-6">
              <div className="rounded-3xl border p-8" style={cardStyle}>
                <h2
                  className="text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-widest"
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  Live Preview
                </h2>
                <PreviewCanvas
                  markerType={markerType}
                  config={currentConfig}
                  onCanvasReady={handleCanvasReady}
                />
              </div>

              <div className="rounded-3xl border p-8" style={cardStyle}>
                <InfoPanel markerType={markerType} />
              </div>
            </main>
          </div>
      </div>
    </div>
  );
}
