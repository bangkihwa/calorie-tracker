import React, { useRef, useState, useCallback } from 'react';
import { Camera, X, RotateCcw, Check } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [isLoading, setIsLoading] = useState(true);
  const [cameraError, setCameraError] = useState<string>('');

  React.useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setCameraError('');

      // 카메라 API 지원 체크
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported');
      }

      // HTTPS 체크
      if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        throw new Error('HTTPS required for camera access');
      }

      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setIsLoading(false);
        };
      }
    } catch (error: any) {
      console.error('카메라 접근 오류:', error);

      let errorMessage = '카메라에 접근할 수 없습니다.';

      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = '카메라 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해주세요.';
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorMessage = '카메라를 찾을 수 없습니다.';
      } else if (error.message === 'Camera API not supported') {
        errorMessage = '이 브라우저는 카메라를 지원하지 않습니다.';
      } else if (error.message === 'HTTPS required for camera access') {
        errorMessage = 'HTTPS 연결이 필요합니다.';
      }

      setCameraError(errorMessage);
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        setCapturedImage(imageData);
      };
      reader.readAsDataURL(file);
    }
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
          {cameraError ? (
            <div className="camera-error">
              <p>{cameraError}</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="fallback-button"
              >
                <Camera size={24} />
                <span>대신 사진 선택하기</span>
              </button>
            </div>
          ) : isLoading ? (
            <div className="camera-loading">
              <div className="spinner"></div>
              <p>카메라를 준비하고 있습니다...</p>
            </div>
          ) : null}

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