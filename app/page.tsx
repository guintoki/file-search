"use client";

import { useState } from "react";
import { FileUpload } from "@/components/file-upload";
import { FileList } from "@/components/file-list";
import { FileViewer } from "@/components/file-viewer";

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFilesUploaded = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (fileToRemove: File) => {
    setFiles((prev) => prev.filter((file) => file !== fileToRemove));
  };

  const handleReadFile = (file: File) => {
    setSelectedFile(file);
  };

  const handleCloseViewer = () => {
    setSelectedFile(null);
  };

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Document Search App
      </h1>

      <FileUpload onFilesUploaded={handleFilesUploaded} />

      <FileList
        files={files}
        onRemoveFile={handleRemoveFile}
        onReadFile={handleReadFile}
      />

      {selectedFile && (
        <FileViewer file={selectedFile} onClose={handleCloseViewer} />
      )}
    </div>
  );
}
