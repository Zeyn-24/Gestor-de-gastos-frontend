import { useSEO } from "../hooks/useSEO"
import { useExpenses, Expense } from "../hooks/useExpense"
import { toast } from "react-toastify"
import api from "../services/Fetch"
import { useQueryClient } from "@tanstack/react-query"
import { Link } from "react-router-dom"

const Home = () => {
    useSEO('Gastos')
    const { expenses, isLoading, error } = useExpenses()
    const queryClient = useQueryClient()

    const handleDeleteExpense = async (id: Expense['id']) => {
        try {
            const response = await api.delete(`/expenses/${id}`)
            toast.success(`${response.data.message}!`)
            queryClient.invalidateQueries({ queryKey: ['Expenses'] })
        } catch (error) {
            console.error('Error: ', (error as { response?: { data?: { message?: string } } }).response?.data?.message || (error as { message?: string }).message)
            toast.error('Error eliminando el gasto')
        }
    }

    return (
        <div className="h-screen flex justify-center items-center bg-background-primary">
            <div className="bg-background-neutral min-w-1/4 flex flex-col p-6 rounded-lg shadow-md">
                <div className="p-4 border-b border-border flex flex-col">
                    <h1 className="text-primary text-3xl text-center p-4">
                        Lista de Gastos
                    </h1>
                    <Link to='/add-expense' className='py-2 px-6 border rounded-md border-primary text-primary hover:text-accent hover:border-accent transition duration-300 text-center'>
                        Agregar gasto
                    </Link>
                </div>
                <div>
                    {error ? (
                        <p className="text-status-error text-lg text-center p-6">{error?.message}</p>
                    ) : isLoading ? (
                        <p className="text-text-secondary text-lg text-center p-6">Cargando Gastos...</p>
                    ) : expenses?.length <= 0 ? (
                        <p className="text-lg text-text-secondary p-6 text-center">No hay gastos en este momento.</p>
                    ) : (
                        <ul>
                            {expenses.map((expense: Expense) => (
                                <li key={expense.id} className="flex flex-col w-full bg-background-dark py-2 px-4 gap-2 text-center mt-4 rounded-lg border border-secondary text-text-secondary">
                                    <h2 className="text-xl font-semibold">{expense.title}</h2>
                                    <p className="text-sm"><strong>Monto:</strong> {expense.amount}</p>
                                    <p className="text-sm"><strong>Categoria:</strong> {expense.category}</p>
                                    <p className="text-sm"><strong>Fecha:</strong> {expense.date}</p>
                                    <div className="px-4 py-2 flex justify-center gap-4">
                                        <Link to={`/edit-expense/${expense.id}`} className="bg-primary border border-accent py-2 px-6 rounded text-text-primary hover:bg-secondary transition duration-300 cursor-pointer">Editar</Link>
                                        <button onClick={() => handleDeleteExpense(expense.id)} className="bg-primary border border-accent py-2 px-6 rounded text-text-primary hover:bg-secondary transition duration-300 cursor-pointer">Eliminar</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Home