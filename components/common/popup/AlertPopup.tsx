"use client";

import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui";

interface Props {
    children: React.ReactNode;
}

function AlertPopup({ children }: Props) {
    const { id } = useParams();
    const router = useRouter();
    const { toast } = useToast();

    const handleSDeleteTask = async()=>{
        try {
            const { status } = await supabase
            .from('todos')
            .delete()
            .eq("id", id);

            if ( status === 204) {
                toast({
                    title: "해당 task를 삭제했습니다",
                    description: "새로운 task를 생성해보세요"
                });
                router.push("/");
            }
            
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "에러",
                description: "에러발생",
            });
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>해당 TASK를 정말로 삭제하시겠습니까?</AlertDialogTitle>
                    <AlertDialogDescription>
                        이 작업이 실행되면 다시 취소할 수 없습니다.
                        <br /> 삭제가 진행되면 귀하의 게시물은 영구적으로 삭제됩니다.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>취소</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSDeleteTask} className="bg-red-600 hover:bg-rose-600">삭제</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export { AlertPopup };
