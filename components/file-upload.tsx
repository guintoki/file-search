"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, type File, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface FileUploadProps {
  onFilesUploaded: (files: File[]) => void
}

export function FileUpload({ onFilesUploaded }: FileUploadProps) {
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const validFileTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ]

      const invalidFiles = acceptedFiles.filter((file) => !validFileTypes.includes(file.type))

      if (invalidFiles.length > 0) {
        setError("Please upload only PDF, DOC, DOCX, or XLSX files.")
        return
      }

      setError(null)
      onFilesUploaded(acceptedFiles)
    },
    [onFilesUploaded],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? "border-primary bg-primary/10" : "border-gray-300 hover:border-primary"}`}
      >
        <input {...getInputProps()} />
        <Upload className="w-10 h-10 mx-auto mb-4 text-gray-400" />
        <p className="text-lg mb-2">{isDragActive ? "Drop files here" : "Drag & drop files here"}</p>
        <p className="text-sm text-gray-500">or click to select files (PDF, DOC, DOCX, XLSX)</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

