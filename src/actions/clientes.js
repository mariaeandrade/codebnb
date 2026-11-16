'use server';

import { criptografar } from '@lib/cripto';
import { prisma } from '@lib/prisma';
import { revalidatePath } from 'next/cache';

export async function salvar({ id, ...dados }) {
    try {
        const data = { ...dados, cpf: criptografar(dados.cpf) };
        if (id) await prisma.clientes.update({ where: { id: Number(id) }, data });
        else await prisma.clientes.create({ data });
    } catch (e) {
        if (e.code === 'P2002') return { erro: 'CPF já cadastrado' };
        return { erro: 'Erro ao salvar o cliente' };
    }
    revalidatePath('/clientes');
}

export async function excluir(id) {
    try {
        await prisma.clientes.delete({ where: { id: Number(id) } });
    } catch (e) {
        if (e.code === 'P2003') return { erro: 'Cliente possui alugueis cadastrados' };
        return { erro: 'Erro ao excluir o cliente' };
    }
    revalidatePath('/clientes');
}