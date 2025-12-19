import PageContainer from "@/components/layout/PageContainer";
import ServiceForm from "../components/ServiceForm";
import { useServiceMutations } from "../hooks/useServices";
import PageTransition from "@/components/shared/PageTransition";

export default function CreateService() {
    const { create } = useServiceMutations();

    return (
        <PageTransition>
            <PageContainer>
                <ServiceForm onSubmit={create} />
            </PageContainer>
        </PageTransition>
    );
}
