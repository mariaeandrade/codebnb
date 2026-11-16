import bcrypt from 'bcryptjs';

try {
    process.loadEnvFile();
} catch {
    console.error('   ❌ parceria ... arquivo .env não encontrado');
    process.exit(1);
}

const { criptografar } = await import('../src/lib/cripto.js');
const { prisma } = await import('../src/lib/prisma.js');

// para ter mais linhas no banco, acrescente mais objetos em cada lista/tabela
const dados = {
    usuario: [
        { nome: 'ana cremasco', senha: bcrypt.hashSync('amods', 10) },
        { nome: 'daniel casalli', senha: bcrypt.hashSync('admin123', 10) },
        { nome: 'gustavo victor', senha: bcrypt.hashSync('amods123', 10) }
    ],
    clientes: [
        { nome: 'ana', cpf: criptografar('123.456.789-01') },
        { nome: 'daniel', cpf: criptografar('125.456.789-01') },
        { nome: 'gustavp', cpf: criptografar('126.456.789-01') }
    ],
    imoveis: [
        { tipo: 'Quarto', dono: 'Maria Eduarda', endereco: 'Ubatuba, rua A 123', avaliacao: '5.0', valor: '5000.00', clientes_id: 1 },
        { tipo: 'Apartamento', dono: 'Maria Eduarda', endereco: 'Copacabana, rua B 456', avaliacao: '5.0', valor: '20000.00', clientes_id: 1 },
        { tipo: 'Casa', dono: 'Maria Eduarda', endereco: 'Belo Horizonte, rua C 789', avaliacao: '5.0', valor: '12000.00', clientes_id: 1 }
    ],
    alugueis: [
        { data: new Date('2026-11-10'), imoveis_id: 1 },
        { data: new Date('2026-11-12'), imoveis_id: 2 },
        { data: new Date('2026-11-16'), imoveis_id: 3 }
    ],
};

const tabelas = Object.keys(dados).reverse().join(', ');
await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tabelas} RESTART IDENTITY CASCADE`);
console.log('   🧹 registros anteriores apagados (ids reiniciados)');

for (const [tabela, data] of Object.entries(dados)) {
    const { count } = await prisma[tabela].createMany({ data });
    console.log(`   ✅ ${tabela}: ${count} registros`);
}

await prisma.$disconnect();
