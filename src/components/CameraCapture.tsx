import React, { useRef, useState, useCallback } from 'react';
import { Camera, X, RotateCcw, Check } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          setIsLoading(false);
        };
      }
    } catch (error) {
      console.error('카메라 접근 오류:', error);
      alert('카메라에 접근할 수 없습니다. 카메라 권한을 확인해주세요.');
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(imageData);
      }
    }
  };

  const retake = () => {
    setCapturedImage('');
  };

  const confirmCapture = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      stopCamera();
      onClose();
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <div className="camera-modal">
      <div className="camera-container">
        <div className="camera-header">
          <h3>사진 촬영</h3>
          <button onClick={handleClose} className="close-camera">
            <X size={24} />
          </button>
        </div>

        <div className="camera-view">
          {isLoading && (
            <div className="camera-loading">
              <div className="spinner"></div>
              <p>카메라를 준비하고 있습니다...</p>
            </div>
          )}

          {!capturedImage ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="camera-video"
                style={{ display: isLoading ? 'none' : 'block' }}
              />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </>
          ) : (
            <img src={capturedImage} alt="Captured" className="captured-image" />
          )}
        </div>

        <div className="camera-controls">
          {!capturedImage ? (
            <>
              <button onClick={switchCamera} className="switch-camera">
                <RotateCcw size={20} />
                <span>카메라 전환</span>
              </button>
              <button onClick={capturePhoto} className="capture-button" disabled={isLoading}>
                <Camera size={32} />
              </button>
              <div className="placeholder-button"></div>
            </>
          ) : (
            <>
              <button onClick={retake} className="retake-button">
                <RotateCcw size={20} />
                <span>다시 찍기</span>
              </button>
              <button onClick={confirmCapture} className="confirm-button">
                <Check size={20} />
                <span>사용하기</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;