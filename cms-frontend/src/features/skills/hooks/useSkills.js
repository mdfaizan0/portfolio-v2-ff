import useSWR, { mutate } from "swr";
import { fetchSkills, createSkill, updateSkill, deleteSkill } from "../api/skillsApi";
import { notify } from "@/lib/toast/notify";
import { useNavigate } from "react-router-dom";

// Fetch all skills
export function useSkills() {
    const { data, error, isLoading } = useSWR("/skills", fetchSkills);
    return {
        skills: data || [],
        isLoading,
        isError: error
    };
}

// Mutations
export function useSkillMutations() {
    const navigate = useNavigate();

    const create = async (data) => {
        try {
            await createSkill(data);
            mutate("/skills");
            notify("Skill created successfully", "success");
            navigate("/cms/skills");
        } catch (error) {
            notify(error.response?.data?.message || "Failed to create skill", "error");
        }
    };

    const update = async (id, data) => {
        try {
            await updateSkill(id, data);
            mutate("/skills");
            notify("Skill updated successfully", "success");
            navigate("/cms/skills");
        } catch (error) {
            notify(error.response?.data?.message || "Failed to update skill", "error");
        }
    };

    const remove = async (id) => {
        try {
            await deleteSkill(id);
            mutate("/skills");
            notify("Skill deleted successfully", "success");
        } catch (error) {
            notify(error.response?.data?.message || "Failed to delete skill", "error");
        }
    };

    return { create, update, remove };
}
