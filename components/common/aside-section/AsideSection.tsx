"use client";

/** 컴포넌트 */
import { Button, SearchBar } from "@/components/ui";
import { toast, useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Task } from "@/types";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

function AsideSection() {
    const { toast } = useToast();
    const router = useRouter();
    const { id }= useParams();
    const [tasks, setTasks] = useState<Task[]>([]);

    /** 페이지목록- todos 전체 */
    const getTasks = async () => {
        try {
            const { data, status } = await supabase.from("todos").select("*");

            if (status === 200 && data !== null) setTasks(data);
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "에러",
                description: "에러발생",
            });
        }
    };

    /** add new page */
    const handleCreateTask = async () => {
        console.log("버튼동작");
        try {
            const { data, status, error } = await supabase
                .from("todos")
                .insert([
                    {
                        title: "",
                        start_date: null,
                        end_date: null,
                        boards: null,
                    },
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
                title: "생성실패",
                description: "개발자 도구창을 확인하세요",
            });
        }
    };

    useEffect(() => {
        getTasks();
    }, []);

    return (
        <aside className="page__aside">
            {/* 검색창 UI */}
            <SearchBar placeholder="검색어를 입력하세요." />
            {/* Add New Page 버튼 UI */}
            <Button
                className="text-[#E79057] bg-white border border-[#E79057] hover:bg-[#FFF9F5]"
                onClick={handleCreateTask}>
                Add New Page
            </Button>
            {/* TODO 목록 UI 하나 */}
            <div className="flex flex-col mt-4 gap-2">
                <small className="text-sm font-medium leading-none text-[#A6A6A6]">
                    고마11의 TODO-board
                </small>
                <ul className="flex flex-col">
                    {tasks.length ? (
                        tasks.map((task: Task) => {
                            return (
                                <li
                                    key={task.id}
                                    className={`${ task.id === Number(id) ? `bg-[#F5F5F5]` : `bg-transparent` }
                                    min-h-9 flex items-center gap-2 py-2 px-[10px] rounded-sm text-sm cursor-pointer`}
                                    onClick={() =>
                                        router.push(`/board/${task.id}`)
                                    }
                                >
                                    <div
                                        className={`${ task.id === Number(id) ? `bg-[#00F38D]` : `bg-neutral-400` }
                                        h-[6px] w-[6px] rounded-full`}> 
                                    </div>
                                    <span
                                        className={`${ task.id === Number(id) ? `` : `text-neutral-400` }`} >
                                        {task.title ? task.title : "등록된 TASK 제목이 없습니다."}
                                    </span>
                                </li>
                            );
                        })
                    ) : (
                        <li className="bg-[#F5F5F5] text-neutral-400 w-full flex items-center justify-center min-h-9  gap-2 py-2 px-[10px] rounded-sm text-sm cursor-pointer">
                            생성된 TASK가 없습니다.
                        </li>
                    )}
                </ul>
            </div>
        </aside>
    );
}

export { AsideSection };
