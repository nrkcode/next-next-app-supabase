"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

function useDeleteTask() {
    const router = useRouter();
    const { toast } = useToast();

    const deleteTask = async (taskId: number) => {
        try {
            const { status, error } = await supabase
                .from("todos")
                .delete()
                .eq("id", taskId);

            if (status === 204) {
                toast({
                    title: "해당 task를 삭제했습니다",
                    description: "새로운 task를 생성해보세요",
                });
                router.push("/");
            }

            if (error) {
                /** 네트워크 오류나 예기치 않은 에러를 잡기 위해 catch 구문 사용 */
                toast({
                    variant: "destructive",
                    title: "에러가 발생했습니다.",
                    description: `Supabase 오류: ${error.message || "알 수 없는 오류"}`,
                });
            }
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "에러",
                description: "에러발생",
            });
        }
    };

    return deleteTask;
}

export { useDeleteTask };