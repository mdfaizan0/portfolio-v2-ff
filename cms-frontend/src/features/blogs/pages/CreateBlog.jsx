import PageContainer from "@/components/layout/PageContainer";
import BlogForm from "../components/BlogForm";
import { useBlogMutations } from "../hooks/useBlogs";
import PageTransition from "@/components/shared/PageTransition";

export default function CreateBlog() {
    const { create } = useBlogMutations();

    return (
        <PageTransition>
            <PageContainer>
                <div className="max-w-5xl mx-auto py-6">
                    <BlogForm onSubmit={create} />
                </div>
            </PageContainer>
        </PageTransition>
    );
}
