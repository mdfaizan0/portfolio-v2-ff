import { adminClient } from "@/lib/api/adminClient";
import { publicClient } from "@/lib/api/publicClient";

// Public Routes (Reading) - Used by CMS for View View
export const fetchAbout = async () => {
    // Assuming backend endpoint is /about
    // Using publicClient as it's a GET request and likely public
    const response = await publicClient.get("/about");
    return response.data;
};

// Admin Routes (Writing)
export const createAbout = async (data) => {
    const response = await adminClient.post("/about", data);
    return response.data;
};

export const updateAbout = async (data) => {
    // Backend is singleton, might handle PUT/PATCH on /about directly or /about/:id
    // Based on controller, it uses req.body, and implicitly finds the one doc.
    const response = await adminClient.put("/about", data);
    return response.data;
};

export const deleteAbout = async () => {
    const response = await adminClient.delete("/about");
    return response.data;
};
