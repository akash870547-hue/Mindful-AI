'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Loader2, Video, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { AnalyzeMoodOutput } from '@/lib/types';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { analyzeFaceExpressionAction } from '@/app/actions';

interface FacialAnalysisProps {
  onSubmit: (analysisPromise: Promise<{ data: AnalyzeMoodOutput | null; error: string | null }>) => void;
  isSubmitting: boolean;
}

export function FacialAnalysis({ onSubmit, isSubmitting }: FacialAnalysisProps) {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraOpen(false);
       if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  }, [stream]);

  const getCameraPermission = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Camera Not Supported',
        description: 'Your browser does not support camera access.',
      });
      return;
    }
    try {
      const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(cameraStream);
      setHasCameraPermission(true);
      setIsCameraOpen(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      setIsCameraOpen(false);
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions in your browser settings to use this app.',
      });
    }
  };

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const handleAnalyzeFace = async () => {
    if (!videoRef.current) {
      toast({
        variant: 'destructive',
        title: 'Camera Error',
        description: 'Camera feed is not available.',
      });
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageDataUri = canvas.toDataURL('image/jpeg');
      stopCamera();
      onSubmit(analyzeFaceExpressionAction(imageDataUri));
    }
  };

  const handleOpenCamera = () => {
    if (hasCameraPermission === false) {
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions in your browser settings and try again.',
      });
      return;
    }
    getCameraPermission();
  };

  return (
    <Card className="shadow-lg backdrop-blur-sm bg-card/80">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Quick Mood Scan</CardTitle>
        <CardDescription>Optionally, use your camera for an instant mood analysis based on your facial expression.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isCameraOpen ? (
          <>
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted shadow-inner">
              <video ref={videoRef} className="h-full w-full object-cover" autoPlay muted playsInline />
              {!stream && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={handleAnalyzeFace} disabled={isSubmitting || !stream} className="w-full text-lg py-6">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Camera className="mr-2 h-5 w-5" />
                    Scan Face
                  </>
                )}
              </Button>
              <Button onClick={stopCamera} variant="outline" className="w-full text-lg py-6">
                <X className="mr-2 h-5 w-5" />
                Close Camera
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex aspect-video w-full flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/30">
              <Video className="h-16 w-16 text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">Camera is off</p>
            </div>
            <Button onClick={handleOpenCamera} disabled={isSubmitting} className="w-full text-lg py-6">
              <Camera className="mr-2 h-5 w-5" />
              Analyze with Camera
            </Button>
          </>
        )}

        {hasCameraPermission === false && (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>Camera Access Required</AlertTitle>
            <AlertDescription>
              Please allow camera access in your browser settings to use this feature. You may need to reload the page after granting permission.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
