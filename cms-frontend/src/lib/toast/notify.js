import { toast } from "sonner";

export function notify(message, type) {
    if (message === undefined && type === undefined) {
        toast.error("Something went wrong");
    } else if (type === "error") {
        toast.error(message || "Something went wrong")
    } else if (type === "warning") {
        toast.warning(message || "Something went wrong");
    } else {
        toast.success(message || "Something went wrong")
    }
}