'use server';

import { prisma } from '@lib/prisma';
import { revalidatePath } from 'next/cache';

export async function salvar({ id, ...data }) {
    try {
        const imovel = { ...data, clientes_id: Number(data.clientes_id) };
        if (id) await prisma.imoveis.update({ where: { id: Number(id) }, data: imovel });
        else await prisma.imoveis.create({ data: imovel });
    } catch {
        return { erro: 'Erro ao salvar o imóvel' };
    }
    revalidatePath('/imoveis');
}

export async function excluir(id) {
    try {
        await prisma.imoveis.delete({ where: { id: Number(id) } });
    } catch (e) {
        if (e.code === 'P2003') return { erro: 'Imóvel possui aluguéis cadastrados' };
        return { erro: 'Erro ao excluir o imóvel' };
    }
    revalidatePath('/imoveis');
}