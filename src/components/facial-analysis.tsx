'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, Loader2 } from 'lucide-react';
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
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
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
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };

    getCameraPermission();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);

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
      onSubmit(analyzeFaceExpressionAction(imageDataUri));
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Facial Analysis</CardTitle>
        <CardDescription>Let the AI analyze your facial expression for a quick mood check.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted">
            <video ref={videoRef} className="h-full w-full object-cover" autoPlay muted playsInline />
            {hasCameraPermission === false && (
                 <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <p className="text-white">Camera access denied or not available.</p>
                </div>
            )}
            {hasCameraPermission === null && (
                 <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            )}
        </div>

        {hasCameraPermission === false && (
          <Alert variant="destructive">
            <AlertTitle>Camera Access Required</AlertTitle>
            <AlertDescription>
              Please allow camera access in your browser settings to use this feature.
            </AlertDescription>
          </Alert>
        )}
        
        <Button onClick={handleAnalyzeFace} disabled={isSubmitting || !hasCameraPermission} className="w-full text-lg py-6">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Analyzing Face...
            </>
          ) : (
            <>
              <Camera className="mr-2 h-5 w-5" />
              Analyze My Expression
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
