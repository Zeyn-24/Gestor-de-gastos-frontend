import { useEffect } from 'react'

export const useSEO = (title: string) => {
    useEffect(() => {
        document.title = `${title} | Gestor de Gastos`;
        document
            .querySelector('meta[name="description"]')
            ?.setAttribute('content', 'Gestor de Gastos. Crea, actualiza, elimina y Almacena tus gastos');
    }, [title]);
}
