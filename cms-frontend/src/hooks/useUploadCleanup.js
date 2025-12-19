import { useEffect, useRef } from 'react';
import { adminClient } from "@/lib/api/adminClient";

export function useUploadCleanup() {
    const uploadedPathsRef = useRef([]);
    const isSubmittedRef = useRef(false);

    // Track new uploads
    const handleUploadComplete = (path) => {
        if (path) {
            uploadedPathsRef.current.push(path);
        }
    };

    // Call this before unmounting if the form was successfully submitted
    const setSubmitted = () => {
        isSubmittedRef.current = true;
    };

    // Delete a path if it was uploaded in this session
    const deleteIfTracked = async (path) => {
        if (!path) return;

        const index = uploadedPathsRef.current.indexOf(path);
        if (index !== -1) {
            // Remove from tracking first
            uploadedPathsRef.current.splice(index, 1);

            // Delete from storage
            try {
                await adminClient.delete("/upload", { data: { paths: [path] } });
            } catch (err) {
                console.error("Failed to delete tracked upload:", err);
            }
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (!isSubmittedRef.current && uploadedPathsRef.current.length > 0) {
                console.log("Cleaning up unsubmitted uploads:", uploadedPathsRef.current);

                // Fire and forget delete
                adminClient.delete("/upload", { data: { paths: uploadedPathsRef.current } })
                    .catch(err => console.error("Cleanup failed", err));
            }
        };
    }, []);

    return { handleUploadComplete, setSubmitted, deleteIfTracked };
}
