import { useAbout, useAboutMutations } from "../hooks/useAbout";
import AboutForm from "../components/AboutForm";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "@/components/layout/PageContainer";
import PageTransition from "@/components/shared/PageTransition";

export default function EditAbout() {
    const { about, isLoading, isError } = useAbout();
    const { update } = useAboutMutations();
    const navigate = useNavigate();

    // Redirect if 404 (handled loosely, mainly relying on View page to gate this, but good to have)
    useEffect(() => {
        if (isError && isError.response?.status === 404) {
            navigate("/cms/about");
        }
    }, [isError, navigate]);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // Double check existence to avoid flashing form or error if data is missing
    if (!about) return null;

    return (
        <PageTransition>
            <PageContainer>
                <AboutForm
                    initialData={about}
                    onSubmit={update}
                    isEditing={true}
                />
            </PageContainer>
        </PageTransition>
    );
}
