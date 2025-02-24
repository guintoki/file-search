"use client";

import { File, Trash2, Eye } from "lucide-react";

interface FileListProps {
  files: File[];
  onRemoveFile: (file: File) => void;
  onReadFile: (file: File) => void;
}

export function FileList({ files, onRemoveFile, onReadFile }: FileListProps) {
  if (files.length === 0) return null;

  return (
    <div className="w-full max-w-3xl mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-4">Uploaded Files</h2>
      <div className="space-y-2">
        {files.map((file, index) => (
          <div
            key={`${file.name}-${index}`}
            className="flex items-center justify-between p-4 bg-card rounded-lg border"
          >
            <div className="flex items-center space-x-4">
              <File className="h-6 w-6 text-primary" />
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onReadFile(file)}
                className="p-2 rounded hover:bg-secondary"
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                onClick={() => onRemoveFile(file)}
                className="p-2 rounded text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
