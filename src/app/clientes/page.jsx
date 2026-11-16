import { excluir, salvar } from '@actions/clientes.js';
import Crud from '@components/Crud';
import { descriptografar } from '@lib/cripto';
import { prisma } from '@lib/prisma';

const colunas = [
    {title: 'Nome', dataIndex: 'nome'},
    {title: 'CPF', dataIndex: 'cpf'},
];

const campos = [
    {name: 'nome', label: 'Nome'},
    {name: 'cpf', label: 'CPF'},
]

export default async function Clientes({ searchParams }) {
    const {busca = ''} = await searchParams;
    const termo = busca.toLowerCase();

    const clientes = await prisma.clientes.findMany({orderBy: {nome: 'asc'} });
    const registros = clientes.map((cliente) => ({...cliente, cpf: descriptografar(cliente.cpf)})).filter(
        (cliente) => cliente.nome.toLowerCase().includes(termo) || cliente.cpf.includes(termo),
    );

    return <Crud titulo='Clientes' {...{colunas, campos, registros, salvar, excluir, busca}} />;
}
