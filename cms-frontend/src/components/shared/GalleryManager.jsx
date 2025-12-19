import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UploadCloud, GripHorizontal, X, Loader2, Trash2, Upload } from "lucide-react";
import { uploadClient } from "@/lib/api/uploadClient";
import { notify } from "@/lib/toast/notify";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { RestrictedButton } from "@/components/shared/Restricted";

// Helper to generate unique IDs for local items
const generateId = () => Math.random().toString(36).substr(2, 9);

export default function GalleryManager({
    value = [], // Array of { path, order }
    onChange,
    folder = "projects",
    label = "Project Gallery",
    disabled = false,
    onUploadComplete = null, // Callback for cleanup tracking
    onImageDelete = null, // Callback to delete uploaded images immediately
    maxItems = 5
}) {
    // Local state item structure: { id, file, path, preview, status: 'existing' | 'pending' | 'uploaded' }
    const [items, setItems] = useState([]);
    const [uploading, setUploading] = useState(false);

    // Drag state
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);

    const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
    const fileInputRef = useRef(null);
    const objectUrlsRef = useRef(new Set());

    // Initialize state from props.value
    useEffect(() => {
        if (items.length === 0 && value?.length > 0) {
            const initialItems = value
                .sort((a, b) => a.order - b.order)
                .map(v => ({
                    id: generateId(),
                    path: v.path,
                    order: v.order,
                    preview: v.url || v.path, // Use URL if available
                    status: 'existing'
                }));
            setItems(initialItems);
        }
    }, [value]);

    // Cleanup object URLs on unmount
    useEffect(() => {
        return () => {
            objectUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
            objectUrlsRef.current.clear();
        };
    }, []);

    const handleFilesSelect = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        if (items.length + files.length > maxItems) {
            notify(`You can only have up to ${maxItems} images.`, "error");
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        const newItems = files.map((file, index) => {
            const objectUrl = URL.createObjectURL(file);
            objectUrlsRef.current.add(objectUrl); // Track for cleanup
            return {
                id: generateId(),
                file: file,
                preview: objectUrl,
                status: 'pending',
                order: items.length + index,
                path: `${folder}/${file.name}`
            };
        });

        setItems(prev => [...prev, ...newItems]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleRemove = (index) => {
        setItems(prev => {
            const newItems = [...prev];
            const item = newItems[index];

            // Delete from storage if this was uploaded in the session
            if (item.status === 'uploaded' && item.path && onImageDelete) {
                onImageDelete(item.path);
            }

            // Revoke object URL if it was local/pending
            if (item.status === 'pending' && item.preview) {
                URL.revokeObjectURL(item.preview);
                objectUrlsRef.current.delete(item.preview);
            }
            newItems.splice(index, 1);

            // Re-index remaining items to ensure clean order immediately
            return newItems.map((itm, idx) => ({ ...itm, order: idx }));
        });
    };

    const syncToParent = (currentItems) => {
        // Emit only backend-ready items
        const readyItems = currentItems.filter(i => i.status === 'existing' || i.status === 'uploaded');

        const payload = readyItems.map((item, index) => ({
            path: item.path,
            order: index,
            url: item.status === 'existing' ? item.preview : item.preview
        }));
        onChange(payload);
    };

    // --- Native HTML5 Drag and Drop ---

    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = "move";
        // Optional: Custom ghost image could be set here
    };

    const handleDragEnter = (e, index) => {
        e.preventDefault();
        if (draggedIndex === null) return;
        if (draggedIndex !== index) {
            setDragOverIndex(index);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Necessary for onDrop to fire
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e, index) => {
        e.preventDefault();
        setDragOverIndex(null);

        if (draggedIndex === null || draggedIndex === index) return;

        // Perform the reorder
        const newItems = [...items];
        const [movedItem] = newItems.splice(draggedIndex, 1);
        newItems.splice(index, 0, movedItem);

        // Update local state with re-indexed order
        const reorderedItems = newItems.map((itm, idx) => ({
            ...itm,
            order: idx
        }));

        setItems(reorderedItems);
        setDraggedIndex(null);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
        setDragOverIndex(null);
    };


    const handleResetGallery = () => {
        // Revoke all local URLs
        items.forEach(item => {
            if (item.status === 'pending' && item.preview) {
                URL.revokeObjectURL(item.preview);
            }
        });
        objectUrlsRef.current.clear();

        setItems([]);
        onChange([]);
        notify("Gallery reset", "success");
        setIsResetDialogOpen(false);
    };

    const pendingCount = items.filter(i => i.status === 'pending').length;

    const handleUploadAll = async () => {
        const pendingItems = items.filter(i => i.status === 'pending');
        if (pendingItems.length === 0) {
            syncToParent(items);
            notify("Gallery order updated", "success");
            return;
        }

        setUploading(true);
        let successCount = 0;
        let failCount = 0;

        const newItemsState = [...items];

        try {
            const uploadPromises = pendingItems.map(async (item) => {
                const formData = new FormData();
                formData.append("files", item.file);

                try {
                    const res = await uploadClient.post(`/upload?folder=${folder}`, formData);
                    if (res && res.path) {
                        // Track for global form cleanup
                        if (onUploadComplete) onUploadComplete(res.path);

                        const index = newItemsState.findIndex(i => i.id === item.id);
                        if (index !== -1) {
                            // Revoke blob URL
                            if (item.preview) {
                                URL.revokeObjectURL(item.preview);
                                objectUrlsRef.current.delete(item.preview);
                            }

                            newItemsState[index] = {
                                ...newItemsState[index],
                                path: res.path,
                                status: 'uploaded',
                                file: null,
                                // Use signed URL for preview if available, else path
                                preview: res.url || res.path
                            };
                        }
                        successCount++;
                    } else {
                        throw new Error("No path returned");
                    }
                } catch (err) {
                    console.error("Single file upload failed", err);
                    failCount++;
                }
            });

            await Promise.all(uploadPromises);
            setItems(newItemsState);

            if (failCount === 0) {
                notify(`Successfully uploaded ${successCount} images`, "success");
                syncToParent(newItemsState);
            } else {
                notify(`Uploaded ${successCount}, Failed ${failCount}. Please retry.`, "warning");
            }

        } catch (error) {
            console.error("Batch upload error", error);
            notify("Batch upload failed", "error");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label>{label} <span className="text-muted-foreground text-xs ml-2">({items.length}/{maxItems})</span></Label>
                <div className="flex items-center gap-2">
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFilesSelect}
                        disabled={uploading || items.length >= maxItems}
                    />
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading || items.length >= maxItems}
                    >
                        <Upload className="mr-2 h-4 w-4" /> Add Images
                    </Button>
                </div>
            </div>

            {/* Grid */}
            {items.length === 0 ? (
                <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground bg-muted/30">
                    No images in gallery. Add some!
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {items.map((item, index) => (
                        <div
                            key={item.id}
                            draggable={!disabled && !uploading}
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragEnter={(e) => handleDragEnter(e, index)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, index)}
                            onDragEnd={handleDragEnd}
                            className={`
                                relative group border rounded-md overflow-hidden bg-background aspect-square
                                transition-all duration-200
                                ${draggedIndex === index ? 'opacity-40 scale-95 border-primary border-dashed' : ''}
                                ${dragOverIndex === index && draggedIndex !== index ? 'ring-2 ring-primary scale-105' : ''}
                                ${item.status === 'pending' ? 'border-yellow-400 border-2' : ''}
                                cursor-grab active:cursor-grabbing hover:shadow-md
                            `}
                        >
                            <img
                                src={item.preview}
                                alt="Gallery item"
                                className="w-full h-full object-cover pointer-events-none select-none"
                            />

                            {/* Drag Handle Overlay */}
                            <div className="absolute top-2 left-2 p-1 bg-black/50 rounded-md text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                <GripHorizontal className="h-4 w-4" />
                            </div>

                            {/* Status Indicator (Pulsing Dot) */}
                            {item.status === 'pending' && (
                                <div className="absolute top-2 right-2 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                                </div>
                            )}

                            {/* Remove Button */}
                            <button
                                type="button"
                                onClick={() => handleRemove(index)}
                                disabled={disabled || uploading}
                                className="absolute bottom-2 right-2 p-1.5 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 focus:opacity-100 disabled:opacity-0 cursor-pointer z-10"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <p className="text-xs text-muted-foreground">
                Drag to reorder. Items with a yellow dot are pending upload.
            </p>

            {/* Footer Actions */}
            <div className="flex flex-wrap justify-between items-center bg-muted/30 p-4 rounded-lg gap-4">
                <div className="text-sm text-muted-foreground whitespace-nowrap">
                    {items.length} item(s) • {pendingCount} pending upload
                </div>
                <div className="flex gap-2 shrink-0">
                    {items.length > 0 && (
                        <Button
                            variant="destructive"
                            size="sm"
                            disabled={disabled || uploading}
                            onClick={() => setIsResetDialogOpen(true)}
                            title="Reset Gallery"
                            type="button"
                        >
                            <Trash2 className="w-4 h-4 mr-2" /> Reset
                        </Button>
                    )}

                    {pendingCount > 0 ? (
                        <RestrictedButton
                            variant="default"
                            size="sm"
                            onClick={handleUploadAll}
                            disabled={uploading}
                            title="Superadmins only"
                            type="button"
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                                </>
                            ) : (
                                <>
                                    <UploadCloud className="mr-2 h-4 w-4" /> Upload & Save Order
                                </>
                            )}
                        </RestrictedButton>
                    ) : (
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => syncToParent(items)}
                            disabled={items.length === 0}
                        >
                            Confirm Order
                        </Button>
                    )}
                </div>
            </div>

            <ConfirmDialog
                open={isResetDialogOpen}
                onOpenChange={setIsResetDialogOpen}
                title="Reset Gallery?"
                description="This will remove all images from this selection. Files will remain on the server but will be unlinked from this item."
                confirmLabel="Reset Gallery"
                destructive
                onConfirm={handleResetGallery}
            />
        </div>
    );
}
