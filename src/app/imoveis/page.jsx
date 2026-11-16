import { excluir, salvar } from '@actions/imoveis';
import Crud from '@components/Crud';
import { prisma } from '@lib/prisma';

const colunas = [
    { title: 'Tipo', dataIndex: 'tipo' },
    { title: 'Dono', dataIndex: 'dono' },
    { title: 'Endereco', dataIndex: 'endereco' },
    { title: 'Avaliacao', dataIndex: 'avaliacao' },
    { title: 'Valor', dataIndex: 'valor' },
    { title: 'Cliente', dataIndex: 'cliente_nome' },
]
export default async function Imoveis() {
    const [imoveis, clientes] = await Promise.all([
        prisma.imoveis.findMany({ orderBy: { tipo: 'asc' }, include: { clientes: true } }),
        prisma.clientes.findMany({ orderBy: { nome: 'asc' } }),
    ]);

    const registros = imoveis.map(({ clientes, ...imovel }) => ({ ...imovel, cliente_nome: clientes.nome }));

    const campos= [
        { name: 'tipo', label: 'Tipo' },
        { name: 'dono', label: 'Dono' },
        { name: 'endereco', label: 'Endereco' },
        { name: 'avaliacao', label: 'Avaliacao' },
        { name: 'valor', label: 'Valor' },
        { name: 'clientes_id', label: 'Cliente', opcoes: clientes.map((c) => ({ value: c.id, label: c.nome })) },
    ];

    return <Crud titulo='Imoveis' {...{ colunas, campos, registros, salvar, excluir }}
    />
}
