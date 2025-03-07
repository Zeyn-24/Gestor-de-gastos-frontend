import { useQuery } from "@tanstack/react-query";
import api from "../services/Fetch";

export interface Expense {
    id: string,
    title: string,
    amount: number,
    date: string,
    category: string
}

const fetchExpensesData = async () => {
    try {
        const response = await api.get('/expenses')
        return response.data
    } catch (error) {
        console.log('Error obteniendo los gastos')
        throw error
    }
}

export const useExpenses = () => {
    const { data: expenses, isLoading, error, refetch } = useQuery({
        queryKey: ["Expenses"],
        queryFn: fetchExpensesData,
        staleTime: 1000 * 60 * 60 * 24, // 24 horas antes de refetch automático
        retry: 1, // Intentar 1 vez más en caso de fallo
    });

    return { expenses, isLoading, error, refetch }
}