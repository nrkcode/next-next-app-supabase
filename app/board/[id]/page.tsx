"use client";

import Image from "next/image";
/** UI 컴포넌트 */
import { AlertPopup, BoardCard } from "@/components/common";
import { Button, LabelDatePicker, Progress } from "@/components/ui";
import { ChevronLeft } from "@/public/assets/icons/index";
/** 스타일 */
import styles from "./page.module.scss";

import { toast, useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Board, Task } from "@/types";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";

function BoardPage() {
    const { toast } = useToast();
    const router = useRouter();
    const { id }= useParams();
    const [task, setTask] = useState<Task|null>(null);
    const [boards, setBoards] = useState<Board[]>(task?.boards || []);
    

    /** 특정 id 값에 따른 TASK 데이터 */
    const getTask = async () => {
        try {
            const { data, status } = await supabase.from("todos").select("*").eq("id", id);

            if (data !== null && status === 200) {
                setTask(data[0]);
                setBoards(data[0].boards || []);
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

    /** Board Card 생성 및 데이터베이스에 저장 */
    const handleCreateBoard  = async () => {
        const newBoard: Board = {
            id: nanoid(),
            title: "",
            startDate: null,
            endDate: null,
            content: "",
            isCompleted: false,
        };
        const updatedBoards = [...boards, newBoard];
        setBoards(updatedBoards);
        updateTaskOneColumnById(Number(id), "boards", updatedBoards);
    };

    const updateTaskOneColumnById = async (uid: number, column: string, newValue: any) => {
        try {
            const { data, status } = await supabase
                .from("todos")
                .update({ [column]: newValue })
                .eq("id", uid);

            if ( data !== null && status ===204 ) {
                toast({
                    title: "새로운 todo를 생성했습니다",
                    description: "생성한 todo-board를 확인하세요"
                });
            }
        } catch (error) {
            console.error(error);
        };
    }
    
    useEffect(() => {
        getTask();
    }, []);
    
    return (
        <>
            <div className={styles.header}>
                <div className={styles[`header__btn-box`]}>
                    <Button variant={"outline"} size={"icon"}>
                        <ChevronLeft />
                    </Button>
                    <div className="flex items-center gap-2">
                        <Button variant={"secondary"}>저장</Button>
                        <AlertPopup>
                            <Button className="text-rose-600 bg-red-50 hover:bg-rose-50">삭제</Button>
                        </AlertPopup>
                    </div>
                </div>
                <div className={styles.header__top}>
                    {/* 제목 입력 Input 섹션 */}
                    <input type="text" placeholder="Enter Title Here!" className={styles.header__top__input} />
                    {/* 진행상황 척도 그래프 섹션 */}
                    <div className="flex items-center justify-start gap-4">
                        <small className="text-sm font-medium leading-none text-[#6D6D6D]">1/10 Completed</small>
                        <Progress className="w-60 h-[10px]" value={33} />
                    </div>
                </div>
                {/* 캘린더 + Add New Board 버튼 섹션 */}
                <div className={styles.header__bottom}>
                    <div className="flex items-center gap-5">
                        <LabelDatePicker label={"From"} />
                        <LabelDatePicker label={"To"} />
                    </div>
                    <Button onClick={handleCreateBoard} className="text-white bg-[#E79057] hover:bg-[#E26F24] hover:ring-1 hover:ring-[#E26F24] hover:ring-offset-1 active:bg-[#D5753D] hover:shadow-lg">Add New Board</Button>
                </div>
            </div>
            <div className={styles.body}>
            {boards.length !== 0 ? (
                //{/* Add New Board 버튼 클릭으로 인한 Board 데이터가 있을 경우 */}
                <div className={styles.body__isData}>
                    {boards.map((board: Board)=>{
                        return <BoardCard key={board.id}/>;
                    })}
                </div>
            ):(
                //{/* Add New Board 버튼 클릭으로 인한 Board 데이터가 없을 경우 */}
                <div className={styles.body__noData}>
                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">There is no board yet.</h3>
                    <small className="text-sm font-medium leading-none text-[#6D6D6D] mt-3 mb-7">Click the button and start flashing!</small>
                    <button onClick={handleCreateBoard}>
                        <Image src="/assets/images/button.svg" width={74} height={74} alt="rounded-button" />
                    </button>
                </div>
            )}

            </div>
        </>
    );
}

export default BoardPage;
