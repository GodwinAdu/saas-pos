'use client'

import { useUploadThing } from "@/lib/uploadthing"
import { useDropzone } from "@uploadthing/react"
import { useCallback, useState } from "react"
import { generateClientDropzoneAccept, generatePermittedFileTypes } from "uploadthing/client"
import { Card, CardContent } from "@/components/ui/card"
import { UploadCloud, File, X } from 'lucide-react'
import { ControllerRenderProps } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"

interface ImageUploaderProps extends ControllerRenderProps {
  label?: string
}

export function ImageUploader({ onChange, value, label }: ImageUploaderProps) {
  const [files, setFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})


  const { startUpload, routeConfig } = useUploadThing("imageUploader", {
    onUploadProgress: (progress) => {
      setUploadProgress((prev) => ({
        ...prev,
        [progress.fileName]: progress.progress,
      }))
    },
    onClientUploadComplete: (res) => {
      if (res) {
        const uploadedUrls = res.map(file => file.url)
        onChange(uploadedUrls)
        setFiles([])
        setUploadProgress({})
        toast({
          title: "Success",
          description: `Uploaded ${res.length} ${res.length === 1 ? 'file' : 'files'}`,
        })
      }
    },
    onUploadError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Error occurred while uploading",
        variant: "destructive",
      })
      setUploadProgress({})
    },
  })

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles)
    startUpload(acceptedFiles)
  }, [startUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(
      generatePermittedFileTypes(routeConfig).fileTypes,
    ),
  })

  const removeFile = (fileToRemove: File) => {
    setFiles(files.filter(file => file !== fileToRemove))
    setUploadProgress((prev) => {
      const newProgress = { ...prev }
      delete newProgress[fileToRemove.name]
      return newProgress
    })
    onChange(value.filter((url: string) => !url.includes(fileToRemove.name)))
  }

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
            isDragActive ? "border-primary bg-primary/10" : "border-gray-300"
          }`}
        >
          <input {...getInputProps()} />
          <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            {isDragActive
              ? "Drop the files here..."
              : "Drag 'n' drop some files here, or click to select files"}
          </p>
        </div>
        {files.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Uploading Files:</h4>
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li key={index} className="bg-gray-100 p-2 rounded">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <File className="h-4 w-4 mr-2" />
                      <span className="text-sm">{file.name}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeFile(file)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Progress value={uploadProgress[file.name] || 0} className="h-2" />
                </li>
              ))}
            </ul>
          </div>
        )}
        {value && value.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Uploaded Files:</h4>
            <ul className="space-y-2">
              {value.map((url: string, index: number) => (
                <li key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                  <div className="flex items-center">
                    <File className="h-4 w-4 mr-2" />
                    <span className="text-sm">{url.split('/').pop()}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => onChange(value.filter((_, i) => i !== index))}>
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

