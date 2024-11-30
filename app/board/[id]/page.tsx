"use client";

import Image from "next/image";
/** UI 컴포넌트 */
import { AlertPopup, BoardCard } from "@/components/common";
import { Button, LabelDatePicker, Progress } from "@/components/ui";
import { ChevronLeft } from "@/public/assets/icons/index";
/** 스타일 */
import styles from "./page.module.scss";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Board, Task } from "@/types";
import { nanoid } from "nanoid";
import { useCreateBoard, useGetTaskById, useGetTasks } from "@/hooks/api";


function BoardPage() {
    const { toast } = useToast();
    const { id } = useParams();
    const { getTasks } = useGetTasks();
    const { task } = useGetTaskById(Number(id)); // 특정 id 값에 따른 TASK 데이터
    const createBoard = useCreateBoard();

    /** Board Page에서 사용되는 상태값 */
    const [title, setTitle] = useState("");
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [count, setCount] = useState<number>(0);
    const [boards, setBoards] = useState<Board[]>([]);


    /** Board Card 생성 및 데이터베이스에 저장 */
    const handleCreateBoard = () => {
        const newBoard: Board = {
            id: nanoid(),
            title: "",
            startDate: null,
            endDate: null,
            content: "",
            isCompleted: false,
        };
        const newBoards = [...boards, newBoard];
        setBoards(newBoards);
        createBoard(Number(id), "boards", newBoards );
    };

    const handleSave = async () => {
        if (!title || !startDate || !endDate) {
            toast({
                variant: "destructive",
                title: "기입되지 않은 데이터(값)가 있습니다.",
                description: "제목, 시작일, 종료일은 필수 값입니다.",
            });
            return;
        }
        try {
            const { data, status, error } = await supabase
                .from("todos")
                .update({
                    title: title,
                    start_date: startDate,
                    end_date: endDate,
                })
                .eq("id", id)
                .select();

            if (data !== null && status === 200) {
                toast({
                    title: "TASK 저장을 완료하였습니다.",
                    description: "수정한 TASK의 마감일을 꼭 지켜주세요!",
                });
                /** 서버에서 데이터 갱신 후 상태값을 업데이트
                 * Aside-Section의 리스트 정보를 실시간으로 업데이트 하기 위해
                 */
                getTasks();
            }
            if (error) {
                toast({
                    variant: "destructive",
                    title: "에러가 발생했습니다.",
                    description: `Supabase 오류: ${error.message || "알 수 없는 오류"}`,
                });
            }
        } catch (error) {
            /** 네트워크 오류나 예기치 않은 에러를 잡기 위해 catch 구문 사용 */
            console.error(error);
            toast({
                variant: "destructive",
                title: "네트워크 오류",
                description: "서버와 연결할 수 없습니다. 다시 시도해주세요!",
            });
        }
    };

     /** task가 로드되면, 상태값 업데이트 */
    useEffect(() => {
        if (task) {
            setTitle(task.title || "");
            setStartDate(task.startDate);
            setEndDate(task.endDate);
            setBoards(task.boards);
        }
    }, [task]);

    return (
        <>
            <div className={styles.header}>
                <div className={styles[`header__btn-box`]}>
                    <Button variant={"outline"} size={"icon"}>
                        <ChevronLeft />
                    </Button>
                    <div className="flex items-center gap-2">
                        <Button variant={"secondary"} onClick={handleSave}>저장</Button>
                        <AlertPopup>
                            <Button className="text-rose-600 bg-red-50 hover:bg-rose-50">
                                삭제
                            </Button>
                        </AlertPopup>
                    </div>
                </div>
                <div className={styles.header__top}>
                    {/* 제목 입력 Input 섹션 */}
                    <input type="text" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Enter Title Here!" className={styles.header__top__input} />
                    {/* 진행상황 척도 그래프 섹션 */}
                    <div className="flex items-center justify-start gap-4">
                        <small className="text-sm font-medium leading-none text-[#6D6D6D]">
                            1/10 Completed
                        </small>
                        <Progress className="w-60 h-[10px]" value={33} />
                    </div>
                </div>
                {/* 캘린더 + Add New Board 버튼 섹션 */}
                <div className={styles.header__bottom}>
                    <div className="flex items-center gap-5">
                        <LabelDatePicker label={"From"} />
                        <LabelDatePicker label={"To"} />
                    </div>
                    <Button
                        onClick={handleCreateBoard}
                        className="text-white bg-[#E79057] hover:bg-[#E26F24] hover:ring-1 hover:ring-[#E26F24] hover:ring-offset-1 active:bg-[#D5753D] hover:shadow-lg"
                    >
                        Add New Board
                    </Button>
                </div>
            </div>
            <div className={styles.body}>
                {boards.length !== 0 ? (
                    //{/* Add New Board 버튼 클릭으로 인한 Board 데이터가 있을 경우 */}
                    <div className={styles.body__isData}>
                        {boards.map((board: Board) => {
                            return <BoardCard key={board.id} />;
                        })}
                    </div>
                ) : (
                    //{/* Add New Board 버튼 클릭으로 인한 Board 데이터가 없을 경우 */}
                    <div className={styles.body__noData}>
                        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                            There is no board yet.
                        </h3>
                        <small className="text-sm font-medium leading-none text-[#6D6D6D] mt-3 mb-7">
                            Click the button and start flashing!
                        </small>
                        <button onClick={handleCreateBoard}>
                            <Image
                                src="/assets/images/button.svg"
                                width={74}
                                height={74}
                                alt="rounded-button"
                            />
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

export default BoardPage;
