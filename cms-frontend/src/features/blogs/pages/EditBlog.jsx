import PageContainer from "@/components/layout/PageContainer";
import BlogForm from "../components/BlogForm";
import { useBlog, useBlogMutations } from "../hooks/useBlogs";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import PageTransition from "@/components/shared/PageTransition";

export default function EditBlog() {
    const { id } = useParams();
    const { blog, isLoading, isError } = useBlog(id);
    const { update } = useBlogMutations();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (isError || !blog) {
        return (
            <div className="text-center py-20 text-destructive">
                Failed to load blog.
            </div>
        );
    }

    return (
        <PageTransition>
            <PageContainer>
                <div className="max-w-5xl mx-auto py-6">
                    <BlogForm
                        initialData={blog}
                        onSubmit={(data) => update(id, data)}
                        isEditing
                    />
                </div>
            </PageContainer>
        </PageTransition>
    );
}
