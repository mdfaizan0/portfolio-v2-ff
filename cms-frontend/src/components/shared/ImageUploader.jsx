import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import { uploadClient } from "@/lib/api/uploadClient";
import { notify } from "@/lib/toast/notify";
import { RestrictedButton } from "@/components/shared/Restricted";

export default function ImageUploader ({
    value,
    onChange,
    folder = "general",
    label = "Upload Image",
    disabled = false,
    previewUrl = null,
    onUploadComplete = null, // Callback for cleanup tracking
    onImageDelete = null // Callback to delete uploaded images immediately
}) {
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    // Track local object URL for cleanup
    const objectUrlRef = React.useRef(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (objectUrlRef.current) {
                URL.revokeObjectURL(objectUrlRef.current);
                objectUrlRef.current = null;
            }
        };
    }, []);

    // Sync preview with incoming value (effective for edit mode or initial load)
    useEffect(() => {
        if (selectedFile) return; // Don't override local file selection

        if (previewUrl) {
            setPreview(previewUrl);
        } else if (value) {
            // If value exists but no previewUrl (meaning it's just a path), we can't show it directly.
            // But usually parent passes previewUrl. 
            // If we just uploaded, we set preview manually in handleUpload, so this effect might not be needed for that case.
            // We'll keep it for safety but prioritize the specific preview state.
            if (!preview) setPreview(null);
        } else {
            setPreview(null);
        }
    }, [value, selectedFile, previewUrl, preview]);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Cleanup previous object URL if exists
        if (objectUrlRef.current) {
            URL.revokeObjectURL(objectUrlRef.current);
        }

        // 1. Immediate Local Preview
        const objectUrl = URL.createObjectURL(file);
        objectUrlRef.current = objectUrl;
        setPreview(objectUrl);
        setSelectedFile(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        // Delete old image if we're replacing one that was uploaded this session
        if (value && onImageDelete) {
            await onImageDelete(value);
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("files", selectedFile);

        try {
            const response = await uploadClient.post(`/upload?folder=${folder}`, formData);

            if (response && response.path) {
                onChange(response.path);
                setSelectedFile(null); // Clear selected file

                // Cleanup local preview URL now that we have uploaded
                if (objectUrlRef.current) {
                    URL.revokeObjectURL(objectUrlRef.current);
                    objectUrlRef.current = null;
                }

                // Use the returned signed URL for immediate preview
                if (response.url) {
                    setPreview(response.url);
                }

                // Notify parent for cleanup tracking
                if (onUploadComplete) {
                    onUploadComplete(response.path);
                }

                notify("Image uploaded successfully", "success");
            } else {
                throw new Error("Invalid response format");
            }
        } catch (error) {
            console.error("Upload failed", error);
            notify("Upload failed. Please try again.", "error");
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        // Delete from storage if this was uploaded in the session
        if (value && onImageDelete) {
            onImageDelete(value);
        }

        // Cleanup local preview URL
        if (objectUrlRef.current) {
            URL.revokeObjectURL(objectUrlRef.current);
            objectUrlRef.current = null;
        }
        onChange(null);
        setPreview(null);
        setSelectedFile(null);
    };

    return (
        <div className="space-y-3">
            {label && <Label>{label}</Label>}

            <div className="flex flex-col gap-4">
                {/* Preview Area - Bigger/Hero Style */}
                <div className={`relative w-full rounded-lg overflow-hidden bg-muted border flex items-center justify-center shrink-0 ${!preview ? "aspect-video" : ""}`}>
                    {preview ? (
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground opacity-50">
                            <ImageIcon className="h-12 w-12" />
                            <span className="text-sm">No image selected</span>
                        </div>
                    )}

                    {/* Loading Overlay */}
                    {uploading && (
                        <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    )}
                </div>

                {/* Actions Row */}
                <div className="flex items-center gap-2">
                    {/* Remove Button (Left) */}
                    {(preview || selectedFile) && (
                        <Button
                            variant="destructive"
                            size="icon"
                            onClick={handleRemove}
                            disabled={uploading}
                            className="cursor-pointer shrink-0"
                            title="Remove Image"
                            type="button"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}

                    {/* Upload/Select Action (Right/Fill) */}
                    <div className="flex-1">
                        {!selectedFile ? (
                            <div>
                                <input
                                    type="file"
                                    id={`file-upload-${label}`}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    onClick={(e) => (e.target.value = '')}
                                    disabled={uploading}
                                />
                                <Label
                                    htmlFor={`file-upload-${label}`}
                                    className={`flex items-center justify-center w-full rounded-md text-sm font-medium h-10 px-4 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                                >
                                    <Upload className="mr-2 h-4 w-4" />
                                    {preview ? "Change Image" : "Select Image"}
                                </Label>
                            </div>
                        ) : (
                            <RestrictedButton
                                onClick={handleUpload}
                                disabled={uploading}
                                className="w-full"
                                title="Superadmins only"
                                type="button"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="mr-2 h-4 w-4" /> Confirm Upload
                                    </>
                                )}
                            </RestrictedButton>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
