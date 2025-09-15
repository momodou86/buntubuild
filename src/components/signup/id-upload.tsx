'use client';

import { useState, useRef, useCallback, type FC } from 'react';
import { Upload, Paperclip, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface IDUploadProps {
  onFileChange: (file: File | null) => void;
  fileName: string | null;
}

export const IdUpload: FC<IDUploadProps> = ({ onFileChange, fileName }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (files: FileList | null) => {
      if (files && files.length > 0) {
        onFileChange(files[0]);
      }
    },
    [onFileChange]
  );

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    onFileChange(null);
     if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card
      className={`bg-muted/50 border-dashed transition-colors ${
        isDragging ? 'border-primary' : 'border-border'
      }`}
    >
      <CardContent className="pt-6">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files)}
        />
        {!fileName ? (
          <div
            className="flex flex-col items-center justify-center space-y-2 text-center cursor-pointer"
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={openFileDialog}
          >
            <Upload className="h-10 w-10 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Upload Your ID</h3>
            <p className="text-sm text-muted-foreground">
              Drag & drop or click to upload a clear picture of your ID document.
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-2 pointer-events-none"
            >
              Choose File
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between p-2 text-sm bg-background rounded-md">
            <div className="flex items-center gap-2 overflow-hidden">
              <Paperclip className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{fileName}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={removeFile}
            >
              <X className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
