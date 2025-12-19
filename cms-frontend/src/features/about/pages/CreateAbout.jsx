import { useAboutMutations } from "../hooks/useAbout";
import AboutForm from "../components/AboutForm";
import PageContainer from "@/components/layout/PageContainer";
import PageTransition from "@/components/shared/PageTransition";

export default function CreateAbout() {
    const { create } = useAboutMutations();

    return (
        <PageTransition>
            <PageContainer>
                <AboutForm onSubmit={create} />
            </PageContainer>
        </PageTransition>
    );
}
