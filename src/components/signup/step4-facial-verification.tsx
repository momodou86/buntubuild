'use client';

import { useState, useRef, useCallback, useEffect, type FC } from 'react';
import {
  Camera,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Step4FacialVerificationProps {
    onFinalSubmit: () => void;
}

export const Step4FacialVerification: FC<Step4FacialVerificationProps> = ({ onFinalSubmit }) => {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(
    null
  );
  const [selfie, setSelfie] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getCameraPermission = useCallback(async () => {
    if (selfie) return; // Don't re-request if selfie is already taken

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('Camera API not supported.');
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Camera Not Supported',
        description: 'Your browser does not support camera access.',
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasCameraPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description:
          'Please enable camera permissions in your browser settings to use this feature.',
      });
    }
  }, [toast, selfie]);

  useEffect(() => {
    getCameraPermission();

    return () => {
      // Clean up camera stream when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [getCameraPermission]);

  const takeSelfie = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        setSelfie(dataUrl);

        // Stop camera stream
        if (video.srcObject) {
          const stream = video.srcObject as MediaStream;
          stream.getTracks().forEach((track) => track.stop());
          video.srcObject = null;
        }
      }
    }
  };

  const retakeSelfie = () => {
    setSelfie(null);
    // We need a short delay to allow the state to update before requesting the camera again
    setTimeout(() => {
      getCameraPermission();
    }, 100);
  };

  const handleFinish = async () => {
      setIsSubmitting(true);
      // Here you would typically upload the selfie to your backend.
      // For this demo, we'll just simulate a delay.
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Selfie data:", selfie);
      setIsSubmitting(false);
      onFinalSubmit();
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4 text-center">
      <canvas ref={canvasRef} className="hidden" />
      <div className="relative w-full max-w-xs aspect-square rounded-lg bg-muted overflow-hidden flex items-center justify-center">
        {selfie ? (
          <img
            src={selfie}
            alt="Your selfie"
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
          />
        )}

        {!selfie && hasCameraPermission === false && (
          <Camera className="h-16 w-16 text-muted-foreground/50" />
        )}
        {!selfie && (
          <p className="absolute bottom-4 text-sm text-muted-foreground px-4">
            Frame your face in the oval and hold still.
          </p>
        )}
      </div>
      {hasCameraPermission === false && (
        <Alert variant="destructive">
          <AlertTitle>Camera Access Required</AlertTitle>
          <AlertDescription>
            Please allow camera access to use this feature.
          </AlertDescription>
        </Alert>
      )}

      {selfie ? (
        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={retakeSelfie}>
            <RefreshCw className="mr-2" />
            Retake
          </Button>
          <Button type="button" onClick={handleFinish} disabled={isSubmitting}>
            {isSubmitting ? 'Finishing...' : 'Finish Sign Up'}
          </Button>
        </div>
      ) : (
        <Button type="button" onClick={takeSelfie} disabled={!hasCameraPermission}>
          <Camera className="mr-2" />
          Take Selfie
        </Button>
      )}
    </div>
  );
};
