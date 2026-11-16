import { excluir, salvar } from '@actions/alugueis';
import Crud from '@components/Crud';
import { descriptografar } from '@lib/cripto';
import { prisma } from '@lib/prisma';

const colunas = [
    { title: 'Data', dataIndex: 'agendamento' },
    { title: 'Tipo', dataIndex: 'tipo' },
    { title: 'Dono', dataIndex: 'dono' },
    { title: 'Endereco', dataIndex: 'endereco' },
    { title: 'Avaliacao', dataIndex: 'avaliacao' },
    { title: 'Valor', dataIndex: 'valor' },
];

export default async function Alugueis() {
    const [alugueis, imoveis] = await Promise.all([
        prisma.alugueis.findMany({
            orderBy: { data: 'asc'},
            include: { imoveis: { include: { clientes: true } } },
        }),
        prisma.imoveis.findMany({ orderBy: { tipo: 'asc' } }),
    ]);

    const registros = alugueis.map(({ id, data, imoveis }) => ({
        id,
        agendamento: data.toISOString().slice(0,10),
        tipo: imoveis.tipo,
        dono: imoveis.dono,
        endereco: imoveis.endereco,
        avaliacao: imoveis.avaliacao.toString(),
        valor: imoveis.valor.toString(),
        cliente_nome: imoveis.clientes.nome,
        cliente_cpf: descriptografar(imoveis.clientes.cpf),
    }));

    const campos = [
        {name: 'data', label: 'Data', tipo: 'date'},
        {name: 'imoveis_id',
            label: 'Imovel',
            opcoes: imoveis.map((i) => ({value: i.id, label: `${i.tipo} (${i.dono})`})),
        },
    ];

    return <Crud titulo="Alugueis" {...{colunas, campos, registros, salvar, excluir}} />;
}
