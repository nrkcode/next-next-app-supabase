"use client";

import { Button } from "@/components/ui";
import { toast, useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";


function InitPage() {
    const { toast } = useToast();
    const router = useRouter();
    
    
    /** add new page */
    const handleCreateTask = async () => {
        console.log("버튼동작");
        try {
            const { data, status, error } = await supabase
                .from("todos")
                .insert([
                    { title: "", start_date: null, end_date: null, boards: null },
                ])
                .select();

            console.log(data);

            if (status === 201 && data) {
                /** TOAST UI 띄우기 */
                // 설치코드: npx shadcn@latest add toast
                toast({
                    title: "새로운 투두리스트가 생성",
                    description: "수파베이스확인",
                });
                router.push(`/board/${data[0].id}`);
            }
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "새로운 투두리스트가 생성",
                description: "개발자 도구창을 확인하세요",
            });
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-5 mb-6">
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                    How to start:
                </h3>
                <div className="flex flex-col items-center gap-3">
                    <small className="text-sm font-normal leading-none">
                        1. Create a page
                    </small>
                    <small className="text-sm font-normal leading-none">
                        2. Add boards to page
                    </small>
                </div>
            </div>
            <Button
                className="text-[#E79057] bg-transparent border border-[#E79057] hover:bg-[#FFF9F5] w-[180px]"
                onClick={handleCreateTask}
            >
                Add New Page
            </Button>
        </div>
    );
}

export default InitPage;
