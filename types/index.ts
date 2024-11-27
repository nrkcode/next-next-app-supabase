export interface Task {
    id: number;
    title: string;
    startDate: Date;
    endDate: Date;
    boards: Board[];
}

export interface Board {
    id: string; // 추후에 Supabase boards 컬럼을 다른 테이블로 분리할 경우, 타입이 변경될 수 있음
    title: string;
    startDate: Date | null;
    endDate: Date | null;
    content: string;
    isCompleted: boolean;
}