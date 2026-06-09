import { NextResponse } from "next/server";

// types para la paginación
type PaginationMeta = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

// types para las respuestas de la API
type SuccessResponse<T> = {
    success: true;
    data: T;
    meta?: PaginationMeta;
}
type ErrorResponse = {
    success: false;
    error: {
        code: string;
        message: string;
        issues?: string[];
    }
}


export function success<T>(data: T, status: number = 200) {
    return NextResponse.json(
        //Verifica que este objeto cumpla con la estructura de SuccessResponse<T>
        {success: true, data} satisfies SuccessResponse<T>,
        {status}
    )
}

export function paginated<T>(
    data: T, 
    meta: Omit<PaginationMeta, "totalPages">
) {
    const totalPages = Math.ceil(meta.total / meta.limit)

    return NextResponse.json({
        success: true,
        data,
        meta: { ...meta, totalPages },
    }  satisfies SuccessResponse<T> )
}

export function error(
    message: string,
    status: number = 500,
    issues?: string[]
){
    return NextResponse.json(
        {
            success: false, 
            error: {
                code: "ERROR",
                message,
                issues,
            }
        } satisfies ErrorResponse,
        {status}
    )
}