import { useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useForm, SubmitHandler } from "react-hook-form"
import api from "../services/Fetch"
import { toast } from "react-toastify"
import { useQueryClient } from "@tanstack/react-query"
import { useExpenses, Expense } from "../hooks/useExpense"
import { useSEO } from "../hooks/useSEO"

type FormValues = {
    title: string,
    amount: number,
    date: string,
    category: string
}

function normalizeDate(date: string): string {
    const regexDMY = /^(\d{2})[-/](\d{2})[-/](\d{4})$/;
    const regexYMD = /^(\d{4})[-/](\d{2})[-/](\d{2})$/;

    let match = date.match(regexDMY);
    if (match) {
        return `${match[1]}/${match[2]}/${match[3]}`;
    }

    match = date.match(regexYMD);
    if (match) {
        return `${match[3]}/${match[2]}/${match[1]}`;
    }

    return date.replace(/-/g, '/');
}

const EditExpense = () => {
    useSEO('Editar Gasto')
    const { id } = useParams()
    const [error, setError] = useState<string>()
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>()
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { expenses } = useExpenses()

    // Busca el gasto a editar según el id de la URL
    const currentExpense = expenses.find((exp: Expense) => exp.id === id)

    const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
        setError('')
        try {
            let formatDate = ''
            if(data.date){
                formatDate = normalizeDate(data.date)
            }
            const response = await api.patch(`/expenses/${id}`, {
                title: data.title || currentExpense.title,
                amount: data.amount || currentExpense.amount,
                date: formatDate || currentExpense.date,
                category: data.category || currentExpense.category
            })
            queryClient.invalidateQueries({ queryKey: ['Expenses'] })
            toast.success(`${response.data?.message}!`)
            navigate('/')
        } catch (error) {
            setError((error as { response: { data: { message: string } } }).response.data.message || (error as { message: string }).message)
            toast.error('Error al editar el gasto!')
        }
    }

    return (
        <div className="h-screen flex justify-center items-center bg-background-primary">
            <div className="bg-background-neutral min-w-1/3 flex flex-col p-6 rounded-lg shadow-md">
                <div className="p-4 border-b border-border flex flex-col">
                    <h1 className="text-primary text-3xl text-center p-4">
                        Editar Gasto
                    </h1>
                </div>
                <div className="p-4">
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full bg-background-dark py-2 px-4 gap-2 mt-4 rounded-lg border border-secondary text-text-secondary">
                        <div className="mb-4">
                            <label className="block text-text-primary mb-1 required p-2">Titulo</label>
                            <input
                                type="text"
                                placeholder={`Titulo actual: ${currentExpense ? currentExpense.title : "Comida del Mes"}`}
                                {...register('title')}
                                className="w-full p-3 border border-border rounded-lg bg-background-neutral focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-text-primary mb-1 required p-2">Monto</label>
                            <input
                                type="number"
                                placeholder={`Monto actual: ${currentExpense ? currentExpense.amount : "50.000"}`}
                                {...register('amount')}
                                className="w-full p-3 border border-border rounded-lg bg-background-neutral focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-text-primary mb-1 required p-2">Fecha</label>
                            <input
                                type="text"
                                placeholder={`Fecha actual: ${currentExpense ? currentExpense.date : "24/02/2025"}`}
                                {...register('date', {
                                    pattern: {
                                        value: /^(?:(?:(0[1-9]|[12]\d|3[01])[-/](0[1-9]|1[0-2])[-/](\d{4}))|((\d{4})[-/](0[1-9]|1[0-2])[-/](0[1-9]|[12]\d|3[01])))$/,
                                        message: 'El formato de la fecha no es correcto'
                                    }
                                })}
                                className="w-full p-3 border border-border rounded-lg bg-background-neutral focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            {errors.date && <p className='text-status-error text-sm'>{(errors.date as { message?: string }).message}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-text-primary mb-1 required p-2">Categoria</label>
                            <input
                                type="text"
                                placeholder={`Categoria actual: ${currentExpense ? currentExpense.category : "Alimentos"}`}
                                {...register('category')}
                                className="w-full p-3 border border-border rounded-lg bg-background-neutral focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        {error && <p className='text-status-error text-lg text-center'>{error}</p>}
                        <div className='border-t border-border p-6 flex items-center justify-around'>
                            <Link to='/' className='py-2 px-6 border rounded-md border-primary text-primary hover:text-accent hover:border-accent transition duration-300'>Cancelar</Link>
                            <button type='submit' className='bg-primary border border-accent py-2 px-6 rounded-md text-text-primary hover:bg-secondary transition duration-300 cursor-pointer'>
                                Editar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditExpense